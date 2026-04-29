import { useUrbanData, type UrbanProject } from '../../hooks/useUrbanData'
import { CATEGORY_PT, STATUS_PT, STATUS_ACCENT_VAR } from './urbanLabels'

type Props = {
  concelhoSlug: string
  concelhoName: string
  freguesiaSlug?: string | null
  eyebrowOverride?: string
  titleOverride?: string
  subtitleOverride?: string
}

function ProjectCard({ project }: { project: UrbanProject }) {
  let timeline: string
  if (project.start_year && project.expected_end) {
    timeline = `${project.start_year} → ${project.expected_end}`
  } else if (project.expected_end) {
    timeline = `Conclusão ${project.expected_end}`
  } else if (project.start_year) {
    timeline = `Início ${project.start_year}`
  } else {
    timeline = 'Sem data definida'
  }

  return (
    <div
      style={{
        background: 'var(--linho)',
        border: '1px solid var(--traco)',
        borderLeft: `3px solid ${STATUS_ACCENT_VAR[project.status] ?? 'var(--traco)'}`,
        borderRadius: '2px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <span
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1.4px',
            color: 'var(--azeitona-medio)',
          }}
        >
          {CATEGORY_PT[project.category]}
        </span>
        <span
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: 'var(--azeitona-medio)',
          }}
        >
          {STATUS_PT[project.status]}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-display"
        style={{
          fontSize: '18px',
          lineHeight: 1.3,
          color: 'var(--azeitona)',
          fontWeight: 400,
          margin: 0,
        }}
      >
        {project.title}
      </h3>

      {/* Description — clamped to 3 lines */}
      <p
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '14px',
          lineHeight: 1.6,
          color: 'var(--azeitona-medio)',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {project.description}
      </p>

      {/* Footer */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px',
            color: 'var(--azeitona-medio)',
          }}
        >
          {timeline}
        </span>
        <a
          href={project.source_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver fonte oficial do projeto ${project.title} (abre em nova janela)`}
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px',
            color: 'var(--telha)',
            textDecoration: 'none',
          }}
        >
          Ver fonte ↗
        </a>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div
      style={{
        height: '200px',
        background: 'var(--traco)',
        borderRadius: '2px',
      }}
    />
  )
}

export function UrbanProjectsSection({
  concelhoSlug,
  concelhoName,
  freguesiaSlug,
  eyebrowOverride,
  titleOverride,
  subtitleOverride,
}: Props) {
  const { projects, loading } = useUrbanData(concelhoSlug, freguesiaSlug)

  if (!loading && projects.length === 0) return null

  const eyebrow   = eyebrowOverride  ?? 'O que vem aí'
  const title     = titleOverride    ?? `Projetos previstos para ${concelhoName}`
  const subtitle  = subtitleOverride ?? 'Investimentos públicos aprovados ou em estudo que poderão alterar a vida na zona nos próximos anos.'

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            color: 'var(--telha)',
            margin: '0 0 16px',
          }}
        >
          {eyebrow}
        </p>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            color: 'var(--azeitona)',
            fontWeight: 400,
            margin: 0,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '15px',
            color: 'var(--azeitona-medio)',
            lineHeight: 1.7,
            maxWidth: '580px',
            marginTop: '12px',
            marginBottom: 0,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{ gap: '16px', marginTop: '40px' }}
      >
        {loading
          ? [0, 1, 2].map(i => <SkeletonCard key={i} />)
          : projects.map(p => <ProjectCard key={p.id} project={p} />)
        }
      </div>
    </div>
  )
}
