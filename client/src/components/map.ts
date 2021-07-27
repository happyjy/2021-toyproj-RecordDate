import { placeListType } from '../types';
import { default as markerStart } from '../assets/img/markerStar.png';

export default (
  mapRef: any,
  inputEl: any,
  setCb: any,
  placeList: placeListType[],
  setPlaceList: any,
) => {
  // 마커를 담을 배열입니다
  let markers: any[] = [];
  let placeMakerList: any[] = [];

  // var mapContainer = document.getElementById('map'), // 지도를 표시할 div
  var mapContainer = mapRef.current, // 지도를 표시할 div
    mapOption = {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

  // 지도를 생성합니다
  let map = new window.kakao.maps.Map(mapContainer, mapOption);

  setTimeout(() => {
    var bounds = new window.kakao.maps.LatLngBounds();
    const imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
    const imageSize = new window.kakao.maps.Size(24, 35);

    var marker;
    for (let i = 0; i < placeList.length; i++) {
      // 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
      let latLong = placeList[i].latLong.split(', ');
      let placePosition1 = new window.kakao.maps.LatLng(latLong[0], latLong[1]);
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
      );

      marker = new window.kakao.maps.Marker({
        position: placePosition1,
        title: placeList[i].placeName, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
      });
      marker.setMap(map);

      // LatLngBounds 객체에 좌표를 추가합니다
      placeMakerList[marker.n] = marker;
      bounds.extend(placePosition1);
    }
    map.setBounds(bounds);
  }, 500);

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
      var mapKeyword = input?.value;

      if (!mapKeyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
      }

      // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
      ps.keywordSearch(mapKeyword, placesSearchCB);
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
      mapRef?.current?.parentElement?.children[1].getElementsByTagName('ul')[0];

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
        marker = addMarker(placePosition, i, places),
        itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      bounds.extend(placePosition);

      // 마커와 검색결과 항목에 mouseover 했을때
      // 해당 장소에 인포윈도우에 장소명을 표시합니다
      // mouseout 했을 때는 인포윈도우를 닫습니다
      (function (marker, { place_name: title, road_address_name, x, y }) {
        window.kakao.maps.event.addListener(marker, 'click', function () {
          setPlaceList((placeList: any) => {
            const result = placeList.some(
              (place: any) => place.latLong === `${y}, ${x}`,
            );
            if (result) return [...placeList];
            return [
              ...placeList,
              {
                id: placeList.length,
                placeName: title,
                address: road_address_name,
                latLong: `${y}, ${x}`,
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
      })(marker, places[i]);

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
      el.querySelector<HTMLElement>('.gray')!.style.cssText = `color:#8a8a8a;`;
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
      el.querySelector<HTMLElement>('.gray')!.style.cssText = `color:#8a8a8a;`;
    }

    el.onclick = (e) => {
      setPlaceList((placeList: any) => {
        const result = placeList.some(
          (place: any) => place.latLong === `${places.y}, ${places.x}`,
        );
        if (result) return [...placeList];
        return [
          ...placeList,
          {
            id: placeList.length,
            placeName: places.place_name,
            address: places.road_address_name,
            latLong: `${places.y}, ${places.x}`,
          },
        ];
      });
    };
    return el;
  }

  // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
  function addMarker(position: any, idx: any, places?: any) {
    // if (idx === places.length - 1) addPlace();

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

  function addPlace() {
    // 장소 표기
    // 마커 이미지의 이미지 주소입니다
    const imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

    for (let i = 0; i < placeList.length; i++) {
      // 마커 이미지의 이미지 크기 입니다
      const imageSize = new window.kakao.maps.Size(24, 35);

      // 마커 이미지를 생성합니다
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
      );

      var latLong = placeList[i].latLong.split(', ');
      var placePosition1 = new window.kakao.maps.LatLng(latLong[0], latLong[1]);
      // 마커를 생성합니다
      const marker = new window.kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: placePosition1, // 마커를 표시할 위치
        title: placeList[i].placeName, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
      });

      placeMakerList[marker.n] = marker;
    }
  }

  return [placeMakerList];
};
