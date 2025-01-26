import { execSync } from "child_process"
import fs from "fs"
import path from "path"

async function main() {
  try {
    console.log("🔄 Syncing environment variables with Vercel...")

    // Get project ID from vercel.json or .vercel/project.json
    let projectId = ""
    try {
      const vercelConfig = JSON.parse(fs.readFileSync(".vercel/project.json", "utf8"))
      projectId = vercelConfig.projectId
    } catch (error) {
      console.error("❌ Could not find Vercel project ID. Please run 'vercel link' first.")
      process.exit(1)
    }

    // Pull environment variables from Vercel
    console.log("📥 Pulling environment variables from Vercel...")
    execSync("vercel env pull .env.local", { stdio: "inherit" })

    // Verify required environment variables
    const requiredEnvVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "OPENAI_API_KEY",
      "TELEGRAM_BOT_TOKEN",
      "TELEGRAM_GROUP_ID",
    ]

    const envContent = fs.readFileSync(".env.local", "utf8")
    const missingVars = requiredEnvVars.filter((envVar) => !envContent.includes(envVar))

    if (missingVars.length > 0) {
      console.error("❌ Missing required environment variables in Vercel:")
      missingVars.forEach((envVar) => console.error(`   - ${envVar}`))
      process.exit(1)
    }

    console.log("✅ Environment variables synced successfully!")
    console.log("\n📝 Next steps:")
    console.log("1. Review your .env.local file")
    console.log("2. Restart your development server")
    console.log("3. Run 'vercel env push' if you need to push local changes to Vercel")
  } catch (error) {
    console.error("❌ Error syncing environment variables:", error)
    process.exit(1)
  }
}

main()

