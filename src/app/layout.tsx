import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import ClientProvider from '@/components/ClientProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Pin My Words',
    default: 'Pin My Words',
  },
  description:
    'Pin My Words is a platform for aspirants of competitive exams like CAT and GRE to store and learn new words every day. Users can log in and create a board, which can be private or collaborative, depending on whether they want to invite friends or not. The words can be sorted by root words and the platform will keep track of the learning progress. Users can also opt to generate examples and meanings for a specific word using AI. Moreover, users can take tests and quizzes based on the words they have learned so far and compete with others on a leaderboard if the board is collaborative.',
  metadataBase: new URL('https://pin-my-words.vercel.app/'),
  openGraph: {
    title: {
      template: '%s | Pin My Words',
      default: 'Pin My Words',
    },
    description:
      'Pin My Words is a platform for aspirants of competitive exams like CAT and GRE to store and learn new words every day. Users can log in and create a board, which can be private or collaborative, depending on whether they want to invite friends or not. The words can be sorted by root words and the platform will keep track of the learning progress. Users can also opt to generate examples and meanings for a specific word using AI. Moreover, users can take tests and quizzes based on the words they have learned so far and compete with others on a leaderboard if the board is collaborative.',
    emails: ['shivangmishra0824@gmail.com'],
    type: 'website',
    locale: 'en_IE',
    url: process.env.VERCEL_URL || 'http://localhost:3000/',
    siteName: 'Pin My Words',
    images: [
      {
        url: '/PinMyWords-OG.png',
        width: 1200,
        height: 630,
        alt: 'Pin My Words',
      },
    ],
  },
  twitter: {
    title: {
      template: '%s | Pin My Words',
      default: 'Pin My Words',
    },
    description:
      'Pin My Words is a platform for aspirants of competitive exams like CAT and GRE to store and learn new words every day. Users can log in and create a board, which can be private or collaborative, depending on whether they want to invite friends or not. The words can be sorted by root words and the platform will keep track of the learning progress. Users can also opt to generate examples and meanings for a specific word using AI. Moreover, users can take tests and quizzes based on the words they have learned so far and compete with others on a leaderboard if the board is collaborative.',
    card: 'summary_large_image',
    site: 'Pin My Words',
    siteId: '@pinmywords',
    creator: 'Shivang Mishra',
    creatorId: '@shivangm24',
    images: [
      {
        url: '/PinMyWords-OG.png',
        width: 1200,
        height: 630,
        alt: 'Pin My Words',
      },
    ],
  },
  creator: 'Shivang Mishra',
  manifest: '/site.webmanifest',
  themeColor: '#ffffff',
  keywords: [
    'Pin My Words',
    'CAT',
    'GRE',
    'Vocabulary',
    'Words',
    'English',
    'Learning',
  ],
  category: 'Education',
  colorScheme: 'light',
  classification: 'Education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>
          <ToastContainer position="bottom-left" />
          <Navbar />
          <main className="container mx-auto p-4">{children}</main>
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
