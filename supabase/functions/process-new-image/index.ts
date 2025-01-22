import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 204,
    });
  }

  try {
    const { record } = await req.json();
    const { id, original_url } = record;

    if (!original_url) {
      throw new Error('Missing original_url in new record');
    }

    // Call the generate-blurred-image function
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-blurred-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({
          artworkId: id,
          imageUrl: original_url
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to process image: ${await response.text()}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing new image:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
