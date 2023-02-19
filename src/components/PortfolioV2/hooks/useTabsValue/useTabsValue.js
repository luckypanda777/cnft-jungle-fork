import { useRouter } from 'next/router';
import { PORTFOLIO_TABS } from '../../constants';
const useTabsValue = () => {
  const router = useRouter();
  const currentTab = router.query?.tab ?? PORTFOLIO_TABS.PROFILE;

  const exists = Object.values(PORTFOLIO_TABS).includes(currentTab);

  return [
    exists ? currentTab : PORTFOLIO_TABS.PROFILE,
    (event, value) => {
      event.preventDefault();
      router.push(
        {
          pathname: `portfolio`,
          query: { tab: exists ? value : PORTFOLIO_TABS.PROFILE },
        },
        undefined,
        { shallow: true }
      );
    },
  ];
};
export default useTabsValue;
