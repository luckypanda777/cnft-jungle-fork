import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Divider,
} from '@mui/material';
import { default as MuiSkeleton } from '@mui/material/Skeleton';
import DefaultListItemText from './ListItemText';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { shorten } from 'utils/shorten';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { avatarStyle } from 'utils/globalStyles';

const Skeleton = styled(MuiSkeleton)(() => ({
  backgroundColor: 'var(--skeletonColor)',
}));

const CollectionListItem = ({
  collection,
  loading,
  sortOrFilerLoading,
  isLast,
}) => {
  const router = useRouter();
  const onClick = (e) => {
    const link = `/collections/${collection?.policies}`;
    if (e.metaKey) {
      return window.open(link, '_blank');
    }

    if (collection) {
      router.push(link);
    }
  };

  if (loading) {
    return (
      <>
        <ListItem sx={{ height: 80 }}>
          <ListItemText>
            <Skeleton
              animation="wave"
              height={10}
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </ListItemText>
        </ListItem>
        {!isLast && <Divider sx={{ width: '100%' }} />}
      </>
    );
  }

  return (
    <>
      <ListItem
        onClick={onClick}
        sx={{
          ':hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            cursor: 'pointer',
          },
          borderLeft: collection.featured && '5px solid var(--primaryColor)',
          borderRight: collection.featured && '5px solid var(--primaryColor)',
          height: 80,
          p: 3,
        }}
      >
        <ListItemAvatar>
          {!collection.image && !collection.optimized_image ? (
            <Avatar
              src={collection.optimized_image || collection.image}
              alt={collection.collection_name}
              sx={avatarStyle}
            >
              <ImageWithErrorHandler
                src="assets/catunsupported.webp"
                alt="unsupported"
                style={{
                  width: 45,
                  height: 45,
                }}
              />
            </Avatar>
          ) : (
            <Avatar alt={collection.collection_name} sx={avatarStyle}>
              <ImageWithErrorHandler
                src={collection.optimized_image || collection.image}
                layout="fill"
              />
            </Avatar>
          )}
        </ListItemAvatar>

        <ListItemText
          sx={{ width: 180 }}
          primary={
            <span style={{ wordWrap: 'break-word' }}>
              {shorten(collection.collection_name || collection.policies, 40)}
              {!!collection.featured && (
                <span
                  style={{
                    backgroundColor:
                      collection.featured && 'var(--primaryColor)',
                    color: 'var(--whiteColor)',
                    padding: '3px 6px',
                    marginLeft: 10,
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  Promoted
                </span>
              )}
            </span>
          }
          secondary={
            <span>
              <span
                style={{
                  color: 'var(--logoColor)',
                  fontWeight: 'bold',
                }}
              >
                {sortOrFilerLoading ? (
                  <CircularProgress
                    size={15}
                    sx={{ color: 'var(--logoColor)' }}
                  />
                ) : (
                  collection.supply || '0'
                )}
              </span>{' '}
              NFTs
            </span>
          }
          primaryTypographyProps={{
            fontWeight: 'bold',
            color: 'var(--fontColor)',
            fontSize: 16,
          }}
        />
        <DefaultListItemText
          loading={sortOrFilerLoading}
          value={collection.volume_d}
          prefix={collection.volume_d ? '₳' : ''}
          postfix={collection.volume_d ? '' : 'No Sales'}
          highlight
          style={{ width: 100 }}
          textStyle={{ textAlign: 'center' }}
        />

        <DefaultListItemText
          loading={sortOrFilerLoading}
          value={collection.volume_w}
          prefix={collection.volume_w ? '₳' : ''}
          postfix={collection.volume_w ? '' : 'No Sales'}
          highlight
          style={{ width: 100 }}
          textStyle={{ textAlign: 'center' }}
        />

        <DefaultListItemText
          loading={sortOrFilerLoading}
          value={collection.volume_m}
          prefix={collection.volume_m ? '₳' : ''}
          postfix={collection.volume_m ? '' : 'No Sales'}
          highlight
          style={{ width: 100 }}
          textStyle={{ textAlign: 'center' }}
        />

        <DefaultListItemText
          loading={sortOrFilerLoading}
          value={collection.floor}
          prefix={collection.floor ? '₳' : ''}
          highlight
          style={{ width: 100 }}
          textStyle={{ textAlign: 'center' }}
        />

        <DefaultListItemText
          loading={sortOrFilerLoading}
          value={`${collection.listings} NFTs`}
          defaultValue="None"
          postfix={`/ ${Math.round(
            (collection.listings / collection.supply) * 100
          )}%`}
          highlight
          style={{ width: 100 }}
          textStyle={{ textAlign: 'center' }}
        />
      </ListItem>
      {!isLast && <Divider sx={{ width: '100%' }} />}
    </>
  );
};

export default CollectionListItem;
