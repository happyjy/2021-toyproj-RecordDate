import React, { useEffect, useRef, useState } from 'react';
import { message as messageDialog, PageHeader, Button } from 'antd';
import { FormOutlined } from '@ant-design/icons';

import Layout from './Layout';
import { DateRecordReqType, placeListType } from '../types';
import styles from './AddDateRecord.module.css';

import styled, { css } from 'styled-components';
import Chips from './chisComponent';

const FormContainer = styled.div`
  border-radius: 5px;
  /* background-color: #f2f2f2; */
  padding: 20px;
`;

const commonFormProperty = css`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

// https://stackoverflow.com/questions/56378356/how-do-i-convert-css-to-styled-components-with-inputtype-submit-attribute
const InputEl = styled.input.attrs({ type: 'text' })`
  ${commonFormProperty};
`;

const TextAreaEl = styled.textarea`
  ${commonFormProperty};
`;

const SelectEl = styled.select`
  ${commonFormProperty};
`;

const InputSubmitContainer = styled.div`
  text-align: right;
  margin-top: 20px;
`;

const InputSubmit = styled.button`
  width: 100%;
  border-color: #28546a;
  background-color: #28546a;
  text-transform: uppercase;
  border-radius: 1px;
  border-width: 2px;
  color: white;
  width: 120px;
  padding: 14px 20px;
  cursor: pointer;
  &:hover {
    background-color: #1f4152;
  }
