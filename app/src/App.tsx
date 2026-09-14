import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  createBookingRecord,
  fetchBookingsForUser,
  fetchProvidersWithDetails,
  signInWithSupabase,
  signOutFromSupabase,
  signUpWithSupabase,
  supabase,
} from './lib/supabase'
import { fallbackBookings, fallbackProfile, fallbackProviders, type Provider } from './lib/mock-data'

const availability = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM']

const defaultProviderImage = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'

function mapProviderRow(provider: any): Provider {
  const services = Array.isArray(provider.provider_services)
    ? provider.provider_services
        .filter((service: any) => service && service.is_active !== false)
        .map((service: any) => ({
          id: service.id,
          name: service.name,
          duration: `${service.duration_minutes ?? 60} min`,
          price: Number(service.price ?? provider.hourly_rate ?? 75),
        }))
    : [
        {
          id: 'default-service',
          name: provider.specialty || 'General Service',
          duration: '60 min',
          price: Number(provider.hourly_rate ?? 75),
        },
      ]

  const timeSlots = Array.isArray(provider.provider_availability)
    ? provider.provider_availability
        .filter((slot: any) => slot && slot.is_available !== false)
        .map((slot: any) => {
          const start = String(slot.start_time ?? '09:00:00')
          const end = String(slot.end_time ?? '17:00:00')
          return `${start.slice(0, 5)} - ${end.slice(0, 5)}`
        })
    : availability

  return {
    id: provider.id,
    name: provider.business_name,
    category: provider.specialty || 'General',
    subcategory: provider.location || 'Local',
    city: provider.location || 'Local',
    rating: Number(provider.rating ?? 4.8),
    reviewCount: Number(provider.review_count ?? 0),
    price: Number(provider.hourly_rate ?? 75),
    availability: timeSlots.length ? timeSlots : availability,
    image: provider.photo_url || defaultProviderImage,
    bio: provider.bio || 'Verified local provider with strong ratings and dependable service.',
    verified: provider.is_verified ?? true,
    services,
  }
}

function App() {
  const [session, setSession] = useState<any>(null)
  const [providers, setProviders] = useState<Provider[]>(fallbackProviders)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const loadSession = async () => {
      if (!supabase) {
        setSession(null)
        setProviders(fallbackProviders)
        setIsReady(true)
        return
      }

      const { data } = await supabase.auth.getSession()
      setSession(data.session)

      const { data: providerRows, error } = await fetchProvidersWithDetails()
      if (!error && providerRows && providerRows.length > 0) {
        setProviders(providerRows.map(mapProviderRow))
      } else {
        setProviders(fallbackProviders)
      }

      setIsReady(true)
    }

    loadSession()

    if (!supabase) {
      return
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (!isReady) {
    return <div className="loader-shell">Loading app…</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage providers={providers} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/search" element={<SearchPage providers={providers} />} />
        <Route path="/providers/:providerId" element={<ProviderPage providers={providers} />} />
        <Route path="/booking/:providerId" element={<BookingPage providers={providers} userId={session?.user?.id} />} />
        <Route path="/dashboard" element={session ? <DashboardPage providers={providers} userId={session.user?.id} /> : <Navigate to="/" replace />} />
        <Route path="/profile" element={session ? <ProfilePage /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('alex@example.com')
  const [password, setPassword] = useState('Password123!')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    const { error: signInError } = await signInWithSupabase(email, password)

    if (signInError) {
      setError(signInError.message)
      setIsSubmitting(false)
      return
    }

    navigate('/search')
  }

  return (
    <div className="page-shell auth-shell">
      <header className="auth-header">
        <button className="icon-button" type="button" aria-label="Help">
          <span className="material-symbols">help</span>
        </button>
      </header>
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-header-copy">
            <h1>Welcome back</h1>
            <p>Sign in to continue your journey.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field-label sr-only" htmlFor="emailPhone">
              Email or phone number
            </label>
            <input
              id="emailPhone"
              className="text-field"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email or phone number"
            />

            <input
              className="text-field"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
            />

            <div className="text-right">
              <a href="#" className="inline-link">
                Forgot password?
              </a>
            </div>

            {error ? <div className="error-box">{error}</div> : null}

            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="divider">
            <span>Or sign in with</span>
          </div>

          <div className="social-row">
            <button className="social-button" type="button">
              <span className="material-symbols">facebook</span>
              Facebook
            </button>
            <button className="social-button" type="button">
              <span className="material-symbols">g_mobiledata</span>
              Google
            </button>
          </div>
        </div>
      </main>
      <footer className="auth-footer">
        <p>
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </footer>
    </div>
  )
}

function SignUpPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('Alex Morgan')
  const [email, setEmail] = useState('alex@example.com')
  const [password, setPassword] = useState('Password123!')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    const { error: signUpError } = await signUpWithSupabase(email, password, fullName)

    if (signUpError) {
      setError(signUpError.message)
      setIsSubmitting(false)
      return
    }

    navigate('/login')
  }

  return (
    <div className="page-shell auth-shell">
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-header-copy">
            <h1>Create account</h1>
            <p>Join your local service network.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input className="text-field" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Full name" />
            <input className="text-field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
            <input className="text-field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
            {error ? <div className="error-box">{error}</div> : null}
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          <p className="auth-footer text-center">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  )
}

