import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { serverUrl } from "../App";
import { IoMdArrowRoundBack } from "react-icons/io";


function Pricing() {
  const navigate = useNavigate();
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [paying, setPaying] = useState(false);
  const [payingAmount, setPayingAmount] = useState(null);

  const handlePaying = async (amount) => {
    try {
      setPayingAmount(amount);
      setPaying(true);
      const result = await axios.post(
        serverUrl + "/api/credit/order",
        { amount },
        { withCredentials: true },
      );

      if (result.data.url) {
        window.location.href = result.data.url;
      }

      setPaying(false);
    } catch (error) {
      setPaying(false);
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 px-6 py-10 relative">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 font-medium transition-colors"
        >
          <IoMdArrowRoundBack /> Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-br from-black via-gray-700 to-black bg-clip-text text-transparent mb-4">
            Buy Credits
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Power up your learning with AI-generated notes, professional diagrams, and instant revision materials.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            title="Starter"
            price="₹100"
            amount={100}
            credits="50 Credits"
            description="Perfect for quick revisions"
            features={[
              "Generate AI notes",
              "Exam-focused answers",
              "Diagram & charts support",
              "Fast generation",
            ]}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying}
            paying={paying}
            payingAmount={payingAmount}
          />

          <PricingCard
            popular
            title="Popular"
            price="₹200"
            amount={200}
            credits="120 Credits"
            description="Best value for students"
            features={[
              "All Starter features",
              "More credits per ₹",
              "Revision mode access",
              "Priority AI response",
            ]}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying}
            paying={paying}
            payingAmount={payingAmount}
          />

          <PricingCard
            title="Pro Learner"
            price="₹500"
            amount={500}
            credits="300 Credits"
            description="For serious exam preparation"
            features={[
              "Maximum credit value",
              "Unlimited revisions",
              "Charts & diagrams",
              "Ideal for full syllabus",
            ]}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying}
            paying={paying}
            payingAmount={payingAmount}
          />
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  title,
  price,
  amount,
  credits,
  description,
  features,
  popular,
  selectedPrice,
  setSelectedPrice,
  onBuy,
  paying,
  payingAmount,
}) {
  const isSelected = selectedPrice === amount;
  const isPayingThisCard = paying && payingAmount === amount;
  return (
    <motion.div
      onClick={() => setSelectedPrice(amount)}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`
        relative cursor-pointer
        rounded-2xl p-8 
        backdrop-blur-2xl
        transition-all duration-300
        flex flex-col
        ${
          isSelected
            ? "bg-black/90 text-white border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            : popular
            ? "bg-white border-indigo-200 shadow-xl"
            : "bg-white border-gray-100 shadow-lg"
        }
      `}
    >
      {popular && !isSelected && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-600 text-white shadow-md">
          Best Value
        </span>
      )}

      {isSelected && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-green-500 text-white shadow-md">
          Current Choice
        </span>
      )}

      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${isSelected ? "text-white" : "text-gray-900"}`}>{title}</h2>
        <p className={`text-sm mt-2 ${isSelected ? "text-gray-400" : "text-gray-500"}`}>{description}</p>
      </div>

      <div className="mb-8">
        <p className={`text-4xl font-extrabold ${isSelected ? "text-white" : "text-gray-900"}`}>{price}</p>
        <p className={`text-sm font-semibold mt-1 ${isSelected ? "text-indigo-400" : "text-indigo-600"}`}>{credits}</p>
      </div>

      <button
        disabled={isPayingThisCard}
        onClick={(e) => {
          e.stopPropagation();
          onBuy(amount);
        }}
        className={`
          w-full py-4 rounded-xl font-bold text-lg transition-all duration-300
          ${
            isPayingThisCard
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : isSelected
              ? "bg-white text-black hover:bg-gray-100 shadow-lg"
              : "bg-black text-white hover:opacity-90 shadow-xl"
          }
        `}
      >
        {isPayingThisCard ? "Processing..." : "Buy Credits"}
      </button>

      <ul className="mt-10 space-y-4">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
              ✓
            </span>
            <span className={isSelected ? "text-gray-300" : "text-gray-600"}>{f}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default Pricing;
