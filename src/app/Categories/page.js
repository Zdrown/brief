"use client";
import styled from "styled-components";
import Preselected from "./Preselected";
import SelfSelected from "./SelfSelected";
import { useRouter } from "next/navigation";
import LocalStorageHelper from "../../../utils/localStorageHelper";
import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

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

 const ErrorMessageContainer = styled.div`
  position: relative; /* Needed for positioning the close icon */
  background-color: ${({ theme }) => theme.colors.errorBg};
  color: ${({ theme }) => theme.colors.errorText};
  border: 1px solid ${({ theme }) => theme.colors.errorBorder};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: bold;
  max-width: 600px;
  margin: 1rem auto; /* Center it horizontally if desired */
`;

const CloseButton = styled(AiOutlineClose)`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.errorText};

  &:hover {
    opacity: 0.8;
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
  const router = useRouter();
  const [error, setError] = useState("");

  function ErrorMessage({ message, onClose }) {
    return (
      <ErrorMessageContainer>
        {/* Close button in the top-right corner */}
        <CloseButton onClick={onClose} size={20} title="Close" />
  
        {/* The error message itself */}
        {message}
      </ErrorMessageContainer>
    );
  }
  const handleNext = () => {
    const preselectedCats = LocalStorageHelper.getPreselectedCategories() || [];
    const selfSelectedCats = LocalStorageHelper.getSelfSelectedCategories() || [];

    // If both arrays are empty, show an error
    if (preselectedCats.length === 0 && selfSelectedCats.length === 0) {
      setError("Please select at least one category to continue.");
      return;
    }

    // Otherwise, clear any previous error and move on
    setError("");
    router.push("/FetchPage");
  };
  return (
    <CategoriesContainer>
      <h1>Categories</h1>
      {error && (
        <ErrorMessage
          message={error}
          onClose={() => setError("")} // Clear error on close
        />
      )}
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
