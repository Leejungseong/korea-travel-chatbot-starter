import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import ko from './locales/ko.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import ar from './locales/ar.json'

const resources = {
  en: { translation: en },
  ko: { translation: ko },
  ja: { translation: ja },
  zh: { translation: zh },
  fr: { translation: fr },
  de: { translation: de },
  ar: { translation: ar }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

// 언어 변경시 문서 속성 조정 (RTL 처리 포함)
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
  if (lng === 'ar') {
    document.documentElement.dir = 'rtl'
    document.body.style.textAlign = 'right'
  } else {
    document.documentElement.dir = 'ltr'
    document.body.style.textAlign = 'left'
  }
})

export default i18n
