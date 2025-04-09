import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import loadRazorpay from "./LoadRazorPay";
import axios from "axios";
import toast from "react-hot-toast";


const Payment = () => {
  const { plan } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const planDetails = {
    free: {
      name: "Free Plan",
      price: 0,
      apiCalls: 100,
    },
    pro: {
      name: "Pro Plan",
      price: 300,
      apiCalls: 5000,
    },
    enterprise: {
      name: "Enterprise Plan",
      price: 999,
      apiCalls: 50000,
    },
  };

  // Redirect if invalid plan
  useEffect(() => {
    if (!planDetails[plan]) {
      navigate("/pricing");
    }
  }, [plan, navigate]);

  const currentPlan = planDetails[plan] || planDetails.free;

const redirectAfterPayment = () => {
  toast.success("Payment successful! Redirecting to AskAI...", {
    duration: 3000, 
  });

  setTimeout(() => navigate("/gemini"), 3000);
};

  const displayRazorpay = async (orderData) => {
    const res = await loadRazorpay();
    if (!res) {
      setPaymentError("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_qkeXPdFgurgaAQ",
      amount: orderData.amount * 100,
      currency: "INR",
      name: "MyAI",
      description: `${currentPlan.name} Subscription`,
      order_id: orderData.id,
      handler: async (response) => {
        setIsVerifying(true);
        try {
          const res = await axios.post(
            "http://localhost:3000/api/v1/payment/verify",
            {
              paymentId: response.razorpay_payment_id,
              plan,
              amount: currentPlan.price,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (res.data.success) {
            try {
              const userRes = await axios.get(
                "http://localhost:3000/api/v1/users/me",
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              const updatedUser = userRes.data.user;
              localStorage.setItem("user", JSON.stringify(updatedUser));
            } catch (fetchError) {
              console.error("Failed to fetch updated user:", fetchError);
            }
            redirectAfterPayment();
          } else {
            setPaymentError("Payment verification failed. Please try again.");
          }
        } catch (error) {
          setPaymentError(
            error.response?.data?.message ||
              "An unexpected error occurred. Please try again."
          );
          console.error("Error verifying payment:", error);
        } finally {
          setIsVerifying(false);
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: "",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError(null);

    if (currentPlan.price > 0 && (!formData.name || !formData.email)) {
      setPaymentError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      if (currentPlan.price === 0) {
        redirectAfterPayment();
      } else {
        const orderResponse = await axios.post(
          "http://localhost:3000/api/v1/payment/orders",
          {
            amount: currentPlan.price,
            currency: "INR",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        displayRazorpay(orderResponse.data);
      }
    } catch (error) {
      setPaymentError("Payment processing failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 dark:text-white">
      <div className="container mx-auto max-w-3xl py-12 px-4 pt-24">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Payment Details</h2>
          {paymentError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {paymentError}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="John Doe"
                  required={currentPlan.price > 0}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="you@example.com"
                  required={currentPlan.price > 0}
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading || isVerifying}
                className={`w-full py-3 px-4 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${
                  isVerifying ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isVerifying
                  ? "Verifying..."
                  : isLoading
                  ? "Processing..."
                  : `Pay ₹${currentPlan.price}`}
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Your payment is secure and encrypted</p>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">Plan</span>
              <span className="font-medium">{currentPlan.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                API Calls
              </span>
              <span className="font-medium">
                {currentPlan.apiCalls.toLocaleString()}/month
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Billing</span>
              <span className="font-medium">Monthly</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>₹{currentPlan.price}/month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
