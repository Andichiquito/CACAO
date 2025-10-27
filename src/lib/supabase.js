// Supabase configuration - temporarily disabled for deployment
// Uncomment and configure environment variables when needed

// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
// const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// export const supabase = createClient(supabaseUrl, supabaseKey)

// Temporary mock for deployment
export const supabase = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null })
  })
}
