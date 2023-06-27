import './globals.css'
import 'tippy.js/dist/tippy.css'
import { Inter } from 'next/font/google'
import ConfigWrapped from '@/contexts/ConfigWrapped'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Session Review',
  description: 'Interface for reviewing a pair programming session.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigWrapped>{children}</ConfigWrapped>
      </body>
    </html>
  )
}
