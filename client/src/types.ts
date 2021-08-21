// DateList
export interface dateRecordListType {
  dateCnt: number;
  dateRecord_id: number;
  dateTime: string;
  title: string;
  description: string;
  image: string;
  isDeleted: string;
  created_at: string;
  updated_at: string;
}
export interface dateRecordListExtendType extends dateRecordListType {
  placeList: placeListType[];
  dateImageList: dateImageListType[];
}
export interface placeType {
  place_id: number;
  dateRecord_id: number;
  place_name: string;
  address: string;
  latLong: string;
  created_at: string;
  updated_at: string;
}
export interface placeListType {
  id: number;
  placeName: string;
  address: string;
  latLong: string;
}
export interface dateIamgeType {
  dateImage_id: number;
  dateRecord_id: number;
  dateImage_name: string;
  created_at: string;
  updated_at: string;
}
export interface dateImageListType {
  id: number;
  dateImageName: string;
  idx?: number;
  result?: string;
}

export interface DateResType {
  dateRecord_id: number;
  title: string;
  description: string;
  place_name: string;
  latLong: string;
  created_at: string;
}

export interface DateRecordReqDefaultType {
  dateTime: string;
  title: string;
  description: string;
}
export interface DateRecordReqType extends DateRecordReqDefaultType {
  placeList: placeListType[];
  imageFile?: any; // [?] input type multiple value 타입 확인하기 => FileList[]; (but, type 문제 생김)
}
// [todo] interface extend활용 리팩토링하기
export interface EditDateRecordReqType extends DateRecordReqDefaultType {
  delPlaceList: placeListType[];
  addPlaceList: placeListType[];
  newImageFileList: File[];
  delImageFileIdList: number[];
}

// 검색 조건
export interface keywordSearchType {
  key: string;
  target: { value: string };
}
// type TypeSearch = {
//   key: string;
//   target: { value: string };
// };
export interface searchOptionType {
  rangeDate: string[];
  sort: string | undefined;
}

// Books
export interface BookReqType {
  title: string;
  author: string;
  message: string;
  url: string;
}
export interface BookResType {
  bookId: number;
  title: string;
  author: string;
  message: string;
  url: string;

  createdAt: string;
}
export interface LoginReqType {
  email: string;
  password: string;
}
export interface LoginResType {
  token: string;
}
