import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Heart, Search, BookOpen, Bell, LogOut, ArrowRight } from 'lucide-react'
import { useAuth, displayName } from '../context/AuthContext'
import { useQuiz } from '../context/QuizContext'
import { properties } from '../data/properties'
import PropertyCard from '../components/PropertyCard'
import { BlockLabel, SectionNum, Divider } from '../components/Brand'
import { useLangSafe } from '../context/LanguageContext'
import { useT } from '../i18n/translations'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const name = displayName(user)
  const navigate = useNavigate()
  const { open: openQuiz } = useQuiz()
  const { lang } = useLangSafe()
  const tr = useT(lang)

  useEffect(() => { if (!user) navigate('/entrar') }, [user, navigate])
  if (!user) return null

  const saved = properties.slice(0, 2)

  const sideItems = [
    { icon: <Heart size={15} />, label: tr('pages.profile.side.saved'), count: 2 },
    { icon: <Search size={15} />, label: tr('pages.profile.side.searches'), count: 0 },
    { icon: <BookOpen size={15} />, label: tr('pages.profile.side.quizRecs'), count: 1 },
    { icon: <Bell size={15} />, label: tr('pages.profile.side.alerts'), count: 0 },
  ]

  const settingsRows = [
    { label: tr('account.field.name'), value: name },
    { label: tr('account.field.email'), value: user.email ?? '' },
    { label: tr('pages.profile.field.password'), value: '••••••••' },
    { label: tr('pages.profile.field.notifications'), value: tr('pages.profile.notifications.on') },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#F2EDE4' }}>
      {/* Header */}
      <section style={{ background: '#1E1F18' }} className="pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-14 h-14 flex items-center justify-center text-white font-display text-2xl font-medium flex-shrink-0"
              style={{ background: '#C2553A', borderRadius: '2px' }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <BlockLabel light>{tr('pages.profile.eyebrow')}</BlockLabel>
              <h1 className="font-display text-white text-3xl lg:text-4xl" style={{ letterSpacing: '-1px', lineHeight: '1.1' }}>
                {tr('pages.profile.greeting').replace('{name}', name)}
              </h1>
              <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'IBM Plex Mono' }}>{user.email ?? ''}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            {sideItems.map(item => (
              <div key={item.label}
                className="flex items-center justify-between p-4 bg-white cursor-pointer transition-all duration-150"
                style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#C2553A')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(30, 31, 24, 0.125)')}>
                <div className="flex items-center gap-3 text-sm font-medium" style={{ color: '#1E1F18' }}>
                  <span style={{ color: '#3A3B2E' }}>{item.icon}</span>
                  {item.label}
                </div>
                <span className="text-xs font-semibold px-2 py-0.5" style={{ fontFamily: 'IBM Plex Mono', background: item.count > 0 ? '#F2EDE4' : '#F2EDE4', color: item.count > 0 ? '#C2553A' : 'rgba(30, 31, 24, 0.125)', border: '1px solid rgba(30, 31, 24, 0.125)' }}>
                  {item.count}
                </span>
              </div>
            ))}

            <button onClick={() => { logout(); navigate('/') }}
              className="w-full flex items-center gap-3 p-4 text-sm font-medium transition-all duration-150"
              style={{ border: '1px solid rgba(30, 31, 24, 0.125)', color: '#3A3B2E', borderRadius: '2px', background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#1E1F18'; e.currentTarget.style.background = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#3A3B2E'; e.currentTarget.style.background = 'transparent' }}>
              <LogOut size={14} /> {tr('header.signOut')}
            </button>
          </div>

          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            {/* Saved */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <SectionNum n="01" />
                  <h2 className="font-display text-xl" style={{ color: '#1E1F18', letterSpacing: '-0.3px' }}>{tr('pages.profile.section.saved')}</h2>
                </div>
                <Link to="/imoveis" className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-150"
                  style={{ color: '#C2553A' }}>
                  {tr('pages.profile.exploreMore')} <ArrowRight size={13} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {saved.map(p => <PropertyCard key={p.id} property={p} />)}
              </div>
            </div>

            {/* Quiz CTA */}
            <div>
              <Divider />
              <SectionNum n="02" />
              <h2 className="font-display text-xl mb-5" style={{ color: '#1E1F18', letterSpacing: '-0.3px' }}>{tr('pages.profile.section.buyer')}</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6"
                style={{ background: '#F2EDE4', border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#1E1F18' }}>{tr('pages.profile.quizTitle')}</p>
                  <p className="text-sm mt-1" style={{ color: '#3A3B2E' }}>{tr('pages.profile.quizBody')}</p>
                </div>
                <button
                  onClick={() => openQuiz()}
                  className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold transition-opacity hover:opacity-85"
                  style={{ background: '#C2553A', borderRadius: '2px', border: 'none', cursor: 'pointer' }}>
                  {tr('pages.profile.redoQuiz')} <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Settings */}
            <div>
              <Divider />
              <SectionNum n="03" />
              <h2 className="font-display text-xl mb-5" style={{ color: '#1E1F18', letterSpacing: '-0.3px' }}>{tr('pages.profile.section.settings')}</h2>
              <div style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }} className="overflow-hidden bg-white">
                {settingsRows.map((item, i, arr) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-4"
                    style={i < arr.length - 1 ? { borderBottom: '1px solid #F0EDE8' } : {}}>
                    <span className="text-sm" style={{ color: '#3A3B2E' }}>{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium" style={{ color: '#1E1F18' }}>{item.value}</span>
                      <button className="text-xs font-semibold transition-colors duration-150" style={{ color: '#C2553A' }}>{tr('pages.profile.edit')}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
