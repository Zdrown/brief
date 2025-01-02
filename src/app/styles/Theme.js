// src/styles/theme.js
const Theme = {
    colors: {
      black: '#0A0908',          // Deep black
      darkBlue: '#22333B', 
      darkBlueRGB:'169, 146, 125',    // Dark blue
      lightGray: '#F2F4F3',      // Light grayish white
      tan: '#A9927D',            // Tan/brown color
      tanRGB: '169, 146, 125',   //rgb value for opacity
      darkBrown: '#5E503F', 
           // Dark brown
    },
    backgrounds: {
      primary: '#22333B',        // Primary background color (e.g., dark blue)
      secondary: '#F2F4F3',      // Secondary background color (light)
    },
    text: {
      primary: '#F2F4F3',        // Text on dark backgrounds (light gray)
      secondary: '#0A0908',      // Text on light backgrounds (deep black)
    },
    breakpoints: {
      mobile: '576px',   // typical mobile
      tablet: '768px',   // typical tablet
      desktop: '992px',  // small desktop
      largeDesktop: '1200px',
    },
  };
  
  export default Theme; // Ensure this export matches the import path
  
  // src/styles/theme.js
