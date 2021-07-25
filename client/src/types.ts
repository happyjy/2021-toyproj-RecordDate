// DateList
export interface DateResType2 {
  date: dateType[];
  place: placeType[];
}

export interface dateType {
  dateRecord_id: number;
  title: string;
  description: string;
  placeId: string;
  image: string;
  isDeleted: string;
  created_at: string;
  updated_at: string;
  placeList: placeListType[];
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
export interface DateResType {
  dateRecord_id: number;
  title: string;
  description: string;
  place_name: string;
  latLong: string;
  created_at: string;
}

export interface DateRecordReqDefaultType {
  title: string;
  description: string;
}
export interface DateRecordReqType extends DateRecordReqDefaultType {
  placeList: placeListType[];
}
// [todo] interface extend활용 리팩토링하기
export interface EditDateRecordReqType extends DateRecordReqDefaultType {
  delPlaceList: placeListType[];
  addPlaceList: placeListType[];
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
