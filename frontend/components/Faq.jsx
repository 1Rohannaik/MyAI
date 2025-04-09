import React, { useState } from "react";
import Header from "./Header";

const FAQ = () => {
  const faqs = [
    {
      question: "What is this AI chatbot?",
      answer:
        "This chatbot is powered by advanced AI models to assist you in generating responses, answering queries, and much more.",
    },
    {
      question: "How does it work?",
      answer:
        "Simply enter your question or prompt, and the AI chatbot will generate a response based on its trained knowledge.",
    },
    {
      question: "What are the available subscription plans?",
      answer:
        "We offer Basic, Pro, and Enterprise plans with varying features and API access.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your subscription at any time from your account settings.",
    },
    {
      question: "How many AI responses do I get per month?",
      answer:
        "It depends on the plan. Basic offers 100 requests, Pro offers 500, and Enterprise offers unlimited responses.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we prioritize data security and do not store user conversations beyond the session.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach out to us via our Contact page or email support@example.com.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <Header />
      <section className="py-20 px-4 bg-gradient-to-br from-gray-700 to-black text-white min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-700">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left flex justify-between items-center py-3 px-4 bg-gray-800 text-white rounded-md"
                >
                  <span>{faq.question}</span>
                  <span className="text-xl">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-4 py-2 text-gray-300">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
