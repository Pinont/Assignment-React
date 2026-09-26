// R1: custom hook สำหรับทุกจุดที่ fetch
//   - เช็ก res.ok (PokéAPI คืน 404 เมื่อไม่พบ) → error.status = 404
//   - cleanup ด้วย AbortController + ผูกผลลัพธ์กับ url ที่ขอ → response เก่าทับ response ใหม่ไม่ได้
//   - url = null แปลว่า "ไม่ต้องยิง"
import { useEffect, useState } from 'react'

export function useFetch(url) {
  // เก็บ url ไว้คู่กับผลลัพธ์ — ถ้า url ปัจจุบันยังไม่ตรงกับผลลัพธ์ที่มี แปลว่ายังโหลดอยู่
  const [result, setResult] = useState({ url: null, data: null, error: null })

  useEffect(() => {
    if (url === null) return

    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          const error = new Error(`HTTP ${res.status}`)
          error.status = res.status
          throw error
        }
        return res.json()
      })
      .then((data) => setResult({ url, data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        setResult({ url, data: null, error })
      })

    return () => controller.abort()
  }, [url])

  if (url === null) return { data: null, error: null, loading: false }

  const isCurrent = result.url === url
  return {
    data: isCurrent ? result.data : null,
    error: isCurrent ? result.error : null,
    loading: !isCurrent,
  }
}
