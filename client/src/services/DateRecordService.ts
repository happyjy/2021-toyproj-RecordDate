import axios from 'axios';

import {
  BookReqType,
  BookResType,
  DateRecordReqType,
  dateType,
  placeType,
  selectPlaceList,
} from '../types';

const BOOK_API_URL = 'https://api.marktube.tv/v1/book';
const DATERECORD_API_URL = 'http://localhost:5000/api/dateRecord';

export default class DateRecordService {
  public static async getDateRecordList(token: string): Promise<dateType[]> {
    const response = await axios.get<[dateType[], placeType[]]>(
      DATERECORD_API_URL,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const dateRecordList = response.data[0];
    const placeList = response.data[1];

    dateRecordList.map((dateRecord: dateType) => {
      let selectPlaceList: selectPlaceList[] = [];

      placeList.forEach((place: placeType) => {
        if (dateRecord.dateRecord_id === place.dateRecord_id) {
          selectPlaceList.push({
            placeName: place.place_name,
            address: place.address,
            latLong: place.latLong,
          });
        }
      });
      dateRecord.selectPlaceList = selectPlaceList;

      return dateRecord;
    });
    return dateRecordList;
  }

  public static async addDateRecord(
    token: string,
    dateRecord: DateRecordReqType,
  ): Promise<DateRecordReqType> {
    const response = await axios.post<DateRecordReqType>(
      DATERECORD_API_URL,
      dateRecord,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  public static async editDateRecord(
    token: string,
    dateRecordId: number,
    dateRecord: DateRecordReqType,
  ): Promise<dateType> {
    const response = await axios.patch<dateType>(
      `${DATERECORD_API_URL}/${dateRecordId}`,
      dateRecord,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  }

  public static async deleteDateRecord(
    token: string,
    dateRecordId: number,
  ): Promise<dateType> {
    const response = await axios.delete<dateType>(
      `${DATERECORD_API_URL}/${dateRecordId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

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
