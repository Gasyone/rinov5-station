import Image from 'next/image'

export function HeaderBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="ui-pill-surface flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-muted">
        <Image
          src="/rinoedu-logo.png"
          alt="Logo"
          width={40}
          height={40}
          priority
          className="h-full w-full object-contain"
        />
      </div>
      <div className="relative hidden h-6 w-32 flex-col justify-center md:flex">
        <Image
          src="/rinoedu-name.png"
          alt="RinoEdu"
          fill
          sizes="128px"
          priority
          className="object-contain"
        />
      </div>
    </div>
  )
}
