import moment from 'moment';
import { memo } from 'react';
import Chart from 'react-apexcharts';
import { nFormatter } from 'utils/formatCurrency';
import { getDateCategoriesLineGraph } from './data/mock-collection';

const floorLineChartOptions = (data, dateRanges) => ({
  series: [{ data, name: 'Floor' }],
  height: 200,
  type: 'line',
  options: {
    chart: {
      animations: {
        enabled: false,
      },
      id: 'floor',
      group: 'floorVolume',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    title: {
      text: 'Floor History',
      style: {
        color: 'var(--fontColor)',
      },
    },
    yaxis: {
      title: {
        text: 'Price in ADA',
        style: {
          color: 'var(--fontColor)',
        },
      },
      labels: {
        style: { colors: 'var(--fontColor)' },
      },
    },
    xaxis: {
      ...dateRanges,
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
      offsetY: -25,
      style: {
        color: 'var(--fontColor)',
        fontSize: '22px',
        fontFamily: 'newgilroymedium',
      },
    },
    markers: {
      size: 3,
    },
    colors: ['var(--primaryColor)', 'var(--logoColor)'],
    dataLabels: {
      enabled: false,
      theme: 'dark',
      style: {
        colors: ['var(--fontColor)'],
      },
    },
    fill: {
      type: ['solid', 'solid'],
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    tooltip: {
      theme: 'dark',
    },
  },
});

const soldLineChartOptions = (data, dateRanges) => ({
  series: [{ data, name: 'Sold amount' }],
  height: 200,
  type: 'line',
  options: {
    chart: {
      animations: {
        enabled: false,
      },
      id: 'sold',
      group: 'floorVolume',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    title: {
      text: 'Sold History',
      style: {
        color: 'var(--fontColor)',
      },
    },
    yaxis: {
      title: {
        text: 'Amount in NFTs',
        style: {
          color: 'var(--fontColor)',
        },
      },
      labels: {
        style: { colors: 'var(--fontColor)' },
      },
    },
    xaxis: {
      ...dateRanges,
      labels: {
        rotate: -45,
        rotateAlways: data.length > 20,
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
      offsetY: -25,
      style: {
        color: 'var(--fontColor)',
        fontSize: '22px',
        fontFamily: 'newgilroymedium',
      },
    },
    markers: {
      size: 3,
    },
    colors: ['var(--primaryColor)', 'var(--logoColor)'],
    dataLabels: {
      enabled: false,
      theme: 'dark',
      style: {
        colors: ['var(--fontColor)'],
      },
    },
    fill: {
      type: ['solid', 'solid'],
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    tooltip: {
      theme: 'dark',
    },
  },
});

const volumeAreaChartOptions = (data, dateRanges) => ({
  series: [{ data, name: 'Volume' }],
  height: 200,
  type: 'area',
  options: {
    chart: {
      animations: {
        enabled: false,
      },
      id: 'volume',
      group: 'floorVolume',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    title: {
      text: 'Volume History',
      style: {
        color: 'var(--fontColor)',
      },
    },
    yaxis: {
      title: {
        text: 'Amount in ADA',
        style: {
          color: 'var(--fontColor)',
        },
      },
      labels: {
        formatter: function (value) {
          return nFormatter(value, 1);
        },
        style: { colors: 'var(--fontColor)' },
      },
    },
    xaxis: {
      ...dateRanges,
      labels: {
        rotate: -45,
        rotateAlways: data.length > 20,
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
      offsetY: -25,
      style: {
        color: 'var(--fontColor)',
        fontSize: '22px',
        fontFamily: 'newgilroymedium',
      },
    },
    markers: {
      size: 3,
    },
    colors: ['var(--primaryColor)', 'var(--logoColor)'],
    dataLabels: {
      enabled: false,
      theme: 'dark',
      style: {
        colors: ['var(--fontColor)'],
      },
    },
    labels: ['Volume'],
    fill: {
      type: ['gradient', 'solid', 'solid'],
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    tooltip: {
      theme: 'dark',
    },
  },
});

const timePeriodBrushOptions = (data, dateRanges) => ({
  series: [{ data, name: 'Time Period' }],
  height: 100,
  width: '100%',
  options: {
    chart: {
      animations: {
        enabled: false,
      },
      id: 'time-period-brush',
      type: 'bar',
      foreColor: '#ccc',
      brush: {
        targets: ['floor', 'volume', 'sold'],
        enabled: true,
      },
      selection: {
        enabled: true,
        fill: {
          color: '#fff',
          opacity: 0.4,
        },
      },
    },
    colors: ['var(--logoColor)'],
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    grid: {
      borderColor: '#444',
    },
    markers: {
      size: 0,
    },
    xaxis: {
      ...dateRanges,
      labels: {
        rotate: -45,
        rotateAlways: data.length > 20,
        style: {
          colors: 'var(--fontColor)',
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    noData: {
      text: 'No data available',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: -25,
      style: {
        color: 'var(--fontColor)',
        fontSize: '22px',
        fontFamily: 'newgilroymedium',
      },
    },
    yaxis: {
      tickAmount: 2,
    },
  },
});

const VolumeHistoryChart = ({ floors, volumes, sales, range }) => {
  const VolumeChart = memo(
    () => (
      <Chart
        {...volumeAreaChartOptions(
          volumes,
          getDateCategoriesLineGraph(range, volumes?.length)
        )}
      />
    ),
    [volumes]
  );
  const FloorChart = memo(
    () => (
      <Chart
        {...floorLineChartOptions(
          floors,
          getDateCategoriesLineGraph(range, floors?.length)
        )}
      />
    ),
    [floors]
  );
  const SoldChart = memo(
    () => (
      <Chart
        {...soldLineChartOptions(
          sales,
          getDateCategoriesLineGraph(range, sales?.length)
        )}
      />
    ),
    [sales]
  );
  const PeriodChart = memo(
    () => (
      <Chart
        {...timePeriodBrushOptions(
          floors,
          getDateCategoriesLineGraph(range, floors?.length)
        )}
      />
    ),
    [floors]
  );

  return (
    <>
      <FloorChart />
      <SoldChart />
      <VolumeChart />
      <PeriodChart />
    </>
  );
};

export default VolumeHistoryChart;
