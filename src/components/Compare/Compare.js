import { Box } from '@mui/material';
import CompareSearch from './CompareSearch';
import styles from './Compare.module.scss';
import CompareIcon from '@mui/icons-material/Compare';

const Compare = () => {
	return (
		<Box className={styles.main}>
			<Box sx={{ width: 300 }}>
				<CompareSearch compare />
			</Box>
			<CompareIcon fontSize="large" sx={{ mx: 2 }} />
			<Box sx={{ width: 300 }}>
				<CompareSearch compare />
			</Box>
		</Box>
	);
};

export default Compare;