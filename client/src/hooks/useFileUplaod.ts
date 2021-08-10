import { useState } from 'react';

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
  const [imageFile, setImagefile] = useState<any[]>([]);
  const [fileText, setFileText] = useState<IFileText[]>([]);

  const onChangeFileupload = (e: any) => {
    console.log('### useFileUpload');
    // setImagefile( (files) => [...files, ...e.target.files]);

    const uploadImage = [...imageFile, ...e.target.files];
    let files = e.target.files;
    setImagefile((imageFile) => {
      debugger;
      return [...imageFile, ...files];
    });

    let arr: any = [];
    // let count: number = e.target.files.length;
    let count: number = uploadImage.length;

    [...uploadImage].forEach((v, i) => {
      var reader = new FileReader();
      reader.onload = function (e) {
        if (e?.target?.result) {
          // arr.push(e.target.result);
          arr.push({ idx: i, name: v.name, result: e.target.result });
        }
        // $('.file-upload-image').attr('src', e.target.result);
        --count;
      };
      reader.onloadend = function (e) {
        if (count === 0) {
          setFileText(arr);
        }
      };
      reader.readAsDataURL(v);
    });
  };
  return {
    imageFile,
    setImagefile,
    fileText,
    setFileText,
    onChangeFileupload,
  };
};

export default useFileUpload;
