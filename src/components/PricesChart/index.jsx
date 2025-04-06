/**
 * Module dependencies.
 */

import * as utils from '@services/utils';
import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTranslation } from 'react-i18next';

/**
 * Function `PriceChart`.
 */

// eslint-disable-next-line react/prop-types
function PricesChart({ data }) {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeLS = localStorage.getItem('site-dark-mode');

    if (darkModeLS !== null) {
      setIsDarkMode(JSON.parse(darkModeLS));
    }
  }, []);

  const createChartData = (prices) => {
    const chartData = [];
    const uniqueDates = new Set();
    const average = parseFloat(utils.getAveragePrice(prices));

    if (prices) {
      prices.forEach((value) => {
        const date = new Date(value.date);

        if (!uniqueDates.has(date.toISOString())) {
          uniqueDates.add(date.toISOString());

          chartData.push([date, parseFloat(utils.getFormattedPrice(value)), average]);
        }
      });

      // Sort chartData based on dates
      chartData.sort((first, second) => first[0] - second[0]);
    }

    return chartData;
  };

  const chartData = createChartData(data);

  return (
    <LineChart
      height={250}
      series={[
        {
          color: 'red',
          connectNulls: true,
          curve: 'linear',
          data: chartData.map((point) => point[2]),
          label: t('data.product-titles.price-avg'),
          showMark: false
        },
        {
          color: isDarkMode ? 'white' : 'black',
          connectNulls: true,
          curve: 'linear',
          data: chartData.map((point) => point[1]),
          label: t('data.product-fields.regular-price'),
          showMark: false
        }
      ]}
      xAxis={[
        {
          data: chartData.map((point) => point[0]),
          scaleType: 'time'
        }
      ]}
    />
  );
}

/**
 * Export `PricesChart`.
 */

export default PricesChart;
