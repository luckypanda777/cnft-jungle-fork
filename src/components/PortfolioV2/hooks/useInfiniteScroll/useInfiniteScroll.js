import { useState, useEffect, useCallback } from 'react';

const debounce = (func, delay) => {
  let inDebounce;
  return function () {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
};

const useInfiniteScroll = (element, callback, throttle = 350, offer = 200) => {
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching]);

  const handleScroll = useCallback(() => {
    const currentElement = element.current;
    if (
      currentElement.scrollTop + currentElement.clientHeight + offer <
        currentElement.scrollHeight ||
      isFetching
    ) {
      return;
    }
    setIsFetching(true);
  }, [element, isFetching]);

  useEffect(() => {
    const currentElement = element.current;
    if (currentElement) {
      currentElement.addEventListener(
        'scroll',
        debounce(handleScroll, throttle)
      );
    }
    return () => {
      currentElement?.removeEventListener(
        'scroll',
        debounce(handleScroll, throttle)
      );
    };
  }, [element, handleScroll]);

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
