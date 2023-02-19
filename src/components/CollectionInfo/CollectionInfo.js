import styles from '../AssetsSidebar/Sidebar.module.scss';
import moment from 'moment';
import CustomTooltip from 'components/common/CustomTooltip';

const CollectionInfo = ({
  collection_name,
  policies,
  supply = 0,
  description,
  addedAt,
  upcoming,
  addedAt,
}) => {
  const handleOpenPolicy = () => {
    window.open(`https://cardanoscan.io/tokenPolicy/${policies}`, '_blank');
  };

  const isUpcoming = upcoming && addedAt > parseInt(moment().unix() * 1000);

  return (
    <>
      <span className={styles.projectName}>{collection_name}</span>
      <span className={styles.projectPolicy}>{description}</span>
      {policies && (
        <CustomTooltip title="View in cardanoscan">
          <span
            className={styles.projectPolicy}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={handleOpenPolicy}
          >
            Policy: {policies}
          </span>
        </CustomTooltip>
      )}
      {isUpcoming && (
        <>
          <span
            className={styles.circulation}
            style={{
              fontSize: 12,
            }}
          >
            <span className={styles.badge}>
              {moment.utc(addedAt).format('DD MMMM @ HH:mm UTC')}
            </span>
          </span>
        </>
      )}
    </>
  );
};

export default CollectionInfo;
