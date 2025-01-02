"use client"; // Important for client features in Next.js 13+

import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import ApiPage from "./components/ApiForDevs";

// Icons
import {
  FaGlobeAmericas,
  FaNewspaper,
  FaMicrochip,
  FaFilm,
  FaHeartbeat,
} from "react-icons/fa";
import { RiPlayCircleLine, RiPauseCircleLine } from "react-icons/ri";

// Our custom dropdown that picks a voice
import Dropdown from "./components/DropDownMenuHome";

/* ------------------ HERO (WITH VIDEO) ------------------ */
const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 15vh;
  overflow: hidden;
  display: flex;
`;

const VideoBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/* ------------------ HERO INFO SECTION ------------------ */
const HeroInfoSection = styled.section`
  background-color: ${({ theme }) => theme?.backgrounds?.secondary || "#fff"};
  text-align: center;
  padding: 2rem 1rem;
  padding-top: 6rem;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  margin-top: 2.7rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme?.colors?.darkBlue || "#333"};
`;

const Description = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 2rem;
  font-weight: 500;
  color: ${({ theme }) => theme?.colors?.tan || "#555"};
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  

`;

const SearchInput = styled.input`
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  border: 1px solid #333;
  font-size: 0.9rem;
  outline: none;
  width: 300px; /* <-- Increase this from 160px to 300px or more */
  &:focus {
    border-color: ${({ theme }) => theme?.colors?.darkBlue || "#333"};
  }
`;

const SearchButton = styled.button`
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme?.colors?.darkBlue || "#333"};
  background-color: #fff;
  color: ${({ theme }) => theme?.colors?.darkBlue || "#333"};
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: ${({ theme }) => theme?.colors?.darkBlue || "#333"};
    color: #fff;
  }
`;


const CallToAction = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: ${({ theme }) => theme?.text?.primary || "#fff"};
  background-color: ${({ theme }) => theme?.colors?.darkBlue || "#333"};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${({ theme }) => theme?.colors?.tan || "#bbb"};
  }
`;

/* ------------------ MAIN PAGE CONTAINER ------------------ */
const HomePageContainer = styled.div`
  background-color: ${({ theme }) => theme?.backgrounds?.secondary || "#fff"};
  min-height: calc(100vh - 9rem);
  display: flex;
  flex-direction: column;
  padding-top: 100px;
`;

/* ------------------ GRAY WRAPPER ------------------ */
const GrayCardWrapper = styled.div`
  background-color: #e1e3e4;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: center;
  margin: 2rem auto;
  width: 90%;
  max-width: 1000px;
  margin-top: 5rem;
  overflow: visible; /* ensure expansions/dropdowns can extend */
`;

const ArticleTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme?.colors?.darkBlue || "#333"};
`;

/* ------------------ FEATURE BOX ------------------ */
const FeatureBox = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme?.colors?.offWhite || "#fff"};
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  overflow: visible;
  max-height: 650px;
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
`;

/* ------------------ TOP FEATURES ROW ------------------ */
const TopFeaturesRow = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  padding: 2rem 2rem;
  border-bottom: 1px solid #ddd;
  flex-wrap: nowrap;

   @media (max-width: 768px) {
    flex-wrap: wrap;
`;

const FeatureButton = styled.button`
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme?.colors?.darkBlue || "#333"};
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  color: ${({ theme }) => theme?.colors?.darkBlue || "#333"};

  &:hover {
    background-color: ${({ theme }) => theme?.colors?.darkBlue || "#333"};
    color: #fff;
  }

  ${({ $isActive, theme }) =>
    $isActive &&
    `
      background-color: ${theme?.colors?.darkBlue || "#333"};
      color: #fff;
    `}
`;

/* ------------------ MAIN CONTENT ------------------ */
const MainContent = styled.div`
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

/* TWO-COLUMN LAYOUT */
const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: flex-start;
  margin-top: 1rem;
`;

const LeftColumn = styled.div`
   // Make it fill the entire area
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
`;

const ButtonsRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  justify-content: flex-start;
`;

/* SUMMARY BOX */
const ArticlePreview = styled.div`
  background-color: ${({ theme }) => theme?.backgrounds?.secondary || "#f3f4f6"};
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 120px;
  line-height: 1.4;
  padding: 1.2rem;
`;

const ArticlePreviewText = styled.div`
  color: ${({ theme }) => theme?.colors?.darkBlue || "#333"};
  font-size: 1rem;
`;

/* GENERIC BUTTON */
const SmallButton = styled.button`
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme?.colors?.darkBlue || "#333"};
  background-color: #fff;
  color: ${({ theme }) => theme?.colors?.darkBlue || "#333"};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme?.colors?.darkBlue || "#333"};
    color: #fff;
  }
`;

const HrDivider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 1.5rem 0;
`;

/* ----------- The row for "Currently Viewing" + optional audio button ------- */
const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; /* spacing between category text and play button */
`;

const CategoryAudioButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.6rem;
  border-radius: 12px;
  border: 1px solid #333;
  background: #fff;
  cursor: pointer;
  font-size: 0.85rem;
  color: #333;

  &:hover {
    background: #333;
    color: #fff;
  }
`;

/* ------------------ FOOTER ------------------ */
const BoxFooter = styled.div`
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) =>
    theme?.backgrounds?.secondary || "#f3f4f6"};
  border-top: 1px solid #ddd;
`;

const FooterText = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme?.text?.secondary || "#333"};
`;

const FooterButton = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  background-color: ${({ theme }) => theme?.colors?.darkBlue || "#333"};
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background-color: ${({ theme }) => theme?.colors?.tan || "#bbb"};
    color: #333;
  }
`;

/* ------------------ ARTICLES & EXPANSION ------------------ */
const ArticleCard = styled.div`
  position: relative;
  flex: 0 0 220px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: max-height 0.4s ease;
  max-height: 130px;
  padding: 0.8rem;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;

  overflow: hidden;

  &.expanded {
    max-height: 100px;
    overflow: visible;
  }
`;

const DropdownArrow = styled.div`
  position: absolute;
  top: 4px;
  right: 6px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  user-select: none;
  z-index: 10;
  transition: transform 0.3s ease;

  &:before {
    content: "▼";
    position: absolute;
    top: 0;
    left: 0;
    font-size: 14px;
    color: ${({ theme }) => theme?.colors?.darkBlue || "#333"};
  }
`;

const CardExpansion = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 9999;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  padding: 0.8rem;
  font-size: 0.85rem;
  color: #333;
`;

const ExtendedContent = styled.p`
  margin: 0;
`;

const ExpandedArticleCard = styled(ArticleCard)`
  &.expanded ${CardExpansion} {
    display: block;
  }
  &.expanded ${DropdownArrow} {
    transform: rotate(180deg);
  }
