import { TestBookInfo } from '../__test__/TestingData'
import { AscendingBookInfo, DescendingBookInfo } from '../__test__/ExpectingData'
import { duplicateTestingDataGenerator, duplicateItemArrayGenerator, largeTestingDataGenerator } from '../__test__/DataGenerator'
import { mockedSetter } from '../__test__/MockSetter'
import { SortSystem } from './SortSystem'

describe("SortSystem class", () => {
    /**
     * 測試若items為空，SortSystem.getItems是否正確回傳空array
     */
    test("Should get an empty array from the items", () => {
        const sortSystem = new SortSystem();

        const result = sortSystem.getItems();

        expect(result).toStrictEqual([]);
    });

    /**
     * 測試SortSystem.getUpdateMessage是否回傳正確的字串
     */ 
    test("Should get a sort update msg from the updateMessage", () => {
        const sortSystem = new SortSystem();

        const result = sortSystem.getUpdateMessage();

        expect(result).toBe("Sort Update");
    });

    /**
     * 測試SortSystem.setSortType是否正確將sortType設為ASC
     */ 
    test("Should set the sortType to ASC", () => {
        const sortSystem = mockedSetter(new SortSystem(), 'sortType');

        sortSystem.setSortType(SortSystem.ASC);

        expect(sortSystem._mockVar).toBe('ASC');
    });

    /**
     * 測試SortSystem.setSortType是否正確將sortType設為DESC
     */
    test("Should set the sortType to DESC", () => {
        const sortSystem = mockedSetter(new SortSystem(), 'sortType');

        sortSystem.setSortType(SortSystem.DESC);

        expect(sortSystem._mockVar).toBe('DESC');
    });

    /**
     * 測試若SortSystem.setSortType傳入非法的字串 (非ASC或DESC)，是否擲出
     * It must be ASC or DESC錯誤
     */
    test("Should throw an error when setting the sortType with an unknown sort type", () => {
        const sortSystem = new SortSystem();

        expect(() => { sortSystem.setSortType('foo') }).toThrowError('It must be ASC or DESC');
    });

    /*
    test("Should throw an error when containing an undefined title item", async () => {
        const sortSystem = new SortSystem();
        const undefinedBookInfo: BookInfo[] = [
            {
                "ISBN": undefined,
                "title": undefined,
                "author": undefined
            },
            {
                "ISBN": undefined,
                "title": undefined,
                "author": undefined
            }
        ]

        sortSystem.setSortType(SortSystem.ASC);

        expect(async () => { await sortSystem.process(undefinedBookInfo); }).toThrowError();
    });
    */

    /**
     * 測試SortSystem.getSortType是否正確回傳ASC
     */
    test("Should get ASC from the sortType", () => {
        const sortSystem = new SortSystem();
    
        const sortType = sortSystem.getSortType();
    
        expect(sortType).toBe('ASC');
    });

    /**
     * 測試SortSystem.process是否正確將BookInfo升冪排序
     */
    test("Should sort by ascending", async () => {
        const sortSystem = new SortSystem();

        sortSystem.setSortType(SortSystem.ASC);

        await sortSystem.process(TestBookInfo);

        const result = sortSystem.getItems();

        expect(result.length).toBe(8);
        expect(result).toStrictEqual(AscendingBookInfo);
    });

    /**
     * 測試SortSystem.process是否正確將BookInfo升冪排序
     * (此測試案例使用 partial test oracle)
     */
    test("Should sort by ascending (partial test oracle)", async () => {
        const sortSystem = new SortSystem();

        sortSystem.setSortType(SortSystem.ASC);

        await sortSystem.process(TestBookInfo);

        const result = sortSystem.getItems();

        expect(result.length).toBe(8);
        
        //partial oracle
        for(let i = 0; i < result.length - 1; i += 2) {
            expect(result[i].title < result[i + 1].title);
        }
    });

    /**
     * 測試SortSystem.process是否正確將BookInfo降冪排序
     */
    test("Should sort by descending", async () => {
        const sortSystem = new SortSystem();

        sortSystem.setSortType(SortSystem.DESC);

        await sortSystem.process(TestBookInfo);

        const result = sortSystem.getItems();

        expect(result.length).toBe(8);
        expect(result).toStrictEqual(DescendingBookInfo);
    });

    /**
     * 測試SortSystem處理的BookInfo List為重複內容的array，
     * 運作是否正常
     */
    test("Should sort by descending (duplicate BookInfo array)", async () => {
        const sortSystem = new SortSystem();
        const duplicateTestBookInfo = duplicateTestingDataGenerator();
        const expectedResult = duplicateItemArrayGenerator({
            "ISBN": "148-71-77362-42-3",
            "title": "Game of Thrones II",
            "author": "J. R. R. Tolkien"
        }, 10);

        sortSystem.setSortType(SortSystem.DESC);

        await sortSystem.process(duplicateTestBookInfo);

        const result = sortSystem.getItems();

        expect(result.length).toBe(10);
        expect(result).toStrictEqual(expectedResult);
    });

    /**
     * 測試SortSystem處理的BookInfo List為稍大的array (4000筆資料)，
     * 運作是否正常
     */
    test("Should sort by descending (large BookInfo array)", async () => {
        const sortSystem = new SortSystem();
        const largeTestBookInfo = largeTestingDataGenerator();

        sortSystem.setSortType(SortSystem.DESC);

        await sortSystem.process(largeTestBookInfo);

        const result = sortSystem.getItems();

        expect(result.length).toBe(4000);
        expect(result.slice(0,500)).toStrictEqual(duplicateItemArrayGenerator(
            {
                "ISBN": "774-13-13326-60-1",
                "author": "Danielle Steel",
                "title": "To Kill a Mockingbird",
            }, 500
        ));
        expect(result.slice(3500,4000)).toStrictEqual(duplicateItemArrayGenerator(
            {
                "ISBN": "680-71-48243-17-0",
                "author": "Stephenie Meyer",
                "title": "Alice Adventures in Wonderland",
            }, 500
        ));
    });

    /**
     * 測試SortSystem處理的BookInfo List為空，是否正常回傳空array
     */
    test("Should get an empty result (empty BookInfo array)", async () => {
        const sortSystem = new SortSystem();

        sortSystem.setSortType(SortSystem.DESC);

        await sortSystem.process([]);

        const result = sortSystem.getItems();

        expect(result.length).toBe(0);
    });
});

