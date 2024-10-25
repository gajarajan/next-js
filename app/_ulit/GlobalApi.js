// Import Axios (using ES6 import syntax)
import axios from "axios";

// Create an Axios instance with a base URL for reuse in API requests
const axiosClient = axios.create({
  baseURL: "http://192.168.255.1:1337/api", // Replace with your actual API URL
});

// Helper function to handle common errors
const handleError = (error) => {
  if (error.response) {
    console.error("Error status:", error.response.status);
    console.error("Error data:", error.response.data);
  } else {
    console.error("Error message:", error.message);
  }
  throw error;
};

// Function to fetch categories
export const getCategory = async () => {
  try {
    const { data } = await axiosClient.get("/categories?populate=*");
    return data;
  } catch (error) {
    handleError(error);
  }
};

// Function to fetch category list (returns only the 'data' field)
export const getCategorylist = async () => {
  try {
    const { data } = await axiosClient.get("/categories?populate=*");
    return data.data;
  } catch (error) {
    handleError(error);
  }
};

// Function to fetch sliders
export const getSlider = async () => {
  try {
    const { data } = await axiosClient.get("/sliders?populate=*");
    return data.data;
  } catch (error) {
    handleError(error);
  }
};

// Function to fetch all products
export const getProduct = async () => {
  try {
    const { data } = await axiosClient.get("/products?populate=*");
    return data.data;
  } catch (error) {
    handleError(error);
  }
};

// Function to fetch products by category
export const getProjectbyCategory = async (category) => {
  try {
    const { data } = await axiosClient.get(
      `/products?filters[category][name][$in]=${category}&populate=*`
    );
    return data.data;
  } catch (error) {
    handleError(error);
  }
};

// Function to register a new user
export const registerUser = async (username, email, password) => {
  try {
    const data  = await axiosClient.post("/auth/local/register", {
      username,
      email,
      password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

// Function to sign in an existing user
export const signInUser = async (email, password) => {
  try {
    const response = await axiosClient.post("auth/local", {
      identifier: email,
      password: password,
    });
    return response;
  } catch (error) {
    handleError(error);
  }
};

// Function to add an item to the cart
export const addToCart = async (data, jwt) => {
  try {
    if (!jwt) throw new Error("JWT token is missing.");
    const response = await axiosClient.post("/user-carts", data, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  } catch (error) {
    handleError(error);
  }
};

// Function to delete a cart item
export const deleteCartItem = async (Id, jwt) => {
  try {
    if (!jwt) throw new Error("JWT token is missing.");
    const response = await axiosClient.delete(`/user-carts/${Id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error("Cart item not found.");
    }
    handleError(error);
  }
};

// Function to get cart items for a specific user
export const getCartItem = async (userId, jwt) => {
  try {
    if (!jwt) throw new Error("JWT token is missing.");
    const { data } = await axiosClient.get(
      `/user-carts?filters[UserId][$eq]=${userId}&[populate][products][populate][Image][populate]=*`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    // Mapping to simplify cart item structure
    return data.data.map((item) => {
      const product = item.products[0]; // Assuming a single product per cart item
      return {
        productName: product.name,
        quantity: item.quantity,
        amount: item.amount,
        actualPrice: product.sellingprice || product.mrp,
        imageUrl: `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}${product.Image[0].url}`,
        id: item.id,
        documentId: item.documentId,
        productId: product.id,
      };
    });
  } catch (error) {
    handleError(error);
  }
};

// Function to create a new order
export const createOrder = async (data, jwt) => {
  try {
    if (!jwt) throw new Error("JWT token is missing.");
    const response = await axiosClient.post("/orders", data, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  } catch (error) {
    handleError(error);
  }
};

// Function to get user orders
export const getMyOrder = async (userId, jwt) => {
  try {
    if (!jwt) throw new Error("JWT token is missing.");
    const { data } = await axiosClient.get(
      `/orders?filters[UserId][$eq]=${userId}&[populate][orderItemList][product][populate][Image][populate]=*`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    // Mapping to simplify order item structure
    return data.data.map((order) => ({
      id: order.id,
      totalOrderAmount: order.totalOrderAmount,
      paymentId: order.paymentId,
      orderItemList: order.orderItemList,
      createdAt: order.createdAt,
      orderstatus: order.orderstatus,
    }));
  } catch (error) {
    handleError(error);
  }
};
