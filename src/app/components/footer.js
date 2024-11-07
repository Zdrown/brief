import styled from 'styled-components';

const FooterWrapper = styled.footer`
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.darkBlue};
  color: ${({ theme }) => theme.text.primary};
  text-align: center;
  font-size: 0.875rem; // Slightly smaller text for a modern look
  border-top: 1px solid ${({ theme }) => theme.colors.tan}; // Subtle top border
`;

export default function Footer() {
  return (
    <FooterWrapper>
      &copy; {new Date().getFullYear()} brief. All rights reserved.
    </FooterWrapper>
  );
}
