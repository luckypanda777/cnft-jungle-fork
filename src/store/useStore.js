import create from 'zustand';
import produce from 'immer';

const portfolioInitialState = (set) => ({
  activeTab: {
    name: 'listings',
    filters: {},
  },
  setActiveTab: (name) =>
    set(
      produce((draft) => {
        // save prev
        const tab = draft.portfolio.tabs.find(
          (t) => t.name === draft.portfolio.activeTab.name
        );
        tab.filters = draft.portfolio.activeTab.filters;

        // switch to new tab
        draft.portfolio.activeTab = draft.portfolio.tabs.find(
          (t) => t.name === name
        );
      })
    ),
  setFilters: (filters) =>
    set(
      produce((draft) => {
        draft.portfolio.activeTab.filters = {
          ...draft.portfolio.activeTab.filters,
          ...filters,
        };
      })
    ),
  tabs: [
    {
      name: 'portfolio',
      filters: {},
    },
    {
      name: 'listings',
      filters: {},
    },
    {
      name: 'mints',
      filters: {},
    },
    {
      name: 'transactions',
      filters: {},
    },
  ],
});

const useStore = create((set, get) => ({
  portfolio: portfolioInitialState(set),
}));

export default useStore;
