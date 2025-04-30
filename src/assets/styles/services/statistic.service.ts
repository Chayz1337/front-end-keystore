import { instanse } from '../api/api.interceptor';

const STATISTICS = 'admin/statistics';

export type StatisticsItem = {
  id?: number;
  name: string;
  value: number | null;
};

export const StatisticService = {
  async main(): Promise<StatisticsItem[]> {
    const response = await instanse<StatisticsItem[]>({
      url: `${STATISTICS}/main`,
      method: 'GET',
    });
    return response.data; // теперь без .data
  },
};
