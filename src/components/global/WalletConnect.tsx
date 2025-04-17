"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { connectWallet } from "@/utils/web3";
import { toast } from "sonner";

export default function WalletConnButton() {
  const [address, setAddress] = useState<string>("");

  const handleConnect = async () => {
    try {
      const result = await connectWallet();
      setAddress(result.address);
      toast.success("Wallet connected!");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to connect wallet");
    }
  };

  const handleDisconnect = () => {
    setAddress("");
    toast.success("Wallet disconnected");
  };

  return (
    <div>
      {address ? (
        <div className="flex items-center gap-2">
          <Button
            className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-orange-500 bg-orange-200 text-orange-800"
            disabled
          >
            {address.slice(0, 6)}...{address.slice(-4)}
          </Button>
          <Button
            className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-orange-500 bg-orange-200 text-orange-800 hover:bg-orange-300"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-orange-500 bg-orange-200 text-orange-800 hover:bg-orange-300"
          onClick={handleConnect}
        >
          <img src="/MetaMask_Fox.svg" alt="MetaMask" className="h-5 w-5" />
          Connect Metamask
        </Button>
      )}
    </div>
  );
}