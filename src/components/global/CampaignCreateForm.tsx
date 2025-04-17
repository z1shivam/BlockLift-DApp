import Image from "next/image";
import { henny_penny } from "./Header";
import { CampaignForm } from "./CampaignFrom";

export default function CampaignCreateForm() {
  return (
    <section className="mx-auto max-w-7xl pt-6 grid grid-cols-2">
      <div className="w-full md:pr-6">
        <p className={`${henny_penny.className} text-4xl text-emerald-900`}>
          Create Your Campaign
        </p>
        <CampaignForm />
      </div>
      <div className="w-full p-6">
        <Image
          src={"/hero-image.png"}
          width={1280}
          height={720}
          alt="hero image"
          className=""
        />
      </div>
    </section>
  );
}
