import { getSiteContact } from "@/lib/siteContact";

export async function getWhatsAppNumber(): Promise<string | null> {
  const { whatsappNumber } = await getSiteContact();
  return whatsappNumber;
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
