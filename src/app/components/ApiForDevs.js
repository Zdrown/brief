import { useState } from "react";
import styled, { css } from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { FaCopy } from "react-icons/fa";

export default function ApiPage() {
  const [activeTab, setActiveTab] = useState("python");
  const [justCopied, setJustCopied] = useState(false);
  

  const pythonCode = `from brief import Brief

client = Brief(
    api_key="YOUR_API_KEY",
)

client.text_to_speech.convert(
    voice_id="21m00Tcm4T1vDq8ikWAM",
    model_id="brief_multilingual_v2",
    text="Hello! 你好! Hola! नमस्ते! Bonjour! こんにちは! مرحبا! 안녕하세요!"
)`;

  const jsCode = `// Using "fetch" or any HTTP library:
const url = "https://api.brief.com/v1/text-to-speech/convert";
const payload = {
  voice_id: "21m00Tcm4T1vDq8ikWAM",
  model_id: "brief_multilingual_v2",
  text: "Hello! 你好! Hola! नमस्ते! Bonjour! こんにちは! مرحبا! 안녕하세요!"
};

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
  body: JSON.stringify(payload)
})
  .then(response => response.blob())
  .then(blob => {
    // handle audio blob
  });
`;

  const curlCode = `# Send a POST request with cURL
curl -X POST "https://api.brief.com/v1/text-to-speech/convert" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "voice_id": "21m00Tcm4T1vDq8ikWAM",
    "model_id": "brief_multilingual_v2",
    "text": "Hello! 你好! Hola! नमस्ते! Bonjour! こんにちは! مرحبا! 안녕하세요!"
}'`;

  function getSnippet() {
    switch (activeTab) {
      case "python":
        return { code: pythonCode, lang: "python" };
      case "js":
        return { code: jsCode, lang: "javascript" };
      case "curl":
        return { code: curlCode, lang: "bash" };
      default:
        return { code: pythonCode, lang: "python" };
    }
  }

  function copyToClipboard() {
    const { code } = getSnippet();
    navigator.clipboard.writeText(code).then(() => {
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    });
  }

  const { code, lang } = getSnippet();

  return (
    <ShowcaseRoot>
      <TextArea>
        <Subtitle> DEVELOPERS </Subtitle>
        <Title>Simple API Integrations</Title>
        <Paragraph>
          Experience our fast and simple Brief. News APIs <br />
        </Paragraph>

        <ButtonRow>
          <PrimaryButton type="button">Developer Guides</PrimaryButton>
          <SecondaryButton type="button">API Reference</SecondaryButton>
        </ButtonRow>
      </TextArea>

      <OuterGray>
        <IdeBox>
          <TabBar>
            <TabsLeft>
              <TabBtn
                $active={activeTab === "python"}
                onClick={() => setActiveTab("python")}
              >
                Python
              </TabBtn>
              <TabBtn
               $active={activeTab === "js"}
                onClick={() => setActiveTab("js")}
              >
                JavaScript
              </TabBtn>
              <TabBtn
             $active={activeTab === "curl"}
                onClick={() => setActiveTab("curl")}
              >
                cURL
              </TabBtn>
            </TabsLeft>

            <CopySection>
              {justCopied && <CopiedLabel>Copied!</CopiedLabel>}
              <CopyBtn type="button" onClick={copyToClipboard}>
                <FaCopy aria-label="Copy" />
              </CopyBtn>
            </CopySection>
          </TabBar>

          <CodeArea>
            <SyntaxHighlighter language={lang} style={vscDarkPlus}>
              {code}
            </SyntaxHighlighter>
          </CodeArea>
        </IdeBox>
      </OuterGray>
    </ShowcaseRoot>
  );
}

/* -- STYLED COMPONENTS -- */

const ShowcaseRoot = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 60px;
  margin: 150px auto;
  max-width: 1200px;
  padding: 0 50px;


  @media (max-width: 1200px) {
    /* Optional: Adjust text sizes */
    /* for example: h2 font-size or such if you want */
  }

  @media (max-width: 992px) {
    gap: 40px;
    margin: 60px auto;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 30px;
  }

  @media (max-width: 576px) {
    margin: 40px auto;
    padding: 0 20px;
  }
`;

const TextArea = styled.div`
  flex: 0 0 auto;
  max-width: 340px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Title = styled.h2`
  font-size: 2.7rem;
  margin: 0 0 10px 0;
  color: #22333B;

  @media (max-width: 1200px) {
    font-size: 2.4rem;
  }
  @media (max-width: 992px) {
    font-size: 2.2rem;
  }
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  @media (max-width: 576px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.h2`
font-size: .25rem;
color: #e1e3e4;
font-weight: ;
margin-bottom: -.5rem;
`

const Paragraph = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 0 0 20px 0;
  color:  #22333B;

  @media (max-width: 1200px) {
    font-size: 1.1rem;
  }
  @media (max-width: 992px) {
    font-size: 1rem;
  }
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`;

const PrimaryButton = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  color: #fff;

   ${({ $active }) =>
    $active &&
    css`
      
      color: #000;
    `}
`;


const SecondaryButton = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  background-color: #f5f5f5;
  color: #333;
`;

const OuterGray = styled.div`
  background-color: #e1e3e4;
  border-radius: 20px;
  /* Start with a generous padding for desktop */
  padding: 100px; 
  display: flex;
  justify-content: center;
  align-items: center;

  /* Remove fixed widths/heights, let content define it */
  width: auto;
  height: auto;

  /* Then reduce padding at narrower breakpoints */
  @media (max-width: 992px) {
    padding: 80px;
  }
  @media (max-width: 768px) {
    padding: 60px;
  }
  @media (max-width: 576px) {
    padding: 40px;
  }
`;

const IdeBox = styled.div`
  background-color: #1e1e1e;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Let it cap at 600px for large screens... */
  width: 600px;
  height: 300px;

  /* But reduce at each breakpoint. 
     If you want it to shrink below these, 
     use width: 100% and a max-width. */
  @media (max-width: 1200px) {
    width: 560px;
    height: 280px;
  }
  @media (max-width: 992px) {
    width: 520px;
    height: 260px;
  }
  @media (max-width: 768px) {
    width: 480px;
    height: 240px;
  }
  @media (max-width: 576px) {
    /* Let it shrink to parent’s width if narrower */
    width: 100%;
    max-width: 420px; 
    height: auto;
  }
`;

const TabBar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #2b2b2b;
  padding: 10px;
`;

const TabsLeft = styled.div`
  display: flex;
  gap: 8px;
`;

const TabBtn = styled.button`
  background-color: #444;
  color: #ddd;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.95rem;

  /* If “active” prop is true, apply active styling */
  ${({ $active }) =>
    $active &&
    css`
      
      color: #fff;
    `}
`;

const CopySection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CopiedLabel = styled.span`
  color: #fff;
  font-size: 0.9rem;
`;

const CopyBtn = styled.button`
  background-color: transparent;
  color: #ddd;
  border: 1px solid #666;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
`;

const CodeArea = styled.div`
  flex: 1;
  overflow: auto;
  padding: 10px;
`;
