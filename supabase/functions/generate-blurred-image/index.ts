import { createClient } from '@supabase/supabase-js'
import { createReadStream } from 'fs'
import { pipeline } from 'stream/promises'
import sharp from 'sharp'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async (req: any, res: any) => {
  try {
    const { imageUrl } = req.body
    
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
    const blurredPath = `blurred/${Date.now()}.jpg`
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

    res.status(200).json({ blurredUrl: publicUrl })
  } catch (error) {
    console.error('Error generating blurred image:', error)
    res.status(500).json({ error: 'Failed to generate blurred image' })
  }
}
