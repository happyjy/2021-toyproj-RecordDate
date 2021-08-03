import React, { Dispatch } from 'react';
import useFileUpload from '../../hooks/useFileUplaod';
import styled from 'styled-components';

const FileuploadInput = styled.input.attrs({ type: 'file', multiple: true })`
  position: relative;
`;

interface FileUpload {
  onChangeFileupload: (e: any) => void;
}
const FileUpload: React.FC<FileUpload> = ({ onChangeFileupload }) => {
  return <FileuploadInput onChange={(e) => onChangeFileupload(e)} />;
};

export default FileUpload;
