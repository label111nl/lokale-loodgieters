const fs = require("fs")
const path = require("path")

const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_GROUP_ID",
]

function validateEnv() {
  // Check if .env.local exists
  const envPath = path.join(process.cwd(), ".env.local")
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env.local file not found")
    console.log("💡 Run 'npm run sync-env' to sync environment variables from Vercel")
    process.exit(1)
  }

  // Read .env.local
  const envContent = fs.readFileSync(envPath, "utf8")
  const envVars = {}

  // Parse environment variables
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      envVars[match[1]] = match[2]
    }
  })

  // Check for missing variables
  const missing = requiredEnvVars.filter((key) => !envVars[key])

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:")
    missing.forEach((key) => console.error(`   - ${key}`))
    console.log("\n💡 Run 'npm run sync-env' to sync environment variables from Vercel")
    process.exit(1)
  }

  // Validate format of specific variables
  if (envVars.NEXT_PUBLIC_SUPABASE_URL && !envVars.NEXT_PUBLIC_SUPABASE_URL.startsWith("https://")) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL must start with https://")
    process.exit(1)
  }

  console.log("✅ All required environment variables are present and valid!")
}

validateEnv()

