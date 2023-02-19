export const getSentimentData = (data = 67) => ({
  series: [data],
  height: 350,
  stacked: false,
  type: 'radialBar',
  options: {
    chart: {
      offsetY: -20,
      animations: {
        enabled: false,
      },
      id: 'category-index',
      stacked: false,
      toolbar: {
        show: false,
      },
      height: 350,
      type: 'radialBar',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: ['var(--fontColor)'],
      },
    },
    noData: {
      text: 'No data available',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: -10,
      style: {
        color: 'var(--fontColor)',
        fontSize: '22px',
        fontFamily: 'newgilroymedium',
      },
    },
    stroke: {
      width: [4],
      curve: 'smooth',
    },
    colors:
      data > 0
        ? 'var(--undervaluedColor)'
        : data === 0
        ? 'goldenrod'
        : 'var(--tradeLoss)',
    title: {
      offsetY: 20,
      text: '3 Times more Buys than Sales',
      align: 'center',
      style: {
        fontSize: '20px',
        color: 'var(--fontColor)',
      },
    },
    markers: {
      size: 5,
      hover: {
        sizeOffset: 6,
      },
    },
    xaxis: {
      labels: {
        rotateAlways: data.length > 20,
        style: {
          colors: 'var(--fontColor)',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Index Value',
        style: {
          color: 'var(--fontColor)',
        },
      },
      labels: {
        style: {
          colors: 'var(--fontColor)',
        },
      },
    },
    tooltip: {
      y: {
        title: {
          formatter: () => 'Index Value',
        },
        formatter: (value) => {
          return value.toLocaleString();
        },
      },
      theme: 'dark',
    },
    grid: {
      borderColor: '#f1f1f1',
    },
    legend: {
      labels: {
        colors: 'var(--fontColor)',
      },
      tooltipHoverFormatter: function (val, opts) {
        return (
          val +
          ' - ' +
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
          ''
        );
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '16px',
            color:
              data > 0
                ? 'var(--undervaluedColor)'
                : data === 0
                ? 'goldenrod'
                : 'var(--tradeLoss)',
            offsetY: 120,
          },
          value: {
            offsetY: 76,
            fontSize: '22px',
            color:
              data > 0
                ? 'var(--undervaluedColor)'
                : data === 0
                ? 'goldenrod'
                : 'var(--tradeLoss)',
            formatter: function (val) {
              return val + '%';
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
      colors:
        data > 0
          ? 'var(--undervaluedColor)'
          : data === 0
          ? 'goldenrod'
          : 'var(--tradeLoss)',
    },
    stroke: {
      dashArray: 4,
    },
    labels: data > 0 ? ['Buying NFTs'] : ['Selling NFTs'],
    grid: {
      padding: {
        bottom: 10,
      },
    },
  },
});
