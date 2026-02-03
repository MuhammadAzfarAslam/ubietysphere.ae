import { SERVICE_CONTENT } from "./serviceContent";

export const DOCTOR_CATEGORIES = Object.values(SERVICE_CONTENT).map((s) => s.title);


export const DISCIPLINE_CATEGORIES = [
  "Consultant Physician",
  "Specialist Physician",
  "Pediatrician",
  "Obstetrician-Gynecologist",
  "Reproductive Medicine Consultant",
  "Endocrinologist",
  "Family Medicine Practitioner",
  "Functional Medicine Practitioner",
  "Psychiatrist",
  "Immunologist",
  "Longevity Consultant",
  "General Practitioner",
  "Healthcare Consultant",
  "Lifestyle Coach",
  "Clinical Psychologist",
  "Mental Health Counsellor",
  "Nutritionist",
  "Dietitian",
  "Genetics Counsellor",
  "Nurse"
];
