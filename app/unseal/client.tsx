"use client";
import React, { Fragment, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

import { Title } from "@components/title";

import { decodeCompositeKey } from "pkg/encoding";
import { decrypt } from "pkg/encryption";

type Props = {
  compositeKey?: string;
};
export const Client: React.FC<Props> = ({ compositeKey: _compositeKey }) => {
  const [compositeKey, setCompositeKey] = useState(_compositeKey ?? "");

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingReads, setRemainingReads] = useState<number | null>(null);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    try {
      setError("");
      setText("");
      setLoading(true);

      const { id, encryptionKey } = decodeCompositeKey(compositeKey);

      const res = (await fetch(`/api/v1/load?id=${id}`).then((r) => r.json())) as {
        iv: string;
        encrypted: string;
        remainingReads: number | null;
      };
      setRemainingReads(res.remainingReads);

      const decrypted = await decrypt(res.encrypted, encryptionKey, res.iv);

      setText(decrypted);
    } catch (e) {
      console.error(e);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-8 mx-auto mt-16 lg:mt-32 ">
      {text ? (
        <div className="">
          {remainingReads !== null ? (
            <div className="text-sm text-center text-zinc-600">
              {remainingReads > 0 ? (
                <p>
                  This document can be read <span className="text-zinc-100">{remainingReads}</span> more times.
                </p>
              ) : (
                <p className="text-zinc-400">
                  This was the last time this document could be read. It was deleted from storage.
                </p>
              )}
            </div>
          ) : null}
          <pre className="px-4 py-3 mt-8 font-mono text-left bg-transparent border rounded border-zinc-600 focus:border-zinc-100/80 focus:ring-0 sm:text-sm text-zinc-100">
            <div className="flex items-start px-1 text-sm">
              <div aria-hidden="true" className="pr-4 font-mono border-r select-none border-zinc-300/5 text-zinc-700">
                {Array.from({
                  length: text.split("\n").length,
                }).map((_, index) => (
                  <Fragment key={index}>
                    {(index + 1).toString().padStart(2, "0")}
                    <br />
                  </Fragment>
                ))}
              </div>
              <div>
                {text.split("\n").map((line) => {
                  return (
                    <pre className="flex overflow-x-auto">
                      <code className="px-4 text-left">{line}</code>
                    </pre>
                  );
                })}
              </div>
            </div>
          </pre>
        </div>
      ) : (
        <form
          className="max-w-3xl mx-auto "
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Title>Decrypt a document</Title>

          <div className="px-3 py-2 mt-8 border rounded border-zinc-600 focus-within:border-zinc-100/80 focus-within:ring-0 ">
            <label htmlFor="id" className="block text-xs font-medium text-zinc-100">
              ID
            </label>
            <input
              type="text"
              name="compositeKey"
              id="compositeKey"
              className="w-full p-0 text-base bg-transparent border-0 appearance-none text-zinc-100 placeholder-zinc-500 focus:ring-0 sm:text-sm"
              value={compositeKey}
              onChange={(e) => setCompositeKey(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-8 w-full h-12 inline-flex justify-center items-center  transition-all  rounded px-4 py-1.5 md:py-2 text-base font-semibold leading-7 text-zinc-800   bg-zinc-200 ring-1  duration-300  hover:text-black hover:drop-shadow-cta   hover:bg-white ${
              loading ? "animate-pulse" : ""
            }`}
          >
            <span>{loading ? <Cog6ToothIcon className="w-5 h-5 animate-spin" /> : "Unseal"}</span>
          </button>
        </form>
      )}
    </div>
  );
};
