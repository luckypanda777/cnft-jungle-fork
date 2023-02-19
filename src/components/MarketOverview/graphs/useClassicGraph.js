import { useState } from 'react';

const useClassicGraph = () => {
  const [interval, setInterval] = useState('24h');

  return { interval, setInterval };
};

export { useClassicGraph };
