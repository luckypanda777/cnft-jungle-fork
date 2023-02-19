import Chart from 'react-apexcharts';

const floorLineChartOptions = (data) => ({
  series: [{ data }],
  height: 250,
  type: 'line',
  options: {
    chart: {
      id: 'floor',
      group: 'floorVolume',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: 'datetime',
    },
    title: { text: 'Floor History' },
    colors: ['var(--primaryColor)', 'var(--fontColor)'],
    dataLabels: {
      enabled: false,
      style: {
        colors: 'var(--fontColor)',
      },
    },
    stroke: {
      curve: 'smooth',
    },
    tooltip: {
      theme: 'dark',
    },
  },
});

const FloorHistoryChart = ({ floors }) => {
  return <Chart {...floorLineChartOptions(floors)} />;
};

export default FloorHistoryChart;
