import React from 'react';
import Image from "next/image"; // Importing Image component from Next.js
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Importing custom Carousel components

export default function Sliders({ sliderList }) {
  return (
    <div>
      <Carousel>
        <CarouselContent>
          {sliderList?.length > 0 ? (
            sliderList.map((slider) => (
              <CarouselItem key={slider.id || slider.name}> {/* Use a unique identifier for the key prop */}
                <Image
                  src={process.env.NEXT_PUBLIC_BACKEND_BASEURL + slider?.image?.[0]?.url} // Ensure safe access to image URL
                  alt={slider.name || "Slider image"} // Improved alt text for better accessibility
                  width={100}
                  height={400}
                  className='w-full h-[200px] md:h-[400px] object-cover rounded-2xl'
                />
              </CarouselItem>
            ))
          ) : (
            <p className="text-center text-gray-500">No sliders available</p> // Added styling for no sliders message
          )}
        </CarouselContent>

        <CarouselPrevious aria-label="Previous Slide" /> {/* Added aria-label for accessibility */}
        <CarouselNext aria-label="Next Slide" /> {/* Added aria-label for accessibility */}
      </Carousel>
    </div>
  );
}
