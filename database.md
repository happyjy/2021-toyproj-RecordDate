- [테이블](#테이블)
- [modify column](#modify-column)
  - [select & date](#select--date)

# 테이블

- 종류
    - dateRecord
    - place
    - image
    - todolist
        - 할것
        - 정보
        - 위치

```
SHOW TABLES;
```

```
  CREATE DATEBASE record_date

  use record_date;

  CREATE TABLE CUSTOMER (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image VARCHAR(1024),
    name VARCHAR(64),
    birthday VARCHAR(64),
    gender VARCHAR(64),
    job VARCHAR(64)
  );

  CREATE TABLE CUSTOMER (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image VARCHAR(1024),
    name VARCHAR(64),
    birthday VARCHAR(64),
    gender VARCHAR(64),
    job VARCHAR(64),
  ) DEFAULT CHARACTER SET UTF8 COLLATE utf8_general_ci;

  INSERT INTO CUSTOMER VALUES (1, './img/man1.jpg', '홍길동', '900101', '남자', '청년');
  INSERT INTO CUSTOMER VALUES (2, './img/man2.jpg', '홍길순', '900111', '남자', '앱개발자');
  INSERT INTO CUSTOMER VALUES (3, './img/man3.jpg', '홍길덩', '900121', '남자', '웹개발자');

  INSERT INTO CUSTOMER (CustomerName, ContactName, Address, City, PostalCode, Country)
  VALUES ('Cardinal', 'Tom B. Erichsen', 'Skagen 21', 'Stavanger', '4006', 'Norway');
```

```

DROP TABLE dateRecord;
DROP TABLE place;


CREATE TABLE IF NOT EXISTS dateRecord (
    dateRecord_id INT AUTO_INCREMENT PRIMARY KEY,

    dateTime date NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    isDeleted BOOLEAN NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS place (
    place_id INT AUTO_INCREMENT,
    dateRecord_id INT,

    place_name VARCHAR(255) NOT NULL,
    address VARCHAR(100)
    latLong VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (place_id, dateRecord_id),
    FOREIGN KEY (dateRecord_id)
        REFERENCES dateRecord (dateRecord_id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dateImage (
    dateImage_id INT AUTO_INCREMENT,
    dateRecord_id INT,

    dateImage_name VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (dateImage_id, dateRecord_id),
    FOREIGN KEY (dateRecord_id)
        REFERENCES dateRecord (dateRecord_id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);
```

# modify column

```
ALTER TABLE dateRecord RENAME COLUMN description TO comment;
ALTER TABLE dateRecord MODIFY placeId VARCHAR(255);
ALTER TABLE dateRecord DROP COLUMN placeId;
ALTER TABLE dateRecord modify isDelete BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE dateRecord ADD COLUMN dateTime DATE NOT NULL DEFAULT '2021-08-20' AFTER dateRecord_id;
ALTER TABLE dateRecord ALTER COLUMN dateTime SET DEFAULT date;



DELETE FROM dateRecord WHERE dateRecord_id=2;

ALTER TABLE place modify latLong VARCHAR(255);
ALTER TABLE place modify latLong VARCHAR(255);
ALTER TABLE place ADD COLUMN address VARCHAR(100) AFTER place_name;
ALTER TABLE place DROP COLUMN isDeleted;
ALTER TABLE place ADD COLUMN isDeleted BOOLEAN NOT NULL DEFAULT 0 AFTER latLong;

ALTER TABLE dateImage RENAME COLUMN file_name TO dateImage_name;
ALTER TABLE dateImage ADD COLUMN isDeleted BOOLEAN NOT NULL DEFAULT 0 AFTER dateImage_name;

update dateRecord set isDelete = 0;
update place set place_name = '안양천 텐트' where place_id = 1;
update place set place_name = '안양천 텐트', address = '서울시 영등포구' where dateRecord_id = 23;
update dateImage set isDeleted = '1' where dateImage_id = 23;


```

```


  INSERT INTO dateRecord (title, description, image) VALUES ('첫번째 데이트', '안양천 텐트가지고 갔어요', 'img/안양천.png');
  INSERT INTO dateRecord (title, description, image) VALUES ('두번째 데이트', '사유카페 한강진역, 리틀넥 저녁', 'img/안양천.png');
  INSERT INTO dateRecord (title, description, image) VALUES ('세번째 데이트', '스콘 에어프라이기로 만들기, 채선당 샤브샤브', 'img/안양천.png');

  INSERT INTO place (dateRecord_id, place_name, latLong) VALUES (23, '안양천', '123.000, 321.000');
  INSERT INTO place (dateRecord_id, place_name, latLong) VALUES (24, '사유카페', '123.000, 321.000');
  INSERT INTO place (dateRecord_id, place_name, latLong) VALUES (24, '한강진리틀넥', '123.000, 321.000');
  INSERT INTO place (dateRecord_id, place_name, latLong) VALUES (25, '양평동롯데마드 채선당', '123.000, 321.000');
  INSERT INTO place (dateRecord_id, place_name, latLong) VALUES (25, '유니네', '123.000, 321.000');



SELECT * FROM dateRecord;

    SELECT A.dateRecord_id, A.title, A.description, A.created_at
         , B.place_name, B.latLong
      FROM dateRecord as A
INNER JOIN place as B
        ON A.dateRecord_id = B.dateRecord_id;


    SELECT title, description
         , (SELECT B.place_name
              FROM dateRecord as A
        INNER JOIN place as B
                ON A.dateRecord_id = B.dateRecord_id
                limit 1)
      FROM dateRecord;

```

SELECT B.place_name
      FROM dateRecord as A
INNER JOIN 주소 as B
        ON A.dateRecord_id = B.dateRecord_id
  limit 1;

## select & date

```
select * from daterecord where 1=1 and created_at between '2021-08-05' and '2021-08-14';


SELECT dateRecord_id,
       title,
       description,
       image,
       created_at
  FROM DATERECORD
 WHERE ISDELETED = 0
   AND created_at >= '2021-01-01'
   AND created_at <= '2021-07-01'
 order by created_at desc
```
