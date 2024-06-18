import React from 'react';

const HorizontalLine: React.FC = () => {
  const lineStyle: React.CSSProperties = {
    border: 'none',
    borderTop: '1.5px dotted #ccc',
    margin: '20px 0',
  };

  return <hr style={lineStyle} />;
};

export default HorizontalLine;