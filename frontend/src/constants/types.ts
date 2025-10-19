export interface UserDayStat {
  day: string;
  count: number;
}

export interface UserStatsResponse {
  success: boolean;
  message: string;
  data: UserDayStat[];
  meta: { timestamp: string };
}
