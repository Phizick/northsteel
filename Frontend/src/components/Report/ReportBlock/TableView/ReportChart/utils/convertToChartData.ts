import { TableResponse } from "../../../../../../api/models/MarketReport.ts";
import { ChartOptions } from "../types";

export const convertToChartData = (
  block: TableResponse,
  options: ChartOptions,
) => {
  const chartData: { [key: string]: string | number }[] = [];
  let points: string[] = [];

  if (Object.keys(block.data[0]).some((key) => key === "Показатель")) {
    const filterData = block.data.filter(
      (elem) => elem["Показатель"] === options.indicator,
    );

    if (options.by === "Период") {
      block.periods.forEach((period) => {
        const cur: { [key: string]: string | number } = {
          Период: period,
        };

        filterData.forEach((item) => {
          cur[item[options.points as string] as string] = executeNumber(
            item[period] as string,
          );
        });

        chartData.push(cur);
      });

      points = [...block.groups];
    } else {
      block.groups.forEach((group) => {
        const cur: { [key: string]: string | number } = {
          [options.by]: group,
        };

        filterData.forEach((item) => {
          if (item[options.by] === group) {
            for (let prop in item) {
              if (block.periods.includes(prop)) {
                cur[prop] = executeNumber(item[prop] as string);
              }
            }
          }
        });

        chartData.push(cur);
      });

      points = [...block.periods];
    }

    return { chartData, points };
  }

  const a = block.data.map((elem) => {
    const newElem: { [key: string]: string | number } = {};
    for (let prop in elem) {
      if (prop === options.by) {
        newElem[prop] = elem[prop] as string;
      } else {
        newElem[prop] = executeNumber(elem[prop] as string);
      }
    }

    return newElem;
  });

  return { chartData: a, points: options.multiIndicator };
};

const executeNumber = (str: string) => {
  return +/\d+/.exec(str)!;
};
