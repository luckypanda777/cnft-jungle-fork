import { Box, Divider, Tab, Tabs } from '@mui/material';
import { portfolioTabsArr } from '../constants';
import useTabsValue from '../hooks/useTabsValue';
import styles from './PortfolioTabs.module.scss';

const PortfolioTab = () => {
  const [activeTab, onChangeTab] = useTabsValue();

  const renderTabs = () => {
    return portfolioTabsArr.map((item) => (
      <Tab
        key={item.value}
        label={item.label}
        value={item.value}
        className={styles.portfolioTab}
        disableRipple
      />
    ));
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={onChangeTab}
        className={styles.portfolioTabs}
      >
        {renderTabs()}
      </Tabs>
      <Divider className={styles.divider} />
    </Box>
  );
};

export default PortfolioTab;
