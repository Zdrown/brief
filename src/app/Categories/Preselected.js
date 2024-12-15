/* none as of now  */
 
"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import LocalStorageHelper from "../../../utils/localStorageHelper";


const SectionWrapper = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.tan : theme.colors.darkBlue};
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.darkBlue : theme.text.primary};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.tan};
    color: ${({ theme }) => theme.colors.darkBlue};
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Emoji = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
  text-transform: capitalize;
`;

export default function Preselected() {
  const categories = [
    { id: 1, title: "Technology", icon: "💻" },
    { id: 2, title: "Health", icon: "🩺" },
    { id: 3, title: "Sports", icon: "🏀" },
    { id: 4, title: "Entertainment", icon: "🎬" },
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const savedCategories = LocalStorageHelper.getItem("selectedCategories") || [];
    setSelectedCategories(savedCategories);
  }, []);
  
  useEffect(() => {
    LocalStorageHelper.setItem("selectedCategories", selectedCategories);
  }, [selectedCategories]);

  const handleCategoryClick = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category.title)
        ? prevSelected.filter((title) => title !== category.title) // Remove if selected
        : [...prevSelected, category.title] // Add if not selected
    );
  };

  return (
    <SectionWrapper>
      <SectionTitle>Preselected Categories</SectionTitle>
      <CardGrid>
        {categories.map((category) => (
    <Card
    key={category.id}
    $isSelected={selectedCategories.includes(category.title)} // Use transient prop
    onClick={() => handleCategoryClick(category)}
  >
    <Emoji>{category.icon}</Emoji>
    <Title>{category.title}</Title>
  </Card>
  
        ))}
      </CardGrid>
    </SectionWrapper>
  );
}
