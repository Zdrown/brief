"use client"; // Important for client-side features in Next.js 13+

import React, { useState } from "react";
import styled from "styled-components";

// Sample voices data (name + gradient color)
const voices = [
  { name: "ZACH",    gradient: "linear-gradient(135deg, #012A36, #f78349 )" },
  { name: "CAITLIN", gradient: "linear-gradient(135deg, #f78349, #FF8552)" },
  { name: "ALEX",    gradient: "linear-gradient(135deg, #f78349, #297373)" },
  { name: "ANSEL",   gradient: "linear-gradient(135deg, #297373, #012A36)" },
];

/**
 * A dropdown that:
 * - Accepts `selectedVoice` (string) and `onVoiceChange` (fn) from the parent
 * - Renders a local isOpen state for open/close
 * - Displays the parent's selectedVoice name/gradient
 * - Allows picking a voice, then notifies parent via `onVoiceChange(voiceName)`
 * - Displays a snippet text (no audio logic)
 */
export default function Dropdown({ selectedVoice, onVoiceChange }) {
  // Local open/close state
  const [isOpen, setIsOpen] = useState(false);

  // Sample text (retaining your snippet)


  // Toggle dropdown
  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  // User selects a new voice from the list
  function handleSelect(voiceObj) {
    // Close the menu
    setIsOpen(false);
    // Notify parent that we selected voiceObj.name, e.g. "CAITLIN"
    onVoiceChange(voiceObj.name);
  }

  // We find the matching gradient from `voices` using the parent's selectedVoice
  const currentVoice = voices.find((v) => v.name === selectedVoice) || voices[0];

  return (
    <Container>
      {/* 1) The Voice Dropdown Button */}
      <DropdownWrapper>
        <MainButton onClick={toggleDropdown}>
          {/* The circle uses the current gradient */}
          <CircleIcon style={{ background: currentVoice.gradient }} />
          {selectedVoice}
          <Caret>{isOpen ? "▲" : "▼"}</Caret>
        </MainButton>

        {isOpen && (
          <Menu>
            {voices.map((voice) => (
              <MenuItem
                key={voice.name}
                onClick={() => handleSelect(voice)}
              >
                <CircleIcon style={{ background: voice.gradient }} />
                {voice.name}
              </MenuItem>
            ))}
          </Menu>
        )}
      </DropdownWrapper>

      {/* 2) A snippet text block—no audio references */}
     
    </Container>
  );
}

/* ------------------ STYLED COMPONENTS ------------------ */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const MainButton = styled.button`
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border-radius: 16px;
  border: 1px solid #333;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 140px;
 

  &:hover {
    background-color:${({ theme }) => theme?.colors?.darkBlue || "#333"};
    color: #ffff
  }
`;

const CircleIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;

const Caret = styled.span`
  margin-left: auto;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 180px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  padding: 0.5rem 0;
  z-index: 999;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  color: #000;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }
`;

/* 
   The snippet block 
*/

