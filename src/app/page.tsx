import Carousel from '@/components/Home/Carousel';
import Features from '@/components/Home/Features/Features';
import Hero from '@/components/Home/Hero';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="">
      <Hero />
      <Features />
      {/* <Carousel /> */}
    </div>
  );
}
