export const CAREER_UPLOAD_FIELDS = [
  { key: "cv", label: "CV / resume" },
  { key: "coverLetter", label: "Cover letter" },
  { key: "passportPhoto", label: "Passport photo" },
  { key: "nationalId", label: "National ID card" },
] as const;

export type CareerUploadField = (typeof CAREER_UPLOAD_FIELDS)[number]["key"];

export const CAREER_UPLOAD_ACCEPT = ".pdf,.png,.jpg,.jpeg,.docx";
export const CAREER_UPLOAD_MAX_FILE_BYTES = 5 * 1024 * 1024;
export const CAREER_UPLOAD_MAX_TOTAL_BYTES = 20 * 1024 * 1024;

export const CAREER_ALLOWED_FILE_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
