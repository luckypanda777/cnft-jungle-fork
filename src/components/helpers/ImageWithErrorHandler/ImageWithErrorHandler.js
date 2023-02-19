import { useCallback, useState, useEffect } from 'react';
import { Skeleton } from '@mui/material';
import FadeIn from 'components/helpers/LazyLoadFadeIn';
import NextImageFade from 'components/helpers/NextImageFade';
import axios from 'axios';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';

const ImageWithErrorHandler = ({
  loading,
  className,
  alt,
  src,
  style,
  nextImg,
  layout,
  onchain_data = {},
  on_chain_src = '',
  overlayOnClick = () => {},
  overlayStyles = {},
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingHeaders, setLoadingHeaders] = useState(true);
  const [mediaType, setMediaType] = useState(null);

  const getFileType = useCallback(async () => {
    if (src?.includes('unsupported')) return setMediaType('image/webp');

    try {
      const data = await axios.head(src);
      setMediaType(data.headers['content-type'] || 'image/webp');
    } catch (err) {
      setMediaType('image/webp');
    }
  }, [src]);

  useEffect(() => {
    setLoadingHeaders(true);
    getFileType().finally(() => setLoadingHeaders(false));
  }, [src, getFileType]);

  if (loading) return <Skeleton className={className} style={style} />;

  if (
    !src &&
    (!on_chain_src || on_chain_src == '{}') &&
    onchain_data &&
    Object.keys(onchain_data).length > 0
  ) {
    let { image, files } = onchain_data;
    let mediaType =
      onchain_data.mediatype || onchain_data.mediaType || 'image/webp';

    if (!image) {
      const [value_onchain_data] = Object.values(onchain_data || {});
      image = value_onchain_data.image;
    }

    if (mediaType?.includes('html') || mediaType?.includes('image/svg+xml')) {
      let src = image.join('');

      if (files && files.length > 0) {
        src = files[0].src.join('');
      }

      return (
        <>
          <iframe
            style={{ height: 'inherit', width: '100%' }}
            referrerPolicy="unsafe-url"
            frameBorder="0"
            scrolling="no"
            src={src}
          />
          {/* iframe overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 100,
              ...overlayStyles,
            }}
            onClick={overlayOnClick}
          />
        </>
      );
    }

    if (mediaType?.includes('image')) {
      return (
        <FadeIn className={className} style={style}>
          {(onload) => (
            <img
              crossOrigin="anonymous"
              className={className}
              src={
                Array.isArray(image) ? image.join('') : imgLinkReplace(image)
              }
              alt={alt}
              style={style}
              onLoad={onload}
            />
          )}
        </FadeIn>
      );
    }
  }

  if (!src && on_chain_src) {
    const onchain_src = JSON.parse(on_chain_src);
    const { src, datatype } = onchain_src;
    const full_onchain_src = datatype + ',' + src;

    return (
      <img
        crossOrigin="anonymous"
        className={className}
        src={full_onchain_src}
        alt={alt}
        style={style}
      />
    );
  }

  if (src?.startsWith('blob')) {
    return (
      <img
        crossOrigin="anonymous"
        className={className}
        src={src}
        alt={alt}
        style={style}
      />
    );
  }

  if (!src || src?.startsWith('data:image') || !src?.startsWith('http')) {
    return (
      <img
        crossOrigin="anonymous"
        className={className}
        src="../catunsupported.webp"
        alt="asset not found"
        style={style}
      />
    );
  }

  if (nextImg) {
    return (
      <NextImageFade
        className={className}
        alt={alt}
        src={src}
        style={style}
        layout={layout}
      />
    );
  }

  if (mediaType?.includes('video')) {
    return (
      <video
        crossOrigin="anonymous"
        muted
        //controls
        autoPlay
        loop
        playsInline
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
        }}
      >
        <source type="video/mp4" src={src} />
      </video>
    );
  }

  return (
    <>
      <FadeIn className={className} style={style}>
        {(onload) => (
          <img
            crossOrigin="anonymous"
            className={className}
            src={src}
            alt={alt}
            style={style}
            onLoad={() => {
              onload();
              setIsLoading(false);
            }}
          />
        )}
      </FadeIn>
      {isLoading ||
        (loadingHeaders && (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
            }}
          >
            <Skeleton
              variant="circular"
              animation="wave"
              width="100%"
              height="100%"
              style={{ borderRadius: 0 }}
            />
          </div>
        ))}
    </>
  );
};

export default ImageWithErrorHandler;
