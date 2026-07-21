import { supabase } from "./supabase";
import { stripHtml } from "../utils/utils";

export function getVerse(verses, verseNumber, bookName, bookId, chapter, translation) {
  const verse = verses.find((v) => v.verse === verseNumber);
  if (!verse) return null;

  return {
    book: bookName,
    bookId: bookId,
    chapter: chapter,
    verse: verseNumber,
    text: stripHtml(verse.text).replace(/\n/g, " "),
    translation: translation,
  };
}

export async function loadDecks() {
  const { data, error } = await supabase
    .from("decks")
    .select("*, verses(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading decks:", error);
    return [];
  }

  return data;
}

export async function createDeck(name) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("decks")
    .insert({ name, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("Error creating deck:", error);
    return null;
  }

  return { ...data, verses: [] };
}

export async function deleteDeck(deckId) {
  const { error } = await supabase.from("decks").delete().eq("id", deckId);
  if (error) console.error("Error deleting deck:", error);
}

export async function addVerseToDeck(deckId, verse) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("verses")
    .insert({
      deck_id: deckId,
      user_id: user.id,
      book: verse.book,
      book_id: verse.bookId,
      chapter: verse.chapter,
      verse: verse.verse,
      text: verse.text,
      translation: verse.translation,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding verse:", error);
    return null;
  }

  return data;
}

export async function removeVerseFromDeck(verseId) {
  const { error } = await supabase.from("verses").delete().eq("id", verseId);
  if (error) console.error("Error removing verse:", error);
}

export async function clearAllDecks() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("decks").delete().eq("user_id", user.id);

  if (error) {
    console.error("Error clearing decks:", error);
    return false;
  }
  return true;
}
