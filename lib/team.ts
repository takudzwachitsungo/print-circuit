export interface TeamMember {
  name: string;
  role: string;
  /** One-line bio in company voice. */
  bio: string;
  /** Headshot filename under /public/team/ (e.g. "audrey.jpg"). Resolved at
      build time — gradient avatar shown when the file isn't present. */
  photo?: string;
}

/** Real team members only (no placeholder Tech001/002 names from the old site).
    Bios are role-level and honest — adjust wording as the team confirms it.
    Photos are from the old site (printcircuit.co.zw). */
export const TEAM: TeamMember[] = [
  {
    name: "Moses Mukudu",
    role: "IT Technician",
    bio: "Keeps our machines, network and digital workflow running so jobs move smoothly from file to finished.",
    photo: "moses.jpg",
  },
  {
    name: "Percival Kufamusarira",
    role: "Graphic Designer",
    bio: "Turns briefs into clean, on-brand artwork that works across print and screen.",
    photo: "percival.jpg",
  },
  {
    name: "Takudzwa Chitsungo",
    role: "Web Developer",
    bio: "Builds and maintains our website and the digital tools behind the studio.",
    photo: "takudzwa.jpg",
  },
  {
    name: "Audrey Sithole",
    role: "Social Media Manager",
    bio: "Runs our social channels and keeps the Print Circuit brand active where customers are.",
    photo: "audrey.jpg", // drop public/team/audrey.jpg to show her headshot
  },
];
