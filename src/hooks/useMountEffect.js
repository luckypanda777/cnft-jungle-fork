import { useEffect } from 'react';

// eslint-disable-next-line
const useMountEffect = (fun) => useEffect(fun, []);

export { useMountEffect };
