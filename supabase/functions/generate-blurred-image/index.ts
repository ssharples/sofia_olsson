import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as sharp from 'https://deno.land/x/sharp@0.32.1/mod.ts'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { imageUrl, artworkId } = await req.json();
    
    // Download the original image
    const { data: imageBuffer, error: downloadError } = await supabase.storage
      .from('artworks')
      .download(imageUrl)

    if (downloadError) throw downloadError

    // Create blurred version
    const blurredImage = await sharp(await imageBuffer.arrayBuffer())
      .resize(1200, 630, { fit: 'cover' })
      .blur(20)
      .toBuffer()

    // Upload blurred version
    const blurredPath = `blurred/${artworkId}.jpg`
    const { error: uploadError } = await supabase.storage
      .from('artworks')
      .upload(blurredPath, blurredImage, {
        contentType: 'image/jpeg',
        upsert: true
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('artworks')
      .getPublicUrl(blurredPath)

    return new Response(JSON.stringify({ blurredUrl: publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error generating blurred image:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate blurred image' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
