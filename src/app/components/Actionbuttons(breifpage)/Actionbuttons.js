import styled from 'styled-components';
import LocalStorageHelper from "../../../../utils/localStorageHelper";

const SidebarActions = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 20rem;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.backgrounds.primary};
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const ActionButton = styled.button`
  background-color: ${({ theme }) => theme.colors.darkBlue};
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryBlue};
  }
`;

const ActionButtons = ({ results, $isOpen }) => {
  const handleSaveBrief = () => {
    try {
      const existingBriefs = LocalStorageHelper.getItem("dailyBriefs") || [];
      const isoDateString = new Date().toISOString();
      const newBrief = {
        id: isoDateString,
        date: isoDateString,
        data: results,
      };
      existingBriefs.push(newBrief);
      LocalStorageHelper.setItem("dailyBriefs", existingBriefs);
      alert("Brief saved to local storage!");
    } catch (error) {
      console.error("Failed to save brief:", error);
    }
  };

  const handleShareBrief = async () => {
    if (!results || results.length === 0) {
      alert("No content available to share");
      return;
    }

    const shareText = results
      .map(
        (r) =>
          `Category: ${r.category}\nSummary: ${r.summary?.slice(0, 200)}...`
      )
      .join("\n\n");

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Daily Brief",
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // Only handle non-abort errors (AbortError means user cancelled)
        if (err.name !== 'AbortError') {
          // Fallback to clipboard if share fails for reason other than user cancellation
          try {
            await navigator.clipboard.writeText(shareText);
            alert("Copied to clipboard");
          } catch (clipboardErr) {
            console.error("Clipboard fallback failed:", clipboardErr);
          }
        }
      }
    } else {
      // If Web Share API is not available, use clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert("Copied to clipboard");
      } catch (err) {
        console.error("Clipboard write failed:", err);
      }
    }
  };

  return (
    <SidebarActions $isOpen={$isOpen}>
      <ActionButton onClick={handleSaveBrief}>Save Brief</ActionButton>
      <ActionButton onClick={handleShareBrief}>Share Brief</ActionButton>
    </SidebarActions>
  );
};

export default ActionButtons;