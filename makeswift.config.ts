import type { RuntimeConfigs } from "@makeswift/runtime/next"

export default {
  apiKey: process.env.MAKESWIFT_API_KEY!,
} satisfies RuntimeConfigs

