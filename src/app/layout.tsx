import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import type { JSX } from 'react';
import { Toaster } from 'sonner';

import '@/styles/globals.css';
import Header from '@/components/header/Header';

/*---------------------------------------------------------------
                    Local Fonts (swap strategy)
---------------------------------------------------------------*/
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

/*---------------------------------------------------------------
                          Full SEO Metadata
---------------------------------------------------------------*/
const SEO = {
  siteName: process.env.SITE_NAME || 'PDF Tool',
  siteUrl: process.env.SITE_URL || 'http://localhost:3000/',
  defaultOgImage: '/og-image.png',
  defaultTitle: `${process.env.SITE_NAME} | Best Free PDF Tools`,
  defaultDescription:
    'Easily edit, merge, split, compress PDFs online for free. Professional PDF tools with no signup required.',
  defaultKeywords: 'PDF tools, merge PDF, compress PDF, split PDF, edit PDF, free PDF converter, PDF editor online',
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: {
    default: SEO.defaultTitle,
    template: '%s',
  },
  description: SEO.defaultDescription,
  keywords: SEO.defaultKeywords,

  authors: [{ name: `${process.env.SITE_NAME} Team`, url: process.env.SITE_URL || 'http://localhost:3000/' }],
  creator: process.env.SITE_NAME || 'PDF Tool',
  publisher: process.env.SITE_NAME || 'PDF Tool',
  category: 'Technology',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    url: SEO.siteUrl,
    siteName: SEO.siteName,
    images: [
      {
        url: SEO.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${process.env.SITE_NAME} - Free PDF Tools`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: [SEO.defaultOgImage],
  },
  icons: { icon: '/favicon.ico' },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SEO.siteUrl,
  },
};

/*---------------------------------------------------------------
                           Root Layout
---------------------------------------------------------------*/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang='en'>
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <Header />

        <main role='main'>{children}</main>

        <Toaster
          position='top-center'
          richColors
          expand={true}
          toastOptions={{
            style: {
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />
      </body>
    </html>
  );
}
