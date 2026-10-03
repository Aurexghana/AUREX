"use client";

import { useEffect, useState } from "react";
import { getCountries, getCountryCallingCode, isValidPhoneNumber, type CountryCode } from "libphonenumber-js/min";
import { getCountryList, type Country } from "@/lib/countries";
import { isValidEmail } from "@/lib/validation";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import CustomSelect from "@/components/apply/CustomSelect";
import type { StepProps } from "@/components/apply/types";
import type { InvestorFormData } from "@/components/apply/investor/types";

type FieldName = "fullName" | "email" | "phoneNumber" | "countryOfResidence";

type PhoneCountryOption = { iso2: string; name: string; callingCode: string };

function getPhoneCountryOptions(): PhoneCountryOption[] {
  const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
  return getCountries()
    .map((iso2) => ({
      iso2,
      name: displayNames.of(iso2) ?? iso2,
      callingCode: getCountryCallingCode(iso2),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Step 1 of 6 - "Identity & Contact Details". Four required fields: full
 * legal name, email, phone (with country-code support, validated as a
 * real dialable number since it's used for WhatsApp contact later - see
 * the libphonenumber-js import), and country of residence.
 *
 * Validation is computed on every render from `values` (cheap: four field
 * checks, no need to memo further) and reported up via onValidityChange.
 * Errors only render once a field has been blurred (`touched`) - required-
 * field validation runs from the first keystroke, but nothing turns red
 * before the applicant has actually had a chance to fill it in.
 */
export default function IdentityContactStep({ values, updateValues, onValidityChange }: StepProps<InvestorFormData>) {
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    fullName: false,
    email: false,
    phoneNumber: false,
    countryOfResidence: false,
  });

  // Both lists are built with Intl.DisplayNames, and computing them during
  // the render (e.g. via useMemo) would run on the server too - where
  // Node's own bundled ICU/CLDR data can disagree with the browser's for a
  // handful of regions (observed: "Falkland Islands (Islas Malvinas)"
  // server-side vs "Falkland Islands" client-side), which is a genuine
  // hydration mismatch, not a bug in this component's logic. Populating
  // them from an effect means the server (and the client's first paint,
  // pre-hydration) render an empty list, then the browser's own Intl fills
  // it in right after mount - nothing for hydration to disagree about,
  // since the mismatched values never make it into the SSR'd HTML at all.
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [phoneCountryOptions, setPhoneCountryOptions] = useState<PhoneCountryOption[]>([]);

  useEffect(() => {
    // Deliberately setState-in-effect, not a "you might not need an
    // effect" case: computing this during render (even via a lazy
    // useState initializer) would run on the server too, which is the
    // hydration mismatch described above - the effect only exists to
    // skip that SSR execution, not to synchronize derived state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountryList(getCountryList());
    setPhoneCountryOptions(getPhoneCountryOptions());
  }, []);

  const errors: Record<FieldName, string | null> = {
    fullName: values.fullName.trim().length < 2 ? "Enter your full legal name." : null,
    email: !values.email.trim()
      ? "Enter your email address."
      : !isValidEmail(values.email)
        ? "Enter a valid email address."
        : null,
    phoneNumber: !values.phoneNumber.trim()
      ? "Enter your phone number."
      : !isValidPhoneNumber(values.phoneNumber, values.phoneCountry as CountryCode)
        ? "Enter a valid phone number for the selected country; this is used for WhatsApp contact."
        : null,
    countryOfResidence: !values.countryOfResidence ? "Select your country of residence." : null,
  };

  const isValid = Object.values(errors).every((error) => error === null);

  useEffect(() => {
    onValidityChange(isValid);
    // Only isValid should re-trigger this - onValidityChange is a stable
    // useCallback from the shell, and re-running on every `values` change
    // (rather than just when the derived isValid flips) would be wasteful.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  const markTouched = (field: FieldName) => setTouched((prev) => ({ ...prev, [field]: true }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Identity &amp; Contact Details</h1>
        <p className="font-sans text-sm text-cream-dim sm:text-base">
          Tell us who you are and how to reach you; we&apos;ll use this to verify your application and stay in
          touch.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <FormField label="Full Legal Name" htmlFor="fullName" error={touched.fullName ? errors.fullName : null}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            value={values.fullName}
            onChange={(e) => updateValues({ fullName: e.target.value })}
            onBlur={() => markTouched("fullName")}
            placeholder="Osman Zakaria"
            className={fieldClassName(touched.fullName && !!errors.fullName)}
          />
        </FormField>

        <FormField label="Email Address" htmlFor="email" error={touched.email ? errors.email : null}>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={(e) => updateValues({ email: e.target.value })}
            onBlur={() => markTouched("email")}
            placeholder="osman.zakaria@aurexgh.com"
            className={fieldClassName(touched.email && !!errors.email)}
          />
        </FormField>

        <FormField
          label="Phone Number"
          htmlFor="phoneNumber"
          error={touched.phoneNumber ? errors.phoneNumber : null}
          hint="Used for WhatsApp contact during your application."
        >
          <div className="flex gap-2">
            <CustomSelect
              ariaLabel="Phone country code"
              value={values.phoneCountry}
              onChange={(value) => updateValues({ phoneCountry: value })}
              // Options are populated client-side after mount (see the
              // effect above); CustomSelect falls back to showing the raw
              // value until then, same as the old fallback <option> did.
              options={phoneCountryOptions.map((c) => ({ value: c.iso2, label: `${c.name} (+${c.callingCode})` }))}
              hasError={touched.phoneNumber && !!errors.phoneNumber}
              size="compact"
              wrapperClassName="shrink-0"
              // Narrower below sm and widens from sm so the full "Name
              // (+code)" label still fits once there's room.
              triggerClassName="w-[104px] pr-7 sm:w-[168px]"
            />
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              autoComplete="tel-national"
              value={values.phoneNumber}
              onChange={(e) => updateValues({ phoneNumber: e.target.value })}
              onBlur={() => markTouched("phoneNumber")}
              placeholder="24 111 2233"
              className={fieldClassName(touched.phoneNumber && !!errors.phoneNumber, "min-w-0 flex-1")}
            />
          </div>
        </FormField>

        <FormField
          label="Country of Residence"
          htmlFor="countryOfResidence"
          error={touched.countryOfResidence ? errors.countryOfResidence : null}
        >
          <CustomSelect
            id="countryOfResidence"
            value={values.countryOfResidence}
            onChange={(value) => updateValues({ countryOfResidence: value })}
            onBlur={() => markTouched("countryOfResidence")}
            options={countryList.map((c) => ({ value: c.code, label: c.name }))}
            placeholder="Select your country"
            hasError={touched.countryOfResidence && !!errors.countryOfResidence}
            triggerClassName="w-full"
          />
        </FormField>
      </div>
    </div>
  );
}
