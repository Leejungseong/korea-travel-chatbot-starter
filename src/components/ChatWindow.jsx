import React, { useState, useRef } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

export default function ChatWindow({ messages, setMessages }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { t, i18n } = useTranslation()
  const messagesRef = useRef(null)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      // 서버의 /api/chat 엔드포인트로 요청
      const res = await axios.post('/api/chat', { message: input, lang: i18n.language })
      const botText = res.data.reply
      setMessages((m) => [...m, { role: 'assistant', text: botText }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Error: could not get reply.' }])
    } finally {
      setLoading(false)
      setTimeout(() => messagesRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'msg user' : 'msg bot'}>{m.text}</div>
        ))}
        <div ref={messagesRef} />
      </div>

      <div className="composer">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('ask_example')} />
        <button onClick={send} disabled={loading}>{loading ? '...' : 'Send'}</button>
      </div>
    </div>
  )
}
