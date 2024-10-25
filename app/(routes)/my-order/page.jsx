"use client"; // This tells Next.js that the component should run on the client-side

import { getMyOrder } from "@/app/_ulit/GlobalApi"; // Importing the API function
import { useRouter } from "next/navigation"; // Importing useRouter for navigation
import React, { useEffect, useState } from "react"; // Importing React hooks
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"; // Importing Collapsible components
import moment from "moment/moment"; // Importing moment.js for date formatting
import MyOrderItems from "./_component/MyOrderItems"; // Importing MyOrderItems component

export default function MyOrder() {
  const router = useRouter();
  const [orderList, setOrderList] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    const user = JSON.parse(sessionStorage.getItem("user"));
    
    // Redirect to home page if not logged in
    if (!jwt || !user) {
      router.replace("/"); 
      return; // Exit early if not authenticated
    }
    
    // Fetch the order data
    const getOrder = async () => {
      try {
        const orderListData = await getMyOrder(user.id, jwt);
        setOrderList(orderListData);
      } catch (error) {
        console.error("Error fetching orders:", error); // Log error for debugging
      }
    };

    getOrder(); // Call the fetch function
  }, [router]); // Add router as a dependency

  return (
    <div>
      <h2 className="p-3 bg-primary text-xl font-bold text-center text-white">My Order</h2>
      <div className="py-8 mx-7 md:mx-20">
        <h2 className="text-3xl text-primary font-bold">Order History</h2>
        
        {orderList.length === 0 ? (
          <p>No orders found.</p> // Display a message if no orders
        ) : (
          orderList.map((item, index) => (
            <Collapsible key={index}>
              <CollapsibleTrigger>
                <div className="border p-2 bg-slate-200 flex justify-evenly gap-24">
                  <h2>
                    <span className="mr-2 font-bold">Order Date:</span>
                    {moment(item?.createdAt).format('DD/MMM/YYYY') || '09/09/1999'}
                  </h2>
                  <h2>
                    <span className="mr-2 font-bold">Total Amount:</span>
                    ${item?.totalOrderAmount}
                  </h2>
                  <h2>
                    <span className="mr-2 font-bold">Status:</span>
                    {item?.orderStatus}
                  </h2>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {item.orderItemList.map((order, index) => (
                  <MyOrderItems key={index} order={order} index={index} /> // Proper key prop for list
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))
        )}
      </div>
    </div>
  );
}
