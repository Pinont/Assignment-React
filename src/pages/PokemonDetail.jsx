// R3: อ่าน nameOrId จาก useParams · ธาตุ · ม./กก. · เพิ่ม/เอาออกจากทีม · ก่อนหน้า/ถัดไป · นอก #1–#151 = ไม่อยู่ใน Pokédex นี้
import { Link, useParams } from 'react-router-dom'
import { formatId } from '../components/PokemonCard'
import { MAX_TEAM_SIZE, useTeam } from '../context/TeamContext'
import { useFetch } from '../hooks/useFetch'
import { API, MAX_ID, artworkUrl } from '../lib/pokemon'

function Message({ children }) {
  return (
    <section className="rounded-lg border bg-white p-8 text-center shadow-sm">
      {children}
      <Link to="/pokemon" className="mt-4 inline-block text-red-600 hover:underline">
        กลับหน้ารายการ
      </Link>
    </section>
  )
}

function NotInPokedex() {
  return (
    <Message>
      <h1 className="text-xl font-semibold">ไม่อยู่ใน Pokédex นี้</h1>
      <p className="mt-2 text-gray-500">Pokédex นี้มีเฉพาะ #1–#{MAX_ID} เท่านั้น</p>
    </Message>
  )
}

function PokemonDetail() {
  const { nameOrId } = useParams()
  const key = nameOrId.toLowerCase()

  // id ที่เป็นตัวเลขนอกช่วงรู้ได้เลยโดยไม่ต้องยิง API
  const isNumeric = /^\d+$/.test(key)
  const outOfRangeId = isNumeric && (Number(key) < 1 || Number(key) > MAX_ID)

  const { data, loading, error } = useFetch(outOfRangeId ? null : `${API}/pokemon/${key}`)
  const { has, isFull, add, remove } = useTeam()

  if (outOfRangeId) return <NotInPokedex />

  if (loading) return <Message><p className="text-gray-500">กำลังโหลด…</p></Message>

  if (error?.status === 404) {
    return (
      <Message>
        <h1 className="text-xl font-semibold">ไม่พบ Pokémon "{nameOrId}"</h1>
      </Message>
    )
  }

  if (error) {
    return (
      <Message>
        <p className="text-red-700">โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง</p>
      </Message>
    )
  }

  // ชื่อที่มีจริงใน API แต่อยู่นอก 151 ตัว เช่น chikorita
  if (data.id > MAX_ID) return <NotInPokedex />

  const inTeam = has(data.id)
  const cannotAdd = !inTeam && isFull

  return (
    <section className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row">
        <img src={artworkUrl(data.id)} alt={data.name} className="mx-auto h-48 w-48 object-contain" />
        <div className="flex-1">
          <p className="text-sm text-gray-400">{formatId(data.id)}</p>
          <h1 className="text-3xl font-bold capitalize">{data.name}</h1>
          <div className="mt-3 flex gap-2">
            {data.types.map((t) => (
              <span key={t.type.name} className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                {t.type.name}
              </span>
            ))}
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-gray-500">ส่วนสูง</dt>
              <dd className="font-semibold">{data.height / 10} ม.</dd>
            </div>
            <div>
              <dt className="text-gray-500">น้ำหนัก</dt>
              <dd className="font-semibold">{data.weight / 10} กก.</dd>
            </div>
          </dl>

          {inTeam ? (
            <button
              type="button"
              onClick={() => remove(data.id)}
              className="mt-6 rounded-md border border-red-600 px-4 py-2 font-semibold text-red-600 hover:bg-red-50"
            >
              เอาออกจากทีม
            </button>
          ) : (
            <button
              type="button"
              onClick={() => add({ id: data.id, name: data.name })}
              disabled={cannotAdd}
              className="mt-6 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              เพิ่มเข้าทีม
            </button>
          )}
          {cannotAdd && (
            <p className="mt-2 text-sm text-amber-700">ทีมเต็มแล้ว ({MAX_TEAM_SIZE}/{MAX_TEAM_SIZE}) — เอาตัวอื่นออกก่อนถึงจะเพิ่มได้</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-4 text-sm">
        <span className="w-20">
          {data.id > 1 && (
            <Link to={`/pokemon/${data.id - 1}`} className="text-red-600 hover:underline">
              ← {formatId(data.id - 1)}
            </Link>
          )}
        </span>
        <Link to="/pokemon" className="text-gray-500 hover:underline">
          กลับหน้ารายการ
        </Link>
        <span className="w-20 text-right">
          {data.id < MAX_ID && (
            <Link to={`/pokemon/${data.id + 1}`} className="text-red-600 hover:underline">
              {formatId(data.id + 1)} →
            </Link>
          )}
        </span>
      </div>
    </section>
  )
}
export default PokemonDetail
