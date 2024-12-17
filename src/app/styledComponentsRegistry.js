"use client";

import React, { useMemo } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({ children }) {
  // Only use ServerStyleSheet on the server side
  const sheet = useMemo(() => {
    return typeof window === "undefined" ? new ServerStyleSheet() : null;
  }, []);

  // Insert server-collected styles only during server rendering
  useServerInsertedHTML(() => {
    if (sheet) {
      const styles = sheet.getStyleElement();
      return <>{styles}</>;
    }
  });

  if (sheet) {
    return (
      <StyleSheetManager sheet={sheet.instance}>
        {children}
      </StyleSheetManager>
    );
  }

  // Fallback for client-side rendering without ServerStyleSheet
  return <>{children}</>;
}
