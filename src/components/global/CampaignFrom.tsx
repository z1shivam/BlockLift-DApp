"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";

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
});

export function CampaignForm() {
  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      creator: "",
      goal: 0,
      deadline: Date.now(),
    },
  });

  function onSubmit(values: z.infer<typeof campaignSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 pt-4"
      >
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
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
                  type="datetime-local"
                  {...field}
                  onChange={(e) =>
                    field.onChange(new Date(e.target.value).getTime())
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="h-12 cursor-pointer bg-emerald-800 px-6 text-white hover:bg-emerald-900 disabled:cursor-not-allowed"
          type="submit"
          disabled
        >
          Connect Wallet & Create
        </Button>
      </form>
    </Form>
  );
}
