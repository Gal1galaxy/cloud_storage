import React from 'react';
import { Image } from 'antd';

const ImagePreview = ({ data }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Image
        src={`data:image/jpeg;base64,${data.data}`}
        alt="预览图片"
        style={{
          maxWidth: '100%',
          maxHeight: '80vh'
        }}
      />
    </div>
  );
};

export default ImagePreview; 