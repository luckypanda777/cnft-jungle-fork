/**
 * Author: https://github.com/Swizec/react-lazyload-fadein/
 * Remake by me
 */

import React, { useState } from 'react';
import LazyLoad from 'react-lazyload';
import { Transition } from 'react-transition-group';

const getStyle = ({ duration, easing = 'ease-in-out' }) => ({
  transition: `opacity ${duration}ms ${easing}`,
  opacity: 0,
  display: 'inline-block',
});

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
};

const FadeIn = (props) => {
  const {
    height,
    duration = 10,
    easing,
    children,
    render,
    offset,
    ...restProps
  } = props;
  const [loaded, setLoaded] = useState(false);

  const onLoad = () => {
    setLoaded(true);
  };

  return (
    <LazyLoad
      height={height}
      offset={typeof offset === 'undefined' ? 150 : offset}
      {...restProps}
    >
      <Transition in={loaded} timeout={duration}>
        {(state) => (
          <div
            style={{
              ...getStyle({ duration, easing }),
              ...transitionStyles[state],
            }}
          >
            {children && children(onLoad)}
            {render && render(onLoad)}
          </div>
        )}
      </Transition>
    </LazyLoad>
  );
};

export default FadeIn;
