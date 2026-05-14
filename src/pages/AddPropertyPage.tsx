import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createProperty } from '../lib/supabase/properties'
import type { PropertyInsert } from '../lib/supabase/properties'
import { zones } from '../data/zones'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

// ─── Field helpers ────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: STONE, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
      {children}
    </label>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '12px', color: STONE, opacity: 0.6, marginTop: '4px' }}>{children}</p>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: `1px solid ${HAIRLINE}`,
  borderRadius: '6px',
  background: 'white',
  color: INK,
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 150ms',
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={inputStyle}
      onFocus={e => (e.currentTarget.style.borderColor = CLAY)}
      onBlur={e => (e.currentTarget.style.borderColor = HAIRLINE)}
    />
  )
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233A3B2E' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px' }}
      onFocus={e => (e.currentTarget.style.borderColor = CLAY)}
      onBlur={e => (e.currentTarget.style.borderColor = HAIRLINE)}
    />
  )
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{ ...inputStyle, resize: 'vertical', minHeight: '100px', fontFamily: 'inherit' }}
      onFocus={e => (e.currentTarget.style.borderColor = CLAY)}
      onBlur={e => (e.currentTarget.style.borderColor = HAIRLINE)}
    />
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: '36px', height: '20px', borderRadius: '10px', flexShrink: 0,
          background: checked ? CLAY : HAIRLINE,
          position: 'relative', transition: 'background 200ms', cursor: 'pointer',
        }}
      >
        <div style={{
          position: 'absolute', top: '3px',
          left: checked ? '18px' : '3px',
          width: '14px', height: '14px', borderRadius: '50%',
          background: 'white', transition: 'left 200ms',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      <span style={{ fontSize: '14px', color: INK }}>{label}</span>
    </label>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: '16px', fontWeight: 700, color: INK, letterSpacing: '-0.3px', marginBottom: '20px', paddingBottom: '12px', borderBottom: `1px solid ${HAIRLINE}` }}>
      {children}
    </h2>
  )
}

function Row({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px' }}>
      {children}
    </div>
  )
}

