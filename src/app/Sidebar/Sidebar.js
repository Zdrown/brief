"use client";
import styled from 'styled-components';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import ActionButtons from '../components/Actionbuttons(breifpage)/Actionbuttons';
import LocalStorageHelper from '../../../utils/localStorageHelper';
import React from 'react';

// -------------- STYLED COMPONENTS --------------
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
  padding: 1rem 2rem 2rem;
  overflow-y: auto;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1rem;
`;
const DeleteButton = styled.button`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color:${({ theme }) => theme.colors.darkBlue};
 font-size: 1.5rem;
  cursor: pointer;
  
  }
`;

const CategoryItem = styled.div`
  position: flex;
  align-items: center;
  padding: 1.2rem 1.5rem;
  justify-content: space-between;
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
      ${DeleteButton} {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease-in-out;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.tan};
    transform: translateX(5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);

    // Show the delete button on hover
    ${DeleteButton} {
      opacity: 1;
      pointer-events: auto;
    }
  }
`;



const MainContentWrapper = styled.div`
  transition: margin-left 0.3s ease;
  margin-left: ${({ $isOpen }) => ($isOpen ? '20rem' : '0')};
  width: ${({ $isOpen }) => ($isOpen ? 'calc(100% - 20rem)' : '100%')};
`;

const SidebarTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.backgrounds.secondary};
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
  width: 3vw;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryBlue};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// -------------- UTILS --------------
function capitalizeAllWords(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const generateCategoryKey = (title) =>
  `category-${title.toLowerCase().replace(/\s+/g, '-')}`;

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

// -------------- COMPONENT --------------
const Sidebar = ({ children, results, onNewCategoryAdded }) => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Initialize local state with a combined array of objects:
   * {
   *   title: string,
   *   icon: string (only for self-selected),
   *   isPreselected: boolean
   * }
   */
  const [categories, setCategories] = useState(() => {
    // Preselected categories are stored as an array of strings
    const preselected = LocalStorageHelper.getPreselectedCategories(); // e.g. ["Tech", "Sports"]
    
    // Self-selected categories are stored as an array of objects
    // e.g. [{ id: 123, title: "My Category", icon: "📝" }]
    const selfSelected = LocalStorageHelper.getSelfSelectedCategories();

    // Convert preselected array of strings -> array of objects with isPreselected = true
    const preselectedObjects = preselected.map((catTitle) => ({
      title: catTitle,
      // You may not have an icon for preselected, so we can store a default or empty
      icon: "", 
      isPreselected: true,
    }));

    // For self selected, just attach isPreselected: false
    const selfSelectedObjects = selfSelected.map((catObj) => ({
      ...catObj,
      isPreselected: false,
    }));

    // Merge them into a single array
    return [...preselectedObjects, ...selfSelectedObjects];
  });

  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If children is a function, we pass it a "sidebarOpen" prop; otherwise, we clone
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { sidebarOpen: isOpen });
    }
    return child;
  });

  /**
   * Add a new category to "self-selected"
   */
  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    setIsLoading(true);

    const emoji = await fetchEmoji(newCategory);
    const fallbackEmoji = "📝";
    const validEmoji = isSingleEmoji(emoji) ? emoji : fallbackEmoji;

    // Build a new object for self-selected
    const newCatObject = { 
      id: Date.now(), 
      title: newCategory, 
      icon: validEmoji,
      isPreselected: false,
    };

    // Save to local storage (self-selected array)
    const existingSelfSelected = LocalStorageHelper.getSelfSelectedCategories() || [];
    const updatedSelfSelected = [...existingSelfSelected, newCatObject];
    LocalStorageHelper.saveSelfSelectedCategories(updatedSelfSelected);

    // Update local state
    setCategories((prev) => [...prev, newCatObject]);

    // Reset input / loading
    setNewCategory("");
    setIsLoading(false);

    // Trigger parent's callback, if provided
    if (typeof onNewCategoryAdded === 'function') {
      onNewCategoryAdded(newCategory);
    }
  }

  /**
   * Delete a category from both the UI state and localStorage.
   * We check the `isPreselected` flag to see where it should be removed.
   */
  function handleDeleteCategory(catObj) {
    const { title, isPreselected } = catObj;

    // 1) Remove from local state
    setCategories((prev) => prev.filter((c) => c.title !== title));

    // 2) Remove from localStorage
    if (isPreselected) {
      // It's from the preselected array (strings)
      const existingPreselected = LocalStorageHelper.getPreselectedCategories();
      const updatedPreselected = existingPreselected.filter((catTitle) => catTitle !== title);
      LocalStorageHelper.savePreselectedCategories(updatedPreselected);
    } else {
      // It's from self-selected array (objects)
      const existingSelfSelected = LocalStorageHelper.getSelfSelectedCategories();
      const updatedSelfSelected = existingSelfSelected.filter((item) => item.title !== title);
      LocalStorageHelper.saveSelfSelectedCategories(updatedSelfSelected);
    }
  }

  return (
    <>
      <SidebarWrapper>
        <MenuButton $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </MenuButton>

        <SidebarContent
          $isOpen={isOpen}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '1rem 2rem 2rem'
          }}
        >
          <SidebarTitle style={{ marginTop: '1rem' }}>
            Selected Categories
          </SidebarTitle>

          <InputContainer style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            <Input
              type="text"
              placeholder="Add category..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <AddButton
              onClick={handleAddCategory}
              disabled={isLoading || !newCategory.trim()}
            >
              {isLoading ? "..." : "Add"}
            </AddButton>
          </InputContainer>

          {/* Scrollable area */}
          <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '5rem' }}>
            <CategoryList>
              {categories.map((catObj) => (
                <CategoryItem key={generateCategoryKey(catObj.title)}>
                 {catObj.icon && `${catObj.icon} `} 
                  {capitalizeAllWords(catObj.title)}

                  <DeleteButton onClick={() => handleDeleteCategory(catObj)}>
                    &times;
                  </DeleteButton>
                </CategoryItem>
              ))}
            </CategoryList>
          </div>

          {/* Bottom section for action buttons (like 'Save' or 'Publish') */}
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
