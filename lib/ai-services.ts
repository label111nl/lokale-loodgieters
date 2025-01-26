import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateBlogPost(topic: string, keywords: string[]) {
  const prompt = `Write a professional blog post about ${topic}. 
  Include these keywords: ${keywords.join(", ")}.
  The post should be informative, SEO-friendly, and written in Dutch.`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a professional plumbing industry content writer." },
      { role: "user", content: prompt },
    ],
  })

  return completion.choices[0].message.content
}

export async function prioritizeLeads(leads: any[]) {
  const prompt = `Analyze these plumbing service leads and prioritize them based on:
  1. Urgency of the problem
  2. Potential revenue
  3. Complexity of the job
  4. Customer location
  
  Leads: ${JSON.stringify(leads)}`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are an AI assistant specializing in lead prioritization for plumbing services." },
      { role: "user", content: prompt },
    ],
  })

  return JSON.parse(completion.choices[0].message.content)
}

export async function matchPlumberToLead(lead: any, plumbers: any[]) {
  const prompt = `Match the best plumber for this job based on:
  1. Plumber's expertise
  2. Location proximity
  3. Current workload
  4. Past performance
  
  Lead: ${JSON.stringify(lead)}
  Available Plumbers: ${JSON.stringify(plumbers)}`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are an AI assistant specializing in matching plumbers to service requests." },
      { role: "user", content: prompt },
    ],
  })

  return JSON.parse(completion.choices[0].message.content)
}

