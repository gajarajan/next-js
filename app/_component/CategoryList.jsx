import React from 'react'; // Import React library
import Image from 'next/image'; // Import the Image component from Next.js for optimized images
import Link from 'next/link'; // Import Link from Next.js for client-side routing

export default function CategoryList({ getcategoryslider }) {
  return (
    <div className="mt-5">
      <h2 className="font-bold text-green-600 text-2xl">Shop by Category</h2> {/* Heading for the category list */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-5 mt-5">
        {/* Create a responsive grid layout for categories */}
        {getcategoryslider?.map((category, index) => (
          <Link
            href={'/product-categories/' + category.name} // Define the link to the category page
            key={index} // Assign a unique key for each category for React's reconciliation
          >
            <div className="flex flex-col items-center bg-green-50 gap-2 p-3 rounded-lg group cursor-pointer hover:bg-green-100 transition duration-200">
              {/* Category card with hover effects */}
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}${category?.icon?.[0]?.url}`} // Fetch category icon from backend
                alt={`${category.name} icon`} // Improved alt text for better accessibility
                width={100} // Width of the image
                height={50} // Height of the image
                className="hover:scale-125 transition-all ease-in-out" // Scale effect on hover
              />
              <h2 className="text-green-800 p-1 text-center">{category.name}</h2> {/* Category name */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

