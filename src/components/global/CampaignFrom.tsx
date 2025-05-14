"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
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
import { Textarea } from "../ui/textarea";

const campaignSchema = z.object({
  creator: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Invalid Ethereum address",
  }),
  goal: z.number().min(0, {
    message: "Goal must be a positive number",
  }),
  deadline: z.number().min(Date.now(), {
    message: "Deadline must be in the future",
  }),
  title: z.string().min(3, {
    message: "Title is required",
  }),
  image: z.any().optional(), // For simplicity, validate later if needed
  description: z.string().min(10, {
    message: "Description is required",
  }),
});

export function CampaignForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      creator: "",
      goal: 0,
      deadline: Date.now(),
      title: "",
      image: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof campaignSchema>) {
    console.log("Campaign Data:", values);
  }

  const nextStep = async () => {
    const isStepValid = await form.trigger(
      step === 1
        ? ["creator", "goal", "deadline"]
        : step === 2
          ? ["title", "image"]
          : ["description"],
    );

    if (isStepValid) {
      setDirection("forward");
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setDirection("backward");
    setStep((prev) => prev - 1);
  };

  const slideVariants = {
    enter: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.2,
      },
    },
    exit: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? -300 : 300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.2,
      },
    }),
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative w-full overflow-hidden pt-4"
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="creator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-emerald-800">
                        Your Wallet Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0x..."
                          {...field}
                          className="h-12 border-2 border-emerald-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-emerald-800">
                        Funding Goal (ETH)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 border-2 border-emerald-700"
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-emerald-800">
                        Deadline
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 border-2 border-emerald-700"
                          type="date"
                          value={
                            new Date(field.value).toISOString().split("T")[0]
                          }
                          onChange={(e) =>
                            field.onChange(
                              new Date(e.target.value).setHours(0, 0, 0, 0),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 2 && (
              <>
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
                          placeholder="Campaign title"
                          {...field}
                          className="h-12 border-2 border-emerald-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-emerald-800">
                        Upload Image
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          className="h-12 border-2 border-emerald-700"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 3 && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-emerald-800">
                      Campaign Description (Markdown Supported)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your campaign in detail..."
                        {...field}
                        className="min-h-[150px] border-2 border-emerald-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  className="h-12 bg-gray-500 px-6 text-white hover:bg-gray-600"
                >
                  Back
                </Button>
              )}
              {step < 3 && (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="h-12 bg-emerald-800 px-6 text-white hover:bg-emerald-900"
                >
                  Next
                </Button>
              )}
              {step === 3 && (
                <Button
                  type="submit"
                  className="h-12 bg-emerald-800 px-6 text-white hover:bg-emerald-900"
                >
                  Submit Campaign
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </form>
    </Form>
  );
}
