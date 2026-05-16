import { useParams, Navigate } from 'react-router-dom'
import PillarPage from './PillarPage'
import { getPillar } from '../../data/guias'

export default function PillarRoute() {
  const { slug } = useParams<{ slug: string }>()
  if (!slug) return <Navigate to="/" replace />
  const data = getPillar(slug)
  if (!data) return <Navigate to="/" replace />
  return <PillarPage {...data} />
}
