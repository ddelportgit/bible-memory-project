import { createContext, useContext, useState, useEffect } from "react";
import { loadDecks } from "../utils/flashCardUtils.js";

const FlashCardContext = createContext(null);

export function FlashCardProvider({ children }) {
  const [decks, setDecks] = useState([]);
  const [activeDeck, setActiveDeck] = useState(null);
  const [view, setView] = useState("decks");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDecks() {
      setLoading(true);
      const data = await loadDecks();
      setDecks(data);
      setLoading(false);
    }
    fetchDecks();
  }, []);

  return (
    <FlashCardContext.Provider
      value={{
        decks,
        setDecks,
        activeDeck,
        setActiveDeck,
        view,
        setView,
        loading,
        setLoading,
      }}
    >
      {children}
    </FlashCardContext.Provider>
  );
}

export function useFlashCards() {
  return useContext(FlashCardContext);
}
