// R4, R5: createContext + TeamProvider + useTeam() (พร้อม guard) · สูงสุด 6 ตัว ห้ามซ้ำ · เก็บใน localStorage
import { createContext, useContext, useEffect, useState } from 'react'
import { MAX_ID } from '../lib/pokemon'

export const MAX_TEAM_SIZE = 6
const STORAGE_KEY = 'pokedex-team'

const TeamContext = createContext(null)

function isValidMember(member) {
  return (
    member !== null &&
    typeof member === 'object' &&
    Number.isInteger(member.id) &&
    member.id >= 1 &&
    member.id <= MAX_ID &&
    typeof member.name === 'string' &&
    member.name.length > 0
  )
}

// ข้อมูลเสีย/ผิดรูปแบบ → ถือว่าทีมว่าง (Twist 7)
function loadTeam() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(parsed)) return []

    const team = []
    for (const member of parsed) {
      if (!isValidMember(member)) continue
      if (team.some((m) => m.id === member.id)) continue
      if (team.length === MAX_TEAM_SIZE) break
      team.push({ id: member.id, name: member.name })
    }
    return team
  } catch {
    return []
  }
}

export function TeamProvider({ children }) {
  const [team, setTeam] = useState(loadTeam)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(team))
  }, [team])

  // ค่าที่คำนวณได้ — คำนวณตอน render ไม่เก็บเป็น state
  const count = team.length
  const isFull = count >= MAX_TEAM_SIZE
  const has = (id) => team.some((m) => m.id === id)

  function add({ id, name }) {
    setTeam((prev) => {
      if (prev.length >= MAX_TEAM_SIZE || prev.some((m) => m.id === id)) return prev
      return [...prev, { id, name }]
    })
  }

  function remove(id) {
    setTeam((prev) => prev.filter((m) => m.id !== id))
  }

  function clear() {
    setTeam([])
  }

  const value = { team, count, isFull, has, add, remove, clear }
  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
}

export function useTeam() {
  const context = useContext(TeamContext)
  if (context === null) {
    throw new Error('useTeam() ต้องเรียกใช้ภายใน <TeamProvider> เท่านั้น')
  }
  return context
}