function SearchPage({ providers }: { providers: Provider[] }) {
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const filteredProviders = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return providers
    return providers.filter((provider) => {
      const haystack = `${provider.name} ${provider.category} ${provider.city}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [providers, query])

  const filterChips = ['Location', 'Rating', 'Price Range', 'Availability']

  return (
    <div className="page-shell app-shell">
      <header className="top-header search-header">
        <Link to="/" className="icon-button" aria-label="Back to home">
          <span className="material-symbols">arrow_back</span>
        </Link>
        <div className="search-wrap">
          <span className="material-symbols search-icon">search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services..." />
        </div>
        <button className="icon-button" type="button" aria-label="Filters">
          <span className="material-symbols">tune</span>
        </button>
      </header>

      <main className="content-stack search-main">
        <div className="sort-row">
          <p>{filteredProviders.length}+ services available</p>
          <div className="sort-chip">
            <span>Sort by: <strong>Recommended</strong></span>
            <span className="material-symbols smaller">unfold_more</span>
          </div>
        </div>

        <div className="filter-row">
          {filterChips.map((chip) => (
            <button key={chip} className="filter-chip" type="button">
              <span>{chip}</span>
              <span className="material-symbols tiny">expand_more</span>
            </button>
          ))}
        </div>

        <div className="toggle-row">
          <button type="button" className={`toggle-pill ${viewMode === 'list' ? 'selected' : ''}`} onClick={() => setViewMode('list')}>
            List
          </button>
          <button type="button" className={`toggle-pill ${viewMode === 'map' ? 'selected' : ''}`} onClick={() => setViewMode('map')}>
            Map
          </button>
        </div>

        <div className="provider-list">
          {filteredProviders.map((provider) => (
            <article className="provider-card" key={provider.id}>
              <div className="provider-image" style={{ backgroundImage: `url(${provider.image})` }} />
              <div className="provider-card-body">
                <div className="provider-meta-row">
                  <p className="pill-text">{provider.category}</p>
                  <span className="material-symbols favorite">favorite_border</span>
                </div>
                <h3>{provider.name}</h3>
                <div className="rating-line">
                  <span className="material-symbols star">star</span>
                  <span>{provider.rating} ({provider.reviewCount} reviews)</span>
                </div>
                <p className="description">{provider.bio}</p>
                <div className="provider-card-footer">
                  <p className="price">${provider.price} - ${provider.price + 100}</p>
                  <Link className="primary-button small-button" to={`/providers/${provider.id}`}>
                    Book
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="bottom-nav">
        <Link to="/search" className="nav-item active">
          <span className="material-symbols">home</span>
          <span>Home</span>
        </Link>
        <Link to="/search" className="nav-item active-item">
          <span className="material-symbols">search</span>
          <span>Search</span>
        </Link>
        <Link to="/dashboard" className="nav-item">
          <span className="material-symbols">calendar_month</span>
          <span>Bookings</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <span className="material-symbols">person</span>
          <span>Profile</span>
        </Link>
      </footer>
    </div>
  )
}

function ProviderPage({ providers }: { providers: Provider[] }) {
  const { providerId } = useParams()
  const navigate = useNavigate()
  const provider = providers.find((entry) => entry.id === providerId) ?? providers[0]

  return (
    <div className="page-shell app-shell">
      <header className="section-header provider-header">
        <button className="icon-button" type="button" onClick={() => navigate(-1)} aria-label="Back">
          <span className="material-symbols">arrow_back</span>
        </button>
        <h1>Provider Profile</h1>
        <div className="placeholder-rail" />
      </header>

      <main className="detail-main">
        <section className="profile-banner provider-banner">
          <div className="avatar large" style={{ backgroundImage: `url(${provider.image})` }} />
          <div className="name-row">
            <h2>{provider.name}</h2>
            <span className="material-symbols success">verified</span>
          </div>
          <p className="muted">Verified Provider</p>
          <div className="rating-line with-gap">
            <span className="material-symbols star">star</span>
            <span>{provider.rating} ({provider.reviewCount} reviews)</span>
          </div>
        </section>

        <section className="detail-section">
          <h3>About</h3>
          <p>{provider.bio}</p>
        </section>

        <section className="detail-section">
          <h3>Services</h3>
          <div className="service-list">
            {provider.services.map((service) => (
              <div className="service-item" key={service.id}>
                <div>
                  <p className="service-name">{service.name}</p>
                  <p className="service-meta">{service.duration} · ${service.price}</p>
                </div>
                <button className="secondary-button" type="button" onClick={() => navigate(`/booking/${provider.id}`)}>
                  Book
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <h3>Availability</h3>
          <div className="calendar-card">
            <div className="calendar-header">
              <button className="icon-button small" type="button"><span className="material-symbols">chevron_left</span></button>
              <p>July 2024</p>
              <button className="icon-button small" type="button"><span className="material-symbols">chevron_right</span></button>
            </div>
            <div className="calendar-grid">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="calendar-day label">{day}</div>
              ))}
              {Array.from({ length: 30 }, (_, index) => (
                <button key={index} className={`calendar-day ${index === 4 ? 'is-selected' : ''}`} type="button">
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bottom-cta">
        <button className="secondary-button wide" type="button">Message</button>
        <button className="primary-button wide" type="button" onClick={() => navigate(`/booking/${provider.id}`)}>Book Now</button>
      </footer>
    </div>
  )
}

function BookingPage({ providers, userId }: { providers: Provider[]; userId?: string }) {
  const { providerId } = useParams()
  const navigate = useNavigate()
  const provider = providers.find((entry) => entry.id === providerId) ?? providers[0]
  const [selectedServiceId, setSelectedServiceId] = useState(provider.services[0]?.id ?? 'default-service')
  const [selectedTime, setSelectedTime] = useState(provider.availability[2] ?? '11:00 AM')
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 3)
    return date.toISOString().slice(0, 10)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedService = provider.services.find((service) => service.id === selectedServiceId) ?? provider.services[0]

  async function handleBooking() {
    if (!userId) {
      navigate('/login')
      return
    }

    setIsSubmitting(true)

    const rawTime = selectedTime.includes(' - ') ? selectedTime.split(' - ')[0] : selectedTime
    const normalizedTime = rawTime.replace(' AM', '').replace(' PM', '')
    const startsAt = new Date(`${selectedDate}T${normalizedTime}:00`)
    const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000)

    const { error } = await createBookingRecord({
      provider_id: provider.id,
      service_id: selectedService?.id ?? 'default-service',
      client_id: userId,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      total_price: Number(selectedService?.price ?? provider.price),
      notes: `Booked with ${provider.name}`,
    })

    setIsSubmitting(false)
    if (!error) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="page-shell app-shell">
      <header className="section-header">
        <button className="icon-button" type="button" onClick={() => navigate(-1)} aria-label="Back">
          <span className="material-symbols">arrow_back</span>
        </button>
        <h1>Book</h1>
        <div className="placeholder-rail" />
      </header>

      <main className="detail-main">
        <div className="booking-summary-card">
          <div className="mini-avatar" style={{ backgroundImage: `url(${provider.image})` }} />
          <div>
            <p className="booking-provider">{provider.name}</p>
            <p className="muted">{selectedService?.name ?? provider.category}</p>
          </div>
        </div>

        <h2 className="booking-title">Select date and time</h2>
        <div className="calendar-card large">
          <div className="calendar-header">
            <button className="icon-button small" type="button"><span className="material-symbols">chevron_left</span></button>
            <p>May 2024</p>
            <div className="placeholder-rail" />
          </div>
          <div className="calendar-grid booking-grid">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="calendar-day label">{day}</div>
            ))}
            {Array.from({ length: 31 }, (_, index) => (
              <button key={index} className={`calendar-day ${index === 4 ? 'is-selected' : ''}`} type="button" onClick={() => setSelectedDate(`2026-05-${String(index + 1).padStart(2, '0')}`)}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <h3 className="booking-subtitle">Service</h3>
        <div className="time-list">
          {provider.services.map((service) => (
            <button
              key={service.id}
              className={`time-button ${selectedServiceId === service.id ? 'active' : ''}`}
              type="button"
              onClick={() => setSelectedServiceId(service.id)}
            >
              {service.name}
            </button>
          ))}
        </div>

        <h3 className="booking-subtitle">Available times</h3>
        <div className="time-list">
          {provider.availability.map((slot) => (
            <button
              key={slot}
              className={`time-button ${selectedTime === slot ? 'active' : ''}`}
              type="button"
              onClick={() => setSelectedTime(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      </main>

      <footer className="booking-footer">
        <button className="primary-button wide" type="button" onClick={handleBooking} disabled={isSubmitting}>
          {isSubmitting ? 'Booking…' : 'Continue'}
        </button>
      </footer>
    </div>
  )
}

function DashboardPage({ providers, userId }: { providers: Provider[]; userId?: string }) {
  const [bookings, setBookings] = useState(fallbackBookings)

  useEffect(() => {
    const loadBookings = async () => {
      if (!userId || !supabase) {
        setBookings(fallbackBookings)
        return
      }

      const { data, error } = await fetchBookingsForUser(userId)
      if (!error && data && data.length > 0) {
        setBookings(
          data.map((booking: any) => ({
            id: booking.id,
            providerName: booking.providers?.business_name ?? 'Service Provider',
            serviceName: booking.provider_services?.name ?? 'Service',
            date: new Date(booking.starts_at).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            }),
            time: new Date(booking.starts_at).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            }),
            status: booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Confirmed',
            amount: `$${Number(booking.total_price ?? 0)}`,
          })),
        )
        return
      }

      setBookings(fallbackBookings)
    }

    loadBookings()
  }, [userId])

  return (
    <div className="page-shell app-shell">
      <header className="section-header">
        <button className="icon-button" type="button"><span className="material-symbols">arrow_back</span></button>
        <h1>Bookings</h1>
        <button className="icon-button" type="button"><span className="material-symbols">settings</span></button>
      </header>

      <main className="detail-main">
        <section className="dashboard-card">
          <h3>Upcoming appointments</h3>
          <div className="booking-stack">
            {bookings.map((booking) => (
              <div className="booking-item" key={booking.id}>
                <div className="booking-icon"><span className="material-symbols">calendar_month</span></div>
                <div className="booking-copy">
                  <p className="booking-provider">{booking.providerName}</p>
                  <p>{booking.date} · {booking.time}</p>
                  <p className="booking-status">{booking.status}</p>
                </div>
                <span className="booking-amount">{booking.amount}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card provider-mini-grid">
          {providers.slice(0, 3).map((provider) => (
            <div key={provider.id} className="provider-mini-card">
              <div className="mini-avatar" style={{ backgroundImage: `url(${provider.image})` }} />
              <p>{provider.name}</p>
              <small>{provider.category}</small>
            </div>
          ))}
        </section>
      </main>

      <footer className="bottom-nav">
        <Link to="/search" className="nav-item"><span className="material-symbols">home</span><span>Home</span></Link>
        <Link to="/search" className="nav-item"><span className="material-symbols">search</span><span>Search</span></Link>
        <Link to="/dashboard" className="nav-item active-item"><span className="material-symbols">calendar_month</span><span>Bookings</span></Link>
        <Link to="/profile" className="nav-item"><span className="material-symbols">person</span><span>Profile</span></Link>
      </footer>
    </div>
  )
}

function ProfilePage() {
  const navigate = useNavigate()
  const profile = fallbackProfile

  async function handleSignOut() {
    await signOutFromSupabase()
    navigate('/login')
  }

  return (
    <div className="page-shell app-shell">
      <header className="section-header">
        <button className="icon-button" type="button" onClick={() => navigate(-1)} aria-label="Back">
          <span className="material-symbols">arrow_back</span>
        </button>
        <h1>Profile</h1>
        <button className="icon-button" type="button" aria-label="Edit profile">
          <span className="material-symbols">edit</span>
        </button>
      </header>

      <main className="detail-main profile-page">
        <div className="profile-card">
          <div className="avatar large" style={{ backgroundImage: `url(${profile.avatar})` }} />
          <h2>{profile.fullName}</h2>
          <p>{profile.email}</p>
          <p>{profile.phone}</p>
        </div>

        <div className="profile-actions">
          <button className="secondary-button wide" type="button">Update profile</button>
          <button className="primary-button wide" type="button" onClick={handleSignOut}>Log out</button>
        </div>
      </main>
    </div>
  )
}

export default App
