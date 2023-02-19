import {  useState, useEffect } from "react";

const useDebounce = (value, delay) => {
    const [debounced, setDebounced] = useState(value);

    useEffect( () => {
        const timemout = setTimeout(() => setDebounced(value), delay);

        return () => {
            clearTimeout(timemout);
        };
    }, [value, delay] );

    return debounced;
};

export default useDebounce;