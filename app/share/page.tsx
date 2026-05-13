"use client";
import { toBase58 } from "util/base58";
import { useState, Fragment } from "react";
import { Cog6ToothIcon, ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { Title } from "@components/title";
import { FormFieldLabel, FormFieldShell } from "@components/form-field";
import { encrypt } from "pkg/encryption";
import { ErrorMessage } from "@components/error";
import { encodeCompositeKey } from "pkg/encoding";
import { LATEST_KEY_VERSION } from "pkg/constants";

const pageShell = "mx-auto max-w-3xl px-6 pb-20 pt-12 md:px-12 md:pt-16 lg:pt-20";

export default function Home() {
  const [text, setText] = useState("");
  const [reads, setReads] = useState(999);

  const [ttl, setTtl] = useState(7);
  const [ttlMultiplier, setTtlMultiplier] = useState(60 * 60 * 24);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [link, setLink] = useState("");

  const onSubmit = async () => {
    try {
      setError("");
      setLink("");
      setLoading(true);

      const { encrypted, iv, key } = await encrypt(text);

      const { id } = (await fetch("/api/v1/store", {
        method: "POST",
        body: JSON.stringify({
          ttl: ttl * ttlMultiplier,
          reads,
          encrypted: toBase58(encrypted),
          iv: toBase58(iv),
        }),
      }).then((r) => r.json())) as { id: string };

      const compositeKey = encodeCompositeKey(LATEST_KEY_VERSION, id, key);

      const url = new URL(window.location.href);
      url.pathname = "/unseal";
      url.hash = compositeKey;
      setCopied(false);
      setLink(url.toString());
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

      {link ? (
        <div className="flex flex-col items-center">
          <Title>Share this link with others</Title>
          <div className="mt-12 flex w-full max-w-full flex-col overflow-hidden rounded-lg border border-border shadow-sm sm:max-w-3xl sm:flex-row">
            <pre className="max-h-48 flex-1 overflow-x-auto overflow-y-auto bg-muted/30 px-4 py-3 text-center font-mono text-xs leading-relaxed text-foreground sm:text-sm">
              {link}
            </pre>
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-2 border-t border-border bg-muted px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-foreground transition hover:bg-accent sm:border-l sm:border-t-0"
              onClick={() => {
                navigator.clipboard.writeText(link);
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
            if (text.length <= 0) return;
            onSubmit();
          }}
        >
          <Title>Encrypt and Share</Title>

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

              <textarea
                id="text"
                name="text"
                value={text}
                minLength={1}
                onChange={(e) => setText(e.target.value)}
                rows={Math.max(5, text.split("\n").length)}
                placeholder="DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres"
                className="min-h-[8rem] w-full resize-y appearance-none border-0 bg-transparent px-3 py-1 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:ring-0"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-3">
            <div className="sm:col-span-3">
              <label
                htmlFor="file_input"
                className="flex min-h-[4.25rem] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-3 py-2 text-center transition hover:border-foreground/25 hover:bg-muted/40"
              >
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Upload file
                </span>
                <span className="mt-1 text-xs text-muted-foreground">Max 16 KB</span>
              </label>
              <input
                className="hidden"
                id="file_input"
                type="file"
                onChange={(e) => {
                  const file = e.target.files![0];
                  if (file.size > 1024 * 16) {
                    setError("File size must be less than 16kb");
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const t = ev.target!.result as string;
                    setText(t);
                  };
                  reader.readAsText(file);
                }}
              />
            </div>

            <div className="sm:col-span-4">
              <FormFieldShell className="min-h-[4.25rem]">
                <FormFieldLabel htmlFor="reads">Reads</FormFieldLabel>
                <input
                  type="number"
                  name="reads"
                  id="reads"
                  className="w-full appearance-none border-0 bg-transparent p-0 font-mono text-sm tabular-nums text-foreground focus:ring-0"
                  value={reads}
                  onChange={(e) => setReads(e.target.valueAsNumber)}
                />
              </FormFieldShell>
            </div>

            <div className="sm:col-span-5">
              <FormFieldShell className="relative min-h-[4.25rem]">
                <FormFieldLabel htmlFor="ttl">TTL</FormFieldLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="ttl"
                    id="ttl"
                    className="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 font-mono text-sm tabular-nums text-foreground focus:ring-0"
                    value={ttl}
                    onChange={(e) => setTtl(e.target.valueAsNumber)}
                  />
                  <div className="shrink-0 border-l border-border pl-2">
                    <label htmlFor="ttlMultiplier" className="sr-only">
                      TTL unit
                    </label>
                    <select
                      id="ttlMultiplier"
                      name="ttlMultiplier"
                      className="cursor-pointer appearance-none border-0 bg-transparent py-1 pr-6 font-mono text-xs uppercase tracking-wide text-muted-foreground focus:ring-0"
                      onChange={(e) => setTtlMultiplier(parseInt(e.target.value, 10))}
                      defaultValue={60 * 60 * 24}
                    >
                      <option value={60}>{ttl === 1 ? "Minute" : "Minutes"}</option>
                      <option value={60 * 60}>{ttl === 1 ? "Hour" : "Hours"}</option>
                      <option value={60 * 60 * 24}>{ttl === 1 ? "Day" : "Days"}</option>
                    </select>
                  </div>
                </div>
              </FormFieldShell>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || text.length <= 0}
            className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg border px-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] transition ${
              text.length <= 0
                ? "cursor-not-allowed border-border bg-muted text-muted-foreground"
                : "border-primary bg-primary text-primary-foreground hover:opacity-90"
            } ${loading ? "animate-pulse" : ""}`}
          >
            <span className="inline-flex items-center gap-2">
              {loading ? <Cog6ToothIcon className="h-5 w-5 animate-spin" /> : null}
              {loading ? "Encrypting…" : "Share"}
            </span>
          </button>

          <div className="mt-8 rounded-lg border border-border bg-muted/25 p-4">
            <ul className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <li>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground">
                  Reads
                </span>
                <p className="mt-1">
                  How many times the payload can be opened before it is removed. Use <span className="font-mono">0</span>{" "}
                  for unlimited.
                </p>
              </li>
              <li>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground">
                  TTL
                </span>
                <p className="mt-1">
                  Time-to-live before automatic deletion. Use <span className="font-mono">0</span> for no expiry.
                </p>
              </li>
              <li>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground">
                  Security
                </span>
                <p className="mt-1">
                  A new key is derived in your browser; only ciphertext is sent to the server.
                </p>
              </li>
            </ul>
          </div>
        </form>
      )}
    </div>
  );
}