function Field({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
}

// ─── Initial state ────────────────────────────────────────────────────────────

type FormState = {
  title: string
  status: 'draft' | 'active' | 'reserved' | 'sold'
  property_type: 'apartamento' | 'moradia' | 'terreno' | 'comercial' | 'garagem'
  typology: 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5+' | ''
  location: string
  municipality: string
  zone_slug: string
  price: string
  sqm: string
  bedrooms: string
  bathrooms: string
  parking_spots: string
  floor: string
  total_floors: string
  year_built: string
  condition: 'novo' | 'usado' | 'para_recuperar' | 'em_construcao' | ''
  energy_rating: 'A+' | 'A' | 'B' | 'B-' | 'C' | 'D' | 'E' | 'F' | 'Isento' | ''
  orientation: 'norte' | 'sul' | 'este' | 'oeste' | 'nascente' | 'poente' | 'multiple' | ''
  condominium_fee: string
  description: string
  highlights: string
  tags: string
  has_elevator: boolean
  has_garden: boolean
  has_pool: boolean
  has_terrace: boolean
  has_storage: boolean
  is_featured: boolean
}

const INITIAL: FormState = {
  title: '', status: 'draft', property_type: 'apartamento', typology: '',
  location: '', municipality: '', zone_slug: '',
  price: '', sqm: '', bedrooms: '0', bathrooms: '0', parking_spots: '0',
  floor: '', total_floors: '', year_built: '', condition: '', energy_rating: '',
  orientation: '', condominium_fee: '', description: '', highlights: '', tags: '',
  has_elevator: false, has_garden: false, has_pool: false, has_terrace: false,
  has_storage: false, is_featured: false,
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddPropertyPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const toggle = (field: keyof FormState) => (val: boolean) =>
    setForm(prev => ({ ...prev, [field]: val }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setError(null)

    if (!form.title.trim()) { setError('O título é obrigatório.'); return }
    if (!form.location.trim()) { setError('A localização é obrigatória.'); return }
    if (!form.municipality.trim()) { setError('O município é obrigatório.'); return }
    if (!form.price || Number(form.price) <= 0) { setError('O preço tem de ser maior que 0.'); return }

    setSaving(true)
    try {
      const sqm = form.sqm ? Number(form.sqm) : null
      const price = Number(form.price)

      const payload: PropertyInsert = {
        owner_id:        user.id,
        title:           form.title.trim(),
        status:          form.status,
        property_type:   form.property_type,
        typology:        form.typology || null,
        location:        form.location.trim(),
        municipality:    form.municipality.trim(),
        zone_slug:       form.zone_slug || null,
        price,
        price_per_sqm:   sqm ? Math.round(price / sqm) : null,
        sqm,
        bedrooms:        Number(form.bedrooms),
        bathrooms:       Number(form.bathrooms),
        parking_spots:   Number(form.parking_spots),
        floor:           form.floor ? Number(form.floor) : null,
        total_floors:    form.total_floors ? Number(form.total_floors) : null,
        year_built:      form.year_built ? Number(form.year_built) : null,
        condition:       form.condition || null,
        energy_rating:   form.energy_rating || null,
        orientation:     form.orientation || null,
        condominium_fee: form.condominium_fee ? Number(form.condominium_fee) : null,
        description:     form.description.trim() || null,
        highlights:      form.highlights.split('\n').map(s => s.trim()).filter(Boolean),
        tags:            form.tags.split(',').map(s => s.trim()).filter(Boolean),
        images:          [],
        has_elevator:    form.has_elevator,
        has_garden:      form.has_garden,
        has_pool:        form.has_pool,
        has_terrace:     form.has_terrace,
        has_storage:     form.has_storage,
        is_featured:     form.is_featured,
      }

      await createProperty(payload)
      navigate('/minha-conta')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao guardar. Tenta novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: BONE, paddingTop: '96px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: INK, letterSpacing: '-0.6px', margin: '0 0 6px' }}>
            Adicionar imóvel
          </h1>
          <p style={{ fontSize: '14px', color: STONE, margin: 0 }}>
            Preenche os dados do imóvel. Podes guardar como rascunho e publicar mais tarde.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

          {/* ── Identificação ── */}
          <section>
            <SectionTitle>Identificação</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field>
                <Label>Título *</Label>
                <Input value={form.title} onChange={set('title')} placeholder="ex. Apartamento T2 com terraço, Alcântara" required />
              </Field>
              <Row>
                <Field>
                  <Label>Tipo de imóvel *</Label>
                  <Select value={form.property_type} onChange={set('property_type')}>
                    <option value="apartamento">Apartamento</option>
                    <option value="moradia">Moradia</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Comercial</option>
                    <option value="garagem">Garagem</option>
                  </Select>
                </Field>
                <Field>
                  <Label>Tipologia</Label>
                  <Select value={form.typology} onChange={set('typology')}>
                    <option value="">— selecionar —</option>
                    {['T0','T1','T2','T3','T4','T5+'].map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </Field>
              </Row>
              <Row>
                <Field>
                  <Label>Estado</Label>
                  <Select value={form.status} onChange={set('status')}>
                    <option value="draft">Rascunho</option>
                    <option value="active">Ativo (publicado)</option>
                    <option value="reserved">Reservado</option>
                    <option value="sold">Vendido</option>
                  </Select>
                </Field>
                <Field>
                  <Label>Condição</Label>
                  <Select value={form.condition} onChange={set('condition')}>
                    <option value="">— selecionar —</option>
                    <option value="novo">Novo</option>
                    <option value="usado">Usado</option>
                    <option value="para_recuperar">Para recuperar</option>
                    <option value="em_construcao">Em construção</option>
                  </Select>
                </Field>
              </Row>
            </div>
          </section>

          {/* ── Localização ── */}
          <section>
            <SectionTitle>Localização</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field>
                <Label>Morada / Zona *</Label>
                <Input value={form.location} onChange={set('location')} placeholder="ex. Rua de Alcântara, Lisboa" required />
              </Field>
              <Row>
                <Field>
                  <Label>Município *</Label>
                  <Input value={form.municipality} onChange={set('municipality')} placeholder="ex. Lisboa" required />
                </Field>
                <Field>
                  <Label>Zona do quiz</Label>
                  <Select value={form.zone_slug} onChange={set('zone_slug')}>
                    <option value="">— nenhuma —</option>
                    {zones.map(z => (
                      <option key={z.slug} value={z.slug}>{z.name} ({z.kind})</option>
                    ))}
                  </Select>
                  <Hint>Liga o imóvel às recomendações do quiz</Hint>
                </Field>
              </Row>
            </div>
          </section>

          {/* ── Preço ── */}
          <section>
            <SectionTitle>Preço</SectionTitle>
            <Row>
              <Field>
                <Label>Preço (€) *</Label>
                <Input type="number" min="0" value={form.price} onChange={set('price')} placeholder="350000" required />
              </Field>
              <Field>
                <Label>Condomínio (€/mês)</Label>
                <Input type="number" min="0" value={form.condominium_fee} onChange={set('condominium_fee')} placeholder="120" />
              </Field>
            </Row>
          </section>

          {/* ── Características ── */}
          <section>
            <SectionTitle>Características</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Row cols={3}>
                <Field>
                  <Label>Área (m²)</Label>
                  <Input type="number" min="0" value={form.sqm} onChange={set('sqm')} placeholder="85" />
                </Field>
                <Field>
                  <Label>Quartos</Label>
                  <Input type="number" min="0" max="20" value={form.bedrooms} onChange={set('bedrooms')} />
                </Field>
                <Field>
                  <Label>WCs</Label>
                  <Input type="number" min="0" max="10" value={form.bathrooms} onChange={set('bathrooms')} />
                </Field>
              </Row>
              <Row cols={3}>
                <Field>
                  <Label>Estacionamentos</Label>
                  <Input type="number" min="0" max="10" value={form.parking_spots} onChange={set('parking_spots')} />
                </Field>
                <Field>
                  <Label>Piso</Label>
                  <Input type="number" value={form.floor} onChange={set('floor')} placeholder="3" />
                </Field>
                <Field>
                  <Label>Total de pisos</Label>
                  <Input type="number" value={form.total_floors} onChange={set('total_floors')} placeholder="8" />
                </Field>
              </Row>
              <Row>
                <Field>
                  <Label>Ano de construção</Label>
                  <Input type="number" min="1800" max={new Date().getFullYear()} value={form.year_built} onChange={set('year_built')} placeholder="2005" />
                </Field>
                <Field>
                  <Label>Orientação solar</Label>
                  <Select value={form.orientation} onChange={set('orientation')}>
                    <option value="">— selecionar —</option>
                    <option value="norte">Norte</option>
                    <option value="sul">Sul</option>
                    <option value="este">Este</option>
                    <option value="oeste">Oeste</option>
                    <option value="nascente">Nascente</option>
                    <option value="poente">Poente</option>
                    <option value="multiple">Múltipla</option>
                  </Select>
                </Field>
              </Row>
              <Row>
                <Field>
                  <Label>Certificado energético</Label>
                  <Select value={form.energy_rating} onChange={set('energy_rating')}>
                    <option value="">— selecionar —</option>
                    {['A+','A','B','B-','C','D','E','F','Isento'].map(r => <option key={r} value={r}>{r}</option>)}
                  </Select>
                </Field>
              </Row>
            </div>
          </section>

          {/* ── Extras ── */}
          <section>
            <SectionTitle>Extras</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
              <Toggle checked={form.has_elevator} onChange={toggle('has_elevator')} label="Elevador" />
              <Toggle checked={form.has_garden} onChange={toggle('has_garden')} label="Jardim" />
              <Toggle checked={form.has_pool} onChange={toggle('has_pool')} label="Piscina" />
              <Toggle checked={form.has_terrace} onChange={toggle('has_terrace')} label="Terraço" />
              <Toggle checked={form.has_storage} onChange={toggle('has_storage')} label="Arrecadação" />
              <Toggle checked={form.is_featured} onChange={toggle('is_featured')} label="Destaque" />
            </div>
          </section>

          {/* ── Conteúdo ── */}
          <section>
            <SectionTitle>Descrição e destaques</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field>
                <Label>Descrição</Label>
                <Textarea value={form.description} onChange={set('description')} placeholder="Descreve o imóvel em detalhe..." rows={4} />
              </Field>
              <Field>
                <Label>Destaques</Label>
                <Textarea value={form.highlights} onChange={set('highlights')} placeholder={'Vista para o rio\nLuz natural abundante\nAcabamentos de qualidade'} rows={4} />
                <Hint>Um destaque por linha</Hint>
              </Field>
              <Field>
                <Label>Tags</Label>
                <Input value={form.tags} onChange={set('tags')} placeholder="renovado, luminoso, silencioso" />
                <Hint>Separadas por vírgula</Hint>
              </Field>
            </div>
          </section>

          {/* ── Erro + Submit ── */}
          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(194,85,58,0.08)', border: '1px solid rgba(194,85,58,0.25)', borderRadius: '6px', color: CLAY, fontSize: '14px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{ padding: '10px 20px', border: `1px solid ${HAIRLINE}`, background: 'white', color: STONE, borderRadius: '50px', fontSize: '14px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '10px 28px', border: 'none', background: saving ? STONE : CLAY,
                color: 'white', borderRadius: '50px', fontSize: '14px', fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 150ms',
              }}
            >
              {saving ? 'A guardar…' : form.status === 'draft' ? 'Guardar rascunho' : 'Publicar imóvel'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
