import { RootState } from './modules/rootReducer';
import { BookResType, dateType, placeListType, placeType } from '../types';

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


export function makeDate(dateRecordList: dateType[], placeListFromTable: placeType[]) {
  dateRecordList.map((dateRecord: dateType) => {
    let placeList: placeListType[] = [];

    placeListFromTable.forEach((place: placeType, index) => {
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

    return dateRecord;
  });

  return dateRecordList;
}