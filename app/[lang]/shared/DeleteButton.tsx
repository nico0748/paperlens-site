"use client";

import { useActionState } from "react";
import { deleteShared, type DeleteState } from "./actions";

type Labels = { delete: string; deleting: string; label: string; confirm: string };

export function DeleteButton({ id, lang, labels }: { id: string; lang: string; labels: Labels }) {
  const [state, action, pending] = useActionState<DeleteState, FormData>(deleteShared, {});
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(labels.confirm)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="lang" value={lang} />
      <button type="submit" className="btn btn-danger" disabled={pending} aria-label={labels.label}>
        {pending ? labels.deleting : labels.delete}
      </button>
      {state.error && (
        <p className="field-error" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
