"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AddUrlPage() {
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setStatus("saving")
    setErrorMessage("")

    const { data, error } = await supabase
      .from("learning_logs") // Supabase のテーブル名
      .insert([
        {
          url,
          status: "keep",
          },
      ])

    if (error) {
      setStatus("error")
      setErrorMessage(error.message)
    } else {
      setStatus("success")
      setUrl("") // 入力欄クリア
    }
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="mb-6 text-2xl font-bold">記事 URL 登録</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="url"
          placeholder="記事の URL を入力"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={status === "saving"}
        >
          {status === "saving" ? "登録中…" : "登録"}
        </button>
      </form>

      {status === "success" && <p className="mt-4 text-green-600">登録に成功しました！</p>}
      {status === "error" && <p className="mt-4 text-red-600">{errorMessage}</p>}
    </div>
  )
}
