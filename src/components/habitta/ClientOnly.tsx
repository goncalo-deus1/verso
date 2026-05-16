import { useState, useEffect, type ReactNode } from 'react'

/**
 * ClientOnly — renders children only after first client mount.
 *
 * Use this to wrap components that depend on browser APIs, auth context,
 * Supabase, or anything that can't run during renderToString. The static
 * prerendered HTML omits the children; once React hydrates / mounts on
 * the client, useEffect fires and the children appear.
 *
 * SEO impact: the wrapped content is invisible to crawlers that don't
 * execute JS. Use ClientOnly only for interactive widgets, not for
 * primary content.
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  return <>{mounted ? children : fallback}</>
}
