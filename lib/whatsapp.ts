import { apiFetch } from "@/lib/api/client";

export async function getSuperAdminWhatsAppNumber(): Promise<string | null> {
  try {
    const { data } = await apiFetch<{ phone: string | null }>("/admins/whatsapp-contact");
    return data.phone;
  } catch {
    return null;
  }
}

function toWaMeLink(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function getSlotWhatsAppLink(phone: string, slotDescription: string): string {
  return toWaMeLink(phone, `Hi AUREX, I'd like to invest in: ${slotDescription}.`);
}

export function getListingChangeRequestWhatsAppLink(phone: string, businessName: string): string {
  return toWaMeLink(phone, `Hi AUREX, I'd like to request a change to my business listing: ${businessName}.`);
}
