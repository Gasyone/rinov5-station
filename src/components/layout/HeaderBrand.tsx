import Link from 'next/link'
import Image from 'next/image'

export function HeaderBrand() {
  return (
    <Link
      href="/app/dashboard"
      className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity"
      title="Về trang chủ (Home)"
    >
      <div className="ui-pill-surface flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-muted shrink-0">
        <Image
          src="/rinoedu-logo.png"
          alt="Logo"
          width={32}
          height={32}
          priority
          className="h-full w-full object-contain"
        />
      </div>
      <div className="relative hidden h-5 w-24 flex-col justify-center md:flex shrink-0">
        <Image
          src="/rinoedu-name.png"
          alt="RinoEdu"
          fill
          sizes="96px"
          priority
          className="object-contain"
        />
      </div>
    </Link>
  )
}
