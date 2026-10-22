"use client";

import { useActionState } from "react";
import { deleteShared, type DeleteState } from "./actions";

export function DeleteButton({ id, title }: { id: string; title: string }) {
  const [state, action, pending] = useActionState<DeleteState, FormData>(deleteShared, {});
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`「${title}」を削除します。元に戻せません。よろしいですか？`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-danger" disabled={pending} aria-label={`「${title}」を削除`}>
        {pending ? "削除しています…" : "削除"}
      </button>
      {state.error && (
        <p className="field-error" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
