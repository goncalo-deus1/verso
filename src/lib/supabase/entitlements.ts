import { supabase } from '../supabase'

export async function hasActivePaidPlan(): Promise<boolean> {
  const { data, error } = await supabase.rpc('has_active_paid_plan')
  if (error) {
    console.error('[entitlements] failed to fetch paid plan status', error)
    return false
  }
  return data === true
}
