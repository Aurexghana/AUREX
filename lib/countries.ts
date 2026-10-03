import { getCountries } from "libphonenumber-js/min";

/**
 * Country list for "Country of residence" dropdowns. Built from
 * libphonenumber-js's own country registry (already a dependency for
 * phone validation - see components/apply/investor/IdentityContactStep.tsx)
 * paired with Intl.DisplayNames for human-readable names, rather than a
 * hand-maintained ~195-row array.
 *
 * Note: `Intl.supportedValuesOf` cannot be used for this - despite the
 * name, its only valid keys are "calendar" | "collation" | "currency" |
 * "numberingSystem" | "timeZone" | "unit"; it has no "region"/country
 * option, so there's no built-in way to enumerate countries without
 * either a data source like this or a hardcoded list.
 */
export type Country = { code: string; name: string };

let cached: Country[] | null = null;

export function getCountryList(): Country[] {
  if (cached) return cached;

  const displayNames = new Intl.DisplayNames(["en"], { type: "region" });

  cached = getCountries()
    .map((code) => ({ code, name: displayNames.of(code) ?? code }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return cached;
}
