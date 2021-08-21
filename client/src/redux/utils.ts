import { RootState } from './modules/rootReducer';
import {
  BookResType,
  dateImageListType,
  dateIamgeType,
  dateRecordListExtendType,
  placeListType,
  placeType,
} from '../types';

export function getTokenFromState(state: RootState): string | null {
  return state.auth.token;
}

export function getDateRecordFromState(
  state: RootState,
): dateRecordListExtendType[] | null {
  return state.dateRecord.dateRecordList;
}

export function getBooksFromState(state: RootState): BookResType[] | null {
  return state.books.books;
}

export function makeDate(
  dateRecordList: dateRecordListExtendType[],
  placeListFromTable: placeType[],
  imageListFromTable?: dateIamgeType[],
): dateRecordListExtendType[] {
  dateRecordList.map((dateRecord: dateRecordListExtendType) => {
    let placeList: placeListType[] = [];
    let dateImageList: dateImageListType[] = [];

    placeListFromTable.forEach((place: placeType) => {
      if (dateRecord.dateRecord_id === place.dateRecord_id) {
        placeList.push({
          id: place.place_id,
          placeName: place.place_name,
          address: place.address,
          latLong: place.latLong,
        });
      }
    });
    dateRecord.placeList = placeList;

    imageListFromTable?.forEach((image: dateIamgeType) => {
      if (dateRecord.dateRecord_id === image.dateRecord_id) {
        dateImageList.push({
          id: image.dateImage_id,
          dateImageName: image.dateImage_name,
        });
      }
    });
    dateRecord.dateImageList = dateImageList;

    return dateRecord;
  });

  return dateRecordList;
}

export function debounce(fn, ms) {
  let timer: any;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(function () {
      timer = null;
      // fn.apply(this, arguments);
      fn.apply(fn, arguments);
    }, ms);
  };
}

export function getDateFormatSearchType(date: Date) {
  const yearNum = date.getFullYear().toString();
  const monthNum = (date.getMonth() + 1).toString().padStart(2, '0');
  return [yearNum, monthNum].join('-');

  // const dateNum = date.getDate().toString().padStart(2, '0');
  // return [yearNum, monthNum, dateNum].join('-');
}
