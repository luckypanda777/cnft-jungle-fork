import { getPriceToRarity } from 'apiProvider';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useMemo, useState } from 'react';
import styles from '../Assets.module.scss';

const options = ({ name, listings, hodls, floor }) => ({
  chart: {
    type: 'area',
    zoomType: 'xy',
  },
  credits: {
    enabled: false,
  },
  title: {
    text: name,
  },
  xAxis: {
    minPadding: 0,
    maxPadding: 0,
    plotLines: [
      {
        value: floor,
        width: 1,
        label: {
          text: `Floor price: ${floor} ADA`,
          rotation: 90,
        },
      },
    ],
    title: {
      text: 'Price',
    },
  },
  yAxis: [
    {
      lineWidth: 1,
      gridLineWidth: 1,
      title: null,
      tickWidth: 1,
      tickLength: 5,
      tickPosition: 'inside',
      labels: {
        align: 'left',
        x: 8,
      },
    },
    {
      opposite: true,
      linkedTo: 0,
      lineWidth: 1,
      gridLineWidth: 0,
      title: null,
      tickWidth: 1,
      tickLength: 5,
      tickPosition: 'inside',
      labels: {
        align: 'right',
        x: -8,
      },
    },
  ],
  legend: {
    enabled: false,
  },
  plotOptions: {
    area: {
      fillOpacity: 0.2,
      lineWidth: 1,
      step: 'center',
    },
  },
  tooltip: {
    headerFormat:
      '<span style="font-size=10px;">Price: {point.key} ADA</span><br/>',
    valueDecimals: 2,
    backgroundColor: '#fff',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 3,
  },
  series: [
    {
      name: 'Listings',
      data: listings,
      color: '#31D582',
    },
    {
      name: 'Hodls',
      data: hodls,
      color: '#D5317C',
    },
  ],
});

const CollectionMarketDepth = ({ collection }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(collection);
  useEffect(() => {
    if (collection) {
      getListings();
    }
  }, [collection]);

  const getListings = async () => {
    try {
      const priceToRarity = await getPriceToRarity(collection).then(
        (res) => res.priceToRarity || []
      );

      console.log(priceToRarity);

      setListings(priceToRarity);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  console.log(listings);

  const memoizedOptions = useMemo(() => {
    if (listings.length === 0) return {};

    const totalPrice = listings.reduce((acc, curr) => {
      return acc + curr.price;
    }, 0);

    // find the floor price
    const minPrice = listings.reduce((acc, curr) => {
      return acc < curr.price ? acc : curr.price;
    }, Infinity);
    const averagePrice = totalPrice / listings.length;

    const groupByPrice = listings
      .filter((a) => a.price < averagePrice)
      .reduce((group, asset) => {
        if (!asset) return null;

        const { price } = asset;
        group[price] = group[price] ?? [];
        group[price].push(asset);
        return group;
      }, {});

    const listingsSpread = Object.entries(groupByPrice).map(([price, l]) => [
      parseInt(price),
      l.length,
    ]);

    return options({
      name: collection.name,
      listings: listingsSpread,
      hodls: [
        [900, 10],
        [875, 8],
        [850, 5],
        [800, 3],
        [770, 2],
        [750, 3],
        [700, 1],
        [600, 10],
      ],
      floor: minPrice,
    });
  }, [collection.policies, listings]);

  console.log(memoizedOptions);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={memoizedOptions} />
    </div>
  );
};

export default CollectionMarketDepth;
