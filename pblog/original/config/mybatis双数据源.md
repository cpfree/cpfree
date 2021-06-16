# 双数据源

## 数据源分开

### 场景

1. 数据源互相没有联系
2. spring + mybatis + mysql + oracle

### 代码

其他使用方式同一般单数据源;

配置文件

```xml
    <!-- =============================================================== -->
    <!-- oracle Data Source -->
    <!-- =============================================================== -->
    <bean id="oracleSqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="oracleDataSource"/>
        <property name="mapperLocations">
            <array>
                <value>classpath:ats/ity/common/dao/oracle/*.xml</value>
            </array>
        </property>
    </bean>

    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="ats.ity.common.dao.oracle"/>
        <property name="sqlSessionFactoryBeanName" value="oracleSqlSessionFactory"/>
    </bean>

    <bean id="oracleDataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
        <property name="driverClassName" value="${oracle.driverClass}"/>
        <property name="url" value="${oracle.jdbcUrl}"/>
        <property name="username" value="${oracle.name}"/>
        <property name="password" value="${oracle.password}"/>
        <property name="maxActive" value="3"/>
        <property name="maxIdle" value="0"/>
        <property name="maxWait" value="${jdbcMaxWait}"/>
        <property name="validationQueryTimeout" value="${jdbcValidationTimeOut}"/>
        <property name="testOnBorrow" value="true"/>
    </bean>
```
