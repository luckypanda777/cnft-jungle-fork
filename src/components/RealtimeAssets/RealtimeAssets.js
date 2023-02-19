import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { assetsMock } from './readltime-assets-mock';
import { Box } from '@mui/system';
import styles from './RealtimeAssets.module.scss';
import moment from 'moment';
import Card from '../cards/RealtimeCard/Card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

const getData = (time) => {
  return axios.get(`${API_URL}/minting-now?time=${time}`);
};

const RealtimeAssets = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    let interval;

    // initial req last 10 min mints
    getData(10)
      .then((res) => {
        if (res && res.data) {
          setAssets([
            ...res.data['new-mints'].map((a) => ({
              ...a,
              timestamp: moment(new Date()).subtract(10, 'minutes').format('x'),
            })),
          ]);
        }
      })
      .catch((e) => console.error(e));

    // every 60 sec refresh
    interval = setInterval(() => {
      getData(1)
        .then((res) => {
          if (res && res.data) {
            setAssets((prevAssets) => {
              const newAssets = [
                ...res.data['new-mints'].map((a) => ({
                  ...a,
                  timestamp: moment(res.data.time).format('x'),
                })),
              ];

              return [...newAssets, ...prevAssets];
            });
          }
        })
        .catch((e) => console.error(e));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const GroupedByTime = () => {
    const groupByCollection = assets.reduce((group, asset) => {
      if (!asset) return null;

      const { timestamp } = asset;
      group[timestamp] = group[timestamp] ?? [];
      group[timestamp].push(asset);
      return group;
    }, {});

    // display grouped assets
    const groupedAssets = Object.keys(groupByCollection).map((key) => {
      const assets = groupByCollection[key];

      return { assets, timestamp: key };
    });

    return (
      groupedAssets.length ? groupedAssets : Array.from(new Array(3))
    ).map((group = {}, i) => {
      const { assets, timestamp } = group;
      const data = assets && assets.length ? assets : Array.from(new Array(50));
      //console.log(moment(timestamp, 'x').format('MMMM Do YYYY, h:mm:ss a'));
      return (
        <>
          <TimelineItem key={i}>
            <TimelineOppositeContent
              sx={{ m: 'auto 0' }}
              align="right"
              variant="body2"
              color="text.secondary"
            >
              <Box className={styles.gallery}>
                <Box className={styles.galleryGrid}>
                  {data
                    .filter((a) => a?.minted)
                    .map((asset, index) => (
                      <Card
                        key={asset?.id || index}
                        asset={asset}
                        loading={!asset}
                      />
                    ))}
                </Box>
              </Box>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <span style={{ marginTop: 5 }}>
                {moment(timestamp, 'x').fromNow()}
              </span>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <TimelineDot />
              </Box>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Box className={styles.gallery}>
                <Box className={styles.galleryGrid}>
                  {data
                    .filter((a) => !a?.minted)
                    .map((asset, index) => (
                      <Card
                        key={asset?.id || index}
                        asset={asset}
                        loading={!asset}
                      />
                    ))}
                </Box>
              </Box>
            </TimelineContent>
          </TimelineItem>
        </>
      );
    });
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      <Timeline position="alternate">
        <TimelineSeparator sx={{ mb: 2 }}>
          <TimelineConnector />
          <span style={{ marginTop: 5, fontSize: 22 }}>Epoch 340</span>
          <span style={{ marginTop: 5, fontSize: 14 }}>1 minute left</span>
          <TimelineConnector />
        </TimelineSeparator>
        <GroupedByTime />
      </Timeline>
    </Box>
  );
};

export default RealtimeAssets;
