import { apiFetch } from "@/lib/api/client";
import { cachedInBrowser } from "@/lib/browserCache";

export type SiteContact = {
  whatsappNumber: string | null;
  contactEmail: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
};

type SiteContactApiRow = {
  whatsapp_number: string | null;
  contact_email: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
};

function toSiteContact(row: SiteContactApiRow): SiteContact {
  return {
    whatsappNumber: row.whatsapp_number,
    contactEmail: row.contact_email,
    facebookUrl: row.facebook_url,
    twitterUrl: row.twitter_url,
    linkedinUrl: row.linkedin_url,
  };
}

const EMPTY: SiteContact = {
  whatsappNumber: null,
  contactEmail: null,
  facebookUrl: null,
  twitterUrl: null,
  linkedinUrl: null,
};

function hasAnyValue(contact: SiteContact): boolean {
  return Boolean(
    contact.whatsappNumber || contact.contactEmail || contact.facebookUrl || contact.twitterUrl || contact.linkedinUrl,
  );
}

async function fetchVersion(): Promise<string> {
  const { data } = await apiFetch<{ updated_at: string }>("/site-contact/version");
  return data.updated_at;
}

export async function getSiteContact(): Promise<SiteContact> {
  try {
    return await cachedInBrowser(
      "site-contact",
      async () => {
        const { data } = await apiFetch<SiteContactApiRow>("/site-contact");
        return toSiteContact(data);
      },
      { getVersion: fetchVersion, isCacheable: hasAnyValue },
    );
  } catch {
    return EMPTY;
  }
}
