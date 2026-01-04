"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "../lib/supabaseClient"

interface LogEntry {
  id: number
  date: string
  title: string
  url: string
  source: string
  ai_point: string
  memo: string
  status: string
  tag: string
}

export default function LearningLogPage() {
  const [entries, setEntries] = useState<LogEntry[]>([])

  // Supabase からデータ取得
  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase.from("learning_logs").select("*")
      if (error) {
        console.error("Supabase fetch error:", error)
      } else {
        // デフォルト値を補完
        const safeData = (data || []).map((entry: any) => ({
          id: entry.id,
          date: entry.date || "",
          title: entry.title || "(タイトル未設定)",
          url: entry.url || "#",
          source: entry.source || "(不明)",
          ai_point: entry.ai_point || "",
          memo: entry.memo || "",
          status: entry.status || "keep",
          tag: entry.tag || "未分類",
        }))
        setEntries(safeData)
        console.log("Supabase fetch data:", safeData)
      }
    }
    fetchEntries()
  }, [])

  // status=keep の行のみ
  const keepEntries = useMemo(() => {
    return entries.filter((entry) => {
      const status = entry.status ?? "keep"
      return status === "keep"
    })
  }, [entries])

  // タグ集計
  const tagStats = useMemo(() => {
    const counts: Record<string, number> = {}
    keepEntries.forEach((entry) => {
      const tag = entry.tag || "未分類"
      counts[tag] = (counts[tag] || 0) + 1
    })
    const total = keepEntries.length
    return Object.entries(counts).map(([tag, count]) => ({
      tag,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
  }, [keepEntries])

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-2xl font-bold">学習ログ</h1>

        {/* 学習バランス */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">学習バランス</h2>
          <div className="rounded-lg border border-gray-300 bg-white p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">全 {keepEntries.length} 件</p>
              {tagStats.map(({ tag, count, percentage }) => (
                <div key={tag} className="flex items-baseline gap-3">
                  <span className="font-medium">{tag}</span>
                  <span className="text-sm text-gray-600">
                    {count}件 ({percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 記事一覧 */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Keep記事一覧</h2>
          <div className="space-y-4">
            {keepEntries.map((entry) => (
              <article key={entry.id} className="rounded-lg border border-gray-300 bg-white p-6">
                <h3 className="mb-2 text-base font-semibold leading-relaxed">{entry.title}</h3>

                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                  <span className="rounded bg-gray-200 px-2 py-1 font-medium">{entry.tag}</span>
                  <span>{entry.source}</span>
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-900"
                  >
                    リンク
                  </a>
                </div>

                {entry.memo && <p className="text-sm leading-relaxed text-gray-700">{entry.memo}</p>}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
