---
keys: gson,json
type: trim
url: <https://www.jb51.net/article/87159.htm>
id: 211225-161027
---

# Gson

> - gson 开源: <https://github.com/google/gson>
> - 参考网址: <https://www.jb51.net/article/87159.htm>

## 简介

1. Gson 对象在处理 Json 时不会保存任何状态，所以使用者能够很轻松的对同一个 Gson 对象进行多次序列化、反序列化等操作。
2. Gson 可以很轻松地序列化嵌套类，且能够反序列化静态的嵌套类。Gson 无法自动地反序列化纯粹的内部类，是因为内部类的无参构造函数需要引用包含它的对象（即外部类的实例）。要反序列化静态类，可以将内部类静态化或者提供一个自定义的实例创造器（instance creator）。
3. gson 处理对象

   - 推荐使用私有字段
   - 当前类（也包括其父类）中的所有字段都默认会被序列化/反序列化。
   - 某字段在声明时使用了关键字 transient，默认情况下不会被序列化/反序列化。
   - 序列化时候 null 字段会被跳过, 反序列化时，类中有但 Json 中没有的字段将设值为 null。
   - 在外部类(outer classes)中的内部类（inner classes）、匿名类（anonymous classes）和局部类（local classes）中的字段不会被序列化/反序列化。

## 基本使用

### 1. 处理数组

```java
Gson gson = new Gson();
int[] ints = {1, 2, 3, 4, 5};
String[] strings = {"abc", "def", "ghi"};

//Serialization
gson.toJson(ints);  ==> prints [1,2,3,4,5]
gson.toJson(strings); ==> prints ["abc", "def", "ghi"]

//Deserialization
int[] ints2 = gson.fromJson("[1,2,3,4,5]", int[].class);
==> ints2 will be same as ints
```

### 2. 处理集合

```java
Gson gson = new Gson();
Collection<Integer> ints = Lists.immutableList(1,2,3,4,5);

//Serialization
String json = gson.toJson(ints); //==> json is [1,2,3,4,5]

//Deserialization
Type collectionType = new TypeToken<Collection<Integer>>(){}.getType();
Collection<Integer> ints2 = gson.fromJson(json, collectionType);
//ints2 is same as ints
```

> 反序列化时，集合必须是指定的泛型。使用 `Type` 类来帮助反序列化. 如上面的 `new TypeToken<Collection<Integer>>(){}.getType()`

## 自定义序列化/反序列化

使用 GsonBuilder 创建 gson 对象

使用类 GsonBuilder 在创建 Gson 对象的同时设置一些选项

示例, `my-chess` 中的 json 类

