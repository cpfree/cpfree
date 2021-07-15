# oracle 查询失败问题

## Oracle 版本

Oracle Database 12c Enterprise Edition Release 12.2.0.1.0 - 64bit Production
dbUtils 1.7;

## 问题

Oracle char cun

```sql
CREATE TABLE "TEST_DEMO" (
  "ID" VARCHAR2(36 BYTE) VISIBLE NOT NULL,
  "CHAR_FIELD" CHAR(2 BYTE) VISIBLE,
  "VARCHAR_FIELD" VARCHAR2(2 BYTE) VISIBLE
)
```

CHAR的长度是固定的，对于CHAR (2) 来说, 存储字符串"a", 实际上存储的是字符串 "a ", 注意后面有一个空格.

此时如果进行查询的话, 直接使用 `SELECT * FROM TEST_DEMO where CHAR_FIELD = 'a'`, 是可以查询到数据的, 但是如果使用jdbc的 prepareStatement的话, 则传递的参数应该是 "a ", 如果仅仅传递一个 "a", 则是查询不到数据的.

```java
// 插入一条数据, 则插入之后
final String insetSql = "INSERT INTO TEST_DEMO(ID, CHAR_FIELD, VARCHAR_FIELD) VALUES(?, ?, ?)";
// CHAR_FIELD 字段实际存储的是 "a "
queryRunner.execute(connection, insetSql, UUID.randomUUID().toString(), "a", "a");

// 可以查询出数据, 查询到的CHAR_FIELD 字段数据是 "a "
System.out.println(queryRunner.query(connection, "SELECT * FROM TEST_DEMO where CHAR_FIELD = 'a'", new MapListHandler()));
// 因为数据库里面存储的是 "a ", 因此使用参数 "a" 查询不到数据
System.out.println(queryRunner.query(connection, "SELECT * FROM TEST_DEMO where CHAR_FIELD = ?", new MapListHandler(), "a"));
// 可以查询到数据, 查询到的CHAR_FIELD 字段数据是 "a "
System.out.println(queryRunner.query(connection, "SELECT * FROM TEST_DEMO where CHAR_FIELD = ?", new MapListHandler(), "a "));
```

## VARCHAR2

VARCHAR2的长度是可以变化的， 比如，存储字符串"abc"
对于CHAR (20)，表示你存储的字符将占20个字节(包括17个空字符)，而同样的VARCHAR2 (20)则只占用3个字节的长度，20只是最大值，当你存储的字符小于20时，按实际长度存储。

VARCHAR2比CHAR节省空间，在效率上比CHAR会稍微差一些，即要想获得效率，就必须牺牲一定的空间，这也就是我们在数据库设计上常说的‘以空间换效率’。
VARCHAR2虽然比CHAR节省空间，但是如果一个VARCHAR2列经常被修改，而且每次被修改的数据的长度不同，这会引起‘行迁移’(Row Migration)现象，而这造成多余的I/O，是数据库设计和调整中要尽力避免的，在这种情况下用CHAR代替VARCHAR2会更好一些。
