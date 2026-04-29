import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export type UrbanProjectCategory =
  | 'metro'
  | 'ferrovia'
  | 'rodoviario'
  | 'escola'
  | 'hospital'
  | 'habitacao'
  | 'parque'
  | 'ciclovia'
  | 'requalificacao'
  | 'outro'

export type UrbanProjectStatus =
  | 'planeado'
  | 'aprovado'
  | 'em_construcao'
  | 'concluido'
  | 'cancelado'

export type UrbanProject = {
  id: string
  title: string
  category: UrbanProjectCategory
  status: UrbanProjectStatus
  description: string
  details: string | null
  start_year: number | null
  expected_end: number | null
  impact_level: 'baixo' | 'medio' | 'alto'
  source_url: string
  source_name: string | null
}

export type PdmSummary = {
  concelho_slug: string
  pdm_year: number
  last_revision_year: number | null
  in_revision: boolean
  highlights: string | null
  source_url: string
}

export function useUrbanData(concelhoSlug: string) {
  const [pdm, setPdm] = useState<PdmSummary | null>(null)
  const [projects, setProjects] = useState<UrbanProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function fetchData() {
      setLoading(true)
      const [pdmRes, projRes] = await Promise.all([
        supabase
          .from('pdm_summary')
          .select('*')
          .eq('concelho_slug', concelhoSlug)
          .maybeSingle(),
        supabase
          .from('urban_projects')
          .select('*')
          .eq('concelho_slug', concelhoSlug)
          .neq('status', 'cancelado')
          .order('expected_end', { ascending: true, nullsFirst: false }),
      ])
      if (!active) return
      setPdm(pdmRes.data ?? null)
      setProjects((projRes.data as UrbanProject[]) ?? [])
      setLoading(false)
    }
    fetchData()
    return () => {
      active = false
    }
  }, [concelhoSlug])

  return { pdm, projects, loading }
}
