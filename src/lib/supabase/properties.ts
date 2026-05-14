// properties.ts — Data access layer for the properties table.

import { supabase } from '../supabase'
import type { Database } from './types'

export type PropertyRow    = Database['public']['Tables']['properties']['Row']
export type PropertyInsert = Database['public']['Tables']['properties']['Insert']
export type PropertyUpdate = Database['public']['Tables']['properties']['Update']

/** Fetch all active properties (public). */
export async function getActiveProperties(): Promise<PropertyRow[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[properties] getActiveProperties error:', error.message)
    return []
  }
  return data ?? []
}

/** Fetch properties for a specific zone slug (public, active only). */
export async function getPropertiesByZone(zoneSlug: string): Promise<PropertyRow[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('zone_slug', zoneSlug)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[properties] getPropertiesByZone error:', error.message)
    return []
  }
  return data ?? []
}

/** Fetch all properties owned by a user (all statuses). */
export async function getMyProperties(userId: string): Promise<PropertyRow[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[properties] getMyProperties error:', error.message)
    return []
  }
  return data ?? []
}

/** Fetch a single property by id. */
export async function getPropertyById(id: string): Promise<PropertyRow | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('[properties] getPropertyById error:', error.message)
    return null
  }
  return data
}

/** Insert a new property. Returns the created row. */
export async function createProperty(payload: PropertyInsert): Promise<PropertyRow> {
  const { data, error } = await supabase
    .from('properties')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('[properties] createProperty error:', error.message)
    throw error
  }
  return data
}

/** Update an existing property. Only the owner can do this (enforced by RLS). */
export async function updateProperty(id: string, payload: PropertyUpdate): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('[properties] updateProperty error:', error.message)
    throw error
  }
}

/** Delete a property. Only the owner can do this (enforced by RLS). */
export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[properties] deleteProperty error:', error.message)
    throw error
  }
}
