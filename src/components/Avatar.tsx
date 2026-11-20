type AvatarProps = {
  name?: string | null
  email?: string | null
  size?: 'sm' | 'lg'
  className?: string
}

function initialsFrom(name?: string | null, email?: string | null) {
  const trimmed = String(name || '').trim()
  if (trimmed) {
    const parts = trimmed.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
    }
    return trimmed.slice(0, 2).toUpperCase()
  }

  const local = String(email || '')
    .split('@')[0]
    ?.replace(/[^a-zA-Z0-9]/g, '')
  if (local) return local.slice(0, 2).toUpperCase()
  return 'BX'
}

function toneFrom(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i) * (i + 17)) % 360
  }
  // Teal/slate range — Atlas Ink, restrained (not purple)
  const hue = 158 + (hash % 28)
  return {
    background: `linear-gradient(145deg, hsl(${hue} 38% 28%) 0%, hsl(${hue + 10} 32% 16%) 100%)`,
  }
}

export function Avatar({ name, email, size = 'sm', className }: AvatarProps) {
  const seed = String(name || email || 'binexe')
  const initials = initialsFrom(name, email)
  const tone = toneFrom(seed)

  return (
    <span
      className={`avatar avatar--${size}${className ? ` ${className}` : ''}`}
      style={tone}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
