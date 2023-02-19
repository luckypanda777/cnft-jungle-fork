// ===========================|| DASHBOARD - TOTAL GROWTH BAR CHART ||=========================== //

import { nFormatter } from 'utils/formatCurrency';
import { shorten } from 'utils/shorten';

const treemapData = ({ router, data }) => {
  const onClick = (e, data) => {
    const link = `https://pool.pm/${data.x}`;

    return window.open(link, '_blank');
  };

  return {
    height: 400,
    type: 'treemap',
    width: '100%',
    options: {
      chart: {
        id: 'bar-chart',
        width: '100%',
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
        },
        events: {
          dataPointMouseEnter: function (event) {
            event.path[0].style.cursor = 'pointer';
          },
          dataPointMouseLeave: function (event) {
            return;
          },
          dataPointSelection: (event, chartContext, config) => {
            const data =
              config.w.config.series[config.seriesIndex].data[
                config.dataPointIndex
              ];
            onClick(event, data);
          },
        },
        grid: {
          show: false,
          padding: {
            left: 15,
            right: 15,
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        treemap: {
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 1,
                color: '#2196F3',
              },
              {
                from: 1,
                to: 2,
                color: '#FE938C',
              },
              {
                from: 2,
                to: 5,
                color: '#7a0a39',
              },
              {
                from: 5,
                to: 10,
                color: 'var(--primaryColor)',
              },
              {
                from: 10,
                to: 10000,
                color: 'var(--logoColor)',
              },
            ],
          },
        },
      },
      legend: {
        show: true,
        fontSize: '16px',
        fontFamily: 'newgilroymedium',
        labels: {
          useSeriesColors: false,
        },
        markers: {
          width: 16,
          height: 16,
          radius: 5,
        },
        itemMargin: {
          horizontal: 15,
          vertical: 8,
        },
      },
      grid: {
        show: false,
      },
      tooltip: {
        followCursor: false,
        fixed: {
          enabled: true,
          position: 'topLeft',
          offsetX: -50,
          offsetY: -150,
        },
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          return (
            '<div style="display:flex;justify-content:center;align-items:center;flex-direction:column; background: #1f243f; row-gap:10px; padding: 10px;">' +
            `<div style="width: 300px; word-break: break-word;">${data.x}</div>` +
            `<div style="width: 300px;">Assets held: ${data.y}</div>` +
            '</div>'
          );
        },
        theme: 'dark',
        y: {
          formatter: (value) => {
            return '₳' + value.toLocaleString();
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
    },
    series: [
      {
        data: data
          .map((item, index) => ({
            x: item.stake || '',
            y: item.value || '0',
            image: item.image,
            id: item.id,
          }))
          .sort((a, b) => b.y - a.y),
      },
    ],
  };
};

export default treemapData;
