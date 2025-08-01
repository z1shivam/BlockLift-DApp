"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Wallet, Heart } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

interface ContributeButtonProps {
  campaignId: number;
  isCompleted: boolean;
  isExpired: boolean;
}

export default function ContributeButton({ campaignId, isCompleted, isExpired }: ContributeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const { account, connectWallet } = useWallet();

  const handleContribute = async () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      await connectWallet();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Placeholder for future web3 integration
    toast.success(`Contribution of ${amount} ETH will be processed when web3 is integrated`, {
      description: `From wallet: ${account.slice(0, 6)}...${account.slice(-4)}`,
    });
    setIsOpen(false);
    setAmount("");
    setMessage("");
  };

  if (isCompleted) {
    return (
      <Button disabled className="w-full">
        <Heart className="h-4 w-4 mr-2" />
        Campaign Completed
      </Button>
    );
  }

  if (isExpired) {
    return (
      <Button disabled className="w-full">
        Campaign Expired
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
          <Wallet className="h-4 w-4 mr-2" />
          Contribute Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contribute to Campaign</DialogTitle>
          <DialogDescription>
            Help bring this project to life with your contribution.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.001"
              placeholder="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Leave an encouraging message for the creator"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleContribute}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Contribute {amount ? `${amount} ETH` : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
