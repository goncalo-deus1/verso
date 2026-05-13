import { Helmet } from 'react-helmet-async'
import type { ConcelhoContent } from '../../lib/concelhoContent'

type Props = {
  content: ConcelhoContent
}

export default function ConcelhoSEO({ content }: Props) {
  const { frontmatter, jsonLd } = content

  return (
    <Helmet>
      <title>{frontmatter.title}</title>
      <meta name="description" content={frontmatter.meta_description} />
      <link rel="canonical" href={frontmatter.canonical} />

      <meta property="og:type"        content="article" />
      <meta property="og:title"       content={frontmatter.title} />
      <meta property="og:description" content={frontmatter.meta_description} />
      <meta property="og:url"         content={frontmatter.canonical} />
      <meta property="og:locale"      content="pt_PT" />

      {jsonLd && (
        <script type="application/ld+json">{jsonLd}</script>
      )}
    </Helmet>
  )
}
