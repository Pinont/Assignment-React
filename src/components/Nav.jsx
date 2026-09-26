// ข้อ 2: NavLink หน้าแรก / Pokédex / ทีม (n/6) · active state ถูกต้อง · จำนวนทีมมาจาก useTeam()
import { NavLink } from 'react-router-dom'
import { MAX_TEAM_SIZE, useTeam } from '../context/TeamContext'

function linkClass({ isActive }) {
  return isActive
    ? 'rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white'
    : 'rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100'
}

function Nav() {
  const { count } = useTeam()

  return (
    <header className="border-b bg-white shadow-sm">
      <nav className="mx-auto flex max-w-5xl items-center gap-2 px-6 py-3">
        <NavLink to="/" end className={linkClass}>
          หน้าแรก
        </NavLink>
        <NavLink to="/pokemon" className={linkClass}>
          Pokédex
        </NavLink>
        <NavLink to="/team" className={linkClass}>
          ทีม ({count}/{MAX_TEAM_SIZE})
        </NavLink>
      </nav>
    </header>
  )
}
export default Nav
