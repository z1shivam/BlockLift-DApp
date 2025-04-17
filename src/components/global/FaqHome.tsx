import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { henny_penny } from "./Header";

export default function FAQSection() {
  return (
    <section className="mx-auto w-full max-w-4xl py-12">
      <h2
        className={`mb-8 text-center text-3xl font-bold ${henny_penny.className} text-emerald-800`}
      >
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl">
            What is a decentralized crowdfunding platform?
          </AccordionTrigger>
          <AccordionContent className="text-lg">
            It’s a platform where creators raise funds directly from supporters
            using blockchain technology, ensuring transparency and eliminating
            intermediaries.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl">
            How do I start a campaign?
          </AccordionTrigger>
          <AccordionContent className="text-lg">
            Connect your crypto wallet, create a campaign with your funding goal
            and details, and share it with your community to start collecting
            contributions.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl">
            Are there any fees?
          </AccordionTrigger>
          <AccordionContent className="text-lg">
            We charge a minimal platform fee, and blockchain transaction fees
            apply. All costs are transparent and shown before you confirm your
            campaign or contribution.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-xl">
            How secure is my contribution?
          </AccordionTrigger>
          <AccordionContent className="text-lg">
            Contributions are secured by blockchain smart contracts, ensuring
            funds are only released to creators when campaign conditions are
            met.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-xl">
            Can I contribute anonymously?
          </AccordionTrigger>
          <AccordionContent className="text-lg">
            Yes, you can contribute using a pseudonymous crypto wallet, keeping
            your identity private while supporting projects you care about.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
