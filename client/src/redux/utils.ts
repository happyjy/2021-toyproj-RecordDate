import { RootState } from './modules/rootReducer';
import {
  BookResType,
  dateImageListType,
  dateIamgeType,
  dateType,
  placeListType,
  placeType,
} from '../types';

export function getTokenFromState(state: RootState): string | null {
  return state.auth.token;
}

export function getDateRecordFromState(state: RootState): dateType[] | null {
  debugger;
  console.log(state);
  return state.dateRecord.dateRecordList;
}

export function getBooksFromState(state: RootState): BookResType[] | null {
  return state.books.books;
}

export function makeDate(
  dateRecordList: dateType[],
  placeListFromTable: placeType[],
  imageListFromTable?: dateIamgeType[],
) {
  dateRecordList.map((dateRecord: dateType) => {
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
