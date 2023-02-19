import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

var options = ({ range, data, type }) => ({
  series: [{ data }],
  options: {
    chart: {
      id: 'realtime',
      height: 350,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: ['var(--fontColor)'],
      },
    },
    stroke: {
      curve: 'smooth',
    },
    tooltip: {
      theme: 'dark',
    },
    markers: {
      size: 0,
    },
    colors: ['var(--primaryColor)', '#757575'],
    xaxis: {
      labels: {
        style: {
          colors: 'var(--fontColor)',
        },
      },
      range,
      type: 'datetime',
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--fontColor)',
        },
        labels: {
          formatter: (val) => val.toFixed(0),
        },
      },
    },
    legend: {
      show: false,
      style: {
        colors: ['var(--fontColor)'],
      },
    },
  },
});

const TIME_RANGE_IN_MILLISECONDS = 30 * 1000;
const ADDING_DATA_INTERVAL_IN_MILLISECONDS = 5000;
const ADDING_DATA_RATIO = 0.5;

const RealtimeChart = ({ type }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => [
        ...prev,
        {
          x: new Date(),
          y: Math.floor(Math.random() * 100) + 10,
        },
      ]);
    }, ADDING_DATA_INTERVAL_IN_MILLISECONDS);

    return () => clearInterval(interval);
  }, []);

  return (
    <Chart {...options({ data, range: TIME_RANGE_IN_MILLISECONDS, type })} />
  );
};

export default RealtimeChart;
