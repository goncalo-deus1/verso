import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface Props {
  zoneSlug: string
  zoneKind: 'freguesia' | 'concelho'
  zoneName: string
  label?: string
  /** Pass true when the button sits on a dark (azeitona) background */
  darkBg?: boolean
}

const CLAY     = '#C2553A'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'
const INK      = '#1E1F18'

export default function SaveZoneButton({ zoneSlug, zoneKind, zoneName, label: customLabel, darkBg = false }: Props) {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!user) { setChecked(true); return }
    supabase
      .from('saved_zones')
      .select('id')
      .eq('user_id', user.id)
      .eq('zone_slug', zoneSlug)
      .maybeSingle()
      .then(({ data }) => {
        if (data) { setSaved(true); setSavedId(data.id) }
        setChecked(true)
      })
  }, [user, zoneSlug])

  async function toggle() {
    if (!user) {
      window.location.href = '/entrar'
      return
    }
    setLoading(true)
    if (saved && savedId) {
      await supabase.from('saved_zones').delete().eq('id', savedId)
      setSaved(false)
      setSavedId(null)
    } else {
      const { data } = await supabase.from('saved_zones').insert({
        user_id: user.id,
        zone_slug: zoneSlug,
        zone_kind: zoneKind,
        zone_name: zoneName,
      }).select('id').single()
      if (data) { setSaved(true); setSavedId(data.id) }
    }
    setLoading(false)
  }

  if (!checked) return null

  const label = saved ? 'Guardado' : (customLabel ?? 'Guardar zona')
  const Icon = saved ? BookmarkCheck : Bookmark

  const LINHO = '#F2EDE4'

  // Dark-background variant: transparent fill, linho border + text
  const darkStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    padding: '9px 22px', fontSize: '13px', fontWeight: 500,
    border: `1px solid ${saved ? CLAY : 'rgba(242,237,228,0.5)'}`,
    background: saved ? 'rgba(194,85,58,0.15)' : 'transparent',
    color: saved ? CLAY : LINHO,
    borderRadius: '50px', cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 150ms',
  }

  const lightStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    padding: '9px 22px', fontSize: '13px', fontWeight: 500,
    border: `1px solid ${saved ? CLAY : HAIRLINE}`,
    background: saved ? '#FEF3EE' : 'white',
    color: saved ? CLAY : INK,
    borderRadius: '50px', cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 150ms',
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={label}
      style={darkBg ? darkStyle : lightStyle}
      onMouseEnter={e => {
        if (!saved && !darkBg) { e.currentTarget.style.borderColor = CLAY; e.currentTarget.style.color = CLAY }
        if (!saved && darkBg)  { e.currentTarget.style.borderColor = LINHO; e.currentTarget.style.color = LINHO }
      }}
      onMouseLeave={e => {
        if (!saved && !darkBg) { e.currentTarget.style.borderColor = HAIRLINE; e.currentTarget.style.color = INK }
        if (!saved && darkBg)  { e.currentTarget.style.borderColor = 'rgba(242,237,228,0.5)'; e.currentTarget.style.color = LINHO }
      }}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}
