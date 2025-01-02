"use client";

import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import LocalStorageHelper from "../../../utils/localStorageHelper";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Sidebar from "../Sidebar/Sidebar";
import PlayerBar from "../components/playerBar";
import { FiPause, FiPlay } from "react-icons/fi";

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

// ================ Animations ================
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(5px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const loadingBarAnim = keyframes`
  0%   { transform: translateX(-100%); }
  50%  { transform: translateX(30%); }
  100% { transform: translateX(100%); }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: left
  justify-content: space-between; 
  margin-bottom: 1rem; /* Adjust spacing as needed */
`;


const PlayButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.backgrounds.secondary};
  cursor: pointer;
  font-size: 1.2rem;
  margin-right: 1rem;
  display: inline-flex;
  align-items: center;
  margin-top: -1vh;

  &:hover {
   color: ${({ theme }) => theme.colors.secondaryBlue};
  }

`;

// ================ Styled Components ================ //

// Outer container for the entire page
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.backgrounds.secondary};
  color: ${({ theme }) => theme.text.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;

  &[data-sidebar='true'] {
    /* styles when sidebar is open */
  }
`;

const DateHeading = styled.h1`
  font-size: 2.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.darkBlue};
  margin: 0;
`;

const SubHeading = styled.h2`
  font-size: 1.3rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.darkBlue}; 
  margin: 0.5rem 0 2rem;
`;

const ResultsContainer = styled.div`
  width: 95%;
  max-width: 1400px;
  margin: 1.5rem auto;
  animation: ${fadeIn} 0.6s ease;

  @media (min-width: 1200px) {
    width: 100%;
  }
`;

// Central loading container
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 15vh;
  animation: ${fadeIn} 0.6s ease;
`;

// Loading message
const LoadingMessage = styled.div`
  font-size: 1.7rem;
  color: ${({ theme }) => theme.colors.darkBlue};
  margin-bottom: 2rem;
  text-align: center;
`;

// Custom progress bar
const CustomProgressBar = styled.div`
  width: 80%;
  max-width: 400px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 40%;
    background: ${({ theme }) => theme.colors.darkBlue};
    animation: ${loadingBarAnim} 2s infinite;
  }
`;

// Each category block
const CategorySection = styled.div`
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.backgrounds.primary};
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  animation: ${fadeInUp} 0.4s ease both;
`;

const ActionButtonsContainer = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? 'none' : 'flex')};
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: flex-end;
  width: 100%;
  max-width: 1000px;
  margin-left: 29vw;
  transition: opacity 0.3s ease;
`;

const ActionButton = styled.button`
  background-color: ${({ theme }) => theme.colors.darkBlue};
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: inherit;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryBlue };
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.backgrounds.secondary};
  margin-bottom: 1rem;
  text-transform: capitalize;
  border-bottom: 2px solid ${({ theme }) => theme.colors.darkBlue};
  padding-bottom: 0.5rem;
`;

const SectionTitle2 = styled.h2`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.backgrounds.secondary};
  margin-bottom: 1rem;
  text-transform: capitalize;
  border-bottom: 2px solid ${({ theme }) => theme.colors.darkBlue};
  padding-bottom: 0.5rem;
`;

const Summary = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.backgrounds.secondary};
  margin-bottom: 1.5rem;
`;

const FeedItems = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const FeedItem = styled.li`
  padding: 1rem;
  background-color: ${({ theme }) => theme.backgrounds.secondary};
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: ${fadeInUp} 0.4s ease both;

  &:hover {
    background-color: ${({ theme }) => theme.colors.tan};
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  max-width: 100%; 
  overflow: hidden;
`;

const FeedItemTitle = styled.h3`
  font-size: 1.15rem;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const FeedItemContent = styled.p`
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0.3rem 0;
  color: ${({ theme }) => theme.colors.darkBlue};
  opacity: 0.9;
`;

// Chat bar styles
const ChatBarContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 600px;
  background: ${({ theme }) => theme.backgrounds.primary};
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  border-radius: 8px;
  padding: 1rem;
  z-index: 10000;
`;

const ChatBarTitle = styled.div`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.backgrounds.secondary};
`;

const ChatInputContainer = styled.form`
  display: flex;
  gap: 0.5rem;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-family: inherit;
  font-size: 1rem;
`;

const ChatSendButton = styled.button`
  background: ${({ theme }) => theme.colors.darkBlue};
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0 1rem;
  font-size: 1rem;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryBlue};
  }
