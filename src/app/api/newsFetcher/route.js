import OpenAI from "openai";
import reliableSources from "../../../../utils/reliableSources";
import RSSParser from "rss-parser";

// Example: new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// Ensure you set OPENAI_API_KEY in your environment (e.g., .env file).
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      if (!this.processing) {
        this.processNext();
      }
    });
  }

  async processNext() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }
    this.processing = true;

    const { fn, resolve, reject } = this.queue.shift();
    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      setTimeout(() => this.processNext(), 500);
    }
  }
}

const aiRequestQueue = new RequestQueue();

/**
 * fetchRssFeeds
 * Fetch & filter RSS items for a given category
 */
async function fetchRssFeeds(feedUrls = [], category = "") {
  console.log(`Fetching RSS feeds for category: ${category}`);
  const parser = new RSSParser();
  let allItems = [];

  for (const url of feedUrls) {
    try {
      console.log(`Parsing RSS feed: ${url}`);
      const feed = await parser.parseURL(url);

      for (const item of feed.items) {
        allItems.push({
          title: item.title || "Untitled",
          content: item.contentSnippet || item.content || "",
          link: item.link || "",
          pubDate: item.pubDate || "",
          source: feed.title || url,
        });
      }
    } catch (err) {
      console.error(`Failed to parse RSS feed ${url}:`, err);
    }
  }

  // Optional filter: naive approach to match 'category' in content or title
  const lowerCat = category.toLowerCase();
  allItems = allItems.filter((item) => {
    const text = `${item.title} ${item.content}`.toLowerCase();
    return text.includes(lowerCat);
  });

  console.log(`Total RSS items after filtering: ${allItems.length}`);
  return allItems;
}

/**
 * generateSummary
 * Summarize the RSS feed items using OpenAI Chat
 */
async function generateSummary(items = [], category = "") {
  if (!items.length) {
    return "No relevant feed items found.";
  }

  const prompt = `
  Create a comprehensive summary of these RSS feed items about "${category}":
  ${items.map(item => `
  Title: ${item.title}
  Content: ${item.content}
  Source: ${item.source}
  PubDate: ${item.pubDate}
  `).join("\n\n")}
  
  Provide a well-structured summary that:
  1. Highlights key themes and developments
  2. Notes any conflicting information
  3. Identifies trends or patterns
  4. Maintains proper context
  5. Uses only text and punctuation and no other symbols.
  7. Doesnt refrence the rss feed but treats these a one summary covering recent state of news for this category.
  `;

  try {
    const response = await aiRequestQueue.add(() => 
      openai.chat.completions.create({
        model: "gpt-4o", // or "gpt-3.5-turbo", or any other
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes RSS items."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      })
    );

    const summary = response.choices?.[0]?.message?.content || "";
    return summary || "No summary generated.";
  } catch (error) {
    console.error("Error generating summary from feed items:", error);
    return "Summary generation failed.";
  }
}

async function suggestRssFeeds(category = "") {
  const prompt = `Suggest exactly 2 reliable RSS feed URLs for the category "${category}". 
  Output only the URLs separated by a comma, like: https://example.com/rss,https://another.com/feed`;

  try {
    const response = await aiRequestQueue.add(() =>
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that suggests RSS feeds."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      })
    );

    const content = response.choices?.[0]?.message?.content || "";
    console.log("AI raw feed suggestions:", content);

    // Try to parse URLs from the returned text
    // E.g. "https://rss.cnn.com/rss/edition_world.rss,https://feeds.bbci.co.uk/news/rss.xml"
    const rssFeedUrls = content
      .split(",")
      .map((feed) => feed.trim())
      .filter((feed) => feed.startsWith("http"));

    return rssFeedUrls;
  } catch (error) {
    console.error(`Error suggesting RSS feeds for ${category}:`, error);
    return [];
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const  category = data.category?.trim() || "General";
    const sourceType = data.sourceType || "reliable";

    console.log(`Processing request for category: ${category}, sourceType: ${sourceType}`);

    // Determine feed URLs
    let rssFeedUrls = [];

    if (sourceType === "reliable") {
      // Use pre-defined reliable sources
      rssFeedUrls = reliableSources[category] || [];
      console.log(`Found ${rssFeedUrls.length} pre-selected RSS feeds for category: ${category}`);
    } else {
      // Let OpenAI suggest 2 RSS feed URLs
      const aiUrls = await suggestRssFeeds(category);

      if (aiUrls.length > 0) {
        rssFeedUrls = aiUrls;
      } else {
        console.warn("AI returned no RSS URLs; using fallback...");
        rssFeedUrls = [
          "https://rss.cnn.com/rss/edition_world.rss",
          "https://feeds.bbci.co.uk/news/rss.xml",
        ];
      }
      console.log(`RSS feed URLs for ${category}:`, rssFeedUrls);
    }

    if (!rssFeedUrls.length) {
      console.log(`No RSS feeds found for category: ${category}`);
      return Response.json(
        {
          error: `No RSS feeds found for category: ${category}`,
          status: "error",
          timestamp: new Date().toISOString(),
          category,
          sourceType,
          details: "Could not find or generate RSS feed URLs",
        },
        { status: 404 }
      );
    }

    // 1. Fetch & parse RSS items
    const feedItems = await fetchRssFeeds(rssFeedUrls, category);

    if (!feedItems || !feedItems.length) {
      return Response.json(
        {
          error: `No relevant feed items found for ${category}`,
          status: "warning",
          timestamp: new Date().toISOString(),
          metadata: {
            feedsCount: rssFeedUrls.length,
            itemsFound: 0,
            category,
            sourceType,
          },
        },
        { status: 200 }
      );
    }

    // 2. Generate summary from feed items
    console.log(`Found ${feedItems.length} relevant items for '${category}', generating summary...`);
    const summary = await generateSummary(feedItems, category);

    // 3. Return final JSON
    const finalResponse = {
      summary,
      items: feedItems,
      metadata: {
        feedsCount: rssFeedUrls.length,
        itemsFound: feedItems.length,
        timestamp: new Date().toISOString(),
        category,
        sourceType,
      },
    };

    console.log("Final JSON payload:", finalResponse);

    return Response.json(finalResponse, { status: 200 });
  } catch (error) {
    console.error("Error in RSS-based OpenAI route:", error);
    return Response.json(
      {
        error: error.message || "An unexpected error occurred",
        status: "error",
        timestamp: new Date().toISOString(),
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
