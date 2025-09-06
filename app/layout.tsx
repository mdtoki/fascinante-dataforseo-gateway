import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fascinante Digital - DataForSEO API Gateway',
  description:
    'API Gateway PRO ELITE para DataForSEO con Next.js 15. Acceso escalable y seguro a herramientas de SEO y análisis de datos.',
  keywords: [
    'SEO',
    'DataForSEO',
    'API Gateway',
    'Marketing Digital',
    'Análisis de Datos',
  ],
  authors: [
    { name: 'Fascinante Digital', url: 'https://fascinantedigital.com' },
  ],
  creator: 'Fascinante Digital',
  publisher: 'Fascinante Digital',
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
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://auditoria.fascinantedigital.com',
    title: 'Fascinante Digital - DataForSEO API Gateway',
    description: 'API Gateway PRO ELITE para DataForSEO con Next.js 15',
    siteName: 'Fascinante Digital',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fascinante Digital - DataForSEO API Gateway',
    description: 'API Gateway PRO ELITE para DataForSEO con Next.js 15',
    creator: '@fascinantedigital',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
          {children}
        </div>
      </body>
    </html>
  );
}
