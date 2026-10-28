"use client";

import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";

type Listing = {
  title: string;
  descriptionHtml: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="text-xs text-blue-600 hover:underline"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded border p-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase text-gray-500">{label}</span>
        <CopyButton text={value} />
      </div>
      <p className={mono ? "whitespace-pre-wrap font-mono text-sm" : "text-sm"}>{value}</p>
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState({ productName: "", details: "", keywords: "", tone: "" });
  const [result, setResult] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full rounded border p-2 text-sm";

  return (
    <main className="mx-auto grid max-w-6xl gap-8 p-6 md:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="text-2xl font-bold">SEO Listing Generator</h1>

        <input
          className={inputCls}
          placeholder="Product name (optional)"
          value={form.productName}
          onChange={update("productName")}
        />

        <textarea
          className={inputCls}
          rows={10}
          required
          placeholder="Paste raw product details: specs, materials, sizes, features, supplier notes…"
          value={form.details}
          onChange={update("details")}
        />

        <input
          className={inputCls}
          placeholder="Target keywords, comma-separated (optional)"
          value={form.keywords}
          onChange={update("keywords")}
        />

        <input
          className={inputCls}
          placeholder="Tone, e.g. luxury, playful, technical (optional)"
          value={form.tone}
          onChange={update("tone")}
        />

        <button
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate listing"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <section className="space-y-3">
        {result && (
          <>
            <Field label={`Title (${result.title.length} chars)`} value={result.title} />

            <div className="rounded border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-gray-500">
                  Description (preview)
                </span>
                <CopyButton text={result.descriptionHtml} />
              </div>
              
            <div className="prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_h2]:font-semibold [&_h3]:font-semibold" dangerouslySetInnerHTML={{ __html: result.descriptionHtml }} />

            <Field label="Description (HTML source)" value={result.descriptionHtml} mono />
            <Field label={`Meta title (${result.metaTitle.length} chars)`} value={result.metaTitle} />
            <Field
              label={`Meta description (${result.metaDescription.length} chars)`}
              value={result.metaDescription}
            />
            <Field label="Keywords" value={result.keywords.join(", ")} />
          </>
        )}
      </section>
    </main>
  );
}