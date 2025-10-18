export type User = {
  id: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: number;
  emailHash: string;
  signature: string;
};

export type CountCreateByDay = { day: string; count: number };
