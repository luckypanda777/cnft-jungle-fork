const optionsArea = ({ id, series }) => ({
  height: 400,
  type: 'area',
  options: {
    chart: {
      id,
      group: 'volumes',
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
    colors: [
      'var(--logoColor)',
      'var(--primaryColor)',
      '#7a0a39',
      '#3F51B5',
      '#2196F3',
    ],
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
    // title: {
    //   text: 'Marketplace Share',
    //   align: 'left',
    //   offsetY: -5,
    //   offsetX: 20,
    //   style: {
    //     color: 'var(--fontColor)',
    //   },
    // },
    // subtitle: {
    //   text: 'By total Volume',
    //   offsetY: 30,
    //   offsetX: 20,
    //   style: {
    //     color: 'var(--fontColor)',
    //   },
    // },
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
        left: 15,
        right: 15,
      },
    },
    yaxis: {
      show: true,
      tickAmount: 10,
      tooltip: {
        enabled: false,
      },
    },
    labels: [
      '01/4/2002',
      '01/5/2002',
      '01/6/2002',
      '01/7/2002',
      '01/8/2002',
      '01/9/2002',
      '01/10/2002',
      '01/11/2002',
      '01/12/2002',
      '01/13/2002',
      '01/14/2002',
      '01/15/2002',
      '01/16/2002',
      '01/17/2002',
      '01/18/2002',
      '01/19/2002',
      '01/20/2002',
      '01/21/2002',
      '01/22/2002',
      '01/23/2002',
    ],
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
    xaxis: {
      type: 'datetime',
      tooltip: {
        enabled: false,
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
  },
  series,
});

export default optionsArea;
