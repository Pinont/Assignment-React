// ข้อ 2: <Routes> — layout route ครอบ  /  /pokemon  /pokemon/:nameOrId  /team  *
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PokemonDetail from './pages/PokemonDetail'
import PokemonList from './pages/PokemonList'
import Team from './pages/Team'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="pokemon" element={<PokemonList />} />
        <Route path="pokemon/:nameOrId" element={<PokemonDetail />} />
        <Route path="team" element={<Team />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
export default App
