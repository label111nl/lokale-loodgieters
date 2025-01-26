import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })

  const { data: post, error } = await supabase.from("blog_posts").select("*").eq("slug", params.slug).single()

  if (error || !post) {
    notFound()
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}

export async function generateStaticParams() {
  const supabase = createServerComponentClient({ cookies })

  const { data: blogPosts, error } = await supabase.from("blog_posts").select("slug").eq("is_published", true)

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }

  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

