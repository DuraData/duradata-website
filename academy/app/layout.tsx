import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

// Academy pages read live feature configuration and operational data. Keep
// database access at request time so builds never require production access.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL('https://academy.duradata.co.za'),
  applicationName: 'Duradata Academy',
  title: {
    default: 'Duradata Academy | Corporate and Free Learning',
    template: '%s | Duradata Academy',
  },
  description: 'Duradata Academy helps professionals and teams grow with practical courses, free learning, certificates, and corporate training.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Duradata Academy',
    description: 'Corporate and free online learning for professionals, teams, and lifelong learners.',
    type: 'website',
    siteName: 'Duradata Academy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Duradata Academy',
    description: 'Corporate and free online learning for professionals, teams, and lifelong learners.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="blue" enableSystem={false} themes={["blue", "green", "dark"]}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
