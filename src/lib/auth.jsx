import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import { setNotificationTags, clearNotificationTags } from './onesignal'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession]           = useState(undefined)
  const [recoveryMode, setRecoveryMode] = useState(false)
  const [profile, setProfile]           = useState(undefined) // undefined=loading, null=no profile, obj=loaded

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    setProfile(data ?? null)
  }, [])

  const ensureProfile = useCallback(async (user) => {
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (existing) {
      setProfile(existing)
      setNotificationTags(existing.agency, existing.staff_type)
      return
    }

    // First-time login: create profile from registration metadata
    const { data: created } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        agency:     user.user_metadata?.agency     ?? null,
        staff_type: user.user_metadata?.staff_type ?? null,
      })
      .select()
      .single()

    setProfile(created ?? null)
    if (created) setNotificationTags(created.agency, created.staff_type)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s ?? null)
      if (s) ensureProfile(s.user)
      else    setProfile(null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true)
        setSession(s ?? null)
        return
      }
      setRecoveryMode(false)
      setSession(s ?? null)
      if (s) ensureProfile(s.user)
      else   setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [ensureProfile])

  const refreshProfile = useCallback(() => {
    if (session?.user) fetchProfile(session.user.id)
  }, [session, fetchProfile])

  const profileLoading = !!session && profile === undefined

  return (
    <AuthContext.Provider value={{ session, loading: session === undefined, recoveryMode, profile, profileLoading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
