"use client";
import styled from "styled-components";
import Link from "next/link";

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.darkBlue};
  color: ${({ theme }) => theme.text.primary};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.lightGray};
  letter-spacing: 0.05em;
  text-transform: lowercase;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.tan};
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
        <Link href="/">Home</Link> {/* Navigate to the root route */}
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </Nav>
    </HeaderWrapper>
  );
}
