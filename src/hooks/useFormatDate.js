import { useAppContext } from 'context/AppContext';
import moment from 'moment';
import 'moment-timezone';

function useFormatDate() {
  const { state } = useAppContext();
  const { localFilters } = state;
  const { dateFormat } = localFilters;

  const formatDate = (date) => {
    if (dateFormat === 'simplified') {
      return `${moment.utc(date).from(moment.utc(new Date()))}`;
    }
    return `${moment.utc(date).format('DD MMM YY HH:mm')} UTC`;
  };

  return { formatDate };
}

export default useFormatDate;
