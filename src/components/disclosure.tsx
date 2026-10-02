"use client";

import { useId, useState } from "react";
import { IconChevronDown } from "./icons";

/** Accessible expand/collapse with a calm height transition. */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
}: {
  summary: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-start gap-4 rounded-2xl py-3 text-left"
      >
        {summary}
        <IconChevronDown
          size={20}
          className={`mt-1.5 shrink-0 text-ink-3 transition-transform duration-500 group-hover:text-ink ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div id={id} className="grid-collapse" data-open={open}>
        <div>{open && children}</div>
      </div>
    </div>
  );
}
