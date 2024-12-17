"use client";
import styled from "styled-components";
import Preselected from "./Preselected";
import SelfSelected from "./SelfSelected";
import { useRouter } from "next/navigation";
import Fetchpage from  "../FetchPage/page"; // Adjust path if necessary


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

const NextButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem; /* Add spacing above the button */
`;

const NextButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: ${({ theme }) => theme.colors.darkBlue};
  color: ${({ theme }) => theme.text.primary};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.tan};
    transform: scale(1.05);
  }
`;


export default function Categories() {
  const router = useRouter(); // For navigation

  const handleNext = () => {
    router.push("/FetchPage"); // Ensure the route matches the folder name
  };
  
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
      <NextButtonWrapper>
        <NextButton onClick={handleNext}>Next</NextButton>
      </NextButtonWrapper>
    </CategoriesContainer>
    
  );
}
