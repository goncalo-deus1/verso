/**
 * Wordmark — the Habitta logotype.
 * Set in Fraunces weight 300, lowercase, with the central "tt" in telha italic.
 * Font size is controlled entirely by the parent element.
 *
 * variant="navbar" applies the larger navbar-specific sizing (26px/30px for tt)
 * with the stronger telha accent. All other usages (footer, hero) omit the prop.
 */
export function Wordmark({ variant }: { variant?: 'navbar' }) {
  return (
    <span className={`wordmark${variant === 'navbar' ? ' wordmark--navbar' : ''}`}>
      habi<span className="wordmark-accent">tt</span>a
    </span>
  )
}
