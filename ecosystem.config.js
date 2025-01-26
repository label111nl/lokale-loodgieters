module.exports = {
  apps: [
    {
      name: "lokale-loodgieters",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        PORT: 3000,
        NODE_ENV: "production",
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        TELEGRAM_GROUP_ID: process.env.TELEGRAM_GROUP_ID,
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
      },
    },
  ],
}

