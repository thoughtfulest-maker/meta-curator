"use client"

import { useEffect, useState, useMemo } from "react"
import Papa from "papaparse"

interface LogEntry {
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

  // CSV読み込み（public/data.csv）
  useEffect(() => {
    fetch("/data.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const results = Papa.parse(csvText, { header: true, skipEmptyLines: true })
        setEntries(results.data as LogEntry[])
      })
  }, [])

  // status=keep の行のみ
  const keepEntries = useMemo(() => entries.filter((entry) => entry.status === "keep"), [entries])

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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-2xl font-bold text-foreground">学習ログ</h1>

        {/* 学習バランス */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">学習バランス</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">全 {keepEntries.length} 件</p>
              {tagStats.map(({ tag, count, percentage }) => (
                <div key={tag} className="flex items-baseline gap-3">
                  <span className="font-medium text-foreground">{tag}</span>
                  <span className="text-sm text-muted-foreground">
                    {count}件 ({percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 記事一覧 */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Keep記事一覧</h2>
          <div className="space-y-4">
            {keepEntries.map((entry, index) => (
              <article key={index} className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-2 text-base font-semibold leading-relaxed text-foreground">{entry.title}</h3>

                <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-2 py-1 font-medium">{entry.tag}</span>
                  <span>{entry.source}</span>
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    リンク
                  </a>
                </div>

                {entry.memo && <p className="text-sm leading-relaxed text-muted-foreground">{entry.memo}</p>}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
