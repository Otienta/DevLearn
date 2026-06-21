'use client'

import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export function CodeBlock({ code, language = 'text', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function copyCode(): Promise<void> {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{language}</span>
          {filename && <span className="text-slate-500">· {filename}</span>}
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          {copied ? 'Copié' : 'Copier'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  )
}
