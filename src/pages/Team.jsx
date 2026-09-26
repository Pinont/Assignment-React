// R4, R6: การ์ดสมาชิก · เอาออก/ล้างทีม · ข้อความทีมว่าง · ฟอร์มลงทะเบียนทีม (ต้องมีอย่างน้อย 3 ตัว)
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import PokemonCard from '../components/PokemonCard'
import { MAX_TEAM_SIZE, useTeam } from '../context/TeamContext'
import { createRegistrationSchema } from '../schemas/registration'

const MIN_TEAM_SIZE = 3

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-600">{error.message}</span>}
    </label>
  )
}

function RegistrationForm() {
  const { team, count } = useTeam()
  const [summary, setSummary] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createRegistrationSchema(team.map((m) => m.name))),
    mode: 'onTouched',
    defaultValues: { trainerName: '', teamName: '', email: '', confirmEmail: '' },
  })

  async function onSubmit(values) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSummary({ trainerName: values.trainerName, teamName: values.teamName, members: team })
  }

  if (summary) {
    return (
      <div className="max-w-md rounded-lg border border-green-300 bg-green-50 p-4">
        <h3 className="text-lg font-bold text-green-800">ลงทะเบียนสำเร็จ!</h3>
        <p className="mt-2">
          เทรนเนอร์: <b>{summary.trainerName}</b>
        </p>
        <p>
          ทีม: <b>{summary.teamName}</b>
        </p>
        <ul className="mt-2 list-inside list-disc capitalize">
          {summary.members.map((m) => (
            <li key={m.id}>{m.name}</li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            setSummary(null)
            reset()
          }}
          className="mt-4 text-sm text-red-600 hover:underline"
        >
          ลงทะเบียนใหม่
        </button>
      </div>
    )
  }

  const missing = MIN_TEAM_SIZE - count
  const inputClass = 'mt-1 w-full rounded-md border px-3 py-2'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-md space-y-4">
      <Field label="ชื่อเทรนเนอร์" error={errors.trainerName}>
        <input {...register('trainerName')} className={inputClass} />
      </Field>
      <Field label="ชื่อทีม" error={errors.teamName}>
        <input {...register('teamName')} className={inputClass} />
      </Field>
      <Field label="อีเมล" error={errors.email}>
        <input type="email" {...register('email')} className={inputClass} />
      </Field>
      <Field label="ยืนยันอีเมล" error={errors.confirmEmail}>
        <input type="email" {...register('confirmEmail')} className={inputClass} />
      </Field>

      {missing > 0 && (
        <p className="text-sm text-amber-700">
          ทีมมี {count} ตัว — ต้องมีอย่างน้อย {MIN_TEAM_SIZE} ตัว ขาดอีก {missing} ตัว
        </p>
      )}

      <button
        type="submit"
        disabled={missing > 0 || isSubmitting}
        className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isSubmitting ? 'กำลังส่ง…' : 'ลงทะเบียนทีม'}
      </button>
    </form>
  )
}

function Team() {
  const { team, count, remove, clear } = useTeam()

  return (
    <section className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            ทีมของฉัน ({count}/{MAX_TEAM_SIZE})
          </h1>
          {count > 0 && (
            <button type="button" onClick={clear} className="text-sm text-red-600 hover:underline">
              ล้างทีม
            </button>
          )}
        </div>

        {count === 0 ? (
          <p className="mt-4 rounded-md bg-gray-50 p-6 text-center text-gray-500">
            ทีมยังว่างอยู่ —{' '}
            <Link to="/pokemon" className="text-red-600 hover:underline">
              ไปเลือก Pokémon
            </Link>
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {team.map((m) => (
              <PokemonCard key={m.id} id={m.id} name={m.name}>
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  className="block w-full rounded-md border border-red-600 px-2 py-1 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  เอาออก
                </button>
              </PokemonCard>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h2 className="mb-4 text-xl font-bold">ลงทะเบียนทีม</h2>
        <RegistrationForm />
      </div>
    </section>
  )
}
export default Team
