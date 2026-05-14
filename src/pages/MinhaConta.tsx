import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, BookmarkCheck, LogOut, Trash2, Home, Plus, Pencil } from 'lucide-react'
import { useAuth, displayName } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase/types'
import DeleteAccountSection from '../components/account/DeleteAccountSection'
import { getMyProperties, deleteProperty, updateProperty } from '../lib/supabase/properties'
import type { PropertyRow } from '../lib/supabase/properties'

type SavedZone = Database['public']['Tables']['saved_zones']['Row']

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'
const SAND     = '#E8E0D0'

const STATUS_LABEL: Record<PropertyRow['status'], string> = {
  draft:    'Rascunho',
  active:   'Ativo',
  reserved: 'Reservado',
  sold:     'Vendido',
}

const STATUS_COLOR: Record<PropertyRow['status'], string> = {
  draft:    '#888',
  active:   '#2d8a4e',
  reserved: '#b07d2a',
  sold:     CLAY,
}

export default function MinhaConta() {
  const { user, signOut } = useAuth()
  const name = displayName(user)
  const [savedZones, setSavedZones] = useState<SavedZone[]>([])
  const [loadingZones, setLoadingZones] = useState(true)
  const [properties, setProperties] = useState<PropertyRow[]>([])
  const [loadingProps, setLoadingProps] = useState(true)
  const [tab, setTab] = useState<'overview' | 'zones' | 'anuncios'>('overview')

  useEffect(() => {
    if (!user) return
    supabase
      .from('saved_zones')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setSavedZones(data ?? [])
        setLoadingZones(false)
      })
    getMyProperties(user.id).then(data => {
      setProperties(data)
      setLoadingProps(false)
    })
  }, [user])

  async function removeZone(id: string) {
    await supabase.from('saved_zones').delete().eq('id', id)
    setSavedZones(prev => prev.filter(z => z.id !== id))
  }

  async function removeProperty(id: string) {
    await deleteProperty(id)
    setProperties(prev => prev.filter(p => p.id !== id))
  }

  async function togglePublish(p: PropertyRow) {
    const next = p.status === 'active' ? 'draft' : 'active'
    await updateProperty(p.id, { status: next })
    setProperties(prev => prev.map(x => x.id === p.id ? { ...x, status: next } : x))
  }

  function zoneHref(z: SavedZone) {
    return z.zone_kind === 'freguesia' ? `/freguesia/${z.zone_slug}` : `/concelho/${z.zone_slug}`
  }

  return (
    <div style={{ minHeight: '100vh', background: BONE, paddingTop: '96px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', background: CLAY, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '20px', fontWeight: 600, color: 'white' }}>{name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: INK, letterSpacing: '-0.5px', margin: 0 }}>{name}</h1>
              <p style={{ fontSize: '13px', color: STONE, fontFamily: 'IBM Plex Mono', margin: '2px 0 0' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={signOut}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: `1px solid ${HAIRLINE}`, background: 'white', color: STONE, borderRadius: '50px', fontSize: '13px', cursor: 'pointer', transition: 'all 150ms' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CLAY; e.currentTarget.style.color = CLAY }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = HAIRLINE; e.currentTarget.style.color = STONE }}>
            <LogOut size={13} /> Sair
          </button>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', borderBottom: `1px solid ${HAIRLINE}` }}>
          {([['overview', User, 'Conta'], ['zones', BookmarkCheck, 'Zonas guardadas'], ['anuncios', Home, 'Os meus anúncios']] as const).map(([t, Icon, label]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '10px 16px', fontSize: '14px', fontWeight: 500,
                border: 'none', background: 'none', cursor: 'pointer',
                color: tab === t ? INK : STONE,
                borderBottom: tab === t ? `2px solid ${CLAY}` : '2px solid transparent',
                marginBottom: '-1px', transition: 'color 150ms',
              }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SectionCard title="Informação da conta">
              <Row label="Nome" value={name || '—'} />
              <Row label="Email" value={user?.email ?? '—'} />
              <Row label="Membro desde" value={user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long' }) : '—'} />
            </SectionCard>

            <SectionCard title="Zonas guardadas">
              <p style={{ fontSize: '14px', color: STONE }}>
                {loadingZones ? 'A carregar…' : `${savedZones.length} zona${savedZones.length !== 1 ? 's' : ''} guardada${savedZones.length !== 1 ? 's' : ''}`}
              </p>
              {savedZones.length > 0 && (
                <button onClick={() => setTab('zones')}
                  style={{ marginTop: '8px', fontSize: '13px', color: CLAY, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}>
                  Ver todas →
                </button>
              )}
            </SectionCard>

            <SectionCard title="Os meus anúncios">
              <p style={{ fontSize: '14px', color: STONE }}>
                {loadingProps ? 'A carregar…' : `${properties.length} anúncio${properties.length !== 1 ? 's' : ''} — ${properties.filter(p => p.status === 'active').length} ativo${properties.filter(p => p.status === 'active').length !== 1 ? 's' : ''}`}
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                {properties.length > 0 && (
                  <button onClick={() => setTab('anuncios')}
                    style={{ fontSize: '13px', color: CLAY, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}>
                    Ver todos →
                  </button>
                )}
                <Link to="/adicionar-imovel"
                  style={{ fontSize: '13px', color: STONE, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={12} /> Adicionar imóvel
                </Link>
              </div>
            </SectionCard>
          </div>
        )}

        {tab === 'zones' && (
          <div>
            {loadingZones ? (
              <p style={{ fontSize: '14px', color: STONE }}>A carregar…</p>
            ) : savedZones.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <BookmarkCheck size={32} color={HAIRLINE} style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '15px', fontWeight: 600, color: INK, marginBottom: '8px' }}>Nenhuma zona guardada</p>
                <p style={{ fontSize: '14px', color: STONE, marginBottom: '24px' }}>Explore as zonas e guarde as que mais lhe interessam.</p>
                <Link to="/areas" style={{ display: 'inline-block', padding: '10px 24px', background: INK, color: BONE, borderRadius: '50px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                  Explorar zonas
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {savedZones.map(z => (
                  <div key={z.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'white', border: `1px solid ${HAIRLINE}`, borderRadius: '8px' }}>
                    <Link to={zoneHref(z)} style={{ flex: 1, textDecoration: 'none' }}>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: INK, margin: 0 }}>{z.zone_name}</p>
                      <p style={{ fontSize: '12px', color: STONE, fontFamily: 'IBM Plex Mono', marginTop: '2px' }}>{z.zone_kind}</p>
                    </Link>
                    <button onClick={() => removeZone(z.id)}
                      title="Remover"
                      style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: HAIRLINE, borderRadius: '6px', transition: 'color 150ms' }}
                      onMouseEnter={e => (e.currentTarget.style.color = CLAY)}
                      onMouseLeave={e => (e.currentTarget.style.color = HAIRLINE)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === 'anuncios' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <Link to="/adicionar-imovel"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', background: CLAY, color: 'white', borderRadius: '50px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                <Plus size={13} /> Novo anúncio
              </Link>
            </div>

            {loadingProps ? (
              <p style={{ fontSize: '14px', color: STONE }}>A carregar…</p>
            ) : properties.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Home size={32} color={HAIRLINE} style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '15px', fontWeight: 600, color: INK, marginBottom: '8px' }}>Nenhum anúncio ainda</p>
                <p style={{ fontSize: '14px', color: STONE, marginBottom: '24px' }}>Adiciona o teu primeiro imóvel.</p>
                <Link to="/adicionar-imovel"
                  style={{ display: 'inline-block', padding: '10px 24px', background: INK, color: BONE, borderRadius: '50px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                  Adicionar imóvel
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {properties.map(p => (
                  <div key={p.id} style={{ background: 'white', border: `1px solid ${HAIRLINE}`, borderRadius: '8px', padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <p style={{ fontSize: '15px', fontWeight: 600, color: INK, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</p>
                          <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', background: `${STATUS_COLOR[p.status]}18`, color: STATUS_COLOR[p.status], whiteSpace: 'nowrap' }}>
                            {STATUS_LABEL[p.status]}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: STONE, fontFamily: 'IBM Plex Mono', margin: 0 }}>
                          {p.property_type}{p.typology ? ` · ${p.typology}` : ''} · {p.municipality}
                          {p.price ? ` · ${p.price.toLocaleString('pt-PT')} €` : ''}
                          {p.sqm ? ` · ${p.sqm} m²` : ''}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <button
                          onClick={() => togglePublish(p)}
                          title={p.status === 'active' ? 'Despublicar' : 'Publicar'}
                          style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 500, border: `1px solid ${HAIRLINE}`, background: 'white', color: STONE, borderRadius: '50px', cursor: 'pointer', transition: 'all 150ms', whiteSpace: 'nowrap' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = CLAY; e.currentTarget.style.color = CLAY }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = HAIRLINE; e.currentTarget.style.color = STONE }}>
                          {p.status === 'active' ? 'Despublicar' : 'Publicar'}
                        </button>
                        <Link to={`/adicionar-imovel?edit=${p.id}`}
                          title="Editar"
                          style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${HAIRLINE}`, background: 'white', color: STONE, borderRadius: '6px', textDecoration: 'none', transition: 'color 150ms' }}
                          onMouseEnter={e => (e.currentTarget.style.color = CLAY)}
                          onMouseLeave={e => (e.currentTarget.style.color = STONE)}>
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => removeProperty(p.id)}
                          title="Eliminar"
                          style={{ padding: '6px', background: 'none', border: `1px solid ${HAIRLINE}`, cursor: 'pointer', color: STONE, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 150ms' }}
                          onMouseEnter={e => (e.currentTarget.style.color = CLAY)}
                          onMouseLeave={e => (e.currentTarget.style.color = STONE)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Zona de perigo */}
        <div style={{ marginTop: '64px' }}>
          <hr style={{ border: 'none', borderTop: `1px solid ${HAIRLINE}`, marginBottom: '48px' }} />
          <DeleteAccountSection />
        </div>

      </div>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', border: `1px solid ${HAIRLINE}`, borderRadius: '8px', padding: '24px' }}>
      <h2 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: STONE, fontFamily: 'IBM Plex Mono', margin: '0 0 16px' }}>{title}</h2>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: `1px solid ${SAND}` }}>
      <span style={{ fontSize: '13px', color: STONE }}>{label}</span>
      <span style={{ fontSize: '14px', color: INK, fontWeight: 500 }}>{value}</span>
    </div>
  )
}
