"use client";
import styled from 'styled-components';// entry point of the application (homepage)


const HomePageContainer = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.backgrounds.secondary};
  color: ${({ theme }) => theme.text.secondary};
  min-height: calc(100vh - 8rem); // Adjusts height minus header/footer padding
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.darkBlue};
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.tan};
`;

const CallToAction = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.text.primary};
  background-color: ${({ theme }) => theme.colors.darkBlue};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.tan};
  }
`;

export default function HomePage() {
  return (
    <HomePageContainer>
      <Title>Welcome to brief.</Title>
      <Description>
        brief. is your go-to application for concise and personalized updates. Get your daily briefings, manage categories, and stay informed effortlessly.
      </Description>
      
      <CallToAction onClick={() => alert('Get Started!')}>
        Get Started
      </CallToAction>
    </HomePageContainer>
  );
}