`;

export default function Page() {
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const [summary, setSummary] = useState("With Brief, get real-time news in any category, read by Al voices. Set time limits, trim or expand articles, or enjoy them in podcast style.");
  const [articles, setArticles] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("TopHeadlines");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [briefFetched, setBriefFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Voice selection & audio
  const [selectedVoice, setSelectedVoice] = useState("ZACH");
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(null); // -1 => summary
  const [sources, setSources] = useState([]);


  // Top feature buttons
  const topFeatures = [
    { label: "TopHeadlines", icon: FaNewspaper },
    { label: "WorldNews", icon: FaGlobeAmericas },
    { label: "Technology", icon: FaMicrochip },
    { label: "Entertainment", icon: FaFilm },
    { label: "Health", icon: FaHeartbeat },
  ];

  function handleNavigation() {
    router.push("/Categories");
  }




  function handleFeatureClick(i, feat) {
    setActiveIndex(i);
    setSources([]);
    setCurrentCategory(feat.label);
    setSummary("Please click 'Fetch My Brief' to load articles...");
    setArticles([]);
    setBriefFetched(false);
    setExpandedIndex(null);
    resetAudio();
  }
  function truncateAtNextWord(text, maxLength = 300) {
    // If text is already shorter, no need to truncate
    if (!text || text.length <= maxLength) return text;
  
    // 1) Temporarily slice at maxLength
    let slicePoint = maxLength;
  
    // 2) Find the next space after maxLength
    //    This returns -1 if no space is found (meaning there's no space after 300 chars).
    const nextSpaceIndex = text.indexOf(" ", slicePoint);
  
    // 3) If we find a space, we move slicePoint to that space.
    //    Otherwise, just stick to maxLength if no space is found.
    if (nextSpaceIndex !== -1) {
      slicePoint = nextSpaceIndex;
    }
  
    // 4) Return the truncated portion, with ellipsis
    return `${text.slice(0, slicePoint).trimEnd()}...`;

  }
  

  // Summaries in the left box
  async function handlePlayPauseSummary() {
    if (playingIndex === -1) {
      // Already playing => pause
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingIndex(null);
      return;
    }

    // Not playing => fetch TTS for the summary text
    resetAudio();
    try {
      // Unified route => /api/tts
      const text = summary;
      const ttsRes = await fetch("/api/ttsHome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voiceName: selectedVoice, // pass the chosen voice
        }),
      });
      if (!ttsRes.ok) {
        throw new Error(`TTS request failed: ${ttsRes.status}`);
      }
      const audioBlob = await ttsRes.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current.src = audioUrl;
      await audioRef.current.play();
      setIsPlaying(true);
      setPlayingIndex(-1); // means summary is playing
    } catch (error) {
      console.error("Audio error:", error);
    }
  }

  async function handleFetchBrief() {
    try {
      setSummary("Loading brief...");
      const res = await fetch("/api/NewsFetchHome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: currentCategory,
          sourceType: "reliable",
        }),
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("API response:", data);

     // 1) Build uniqueSources
const uniqueSources = [];
const items = data.items || [];

for (const item of items) {
  const sourceName = item.source?.trim() || null;
  const sourceLink = item.link?.trim() || null;
  if (!sourceName || !sourceLink) continue;

  // Deduplicate by sourceName
  const alreadyExists = uniqueSources.some(
    (srcObj) => srcObj.sourceName === sourceName
  );
  if (!alreadyExists) {
    uniqueSources.push({ sourceName, sourceLink });
  }
}

// 2) Truncate summary
const truncatedSummary = truncateAtNextWord(data.summary, 300);


// 3) *Only once*, append the "..." item, then setSources
uniqueSources.push({ sourceName: "...", sourceLink: "/about" });
setSources(uniqueSources);

      
      
      setSummary(truncatedSummary); // keep an array of { sourceName, sourceLink } in state
      setArticles(data.items || []);
      setExpandedIndex(null);
      setBriefFetched(true);
      resetAudio();
    } catch (err) {
      console.error("Error fetching RSS:", err);
      setSummary("Error fetching RSS feeds. Please try again.");
      setArticles([]);
      setBriefFetched(false);
      setExpandedIndex(null);
      resetAudio();
    }
  }

  function toggleCardExpansion(idx) {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  }



  async function handleSearch() {
    const userQuery = searchTerm.trim();
    if (!userQuery) {
      alert("Please enter a topic or term to search.");
      return;
    }

    // You can decide if typed queries are "ai" or "reliable." 
    // Let's assume we do "ai" so it calls your AI-based feed suggestion:
    const chosenSourceType = "ai"; // or "reliable"

    // We update currentCategory to the userQuery to keep UI consistent
    setSummary("Loading brief...");
    setSources([]);
    setCurrentCategory(userQuery);
    setArticles([]);
    setBriefFetched(false);
    setExpandedIndex(null);
    resetAudio();

    // Now do your normal fetch
    try {
      const res = await fetch("/api/NewsFetchHome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: userQuery, // use the typed term
          sourceType: "ai",
        }),
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("Search-based API response:", data);

      // 1) After receiving `data` from the API call...
// Suppose data.items looks like:
// [
//   { source: "BBC News", link: "https://www.bbc.co.uk/news/...", ... },
//   { source: "CNN", link: "https://www.cnn.com/...", ... },
//   ...
// ]

// Create an empty array for dynamically generated sources
const uniqueSources = [];
const items = data.items || [];

for (const item of items) {
  const sourceName = item.source?.trim() || null;
  const sourceLink = item.link?.trim() || null;
  if (!sourceName || !sourceLink) continue;

  // Deduplicate by sourceName
  const alreadyExists = uniqueSources.some(
    (srcObj) => srcObj.sourceName === sourceName
  );
  if (!alreadyExists) {
    uniqueSources.push({ sourceName, sourceLink });
  }
}

// 2) Truncate summary
const truncatedSummary = truncateAtNextWord(data.summary, 300);
setSummary(truncatedSummary);

// 3) *Only once*, append the "..." item, then setSources
uniqueSources.push({ sourceName: "...", sourceLink: "/about" });
setSources(uniqueSources);
// keep an array of { sourceName, sourceLink } in state
setArticles(data.items || []);
setBriefFetched(true);
} catch (err) {
  console.error("Error searching RSS:", err);
  setSummary("Error searching feeds. Please try again.");
  setArticles([]);
  setBriefFetched(false);
} // <--- The catch block now closes properly

// This closes the handleSearch() function
}
    
  // Stop & clear audio
  function resetAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setIsPlaying(false);
    setPlayingIndex(null);
  
  }

  // Called when user clicks "Play" on an article snippet
  async function handleToggleAudio(idx, text) {
    if (playingIndex === idx) {
      // Already playing => pause
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingIndex(null)
      return;
    }

    // Not playing => fetch TTS for this article
    resetAudio();
    try {
      const ttsRes = await fetch("/api/ttsHome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voiceName: selectedVoice, // pass the chosen voice
        }),
      });
      if (!ttsRes.ok) {
        throw new Error(`TTS request failed: ${ttsRes.status}`);
      }
      const audioBlob = await ttsRes.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current.src = audioUrl;
      await audioRef.current.play();
      setIsPlaying(true);
      setPlayingIndex(idx);
    } catch (error) {
      console.error("Audio error:", error);
    }
  }

  function handleAudioEnded() {
    setIsPlaying(false);
    setPlayingIndex(null);
  }

  return (
    <>
      {/* 1) VIDEO HERO */}
      <HeroSection>
        <VideoBackground>
          <video autoPlay muted loop>
            <source src="/BriefVideo2.mp4" type="video/mp4" />
          </video>
        </VideoBackground>
      </HeroSection>

      {/* 2) HERO INFO SECTION */}
      <HeroInfoSection>
        <HeroContent>
          <Title>Welcome to brief.</Title>
          <Description>
            brief. is your go-to application for concise and personalized updates.
            Get your daily briefings, manage categories, and stay informed effortlessly.
          </Description>
          <CallToAction onClick={handleNavigation}>Get Started</CallToAction>
        </HeroContent>
      </HeroInfoSection>

      {/* 3) MAIN PAGE WRAPPER */}
      <HomePageContainer>
        {/* 4) GRAY WRAPPER with FeatureBox */}
        <GrayCardWrapper>
          <FeatureBox>
            {/* 1) Top feature buttons */}
            <TopFeaturesRow>
              {topFeatures.map((feat, i) => {
                const IconComponent = feat.icon;
                return (
                  <FeatureButton
                    key={feat.label}
                    $isActive={i === activeIndex}
                    onClick={() => handleFeatureClick(i, feat)}
                  >
                    <IconComponent style={{ marginRight: "6px" }} />
                    {feat.label}
                  </FeatureButton>
                );
              })}

            </TopFeaturesRow>
 <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search a topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchButton onClick={handleSearch}>
            Search
          </SearchButton>
        </SearchContainer>
            <MainContent>
              {/* 2) "Currently Viewing" row with optional summary audio button */}
              <CategoryRow>
                <strong style={{ fontSize: "1rem", color: "#444" }}>
                  Currently Viewing: {currentCategory}
                </strong>
                {briefFetched && (
                  <CategoryAudioButton onClick={handlePlayPauseSummary}>
                    {isPlaying && playingIndex === -1 ? (
                      <RiPauseCircleLine size={16} />
                    ) : (
                      <RiPlayCircleLine size={16} />
                    )}
                    {isPlaying && playingIndex === -1 ? "Pause" : "Play"}
                  </CategoryAudioButton>
                )}
              </CategoryRow>

              {/* 3) Left/Right columns */}
              <ContentRow>
                {/* LEFT COLUMN - summary text */}
                <LeftColumn>
                  <ArticlePreview>
                    <ArticlePreviewText>{summary}
                    {sources.length > 0 && (
  <>
    <p><strong>Sources:</strong></p>
    <p>
      {sources.map((src, i) => (
        <React.Fragment key={src.sourceLink}>
          <a
            href={src.sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0066cc", textDecoration: "underline" }}
          >
            {src.sourceName}
          </a>
          {/* Add a comma if it's not the last source */}
          {i < sources.length - 1 && ", "}
        </React.Fragment>
      ))}
    </p>
  </>
)}

                    </ArticlePreviewText>
                  </ArticlePreview>

                  {/* Buttons row: fetch brief + dropdown for voice */}
                  <ButtonsRow>
                    <SmallButton onClick={handleFetchBrief}>
                      ▶ Fetch My Brief
                    </SmallButton>
                    <Dropdown
                    selectedVoice={selectedVoice}         // <-- parent's state
                     onVoiceChange={(newName) => {
                     // e.g. "CAITLIN"
                     resetAudio(); 
                     setSelectedVoice(newName);          // updates parent's voice
                      }}
                     />

                  </ButtonsRow>
                </LeftColumn>

                {/* RIGHT COLUMN: up to 3 articles, or placeholder */}
             {/* <RightColumn>
                  {articles.length === 0 ? (
                    <ArticlePreview
                      style={{
                        width: "100%",
                        textAlign: "center",
                        minHeight: "80px",
                      }}
                    >
                      <ArticlePreviewText>No articles fetched yet...</ArticlePreviewText>
                    </ArticlePreview>
                  ) : (
                    articles.slice(0, 2).map((item, idx) => {
                      const isExpanded = expandedIndex === idx;
                      const isThisPlaying = idx === playingIndex;
                
                      return (
                        <ExpandedArticleCard
                          key={item.id}
                          className={isExpanded ? "expanded" : ""}
                        >
                          <DropdownArrow onClick={() => toggleCardExpansion(idx)} />
                          <ArticleTitle>{item.title}</ArticleTitle>
                
                          <CardExpansion>
                            <ExtendedContent>
                              {item.content || "No extended content available."}
                            </ExtendedContent>
                           
                          </CardExpansion>
                        </ExpandedArticleCard>
                      );
                    })
                  )}
                </RightColumn>*/}
              </ContentRow>
            </MainContent>

            {/* 4) Hidden <audio> element for TTS */}
            {/* eslint-disable-next-line biomelint/a11y/useMediaCaption */}
            <audio ref={audioRef} onEnded={handleAudioEnded} style={{ display: "none" }} />

            <HrDivider />

            {/* 5) Footer */}
            <BoxFooter>
              <FooterText>Experience a world of concise news and insights!</FooterText>
              <FooterButton onClick={handleNavigation}>
                Go To Full App
              </FooterButton>
            </BoxFooter>
          </FeatureBox>
        </GrayCardWrapper>

        {/* Additional developer or API info */}
        <ApiPage />
      </HomePageContainer>
    </>
  );}