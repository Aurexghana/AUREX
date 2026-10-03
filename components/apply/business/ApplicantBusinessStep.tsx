"use client";

import { useEffect, useState } from "react";
import { getCountries, getCountryCallingCode, isValidPhoneNumber, type CountryCode } from "libphonenumber-js/min";
import { getCountryList, type Country } from "@/lib/countries";
import { isValidEmail } from "@/lib/validation";
import { FUNDING_RANGE_OPTIONS } from "@/lib/fundingRange";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import CustomSelect from "@/components/apply/CustomSelect";
import type { StepProps } from "@/components/apply/types";
import type { BusinessOwnerFormData } from "@/components/apply/business/types";

type FieldName =
  | "fullName"
  | "businessName"
  | "email"
  | "phoneNumber"
  | "countryOfOperation"
  | "businessDescription"
  | "fundingAmount";

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

// "A few sentences" per the brief - not enforced strictly, just enough of
// a floor that "N/A" or a single word can't pass as a real business pitch.
const MIN_DESCRIPTION_LENGTH = 30;

/**
 * Step 1 of 6 - "Applicant & Business Details". The Business Owner flow's
 * equivalent of the Investor flow's IdentityContactStep, with the same
 * name/email/phone/country pattern (identical validation approach,
 * including the same Intl-hydration-mismatch deferral for the country
 * lists - see that file's own comment) plus three business-specific
 * fields: business name, a short pitch (description + funding purpose),
 * and the funding amount sought.
 */
export default function ApplicantBusinessStep({
  values,
  updateValues,
  onValidityChange,
}: StepProps<BusinessOwnerFormData>) {
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    fullName: false,
    businessName: false,
    email: false,
    phoneNumber: false,
    countryOfOperation: false,
    businessDescription: false,
    fundingAmount: false,
  });

  const [countryList, setCountryList] = useState<Country[]>([]);
  const [phoneCountryOptions, setPhoneCountryOptions] = useState<PhoneCountryOption[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountryList(getCountryList());
    setPhoneCountryOptions(getPhoneCountryOptions());
  }, []);

  const errors: Record<FieldName, string | null> = {
    fullName: values.fullName.trim().length < 2 ? "Enter your full legal name." : null,
    businessName: values.businessName.trim().length < 2 ? "Enter your business name." : null,
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
    countryOfOperation: !values.countryOfOperation ? "Select the country your business operates in." : null,
    businessDescription:
      values.businessDescription.trim().length < MIN_DESCRIPTION_LENGTH
        ? "Tell us a bit more: a few sentences on what your business does and what the funding is for."
        : null,
    fundingAmount: !values.fundingAmount ? "Select the amount of funding you're seeking." : null,
  };

  const isValid = Object.values(errors).every((error) => error === null);

  useEffect(() => {
    onValidityChange(isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  const markTouched = (field: FieldName) => setTouched((prev) => ({ ...prev, [field]: true }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Applicant &amp; Business Details</h1>
        <p className="font-sans text-sm text-cream-dim sm:text-base">
          Tell us about you and your business; we&apos;ll use this to verify your application and stay in touch.
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

        <FormField
          label="Business Name"
          htmlFor="businessName"
          error={touched.businessName ? errors.businessName : null}
        >
          <input
            id="businessName"
            name="businessName"
            type="text"
            required
            autoComplete="organization"
            value={values.businessName}
            onChange={(e) => updateValues({ businessName: e.target.value })}
            onBlur={() => markTouched("businessName")}
            placeholder="Acme Foods Ltd."
            className={fieldClassName(touched.businessName && !!errors.businessName)}
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
            placeholder="osman.zakaria@acmefoods.com"
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
              options={phoneCountryOptions.map((c) => ({ value: c.iso2, label: `${c.name} (+${c.callingCode})` }))}
              hasError={touched.phoneNumber && !!errors.phoneNumber}
              size="compact"
              wrapperClassName="shrink-0"
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
          label="Country of Business Operation"
          htmlFor="countryOfOperation"
          error={touched.countryOfOperation ? errors.countryOfOperation : null}
        >
          <CustomSelect
            id="countryOfOperation"
            value={values.countryOfOperation}
            onChange={(value) => updateValues({ countryOfOperation: value })}
            onBlur={() => markTouched("countryOfOperation")}
            options={countryList.map((c) => ({ value: c.code, label: c.name }))}
            placeholder="Select a country"
            hasError={touched.countryOfOperation && !!errors.countryOfOperation}
            triggerClassName="w-full"
          />
        </FormField>

        <FormField
          label="Business Description & Funding Purpose"
          htmlFor="businessDescription"
          error={touched.businessDescription ? errors.businessDescription : null}
          hint="A few sentences on what your business does and what this funding will be used for."
        >
          <textarea
            id="businessDescription"
            name="businessDescription"
            required
            rows={4}
            value={values.businessDescription}
            onChange={(e) => updateValues({ businessDescription: e.target.value })}
            onBlur={() => markTouched("businessDescription")}
            placeholder="Acme Foods packages and distributes locally-grown produce across Accra. This funding would go toward a second cold-storage facility to serve two new markets."
            className={fieldClassName(touched.businessDescription && !!errors.businessDescription, "min-h-28 resize-y")}
          />
        </FormField>

        <FormField
          label="Amount of Funding Sought"
          htmlFor="fundingAmount"
          error={touched.fundingAmount ? errors.fundingAmount : null}
        >
          <CustomSelect
            id="fundingAmount"
            value={values.fundingAmount}
            onChange={(value) => updateValues({ fundingAmount: value })}
            onBlur={() => markTouched("fundingAmount")}
            options={FUNDING_RANGE_OPTIONS}
            placeholder="Select a range"
            hasError={touched.fundingAmount && !!errors.fundingAmount}
            triggerClassName="w-full"
          />
        </FormField>
      </div>
    </div>
  );
}
