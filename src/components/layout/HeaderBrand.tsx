import Image from 'next/image'

export function HeaderBrand() {
  return (
    <div className="flex items-center gap-2 shrink-0">
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
    </div>
  )
}
