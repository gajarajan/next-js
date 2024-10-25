import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductItemDescription from "./ProductItemDescription";

export default function ProductItem({ Product }) {
  const imageUrl = process.env.NEXT_PUBLIC_BACKEND_BASEURL + (Product?.Image?.[0]?.url || "");
 
  
  
  return (
    <div className="p-2 sm:p-6 flex flex-col items-center justify-center bg-green-50 gap-2 rounded-lg group cursor-pointer hover:scale-110 hover:shadow-lg transition-all ease-in-out">
      {imageUrl  ? (
        <Image
        src={imageUrl }
          alt={Product.name}
          width={100} // Consider changing these dimensions based on design needs
          height={100} // Make height consistent with width
          className="m-2 h-[100px] w-[100px] object-contain"
        
        />
      ) : (
        <div className="bg-gray-200 w-[100px] h-[100px] flex items-center justify-center text-gray-500 rounded-md">
          No Image Available
        </div>
      )}
      <h2 className="font-bold text-lg text-center">{Product.name}</h2>
      <div className="flex gap-3">
        {Product.sellingprice ? (
          <>
            <h2 className="font-bold text-green-600">${Product.sellingprice}</h2>
            <h2 className="font-bold line-through text-gray-500">${Product.mrp}</h2>
          </>
        ) : (
          <h2 className="font-bold text-green-600">${Product.mrp}</h2>
        )}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="text-primary hover:text-white hover:bg-primary transition-all duration-200"
          >
            Add to Cart
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="bg-white">
              <ProductItemDescription Product={Product} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
