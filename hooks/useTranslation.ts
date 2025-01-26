import nl from "@/locales/nl.json"

export function useTranslation() {
  const t = (key: string, params?: Record<string, string>) => {
    const keys = key.split(".")
    let value: any = nl
    for (const k of keys) {
      value = value[k]
      if (!value) return key
    }
    if (typeof value === "string" && params) {
      return value.replace(/\{(\w+)\}/g, (_, key) => params[key] || `{${key}}`)
    }
    return value as string
  }

  return { t }
}