```java
package cn.cpf.app.chess.util;

import cn.cpf.app.chess.ctrl.Situation;
import cn.cpf.app.chess.ctrl.SituationRecord;
import cn.cpf.app.chess.modal.Part;
import cn.cpf.app.chess.modal.Piece;
import cn.cpf.app.chess.modal.Place;
import cn.cpf.app.chess.modal.StepRecord;
import cn.cpf.app.chess.swing.ChessPiece;
import com.github.cosycode.common.ext.hub.LazySingleton;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.List;

/**
 * <b>Description : </b> Json 解析工具类
 * <p>
 * <b>created in </b> 2021/12/20
 * </p>
 **/
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class JsonUtils {

    // 同时使用类序列化器和反序列化器, 来帮助序列化和反序列化 ChessPiece 对象
    private static class ChessPieceGsonSerializer implements JsonSerializer<ChessPiece>, JsonDeserializer<ChessPiece> {

        @Override
        public ChessPiece deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            final JsonObject jsonObject = json.getAsJsonObject();
            final String name = jsonObject.getAsJsonPrimitive("name").getAsString();
            final String piece = jsonObject.getAsJsonPrimitive("piece").getAsString();
            final Place place = context.deserialize(jsonObject.getAsJsonObject("place"), Place.class);
            return new ChessPiece(name, Piece.valueOf(piece), place);
        }

        @Override
        public JsonElement serialize(cn.cpf.app.chess.swing.ChessPiece src, Type typeOfSrc, JsonSerializationContext context) {
            JsonObject object = new JsonObject();
            object.addProperty("name", src.name);
            object.addProperty("piece", src.piece.name());
            object.add("place", context.serialize(src.getPlace()));
            return object;
        }

    }

    private static class PlaceSerializer implements JsonSerializer<Place>, JsonDeserializer<Place> {

        @Override
        public JsonElement serialize(Place src, Type typeOfSrc, JsonSerializationContext context) {
            JsonObject object = new JsonObject();
            object.addProperty("x", src.x);
            object.addProperty("y", src.y);
            return object;
        }

        @Override
        public Place deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            final JsonObject jsonObject = json.getAsJsonObject();
            final int x = jsonObject.getAsJsonPrimitive("x").getAsInt();
            final int y = jsonObject.getAsJsonPrimitive("y").getAsInt();
            if (x == -1 || y == -1) {
                return Place.NULL_PLACE;
            } else {
                return Place.of(x, y);
            }
        }
    }

    // 反序列化器
    private static class SituationRecordSerializer implements JsonDeserializer<SituationRecord> {

        @Override
        public SituationRecord deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            final JsonObject jsonObject = json.getAsJsonObject();
            final List<StepRecord> records = context.deserialize(jsonObject.getAsJsonArray("records"),
                    new TypeToken<List<StepRecord>>() {}.getType());
            return new SituationRecord(records);
        }
    }

    // 反序列化器
    private static class SituationSerializer implements JsonDeserializer<Situation> {

        @Override
        public Situation deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            final JsonObject jsonObject = json.getAsJsonObject();
            final SituationRecord deserialize = context.deserialize(jsonObject.getAsJsonObject("situationRecord"), SituationRecord.class);
            final LocalDateTime situationStartTime = context.deserialize(jsonObject.getAsJsonObject("situationStartTime"), LocalDateTime.class);
            final Part nextPart = Part.valueOf(jsonObject.getAsJsonPrimitive("nextPart").getAsString());
            final List<ChessPiece> pieceList = context.deserialize(jsonObject.getAsJsonArray("pieceList"), new TypeToken<List<ChessPiece>>() {
            }.getType());
            return new Situation(pieceList, deserialize, nextPart, situationStartTime);
        }
    }

    /**
     * GsonBuilder 单例(注册了反序列化器的 gsonBuilder )
     */
    private static final LazySingleton<GsonBuilder> gsonBuilderSingleton = LazySingleton.of(() -> {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(Place.class, new PlaceSerializer());
        gsonBuilder.registerTypeAdapter(ChessPiece.class, new ChessPieceGsonSerializer());
        gsonBuilder.registerTypeAdapter(Situation.class, new SituationSerializer());
        gsonBuilder.registerTypeAdapter(SituationRecord.class, new SituationRecordSerializer());
        return gsonBuilder;
    });

    public static String toJson(Object object) {
        return gsonBuilderSingleton.instance().create().toJson(object);
    }

    public static <T> T fromJson(String json, Class<T> classOfT) {
        return gsonBuilderSingleton.instance().create().fromJson(json, classOfT);
    }

}
```

## 其他功能

### 1. 优雅输出(`setPrettyPrinting()`)

Gson 中 Json 默认的输出是紧凑的 JSON 格式。另外，null 字段不会被输出（注意：在集合和数组对象中 null 会被保留的）。

如果要输出的优美些，你需要使用 GsonBuilder 对 Gson 的实例进行配置。其默认情况下每行 80 个字符，缩进使用 2 个字符，右边距是 4 个字符。

下面的示例展示了如何让 Gson 实例使用 JsonPrintFormatter，而不是使用默认的 JsonCompactFormatter。

```java
Gson gson = new GsonBuilder().setPrettyPrinting().create();
String jsonOutput = gson.toJson(someObject);
```

### 2. 在序列化器和反序列化器之间共享状态

有时你会需要在序列化器和反序列化器之间共享状态，你可以使用下面的三个方法达到目的：

1. 在一个静态字段中存储共享状态
2. 将序列化/反序列化器声明为一个父类型的内部类，然后使用父类型的实例的字段存储共享状态
3. 使用 Java 中的 ThreadLocal

前两种方法不是线程安全的，第三种是。

### 3. GSON 解析 null 出错解决办法

```java
public void String main(String[] args){
   Gson gson = new GsonBuilder().registerTypeAdapterFactory(new NullStringToEmptyAdapterFactory()).create();
   //然后用上面一行写的gson来序列化和反序列化实体类type
   gson.fromJson(json, type);
   gson.toJson(type);
}

//NullStringToEmptyAdapterFactory的代码
public class NullStringToEmptyAdapterFactory<T> implements TypeAdapterFactory {
    @SuppressWarnings("unchecked")
    public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
        Class<T> rawType = (Class<T>) type.getRawType();
        if (rawType != String.class) {
            return null;
        }
        return (TypeAdapter<T>) new StringNullAdapter();
    }
}

// StringNullAdapter代码
public class StringNullAdapter extends TypeAdapter<String> {
    @Override
    public String read(JsonReader reader) throws IOException {
        // TODO Auto-generated method stub
        if (reader.peek() == JsonToken.NULL) {
            reader.nextNull();
            return "";
        }
        return reader.nextString();
    }

    @Override
    public void write(JsonWriter writer, String value)
        throws IOException {
        // TODO Auto-generated method stub
        if (value == null) {
            writer.nullValue();
            return;
        }
        writer.value(value);
    }
}

```
