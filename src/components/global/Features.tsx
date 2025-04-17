import { FaRocket, FaUsers, FaChartLine, FaLock } from "react-icons/fa";
import { henny_penny } from "./Header";

export default function Features() {
  const features = [
    {
      icon: <FaRocket className="text-4xl text-emerald-600" />,
      title: "Decentralized Funding",
      description:
        "Raise funds transparently on the blockchain with no intermediaries.",
    },
    {
      icon: <FaUsers className="text-4xl text-emerald-600" />,
      title: "Global Backers",
      description:
        "Connect with supporters worldwide for your crowdfunding campaign.",
    },
    {
      icon: <FaChartLine className="text-4xl text-emerald-600" />,
      title: "Transparent Tracking",
      description:
        "Monitor funds and progress in real-time with immutable records.",
    },
    {
      icon: <FaLock className="text-4xl text-emerald-600" />,
      title: "Smart Contract Security",
      description:
        "Ensure trust with secure, audited smart contracts for all transactions.",
    },
  ];
  return (
    <section className=" py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className={`text-3xl font-bold text-emerald-900 ${henny_penny.className}`}>
            Why BlockLift?
          </h2>
          <p className="mt-4 text-lg text-emerald-700">
            Discover the powerful features that make our platform stand out.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border border-emerald-200 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-center text-xl font-semibold text-emerald-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-center text-emerald-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
