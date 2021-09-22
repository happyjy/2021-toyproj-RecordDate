import { RootState } from './modules/rootReducer';
import {
  dateImageListType,
  dateIamgeType,
  dateRecordListExtendType,
  placeListType,
  placeType,
  dateRecordPageStatusType,
  BookResType,
} from '../types';

export function getTokenFromState(state: RootState): string | null {
  return state.auth.token;
}

export function getDateRecordFromState(
  state: RootState,
): dateRecordListExtendType[] | null {
  return state.dateRecord.dateRecordList || [];
}

export function getDateRecordPageStatusFromState(
  state: RootState,
): dateRecordPageStatusType {
  return {
    dateRecordListRowCount: state.dateRecord.dateRecordListRowCount,
    dateRecordListCurrentPage: state.dateRecord.dateRecordListCurrentPage,
  };
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

export function debounce(fn, ms = 1000) {
  let timerId: any = null;
  return (...args) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(function () {
      fn(...args);
    }, ms);
  };
}

export const throttle = (func, delay) => {
  let throttled = false;
  return (...args) => {
    if (!throttled) {
      throttled = true;
      setTimeout(() => {
        func(...args);
        throttled = false;
      }, delay);
    }
  };
};

export function getDateFormatSearchType(date: Date) {
  const yearNum = date.getFullYear().toString();
  const monthNum = (date.getMonth() + 1).toString().padStart(2, '0');
  return [yearNum, monthNum].join('-');
}
