"use client";
import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle, ShoppingBasketIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addToCart } from "../_ulit/GlobalApi";
import { UpdateCartContext } from "../_context/updateCart";

export default function ProductItemDescription({ Product }) {
  const [quantity, setQuantity] = useState(1);
  const productPrice = Product.sellingprice || Product.mrp;
  const totalPrice = (quantity * productPrice).toFixed(2);
  const [loading, setLoading] = useState(false);
  const {updateCart,SetUpdateCart}=useContext(UpdateCartContext);
  const imageUrl = process.env.NEXT_PUBLIC_BACKEND_BASEURL + (Product?.Image?.[0]?.url || "");
  const jwt = sessionStorage.getItem("jwt");
  const user = JSON.parse(sessionStorage.getItem("user")) || null; // Safely parse user data
  const router = useRouter();
  
  
  const addtoCart = async () => {
    setLoading(true);

    if (!jwt || !user) {
      toast("Sign in to add product to cart");
      router.push("/sign-in");
      setLoading(false);
      return;
    }

    const data = {
      data: {
        quantity: quantity,
        amount: totalPrice,
        products: Product.id,
        users_permissions_user: user.id,
        UserId: user.id,
      },
    };

    try {
      const response = await addToCart(data, jwt);
      console.log("Cart response:", response);
      SetUpdateCart(!updateCart)
      toast("Added to Cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast("Error while adding to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  return (
    <div className="flex flex-col md:flex-row text-black m-3 gap-4 p-4">
      {/* Image Section */}
      <div className="flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={Product.name || "Product Image"}
            className="h-[200px] w-[200px] object-contain rounded-md shadow-md transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="bg-gray-200 w-[200px] h-[200px] flex items-center justify-center text-gray-500 rounded-md shadow-md">
            No Image Available
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-col justify-between flex-grow">
        <div>
          <h1 className="text-2xl font-bold">{Product.name}</h1>
          {Product.description && (
            <h2 className="text-sm text-gray-500">{Product.description}</h2>
          )}

          <div className="flex gap-3 text-3xl mt-2">
            {Product.sellingprice ? (
              <>
                <h2 className="font-bold text-green-600">
                  ${Product.sellingprice}
                </h2>
                <h2 className="font-bold line-through text-gray-500">
                  ${Product.mrp}
                </h2>
              </>
            ) : (
              <h2 className="font-bold text-green-600">${Product.mrp}</h2>
            )}
          </div>
        </div>

        {/* Quantity and Price Section */}
        <div className="flex flex-col mt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition duration-200"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
              <h2 className="px-4">{quantity}</h2>
              <button
                className={`px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition duration-200 ${
                  quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={quantity === 1}
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
            </div>
            <h2 className="text-xl font-bold">=${totalPrice}</h2>
          </div>
          <Button
            className="flex gap-3 bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
            onClick={addtoCart}
            disabled={loading}
          >
            <ShoppingBasketIcon />
            {loading ? <LoaderCircle className="animate-spin" /> : "Add To Cart"}
          </Button>
        </div>

        {/* Category Section */}
        <h2 className="text-lg font-medium mt-2">
          <span className="text-gray-700">Category:</span> {Product.category?.name}
        </h2>
      </div>
    </div>
  );
}
