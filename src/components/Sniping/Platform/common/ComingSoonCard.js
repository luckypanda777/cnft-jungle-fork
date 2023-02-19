import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  linearProgressClasses,
} from '@mui/material';

// assets
import BlurLinearIcon from '@mui/icons-material/BlurLinear';
import { Box } from '@mui/system';

// styles
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 30,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#fff',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
}));

const CardStyle = styled(Card)(({ theme }) => ({
  background: theme.palette.primary.light,
  marginBottom: '22px',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '157px',
    height: '157px',
    background: theme.palette.secondary[400],
    borderRadius: '50%',
    top: '-105px',
    right: '-96px',
  },
}));

const LinkBox = styled(Box)(({ theme }) => ({
  '&:link': {
    textDecoration: 'none',
  },
  '&:visited': {
    textDecoration: 'none',
  },
  '&:hover': {
    textDecoration: 'none',
  },
  '&:active': {
    textDecoration: 'none',
  },
}));

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

function LinearProgressWithLabel({ value, ...others }) {
  const theme = useTheme();

  return (
    <Grid container direction="column" spacing={1} sx={{ mt: 1.5 }}>
      <Grid item>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6" sx={{ color: theme.palette.primary[800] }}>
              Progress
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="inherit">{`${Math.round(
              value
            )}%`}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <BorderLinearProgress variant="determinate" {...others} />
      </Grid>
    </Grid>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number,
};

// ==============================|| SIDEBAR MENU Card ||============================== //

const ComingSoonCard = ({ available }) => {
  const theme = useTheme();

  return (
    <LinkBox component={Link} to="/roadmap" sx={{ pointerEvents: 'auto' }}>
      <CardStyle sx={{ mb: 0 }}>
        <CardContent sx={{ p: 3, pb: '16px !important' }}>
          <List sx={{ p: 0, m: 0 }}>
            <ListItem alignItems="flex-start" disableGutters sx={{ p: 0 }}>
              <ListItemAvatar sx={{ mt: 0 }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.largeAvatar,
                    color: '#fff',
                    border: 'none',
                    borderColor: theme.palette.primary.main,
                    background: theme.palette.primary.light,
                    marginRight: '12px',
                  }}
                >
                  <BlurLinearIcon sx={{ fontSize: '35px !important' }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                sx={{ mt: 0 }}
                primary={
                  <Typography
                    variant="subtitle1"
                    sx={{ color: theme.palette.secondary[200] }}
                  >
                    Coming soon..
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    sx={{ width: '50px', overflowWrap: 'break-word' }}
                  >
                    Will be available in {available}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </CardStyle>
    </LinkBox>
  );
};

export default ComingSoonCard;
