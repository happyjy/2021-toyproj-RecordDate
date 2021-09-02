import axios from 'axios';
import { makeDate } from '../Redux/utils';

import {
  dateIamgeType,
  DateRecordReqType,
  dateRecordListExtendType,
  EditDateRecordReqType,
  placeType,
  searchOptionType,
} from '../types';

const DATERECORD_API_URL = 'http://localhost:5000/api/dateRecord';
// const DATERECORD_API_URL = 'https://133e-121-141-1-66.ngrok.io/api/dateRecord';

export default class DateRecordService {
  public static async getDateRecordList(
    token: string,
    searchOption: searchOptionType,
  ): Promise<dateRecordListExtendType[]> {
    const response = await axios.get<
      [dateRecordListExtendType[], placeType[], dateIamgeType[]]
    >(DATERECORD_API_URL, {
      params: { searchOption },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const dateRecordList = response.data[0];
    const placeListFromTable = response.data[1];
    const imageLstFromTable = response.data[2];
    return makeDate(dateRecordList, placeListFromTable, imageLstFromTable);
  }

  public static async addDateRecord(
    token: string,
    dateRecord: DateRecordReqType,
  ): Promise<dateRecordListExtendType> {
    const formData = new FormData();
    formData.append('dateTime', dateRecord.dateTime);
    formData.append('title', dateRecord.title);
    formData.append('description', dateRecord.description);
    formData.append('placeList', JSON.stringify(dateRecord.placeList));
    [...dateRecord.imageFile].forEach((v) => {
      formData.append('imageFile', v);
    });

    const response = await axios.post<dateRecordListExtendType>(
      DATERECORD_API_URL,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  }

  public static async editDateRecord(
    token: string,
    dateRecordId: number,
    dateRecord: EditDateRecordReqType,
  ): Promise<dateRecordListExtendType> {
    const formData = new FormData();
    formData.append('title', dateRecord.title);
    formData.append('description', dateRecord.description);
    formData.append('delPlaceList', JSON.stringify(dateRecord.delPlaceList));
    formData.append('addPlaceList', JSON.stringify(dateRecord.addPlaceList));
    formData.append(
      'delImageFileIdList',
      JSON.stringify(dateRecord.delImageFileIdList),
    );
    dateRecord.newImageFileList &&
      [...dateRecord.newImageFileList].forEach((v) => {
        formData.append('newImageFileList', v);
      });

    const response = await axios.patch<
      [dateRecordListExtendType[], placeType[]]
    >(`${DATERECORD_API_URL}/${dateRecordId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      },
    });

    const dateRecordList = response.data[0];
    const placeListFromTable = response.data[1];
    return makeDate(dateRecordList, placeListFromTable)[0];
  }

  public static async deleteDateRecord(
    token: string,
    dateRecordId: number,
  ): Promise<dateRecordListExtendType> {
    const response = await axios.delete<dateRecordListExtendType>(
      `${DATERECORD_API_URL}/${dateRecordId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  }
}
