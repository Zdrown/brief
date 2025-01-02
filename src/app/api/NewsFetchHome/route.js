// src/app/api/NewsFetchHome/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";
import RSSParser from "rss-parser";
import reliableSourcesHomePage from "utils/reliableSourcesHomePage"; // adjust path

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Fetch a single feed safely
async function fetchSingleFeedSafe(url, parser, MAX_ITEMS_PER_FEED) {
  try {
    console.log(`Parsing RSS feed: ${url}`);
    const feed = await parser.parseURL(url);

const  items = [];
    for (const item of feed.items) {
      if (items.length >= MAX_ITEMS_PER_FEED) break;

      items.push({
        title: item.title || "Untitled",
        content: item.contentSnippet || item.content || "",
        link: item.link || "",
        pubDate: item.pubDate || "",
        source: feed.title || url,
      });
    }
    return items;
  } catch (err) {
    console.error(`Failed to parse RSS feed ${url}:`, err);
    return [];
  }
}

async function fetchRssFeeds(feedUrls = []) {
  const parser = new RSSParser({
    headers: {
      "User-Agent": "MyCustomAgent/1.0",
    },
  });

  const MAX_ITEMS_TOTAL = 5;
  const MAX_ITEMS_PER_FEED = 3;

  // Fetch all in parallel
  const feedPromises = feedUrls.map((url) =>
    fetchSingleFeedSafe(url, parser, MAX_ITEMS_PER_FEED)
  );

  const results = await Promise.all(feedPromises);

  const allItems = [];
  for (const feedItems of results) {
    for (const item of feedItems) {
      if (allItems.length >= MAX_ITEMS_TOTAL) break;

      const rawContent = item.content || "";
      const cleanedContent = rawContent.replace(/\n+/g, " ").trim();

      // Two-sentence preview
      const sentences = cleanedContent
        .split(".")
        .map((s) => s.trim())
        .filter(Boolean);
      const firstTwo =
        sentences.slice(0, 2).join(". ") + (sentences.length >= 2 ? "." : "");

      allItems.push({
        ...item,
        fullContent: cleanedContent,
        previewContent: firstTwo,
      });
    }
    if (allItems.length >= MAX_ITEMS_TOTAL) break;
  }
  return allItems;
}

async function generateSummary(items = [], category = "") {
  if (!items.length) {
    return "No relevant feed items found.";
  }

  const prompt = `
    Create a comprehensive summary of these RSS feed items about "${category}":
    ${items
      .map(
        (item) => `
      Title: ${item.title}
      Content: ${item.fullContent}
      Source: ${item.source}
      PubDate: ${item.pubDate}
    `
      )
      .join("\n")}

    Provide a well-structured summary that:
    1. Highlights key themes and developments
    2. Notes any conflicting information
    3. Identifies trends or patterns
    4. Maintains proper context
    5. Uses only text and punctuation and no other symbols.
    6. Doesn't reference the RSS feed, but treats these as one summary covering the recent state of news for this category.
    7. Is written in well-separated paragraphs.
    8. Is thorough while remaining succinct.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // or "gpt-4" if you have access
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes RSS items.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices?.[0]?.message?.content || "No summary generated.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Summary generation failed.";
  }
}

async function suggestRssFeeds(category) {
  const prompt = `
    You are a helpful assistant that suggests valid RSS feeds about "${category}".
    
    Requirements:
    1. Suggest exactly 11 RSS feed URLs that actively publish cutting edge news on "${category}".
    2. Make sure these are direct RSS/XML feeds (not aggregator pages).
    3. Each must be unique and relevant.
    4. Output only the feed URLs, separated by commas, with no extra text.
    5. If the topic contains "ai" or "ai models" use https://rss.beehiiv.com/feeds/2R3C6Bt5wj.xml as one feed.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that suggests RSS feeds.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content || "";
    const rssFeedUrls = content
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.startsWith("http"));

    return rssFeedUrls;
  } catch (error) {
    console.error("Error suggesting RSS feeds:", error);
    return [];
  }
}

/**
 * Named export for the POST method in App Router
 */
export async function POST(request) {
  try {
    // Parse the incoming JSON body
    const data = await request.json();
    const { category = "TopHeadlines", sourceType = "reliable" } = data;

    console.log(`Processing request for category: ${category}, sourceType: ${sourceType}`);

    // 1. Determine feeds
    let rssFeedUrls = [];
    if (sourceType === "reliable") {
      rssFeedUrls = reliableSourcesHomePage[category] || [];
      console.log(`Found ${rssFeedUrls.length} reliable RSS feeds for ${category}`);
    } else {
      // AI-suggested
      rssFeedUrls = await suggestRssFeeds(category);
      if (!rssFeedUrls.length) {
        console.warn("AI returned no RSS URLs; using fallback...");
        rssFeedUrls = [
          "https://rss.cnn.com/rss/edition_world.rss",
          "https://feeds.bbci.co.uk/news/rss.xml",
        ];
      }
    }

    if (!rssFeedUrls.length) {
      return NextResponse.json(
        {
          error: `No RSS feeds found for category: ${category}`,
          status: "error",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // 2. Fetch & parse items
    const feedItems = await fetchRssFeeds(rssFeedUrls);
    if (!feedItems.length) {
      return NextResponse.json(
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

    // 3. Summarize
    const summary = await generateSummary(feedItems, category);

    // 4. Format items for the frontend
    const finalItems = feedItems.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      source: item.source,
      content: item.previewContent, // 2-sentence snippet
    }));

    // 5. Return the response
    const finalResponse = {
      summary,
      items: finalItems,
      metadata: {
        feedsCount: rssFeedUrls.length,
        itemsFound: finalItems.length,
        timestamp: new Date().toISOString(),
        category,
        sourceType,
      },
    };

    console.log("Final JSON payload:", finalResponse);
    return NextResponse.json(finalResponse, { status: 200 });
  } catch (error) {
    console.error("Error in NewsFetchHome POST route:", error);
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred",
        status: "error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
