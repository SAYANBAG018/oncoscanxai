'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'elg'
}

export function Logo({
  className,
  size = 'md',
}: LogoProps) {
  const sizes = {
    sm: 138,
    md: 175,
    lg: 204,
    elg: 404
  }

  const icon = sizes[size]

  return (
    <div className={cn('flex items-center select-none', className)}>
      <div className="relative flex-shrink-0">
        <Image
          src="/oncoscan-logo-mark.png"
          alt="OncoScan XAI Logo"
          width={icon}
          height={icon}
          className="object-contain drop-shadow-md"
          priority
        />

        <div
          className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping pointer-events-none"
          style={{ animationDuration: '3s' }}
        />
      </div>
    </div>
  )
}
