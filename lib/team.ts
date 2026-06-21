export interface TeamMember {
  name: string;
  role: string;
  /** One-line bio in company voice. */
  bio: string;
}

/** Real team members only (no placeholder Tech001/002 names from the old site).
    Bios are role-level and honest — adjust wording as the team confirms it.
    TODO: add the Social Media Manager once their name is confirmed. */
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
];
