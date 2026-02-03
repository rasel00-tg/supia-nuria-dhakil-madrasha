import { createClient } from '@supabase/supabase-js'

// Supabase Configuration with Safety Mock for Preview
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isValidUrl = (url) => {
    try {
        if (!url || url.includes('your-project-id')) return false
        new URL(url)
        return true
    } catch {
        return false
    }
}

let supabaseInstance;

if (isValidUrl(supabaseUrl)) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
} else {
    console.warn('🚀 Running in Preview Mode: Backend connection disabled.')
    // Mock Supabase object to prevent crashes
    supabaseInstance = {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async () => ({ data: { user: { id: 'mock-id' } }, error: null }),
            signUp: async () => ({ data: { user: { id: 'mock-id' } }, error: null }),
            signOut: async () => ({ error: null }),
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: async () => ({ data: null, error: null }),
                    order: () => ({ limit: async () => ({ data: [], error: null }) }),
                    limit: async () => ({ data: [], error: null }),
                }),
                order: () => ({ limit: async () => ({ data: [], error: null }) }),
                limit: async () => ({ data: [], error: null }),
                single: async () => ({ data: null, error: null }),
            }),
            insert: async () => ({ data: [], error: null }),
            delete: () => ({ eq: async () => ({ error: null }) }),
            update: () => ({ eq: async () => ({ error: null }) }),
        })
    }
}

export const supabase = supabaseInstance

export const ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student'
}
