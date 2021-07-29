import axios from 'axios';
import { makeDate } from '../redux/utils';

import {
  DateRecordReqType,
  dateType,
  placeListType,
  placeType,
} from '../types';

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
    const placeListFromTable = response.data[1];
    return makeDate(dateRecordList, placeListFromTable);
  }

  public static async addDateRecord(
    token: string,
    dateRecord: DateRecordReqType,
  ): Promise<dateType> {
    debugger;
    const formData = new FormData();
    formData.append('title', dateRecord.title);
    formData.append('description', dateRecord.description);
    formData.append('placeList', JSON.stringify(dateRecord.placeList));
    formData.append('imageFile', dateRecord.imageFile);
    const response = await axios.post<dateType>(DATERECORD_API_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  public static async editDateRecord(
    token: string,
    dateRecordId: number,
    dateRecord: DateRecordReqType,
  ): Promise<dateType> {
    const response = await axios.patch<[dateType[], placeType[]]>(
      `${DATERECORD_API_URL}/${dateRecordId}`,
      dateRecord,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const dateRecordList = response.data[0];
    const placeListFromTable = response.data[1];
    return makeDate(dateRecordList, placeListFromTable)[0];
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
}
