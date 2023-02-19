import { capitalize } from '@mui/material';
import moment from 'moment';
import { shorten } from 'utils/shorten';
import { colors } from './graph-constants';

const optionsColumn = ({ id, name, series, interval = 'daily' }) => {
  // sort series object by value in descending order
  const sortedSeries = series
    ? Object.entries(series)
        .sort((a, b) => {
          return b[1] - a[1];
        })
        .map(([key, value]) => {
          return {
            x: key,
            y: value,
          };
        })
    : [];

  return {
    type: 'polarArea',
    height: 410,
    series: sortedSeries.map((s) => s.y),
    options: {
      chart: {
        id,
        // group: 'volumes',
        height: 400,
        type: 'polarArea',
        title: capitalize(interval) + 'Volume',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      responsive: [
        {
          breakpoint: 900,
          options: {
            chart: { width: 325, height: 700 },
            legend: { position: 'bottom' },
          },
        },
      ],
      colors,
      tooltip: {
        followCursor: true,
        theme: 'dark',
        fixed: {
          enabled: false,
        },
        fillSeriesColor: false,
        y: {
          formatter: (value) => {
            return '₳' + value.toLocaleString();
          },
          title: { formatter: () => capitalize(interval) + ' Volume Share' },
        },
      },
      fill: {
        type: 'solid',
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.9,
          opacityTo: 0.6,
          stops: [0, 100, 100, 100],
        },
      },
      dataLabels: {
        enabled: true,
      },
      noData: {
        text: 'No data available',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: -40,
        style: {
          color: 'var(--fontColor)',
          fontSize: '22px',
          fontFamily: 'newgilroymedium',
        },
      },
      legend: {
        show: true,
        labels: {
          colors: 'var(--fontColor)',
        },
      },
      labels: sortedSeries.map(
        (s) =>
          shorten(s.x, 25) +
          ': ' +
          (
            (s.y / sortedSeries.reduce((acc, cur) => acc + cur.y, 0)) *
            100
          ).toFixed(2) +
          '%' +
          ` (₳${s.y.toLocaleString()})`
      ),
      xaxis: {
        show: false,
      },
      yaxis: {
        show: false,
      },
      grid: {
        show: false,
        padding: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
        },
      },
    },
  };
};

export default optionsColumn;
