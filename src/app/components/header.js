import styled from 'styled-components';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.darkBlue}; // Adjust based on your theme
  color: ${({ theme }) => theme.text.primary};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Subtle shadow for depth
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.lightGray}; // Light color contrast
  letter-spacing: 0.05em;
  text-transform: lowercase;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.tan}; // Optional hover effect
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;

  a {
    color: ${({ theme }) => theme.colors.lightGray};
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.3s;

    &:hover {
      color: ${({ theme }) => theme.colors.tan};
    }
  }
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <Logo>brief.</Logo>
      <Nav>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </Nav>
    </HeaderWrapper>
  );
}
