import type { ComponentType } from 'react'

declare module '*.mdx' {
  const Component: ComponentType
  export default Component
}
