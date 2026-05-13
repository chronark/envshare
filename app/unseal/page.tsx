"use client";
import React, { Fragment, useState, useEffect } from "react";
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

import { Title } from "@components/title";
import { FormFieldLabel, FormFieldShell } from "@components/form-field";

import { decodeCompositeKey } from "pkg/encoding";
import { decrypt } from "pkg/encryption";
import Link from "next/link";
import { ErrorMessage } from "@components/error";

const pageShell = "mx-auto max-w-3xl px-6 pb-20 pt-12 md:px-12 md:pt-16 lg:pt-20";

const actionGhost =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-foreground shadow-sm transition hover:bg-muted/60";

const actionPrimary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-4 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-sm transition hover:opacity-90";

export default function Unseal() {
  const [compositeKey, setCompositeKey] = useState<string>("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCompositeKey(window.location.hash.replace(/^#/, ""));
    }
  }, []);

  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [remainingReads, setRemainingReads] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onSubmit = async () => {
    try {
      setError(null);
      setText(null);
      setLoading(true);

      if (!compositeKey) {
        throw new Error("No id provided");
      }

      const { id, encryptionKey, version } = decodeCompositeKey(compositeKey);
      const res = await fetch(`/api/v1/load?id=${id}`);
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const json = (await res.json()) as {
        iv: string;
        encrypted: string;
        remainingReads: number | null;
      };
      setRemainingReads(json.remainingReads);

      const decrypted = await decrypt(json.encrypted, encryptionKey, json.iv, version);

      setText(decrypted);
    } catch (e) {
      console.error(e);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={pageShell}>
      {error ? <ErrorMessage message={error} /> : null}
      {text ? (
        <div className="mx-auto max-w-4xl">
          {remainingReads !== null ? (
            <div className="text-center text-sm text-muted-foreground">
              {remainingReads > 0 ? (
                <p>
                  This document can be read{" "}
                  <span className="font-mono font-semibold tabular-nums text-foreground">{remainingReads}</span> more
                  times.
                </p>
              ) : (
                <p>This was the last time this document could be read. It was deleted from storage.</p>
              )}
            </div>
          ) : null}
          <div className="mt-8 overflow-hidden rounded-lg border border-border bg-muted/25 shadow-sm">
            <div className="flex items-start px-1 py-3 text-sm">
              <div
                aria-hidden="true"
                className="select-none border-r border-border px-3 font-mono text-xs leading-[1.65] text-muted-foreground"
              >
                {Array.from({
                  length: text.split("\n").length,
                }).map((_, index) => (
                  <Fragment key={index}>
                    {(index + 1).toString().padStart(2, "0")}
                    <br />
                  </Fragment>
                ))}
              </div>
              <pre className="m-0 max-h-[min(70vh,28rem)] flex-1 overflow-x-auto overflow-y-auto whitespace-pre-wrap px-3 py-1 font-mono text-sm text-foreground">
                <code>{text}</code>
              </pre>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <Link href="/share" className={actionGhost}>
              Share another
            </Link>
            <button
              type="button"
              className={actionPrimary}
              onClick={() => {
                navigator.clipboard.writeText(text);
                setCopied(true);
              }}
            >
              {copied ? (
                <ClipboardDocumentCheckIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5" aria-hidden="true" />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      ) : (
        <form
          className="mx-auto max-w-3xl"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Title>Decrypt a document</Title>

          <FormFieldShell className="mt-8">
            <FormFieldLabel htmlFor="compositeKey">Composite key</FormFieldLabel>
            <input
              type="text"
              name="compositeKey"
              id="compositeKey"
              className="w-full appearance-none border-0 bg-transparent p-0 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:ring-0"
              placeholder="Paste key from the share link, or open a link with #…"
              value={compositeKey}
              onChange={(e) => setCompositeKey(e.target.value)}
            />
          </FormFieldShell>

          <button
            type="submit"
            disabled={loading}
            className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg border border-primary bg-primary px-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:opacity-90 ${
              loading ? "animate-pulse" : ""
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {loading ? <Cog6ToothIcon className="h-5 w-5 animate-spin" /> : null}
              {loading ? "Decrypting…" : "Unseal"}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
