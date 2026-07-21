import { supabase } from "./supabase";

export async function loadProgress() {
  const { data, error } = await supabase
    .from("memory_grid_progress")
    .select("*")
    .order("last_studied_at", { ascending: false });

  if (error) {
    console.error("Error loading progress:", error);
    return [];
  }

  return data.map((p) => ({ ...p, book_id: Number(p.book_id) }));
}

export async function saveProgress(translation, bookId, bookName, chapter) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const existing = await supabase
    .from("memory_grid_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("translation", translation)
    .eq("book_id", bookId)
    .eq("chapter", chapter)
    .maybeSingle();

  if (existing.data) {
    const { error } = await supabase
      .from("memory_grid_progress")
      .update({
        last_studied_at: new Date().toISOString(),
        times_studied: existing.data.times_studied + 1,
      })
      .eq("id", existing.data.id);

    if (error) console.error("Error updating progress:", error);
    return;
  }

  const { error } = await supabase.from("memory_grid_progress").insert({
    user_id: user.id,
    translation,
    book_id: bookId,
    book_name: bookName,
    chapter,
    status: "learning",
  });

  if (error) console.error("Error saving progress:", error);
}

export async function updateStatus(id, status) {
  const { error } = await supabase.from("memory_grid_progress").update({ status }).eq("id", id);

  if (error) console.error("Error updating status:", error);
}

export function calculateStreak(progress) {
  if (!progress || progress.length === 0) return 0;

  const studyDates = new Set(
    progress.map((p) => new Date(p.last_studied_at).toISOString().split("T")[0]),
  );

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (!studyDates.has(today) && !studyDates.has(yesterday)) return 0;

  let streak = 0;
  let current = new Date();

  if (!studyDates.has(today)) {
    current = new Date(Date.now() - 86400000);
  }

  while (true) {
    const dateStr = current.toISOString().split("T")[0];
    if (!studyDates.has(dateStr)) break;
    streak++;
    current = new Date(current.getTime() - 86400000);
  }

  return streak;
}

export async function clearMemoryGridProgress() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("memory_grid_progress").delete().eq("user_id", user.id);

  if (error) {
    console.error("Error clearing progress:", error);
    return false;
  }
  return true;
}
