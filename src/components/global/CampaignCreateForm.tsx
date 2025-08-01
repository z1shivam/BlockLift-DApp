import Image from "next/image";
import { henny_penny } from "./Header";
import { CampaignForm } from "./CampaignFrom";

export default function CampaignCreateForm() {
  return (
    <section className="mx-auto max-w-7xl pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="w-full md:pr-6">
        <div className="mb-6">
          <h2 className={`${henny_penny.className} text-4xl text-emerald-900 mb-3`}>
            Start Your Campaign
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Begin your crowdfunding journey in just a few steps. Share your idea with the world!
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-emerald-800 mb-2">Quick Start Process:</h3>
            <ol className="text-sm text-emerald-700 space-y-1">
              <li>1. Fill in basic details below</li>
              <li>2. Continue to detailed campaign creation</li>
              <li>3. Add images, description, and story</li>
              <li>4. Publish your campaign to the world!</li>
            </ol>
          </div>
        </div>
        <CampaignForm />
      </div>
      <div className="w-full p-6 flex items-center justify-center">
        <div className="text-center">
          <Image
            src={"/hero-image.png"}
            width={500}
            height={400}
            alt="Create campaign illustration"
            className=""
          />
          <p className="text-gray-600 mt-4 text-sm">
            Join creators who have successfully funded their projects on BlockLift
          </p>
        </div>
      </div>
    </section>
  );
}
