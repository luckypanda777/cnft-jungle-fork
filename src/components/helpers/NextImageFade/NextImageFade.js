import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

const NextImageFade = ({ className, alt, src, style, layout }) => {
  const [ready, setReady] = useState(false);
  const mountedRef = useRef(false);

  const onLoadingComplete = (e) => {
    if (!mountedRef.current) return;
    setReady(true);
  };

  useEffect(() => {
    mountedRef.current = true;

    return () => (mountedRef.current = false);
  }, []);

  return (
    <Image
      className={classNames(
        className,
        'nextImage',
        ready ? 'nextImage-ready' : ''
      )}
      alt={alt}
      src={src}
      width={style.width}
      height={style.height}
      layout={layout || 'intrinsic'}
      onLoadingComplete={onLoadingComplete}
    />
  );
};

export default NextImageFade;
