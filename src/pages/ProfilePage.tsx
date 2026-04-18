import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Heart, Search, BookOpen, Bell, LogOut, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { properties } from '../data/properties'
import PropertyCard from '../components/PropertyCard'
import { BlockLabel, SectionNum, Divider } from '../components/Brand'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (!user) navigate('/entrar') }, [user, navigate])
  if (!user) return null

  const saved = properties.slice(0, 2)

  const sideItems = [
    { icon: <Heart size={15} />, label: 'Imóveis guardados', count: 2 },
    { icon: <Search size={15} />, label: 'As minhas pesquisas', count: 0 },
    { icon: <BookOpen size={15} />, label: 'Quiz e recomendações', count: 1 },
    { icon: <Bell size={15} />, label: 'Alertas activos', count: 0 },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#F7F5F0' }}>
      {/* Header */}
      <section style={{ background: '#0A0A0B' }} className="pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-14 h-14 flex items-center justify-center text-white font-display text-2xl font-medium flex-shrink-0"
              style={{ background: '#C45D3E', borderRadius: '2px' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <BlockLabel light>O meu perfil</BlockLabel>
              <h1 className="font-display text-white text-3xl lg:text-4xl" style={{ letterSpacing: '-1px', lineHeight: '1.1' }}>
                Olá, {user.name}
              </h1>
              <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'IBM Plex Mono' }}>{user.email}</p>
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
                style={{ border: '1px solid #E8E4DC', borderRadius: '2px' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#C45D3E')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#E8E4DC')}>
                <div className="flex items-center gap-3 text-sm font-medium" style={{ color: '#0A0A0B' }}>
                  <span style={{ color: '#9A9590' }}>{item.icon}</span>
                  {item.label}
                </div>
                <span className="text-xs font-semibold px-2 py-0.5" style={{ fontFamily: 'IBM Plex Mono', background: item.count > 0 ? '#FAF8F3' : '#F7F5F0', color: item.count > 0 ? '#C45D3E' : '#C9C5BD', border: '1px solid #E8E4DC' }}>
                  {item.count}
                </span>
              </div>
            ))}

            <button onClick={() => { logout(); navigate('/') }}
              className="w-full flex items-center gap-3 p-4 text-sm font-medium transition-all duration-150"
              style={{ border: '1px solid #E8E4DC', color: '#9A9590', borderRadius: '2px', background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0A0A0B'; e.currentTarget.style.background = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9A9590'; e.currentTarget.style.background = 'transparent' }}>
              <LogOut size={14} /> Terminar sessão
            </button>
          </div>

          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            {/* Saved */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <SectionNum n="01" />
                  <h2 className="font-display text-xl" style={{ color: '#0A0A0B', letterSpacing: '-0.3px' }}>Imóveis guardados</h2>
                </div>
                <Link to="/imoveis" className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-150"
                  style={{ color: '#C45D3E' }}>
                  Explorar mais <ArrowRight size={13} />
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
              <h2 className="font-display text-xl mb-5" style={{ color: '#0A0A0B', letterSpacing: '-0.3px' }}>Perfil de comprador</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6"
                style={{ background: '#FAF8F3', border: '1px solid #E8E4DC', borderRadius: '2px' }}>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#0A0A0B' }}>Quiz de compatibilidade</p>
                  <p className="text-sm mt-1" style={{ color: '#9A9590' }}>Complete o quiz para recomendações de zonas e imóveis personalizadas.</p>
                </div>
                <Link to="/quiz"
                  className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold transition-opacity hover:opacity-85"
                  style={{ background: '#C45D3E', borderRadius: '2px' }}>
                  Refazer quiz <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Settings */}
            <div>
              <Divider />
              <SectionNum n="03" />
              <h2 className="font-display text-xl mb-5" style={{ color: '#0A0A0B', letterSpacing: '-0.3px' }}>Definições da conta</h2>
              <div style={{ border: '1px solid #E8E4DC', borderRadius: '2px' }} className="overflow-hidden bg-white">
                {[
                  { label: 'Nome', value: user.name },
                  { label: 'Email', value: user.email },
                  { label: 'Password', value: '••••••••' },
                  { label: 'Notificações', value: 'Activadas' },
                ].map((item, i, arr) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-4"
                    style={i < arr.length - 1 ? { borderBottom: '1px solid #F0EDE8' } : {}}>
                    <span className="text-sm" style={{ color: '#9A9590' }}>{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium" style={{ color: '#0A0A0B' }}>{item.value}</span>
                      <button className="text-xs font-semibold transition-colors duration-150" style={{ color: '#C45D3E' }}>Editar</button>
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
