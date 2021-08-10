import React, { Dispatch } from 'react';
import styled from 'styled-components';
import { default as imageClose } from '../../assets/img/close.svg';

interface ITest {
  rotate?: number;
  inputColor: string;
  imageClose: any;
}

const CloseIcon = styled.div<ITest>`
  position: absolute;
  width: 70%;
  height: 70%;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%)
    rotate(${(props) => (props.rotate ? props.rotate + 'deg' : 0 + 'deg')});
  opacity: 0.2;
  border-radius: 50%;
  background-color: ${(props) => props.inputColor || 'palevioletred'};
  background-image: url(${(props) => props.imageClose});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  &:hover {
    opacity: 0.4;
    cursor: pointer;
  }
`;
const Container = styled.div`
  padding: 10px 0;
`;
const UploadButton = styled.div`
  border: none;
  border-bottom: 3px solid #717070;
  border-radius: 5px;
  padding: 10px;
  background: #ccc;
  text-transform: uppercase;
  font-weight: 700px;
  text-align: center;

  transition: border 0.3s ease, background 0.3s ease;
  cursor: pointer;

  &:hover {
    background: #a2a2a2;
  }

  &:active {
    border: none;
  }
`;
const FileuploadInput = styled.input.attrs({ type: 'file', multiple: true })`
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  outline: none;
  cursor: pointer;
  z-index: 1000;
`;
interface IContainerDragNDrop {
  isHidden: boolean;
}
const ContainerDragNDrop = styled.div<IContainerDragNDrop>`
  position: relative;
  margin-top: 20px;
  border: 4px dashed #ccc;
  text-align: center;
  display: ${(props) => (props.isHidden ? 'none' : 'block')};
`;
const ContainerDragText = styled.div``;
const DragText = styled.h2`
  font-weight: 100;
  text-transform: uppercase;
  color: #15824b;
  padding: 60px 0;
  margin: 0;
`;
const ContainerUploadImage = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: space-around;
  grid-gap: 10px;

  position: relative;
  margin-top: 20px;
  border: 4px dashed #ccc;
  padding: 5px;
`;
const ContainerThumbnail = styled.div`
  position: relative;

  &:before {
    content: ' ';
    display: block;
    width: 100%;
    padding-top: 100%; /* Percentage value in padding derived from the width  */
  }
`;
const ThumbnailImg = styled.img`
  width: 100%;
  height: 100%;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  object-fit: cover;

  /* &:hover {
    content: '';
    width: 10px;
    height: 10px;
    border: 1px solid red;
    border-radius: 50%;
    position: absolute;
    top: 0px;
    right: 0px;
  } */
`;

interface FileUpload {
  imageFile: any[];
  setImagefile: Dispatch<any>;
  fileText: any[];
  setFileText: Dispatch<any>;
  onChangeFileupload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const FileUpload: React.FC<FileUpload> = ({
  imageFile,
  setImagefile,
  fileText,
  setFileText,
  onChangeFileupload,
}) => {
  const fileuploadRef = React.createRef<HTMLInputElement>();
  // const [ref, setRef] = useState(fileuploadRef);
  // useEffect(() => {
  //   setRef(fileuploadRef);
  // }, []);

  const onClickUploadButton = (e: any) => {
    fileuploadRef && fileuploadRef.current && fileuploadRef.current.click();
  };

  const onClickCloseIcon = (e: any) => {
    interface Test {
      [key: string]: any;
    }
    console.log(e.target);
    let delImage: Test[] = [];
    const result = fileText.filter((v) => {
      if (v.idx === parseInt(e.target.dataset.idx)) delImage[v.name] = v;
      return v.idx !== parseInt(e.target.dataset.idx);
    });
    setFileText(result);

    const resultImageFile = [...imageFile].filter((file) => {
      return !delImage[file.name];
    });
    setImagefile(resultImageFile);
  };
  return (
    <Container>
      <UploadButton onClick={(e) => onClickUploadButton(e)}>
        Add Image
      </UploadButton>
      <ContainerDragNDrop isHidden={fileText.length === 0 ? false : true}>
        <FileuploadInput
          ref={fileuploadRef}
          onChange={(e) => onChangeFileupload(e)}
        />
        <ContainerDragText>
          <DragText>Drag and drop a file or select add Image</DragText>
        </ContainerDragText>
      </ContainerDragNDrop>
      {fileText.length !== 0 && (
        <>
          <ContainerUploadImage>
            {fileText.map((file) => {
              return (
                <ContainerThumbnail key={file.idx}>
                  <ThumbnailImg
                    src={file.result}
                    alt="Image preview..."
                  ></ThumbnailImg>
                  <CloseIcon
                    data-idx={file.idx}
                    onClick={(e) => onClickCloseIcon(e)}
                    imageClose={imageClose}
                    inputColor="rebeccapurple"
                  ></CloseIcon>
                </ContainerThumbnail>
              );
            })}
            <ContainerThumbnail>
              <FileuploadInput
                ref={fileuploadRef}
                onChange={(e) => onChangeFileupload(e)}
              />
              <CloseIcon
                rotate={45}
                imageClose={imageClose}
                inputColor="rebeccapurple"
              ></CloseIcon>
            </ContainerThumbnail>
          </ContainerUploadImage>
          {/* <div>
            {' '}
            <FileuploadInput
              ref={fileuploadRef}
              onChange={(e) => onChangeFileupload(e)}
            />
          </div> */}
        </>
      )}
    </Container>
  );
};

export default FileUpload;
