// ข้อ 2: layout route — <Nav /> + <Outlet /> + footer
import { Outlet } from 'react-router-dom'
import Nav from './Nav'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Nav />
      <main className="mx-auto w-full max-w-5xl flex-1 p-6">
        <Outlet />
      </main>
      <footer className="border-t bg-white py-4 text-center text-xs text-gray-400">
        Pokédex Team Builder · ข้อมูลจาก PokéAPI
      </footer>
    </div>
  )
}
export default Layout
