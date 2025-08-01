"use client";

import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import Image from "next/image";

export default function WalletConnButton() {
  const { account, isConnecting, connectWallet, disconnectWallet } = useWallet();

  if (account) {
    return (
      <Button 
        variant="outline" 
        className="bg-orange-50 text-orange-900 border-orange-300 hover:bg-orange-100 flex items-center gap-2 transition-colors"
        onClick={disconnectWallet}
        title={`Connected to ${account}`}
      >
        <Image 
          src="/MetaMask_Fox.svg" 
          alt="MetaMask" 
          width={20} 
          height={20}
          className="w-5 h-5"
        />
        <span className="hidden sm:inline font-mono">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
        <span className="sm:hidden font-semibold">Connected</span>
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      className="bg-orange-50 text-orange-900 border-orange-300 hover:bg-orange-100 flex items-center gap-2 font-semibold transition-colors"
      onClick={connectWallet}
      disabled={isConnecting}
    >
      <Image 
        src="/MetaMask_Fox.svg" 
        alt="MetaMask" 
        width={20} 
        height={20}
        className="w-5 h-5"
      />
      {isConnecting ? "Connecting..." : "Connect MetaMask"}
    </Button>
  );
}