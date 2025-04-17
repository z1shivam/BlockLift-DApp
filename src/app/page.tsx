import AiChatHome from "@/components/global/AiChatHome";
import CampaignCreateForm from "@/components/global/CampaignCreateForm";
import FAQSection from "@/components/global/FaqHome";
import Features from "@/components/global/Features";
import Footer from "@/components/global/Footer";
import Hero from "@/components/global/Hero";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CampaignCreateForm />
      <Features />
      <AiChatHome />
      <FAQSection />
      <Footer />
    </main>
  );
}
