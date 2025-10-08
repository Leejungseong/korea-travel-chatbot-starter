import React from 'react'
import { useTranslation } from 'react-i18next'

const OPTIONS = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ar', label: 'العربية' }
]

export default function LanguageSelector() {
  const { i18n } = useTranslation()

  const handleChange = async (e) => {
    const lng = e.target.value
    await i18n.changeLanguage(lng)
  }

  return (
    <div style={{ textAlign: 'center', marginBottom: 12 }}>
      <select
        value={i18n.language}
        onChange={handleChange}
        style={{ padding: '8px 10px', borderRadius: 6, fontSize: 16 }}
      >
        {OPTIONS.map(o => (
          <option key={o.code} value={o.code}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
