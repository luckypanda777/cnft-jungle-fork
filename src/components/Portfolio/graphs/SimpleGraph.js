import Chart from 'react-apexcharts';

const chartData = ({
  name,
  data,
  type = 'line',
  color = 'var(--primaryColor)',
}) => ({
  type,
  height: 50,
  width: 150,
  options: {
    id: 'genderplot',
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [color],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    yaxis: {
      show: false,
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
        title: `${type === 'line' ? 'Floor' : 'Total Volume'}`,
        formatter: (value) => {
          return value ? '₳' + value?.toLocaleString() : '';
        },
      },
      marker: {
        show: false,
      },
    },
    markers: {
      size: 0,
      show: true,
    },
    grid: {
      show: false,
      padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5,
      },
    },
  },
  series: [{ name, data }],
});

const SimpleGraph = ({ name, data, type, color }) => {
  return <Chart {...chartData({ name, data, type, color })} />;
};

export default SimpleGraph;
