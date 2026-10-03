import { apiFetch } from "@/lib/api/client";
import { cachedInBrowser } from "@/lib/browserCache";

export type Testimonial = {
  quote: string;
  initials: string;
  title: string;
};

type TestimonialApiRow = {
  quote: string;
  author_initials: string;
  author_title: string;
};

function toTestimonial(row: TestimonialApiRow): Testimonial {
  return {
    quote: row.quote,
    initials: row.author_initials,
    title: row.author_title,
  };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await cachedInBrowser("testimonials", async () => {
      const { data } = await apiFetch<TestimonialApiRow[]>("/testimonials");
      return data.map(toTestimonial);
    });
  } catch {
    return [];
  }
}
