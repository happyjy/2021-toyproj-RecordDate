import axios from 'axios';

import {
  BookReqType,
  BookResType,
  DateRecordReqType,
  DateResType2,
  dateType,
  placeType,
  selectPlaceList,
} from '../types';

// const BOOK_API_URL = 'https://api.marktube.tv/v1/book';
const BOOK_API_URL = 'http://localhost:5000/api/dateRecordList';

export default class DateRecordService {
  public static async getDateRecordList(token: string): Promise<dateType[]> {
    const response = await axios.get<[dateType[], placeType[]]>(BOOK_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const dateRecordList = response.data[0];
    const placeList = response.data[1];

    dateRecordList.map((v: dateType) => {
      let selectPlaceList: selectPlaceList[] = [];

      placeList.forEach((v1: placeType) => {
        if (v.dateRecord_id === v1.dateRecord_id) {
          selectPlaceList.push({
            placeName: v1.place_name,
            address: v1.address,
          });
        }
      });
      v.selectPlaceList = selectPlaceList;

      return v;
    });
    return dateRecordList;
  }

  public static async addDateRecord(
    token: string,
    dateRecord: DateRecordReqType,
  ): Promise<DateRecordReqType> {
    const response = await axios.post<DateRecordReqType>(
      BOOK_API_URL,
      dateRecord,
      {
        headers: {
          Authrization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }
  public static async addBook(
    token: string,
    book: BookReqType,
  ): Promise<BookResType> {
    const response = await axios.post<BookResType>(BOOK_API_URL, book, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  public static async editBook(
    token: string,
    bookId: number,
    book: BookReqType,
  ): Promise<BookResType> {
    const response = await axios.patch<BookResType>(
      `${BOOK_API_URL}/${bookId}`,
      book,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  public static async deleteBook(token: string, bookId: number): Promise<void> {
    await axios.delete(`${BOOK_API_URL}/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
