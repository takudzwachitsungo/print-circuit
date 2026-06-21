export interface CompanyStat {
  to: number;
  suffix: string;
  label: string;
}

export const COMPANY_STATS: CompanyStat[] = [
  { to: 4, suffix: "+", label: "Projects completed" },
  { to: 20, suffix: "+", label: "Clients served" },
  { to: 5, suffix: "", label: "Service lines" },
];
