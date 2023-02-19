import moment from 'moment';
import { colors } from './graph-constants';

const optionsArea = ({ id, name, series }) => {
  return {
    height: 400,
    type: 'area',
    options: {
      chart: {
        id,
        height: 400,
        type: 'area',
        offsetY: 39,
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
            chart: {
              width: 325,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: false,
          },
        },
      },
      stroke: {
        curve: 'smooth',
      },
      colors,
      fill: {
        type: 'gradient',
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
          distributed: true,
        },
      },
      markers: {
        size: 0,
        style: 'hollow',
        strokeWidth: 8,
        strokeColor: 'var(--fontColor)',
        strokeOpacity: 0.25,
        color: 'var(--fontColor)',
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
      yaxis: {
        show: true,
        tooltip: {
          enabled: false,
        },
        labels: {
          style: {
            colors: 'var(--fontColor)',
          },
        },
      },
      tooltip: {
        theme: 'dark',
        fixed: {
          enabled: false,
        },
        x: {
          show: false,
        },
        y: {
          formatter: (value) => {
            return '₳' + value.toLocaleString();
          },
        },
        marker: {
          show: true,
        },
      },
      xaxis: {
        type: 'datetime',
        tooltip: {
          enabled: false,
        },
        labels: {
          style: {
            colors: 'var(--fontColor)',
          },
        },
      },
      legend: {
        offsetY: 0,
        position: 'top',
        horizontalAlign: 'center',
        labels: {
          colors: ['var(--fontColor)'],
        },
        showForNullSeries: false,
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
    },
    series,
  };
};

export default optionsArea;
