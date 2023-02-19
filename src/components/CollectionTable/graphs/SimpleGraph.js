import Chart from 'react-apexcharts';

const chartData = ({ name, data, type = 'line' }) => {
  const change = data[data.length - 1] - (data[0] || 0);
  return {
    type,
    height: 75,
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
      colors: [
        type === 'bar'
          ? '#343437'
          : change > 0
          ? 'var(--undervaluedColor)'
          : change < 0
          ? 'var(--overvaluedColor)'
          : 'var(--goldenCard)',
      ],
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
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        },
      },
    },
    series: [{ name, data }],
  };
};

const SimpleGraph = ({ name, data, type }) => {
  return <Chart {...chartData({ name, data, type })} />;
};

export default SimpleGraph;
