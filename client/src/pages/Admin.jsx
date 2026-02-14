import React, { useEffect, useState } from "react";
import { apiBase, apiJson } from "../lib/api.js";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const nav = useNavigate();
  const [sources, setSources] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setErr("");
    try {
      const data = await apiJson("/api/kb/sources");
      setSources(data.sources || []);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function uploadPdf(file) {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("type", "pdf");
      fd.append("title", file.name);
      fd.append("file", file);

      const res = await fetch(`${apiBase()}/api/kb/upload`, {
        method: "POST",
        credentials: "include",
        body: fd
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Upload failed");
      }
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteSource(id) {
    if (!confirm("Delete this source and its vectors?")) return;
    await apiJson(`/api/kb/sources/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Knowledge Base</h1>
        <button className="px-3 py-2 rounded bg-slate-800" onClick={() => nav("/")}>Back</button>
      </div>

      <div className="mt-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h2 className="font-semibold">Upload PDF</h2>
        <p className="text-sm text-slate-400 mt-1">
          Upload PDFs. Text is extracted, chunked, embedded, and stored for RAG retrieval.
        </p>

        <input
          className="mt-3"
          type="file"
          accept="application/pdf"
          disabled={busy}
          onChange={(e) => e.target.files?.[0] && uploadPdf(e.target.files[0])}
        />

        {busy && <div className="text-slate-300 mt-2 text-sm">Indexing… please wait</div>}
        {err && <div className="text-red-400 mt-2 text-sm">{err}</div>}
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">Sources</h2>
        <div className="mt-3 space-y-2">
          {sources.map((s) => (
            <div key={s._id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between">
              <div>
                <div className="font-semibold">{s.title}</div>
                <div className="text-xs text-slate-400">
                  type={s.type} status={s.status} created={new Date(s.createdAt).toLocaleString()}
                </div>
                {s.error && <div className="text-xs text-red-400 mt-1">{s.error}</div>}
              </div>
              <button className="px-3 py-2 rounded bg-slate-800" onClick={() => deleteSource(s._id)}>
                Delete
              </button>
            </div>
          ))}
          {!sources.length && <div className="text-slate-400 text-sm">No sources uploaded yet.</div>}
        </div>
      </div>
    </div>
  );
}
