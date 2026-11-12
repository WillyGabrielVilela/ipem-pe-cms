import type { ReactNode } from 'react'
import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './admin/importMap'
import '@payloadcms/next/css'

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return RootLayout({ children, config, importMap })
}
