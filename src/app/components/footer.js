"use client";
import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.backgrounds.primary};
  color: ${({ theme }) => theme.text.primary};
  padding: 2rem 1rem;
`;
const FooterTop = styled.div`
  display: flex;
  justify-content: center;
  gap: 10rem; /* Large gap on wide screens */
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  border-bottom: 2px solid ${({ theme }) => theme.colors.darkBrown};
  padding-bottom: 1rem;

  @media (max-width: 900px) {
    /* Medium devices: reduce gap */
    gap: 3rem;
  }

  @media (max-width: 870px) {
    /* Slightly smaller screens */
    gap: 1.5rem;
    align-items: center;
  }

  @media (max-width: 576px) {
    /* Small devices: stack columns vertically */
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center; /* Center inline text (e.g., headings, links) within columns. */
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items within each column */
  text-align: center;  /* Ensure text is centered in each column */
  space-between: 10vw;
`;

const ColumnTitle = styled.h3`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text.primary};
`;

const ColumnItem = styled.a`
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const FooterBottom = styled.div`
   margin-top: 1rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text.primary};
`;


export default function Footer() {
  return ( <FooterContainer>
    {/* Center everything inside FooterContent */}
    <FooterContent>
      {/* Top row of columns */}
      <FooterTop>
        {/* 1) Research */}
        <FooterColumn>
          <ColumnTitle>Research</ColumnTitle>
          <ColumnItem>Feedback</ColumnItem>
          <ColumnItem>Request A Feature</ColumnItem>
        </FooterColumn>

        {/* 2) Products */}
        <FooterColumn>
          <ColumnTitle>Products</ColumnTitle>
          <ColumnItem>Projects</ColumnItem>
          <ColumnItem>API</ColumnItem>
        </FooterColumn>

        {/* 3) Solutions */}
        <FooterColumn>
          <ColumnTitle>Solutions</ColumnTitle>
          <ColumnItem>For Enterprise</ColumnItem>
          <ColumnItem>For Teams</ColumnItem>
          <ColumnItem>For Developers</ColumnItem>
        </FooterColumn>
   

        {/* 4) Resources */}
        <FooterColumn>
          <ColumnTitle>Resources</ColumnTitle>
          <ColumnItem>API Reference</ColumnItem>
          <ColumnItem>Help Center</ColumnItem>
     
        </FooterColumn>

        {/* 5) Company */}
        <FooterColumn>
          <ColumnTitle>Company</ColumnTitle>
          <ColumnItem>About</ColumnItem>
          <ColumnItem>Careers</ColumnItem>
          <ColumnItem>Blog</ColumnItem>
        </FooterColumn>
      </FooterTop>

      {/* Bottom center text */}
      <FooterBottom>
        &copy; {new Date().getFullYear()} brief. All rights reserved.
      </FooterBottom>
    </FooterContent>
  </FooterContainer>
);
}