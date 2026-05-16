import { useParams, Navigate } from 'react-router-dom'
import ConcelhoHub from './ConcelhoHub'
import { getConcelhoHub } from '../../data/aml/concelhos'

export default function ConcelhoRoute() {
  const { concelho } = useParams<{ concelho: string }>()
  if (!concelho) return <Navigate to="/" replace />
  const data = getConcelhoHub(concelho)
  if (!data) return <Navigate to="/" replace />
  return <ConcelhoHub data={data} />
}
