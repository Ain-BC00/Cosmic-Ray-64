import { Children, cloneElement, createContext, isValidElement, ReactElement, ReactNode, useContext, useEffect, useState } from 'react'
import { english, restoreUserText, userText } from './translations'
type Language = 'es' | 'en'
const LanguageContext = createContext({ language: 'es' as Language, setLanguage: (_language: Language) => {} })
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => { try { return localStorage.getItem('cosmic-language') === 'en' ? 'en' : 'es' } catch { return 'es' } })
  useEffect(() => { document.documentElement.lang = language; document.title = language === 'en' ? 'Cosmic Ray 64 · Crew wellbeing' : 'Cosmic Ray 64 · Bienestar de la tripulación'; try { localStorage.setItem('cosmic-language', language) } catch { /* La interfaz sigue disponible. */ } }, [language])
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}
export function useLanguage() {
  const { language, setLanguage } = useContext(LanguageContext)
  const t = (text: string) => language === 'en' ? english(text) : text
  // Translate React text before rendering. Never mutate the DOM or input values.
  const view = (node: ReactNode): ReactNode => {
    if (language === 'es') return node
    if (typeof node === 'string') return t(node)
    if (Array.isArray(node)) return Children.map(node, child => view(child))
    if (!isValidElement(node)) return node
    const element = node as ReactElement<Record<string, unknown>>
    if (element.props['data-user-content']) return element
    const props: Record<string, unknown> = {}
    for (const key of ['aria-label', 'placeholder', 'title', 'name']) if (typeof element.props[key] === 'string') props[key] = t(element.props[key] as string)
    // Option values remain stable across languages, including implicit values.
    if (element.type === 'option' && element.props.value === undefined && typeof element.props.children === 'string') props.value = element.props.children
    if (element.type !== 'pre' && element.type !== 'textarea') props.children = view(element.props.children as ReactNode)
    return cloneElement(element, props)
  }
  const reportText = (text: string) => restoreUserText(t(text))
  return { language, setLanguage, t, view, reportText, userText }
}
export function LanguagePicker() {
  const { language, setLanguage } = useLanguage()
  return <label className="language-picker"><span>{language === 'es' ? 'Idioma' : 'Language'}</span><select aria-label={language === 'es' ? 'Idioma' : 'Language'} value={language} onChange={e => setLanguage(e.target.value as Language)}><option value="es">{language === 'es' ? 'Español' : 'Spanish'}</option><option value="en">English</option></select></label>
}
