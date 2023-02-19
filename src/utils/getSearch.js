import qs from "qs";

const getLocationSearch = () => {
	if (typeof window !== 'undefined') {
		const parsedQuery = qs.parse(location.search, { ignoreQueryPrefix: true });
		return { ...parsedQuery };
	}

	return {};
};

export { getLocationSearch };