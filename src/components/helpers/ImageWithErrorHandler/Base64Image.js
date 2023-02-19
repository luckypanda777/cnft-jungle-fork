import React from 'react';

const Base64Svg = ({ src }) => <img src={src} alt="base64csv" />;

const Base64Html = ({ data }) => {
  let base64ToString = Buffer.from(data, 'base64').toString();

  return <div dangerouslySetInnerHTML={{ __html: base64ToString }} />;
};

const Base64Image = ({ data, datatype }) => {
  const src = `data:${datatype};base64,${data}`;

  if (datatype.includes('html')) {
    return <Base64Html data={data} />;
  }
  return <Base64Svg src={src} />;
};

export default Base64Image;
