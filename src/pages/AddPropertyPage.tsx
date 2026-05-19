import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagePlus, X, GripVertical } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { useT } from '../i18n/translations'
import { createProperty } from '../lib/supabase/properties'
import type { PropertyInsert } from '../lib/supabase/properties'
import { supabase } from '../lib/supabase'
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

// ─── Image uploader ───────────────────────────────────────────────────────────

type UploadedImage = { url: string; path: string }

function ImageUploader({
  images,
  onChange,
  userId,
  tr,
}: {
  images: UploadedImage[]
  onChange: (imgs: UploadedImage[]) => void
  userId: string
  tr: ReturnType<typeof useT>
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    if (images.length + files.length > 10) {
      setUploadError(tr('addprop.photos.err.max'))
      return
    }
    setUploading(true)
    setUploadError(null)
    const results: UploadedImage[] = []

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 10 * 1024 * 1024) { setUploadError(`"${file.name}"${tr('addprop.photos.err.sizeSuffix')}`); continue }

      const ext  = file.name.split('.').pop()
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage.from('property-images').upload(path, file, { upsert: false })
      if (error) { setUploadError(`${tr('addprop.photos.err.uploadPrefix')}"${file.name}"${tr('addprop.photos.err.uploadSuffix')}`); continue }

      const { data } = supabase.storage.from('property-images').getPublicUrl(path)
      results.push({ url: data.publicUrl, path })
    }

    onChange([...images, ...results])
    setUploading(false)
  }

  function removeImage(path: string) {
    onChange(images.filter(img => img.path !== path))
    supabase.storage.from('property-images').remove([path])
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files) }}
        style={{
          border: `2px dashed ${dragOver ? CLAY : HAIRLINE}`,
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? 'rgba(194,85,58,0.04)' : 'white',
          transition: 'all 150ms',
        }}
      >
        <ImagePlus size={28} color={dragOver ? CLAY : STONE} style={{ margin: '0 auto 10px', opacity: dragOver ? 1 : 0.4 }} />
        <p style={{ fontSize: '14px', fontWeight: 500, color: INK, margin: '0 0 4px' }}>
          {uploading ? tr('addprop.photos.uploading') : tr('addprop.photos.dropPrompt')}
        </p>
        <p style={{ fontSize: '12px', color: STONE, opacity: 0.6, margin: 0 }}>
          {tr('addprop.photos.dropHint')}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => uploadFiles(e.target.files)}
        />
      </div>

      {uploadError && (
        <p style={{ fontSize: '12px', color: CLAY, marginTop: '6px' }}>{uploadError}</p>
      )}

      {/* Previews */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', marginTop: '16px' }}>
          {images.map((img, i) => (
            <div key={img.path} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', aspectRatio: '4/3', border: `1px solid ${HAIRLINE}` }}>
              {i === 0 && (
                <span style={{ position: 'absolute', top: '6px', left: '6px', fontSize: '10px', fontWeight: 700, background: CLAY, color: 'white', padding: '2px 6px', borderRadius: '4px', zIndex: 1 }}>
                  {tr('addprop.photos.cover')}
                </span>
              )}
              <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <button
                type="button"
                onClick={() => removeImage(img.path)}
                style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(30,31,24,0.7)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}
              >
                <X size={12} color="white" />
              </button>
              <div style={{ position: 'absolute', bottom: '4px', right: '4px', opacity: 0.5 }}>
                <GripVertical size={12} color="white" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddPropertyPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { lang } = useLang()
  const tr = useT(lang)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [images, setImages] = useState<UploadedImage[]>([])
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

    if (!form.title.trim()) { setError(tr('addprop.err.title')); return }
    if (!form.location.trim()) { setError(tr('addprop.err.location')); return }
    if (!form.municipality.trim()) { setError(tr('addprop.err.municipality')); return }
    if (!form.price || Number(form.price) <= 0) { setError(tr('addprop.err.price')); return }

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
        images:          images.map(img => img.url),
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
      setError(err instanceof Error ? err.message : tr('addprop.err.save'))
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
            {tr('addprop.page.title')}
          </h1>
          <p style={{ fontSize: '14px', color: STONE, margin: 0 }}>
            {tr('addprop.page.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

          {/* ── Identificação ── */}
          <section>
            <SectionTitle>{tr('addprop.section.identification')}</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field>
                <Label>{tr('addprop.label.title')}</Label>
                <Input value={form.title} onChange={set('title')} placeholder={tr('addprop.placeholder.title')} required />
              </Field>
              <Row>
                <Field>
                  <Label>{tr('addprop.label.propertyType')}</Label>
                  <Select value={form.property_type} onChange={set('property_type')}>
                    <option value="apartamento">{tr('props.type.apartamento')}</option>
                    <option value="moradia">{tr('props.type.moradia')}</option>
                    <option value="terreno">{tr('props.type.terreno')}</option>
                    <option value="comercial">{tr('props.type.comercial')}</option>
                    <option value="garagem">{tr('props.type.garagem')}</option>
                  </Select>
                </Field>
                <Field>
                  <Label>{tr('addprop.label.typology')}</Label>
                  <Select value={form.typology} onChange={set('typology')}>
                    <option value="">{tr('addprop.option.placeholder')}</option>
                    {['T0','T1','T2','T3','T4','T5+'].map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </Field>
              </Row>
              <Row>
                <Field>
                  <Label>{tr('addprop.label.status')}</Label>
                  <Select value={form.status} onChange={set('status')}>
                    <option value="draft">{tr('account.status.draft')}</option>
                    <option value="active">{tr('addprop.option.status.activePub')}</option>
                    <option value="reserved">{tr('account.status.reserved')}</option>
                    <option value="sold">{tr('account.status.sold')}</option>
                  </Select>
                </Field>
                <Field>
                  <Label>{tr('addprop.label.condition')}</Label>
                  <Select value={form.condition} onChange={set('condition')}>
                    <option value="">{tr('addprop.option.placeholder')}</option>
                    <option value="novo">{tr('pd.cond.novo')}</option>
                    <option value="usado">{tr('pd.cond.usado')}</option>
                    <option value="para_recuperar">{tr('pd.cond.para_recuperar')}</option>
                    <option value="em_construcao">{tr('pd.cond.em_construcao')}</option>
                  </Select>
                </Field>
              </Row>
            </div>
          </section>

          {/* ── Localização ── */}
          <section>
            <SectionTitle>{tr('addprop.section.location')}</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field>
                <Label>{tr('addprop.label.location')}</Label>
                <Input value={form.location} onChange={set('location')} placeholder={tr('addprop.placeholder.location')} required />
              </Field>
              <Row>
                <Field>
                  <Label>{tr('addprop.label.municipality')}</Label>
                  <Input value={form.municipality} onChange={set('municipality')} placeholder={tr('addprop.placeholder.municipality')} required />
                </Field>
                <Field>
                  <Label>{tr('addprop.label.zoneSlug')}</Label>
                  <Select value={form.zone_slug} onChange={set('zone_slug')}>
                    <option value="">{tr('addprop.option.none')}</option>
                    {zones.map(z => (
                      <option key={z.slug} value={z.slug}>{z.name} ({z.kind})</option>
                    ))}
                  </Select>
                  <Hint>{tr('addprop.hint.zoneSlug')}</Hint>
                </Field>
              </Row>
            </div>
          </section>

          {/* ── Preço ── */}
          <section>
            <SectionTitle>{tr('addprop.section.price')}</SectionTitle>
            <Row>
              <Field>
                <Label>{tr('addprop.label.price')}</Label>
                <Input type="number" min="0" value={form.price} onChange={set('price')} placeholder={tr('addprop.placeholder.price')} required />
              </Field>
              <Field>
                <Label>{tr('addprop.label.condoFee')}</Label>
                <Input type="number" min="0" value={form.condominium_fee} onChange={set('condominium_fee')} placeholder={tr('addprop.placeholder.condoFee')} />
              </Field>
            </Row>
          </section>

          {/* ── Características ── */}
          <section>
            <SectionTitle>{tr('addprop.section.features')}</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Row cols={3}>
                <Field>
                  <Label>{tr('addprop.label.sqm')}</Label>
                  <Input type="number" min="0" value={form.sqm} onChange={set('sqm')} placeholder={tr('addprop.placeholder.sqm')} />
                </Field>
                <Field>
                  <Label>{tr('addprop.label.bedrooms')}</Label>
                  <Input type="number" min="0" max="20" value={form.bedrooms} onChange={set('bedrooms')} />
                </Field>
                <Field>
                  <Label>{tr('addprop.label.bathrooms')}</Label>
                  <Input type="number" min="0" max="10" value={form.bathrooms} onChange={set('bathrooms')} />
                </Field>
              </Row>
              <Row cols={3}>
                <Field>
                  <Label>{tr('addprop.label.parking')}</Label>
                  <Input type="number" min="0" max="10" value={form.parking_spots} onChange={set('parking_spots')} />
                </Field>
                <Field>
                  <Label>{tr('addprop.label.floor')}</Label>
                  <Input type="number" value={form.floor} onChange={set('floor')} placeholder={tr('addprop.placeholder.floor')} />
                </Field>
                <Field>
                  <Label>{tr('addprop.label.totalFloors')}</Label>
                  <Input type="number" value={form.total_floors} onChange={set('total_floors')} placeholder={tr('addprop.placeholder.totalFloors')} />
                </Field>
              </Row>
              <Row>
                <Field>
                  <Label>{tr('addprop.label.yearBuilt')}</Label>
                  <Input type="number" min="1800" max={new Date().getFullYear()} value={form.year_built} onChange={set('year_built')} placeholder={tr('addprop.placeholder.yearBuilt')} />
                </Field>
                <Field>
                  <Label>{tr('addprop.label.orientation')}</Label>
                  <Select value={form.orientation} onChange={set('orientation')}>
                    <option value="">{tr('addprop.option.placeholder')}</option>
                    <option value="norte">{tr('addprop.option.orient.norte')}</option>
                    <option value="sul">{tr('addprop.option.orient.sul')}</option>
                    <option value="este">{tr('addprop.option.orient.este')}</option>
                    <option value="oeste">{tr('addprop.option.orient.oeste')}</option>
                    <option value="nascente">{tr('addprop.option.orient.nascente')}</option>
                    <option value="poente">{tr('addprop.option.orient.poente')}</option>
                    <option value="multiple">{tr('addprop.option.orient.multiple')}</option>
                  </Select>
                </Field>
              </Row>
              <Row>
                <Field>
                  <Label>{tr('addprop.label.energy')}</Label>
                  <Select value={form.energy_rating} onChange={set('energy_rating')}>
                    <option value="">{tr('addprop.option.placeholder')}</option>
                    {['A+','A','B','B-','C','D','E','F','Isento'].map(r => <option key={r} value={r}>{r}</option>)}
                  </Select>
                </Field>
              </Row>
            </div>
          </section>

          {/* ── Extras ── */}
          <section>
            <SectionTitle>{tr('addprop.section.extras')}</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
              <Toggle checked={form.has_elevator} onChange={toggle('has_elevator')} label={tr('pd.extra.elevator')} />
              <Toggle checked={form.has_garden} onChange={toggle('has_garden')} label={tr('pd.extra.garden')} />
              <Toggle checked={form.has_pool} onChange={toggle('has_pool')} label={tr('pd.extra.pool')} />
              <Toggle checked={form.has_terrace} onChange={toggle('has_terrace')} label={tr('pd.extra.terrace')} />
              <Toggle checked={form.has_storage} onChange={toggle('has_storage')} label={tr('pd.extra.storage')} />
              <Toggle checked={form.is_featured} onChange={toggle('is_featured')} label={tr('addprop.extra.featured')} />
            </div>
          </section>

          {/* ── Fotografias ── */}
          <section>
            <SectionTitle>{tr('addprop.section.photos')}</SectionTitle>
            <ImageUploader
              images={images}
              onChange={setImages}
              userId={user?.id ?? ''}
              tr={tr}
            />
            <Hint>{tr('addprop.photos.coverHint')}</Hint>
          </section>

          {/* ── Conteúdo ── */}
          <section>
            <SectionTitle>{tr('addprop.section.content')}</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field>
                <Label>{tr('addprop.label.description')}</Label>
                <Textarea value={form.description} onChange={set('description')} placeholder={tr('addprop.placeholder.description')} rows={4} />
              </Field>
              <Field>
                <Label>{tr('addprop.label.highlights')}</Label>
                <Textarea value={form.highlights} onChange={set('highlights')} placeholder={tr('addprop.placeholder.highlights')} rows={4} />
                <Hint>{tr('addprop.hint.highlights')}</Hint>
              </Field>
              <Field>
                <Label>{tr('addprop.label.tags')}</Label>
                <Input value={form.tags} onChange={set('tags')} placeholder={tr('addprop.placeholder.tags')} />
                <Hint>{tr('addprop.hint.tags')}</Hint>
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
              {tr('addprop.cta.cancel')}
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
              {saving ? tr('addprop.cta.saving') : form.status === 'draft' ? tr('addprop.cta.saveDraft') : tr('addprop.cta.publish')}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
