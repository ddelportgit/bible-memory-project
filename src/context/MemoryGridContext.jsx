import { createContext, useContext, useState } from "react";

const MemoryGridContext = createContext(null);

export function MemoryGridProvider({ children }) {
  const [translation, setTranslation] = useState("KJV");
  const [bookId, setBookId] = useState("");
  const [chapter, setChapter] = useState(1);
  const [chapterData, setChapterData] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [progress, setProgress] = useState(null);

  return (
    <MemoryGridContext.Provider
      value={{
        translation,
        setTranslation,
        bookId,
        setBookId,
        chapter,
        setChapter,
        chapterData,
        setChapterData,
        chunks,
        setChunks,
        progress,
        setProgress,
      }}
    >
      {children}
    </MemoryGridContext.Provider>
  );
}

export function useMemoryGrid() {
  return useContext(MemoryGridContext);
}
