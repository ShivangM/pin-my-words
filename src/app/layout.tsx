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
  title: 'Pin My Words',
  description:
    'Pin My Words is a platform for aspirants of competitive exams like CAT and GRE to store and learn new words every day. Users can log in and create a board, which can be private or collaborative, depending on whether they want to invite friends or not. The words can be sorted by root words and the platform will keep track of the learning progress. Users can also opt to generate examples and meanings for a specific word using AI. Moreover, users can take tests and quizzes based on the words they have learned so far and compete with others on a leaderboard if the board is collaborative.',
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
          {children}
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
