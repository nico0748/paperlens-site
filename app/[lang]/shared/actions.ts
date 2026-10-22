"use server";

import { revalidatePath } from "next/cache";
import { defaultLocale, getDictionary, hasLocale } from "@/lib/i18n";
import { isValidId, storage } from "@/lib/storage";
import { getViewer } from "@/lib/viewer";

export type DeleteState = { error?: string; done?: boolean };

/** 共有データを消す。管理者だけ（Server Action も外から直接呼べるので、ここで必ず確かめる） */
export async function deleteShared(_prev: DeleteState, formData: FormData): Promise<DeleteState> {
  const lang = formData.get("lang");
  const t = getDictionary(hasLocale(lang) ? lang : defaultLocale).shared;
  const viewer = await getViewer();
  if (!viewer?.isAdmin) return { error: t.deleteForbidden };
  const id = formData.get("id");
  if (!isValidId(id)) return { error: t.deleteNotFound };
  try {
    await storage().remove(id);
  } catch {
    return { error: t.deleteFailed };
  }
  revalidatePath("/[lang]/shared", "page");
  return { done: true };
}
