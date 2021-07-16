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
  selectPlaceList: selectPlaceList[];
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

export interface selectPlaceList {
  placeName: string;
  address: string;
}
export interface DateResType {
  dateRecord_id: number;
  title: string;
  description: string;
  place_name: string;
  latLong: string;
  created_at: string;
}

export interface DateRecordReqType {
  title: string;
  place: string;
  description: string;
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
