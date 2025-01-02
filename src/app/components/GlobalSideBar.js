import React, { useState } from 'react';
import styled from 'styled-components';
import Theme from '../styles/Theme'; // Adjust path as needed
import {
  FaChevronDown,
  FaChevronUp,
  FaCog,
  FaListUl,
  FaVolumeUp,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaDollarSign,
} from 'react-icons/fa';

/* ========== Styled Components ========== */

const SidebarContainer = styled.div`
  width: 280px;
  min-height: 75vh;
  background-color: ${Theme.backgrounds.secondary};
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
`;

const NavSection = styled.div`
  margin: 1rem 0;
`;

const NavItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${Theme.text.secondary};
  font-size: 1rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  text-align: left;

  &:hover {
    background-color: ${Theme.colors.tan};
    color: ${Theme.text.primary};
  }
`;

const NavItemLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SubMenu = styled.div`
  display: ${({ open }) => (open ? 'block' : 'none')};
  background-color: ${Theme.backgrounds.primary};
`;

const SubMenuItem = styled.div`
  padding: 0.5rem 2.5rem;
  color: ${Theme.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${Theme.colors.lightGray};
    color: ${Theme.colors.darkBrown};
  }
`;

const SimpleNavItem = styled.div`
  color: ${Theme.text.secondary};
  font-size: 1rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background-color: ${Theme.colors.tan};
    color: ${Theme.text.primary};
  }
`;



/* ========== Main Component ========== */

const GlobalSideBar = () => {
  const [manageBriefsOpen, setManageBriefsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <SidebarContainer>
      {/* Sidebar Header / Branding */}
    
        {/* You can place a logo or brand name here */}



      {/* Manage Briefs */}
      <NavSection>
        <NavItem onClick={() => setManageBriefsOpen(!manageBriefsOpen)}>
          <NavItemLabel>
            <FaListUl />
            Manage Briefs
          </NavItemLabel>
          {manageBriefsOpen ? <FaChevronUp /> : <FaChevronDown />}
        </NavItem>
        <SubMenu open={manageBriefsOpen}>
          <SubMenuItem>
            <FaCog /> Settings
          </SubMenuItem>
          <SubMenuItem>
            <FaListUl /> Categories
          </SubMenuItem>
          <SubMenuItem>
            <FaVolumeUp /> Voice Selection
          </SubMenuItem>
        </SubMenu>
      </NavSection>

      {/* Notifications */}
      <NavSection>
        <SimpleNavItem>
          <FaBell /> Notifications
        </SimpleNavItem>
      </NavSection>

      {/* Become an Affiliate */}
      <NavSection>
        <SimpleNavItem>
          <FaDollarSign /> Become an Affiliate
        </SimpleNavItem>
      </NavSection>

      {/* My Account */}
      <NavSection>
        <NavItem onClick={() => setAccountOpen(!accountOpen)}>
          <NavItemLabel>
            <FaUser />
            My Account
          </NavItemLabel>
          {accountOpen ? <FaChevronUp /> : <FaChevronDown />}
        </NavItem>
        <SubMenu open={accountOpen}>
          <SubMenuItem>
            <FaUser /> Manage Account
          </SubMenuItem>
          <SubMenuItem>
            <FaCog /> Subscription
          </SubMenuItem>
          <SubMenuItem>
            <FaDollarSign /> Affiliate
          </SubMenuItem>
          <SubMenuItem>
            <FaSignOutAlt /> Sign Out
          </SubMenuItem>
        </SubMenu>
      </NavSection>

      {/* Footer / anything else you want at bottom */}
  
    </SidebarContainer>
  );
};

export default GlobalSideBar;
