import Accordion from 'components/common/Accordion';
import { useAppContext } from 'context/AppContext';

const FilterAccordion = ({ children, style }) => {
  const { state } = useAppContext();

  if (state.isMobile) {
    return (
      <Accordion label="Filters" transparent style={style}>
        {children}
      </Accordion>
    );
  }

  return children;
};

export default FilterAccordion;
