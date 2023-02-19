import { Fragment, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';

// assets
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import SkeletonTotalMarketVolumeCard from './Skeleton/SkeletonTotalMarketVolumeCard';
import MainCard from './MainCard';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCollectionsCard = ({ isLoading, collections = [] }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalMarketVolumeCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid
                  container
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography variant="h4">Top Collections</Typography>
                  </Grid>
                  <Grid item>
                    <MoreHorizOutlinedIcon
                      fontSize="small"
                      sx={{
                        color: theme.palette.primary[200],
                        cursor: 'pointer',
                      }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    />
                    <Menu
                      id="menu-popular-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <MenuItem onClick={handleClose}> Today</MenuItem>
                      <MenuItem onClick={handleClose}> This Week</MenuItem>
                      <MenuItem onClick={handleClose}> This Month </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ pt: '16px !important' }}>
                <BajajAreaChartCard />
              </Grid>
              <Grid item xs={12}>
                {collections.map((collection, index) => (
                  <Fragment key={collection.id}>
                    <Grid
                      container
                      direction="column"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { background: theme.palette.primary.light },
                        borderRadius: 2,
                        p: 1,
                      }}
                    >
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {collection.name}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Grid
                              container
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Grid item>
                                <Typography variant="subtitle1" color="inherit">
                                  ₳{collection.floor}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Avatar
                                  variant="rounded"
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '5px',
                                    backgroundColor:
                                      collection.floorChange > 0
                                        ? theme.palette.success.light
                                        : theme.palette.orange.light,
                                    color:
                                      collection.floorChange > 0
                                        ? theme.palette.success.dark
                                        : theme.palette.orange.dark,
                                    ml: 2,
                                  }}
                                >
                                  <KeyboardArrowUpOutlinedIcon
                                    fontSize="small"
                                    color="inherit"
                                  />
                                </Avatar>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color:
                              collection.floorChange > 0
                                ? 'success.dark'
                                : 'orange.dark',
                          }}
                        >
                          {collection.floorChange}% change
                        </Typography>
                      </Grid>
                    </Grid>
                    {collections.length > index + 1 && (
                      <Divider sx={{ my: 0.25 }} />
                    )}
                  </Fragment>
                ))}
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small">View trending collections</Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

export default PopularCollectionsCard;
