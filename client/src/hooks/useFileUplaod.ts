import { useState } from 'react';

const useFileUpload = () => {
  const [imageFile, setImagefile] = useState();
  const onChangeFileupload = (e: any) => {
    console.log('### useFileUpload');
    setImagefile(e.target.files);
  };
  return {
    imageFile,
    setImagefile,
    onChangeFileupload,
  };
};

export default useFileUpload;
