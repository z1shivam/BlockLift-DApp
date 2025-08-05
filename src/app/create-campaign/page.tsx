"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Upload, Eye } from "lucide-react";
import { web3Service } from "@/lib/web3Service";
import { useWallet } from "@/contexts/WalletContext";

const detailedCampaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  goal: z.number().min(0.01, "Goal must be greater than 0"),
  deadline: z.string().min(1, "Deadline is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  story: z.string().min(100, "Campaign story must be at least 100 characters"),
  category: z.string().min(1, "Please select a category"),
  creatorName: z.string().min(2, "Creator name is required"),
  image: z.any().optional(),
});

type CampaignFormData = z.infer<typeof detailedCampaignSchema>;

const categories = [
  "Technology",
  "Education", 
  "Art & Culture",
  "Health & Medical",
  "Environment",
  "Social Impact",
  "Business & Startups",
  "Sports & Recreation",
  "Other"
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const { account, connectWallet } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(detailedCampaignSchema),
    defaultValues: {
      title: "",
      goal: 0,
      deadline: "",
      description: "",
      story: "",
      category: "",
      creatorName: "",
    },
  });

  // Load basic campaign data from localStorage on mount
  const [hasDraftData, setHasDraftData] = useState(false);
  
  useEffect(() => {
    const draftData = localStorage.getItem('campaignDraft');
    if (draftData) {
      const draft = JSON.parse(draftData);
      form.setValue('title', draft.title);
      form.setValue('goal', draft.goal);
      form.setValue('deadline', draft.deadline);
      setHasDraftData(true);
    }
  }, [form]);

  // Handle wallet connection requirement
  useEffect(() => {
    if (!account) {
      toast.error("Please connect your wallet to create a campaign");
    }
  }, [account]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('image', file);
    }
  };

  const onSubmit = async (values: CampaignFormData) => {
    if (!account) {
      toast.error("Please connect your wallet first");
      await connectWallet();
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate IPFS hash for image (simplified - in production, upload to IPFS)
      const imageHash = imagePreview ? "QmExample..." : "";
      
      // Calculate duration in days
      const deadlineDate = new Date(values.deadline);
      const now = new Date();
      const durationInDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      console.log("🔍 Form submission data:", {
        title: values.title,
        titleLength: values.title.length,
        description: values.description,
        descriptionLength: values.description.length,
        story: values.story,
        storyLength: values.story.length,
        category: values.category,
        goal: values.goal,
        durationInDays,
        imageHash
      });

      // Use the story field as the description since it's longer and more detailed
      const finalDescription = values.story || values.description;
      
      // Create campaign on blockchain
      const result = await web3Service.createCampaign(
        values.title,
        finalDescription,
        imageHash,
        values.category,
        values.goal,
        durationInDays
      );

      if (result.success) {
        // Clear draft data
        localStorage.removeItem('campaignDraft');
        
        toast.success("🎉 Campaign created successfully on blockchain!");
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        throw new Error("Blockchain transaction failed");
      }

    } catch (error) {
      toast.error("❌ Failed to create campaign. Please try again.");
      console.error("Campaign creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-emerald-900 mb-2">
              {hasDraftData ? "Complete Your Campaign" : "Create New Campaign"}
            </h1>
            <p className="text-gray-600">
              {hasDraftData 
                ? "Add detailed information to make your campaign stand out"
                : "Fill in all the details to launch your crowdfunding campaign"
              }
            </p>
          </div>
        </div>

        {/* Wallet Connection Warning */}
        {!account && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-orange-800 mb-4">
                  You need to connect your MetaMask wallet to create a campaign
                </p>
                <Button onClick={connectWallet} className="bg-orange-600 hover:bg-orange-700">
                  Connect Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>
                  Provide comprehensive information about your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Info - Pre-filled or Empty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Campaign Title {hasDraftData && <span className="text-xs text-emerald-600">(from quick start)</span>}</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className={hasDraftData ? "bg-emerald-50 border-emerald-200" : "border-2 border-emerald-300 focus:border-emerald-500"}
                                readOnly={hasDraftData}
                                placeholder={hasDraftData ? "" : "What's your project about?"}
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
                              <FormLabel className="flex items-center justify-between">
                                <span>Goal (ETH) {hasDraftData && <span className="text-xs text-emerald-600 ml-1">(from quick start)</span>}</span>
                                {formattedRupees && (
                                  <span className="text-sm font-normal text-emerald-600 bg-emerald-50 px-2 py-1 rounded" title="Approximate conversion at 1 ETH = ₹3,32,820">
                                    ≈ {formattedRupees}
                                  </span>
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className={hasDraftData ? "bg-emerald-50 border-emerald-200" : "border-2 border-emerald-300 focus:border-emerald-500"}
                                  readOnly={hasDraftData}
                                  placeholder={hasDraftData ? "" : "0.00"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => {
                        // Get tomorrow's date as minimum deadline
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const minDate = tomorrow.toISOString().split('T')[0];

                        return (
                          <FormItem>
                            <FormLabel>Deadline {hasDraftData && <span className="text-xs text-emerald-600">(from quick start)</span>}</FormLabel>
                            <FormControl>
                              <Input 
                                type="date"
                                {...field}
                                min={!hasDraftData ? minDate : undefined}
                                className={hasDraftData ? "bg-emerald-50 border-emerald-200" : "border-2 border-emerald-300 focus:border-emerald-500"}
                                readOnly={hasDraftData}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    {/* Creator Info */}
                    <FormField
                      control={form.control}
                      name="creatorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Creator/Organization Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name or organization"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Image Upload */}
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Image</FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              {imagePreview ? (
                                <div className="space-y-4">
                                  <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="max-h-48 mx-auto rounded-lg"
                                  />
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setImagePreview(null)}
                                  >
                                    Change Image
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <Upload className="h-12 w-12 mx-auto text-gray-400" />
                                  <div>
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                      <span className="text-emerald-600 hover:text-emerald-500">
                                        Click to upload
                                      </span>
                                      <span className="text-gray-500"> or drag and drop</span>
                                    </label>
                                    <input
                                      id="image-upload"
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageChange}
                                      className="hidden"
                                    />
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    PNG, JPG, GIF up to 10MB
                                  </p>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="A brief overview of your campaign (50-200 characters)"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Story */}
                    <FormField
                      control={form.control}
                      name="story"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Story</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell the full story of your campaign. What problem are you solving? How will the funds be used? What impact will it have?"
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting || !account}
                      className="w-full h-12 bg-emerald-800 hover:bg-emerald-900"
                    >
                      {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Preview/Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-emerald-900">
                    {form.watch("title") || "Your Campaign Title"}
                  </h3>
                  <div className="mt-1">
                    <p className="text-sm text-gray-600">
                      Goal: {form.watch("goal") || 0} ETH
                    </p>
                    {form.watch("goal") > 0 && (
                      <p className="text-xs text-emerald-600">
                        ≈ {new Intl.NumberFormat('en-IN', { 
                          style: 'currency', 
                          currency: 'INR',
                          maximumFractionDigits: 0 
                        }).format((form.watch("goal") || 0) * 332820)}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Deadline: {form.watch("deadline") || "Not set"}
                  </p>
                  {form.watch("category") && (
                    <Badge variant="outline" className="mt-2">
                      {form.watch("category")}
                    </Badge>
                  )}
                </div>

                {imagePreview && (
                  <div>
                    <img 
                      src={imagePreview} 
                      alt="Campaign preview" 
                      className="w-full rounded-lg"
                    />
                  </div>
                )}

                {form.watch("description") && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Description</h4>
                    <p className="text-sm text-gray-600">
                      {form.watch("description")}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-2">Tips for Success</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Use a clear, compelling title</li>
                    <li>• Add a high-quality image</li>
                    <li>• Write a detailed story</li>
                    <li>• Set a realistic funding goal</li>
                    <li>• Choose appropriate deadline</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
