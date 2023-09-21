'use client';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import getRandomImage from '@/utils/getRandomImage';

type Props = {};

const HomeCarousel = (props: Props) => {
  return (
    <Carousel>
      <div className="">
        <Image
          src={getRandomImage(720, 1280)}
          alt="1"
          width={1280}
          height={720}
        />
      </div>

      <div className="">
        <Image
          src={getRandomImage(720, 1280)}
          alt="1"
          width={1280}
          height={720}
        />
      </div>
    </Carousel>
  );
};

export default HomeCarousel;
