/**
 * FreguesiaRoute — client-side wrapper for FreguesiaPage.
 *
 * Reads :concelho/:freguesia from the URL, looks up the static data file,
 * and renders the prerender-safe FreguesiaPage. If the freguesia has no
 * data file yet, sends to / (root). The actual prerendered static HTML
 * is served by Vercel's filesystem before this code ever runs — this
 * route handles the SPA path (dev preview, direct navigation after
 * SPA boot).
 */

import { useParams, Navigate } from 'react-router-dom'
import FreguesiaPage from './FreguesiaPage'
import { getFreguesia } from '../../data/aml/freguesias'

export default function FreguesiaRoute() {
  const { concelho, freguesia } = useParams<{ concelho: string; freguesia: string }>()
  if (!concelho || !freguesia) return <Navigate to="/" replace />
  const data = getFreguesia(concelho, freguesia)
  if (!data) return <Navigate to="/" replace />
  return <FreguesiaPage {...data} />
}
