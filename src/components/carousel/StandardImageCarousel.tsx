// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";

import { Image, Link } from "@nextui-org/react";
import { A11y } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

interface StandardImageCarouselProps {
  id: string;
  name: string;
  images: {
    name: string;
  }[];
}

const StandardImageCarousel: React.FC<{
  carouselItems: StandardImageCarouselProps[];
}> = ({ carouselItems }) => {
  return (
    <Swiper
      virtual
      modules={[A11y, Virtual]}
      spaceBetween={15}
      slidesPerView={4}
      navigation
    >
      {carouselItems &&
        carouselItems?.map((item, index) => {
          return (
            <SwiperSlide
              virtualIndex={index}
              key={index}
              className="h-full w-full cursor-pointer"
            >
              <Link href={`/recipe/${item.id}`}>
                <div className="h-[130px] w-[130px]">
                  <Image
                    alt={item.name}
                    src={item?.images?.[0]?.name ?? "/recipe-placeholder.webp"}
                    width={0}
                    height={0}
                    className="h-full w-full"
                  />
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default StandardImageCarousel;
