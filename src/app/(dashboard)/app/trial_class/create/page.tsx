import { redirect } from 'next/navigation'

export default async function TrialClassCreateRoute({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const sp = new URLSearchParams()
  for (const [key, val] of Object.entries(params)) {
    if (typeof val === 'string') {
      sp.set(key, val)
    } else if (Array.isArray(val)) {
      val.forEach((v) => sp.append(key, v))
    }
  }
  const qs = sp.toString()
  redirect(`/booking-trial${qs ? `?${qs}` : ''}`)
}
