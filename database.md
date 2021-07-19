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


  use record_date;
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

# 현아랑

## 테이블

* 종류
  * dateRecord
  * place
  
  * todolist
    * 할것
    * 정보
    * 위치

  *

```
SHOW TABLES;
```

```

DROP TABLE dateRecord;
DROP TABLE place;


CREATE TABLE IF NOT EXISTS dateRecord (
    dateRecord_id INT AUTO_INCREMENT PRIMARY KEY,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),

    isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS place (
    place_id INT AUTO_INCREMENT,
    dateRecord_id INT,

    place_name VARCHAR(255) NOT NULL,
    latLong VARCHAR(255) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (place_id, dateRecord_id),
    FOREIGN KEY (dateRecord_id)
        REFERENCES dateRecord (dateRecord_id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);
```

# modify column

```
ALTER TABLE dateRecord RENAME description TO comment;
ALTER TABLE dateRecord modify placeId VARCHAR(255);
ALTER TABLE dateRecord DROP COLUMN placeId;
DELETE FROM dateRecord WHERE dateRecord_id=2;

ALTER TABLE place modify latLong VARCHAR(255);
ALTER TABLE place modify latLong VARCHAR(255);



ALTER TABLE place
ADD COLUMN address VARCHAR(100) AFTER place_name;

update place set place_name = '안양천 텐트' where place_id = 1;
update place set address = '서울시 영등포구' where dateRecord_id = 1;

```

```


  INSERT INTO dateRecord (title, description, placeId, image) VALUES ('첫번째 데이트', '안양천 텐트가지고 갔엉요', '', 'img/안양천.png');

  INSERT INTO place (dateRecord_id, place_name, latLong) VALUES (1, '안양천', '123.000, 321.000');
  INSERT INTO place (dateRecord_id, place_name, latLong) VALUES (1, '싸가정곱창', '23.000, 33.000');


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
