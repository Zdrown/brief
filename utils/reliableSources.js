const reliableSources = {
    Technology: [
      "https://techcrunch.com/feed/",
      "https://thenextweb.com/feed/",
    ],
    Health: [
        "https://kffhealthnews.org/feed/",
        "https://medicalxpress.com/rss-feed",
    ],
    Sports: [
      "https://www.espn.com/espn/rss/news",
      "https://sports.yahoo.com/rss/",
    ],
    Entertainment: [
      "https://variety.com/feed/",
      "https://www.hollywoodreporter.com/c/news/rss",
    ],
    WorldNews: [
      "https://feeds.npr.org/1004/rss.xml",
      "https://feeds.bbci.co.uk/news/world/rss.xml",

    ],
    Finance: [
      "https://seekingalpha.com/feed.xml",
      "https://fortune.com/feed/fortune-feeds/?id=3230629"// could be broken check this - skeptidc about the id 
    ]
  };
  
  export const getReliableSourcesForCategory = (category) => {
    return reliableSources[category] || [];
  };
  
  export default reliableSources;
  