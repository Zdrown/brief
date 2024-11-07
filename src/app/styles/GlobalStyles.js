// src/app/styles/globalstyles.js
import { createGlobalStyle } from 'styled-components';
import Theme from './Theme'; // Use lowercase 'theme' to match the file name
 // Correctly importing the theme object

const GlobalStyles = createGlobalStyle`
  /* General Resets and Base Styles */
  *, *::before, *::after {
    box-sizing: border-box; // Ensure padding and border are included in element's width/height
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px; // Base font size for rem calculations
    scroll-behavior: smooth; // Smooth scrolling behavior
    background-color: ${Theme.backgrounds.primary}; // Apply primary background to the whole document
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: ${Theme.backgrounds.primary}; // Apply primary background color
    color: ${Theme.text.primary}; // Apply primary text color
    line-height: 1.5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header, footer {
    background-color: ${Theme.colors.tan}; // Optional for header/footer
    color: ${Theme.text.secondary};
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  a {
    color: ${Theme.colors.lightGray}; // Link color using light gray
    text-decoration: none;

    &:hover {
      color: ${Theme.colors.darkBrown}; // Change on hover
    }
  }

  /* Utility Classes */
  .container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    color: ${Theme.text.secondary};
    margin: 1rem 0;
  }

  p {
    margin: 0.5rem 0;
  }

  /* Buttons */
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: ${Theme.colors.darkBlue}; // Button background
    color: ${Theme.text.primary}; // Button text color
    cursor: pointer;

    &:hover {
      background-color: ${Theme.colors.tan}; // Button hover
    }
  }

  /* Form Elements */
  input, select, textarea {
    padding: 0.5rem;
    margin: 0.5rem 0;
    border: 1px solid ${Theme.colors.darkBrown};
    border-radius: 4px;
    background-color: ${Theme.backgrounds.secondary};
    color: ${Theme.text.secondary};
    width: 100%;
    max-width: 100%;

    &:focus {
      outline: 2px solid ${Theme.colors.lightGray}; // Focus outline
    }
  }
`;

export default GlobalStyles; // Exporting the global styles component
