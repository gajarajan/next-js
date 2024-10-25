import React from 'react';
import Image from 'next/image'; // Import Image from Next.js for image optimization
import Link from 'next/link'; // Import Link from Next.js for routing


export default function TopCategoryList({ getcategorylist,selectedCategory }) {
    
    
  return (
    <div>
      <div className="flex gap-5 mt-5 overflow-auto mx-7 md:mx-20 justify-center">
        {getcategorylist?.map((category, index) => (
          <Link
            href={'/product-categories/' + category.name} // Properly define the href
            key={index} // Key should be here on the outermost element of the map iteration
          >
            <div className= {` w-[150px] min-w-[100px] flex flex-col items-center bg-green-50 gap-2 p-3 rounded-lg group cursor-pointer hover:bg-green-600 transition duration-200 ${selectedCategory==category.name &&'bg-green-600 text-white'}`}>
              <Image
                src={
                  process.env.NEXT_PUBLIC_BACKEND_BASEURL +
                  category?.icon?.[0]?.url
                }
                alt={`${category.name} icon`} // Improved alt text for better accessibility
                width={100}
                height={50}
                className="hover:scale-125 transition-all ease-in-out"
              />
              <h2 className={`text-green-800 p-1 text-center${selectedCategory==category.name &&' text-white'}`}>{category.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
