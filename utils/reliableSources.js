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
  };
  
  export const getReliableSourcesForCategory = (category) => {
    return reliableSources[category] || [];
  };
  
  export default reliableSources;
  