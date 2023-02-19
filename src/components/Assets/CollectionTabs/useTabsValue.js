import { useRouter } from 'next/router';
import { COLLECTION_TABS } from './constants';
const useTabsValue = () => {
  const router = useRouter();
  const currentTab = router.query?.tab ?? COLLECTION_TABS.TRADING;

  const exists = Object.values(COLLECTION_TABS).includes(currentTab);

  return [
    exists ? currentTab : COLLECTION_TABS.TRADING,
    (event, value) => {
      event.preventDefault();
      router.push(
        {
          pathname: `/collections/${router.query.collection}`,
          query: { tab: exists ? value : COLLECTION_TABS.TRADING },
        },
        undefined,
        { shallow: true }
      );
    },
  ];
};
export default useTabsValue;
