import { useEffect, useState } from 'react';
import FilterInput from 'components/common/Input';
import useWindowSize from 'hooks/useWindowSize';
import useDebounce from 'hooks/useDebounce';

const FilterAssetSearch = ({
  name = 'filterAssetsQuery',
  handleFilters,
  placeholder = 'Search Assets',
}) => {
  const { width } = useWindowSize();

  const [customInput, setCustomInput] = useState(0);
  const debouncedCustomInput = useDebounce(customInput, 400);
  useEffect(() => {
    handleFilters(name, debouncedCustomInput);
  }, [debouncedCustomInput]);

  return (
    <FilterInput
      placeholder={placeholder}
      name={name}
      value={customInput || ''}
      onChange={(e) => setCustomInput(e.target.value)}
      sx={{ maxWidth: 250 }}
    />
  );
};

export default FilterAssetSearch;
