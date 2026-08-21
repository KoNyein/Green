const RAW_URL_PATTERN = /https?:\/\/[^\s)]+/gi;

/**
 * Keep the useful imported record text public while removing raw provenance URLs.
 * Public readers still see that a source/reference exists, but not the upstream URL.
 */
export function sanitizePublicStrainText(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(RAW_URL_PATTERN, "[source reference withheld]")
    .replace(/\bSource:\s*\[source reference withheld\]/gi, "Source: source reference withheld")
    .replace(/\bsource knowledge dataset at\s*\[source reference withheld\]/gi, "the imported source knowledge dataset")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function sanitizePublicStrainRecord<T extends {
  verifiedFacts: string;
  supplierDescription: string;
  educationalNote: string;
  legalNotice: string;
  cannabinoidSource: string | null;
  effectSource: string | null;
}>(record: T): T {
  return {
    ...record,
    verifiedFacts: sanitizePublicStrainText(record.verifiedFacts),
    supplierDescription: sanitizePublicStrainText(record.supplierDescription),
    educationalNote: sanitizePublicStrainText(record.educationalNote),
    legalNotice: sanitizePublicStrainText(record.legalNotice),
    cannabinoidSource: record.cannabinoidSource ? sanitizePublicStrainText(record.cannabinoidSource) : null,
    effectSource: record.effectSource ? sanitizePublicStrainText(record.effectSource) : null,
  } as T;
}
