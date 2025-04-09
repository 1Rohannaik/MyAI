import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Header from "./Header";

const Subscribe = () => {
  const navigate = useNavigate();

  const subscriptionPlans = [
    {
      plan: "Basic",
      price: 700,
      apiCalls: 100,
      features: [
        "Limited AI responses",
        "Basic chatbot capabilities",
        "Standard response time",
        "Community support",
      ],
      isPopular: false,
    },
    {
      plan: "Pro",
      price: 300,
      apiCalls: 50,
      features: [
        "Enhanced AI responses",
        "Access to advanced chatbot features",
        "Faster response time",
        "Adds more API calls to your existing API Key",
        "Detailed interaction analytics",
      ],
      isPopular: true,
    },
    {
      plan: "Enterprise",
      price: 1000,
      apiCalls: 50000,
      features: [
        "Unlimited AI responses",
        "Priority API access",
        "Custom chatbot training",
        "Dedicated support",
        "Integration with external APIs",
        "White-label options",
      ],
      isPopular: false,
    },
  ];

  const handlePlanSelect = (plan) => {
    navigate(`/payment/${plan.toLowerCase()}`, {
      state: {
        price: subscriptionPlans.find((p) => p.plan === plan).price,
        features: subscriptionPlans.find((p) => p.plan === plan).features,
      },
    });
  };

  return (
    <div>
      <Header />
      <section className="py-20 px-4 bg-gradient-to-br from-gray-700 to-black text-white min-h-screen">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Subscribe to Our Plans
            </h1>
            <p className="text-xl text-white dark:text-gray-400 max-w-2xl mx-auto">
              Choose the perfect plan for your AI chatbot needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.plan}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                  plan.isPopular
                    ? "border-2 border-blue-500 dark:border-blue-400 scale-105"
                    : "border border-gray-200 dark:border-gray-700"
                }`}
              >
                {plan.isPopular && (
                  <div className="bg-blue-500 dark:bg-blue-600 text-white text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {plan.plan}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">
                      ₹{plan.price}
                    </span>
                    <span className="text-white dark:text-gray-400">
                      /month
                    </span>
                  </div>

                  <p className="text-gray-300 dark:text-gray-400 mb-6">
                    {plan.apiCalls.toLocaleString()} AI requests per month
                  </p>

                  <button
                    onClick={() => handlePlanSelect(plan.plan)}
                    className="block w-full py-2 px-4 rounded-lg text-center font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {plan.isPopular ? "Get Started" : "Choose Plan"}
                  </button>
                </div>

                <div className="px-6 pb-6">
                  <p className="font-medium text-white dark:text-gray-300 mb-4">
                    Features:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check
                          size={18}
                          className="text-green-500 mt-0.5 shrink-0"
                        />
                        <span className="text-white dark:text-gray-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Need help choosing a plan?
                </h3>
                <p className="text-white dark:text-gray-400 mb-4">
                  Our team is happy to help you select the right plan for your
                  needs.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center md:justify-start text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Contact our support team
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subscribe;
