"use client";
import { createOrder, deleteCartItem, getCartItem } from "@/app/_ulit/GlobalApi";
import { Input } from "@/components/ui/input";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function CheckOut() {
    const [totalCartItem, setTotalCartItem] = useState(0);
    const [cartitemList, setCartItemList] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [amount, setAmount] = useState(0);

    // States for form inputs
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [zip, setZip] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        const jwt = sessionStorage.getItem("jwt");
        const storedUser = sessionStorage.getItem("user");

        if (!jwt) {
            router.push("/sign-in");
        } else if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user data:", error);
                setUser(null);
            }
        }
    }, [router]);

    const fetchCartItems = useCallback(async () => {
        const jwt = sessionStorage.getItem("jwt");
        if (!jwt || !user) return;

        setLoading(true);
        try {
            const cartItems = await getCartItem(user.id, jwt);
            setTotalCartItem(cartItems?.length || 0);
            setCartItemList(cartItems);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchCartItems();
        }
    }, [user, fetchCartItems]);

    useEffect(() => {
        const total = cartitemList.reduce(
            (sum, item) => sum + parseFloat(item.amount || 0),
            0
        );
        setSubtotal(total.toFixed(2));
    }, [cartitemList]);

    useEffect(() => {
        const tax = parseFloat(subtotal) * 0.09;
        const deliveryFee = 15;
        const totalAmount = (parseFloat(subtotal) + tax + deliveryFee).toFixed(2);
        setAmount(totalAmount);
    }, [subtotal]);

    const onApprove = async (data) => {
        const jwt = sessionStorage.getItem("jwt");
        console.log(email);
        
        const payload = {
            data: {
                paymentId: data.orderID,
                totalOrderAmount: amount,
                email: email,
                address: address,
                phone: phone,
                zip: zip,
                username: name,
                userId: user.id,
                orderItemList: cartitemList.map((item) => ({
                    product: item.productId,
                    quantity: item.quantity,
                    price: item.amount,
                })),
            },
        };
console.log(payload);

        try {
            await createOrder(payload, jwt);
            toast.success("Order created successfully!");
            cartitemList.forEach((item,index)=>{
              deleteCartItem(item.id).then(resp=>{})
            })
router.replace('/order-confirmation')
            router.replace('/order-confirmation')
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error("There was an error creating the order.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }
console.log(amount);

    return (
        <div>
            <h2 className="p-3 bg-primary text-xl font-bold text-center text-white">
                Checkout
            </h2>
            <div className="p-5 px-5 md:px-10 grid grid-cols-1 py-8 md:grid-cols-3">
                {/* Billing Details */}
                <div className="md:col-span-2 mx-20">
                    <h2 className="font-bold text-3xl">Billing Details</h2>
                    <div className="grid grid-cols-2 gap-10 mt-3">
                        <Input
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-10 mt-3">
                        <Input
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <Input
                            placeholder="Zip"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                        />
                    </div>
                    <div className="mt-3">
                        <Input
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>

                {/* Cart Summary */}
                <div className="mx-10 border">
                    <h2 className="p-3 bg-gray-300 font-bold text-center">
                        Total Cart Items: {totalCartItem}
                    </h2>
                    <div className="p-4 flex flex-col gap-4">
                        <h2 className="font-bold flex justify-between">
                            Subtotal: <span>${subtotal}</span>
                        </h2>
                        <hr />
                        <h2 className="flex justify-between">
                            Delivery: <span>$15.00</span>
                        </h2>
                        <h2 className="flex justify-between">
                            Tax (9%): <span>${(subtotal * 0.09).toFixed(2)}</span>
                        </h2>
                        <hr />
                        <h2 className="font-bold flex justify-between">
                            Total: <span>${amount}</span>
                        </h2>

                        <PayPalButtons disabled={!(name&&email&&phone&&address&&zip)}
                            style={{ layout: "horizontal" }}
                            onApprove={onApprove}
                            createOrder={(data, action) => {
                                return action.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: amount,
                                                currency_code: "USD",
                                            },
                                        },
                                    ],
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
