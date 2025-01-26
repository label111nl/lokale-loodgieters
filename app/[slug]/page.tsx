import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })

  console.log(`Fetching page with slug: ${params.slug}`)

  try {
    const { data: page, error } = await supabase.from("pages").select("*").eq("slug", params.slug).single()

    if (error) {
      console.error(`Error fetching page: ${error.message}`)
      throw error
    }

    if (!page) {
      console.log(`No page found with slug: ${params.slug}`)
      notFound()
    }

    console.log(`Page found: ${JSON.stringify(page)}`)

    return (
      <div>
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    )
  } catch (error) {
    console.error(`Unexpected error: ${error}`)
    throw error
  }
}

export async function generateStaticParams() {
  const supabase = createServerComponentClient({ cookies })

  try {
    const { data: pages, error } = await supabase.from("pages").select("slug").eq("is_published", true)

    if (error) {
      console.error(`Error fetching pages: ${error.message}`)
      return []
    }

    if (!pages || pages.length === 0) {
      console.log("No pages found")
      return []
    }

    console.log(`Found ${pages.length} pages`)

    return pages.map((page) => ({
      slug: page.slug,
    }))
  } catch (error) {
    console.error(`Unexpected error in generateStaticParams: ${error}`)
    return []
  }
}

