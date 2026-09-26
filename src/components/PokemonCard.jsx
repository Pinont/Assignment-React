// R7: การ์ดรูป + #id + ชื่อ + ป้าย "อยู่ในทีม" · ต้องใช้ซ้ำทั้งหน้า /pokemon และ /team
import { Link } from 'react-router-dom'
import { useTeam } from '../context/TeamContext'
import { artworkUrl } from '../lib/pokemon'

export function formatId(id) {
  return `#${String(id).padStart(3, '0')}`
}

// children = ปุ่มเพิ่มเติมใต้การ์ด (เช่นปุ่ม "เอาออก" ในหน้าทีม)
function PokemonCard({ id, name, children }) {
  const { has } = useTeam()

  return (
    <div className="flex flex-col rounded-lg border bg-white p-3 shadow-sm">
      <Link to={`/pokemon/${id}`} className="block hover:opacity-80">
        <div className="relative">
          <img src={artworkUrl(id)} alt={name} loading="lazy" className="mx-auto h-28 w-28 object-contain" />
          {has(id) && (
            <span className="absolute top-0 right-0 rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
              อยู่ในทีม
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-400">{formatId(id)}</p>
        <p className="font-semibold capitalize">{name}</p>
      </Link>
      {children && <div className="mt-2">{children}</div>}
    </div>
  )
}
export default PokemonCard