`;

const ChatResponse = styled.div`
  margin-top: 1rem;
  font-size: 0.95rem;
  color:${({ theme }) => theme.backgrounds.secondary};
  line-height: 1.4;
`;

// ================ Main Component ================ //

export default function FetchingPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState("");
  const [loadingNewCategory, setLoadingNewCategory] = useState(false);
  const [isPlayerBarVisible, setIsPlayerBarVisible] = useState(false);



  // New function to fetch and play audio from the summary text
 // State or refs
 const [playerIndex, setPlayerIndex] = useState(0);        // which item is active
 const [playerAudio, setPlayerAudio] = useState(null);     // the single Audio object
 const [isPlayerAudioLoaded, setIsPlayerAudioLoaded] = useState(false);
 const [isPlayerPlaying, setIsPlayerPlaying] = useState(false);


 // =========== TTS Loader ===========
 const [summariesAudio, setSummariesAudio] = useState({});
 const isCurrentlyPlaying = summariesAudio[playerIndex]?.isPlaying ?? false;
 const currentTime = summariesAudio[playerIndex]?.currentTime ?? 0;
 const duration = summariesAudio[playerIndex]?.duration ?? 0;

 // A “global” player index so the player bar knows which summary is active


 // We can derive isPlayerPlaying from summariesAudio[playerIndex]?.isPlaying
 // but for convenience, store a boolean to control the bar UI

 // ======== LOAD AUDIO FUNCTION ========
 async function loadAudioForSummary(summaryText) {
  try {
    const response = await fetch("/api/textToSpeech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: summaryText }),
    });
    if (!response.ok) {
      console.error("Failed to fetch TTS audio");
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([new Uint8Array(arrayBuffer)], { type: "audio/mp3" });
    const audioURL = URL.createObjectURL(blob);

    // Return a new Audio object
    return new Audio(audioURL);
  } catch (error) {
    console.error("Error fetching audio:", error);
    return null;
  }
}

// ===================== Toggle Audio =====================
function toggleAudio(index) {
  // 1) Ensure an entry exists in summariesAudio for this index
  setSummariesAudio((prev) => {
    if (!prev[index]) {
      return {
        ...prev,
        [index]: {
          audio: null,
          isLoaded: false,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
        },
      };
    }
    return prev;
  });

  const currentEntry = summariesAudio[index];

  // 2) If not loaded yet, fetch & play
  if (!currentEntry || !currentEntry.isLoaded) {
    const summaryText = results[index]?.summary;
    if (!summaryText) return;

    // Load the audio
    loadAudioForSummary(summaryText).then((audio) => {
      if (!audio) return;

      // Pause all others first
      pauseAllOthers(index);

      // === Attach event listeners for time/duration tracking ===
      audio.addEventListener("loadedmetadata", () => {
        setSummariesAudio((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            duration: audio.duration,
            currentTime: 0,
          },
        }));
      });

      audio.addEventListener("timeupdate", () => {
        setSummariesAudio((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            currentTime: audio.currentTime,
          },
        }));
      });

      audio.addEventListener("ended", () => {
        setSummariesAudio((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            isPlaying: false,
            currentTime: 0, // optional reset
          },
        }));
      });

      // Play
      audio.play().catch((err) => console.error("Audio play failed:", err));

      // Update dictionary with new audio
      setSummariesAudio((prev) => ({
        ...prev,
        [index]: {
          audio,
          isLoaded: true,
          isPlaying: true,
          currentTime: 0,
          duration: 0, // will be updated by loadedmetadata
        },
      }));
    });
  } else {
    // 3) Audio is already loaded => just toggle
    const { audio, isPlaying } = currentEntry;
    if (!audio) return;

    if (isPlaying) {
      // Pause
      audio.pause();
      setSummariesAudio((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          isPlaying: false,
        },
      }));
    } else {
      // Pause all others first
      pauseAllOthers(index);

      // Play
      audio.play().catch((err) => console.error("Audio play failed:", err));
      setSummariesAudio((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          isPlaying: true,
        },
      }));
    }
  }
}

// ===================== Pause All Others =====================
function pauseAllOthers(exceptIndex) {
  setSummariesAudio((prev) => {
    const newState = { ...prev };
    for (const key of Object.keys(newState)) {
      if (Number(key) !== exceptIndex && newState[key].isPlaying) {
        newState[key].audio.pause();
        newState[key].isPlaying = false;
      }
    }
    return newState;
  });
}

// ===================== Global Player Actions =====================

// Called by the "Play/Pause" button on the global player bar
function handlePlayPause() {
  toggleAudio(playerIndex);
}

// Skip to Next summary
function handleSkipNext() {
  // Pause the current
  pauseAllOthers(-1);

  setPlayerIndex((prev) => {
    const newIndex = prev + 1 >= results.length ? 0 : prev + 1;
    setTimeout(() => toggleAudio(newIndex), 0);
    return newIndex;
  });
}

// Skip to Previous summary
function handleSkipBack() {
  // Pause the current
  pauseAllOthers(-1);

  setPlayerIndex((prev) => {
    const newIndex = prev - 1 < 0 ? results.length - 1 : prev - 1;
    setTimeout(() => toggleAudio(newIndex), 0);
    return newIndex;
  });
}

// ===================== Seeking (Progress Bar) =====================
// Called when user drags the slider in your PlayerBar
function handleSeek(newTime) {
  const entry = summariesAudio[playerIndex];
  if (!entry?.audio) return;

  // 1) Set the Audio object's position
  entry.audio.currentTime = newTime;

  // 2) Update the dictionary so UI re-renders
  setSummariesAudio((prev) => ({
    ...prev,
    [playerIndex]: {
      ...prev[playerIndex],
      currentTime: newTime,
    },
  }));
}

// ===================== Summary-Level Toggle =====================
// Called when user clicks a "Play" button on a specific summary
function handleSummaryToggle(index) {
  setIsPlayerBarVisible(true); // show global bar if hidden
  setPlayerIndex(index);       // mark this summary as the active one
  toggleAudio(index);          // actually toggle audio playback
}

  // For chat bar
  const [highlightedText, setHighlightedText] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  async function handleNewCategoryAdded(category) {
    setLoadingNewCategory(true);
    try {
      const response = await fetch('/api/newsFetcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, sourceType: 'self' }),
      });

      const data = await response.json();
      if (response.ok && data.items?.length) {
        setResults(prevResults => [...prevResults, {
          category: data.metadata.category,
          summary: data.summary,
          items: data.items,
        }]);
      } else {
        console.warn("No items found for this category:", category);
      }
    } catch (error) {
      console.error("Error fetching new category items:", error);
    } finally {
      setLoadingNewCategory(false);
    }
  }

  function generateHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `key-${hash}`;
  }

  function capitalizeAllWords(str) {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  }

  useEffect(() => {
    const now = new Date();
    const dateString = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setToday(dateString);
  }, []);

  useEffect(() => {
    const fetchSummaries = async () => {
      setLoading(true);
      NProgress.start();

      const preselectedCategories =
        LocalStorageHelper.getItem("preselectedCategories") || [];
      const selfSelectedCategories =
        LocalStorageHelper.getItem("selfSelectedCategories") || [];

      const allCategories = [
        ...preselectedCategories.map((category) => ({
          title: category,
          sourceType: "reliable",
        })),
        ...selfSelectedCategories.map((category) => ({
          title: category.title,
          sourceType: "self",
        })),
      ];

      try {
        const summaries = await Promise.allSettled(
          allCategories.map(async ({ title, sourceType }) => {
            if (!title || !sourceType) {
              console.warn("Skipping invalid category:", { title, sourceType });
              return {
                category: title || "Unknown",
                summary: "No data available",
                items: [],
              };
            }

            const response = await fetch("/api/newsFetcher", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ category: title, sourceType }),
            });

            if (!response.ok) {
              const data = await response.json();
              console.error(`Failed to fetch summary for ${title}:`, data.error);
              return {
                category: title,
                summary: "Failed to load summary",
                items: [],
              };
            }

            const data = await response.json();
            return {
              category: title,
              summary: data.summary || "No summary available",
              items: data.items || [],
            };
          })
        );

        const finalSummaries = summaries.map((res, i) => {
          if (res.status === "fulfilled") {
            return res.value; 
          }
          const { title } = allCategories[i];
          return {
            category: title || "Unknown",
            summary: "Failed to load summary",
            items: [],
          };
        });

        setResults(finalSummaries);
      } catch (error) {
        console.error("Error fetching summaries:", error);
      } finally {
        NProgress.done();
        setLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  const handleSaveBrief = () => {
    try {
      const existingBriefs = LocalStorageHelper.getItem("dailyBriefs") || [];
      const isoDateString = new Date().toISOString();
      const newBrief = {
        id: isoDateString,
        date: isoDateString,
        data: results,
      };
      existingBriefs.push(newBrief);
      LocalStorageHelper.setItem("dailyBriefs", existingBriefs);
      alert("Brief saved to local storage!");
    } catch (error) {
      console.error("Failed to save brief:", error);
    }
  };

  const handleShareBrief = () => {
    const shareText = results
      .map(
        (r) =>
          `Category: ${r.category}\nSummary: ${r.summary?.slice(0, 200)}...`
      )
      .join("\n\n");

    if (navigator.share) {
      navigator
        .share({
          title: "Daily Brief",
          text: shareText,
          url: window.location.href,
        })
        .catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Brief copied to clipboard (Web Share not supported).");
    }
  };

  // Handle text highlight
  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 0) {
      // If user selected some text, open chat bar and set query to highlighted text
      setHighlightedText(text);
      setIsChatOpen(true);
      setChatResponse("");
      // Automatically populate input with highlighted text
    } else {
      // If no text is selected, close the chat bar
      setIsChatOpen(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    try {
      const response = await fetch("/api/Chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ highlightedText, query: userQuery }),
      });

      const data = await response.json();
      if (response.ok && data.response) {
        setChatResponse(data.response);
      } else {
        setChatResponse("Sorry, I couldn't get an answer right now.");
      }
    } catch (error) {
      console.error("Error querying LLM:", error);
      setChatResponse("An error occurred while fetching the answer.");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingMessage>Building your daily brief...</LoadingMessage>
          <CustomProgressBar />
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <Sidebar results={results} onNewCategoryAdded={handleNewCategoryAdded}>
      {({ sidebarOpen }) => (
        <PageContainer data-sidebar={sidebarOpen ? 'true' : 'false'}>
          <DateHeading>{today}</DateHeading>
          <SubHeading>Your Daily Brief</SubHeading>

          <ActionButtonsContainer $isOpen={sidebarOpen}> 
            <ActionButton onClick={handleSaveBrief}>Save Brief</ActionButton>
            <ActionButton onClick={handleShareBrief}>Share Brief</ActionButton>
          </ActionButtonsContainer>

          <ResultsContainer onMouseUp={handleMouseUp}>
          {results.map(({ category, summary, items }, index) => (
  <CategorySection key={category}>
     <CategoryHeader>
    <SectionTitle>{capitalizeAllWords(category)}</SectionTitle>
    
    <PlayButton onClick={() => handleSummaryToggle(index)}>
  {summariesAudio[index]?.isPlaying ? <FiPause /> : <FiPlay />}
</PlayButton>
    </CategoryHeader>
    
                <div>
                  {summary.split(/\n\n+/).map((paragraph) => (
                    <Summary key={generateHash(paragraph)}>
                      {paragraph}
                    </Summary>
                  ))}
                </div>

                <SectionTitle2>Read The Full Article</SectionTitle2>
                {items && items.length > 0 && (
                  <FeedItems>
                    {items.map((feedItem) => {
                      const itemKey = feedItem.title-index || feedItem.link
                      return (
                        <FeedItem key={itemKey}>
                          <FeedItemTitle>{feedItem.title}</FeedItemTitle>
                          <FeedItemContent>{feedItem.content}</FeedItemContent>
                          {feedItem.link && (
                            <a
                              href={feedItem.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: "0.9rem", color: "#0066cc" }}
                            >
                              Read more
                            </a>
                          )}
                        </FeedItem>
                      );
                    })}
                  </FeedItems>
                )}
              </CategorySection>
            ))}
          </ResultsContainer>
          {loadingNewCategory && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              Loading new category...
            </div>
          )}

{isChatOpen && (
  <ChatBarContainer>
    <ChatBarTitle>What do you want to know about this?</ChatBarTitle>
    {/* Display the highlighted text as a reference */}
    {highlightedText && (
      <div style={{ marginBottom: '0.5rem', fontStyle: 'italic', color: '#ccc' }}>
      &quot;{highlightedText}&quot;
    </div>
    )}
    <ChatInputContainer onSubmit={handleChatSubmit}>
      <ChatInput
        placeholder="Ask a question..."
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
      />
      <ChatSendButton type="submit">Send</ChatSendButton>
    </ChatInputContainer>
    {chatResponse && <ChatResponse>{chatResponse}</ChatResponse>}
  </ChatBarContainer>
)}
  {isPlayerBarVisible && (
        <PlayerBar
          title={results[playerIndex]?.category || "No Category"}
          isPlaying={isCurrentlyPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={handlePlayPause}
          onSkipBack={handleSkipBack}
          onSkipNext={handleSkipNext}
          onSeek={handleSeek}
          onClose={() => setIsPlayerBarVisible(false)}
        />
      )}
        </PageContainer>
      )}
    </Sidebar>
  );
}
