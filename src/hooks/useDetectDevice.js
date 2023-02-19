import {useEffect, useState} from "react";
import {isMobile} from "react-device-detect";

function useDetectDevice() {
	const [mobile, setMobile] = useState(false);

	useEffect(() => {
		setMobile(isMobile);
	}, []);

	return {isMobile: mobile};
}

export default useDetectDevice;