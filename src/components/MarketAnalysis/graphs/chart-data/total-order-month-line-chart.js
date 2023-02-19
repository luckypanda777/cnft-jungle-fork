// ===========================|| DASHBOARD - TOTAL ORDER MONTH CHART ||=========================== //

const chartData = {
  type: 'line',
  height: 90,
  options: {
    id: 'genderplot',
    chart: {
      sparkline: {
        enabled: true,
      },
      group: 'overview',
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#fff'],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    yaxis: {
      show: false,
      min: 0,
      max: 100,
      labels: {
        show: false,
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
        title: 'Total Order',
      },
      marker: {
        show: false,
      },
    },
  },
  series: [
    {
      name: 'floor',
      data: [45, 66, 41, 89, 25, 44, 9, 54],
    },
  ],
};

export default chartData;
