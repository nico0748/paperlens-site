"use server";

import { revalidatePath } from "next/cache";
import { isValidId, storage } from "@/lib/storage";
import { getViewer } from "@/lib/viewer";

export type DeleteState = { error?: string; done?: boolean };

/** 共有データを消す。管理者だけ（Server Action も外から直接呼べるので、ここで必ず確かめる） */
export async function deleteShared(_prev: DeleteState, formData: FormData): Promise<DeleteState> {
  const viewer = await getViewer();
  if (!viewer?.isAdmin) return { error: "削除は管理者だけができます。" };
  const id = formData.get("id");
  if (!isValidId(id)) return { error: "削除するデータが見つかりません。" };
  try {
    await storage().remove(id);
  } catch {
    return { error: "削除に失敗しました。時間をおいてもう一度お試しください。" };
  }
  revalidatePath("/shared");
  return { done: true };
}
