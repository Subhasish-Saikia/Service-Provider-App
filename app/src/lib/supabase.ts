import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

const LOCAL_PROVIDER_KEY = 'service-provider-demo-providers-v1'
const LOCAL_BOOKING_KEY = 'service-provider-demo-bookings-v1'

const seedProviders = [
  {
    id: 'provider-alex',
    business_name: 'Rapid Rooter Plumbing',
    specialty: 'Plumbing',
    location: 'San Francisco',
    bio: 'Fast, reliable plumbing repairs for homes and small businesses.',
    hourly_rate: 95,
    rating: 4.9,
    review_count: 128,
    photo_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
    is_verified: true,
    provider_services: [
      { id: 'service-drain', name: 'Drain Cleaning', duration_minutes: 45, price: 95, is_active: true },
      { id: 'service-repair', name: 'Pipe Repair', duration_minutes: 60, price: 120, is_active: true },
      { id: 'service-water', name: 'Water Heater Service', duration_minutes: 90, price: 190, is_active: true },
    ],
    provider_availability: [
      { id: 'slot-1', start_time: '09:00:00', end_time: '10:00:00', is_available: true },
      { id: 'slot-2', start_time: '10:00:00', end_time: '11:00:00', is_available: true },
      { id: 'slot-3', start_time: '11:00:00', end_time: '12:00:00', is_available: true },
      { id: 'slot-4', start_time: '13:00:00', end_time: '14:00:00', is_available: true },
      { id: 'slot-5', start_time: '14:00:00', end_time: '15:00:00', is_available: true },
    ],
  },
  {
    id: 'provider-maya',
    business_name: 'City Glow Cleaning',
    specialty: 'Cleaning',
    location: 'San Francisco',
    bio: 'Eco-conscious home and office cleaning with a detail-first approach.',
    hourly_rate: 80,
    rating: 4.8,
    review_count: 214,
    photo_url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80',
    is_verified: true,
    provider_services: [
      { id: 'service-deep', name: 'Deep Clean', duration_minutes: 90, price: 120, is_active: true },
      { id: 'service-office', name: 'Office Refresh', duration_minutes: 120, price: 160, is_active: true },
      { id: 'service-move', name: 'Move-In Cleanup', duration_minutes: 150, price: 200, is_active: true },
    ],
    provider_availability: [
      { id: 'slot-6', start_time: '08:00:00', end_time: '09:00:00', is_available: true },
      { id: 'slot-7', start_time: '09:30:00', end_time: '10:30:00', is_available: true },
      { id: 'slot-8', start_time: '12:00:00', end_time: '13:00:00', is_available: true },
      { id: 'slot-9', start_time: '14:30:00', end_time: '15:30:00', is_available: true },
    ],
  },
  {
    id: 'provider-jules',
    business_name: 'Summit Electric Co.',
    specialty: 'Electrical',
    location: 'Oakland',
    bio: 'Licensed electricians for upgrades, repairs, lighting, and panel services.',
    hourly_rate: 110,
    rating: 4.9,
    review_count: 168,
    photo_url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80',
    is_verified: true,
    provider_services: [
      { id: 'service-lighting', name: 'Lighting Install', duration_minutes: 60, price: 130, is_active: true },
      { id: 'service-panel', name: 'Panel Upgrade', duration_minutes: 180, price: 240, is_active: true },
      { id: 'service-fault', name: 'Fault Diagnosis', duration_minutes: 75, price: 140, is_active: true },
    ],
    provider_availability: [
      { id: 'slot-10', start_time: '09:00:00', end_time: '10:00:00', is_available: true },
      { id: 'slot-11', start_time: '10:30:00', end_time: '11:30:00', is_available: true },
      { id: 'slot-12', start_time: '13:30:00', end_time: '14:30:00', is_available: true },
      { id: 'slot-13', start_time: '15:00:00', end_time: '16:00:00', is_available: true },
    ],
  },
]

function safeReadLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeWriteLocalStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore storage write issues
  }
}

export function loadLocalProviders() {
  const existing = safeReadLocalStorage<typeof seedProviders>(LOCAL_PROVIDER_KEY, seedProviders)
  if (!existing || existing.length === 0) {
    safeWriteLocalStorage(LOCAL_PROVIDER_KEY, seedProviders)
    return seedProviders
  }

  return existing
}

export function loadLocalBookings() {
  return safeReadLocalStorage<any[]>(LOCAL_BOOKING_KEY, [])
}

export function saveLocalBookings(data: any[]) {
  safeWriteLocalStorage(LOCAL_BOOKING_KEY, data)
}

export async function signUpWithSupabase(email: string, password: string, fullName: string) {
  if (!supabase) {
    return { data: { user: { email, user_metadata: { full_name: fullName } } }, error: null }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  return { data, error }
}

export async function signInWithSupabase(email: string, password: string) {
  if (!supabase) {
    return { data: { user: { email } }, error: null }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOutFromSupabase() {
  if (!supabase) {
    return { error: null }
  }

  return supabase.auth.signOut()
}

export async function getSession() {
  if (!supabase) {
    return { data: { session: null }, error: null }
  }

  return supabase.auth.getSession()
}

export async function fetchSupabaseData<T>(table: string, select: string) {
  if (!supabase) {
    return { data: [] as T[], error: null }
  }

  const { data, error } = await supabase.from(table).select(select)
  return { data: (data ?? []) as T[], error }
}

export async function fetchProvidersWithDetails() {
  if (!supabase) {
    return { data: loadLocalProviders(), error: null }
  }

  try {
    const { data, error } = await supabase.from('providers').select(`
      *,
      provider_services(*),
      provider_availability(*)
    `)

    if (error) throw error
    return { data: data ?? loadLocalProviders(), error: null }
  } catch {
    return { data: loadLocalProviders(), error: null }
  }
}

export async function fetchBookingsForUser(userId: string) {
  const localBookings = loadLocalBookings().filter((booking) => booking.client_id === userId)

  if (!supabase || !userId) {
    return { data: localBookings, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        providers:provider_id (business_name, photo_url),
        provider_services:service_id (name)
      `)
      .eq('client_id', userId)
      .order('starts_at', { ascending: false })

    if (error) throw error
    return { data: data ?? localBookings, error: null }
  } catch {
    return { data: localBookings, error: null }
  }
}

export async function createBookingRecord(input: {
  provider_id: string
  service_id: string
  client_id: string
  starts_at: string
  ends_at: string
  total_price: number
  notes?: string
}) {
  const payload = {
    provider_id: input.provider_id,
    service_id: input.service_id,
    client_id: input.client_id,
    starts_at: input.starts_at,
    ends_at: input.ends_at,
    total_price: input.total_price,
    notes: input.notes ?? '',
    status: 'pending',
  }

  if (!supabase) {
    const localBookings = loadLocalBookings()
    const nextBooking = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `booking-${Date.now()}`,
      ...payload,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    }
    localBookings.unshift(nextBooking)
    saveLocalBookings(localBookings)
    return { data: [nextBooking], error: null }
  }

  try {
    const { data, error } = await supabase.from('bookings').insert(payload).select()
    if (error) throw error
    return { data: data ?? [], error: null }
  } catch {
    const localBookings = loadLocalBookings()
    const nextBooking = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `booking-${Date.now()}`,
      ...payload,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    }
    localBookings.unshift(nextBooking)
    saveLocalBookings(localBookings)
    return { data: [nextBooking], error: null }
  }
}

export type { AuthResponse, Session } from '@supabase/supabase-js'
