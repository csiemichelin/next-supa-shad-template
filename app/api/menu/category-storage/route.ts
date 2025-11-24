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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    if (!categoryId) {
      return NextResponse.json({ message: '缺少 categoryId' }, { status: 400 })
    }

    const { data: listData, error: listError } = await supabase.storage
      .from('menu')
      .list(categoryId, { limit: 1000 })

    if (listError && listError.message !== 'The resource was not found') {
      console.error('Failed to list category folder', listError)
      return NextResponse.json({ message: '無法取得資料夾內容' }, { status: 500 })
    }

    const paths = listData?.map((entry) => `${categoryId}/${entry.name}`) ?? []
    if (paths.length > 0) {
      const { error: removeError } = await supabase.storage.from('menu').remove(paths)
      if (removeError) {
        console.error('Failed to remove category files', removeError)
        return NextResponse.json({ message: '刪除檔案失敗' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete category folder API error', error)
    return NextResponse.json({ message: '刪除資料夾發生錯誤' }, { status: 500 })
  }
}
