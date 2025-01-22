import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Image } from 'https://deno.land/x/imagescript@1.2.15/mod.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { Buffer } from 'node:buffer'

interface RequestBody {
  imageUrl: string
  artworkId: string
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
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
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] Received request`);
    const { imageUrl, artworkId } = await req.json();
    console.log(`[${new Date().toISOString()}] Processing artwork ${artworkId}`);
    
    // Get the original URL from gallery_images
    const { data: imageRecord, error: fetchError } = await supabase
      .from('gallery_images')
      .select('original_url')
      .eq('id', artworkId)
      .single()

    if (fetchError || !imageRecord?.original_url) {
      throw new Error('Failed to fetch image record or missing original_url')
    }

    // Use the original_url directly since raw=1 allows direct access
    const dropboxResponse = await fetch(imageRecord.original_url)
    if (!dropboxResponse.ok) {
      console.error('Dropbox download failed:', {
        status: dropboxResponse.status,
        statusText: dropboxResponse.statusText,
        url: imageRecord.original_url
      })
      throw new Error('Failed to download from Dropbox')
    }
    console.log('Successfully downloaded image from Dropbox')
    
    const imageArrayBuffer = await dropboxResponse.arrayBuffer()

    // Create blurred version
    const image = await Image.decode(imageArrayBuffer)
    image.resize(1200, 630, Image.RESIZE_AUTO)
    image.blur(20)
    const blurredImage = await image.encode(1.0) // 1.0 = JPEG quality

    // Upload blurred version to 'blurred' bucket
    const blurredPath = `blurred/${artworkId}.jpg`
    const { error: blurUploadError } = await supabase.storage
      .from('blurred')
      .upload(blurredPath, blurredImage, {
        contentType: 'image/jpeg',
        upsert: true,
        cacheControl: '3600'
      })

    if (blurUploadError) {
      console.error('Blurred image upload failed:', blurUploadError)
      throw blurUploadError
    }
    console.log('Successfully uploaded blurred image')

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blurred')
      .getPublicUrl(blurredPath)

    // Update the gallery_images table with the blurred URL
    const { error: updateError } = await supabase
      .from('gallery_images')
      .update({ blurred_url: publicUrl })
      .eq('id', artworkId)

    if (updateError) throw updateError

    const endTime = Date.now();
    console.log(`[${new Date().toISOString()}] Successfully processed artwork ${artworkId} in ${endTime - startTime}ms`);
    
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
