import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

/**
 * Wraps the app and provides the current Supabase session.
 * session === undefined  → still loading (show spinner)
 * session === null       → not logged in (show Login page)
 * session === object     → logged in
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s ?? null))
    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading: session === undefined }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
