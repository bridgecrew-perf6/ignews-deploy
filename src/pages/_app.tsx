import { PrismicPreview } from '@prismicio/next'
import { PrismicProvider } from '@prismicio/react'
import { SessionProvider as NextAuthProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import Link from 'next/link'

import { repositoryName } from '../../prismicio'
import { Header } from '../components/Header'

import '../styles/global.scss'

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <PrismicProvider
      internalLinkComponent={({ href, children, ...props }) => (
        <Link href={href}>
          <a {...props}>{children}</a>
        </Link>
      )}
    >
      <NextAuthProvider session={session}>
        <Header />
        <Component {...pageProps} />
      </NextAuthProvider>
    </PrismicProvider>
  )
}