`;

declare global {
  interface Window {
    kakao: any;
  }
}

interface AddProps {
  addDateRecord: (dateRecord: DateRecordReqType) => void;
  loading: boolean;
  error: Error | null;
  back: () => void;
  logout: () => void;
}

const AddDateRecord: React.FC<AddProps> = ({
  addDateRecord,
  loading,
  error,
  back,
  logout,
}) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = React.useState<string>();

  const inputEl = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  // const menuWrapRef = useRef<HTMLDivElement>(null);
  // const placeListRef = useRef<HTMLUListElement>(null);

  const [keyword, setKeyword] = useState('오목교역');
  const [map, setMap] = useState();
  const [cb, setCb] = useState(() => () => {});

  /* 
    # issue: useState with ts
      * https://stackoverflow.com/a/53650561/3937115
      * https://www.codegrepper.com/code-examples/typescript/typescript+usestate+array+type
  */
  const [placeList, setPlaceList] = useState<placeListType[]>([]);
  /* 
    # event trigger시 useEffect 안에 있는 함수 호출해야함
      * 돔 생성 이후에 생성된 돔에 붙이는 과정과 이벤트 동작이 묶여 있는 상황
      * 돔 이벤트 발생시 useEffect안에 있는 함수 호출 해야 하는 상황
      * 힘요한 함수만 useEffect 밖으로 빼내기 위해서 useState 사용
      * useState에 함수 설정방법
        * https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
  */

  const onClickDelete = (e: any) => {
    console.log(e);
    const index = e.target.dataset.index;
    const filterPlaceList = placeList.filter((place) => {
      return place.id + '' !== index && place;
    });
    setPlaceList(filterPlaceList);
  };

  const keypress = (e: any) => {
    if (e.key === 'Enter') {
      searchPlace();
    }
  };
  const inputEvent = (e: any) => {
    setKeyword(e.target.value);
  };

  const searchPlace = () => {
    console.log(cb());
  };

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error, logout]);

  useEffect(() => {
    // 마커를 담을 배열입니다
    var markers: any[] = [];

    // var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    var mapContainer = mapRef.current, // 지도를 표시할 div
      mapOption = {
        center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

    // 지도를 생성합니다
    let map = new window.kakao.maps.Map(mapContainer, mapOption);
    setMap(map);

    // 장소 검색 객체를 생성합니다
    let ps = new window.kakao.maps.services.Places();

    // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
    let infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

    // 키워드 검색을 요청하는 함수입니다

    let searchPlaces = ((placesSearchCB) => {
      return () => {
        // https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement
        // https://stackoverflow.com/a/43823786/3937115
        // console.log('???', inputEl.current);
        // console.log(placesSearchCB);

        // 블로그: https://stackoverflow.com/questions/52325814/why-we-are-using-htmlinputelement-in-typescript
        var input = inputEl.current as HTMLInputElement;
        var keyword = input?.value;

        if (!keyword.replace(/^\s+|\s+$/g, '')) {
          alert('키워드를 입력해주세요!');
          return false;
        }

        // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
        ps.keywordSearch(keyword, placesSearchCB);
      };
    })(placesSearchCB);

    setCb(() => searchPlaces);

    // 키워드로 장소를 검색합니다
    searchPlaces();

    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data: any, status: any, pagination: any) {
      if (status === window.kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        displayPlaces(data);

        // 페이지 번호를 표출합니다
        displayPagination(pagination);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
      }
    }

    interface places {
      x: string;
      y: string;
      place_name: string;
    }
    // 검색 결과 목록과 마커를 표출하는 함수입니다
    function displayPlaces(places: any[]) {
      // var listEl = document.getElementById('placesList') as HTMLInputElement;
      // var menuEl = document.getElementById('menu_wrap') as HTMLInputElement;
      var fragment = document.createDocumentFragment();
      var bounds = new window.kakao.maps.LatLngBounds();

      const menuEl = mapRef?.current?.parentElement?.children[1];
      const listEl =
        mapRef?.current?.parentElement?.children[1].getElementsByTagName(
          'ul',
        )[0];

      // 검색 결과 목록에 추가된 항목들을 제거합니다
      listEl && removeAllChildNods(listEl);
      // removeAllChildNods(plaesListRef.current);

      // 지도에 표시되고 있는 마커를 제거합니다
      removeMarker();

      for (var i = 0; i < places.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        var placePosition = new window.kakao.maps.LatLng(
            places[i].y,
            places[i].x,
          ),
          marker = addMarker(placePosition, i),
          itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function (marker, title, road_address_name) {
          window.kakao.maps.event.addListener(marker, 'click', function () {
            setPlaceList((placeList) => {
              return [
                ...placeList,
                {
                  id: placeList.length,
                  placeName: title,
                  address: road_address_name,
                  latLong: `${marker.n.La}, ${marker.n.Ma}`,
                },
              ];
            });
          });

          window.kakao.maps.event.addListener(marker, 'mouseover', function () {
            console.log('mouseover');
            displayInfowindow(marker, title);
          });

          window.kakao.maps.event.addListener(marker, 'mouseout', function () {
            infowindow.close();
          });

          itemEl.onmouseover = function () {
            displayInfowindow(marker, title);
          };

          itemEl.onmouseout = function () {
            infowindow.close();
          };
        })(marker, places[i].place_name, places[i].road_address_name);

        fragment.appendChild(itemEl);
      }

      // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
      listEl?.appendChild(fragment);
      // [todo]
      // menuEl && menuEl.scrollTop = 0;

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds);
    }

    // 검색결과 항목을 Element로 반환하는 함수입니다
    function getListItem(index: number, places: any) {
      var el = document.createElement('li'),
        itemStr =
          '<span class="markerbg marker_' +
          (index + 1) +
          '"></span>' +
          '<div class="info">' +
          '   <h5>' +
          places.place_name +
          '</h5>';

      if (places.road_address_name) {
        itemStr +=
          '    <span>' +
          places.road_address_name +
          '</span>' +
          '   <span class="jibun gray">' +
          places.address_name +
          '</span>';
      } else {
        itemStr += '    <span>' + places.address_name + '</span>';
      }

      itemStr += '  <span class="tel">' + places.phone + '</span>' + '</div>';

      el.innerHTML = itemStr;
      el.className = 'item';
      el.style.cssText = `
        list-style: none;
        // position:relative;border-bottom:1px solid #888;overflow: hidden;cursor: pointer;min-height: 65px;
      `;

      const backgroundPosition = [
        '0 -10px',
        '0 -56px',
        '0 -102px',
        '0 -148px',
        '0 -194px',
        '0 -240px',
        '0 -286px',
        '0 -332px',
        '0 -378px',
        '0 -423px',
        '0 -470px',
        '0 -516px',
        '0 -562px',
        '0 -608px',
        '0 -654px',
      ];

      if (!!el.getElementsByTagName('span')[0]) {
        el.getElementsByTagName(
          'span',
        )[0].style.cssText = `display:block; margin-top:4px;`;
      }
      if (!!el.getElementsByTagName('h5')[0]) {
        el.getElementsByTagName(
          'h5',
        )[0].style.cssText = `text-overflow:ellipsis; overflow:hidden; white-space: nowrap;`;
      }

      if (!!el.querySelector('.info')) {
        el.querySelector<HTMLElement>(
          '.info',
        )!.style.cssText = `text-overflow:ellipsis; overflow:hidden; white-space: nowrap; padding:10px 0px 10px 55px;`;
      }
      if (!!el.querySelector('.gray')) {
        el.querySelector<HTMLElement>(
          '.gray',
        )!.style.cssText = `color:#8a8a8a;`;
      }
      if (!!el.querySelector('.jibun')) {
        el.querySelector<HTMLElement>(
          '.jibun',
        )!.style.cssText = `padding-left:26px;background:url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png) no-repeat;`;
      }
      if (!!el.querySelector('.tel')) {
        el.querySelector<HTMLElement>('.tel')!.style.cssText = `color:#009900;`;
      }
      let markerbg = el.querySelector<HTMLElement>('.markerbg');
      if (!!markerbg) {
        markerbg!.style.cssText = `float:left; position:absolute; width:36px; height:37px; margin:10px 0px 0px 10px; background:url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png) no-repeat; background-position: ${backgroundPosition[index]}`;
      }
      if (!!el.querySelector('.gray')) {
        el.querySelector<HTMLElement>(
          '.gray',
        )!.style.cssText = `color:#8a8a8a;`;
      }

      el.onclick = (e) => {
        setPlaceList((placeList) => {
          return [
            ...placeList,
            {
              id: placeList.length,
              placeName: places.place_name,
              address: places.road_address_name,
              latLong: `${places.x}, ${places.y}`,
            },
          ];
        });
      };
      return el;
    }

    // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
    function addMarker(position: any, idx: any, title?: any) {
      var imageSrc =
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new window.kakao.maps.Size(36, 37), // 마커 이미지의 크기
        imgOptions = {
          spriteSize: new window.kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
          spriteOrigin: new window.kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new window.kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imgOptions,
        ),
        marker = new window.kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage,
          clickable: true, // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
        });

      marker.setMap(map); // 지도 위에 마커를 표출합니다
      markers.push(marker); // 배열에 생성된 마커를 추가합니다

      return marker;
    }

    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    function removeMarker() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }

    // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
    function displayPagination(pagination: any) {
      var paginationEl = document.getElementById('pagination') as HTMLElement,
        fragment = document.createDocumentFragment(),
        i;

      // 기존에 추가된 페이지번호를 삭제합니다
      while (paginationEl?.hasChildNodes()) {
        if (paginationEl.lastChild)
          paginationEl.removeChild(paginationEl.lastChild);
      }

      for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a');
        el.href = '#';
        el.innerHTML = i + '';

        if (i === pagination.current) {
          el.className = 'on';
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i);
            };
          })(i);
        }

        fragment.appendChild(el);
      }
      paginationEl?.appendChild(fragment);
    }

    // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
    // 인포윈도우에 장소명을 표시합니다
    function displayInfowindow(marker: any, title: any) {
      var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

      infowindow.setContent(content);
      infowindow.open(map, marker);
    }

    // 검색결과 목록의 자식 Element를 제거하는 함수입니다
    function removeAllChildNods(el: HTMLElement) {
      while (el?.hasChildNodes()) {
        if (el.lastChild) el.removeChild(el.lastChild);
      }
    }
  }, []);

  return (
    <Layout>
      <PageHeader
        onBack={back}
        title={
          <div>
            <FormOutlined /> Add Date Record
          </div>
        }
        subTitle="Add Your Book"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={logout}
            className={styles.button_logout}
          >
            Logout
          </Button>,
        ]}
      />

      <div className={styles.map_wrap}>
        <div
          ref={mapRef}
          id="map"
          style={{
            width: '800px',
            height: '500px',
            position: 'relative',
            overflow: 'hidden',
          }}
        ></div>
        <div id={styles.menu_wrap} className={styles.bg_white}>
          <div className={styles.option}>
            <div>
              키워드 :
              <input
                type="text"
                ref={inputEl}
                id="keyword"
                value={keyword}
                onChange={(e) => inputEvent(e)}
                onKeyPress={(e) => keypress(e)}
              />
              <button onClick={() => searchPlace()}>검색하기</button>
            </div>
          </div>
          <hr />
          <ul id={styles.placesList}></ul>
          <div id={styles.pagination}></div>
        </div>
      </div>

      <FormContainer>
        {placeList?.map((place) => (
          <label>{place.placeName}</label>
        ))}
        <label>Title</label>
        <InputEl
          type="text"
          id="title"
          name="title"
          placeholder="title..."
          ref={titleRef}
        />

        <label>place</label>
        <Chips placeList={placeList} onClickDelete={onClickDelete}></Chips>
        {/* <InputEl
          type="text"
          id="lname"
          name="lastname"
          placeholder="place.."
          ref={placeRef}
        /> */}

        <label>description</label>
        <TextAreaEl
          onChange={(e) => setText(e.target.value)}
          value={text}
          rows={4}
          placeholder="Comment"
          ref={descriptionRef}
          className={styles.input}
        />

        <InputSubmitContainer>
          <InputSubmit type="submit" value="Add" onClick={click}>
            Add
          </InputSubmit>
        </InputSubmitContainer>
      </FormContainer>
    </Layout>
  );

  function click() {
    const title = titleRef.current!.value;
    // const place = placeRef.current!.value;
    const description = descriptionRef.current!.value;
    if (
      title === undefined ||
      placeList === undefined ||
      description === undefined
    ) {
      messageDialog.error('Please fill out all inputs');
      return;
    }
    addDateRecord({
      title,
      placeList,
      description,
    });
  }
};
export default AddDateRecord;
