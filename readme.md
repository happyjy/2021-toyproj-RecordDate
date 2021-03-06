# 스프린트 일지

현재(2021-08-21) 5번째 스프린트 진행중이며
각 스프린트 마다 "기획, ISSUE"등을 작성했습니다.

<https://happyjy0109.notion.site/fc008fca77e2466cb9f81cd272d03358>

# Front-end 컴포넌트 직접 작업한 list

* lib를 사용하지 않고 직접 구현한 컴포넌트 list
    * Modal
    * Carousel
    * Loader
    * Chips
    * FileUpload
    * Simple Search
    * Calendar

* 알고리즘
    * 메인 리스트 "x번째" 데이트(DB sql query 작업)
    * 지도에 위치 보여주는 데이터 구조

* 문제 해결
    * vanilla.js로 만들어진 카카오 맵 적용
    * vanilla.js로 만들어진 캘린더 코어 적용(IIFE)
    * 호스팅(heroku-FE, BE, DB, AWS s3)

# 계기

* 아이폰 메모 공유를 통해서 데이트 기록을하다 실시간으로 원활하게 되지 않았다.
* 지도에 표시하고 싶은 요구사항이 있었다.
* 장거리 연애로 일주일에 한번 보는 데이트가 소중하게 느껴져 기록으로 오랫동안 남기고 싶었다.
* 그렇게 생각한게 데이트 기록 앱이다.
* 그리고 앞으로 만들고 싶은앱이 내가 인생 전체에 걸쳐서 해야할일을 작성하고 해결 해나가는것을 기록하는 웹앱도 만들예정이다.
    * 이렇게 해야할일, divide and conquer 해나가야 내 삶의 균형이 이뤄질 것이라고 생각했기 때문이다.

    ```
    → decade → demi-decade → triennial
    → yearly
    → quarter → monthly → weekly
    ```

# 리스트 메인 페이지

* 데이트 순서
    * sql쿼리로 카운팅
* 지도에 데이트 순서 표기
    * 중복되는 장소 filter 알고리즘 적용
* [x번째] 클릭시 지도가 확대 되면서 방문한 장소 확대
* 브라우저 크기 조절시 브라우저 크기에 맞게 지도 리사이즈
    * rebound 적용으로 매순간 동작하지 않음
* 검색
    * 키워드 검색
    * 연도별, 필더 기능

# 추가 페이지

* 달력 컴포넌트 직접 개발
* 파일업로드 컴포넌트 직접 개발
* carousel 컴포넌트 직접 개발
* chips 컴포넌트 직접 개발
* 파일 업로드 multer lib, s3 service 사용

# 헤더 프로필아이콘

* 레이어 컴포넌트 직접 개발
