"use client"

import { useState, useMemo } from "react"

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

// CSVデータをパースする関数
function parseCSV(csvText: string): LogEntry[] {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",")

  return lines.slice(1).map((line) => {
    const values = line.split(",")
    const entry: any = {}
    headers.forEach((header, index) => {
      entry[header.trim()] = values[index]?.trim() || ""
    })
    return entry as LogEntry
  })
}

export default function LearningLogPage() {
  // サンプルCSVデータ
  const csvData = `date,title,url,source,ai_point,memo,status,tag
2025/12/29,最新バイブコーディングツール徹底比較！開発時間を1/10にする魔法の杖はどれだ？,https://note.com/miccell/n/n38ed6ea27c09,note,"主張：エンジニアの役割は「コードを書くプログラマー」から、AIエージェントを指揮して成果物を検証する「一人CTO（プロダクトマネージャー兼QA）」へと劇的に変化している。新しい視点：AIを単なる補助ツールではなく、認知制御を譲渡して自律的に計画・実行・修正までを任せる「意思疎通（バイブス）で動く同僚」として捉え直している。読む価値がある人：溢れるAIツールの特性（拡張型vs創出型）や、進化したエージェント機能に伴うコスト・保守性リスクを構造的に理解し、自身の開発フェーズに最適な環境を選びたい人。",開発フェーズで最適な環境はどれか興味あり：バラバラだったものが整理された,keep,配置
2025/12/29,【完全解説】バイブコーディング学習ロードマップ 2025年12月版,https://note.com/masa_wunder/n/n77a02e758641,note,"主張：バイブコーディングは「単なるチャットでのコード生成」に留まらず、適切なツール選択とGit等のエンジニアリング基礎を段階的に学ぶことで、未経験者でも本格的なアプリ開発が可能になる。新しい視点：ChatGPT等の汎用AIツール、Lovable等の特化型Webビルダー、そしてGoogle AI Studioといった開発環境を、技術レベルや「バックエンドの要否」に応じて使い分ける具体的ロードマップを提示している。読む価値がある人：AIを使ってアプリを作ってみたいが、多すぎるツールの選び方や、初心者から一歩踏み出して本格的なサービス公開・管理を目指すための具体的な学習順序を知りたい人。",バイブコーディングの学習ロードマップとは：バラバラだったものが整理された,keep,配置`

  const [entries] = useState<LogEntry[]>(() => parseCSV(csvData))

  // status=keep の行のみをフィルタリング
  const keepEntries = useMemo(() => entries.filter((entry) => entry.status === "keep"), [entries])

  // タグの集計
  const tagStats = useMemo(() => {
    const tagCounts: Record<string, number> = {}
    keepEntries.forEach((entry) => {
      const tag = entry.tag || "未分類"
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })

    const total = keepEntries.length
    return Object.entries(tagCounts).map(([tag, count]) => ({
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
