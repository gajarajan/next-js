'use client'; // Indicate this component uses client-side rendering
import { TrashIcon } from "lucide-react"; // Importing Trash Icon
import Image from "next/image"; // Importing Image component from Next.js
import React from "react"; // Importing React

export default function CartItemLists({ cartitemList, ondeleteItem }) {
  return (
    <div>
      <div className="h-[600px] overflow-auto">
        {cartitemList.map((item, key) => (
          <div key={key} className="flex justify-between items-center p-2 border-b border-gray-300">
            <div className="flex items-center gap-4">
              {/* Render the product image */}
              <Image
                src={item.imageUrl} // Image URL from the item
                width={70}
                height={70}
                alt={item.productName || "Product image"} // Improved alt text for better accessibility
                className="border p-2 rounded-md" // Added border and rounded corners for styling
              />

              {/* Product Details */}
              <div>
                <h3 className="font-bold text-lg">{item.productName}</h3> {/* Product name */}
                <h2>Quantity: {item.quantity}</h2> {/* Display quantity */}
                <h2>Price: ${item.actualPrice.toFixed(2)}</h2> {/* Display actual price with 2 decimal points */}
                <h2>Product ID: {item.id}</h2> {/* Changed label for clarity */}
                <h2>Total: ${item.amount.toFixed(2)}</h2> {/* Display total amount with 2 decimal points */}
              </div>
            </div>

            {/* Trash Icon for Deleting the Item */}
            <button 
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
              onClick={() => ondeleteItem(item.documentId)} // Moved onClick to button
              aria-label={`Delete ${item.productName}`} // Added aria-label for better accessibility
            >
              <TrashIcon className="h-6 w-6" /> {/* Render Trash Icon */}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
