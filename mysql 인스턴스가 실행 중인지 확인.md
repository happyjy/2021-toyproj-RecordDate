mysql 인스턴스가 실행 중인지 확인
ps -ef | grep mysql

ps -ax | grep mysql

실행 중인 프로세스를 종료
kill -15 PID

mysql 소유자 확인
ls -laF /usr/local/var/mysql/

drwxr-x---    8 heejeong  staff       256 12 24 21:22 mysql/

소유자를 mysql로 변경한다.
sudo chown -R mysql /usr/local/var/mysql/

drwxr-x---    8 _mysql    staff       256 12 24 21:22 mysql/
https://gmlwjd9405.github.io/2018/12/23/error-mysql-start.html




sudo mysqld --initialize --user=jyoon

mysql.server start

CREATE USER 'jyoon'@'localhost' IDENTIFIED BY '1004';
ALTER USER 'jyoon'@'localhost' IDENTIFIED WITH mysql_native_password BY '1004';

CREATE USER 'test'@'localhost' IDENTIFIED BY 'newpassword';



//GRANT ALL PRIVILEGES ON database.* TO 'jyoon'@'localhost';

GRANT ALL PRIVILEGES ON *.* TO 'jyoon'@'localhost';

CREATE DATEBASE recordDate;