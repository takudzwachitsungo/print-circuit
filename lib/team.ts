export interface TeamMember {
  name: string;
  role: string;
  /** One-line bio in company voice. */
  bio: string;
}

/** Real team members only (no placeholder Tech001/002 names from the old site).
    Bios are role-level and honest — adjust wording as the team confirms it. */
export const TEAM: TeamMember[] = [
  {
    name: "Tinotenda",
    role: "IT Technician",
    bio: "Keeps our machines, network and digital workflow running so jobs move smoothly from file to finished.",
  },
  {
    name: "Percival",
    role: "Graphic Designer",
    bio: "Turns briefs into clean, on-brand artwork that works across print and screen.",
  },
  {
    name: "Takudzwa Chitsungo",
    role: "Web Developer",
    bio: "Builds and maintains our website and the digital tools behind the studio.",
  },
  {
    name: "Audrey Sithole",
    role: "Social Media Manager",
    bio: "Runs our social channels and keeps the Print Circuit brand active where customers are.",
  },
];
