export interface TeamMember {
  name: string;
  role: string;
  /** One-line bio in company voice. */
  bio: string;
}

/** Seeded with verified people only. Append real teammates here as they are
    confirmed — never placeholder names (we are removing the old Tech001/Tech002 style). */
export const TEAM: TeamMember[] = [
  {
    name: "Takudzwa Chitsungo",
    role: "Founder & Lead Designer",
    bio: "Founded Print Circuit to bring sharp, modern design and dependable printing to Harare's businesses.",
  },
];
