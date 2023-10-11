import { BookInfo } from "@externals/simple-db";
import { TestBookInfo } from '../__test__/TestingData'

export function largeTestingDataGenerator() {
    let arr: BookInfo[] = [];

    for(var i = 0; i < 500; ++i) {
        arr = arr.concat(TestBookInfo);
    }

    return arr;
}

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

export function duplicateItemArrayGenerator(item: BookInfo, amount: number) {
    let arr: BookInfo[] = [];

    for(var i = 0; i < amount; ++i) {
        arr.push(item);
    }

    return arr;
}