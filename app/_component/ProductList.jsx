import React from 'react';

import ProductItem from './ProductItem';

export default function ProductList({ productList }) {
  
  
  return (
    <div className="mt-5">
      <h2 className="font-bold text-green-600 text-2xl">Shop by Product</h2>
      <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-5'>
        {productList?.map((Product, index) => index< 7&&(
          
          <ProductItem 
            key={index} // Adding key for performance
            Product={Product} // Passing the entire product object
            images={process.env.NEXT_PUBLIC_BACKEND_BASEURL + Product?.Image?.[0]?.url} // Constructing the image URL
          />
        ))}
      </div>
    </div>
  );
}
