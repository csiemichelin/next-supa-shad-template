import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase environment variables are not configured')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const slidesBucket = 'slides'

const extractSlidesStoragePath = (imageUrl?: string | null) => {
  if (!imageUrl) return null
  try {
    const url = new URL(imageUrl)
    const match = url.pathname.match(/\/storage\/v1\/object\/(?:sign|public)\/slides\/(.+)/)
    if (match?.[1]) {
      return decodeURIComponent(match[1])
    }
  } catch (error) {
    console.error('Failed to parse slides storage path', error)
  }
  return null
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ message: '缺少檔案' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileExt = file.name.split('.').pop() ?? 'jpg'
    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '')
    const fileName = `${baseName || 'slide'}-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from(slidesBucket).upload(fileName, buffer, {
      cacheControl: '31536000',
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })

    if (uploadError) {
      console.error('Failed to upload slide image', uploadError)
      return NextResponse.json({ message: '圖片上傳失敗' }, { status: 500 })
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from(slidesBucket)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365)

    if (signedError || !signedData?.signedUrl) {
      console.error('Failed to create slide signed url', signedError)
      return NextResponse.json({ message: '取得圖片網址失敗' }, { status: 500 })
    }

    return NextResponse.json({ url: signedData.signedUrl, storagePath: fileName })
  } catch (error) {
    console.error('Slides upload API error', error)
    return NextResponse.json({ message: '上傳發生錯誤' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('imageUrl')
    if (!imageUrl) {
      return NextResponse.json({ message: '缺少 imageUrl' }, { status: 400 })
    }

    const storagePath = extractSlidesStoragePath(imageUrl)
    if (!storagePath) {
      return NextResponse.json({ message: '無效的圖片網址' }, { status: 400 })
    }

    const { error } = await supabase.storage.from(slidesBucket).remove([storagePath])
    if (error) {
      console.error('Failed to delete slide image from storage', error)
      return NextResponse.json({ message: '刪除圖片失敗' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Slides delete API error', error)
    return NextResponse.json({ message: '刪除發生錯誤' }, { status: 500 })
  }
}
