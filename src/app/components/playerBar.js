import React from "react";
import styled from "styled-components";
import {
  FiSkipBack,
  FiSkipForward,
  FiPlay,
  FiPause,
  FiX
} from "react-icons/fi";

// Entire bar wraps at bottom
const PlayerBarWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(${({ theme }) => theme.colors.tanRGB}, 0.85);
  color: #fff;
  z-index: 9999;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;

  /* Two rows: one for the title, one for the controls/slider/close */
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5rem 1rem;
`;

/* ---------------- Row 1: Title centered ---------------- */
const TitleRow = styled.div`
  text-align: center;
  font-size: 1.1rem;
  font-weight: 900;
`;

/* ---------------- Row 2: 
   We'll do a 3-column grid:
     1) Left controls
     2) Center slider 
     3) Close button 
   so the slider can easily be centered horizontally.
*/
const ControlsRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
`;

/* --- Left controls: skip back, play/pause, skip forward --- */
const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1vh
`;

const PlayerButton = styled.button`
  background: none;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 1.4rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.darkBlue};
  }
`;

/* --- Center slider area: times + slider, all horizontally centered --- */
const SliderCenter = styled.div`
  display: flex;
  justify-content: center; /* ensures the contents are centered horizontally */
  align-items: center;
  gap: 8px;

  /* optional max-width to avoid an overly wide slider */
  max-width: 700px;
  width: 100%;
  margin-left: 12vw;
    margin-bottom: 1vh
`;

const TimeLabel = styled.span`
  font-size: 0.85rem;
  min-width: 36px; /* keep time labels from jumping around */
  text-align: center;
  color: #fff;
`;

const ProgressSlider = styled.input.attrs({ type: "range" })`
  -webkit-appearance: none;
  width: 100vw;
  height: 1px;
  background: #ffffff;
  border-radius: 2px;
  cursor: pointer;
  outline: none;


  /* Track - Chrome/Safari */
  &::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
    background: #ffffff;
  }

  /* Thumb - Chrome/Safari */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: #ffffff;
    border: 2px solid rgba(0, 0, 0, 0.6);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    margin-top: -5px; /* center thumb on track */
    cursor: pointer;
    transition: transform 0.1s ease;
  }
  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  /* Track - Firefox */
  &::-moz-range-track {
    height: 4px;
    border-radius: 2px;
    background: #ffffff;
  }

  /* Thumb - Firefox */
  &::-moz-range-thumb {
    background-color: #ffffff;
    border: 2px solid rgba(0, 0, 0, 0.6);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.1s ease;
  }
  &::-moz-range-thumb:hover {
    transform: scale(1.1);
  }
`;

/* --- Right close button (X) --- */
const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s ease;
  margin-bottom: 1vh;
  &:hover {
    color: ${({ theme }) => theme.colors.darkBlue};
  }
`;

/**
 * @param {string}   title        - Title for row 1 (centered at top)
 * @param {boolean}  isPlaying    - Whether audio is playing
 * @param {number}   currentTime  - Current playback seconds
 * @param {number}   duration     - Total audio length
 * @param {function} onPlayPause  - Toggle play/pause
 * @param {function} onSkipBack   - Skip back
 * @param {function} onSkipNext   - Skip next
 * @param {function} onSeek       - Move slider
 * @param {function} onClose      - Close the bar
 */
export default function PlayerBar({
  title = "No Category",
  isPlaying,
  currentTime = 0,
  duration = 0,
  onPlayPause,
  onSkipBack,
  onSkipNext,
  onSeek,
  onClose
}) {
  function formatTime(secondsTotal) {
    if (!secondsTotal || Number.isNaN(secondsTotal)) {
      return "0:00";
    }
    const minutes = Math.floor(secondsTotal / 60);
    const seconds = Math.floor(secondsTotal % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  const handleSliderChange = (e) => {
    const newTime = Number.parseFloat(e.target.value);
    onSeek?.(newTime);
  };

  return (
    <PlayerBarWrapper>
      {/* Row 1: Title */}
      <TitleRow>{title}</TitleRow>

      {/* Row 2: Controls + Slider + Close */}
      <ControlsRow>
        <LeftControls>
          <PlayerButton onClick={onSkipBack}>
            <FiSkipBack />
          </PlayerButton>
          <PlayerButton onClick={onPlayPause}>
            {isPlaying ? <FiPause /> : <FiPlay />}
          </PlayerButton>
          <PlayerButton onClick={onSkipNext}>
            <FiSkipForward />
          </PlayerButton>
        </LeftControls>

        {/* Center Slider with times */}
        <SliderCenter>
          <TimeLabel>{formatTime(currentTime)}</TimeLabel>
          <ProgressSlider
            min={0}
            max={duration || 0}
            step="0.01"
            value={currentTime}
            onChange={handleSliderChange}
          />
          <TimeLabel>{formatTime(duration)}</TimeLabel>
        </SliderCenter>

        {/* Far Right: Close button */}
        <CloseButton onClick={onClose}>
          <FiX />
        </CloseButton>
      </ControlsRow>
    </PlayerBarWrapper>
  );
}
