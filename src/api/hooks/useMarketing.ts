import { useMutation } from "@tanstack/react-query";
import { marketingApi } from "../marketing";
import type { DemoRequestInput, LeadMagnetInput } from "../types";

export function useRequestDemo() {
  return useMutation({
    mutationFn: (payload: DemoRequestInput) => marketingApi.requestDemo(payload),
  });
}

export function useLeadMagnet() {
  return useMutation({
    mutationFn: (payload: LeadMagnetInput) => marketingApi.downloadLeadMagnet(payload),
  });
}