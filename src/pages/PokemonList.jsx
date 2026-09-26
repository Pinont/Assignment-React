// R1, R2: รายการ 151 ตัว · ค้นหา ?q= · ธาตุ ?type= (useSearchParams) · loading / error / ไม่พบผลลัพธ์
import { useSearchParams } from 'react-router-dom'
import PokemonCard from '../components/PokemonCard'
import { useFetch } from '../hooks/useFetch'
import { API, MAX_ID, TYPES, idFromUrl } from '../lib/pokemon'

function PokemonList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const type = searchParams.get('type') ?? ''

  const list = useFetch(`${API}/pokemon?limit=${MAX_ID}`)
  const byType = useFetch(type ? `${API}/type/${type}` : null)

  function updateParam(key, value, { replace }) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace })
  }

  // ตัวอักษรแรกสร้าง history entry ใหม่ ตัวต่อ ๆ ไปแทนที่ entry เดิม → กด back ครั้งเดียวออกจากการค้นหา
  function handleSearch(e) {
    updateParam('q', e.target.value, { replace: q !== '' })
  }

  function handleType(e) {
    updateParam('type', e.target.value, { replace: false })
  }

  const loading = list.loading || byType.loading
  const error = list.error || byType.error

  let results = []
  if (list.data && !loading && !error) {
    const typeNames = byType.data
      ? new Set(byType.data.pokemon.map((p) => p.pokemon).filter((p) => idFromUrl(p.url) <= MAX_ID).map((p) => p.name))
      : null
    const query = q.trim().toLowerCase()

    results = list.data.results
      .map((p) => ({ id: idFromUrl(p.url), name: p.name }))
      .filter((p) => p.name.includes(query))
      .filter((p) => typeNames === null || typeNames.has(p.name))
  }

  return (
    <section className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={q}
          onChange={handleSearch}
          placeholder="ค้นหาด้วยชื่อ เช่น char"
          aria-label="ค้นหาด้วยชื่อ"
          className="flex-1 rounded-md border px-3 py-2"
        />
        <select value={type} onChange={handleType} aria-label="กรองตามธาตุ" className="rounded-md border px-3 py-2">
          {TYPES.map((t) => (
            <option key={t || 'all'} value={t}>
              {t || 'ทั้งหมด'}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="mt-6 text-center text-gray-500">กำลังโหลด…</p>}

      {!loading && error && (
        <p className="mt-6 rounded-md bg-red-50 p-4 text-center text-red-700">
          {byType.error?.status === 404 ? `ไม่รู้จักธาตุ "${type}"` : 'โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง'}
        </p>
      )}

      {!loading && !error && list.data && (
        <>
          <p className="mt-4 text-sm text-gray-500">พบ {results.length} ตัว</p>
          {results.length === 0 ? (
            <p className="mt-6 text-center text-gray-500">ไม่พบ Pokémon ที่ตรงกับเงื่อนไข</p>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {results.map((p) => (
                <PokemonCard key={p.id} id={p.id} name={p.name} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
export default PokemonList
