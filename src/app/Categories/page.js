"use client";
import styled from "styled-components";
import Preselected from "./Preselected";
import SelfSelected from "./SelfSelected";

const CategoriesContainer = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.backgrounds.secondary};
  color: ${({ theme }) => theme.text.secondary};
  min-height: calc(100vh - 8rem);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }
`;

const Section = styled.div`
  flex: 1;
`;

export default function Categories() {
  return (
    <CategoriesContainer>
      <h1>Categories</h1>
      <ContentWrapper>
        <Section>
          <Preselected />
        </Section>
        <Section>
          <SelfSelected />
        </Section>
      </ContentWrapper>
    </CategoriesContainer>
  );
}
