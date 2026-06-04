import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "./supabase";

export type Status = "pending" | "accepted" | "rejected";

export interface ScrapItem {
  id: string;
  seller: string;
  sellerId: string;
  material: string;
  quantity: string;
  price: string;
  minAmount: string;
  address: string;
  status: Status;
  pickupLocation: string;
  contactNumber?: string;
}

interface MarketContextValue {
  requests: ScrapItem[];
  acceptedRequests: ScrapItem[];
  currentUserId: string;
  addRequest: (request: Omit<ScrapItem, "id" | "status">) => void;
  updateStatus: (id: string, newStatus: Status) => void;
  deleteRequest: (id: string) => void;
}

const MarketContext = createContext<MarketContextValue | undefined>(undefined);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<ScrapItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    loadUser();
    fetchRequests();

    const channel = supabase
      .channel("marketplace-requests-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "requests" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            const r = payload.new;
            setRequests((prev) => [
              {
                id: r.id,
                seller: r.seller,
                sellerId: r.seller_id,
                material: r.material,
                quantity: r.quantity,
                price: r.price,
                minAmount: r.min_amount,
                address: r.address,
                status: r.status,
                pickupLocation: r.pickup_location,
              },
              ...prev,
            ]);
          } else if (payload.eventType === "UPDATE") {
            setRequests((prev) =>
              prev.map((item) =>
                item.id === payload.new.id
                  ? { ...item, status: payload.new.status as Status }
                  : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setRequests((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);
  };

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) { console.log("fetchRequests error:", error?.message); return; }

    if (data) {
      setRequests(data.map((r: any) => ({
        id: r.id,
        seller: r.seller,
        sellerId: r.seller_id,
        material: r.material,
        quantity: r.quantity,
        price: r.price,
        minAmount: r.min_amount,
        address: r.address,
        status: r.status,
        pickupLocation: r.pickup_location,
        contactNumber: r.contact_number,
      })));
    }
  };

  const acceptedRequests = useMemo(
    () => requests.filter((item) => item.status === "accepted"),
    [requests]
  );

  const addRequest = async (request: Omit<ScrapItem, "id" | "status">) => {
    if (!request.sellerId) {
      console.log("addRequest blocked: sellerId is empty");
      return;
    }

    const insertPayload: any = {
      seller: request.seller,
      seller_id: request.sellerId,
      material: request.material,
      quantity: request.quantity,
      price: request.price,
      min_amount: request.minAmount,
      address: request.address,
      pickup_location: request.pickupLocation,
      status: "pending",
    };

    if (request.contactNumber) {
      insertPayload.contact_number = request.contactNumber;
    }

    const { error } = await supabase
      .from("requests")
      .insert(insertPayload)
      .select()
      .single();

    if (error) { console.log("addRequest error:", error?.message); return; }
  };

  const updateStatus = async (id: string, newStatus: Status) => {
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    const { error } = await supabase
      .from("requests")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) {
      console.log("updateStatus error:", error?.message);
      setRequests((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "pending" } : item))
      );
    }
  };

  const deleteRequest = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const ownerId = user?.id || currentUserId;

    let request = supabase.from("requests").delete().eq("id", id);
    if (ownerId) {
      request = request.eq("seller_id", ownerId);
    }

    const { error } = await request;

    if (error) {
      console.log("deleteRequest error:", error?.message);
      Alert.alert("Delete failed", "Could not delete the request. Please try again.");
      return;
    }

    setRequests((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <MarketContext.Provider
      value={{
        requests,
        acceptedRequests,
        currentUserId,
        addRequest,
        updateStatus,
        deleteRequest,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error("useMarket must be used within MarketProvider");
  }
  return context;
}
