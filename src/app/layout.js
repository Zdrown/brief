// src/app/layout.js
"use client"

import { ThemeProvider } from 'styled-components';
import Theme from './styles/Theme'; // Import your theme object
import GlobalStyles from './styles/GlobalStyles'; // Import your global styles component
import Header from './components/header'; // Assuming your Header component is in components folder
import Footer from './components/footer'; // Assuming your Footer component is in components folder
import StyledComponentsRegistry from './styledComponentsRegistry';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <StyledComponentsRegistry>
        <ThemeProvider theme={Theme}>
          <GlobalStyles /> {/* Apply global styles */}
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </StyledComponentsRegistry>
      </body>
    </html>
  );
}

/*export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <StyledComponentsRegistry>
        <ThemeProvider theme={Theme}>
          <GlobalStyles /> {/* Apply global styles 
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </StyledComponentsRegistry>
      </body>
    </html>
  );
}
*/