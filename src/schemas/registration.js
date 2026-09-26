// R6: zod schema trainerName / teamName / email / confirmEmail · ชื่อทีมห้ามซ้ำกับ Pokémon ในทีม
import { z } from 'zod'

// รับรายชื่อ Pokémon ในทีมตอนนี้ เพราะกติกาชื่อทีมขึ้นกับว่าทีมมีใครอยู่
export function createRegistrationSchema(memberNames) {
  const takenNames = memberNames.map((name) => name.toLowerCase())

  return z
    .object({
      trainerName: z
        .string()
        .trim()
        .min(2, 'ชื่อเทรนเนอร์ต้องมีอย่างน้อย 2 ตัวอักษร')
        .max(30, 'ชื่อเทรนเนอร์ต้องไม่เกิน 30 ตัวอักษร'),
      teamName: z
        .string()
        .trim()
        .min(3, 'ชื่อทีมต้องมีอย่างน้อย 3 ตัวอักษร')
        .max(20, 'ชื่อทีมต้องไม่เกิน 20 ตัวอักษร')
        .regex(/^[A-Za-z0-9 ]+$/, 'ชื่อทีมใช้ได้เฉพาะ A–Z a–z 0–9 และช่องว่าง')
        .refine((name) => !takenNames.includes(name.toLowerCase()), 'ชื่อทีมซ้ำกับ Pokémon ในทีม'),
      email: z.string().trim().pipe(z.email('รูปแบบอีเมลไม่ถูกต้อง')),
      confirmEmail: z.string().trim(),
    })
    .refine((data) => data.email === data.confirmEmail, {
      message: 'อีเมลไม่ตรงกัน',
      path: ['confirmEmail'],
    })
}
