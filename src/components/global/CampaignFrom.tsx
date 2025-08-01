"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "sonner";

const basicCampaignSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }),
  goal: z.number().min(0.01, {
    message: "Goal must be greater than 0",
  }),
  deadline: z.string().min(1, {
    message: "Deadline is required",
  }),
});

export function CampaignForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof basicCampaignSchema>>({
    resolver: zodResolver(basicCampaignSchema),
    defaultValues: {
      title: "",
      goal: 0,
      deadline: "",
    },
  });

  function onSubmit(values: z.infer<typeof basicCampaignSchema>) {
    setIsSubmitting(true);
    
    // Store basic campaign data in localStorage for the detailed form
    localStorage.setItem('campaignDraft', JSON.stringify(values));
    
    toast.success("Basic details saved! Redirecting to complete your campaign...");
    
    // Redirect to detailed campaign creation page
    setTimeout(() => {
      router.push('/create-campaign');
      setIsSubmitting(false);
    }, 1000);
  }

  // Get tomorrow's date as minimum deadline
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base text-emerald-800">
                Campaign Title
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="What's your project about?"
                  {...field}
                  className="h-12 border-2 border-emerald-300 focus:border-emerald-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => {
            const ethValue = field.value || 0;
            const rupeesValue = ethValue * 332820;
            const formattedRupees = rupeesValue > 0 ? 
              new Intl.NumberFormat('en-IN', { 
                style: 'currency', 
                currency: 'INR',
                maximumFractionDigits: 0 
              }).format(rupeesValue) : '';

            return (
              <FormItem>
                <FormLabel className="text-base text-emerald-800 flex items-center justify-between">
                  <span>Funding Goal (ETH)</span>
                  {formattedRupees && (
                    <span className="text-sm font-normal text-emerald-600 bg-emerald-50 px-2 py-1 rounded" title="Approximate conversion at 1 ETH = ₹3,32,820">
                      ≈ {formattedRupees}
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-12 border-2 border-emerald-300 focus:border-emerald-500"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base text-emerald-800">
                Campaign Deadline
              </FormLabel>
              <FormControl>
                <Input
                  className="h-12 border-2 border-emerald-300 focus:border-emerald-500"
                  type="date"
                  min={minDate}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-emerald-800 text-white hover:bg-emerald-900 font-semibold"
        >
          {isSubmitting ? "Saving..." : "Continue to Full Details"}
        </Button>
      </form>
    </Form>
  );
}
