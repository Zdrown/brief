"use client";
import styled from 'styled-components';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import ActionButtons from '../components/Actionbuttons(breifpage)/Actionbuttons';
import LocalStorageHelper from '../../../utils/localStorageHelper';
import React from 'react';

// Capitalize function
const capitalizeAllWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
`;

const MenuButton = styled.button.attrs(props => ({
  'data-isopen': props.$isOpen
}))`
  position: fixed;
  top: 2rem;
  left: ${({ $isOpen }) => ($isOpen ? '20rem' : '2rem')};
  z-index: 1001;
  background-color: ${({ theme }) => theme.colors.darkBlue};
  color: white;
  border: none;
  border-radius: 8px;
  margin-top: 10vh;
  padding: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryBlue};
  }
`;

const SidebarContent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 20rem;
  background-color: ${({ theme }) => theme.backgrounds.primary};
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease;
  box-shadow: ${({ $isOpen }) => ($isOpen ? '0 0 20px rgba(0, 0, 0, 0.1)' : 'none')};
  padding: 1rem 2rem 2rem
  overflow-y: auto;
  

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    border-radius: 4px;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1rem;
  
`;

const CategoryItem = styled.div`
  padding: 1.2rem 1.5rem;
  background-color: ${({ theme }) => theme.backgrounds.secondary};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.darkBlue};
  font-size: 1.2rem;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: ${({ theme }) => theme.colors.tan};
    transform: translateX(5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const MainContentWrapper = styled.div`
  transition: margin-left 0.3s ease;
  margin-left: ${({ $isOpen }) => ($isOpen ? '20rem' : '0')};
  width: ${({ $isOpen }) => ($isOpen ? 'calc(100% - 20rem)' : '100%')};
 
`;

const SidebarTitle = styled.h2`
  font-size: 1.8rem;
  color:${({ theme }) => theme.backgrounds.secondary};
  margin-bottom: 2rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid ${({ theme }) => theme.backgrounds.secondary};
  font-weight: 600;
  
`;

const InputContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 0.5rem;
  
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.darkBlue};
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.tan};
  }
`;

const AddButton = styled.button`
  background-color: ${({ theme }) => theme.colors.darkBlue};
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  width: 100
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryBlue};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const generateCategoryKey = (category) => {
  return `category-${category.toLowerCase().replace(/\s+/g, '-')}`;
};

// Helper functions for emoji fetch
async function fetchEmoji(title) {
  try {
    const response = await fetch("/api/fetchEmoji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const data = await response.json();
    return response.ok ? data.emoji || "📝" : "📝";
  } catch (error) {
    console.error("Error fetching emoji:", error);
    return "📝";
  }
}

function isSingleEmoji(str) {
  const emojiRegex = /^(\p{Emoji}|\p{Extended_Pictographic}|\p{Regional_Indicator}{2}|\p{Emoji}\uFE0F)$/u;
  return emojiRegex.test(str.trim());
}

const Sidebar = ({ children, results, onNewCategoryAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState(() => {
    const preselected = JSON.parse(localStorage.getItem('preselectedCategories')) || [];
    const selfSelected = JSON.parse(localStorage.getItem('selfSelectedCategories')) || [];
    return [...preselected, ...selfSelected.map(cat => cat.title)];
  });
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { sidebarOpen: isOpen });
    }
    return child;
  });

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    setIsLoading(true);

    const emoji = await fetchEmoji(newCategory);
    const fallbackEmoji = "📝";
    const validEmoji = isSingleEmoji(emoji) ? emoji : fallbackEmoji;

    // Save to self selected
    const existingSelfSelected = LocalStorageHelper.getSelfSelectedCategories() || [];
    const newCatObject = { id: Date.now(), title: newCategory, icon: validEmoji };
    const updatedSelfSelected = [...existingSelfSelected, newCatObject];
    LocalStorageHelper.saveSelfSelectedCategories(updatedSelfSelected);

    // Update local categories state
    setCategories(prev => [...prev, newCategory]);

    // Reset input and loading
    setNewCategory("");
    setIsLoading(false);

    // Trigger the parent's function to fetch RSS items for the new category
    if (typeof onNewCategoryAdded === 'function') {
      onNewCategoryAdded(newCategory);
    }
  }

  return (
    <>
     <SidebarWrapper>
  <MenuButton $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
    {isOpen ? <X size={24} /> : <Menu size={24} />}
  </MenuButton>
  
  <SidebarContent $isOpen={isOpen} style={{
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '1rem 2rem 2rem' // Reduced top padding
  }}> 



   
    <SidebarTitle style={{ marginTop: '1rem' }}>Selected Categories</SidebarTitle>
    
    <InputContainer style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}> 
      <Input
        type="text"
        placeholder="Add category..."
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <AddButton onClick={handleAddCategory} disabled={isLoading || !newCategory.trim()}>
        {isLoading ? "..." : "Add"}
      </AddButton>
    </InputContainer>
    
    {/* Scrollable area */}
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '5rem' }}>
  <CategoryList>
    {categories.map((category) => (
      <CategoryItem key={generateCategoryKey(category)}>
        {capitalizeAllWords(category)}
      </CategoryItem>
    ))}
  </CategoryList>
</div>
    {/* Fixed section at the bottom for action buttons */}
   


    <div style={{ marginTop: '1rem' }}>
      <ActionButtons results={results} $isOpen={isOpen} />
    </div>

   
  </SidebarContent>
  
</SidebarWrapper>


<MainContentWrapper $isOpen={isOpen}>
  {typeof children === 'function' ? children({ sidebarOpen: isOpen }) : childrenWithProps}
</MainContentWrapper>

    </>
  );
};

export default Sidebar;
