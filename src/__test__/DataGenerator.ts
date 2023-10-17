import { BookInfo } from "@externals/simple-db";
import { TestBookInfo } from '../__test__/TestingData'

/**
 * largeTestingDataGenerator會使用TestBookInfo假資料新造出
 * 一個重複TestBookInfo 500次的新arrary
 * @returns 重複TestBookInfo 500次的新arrary
 */
export function largeTestingDataGenerator() {
    let arr: BookInfo[] = [];

    for(var i = 0; i < 500; ++i) {
        arr = arr.concat(TestBookInfo);
    }

    return arr;
}

/**
 * duplicateTestingDataGenerator會生成一個單一筆TestBookInfo
 * 重複10次的新array
 * @returns 單一筆TestBookInfo重複10次的新array
 */
export function duplicateTestingDataGenerator() {
    let arr: BookInfo[] = [];

    for(var i = 0; i < 10; ++i) {
        arr.push({
            "ISBN": "148-71-77362-42-3",
            "title": "Game of Thrones II",
            "author": "J. R. R. Tolkien"
        });
    }

    return arr;
}

/**
 * duplicateItemArrayGenerator會使用傳入的item資料製作
 * 製作出一個將item重複amount次的新array
 * @param item 欲重複的資料
 * @param amount 重複次數
 * @returns 含有 item 並重複 amount 次的新array
 */
export function duplicateItemArrayGenerator(item: BookInfo, amount: number) {
    let arr: BookInfo[] = [];

    for(var i = 0; i < amount; ++i) {
        arr.push(item);
    }

    return arr;
}

/**
 * repeatArrayGenerator會使用傳入的array與自身重複連接
 * times次來製作出新array
 * @param array 欲重複的array
 * @param times 重複的次數
 * @returns 將 array 重複連接 times 次的新array
 */
export function repeatArrayGenerator(array: BookInfo[], times: number) {
    let arr: BookInfo[] = [];

    for(var i = 0; i < times; ++i) {
        arr = arr.concat(array);
    }

    return arr;
}