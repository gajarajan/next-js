"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import {
  CircleUserRound,
  LayoutGrid,
  Search,
  ShoppingBasket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCartItem, getCartItem, getCategory } from "../_ulit/GlobalApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UpdateCartContext } from "../_context/updateCart";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartItemLists from "./cartItemLists";
import { toast } from "sonner";

export default function Header() {
  // State variables
  const [categories, setCategories] = useState([]); // Store fetched categories
  const [selectedCategory, setSelectedCategory] = useState(null); // Selected category for filtering
  const [isLogin, setIsLogin] = useState(false); // Login status
  const [totalCartItem, setTotalCartItem] = useState(0); // Total items in the cart
  const [user, setUser] = useState(null); // User information
  const { updateCart, SetUpdateCart } = useContext(UpdateCartContext); // Context for updating cart
  const [cartitemList, setcartItemList] = useState([]); // Store cart items
  const [loading, setLoading] = useState(false); // Loading state for categories
  const router = useRouter(); // Next.js router for navigation

  useEffect(() => {
    // Fetch categories on component mount
    const fetchCategories = async () => {
      setLoading(true); // Set loading to true while fetching
      try {
        const res = await getCategory(); // API call to get categories
        setCategories(res.data || []); // Store fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories."); // Show error notification
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchCategories();

    // Check user login status from session storage
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("user");
      try {
        setUser(JSON.parse(storedUser) || null); // Parse user data
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null); // Reset user state on error
      }

      const token = sessionStorage.getItem("jwt"); // Get JWT token
      setIsLogin(!!token); // Set login status based on token presence
    }
  }, []);

  const fetchCartItems = async () => {
    // Fetch cart items for the logged-in user
    try {
      if (user && typeof window !== "undefined") {
        const jwt = sessionStorage.getItem("jwt"); // Get JWT token
        if (jwt) {
          const cartItems = await getCartItem(user.id, jwt); // Fetch cart items
          setTotalCartItem(cartItems?.length || 0); // Update total cart items
          setcartItemList(cartItems); // Store cart items
        }
      }
    } catch (error) {
      console.error("Error fetching cart items:", error); // Log any errors
    }
  };

  useEffect(() => {
    // Fetch cart items whenever user or updateCart state changes
    fetchCartItems();
  }, [user, updateCart]);

  const handleCategorySelect = (category) => {
    // Toggle category selection
    setSelectedCategory((prev) => (prev?.id === category.id ? null : category));
  };

  const handleLogout = () => {
    // Handle user logout
    if (typeof window !== "undefined") {
      sessionStorage.clear(); // Clear session storage
      setUser(null); // Reset user state
      setIsLogin(false); // Reset login status
      toast.success("Logged out successfully!"); // Show success notification
      router.replace("/sign-in"); // Redirect to sign-in page
    }
  };

  const ondeleteItem = (id) => {
    // Handle deletion of an item from the cart
    if (user && typeof window !== "undefined") {
      const jwt = sessionStorage.getItem("jwt"); // Get JWT token
      if (jwt) {
        deleteCartItem(id, jwt)
          .then(() => {
            toast("Item deleted successfully from cart"); // Show success notification
            fetchCartItems(); // Refresh cart items
            SetUpdateCart((prev) => !prev); // Trigger cart update
          })
          .catch((error) => {
            toast.error("Failed to delete item from cart. Please try again."); // Show error notification
            console.error("Deletion error:", error); // Log error
          });
      } else {
        toast.error("JWT token is missing. Please log in again."); // Notify user of missing JWT
      }
    } else {
      toast.error("User is not authenticated. Please log in."); // Notify user of authentication issue
    }
  };

  const [subtotal, setSubtotal] = useState(0); // Subtotal for cart items

  useEffect(() => {
    // Calculate subtotal whenever cart items change
    let total = 0;
    if (cartitemList && cartitemList.length) {
      cartitemList.forEach((element) => {
        total += parseFloat(element.amount); // Sum item amounts
      });
    }
    setSubtotal(total.toFixed(2)); // Update subtotal state
  }, [cartitemList]);

  return (
    <div className="p-5 shadow-md flex justify-between bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-8">
        <Link href={"/"}>
          <Image
            src="/logo.png"
            alt="Grocery Logo"
            width={70}
            height={30}
            className="rounded-full shadow-sm cursor-pointer"
          />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <h2 className="hidden md:flex gap-2 items-center border rounded-full p-2 px-10 cursor-pointer bg-gray-100 hover:bg-gray-200 transition duration-200">
              <LayoutGrid className="h-5 w-5" />
              {selectedCategory?.name || "Category"}
            </h2>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-md shadow-lg">
            <DropdownMenuLabel className="font-semibold">
              Browse categories
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-4 items-center cursor-pointer hover:bg-gray-100 transition duration-200"
              onClick={() => setSelectedCategory(null)} // Reset selected category
            >
              None
            </DropdownMenuItem>
            {loading ? (
              <DropdownMenuItem>Loading categories...</DropdownMenuItem>
            ) : categories.length === 0 ? (
              <DropdownMenuItem>No categories available</DropdownMenuItem>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={"/product-categories/" + category.name}
                  passHref
                >
                  <DropdownMenuItem
                    onClick={() => handleCategorySelect(category)} // Handle category selection
                    className={`flex gap-4 items-center cursor-pointer hover:bg-gray-100 transition duration-200 ${
                      selectedCategory?.id === category.id ? "bg-gray-200" : ""
                    }`}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}${category?.icon?.[0]?.url}`}
                      alt="icon"
                      width={20}
                      height={20}
                    />
                    {category.name}
                  </DropdownMenuItem>
                </Link>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="md:flex gap-3 items-center border rounded-full p-2 px-4 hidden">
          <Search className="h-5 w-5" />
          <input
            type="text"
            className="outline-none border-none bg-transparent"
            placeholder="Search products"
          />
        </div>
      </div>

      <div className="flex gap-5 items-center">
        {isLogin ? (
          <>
            <div className="flex items-center gap-5">
              <Sheet>
                <SheetTrigger>
                  <h2 className="flex items-center text-lg">
                    <ShoppingBasket className="h-7 w-7" />
                    <span className="bg-primary text-white rounded-full px-2">
                      {totalCartItem}
                    </span>
                  </h2>
                </SheetTrigger>
                <SheetContent className="bg-white">
                  <SheetHeader>
                    <SheetTitle className="bg-primary text-white text-xl font-bold p-3">
                      My Cart
                    </SheetTitle>
                    <SheetDescription>
                      <CartItemLists
                        cartitemList={cartitemList}
                        ondeleteItem={ondeleteItem}
                      />
                    </SheetDescription>
                  </SheetHeader>
                  <SheetClose asChild>
                    {/* Subtotal Section */}
                    <div className="absolute w-[90%] bottom-6 flex flex-col">
                      <h2 className="text-lg font-bold flex justify-between">
                        Subtotal <span>${subtotal}</span>
                      </h2>
                      <Button
                        onClick={() =>
                          router.push(user ? "/checkout" : "/sign-in")
                        }
                      >
                        View Cart
                      </Button>
                    </div>
                  </SheetClose>
                </SheetContent>
              </Sheet>
            </div>

            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button variant="outline">Login</Button>
          </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CircleUserRound className="h-7 w-7 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-md shadow-lg">
            <DropdownMenuLabel className="font-semibold">
              Profile
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile">View Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/orders">Your Orders</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
