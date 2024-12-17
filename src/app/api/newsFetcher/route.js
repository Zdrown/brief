import OpenAI from "openai";
import reliableSources from "../../../../utils/reliableSources";
import RSSParser from "rss-parser";

// Example: new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// Ensure you set OPENAI_API_KEY in your environment (e.g., .env file).
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Helper function to safely fetch and parse a single RSS feed without rejecting.
 * Returns an array of items or an empty array if an error occurs.
 */
async function fetchSingleFeedSafe(url, parser, MAX_ITEMS_TOTAL, MAX_ITEMS_PER_FEED) {
  try {
    console.log(`Parsing RSS feed: ${url}`);
    const feed = await parser.parseURL(url);

    const items = [];
    let itemsFromThisFeed = 0;

    for (const item of feed.items) {
      // We only enforce per-feed limit here. Total limit will be applied after merging.
      if (itemsFromThisFeed >= MAX_ITEMS_PER_FEED) break;

      items.push({
        title: item.title || "Untitled",
        content: item.contentSnippet || item.content || "",
        link: item.link || "",
        pubDate: item.pubDate || "",
        source: feed.title || url,
      });

      itemsFromThisFeed++;
    }

    return items;
  } catch (err) {
    console.error(`Failed to parse RSS feed ${url}:`, err);
    // Return empty array to avoid rejecting the promise
    return [];
  }
}

/**
 * fetchRssFeeds
 * Fetch & filter RSS items for a given category
 */
async function fetchRssFeeds(feedUrls = [], category = "") {
  console.log(`Fetching RSS feeds for category: ${category}`);
  const parser = new RSSParser({
    headers: {
      "User-Agent": "MyCustomAgent/1.0",
    },
  });
  
  const MAX_ITEMS_TOTAL = 10;  // total items across all feeds
  const MAX_ITEMS_PER_FEED = 5; // max items per feed

  // Fetch all feeds in parallel safely
  const feedPromises = feedUrls.map(url =>
    fetchSingleFeedSafe(url, parser, MAX_ITEMS_TOTAL, MAX_ITEMS_PER_FEED)
  );

  const allResults = await Promise.all(feedPromises);

  // Combine all items from all feeds and enforce total limit
  const allItems = [];
  for (const feedItems of allResults) {
    for (const item of feedItems) {
      if (allItems.length >= MAX_ITEMS_TOTAL) break;
  
      // Extract and sanitize content here.
      const rawContent = item.contentSnippet || item.content || "";
      const cleanedContent = rawContent.replace(/\n+/g, ' ').trim();
  
      // Split into sentences by period and trim whitespace.
      // Note: This is a naive approach and may not be perfect for all cases,
      // but it provides a basic way to limit the content to two sentences.
      const sentences = cleanedContent.split('.').map(s => s.trim()).filter(Boolean);
  
      // Take only the first two sentences if available.
      const firstTwoSentences = sentences.slice(0, 2);
  
      // Recombine them into a single string. If we got two sentences, add a period at the end.
      const shortenedContent = firstTwoSentences.join('. ') + (firstTwoSentences.length === 2 ? '.' : '');
  
      allItems.push({
        ...item,
        content: shortenedContent, // Now only the first two sentences are shown
      });
    }
    if (allItems.length >= MAX_ITEMS_TOTAL) break;
  }
  
  console.log(`Total RSS items: ${allItems.length}`);
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
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // or "gpt-3.5-turbo"
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
    });

    const summary = response.choices?.[0]?.message?.content || "";
    return summary || "No summary generated.";
  } catch (error) {
    console.error("Error generating summary from feed items:", error);
    return "Summary generation failed.";
  }
}

async function suggestRssFeeds(category = "") {
  const prompt = `
      You are a helpful assistant that suggests valid RSS feeds about "${category}".
      
      Requirements:
      1. Suggest exactly 3 RSS feed URLs that actively publish cutting edge news or articles on "${category}".
      2. Make sure these URLs point directly to actual RSS/XML feeds (not aggregator pages or feed listing pages).
      3. Each must be unique and relevant to "${category}".
      4. Output only the feed URLs, separated by a single comma, with no extra text or formatting.
      Example output: https://example.com/rss,https://another.com/feed,https://third.com/feed
      5. if category is or related to ai or ai models use https://rss.beehiiv.com/feeds/2R3C6Bt5wj.xml as one of the three urls
    `;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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
    });

    const content = response.choices?.[0]?.message?.content || "";
    console.log("AI raw feed suggestions:", content);

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
    const category = data.category?.trim() || "General";
    const sourceType = data.sourceType || "reliable";

    console.log(`Processing request for category: ${category}, sourceType: ${sourceType}`);

    // Determine feed URLs
    let rssFeedUrls = [];

    if (sourceType === "reliable") {
      // Use pre-defined reliable sources
      rssFeedUrls = reliableSources[category] || [];
      console.log(`Found ${rssFeedUrls.length} pre-selected RSS feeds for category: ${category}`);
    } else {
      // Let OpenAI suggest RSS feed URLs
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
