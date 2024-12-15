/* news including: 
-physics
        twitter account
        somephyscs journal 
-math 
        somemathjournal 
       twitter account 
-economics -only update if there is a change in the 10yr treasury, interst rate
      twitter account, 
      nature 
-materail science 
      nature 
     twitter account
-robotics
    robotics site search
    twitter news 

-hackernews 

software and company news 
    twitter 
    techcrunch 

ai/ tech innovation news 
    twitter 

    medical innovation and device innovation 

    nueroscience / cellular biology/ genetics (biology)
           twitter accounts 

general twitter account - musk, rogan, peterson, lex fridman, ?? 
     - 


     categories : technology and software 
     - ai news 
     -medical/ healthtech news 
     -hardware
     -software and platforms 
     -twitter
     -robotics
     -energy systems 

     science and math 
     - material scince 
     -phsycs
     -math/ number theory 
     - hacker news 
     -twitter

     biology
     - cellular biology
     -genetics 
     -nueroscience 



     learn 

     math 
     -number thoery 
     -calculus 
     -trigonometry 
     -set theory 
     -group theory 

     science 
     -physics
     -comp science 
     -logic 
     -mechanical engineering 
     -material science 
     - chemistry 
     -economics 

     history and historic battles 



     biology 
     -nuero 
     -cellular pathwyas and cellular anamtomy 
     -genetics 


    

business 
     business leaders key characterists and examples 
     best products or softwares ever and why 

     lines from best songs 
     story telling best lines or scenes

     1 maybe edgy maybe not great joke 

 */"use client";
import { useState } from "react";
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

const FormContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.darkBlue};
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.tan};
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.darkBlue};
  color: ${({ theme }) => theme.text.primary};
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.tan};
    transform: scale(1.05);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.tan};
    cursor: not-allowed;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;



const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.primary};
  font-size: 1rem;
  cursor: pointer;
  visibility: hidden; /* Hide by default */
  transition: color 0.3s ease, transform 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.darkBlue};
    transform: scale(1.1);
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.darkBlue};
  color: ${({ theme }) => theme.text.primary};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    background-color: ${({ theme }) => theme.colors.tan};
    color: ${({ theme }) => theme.colors.darkBlue};

    ${DeleteButton} {
      visibility: visible; /* Show delete button only on hover */
    }
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

export default function SelfSelected() {
  const [input, setInput] = useState("");
  const [categories, setCategories] = useState(
    LocalStorageHelper.getItem("selfSelectedCategories") || []
  );
  const [loading, setLoading] = useState(false);

  const fetchEmoji = async (title) => {
    setLoading(true);
    try {
      const response = await fetch("/api/fetchEmoji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();
      return response.ok ? data.emoji || "📝" : "📝";
    } catch {
      return "📝";
    } finally {
      setLoading(false);
    }
  };
  const isSingleEmoji = (str) => {
    return /^(\p{Emoji}|\p{Regional_Indicator})+$/u.test(str);//validates the emoji to ensure the retured data from the model is valid
  };
  

  const handleAddCategory = async () => {
    if (input.trim() !== "") {
      const emoji = await fetchEmoji(input);
      const fallbackEmoji = "📝"; // Default fallback emoji
      const validEmoji = isSingleEmoji(emoji) ? emoji : fallbackEmoji;
  
      const newCategory = { id: Date.now(), title: input, icon: validEmoji };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      LocalStorageHelper.setItem("selfSelectedCategories", updatedCategories);
      setInput("");
    }
  };
  



  const handleDeleteCategory = (id) => {
    const updatedCategories = categories.filter((category) => category.id !== id);
    setCategories(updatedCategories);
    LocalStorageHelper.setItem("selfSelectedCategories", updatedCategories);
  };

  return (
    <SectionWrapper>
      <SectionTitle>Self Selected Categories</SectionTitle>
      <FormContainer>
        <Input
          type="text"
          placeholder="Enter a category..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={handleAddCategory} disabled={loading}>
          {loading ? "Loading..." : "Add"}
        </Button>
      </FormContainer>
      {categories.length === 0 ? (
        <p style={{ textAlign: "center", color: "#aaa" }}>
          Add categories to see them here.
        </p>
      ) : (
        <CardGrid>
          {categories.map((category) => (
            <Card key={category.id}>
             <DeleteButton onClick={() => handleDeleteCategory(category.id)}>
                X
              </DeleteButton>
              <Emoji>{category.icon}</Emoji>
              <Title>{category.title}</Title>
            </Card>
          ))}
        </CardGrid>
      )}
    </SectionWrapper>
  );
}
