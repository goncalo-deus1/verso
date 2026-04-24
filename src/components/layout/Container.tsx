import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  as?: 'section' | 'div' | 'article' | 'header' | 'footer'
  className?: string
  /** Largura máxima do conteúdo interno. Default: "default" (max-w-7xl) */
  width?: 'prose' | 'narrow' | 'default' | 'wide' | 'full'
  /** Padding vertical. Default: "lg" */
  py?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const widthClasses = {
  prose:   'max-w-prose',
  narrow:  'max-w-3xl',
  default: 'max-w-7xl',
  wide:    'max-w-[1440px]',
  full:    'max-w-none',
}

const pyClasses = {
  none: '',
  sm:   'py-8 sm:py-10 md:py-12',
  md:   'py-12 sm:py-16 md:py-20',
  lg:   'py-16 sm:py-20 md:py-24',
  xl:   'py-20 sm:py-28 md:py-32',
}

export function Container({
  children,
  as: Tag = 'section',
  className = '',
  width = 'default',
  py = 'lg',
}: ContainerProps) {
  return (
    <Tag className={`${pyClasses[py]} ${className}`}>
      <div className={`${widthClasses[width]} mx-auto px-5 sm:px-8 md:px-12`}>
        {children}
      </div>
    </Tag>
  )
}
