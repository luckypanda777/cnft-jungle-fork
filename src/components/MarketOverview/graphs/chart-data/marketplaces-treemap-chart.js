// ===========================|| DASHBOARD - TOTAL GROWTH BAR CHART ||=========================== //

const chartData = (navigateToCollection = () => {}) => ({
  height: 300,
  type: 'treemap',
  options: {
    chart: {
      id: 'bar-chart',
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
          // const data =
          //   config.w.config.series[config.seriesIndex].data[
          //     config.dataPointIndex
          //   ];
          // navigateToCollection(data.id);
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
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '30px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

        return (
          '<div style="display:flex;justify-content:center;align-items:center;flex-direction:column; background: #1f243f">' +
          `<img src='${data.image}' alt='asset' style="width: 100px;" />` +
          '</div>'
        );
      },
    },
  },
  series: [
    {
      data: [90, 6, 4, 3, 2, 1, 0.5, 0.5, 0.5, 0.3, 0.2]
        .map((el, i) => ({
          x: `Marketplace - ${el}%`,
          y: el,
          image:
            'https://cnft.tools/static/assets/projectthumbs/spacebudz/3827.png',
          link: 'example.com',
          id: i,
        }))
        .sort((a, b) => b.y - a.y),
    },
  ],
});

export default chartData;
