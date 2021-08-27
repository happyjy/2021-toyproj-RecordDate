- [테이블](#테이블)
  - [테이블 리스트](#테이블-리스트)
  - [테이블 쿼리](#테이블-쿼리)
- [modify column](#modify-column)
  - [users Table](#users-table)
  - [dateRecord Table](#daterecord-table)
  - [place Table](#place-table)
  - [dateImage Table](#dateimage-table)
  - [usersProfileImage Table](#usersprofileimage-table)
- [insert data](#insert-data)
- [select query](#select-query)
  - [dateRecord query list](#daterecord-query-list)
  - [select & date type](#select--date-type)

# 테이블

## 테이블 리스트

    - users
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

## 테이블 쿼리

```sql

DROP TABLE users;
DROP TABLE couple;

DROP TABLE dateRecord;
DROP TABLE place;
DROP TABLE image;


CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    birthday VARCHAR(100),
    gender VARCHAR(10),
    profileImageUrl VARCHAR(255) NOT NULL,
    thumbnailImageUrl VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS couple (
    couple_id INT AUTO_INCREMENT PRIMARY KEY,
    couple1_id INT,
    couple2_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS dateRecord (
    dateRecord_id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT NOT NULL,
    dateTime date NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    isDeleted BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_id)
      REFERENCES couple (couple_id)
      ON UPDATE RESTRICT
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

CREATE TABLE IF NOT EXISTS userProfileImage (
    userProfileImage_id INT AUTO_INCREMENT,
    user_id INT,
    dateImage_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userProfileImage_id, user_id),
    FOREIGN KEY (user_id)
        REFERENCES users (user_id)
);
        -- ON UPDATE RESTRICT ON DELETE CASCADE
```

# modify column

## users Table

```
ALTER TABLE user RENAME TO users;
ALTER TABLE users RENAME COLUMN use_id TO user_id;
* primary key 추가 방법1 - primary key 있는 상태
  ALTER TABLE users DROP PRIMARY KEY, ADD PRIMARY KEY(user_id, email);
* primary key 추가 방법2 - primary key 정하지 않았을 때
  ALTER TABLE users ADD PRIMARY KEY (email);
```

## dateRecord Table

```sql
ALTER TABLE dateRecord RENAME COLUMN description TO comment;
ALTER TABLE dateRecord MODIFY placeId VARCHAR(255);
ALTER TABLE dateRecord DROP COLUMN placeId;
ALTER TABLE dateRecord modify isDelete BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE dateRecord ADD COLUMN dateTime DATE NOT NULL DEFAULT '2021-08-20' AFTER dateRecord_id;
ALTER TABLE dateRecord MODIFY COLUMN dateTime DATE DEFAULT '9999-01-01';
ALTER TABLE dateRecord MODIFY COLUMN dateTime DATE NOT NULL;

ALTER TABLE dateRecord MODIFY COLUMN couple_id INT NOT NULL; DEFAULT NULL;
UPDATE dateRecord SET couple_id = 0 WHERE couple_id IS NULL;

DELETE FROM dateRecord WHERE dateRecord_id=2;

ALTER TABLE dateRecord ADD COLUMN couple_id INT AFTER dateRecord_id;
ALTER TABLE dateRecord ADD FOREIGN KEY (couple_id);
ALTER TABLE dateRecord ADD FOREIGN KEY (couple_id)
  REFERENCES couple (couple_id)
  ON UPDATE RESTRICT;

```

## place Table

```sql
ALTER TABLE place modify latLong VARCHAR(255);
ALTER TABLE place modify latLong VARCHAR(255);
ALTER TABLE place ADD COLUMN address VARCHAR(100) AFTER place_name;
ALTER TABLE place DROP COLUMN isDeleted;
ALTER TABLE place ADD COLUMN isDeleted BOOLEAN NOT NULL DEFAULT 0 AFTER latLong;


ALTER TABLE place DROP COLUMN couple_id;


```

## dateImage Table

```sql
ALTER TABLE dateImage RENAME COLUMN file_name TO dateImage_name;
ALTER TABLE dateImage ADD COLUMN isDeleted BOOLEAN NOT NULL DEFAULT 0 AFTER dateImage_name;

update dateRecord set isDelete = 0;
update place set place_name = '안양천 텐트' where place_id = 1;
update place set place_name = '안양천 텐트', address = '서울시 영등포구' where dateRecord_id = 23;
update dateImage set isDeleted = '1' where dateImage_id = 23;

```

## usersProfileImage Table

```
ALTER TABLE userProfileImage RENAME TO usersProfileImage;
```

# insert data

```sql
  INSERT INTO dateRecord (title, description, image) VALUES ('첫번째 데이트', '안양천 텐트가지고 갔어요', 'img/안양천.png');
  INSERT INTO dateRecord (title, description, image) VALUES ('두번째 데이트', '사유카페 한강진역, 리틀넥 저녁', 'img/안양천.png');
  INSERT INTO dateRecord (title, description, image) VALUES ('세번째 데이트', '스콘 에어프라이기로 만들기, 채선당 샤브샤브', 'img/안양천.png');

  INSERT INTO place (dateRecord_id, place_name, latLong) VALUES (23, '안양천', '123.000, 321.000');
  INSERT INTO place (dateRecord_id, place_name, latLong) VALUES (24, '사유카페', '123.000, 321.000');
  INSERT INTO place (dateRecord_id, place_name, latLong) VALUES (24, '한강진리틀넥', '123.000, 321.000');
  INSERT INTO place (dateRecord_id, place_name, latLong) VALUES (25, '양평동롯데마드 채선당', '123.000, 321.000');
  INSERT INTO place (dateRecord_id, place_name, latLong) VALUES (25, '유니네', '123.000, 321.000');


  INSERT INTO couple (couple1_id, couple2_id) VALUES (1, 0);
```

# select query

## dateRecord query list

```sql
SELECT @n:=@n+1 dateCnt, t.dateRecord_id
                          , t.couple_id
                          , t.dateTime
                          , t.title
                          , t.description
                          , t.image
                          , t.created_at
    FROM (SELECT @n:=( SELECT count(*)
                        FROM dateRecord
                        WHERE 1=1
                        AND ISDELETED = 0
                        AND dateTime < '2021-02-01')) initvars, (SELECT *
                                                                   FROM dateRecord
                                                                  WHERE 1=1
                                                                    AND ISDELETED = 0
                                                                    AND dateTime BETWEEN '2021-02-01' AND '2021-08-31'
                                                              ORDER BY dateTime ASC) t
  WHERE 1=1
  ORDER BY DATECNT desc;
```

```sql
INSERT INTO users (token, email, nickname, birthday, gender)
VALUES ("aaa", "aaa@gmail.com", "0101", "man")
SELECT token, email, nickname, birthday, gender
FROM  users
WHERE NOT EXISTS (SELECT *
                  FROM users
                  WHERE suppliers.supplier_id = orders.supplier_id);


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

```sql
SELECT B.place_name
      FROM dateRecord as A
INNER JOIN 주소 as B
        ON A.dateRecord_id = B.dateRecord_id
  limit 1;
```

## select & date type

```sql
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
