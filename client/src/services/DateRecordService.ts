import axios from 'axios';
import { makeDate } from '../redux/utils';

import {
  dateIamgeType,
  DateRecordReqType,
  dateType,
  EditDateRecordReqType,
  placeType,
} from '../types';

const DATERECORD_API_URL = 'http://localhost:5000/api/dateRecord';

export default class DateRecordService {
  public static async getDateRecordList(token: string): Promise<dateType[]> {
    const response = await axios.get<
      [dateType[], placeType[], dateIamgeType[]]
    >(DATERECORD_API_URL, {
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
  ): Promise<dateType> {
    const formData = new FormData();
    formData.append('title', dateRecord.title);
    formData.append('description', dateRecord.description);
    formData.append('placeList', JSON.stringify(dateRecord.placeList));
    [...dateRecord.imageFile].forEach((v) => {
      formData.append('imageFile', v);
    });
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
    dateRecord: EditDateRecordReqType,
  ): Promise<dateType> {
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
        formData.append('imageFile', v);
      });
    formData.append(
      'addPlaceList',
      JSON.stringify(dateRecord.delImageFileIdList),
    );

    const response = await axios.patch<[dateType[], placeType[]]>(
      `${DATERECORD_API_URL}/${dateRecordId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'multipart/form-data',
        },
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
