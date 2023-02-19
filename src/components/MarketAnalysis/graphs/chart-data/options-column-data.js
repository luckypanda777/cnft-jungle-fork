import { capitalize } from '@mui/material';
import moment from 'moment';
import { shorten } from 'utils/shorten';
import { colors } from './graph-constants';

const optionsColumn = ({ id, name, series = [], interval = 'daily' }) => {
  return {
    type: 'bar',
    height: 400,
    series: [{ data: series.map((x) => x.volume) }],
    options: {
      chart: {
        id,
        // group: 'volumes',
        height: 400,
        type: 'bar',
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
          breakpoint: 600,
          options: {
            chart: { width: 325 },
            legend: { position: 'bottom' },
          },
        },
      ],
      colors,
      tooltip: {
        theme: 'dark',
        fixed: {
          enabled: false,
        },
        y: {
          formatter: (value) => {
            return '₳' + value.toLocaleString();
          },
          title: { formatter: () => capitalize(interval) + ' Volume' },
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
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        labels: {
          style: {
            colors: 'var(--fontColor)',
          },
        },
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
        show: false,
      },
      xaxis: {
        categories: series.map((x) => shorten(x.collection, 22)),
        labels: {
          style: {
            colors,
            fontSize: '12px',
          },
        },
      },
    },
  };
};

export default optionsColumn;
