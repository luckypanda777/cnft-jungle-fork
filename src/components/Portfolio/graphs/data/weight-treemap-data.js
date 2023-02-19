// ===========================|| DASHBOARD - TOTAL GROWTH BAR CHART ||=========================== //

import { nFormatter } from 'utils/formatCurrency';
import { shorten } from 'utils/shorten';

const chartData = ({ router, data }) => {
  const onClick = (e, collection) => {
    const link = `/collections/${collection?.policy}`;
    if (e.metaKey) {
      return window.open(link, '_blank');
    }

    if (collection) {
      void router.push(link);
    }
  };

  return {
    height: 223,
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
          useFillColorAsStroke: true,
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 500,
                color: '#b39ddb',
              },
              {
                from: 500,
                to: 1000,
                color: '#a184d6',
              },
              {
                from: 1000,
                to: 5000,
                color: '#7243ca',
              },
              {
                from: 5000,
                to: 50000,
                color: '#6a33cf',
              },
              {
                from: 50000,
                to: 10000000,
                color: '#69249e',
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
        // custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        //   var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        //   return (
        //     '<div style="display:flex;justify-content:center;align-items:center;flex-direction:column; background: #1f243f; row-gap:10px; padding: 10px;">' +
        //     `<img src='${data.image}' alt='asset' style="width: 150px;" />` +
        //     `<div style="width: 150px; word-break: break-word;">${data.x}</div>` +
        //     `<div style="width: 150px;">Total worth: ₳${data.y}</div>` +
        //     '</div>'
        //   );
        // },
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
            x: shorten(item.collection_name, 25) || '0',
            y: item.inflated_value || '0',
            image: item.image,
            policy: item.policy,
            id: item.id,
          }))
          .sort((a, b) => b.y - a.y),
      },
    ],
  };
};

export default chartData;
