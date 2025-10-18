// Supabase Edge Function: 와인 관리 API
// TypeScript로 작성된 서버리스 함수

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Wine {
  id?: string
  name: string
  country_code: string
  vintage: number
  price: number
  quantity: number
}

serve(async (req) => {
  // CORS preflight 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Supabase 클라이언트 생성
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { method, url } = req
    const urlPath = new URL(url).pathname

    // 라우팅 처리
    switch (method) {
      case 'GET':
        if (urlPath.endsWith('/wines')) {
          return await getAllWines(supabaseClient)
        } else if (urlPath.includes('/wines/')) {
          const id = urlPath.split('/').pop()
          return await getWineById(supabaseClient, id!)
        }
        break

      case 'POST':
        if (urlPath.endsWith('/wines')) {
          const wineData = await req.json()
          return await createWine(supabaseClient, wineData)
        }
        break

      case 'PUT':
        if (urlPath.includes('/wines/')) {
          const id = urlPath.split('/').pop()
          const wineData = await req.json()
          return await updateWine(supabaseClient, id!, wineData)
        }
        break

      case 'DELETE':
        if (urlPath.includes('/wines/')) {
          const id = urlPath.split('/').pop()
          return await deleteWine(supabaseClient, id!)
        }
        break
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// 모든 와인 조회
async function getAllWines(supabase: any) {
  const { data, error } = await supabase
    .from('wines')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return new Response(
    JSON.stringify(data),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

// 특정 와인 조회
async function getWineById(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('wines')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify(data),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

// 와인 생성
async function createWine(supabase: any, wineData: Wine) {
  const { data, error } = await supabase
    .from('wines')
    .insert([wineData])
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify(data),
    { 
      status: 201, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

// 와인 업데이트
async function updateWine(supabase: any, id: string, wineData: Partial<Wine>) {
  const { data, error } = await supabase
    .from('wines')
    .update(wineData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify(data),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

// 와인 삭제
async function deleteWine(supabase: any, id: string) {
  const { error } = await supabase
    .from('wines')
    .delete()
    .eq('id', id)

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}
