import { createContext, useContext } from 'react'
import type { BlogPostMeta } from './blog'

const BlogPostMetaContext = createContext<BlogPostMeta | null>(null)

export const BlogPostMetaProvider = BlogPostMetaContext.Provider

export function useBlogPostMeta(): BlogPostMeta | null {
  return useContext(BlogPostMetaContext)
}
