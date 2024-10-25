import Image from 'next/image';
import React from 'react';

export default function MyOrderItems({ order, index }) {
  // Handle the product image URL safely
  const imageUrl = process.env.NEXT_PUBLIC_BACKEND_BASEURL + (order?.Product?.Image?.[0]?.url || '');

  return (
    <div className="w-[60%]">
      <div key={index} className="grid grid-cols-5 mt-3 items-center">
        <Image
          src={imageUrl}
          width={80}
          height={80}
          alt="product image"
          className="bg-gray-100 p-5 rounded-md border"
        />
        <div className="col-span-2">
          <h2>{order?.Product?.name || 'Product Name Not Available'}</h2>
          <h2>
            Price: ${order?.Product?.sellingprice 
              ? order.Product.sellingprice 
              : order?.Product?.mrp || 'N/A'}
          </h2>
        </div>
        <h2>Quantity: {order?.quantity || 'N/A'}</h2>
        <h2>Total Amount: ${order?.amount || 'N/A'}</h2>
      </div>
      <hr className="mt-3" />
    </div>
  );
}
