const reliableSourcesHomePage = {
    Technology: [
      "https://techcrunch.com/feed/",
      "https://thenextweb.com/feed/",
    ],
    Health: [
        "https://kffhealthnews.org/feed/",
        "https://medicalxpress.com/rss-feed",
    ],

    Entertainment: [
      "https://variety.com/feed/",
      "https://www.hollywoodreporter.com/c/news/rss",
    ],
    WorldNews: [
      "https://feeds.npr.org/1004/rss.xml",
      "https://feeds.bbci.co.uk/news/world/rss.xml",

    ],
    TopHeadlines: [
      "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
      "https://www.reuters.com/rssFeed/topNews"// could be broken check this - skeptidc about the id 
    ]
  };
  
  export const getReliableSourcesHomePageForCategory = (category) => {
    return reliableSources[category] || [];
  };
  
  export default reliableSourcesHomePage;
  