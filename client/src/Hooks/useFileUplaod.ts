import { useState } from 'react';
import { dateImageListType } from '../types';

// interface HTMLInputEvent extends Event {
//   // target: HTMLInputElement & EventTarget;
//   // target: {
//   //   files: any;
//   // };
// }

interface IFileText {
  index: number;
  name: string;
  result: any;
}
const useFileUpload = () => {
  const [imageFile, setImagefile] = useState<any[]>([]); // 수정필요
  const [fileText, setFileText] = useState<any[]>([]); // 수정필요
  // const [loadImageFiles, setLoadImageFiles] = useState<dateImageListType[]>([]);

  const onChangeFileupload = (e: any) => {
    const uploadImage = [...imageFile, ...e.target.files];
    let files = e.target.files;
    setImagefile((imageFile) => {
      return [...imageFile, ...files];
    });

    let arr: any = [];
    let cntFileTypeImages: number = [...e.target.files].filter((v) => {
      return v.__proto__ === File.prototype;
    }).length;

    // [...uploadImage].forEach((v, i) => {
    [...e.target.files].forEach((v, i) => {
      if (v.__proto__ !== File.prototype) return;

      var reader = new FileReader();
      reader?.readAsDataURL(v);
      reader.onload = function (e) {
        if (e?.target?.result) {
          arr.push({
            idx: imageFile.length + i + 1,
            name: v.name,
            result: e.target.result,
          });
        }
        --cntFileTypeImages;
      };
      reader.onloadend = function (e) {
        if (cntFileTypeImages === 0) {
          // setFileText([...imageFile, ...arr]);
          setFileText((fileText) => [...fileText, ...arr]);
          console.log(fileText);
        }
      };
    });
  };
  return {
    imageFile,
    setImagefile,
    fileText,
    setFileText,
    // loadImageFiles,
    // setLoadImageFiles,
    onChangeFileupload,
  };
};

export default useFileUpload;
