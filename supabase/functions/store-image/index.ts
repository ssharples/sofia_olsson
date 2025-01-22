import { serve } from 'std/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

interface ImageData {
  original_url: string
  blurred_url: string
  price: number
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Verify authorization
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Missing authorization header' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      }
    )
  }

  try {
    const { original_url, blurred_url, price } = await req.json() as ImageData

    // Validate input
    if (!original_url || !blurred_url || !price) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // Insert into database
    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        original_url,
        blurred_url,
        price: parseFloat(price.toString())
      })
      .select()

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
