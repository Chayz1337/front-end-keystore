import { FC } from "react";
import { useQuery } from "@tanstack/react-query";

import Heading from "../components/ui/button/Heading";
import Loader from "../components/ui/Loader";
import { convertPrice } from "../utils/convertPrice";
import { StatisticService, StatisticsItem } from "../assets/styles/services/statistic.service";

import styles from './Dashboard.module.scss';

const Dashboard: FC = () => {
  const { data = [], isFetching } = useQuery<StatisticsItem[], Error>({
    queryKey: ['statistics'],
    queryFn: StatisticService.main,
    initialData: [],
  });

  if (isFetching) return <Loader />;
  if (!data || data.length === 0) return <div>Статистика не загружена или пуста!</div>;

  const formatValue = (value: number | null, isCurrency = false) => {
    if (value === null) return <span className="text-gray-500">Нет данных</span>;
    return isCurrency ? convertPrice(value) : +value.toFixed(2);
  };

  return (
    <>
      <Heading classname="mb-8">Dashboard</Heading>
      <div className={styles.wrapper}>
  {data.map((item, index) => {
    const isCurrency = item.name.toLowerCase().includes("прибыль") || item.name.toLowerCase().includes("чек");
    return (
      <div
        key={item.name}
        className={styles.item}
        style={{ animationDelay: `${0.3 * (index + 1)}s` }}
      >
        <div>{item.name}</div>
        <div>
          {item.value === null ? (
            <span className="text-gray-500">Нет данных</span>
          ) : (
            isCurrency ? convertPrice(item.value) : +item.value.toFixed(2)
          )}
        </div>
      </div>
    );
  })}
</div>
    </>
  );
};

export default Dashboard;
