"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useWallet } from "@/contexts/WalletContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, User, Settings, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfile {
  address: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  joinedDate: string;
  preferences: {
    emailNotifications: boolean;
    campaignUpdates: boolean;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { account, isAuthenticated } = useWallet();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please connect your wallet to access profile settings");
      router.push('/dashboard');
      return;
    }

    // Load user profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else if (account) {
      // Create default profile
      const defaultProfile: UserProfile = {
        address: account,
        displayName: `User ${account.slice(0, 6)}`,
        bio: "",
        avatar: "",
        joinedDate: new Date().toISOString(),
        preferences: {
          emailNotifications: true,
          campaignUpdates: true,
        },
      };
      setProfile(defaultProfile);
    }
  }, [account, isAuthenticated, router]);

  const handleSaveProfile = () => {
    if (!profile) return;

    setIsLoading(true);
    try {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (field: keyof UserProfile, value: any) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      [field]: value,
    });
  };

  const updatePreferences = (field: keyof UserProfile['preferences'], value: boolean) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        [field]: value,
      },
    });
  };

  if (!isAuthenticated) {
    return null; // Redirect will happen in useEffect
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

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
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-emerald-600 text-white text-xl">
                {profile.displayName?.charAt(0) || account?.charAt(2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-emerald-900">Profile Settings</h1>
              <p className="text-gray-600">
                {account?.slice(0, 8)}...{account?.slice(-6)}
              </p>
              <p className="text-sm text-gray-500">
                Joined {new Date(profile.joinedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Update your display name and bio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName || ''}
                    onChange={(e) => updateProfile('displayName', e.target.value)}
                    placeholder="Your display name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || ''}
                    onChange={(e) => updateProfile('bio', e.target.value)}
                    placeholder="Tell others about yourself..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Preferences
                </CardTitle>
                <CardDescription>
                  Manage your notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Receive updates about your campaigns via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={profile.preferences.emailNotifications}
                    onCheckedChange={(checked) => updatePreferences('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="campaign-updates">Campaign Updates</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Get notified when campaigns you support reach milestones
                    </p>
                  </div>
                  <Switch
                    id="campaign-updates"
                    checked={profile.preferences.campaignUpdates}
                    onCheckedChange={(checked) => updatePreferences('campaignUpdates', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button 
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="w-full bg-emerald-800 hover:bg-emerald-900"
            >
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <h4 className="font-medium text-gray-900 mb-2">Wallet Security</h4>
                  <p className="mb-4">
                    Your identity is secured by your MetaMask wallet. Only you have access to your private keys.
                  </p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">Data Storage</h4>
                  <p className="mb-4">
                    Profile information is stored locally in your browser. No personal data is sent to external servers.
                  </p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">Blockchain Identity</h4>
                  <p>
                    Your wallet address serves as your unique identifier on BlockLift. All transactions are publicly visible on the blockchain.
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <Link href="/help">
                    <Button variant="outline" className="w-full">
                      Privacy Policy
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
