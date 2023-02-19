import { Box, Divider, Tab, Tabs } from '@mui/material';
import { collectionTabsArr } from './constants';
import useTabsValue from './useTabsValue';
import styles from './CollectionTabs.module.scss';

const CollectionTabs = () => {
  const [activeTab, onChangeTab] = useTabsValue();

  const renderTabs = () => {
    return collectionTabsArr.map((item) => (
      <Tab
        key={item.value}
        label={item.label}
        value={item.value}
        className={styles.collectionTab}
        disableRipple
      />
    ));
  };

  return (
    <Box className={styles.tabContainer}>
      <Tabs
        value={activeTab}
        onChange={onChangeTab}
        className={styles.collectionTabs}
      >
        {renderTabs()}
      </Tabs>
      <Divider className={styles.divider} />
    </Box>
  );
};

export default CollectionTabs;
