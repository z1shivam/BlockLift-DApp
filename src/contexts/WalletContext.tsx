"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

interface WalletContextType {
  account: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isMetaMaskInstalled: boolean;
  isAuthenticated: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  // Computed property for authentication status
  const isAuthenticated = !!account;

  useEffect(() => {
    // Check if MetaMask is installed
    setIsMetaMaskInstalled(typeof window !== "undefined" && !!window.ethereum);
    
    checkConnection();
    
    // Listen for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0 && accounts[0]) {
          setAccount(accounts[0]);
          toast.success(`Switched to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
          
          // Create or update user profile
          const existingProfile = localStorage.getItem('userProfile');
          if (!existingProfile) {
            const newProfile = {
              address: accounts[0],
              displayName: `User ${accounts[0].slice(0, 6)}`,
              bio: "",
              avatar: "",
              joinedDate: new Date().toISOString(),
              preferences: {
                emailNotifications: true,
                campaignUpdates: true,
              },
            };
            localStorage.setItem('userProfile', JSON.stringify(newProfile));
          }
        } else {
          setAccount(null);
          toast.info("Wallet disconnected");
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0 && accounts[0]) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast.error("MetaMask is not installed. Please install MetaMask to continue.", {
        action: {
          label: "Install MetaMask",
          onClick: () => window.open("https://metamask.io/download/", "_blank"),
        },
      });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      if (accounts.length > 0 && accounts[0]) {
        setAccount(accounts[0]);
        toast.success(`Successfully connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
        
        // Create user profile on first connection
        const existingProfile = localStorage.getItem('userProfile');
        if (!existingProfile) {
          const newProfile = {
            address: accounts[0],
            displayName: `User ${accounts[0].slice(0, 6)}`,
            bio: "",
            avatar: "",
            joinedDate: new Date().toISOString(),
            preferences: {
              emailNotifications: true,
              campaignUpdates: true,
            },
          };
          localStorage.setItem('userProfile', JSON.stringify(newProfile));
          toast.success("Welcome to BlockLift! Profile created.");
        }
      }
    } catch (error: any) {
      if (error.code === 4001) {
        toast.error("Connection rejected by user");
      } else if (error.code === -32002) {
        toast.error("Connection request already pending. Please check MetaMask.");
      } else {
        toast.error("Failed to connect to MetaMask");
      }
      console.error("Error connecting to MetaMask:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    toast.success("Wallet disconnected");
    // Note: We keep the user profile in localStorage for next connection
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnecting,
        connectWallet,
        disconnectWallet,
        isMetaMaskInstalled,
        isAuthenticated,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
