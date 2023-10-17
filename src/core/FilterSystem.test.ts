import { TestBookInfo } from '../__test__/TestingData'
import { mockedSetter } from '../__test__/MockSetter'
import { largeTestingDataGenerator, duplicateTestingDataGenerator, duplicateItemArrayGenerator } from '../__test__/DataGenerator'
import { FilterSystem } from './FilterSystem'
import { BookInfo } from '@externals/simple-db'

describe("FilterSystem class", () => {
    /**
     * 測試若items為空，FilterSystem.getItems是否正確回傳空array
     */
    test("Should get an empty array from the items", () => {
        const filterSystem = new FilterSystem();

        const result = filterSystem.getItems();

        expect(result).toStrictEqual([]);
    });

    /**
     * 測試FilterSystem.getUpdateMessage是否回傳正確的字串
     */ 
    test("Should get a filter update msg from the updateMessage", () => {
        const filterSystem = new FilterSystem();

        const result = filterSystem.getUpdateMessage();

        expect(result).toBe("Filter Update");
    });

    /**
     * 測試FilterSystem.setFilterWord是否正確將filterWord設定為foo
     */ 
    test("Should set the filterWord to foo", () => {
        const filterSystem = mockedSetter(new FilterSystem(), 'filterWord');

        filterSystem.setFilterWord('foo');

        expect(filterSystem._mockVar).toBe('foo');
    });

    /**
     * 測試FilterSystem.getFilterWord是否正確回傳空字串
     */ 
    test("Should get an empty string from the filterWord", () => {
        const filterSystem = new FilterSystem();

        const filterWord = filterSystem.getFilterWord();

        expect(filterWord).toBe('');
    });

    /**
     * 測試FilterSystem.setIgnoreCase是否正確將ignoreCase設定為true
     */ 
    test("Should set the IgnoreCase to true", () => {
        const filterSystem = mockedSetter(new FilterSystem(), 'ignoreCase');

        filterSystem.setIgnoreCase(true);

        expect(filterSystem._mockVar).toBe(true);
    });

    /**
     * 測試FilterSystem.isIgnoreCase是否正確回傳false
     */ 
    test("Should get a false from the ignoreCase", () => {
        const filterSystem = new FilterSystem();

        const ignoreCase = filterSystem.isIgnoreCase();

        expect(ignoreCase).toBe(false);
    });

    /**
     * 測試FilterSystem是否正常處裡case sensitive的過濾請求
     */ 
    test("Should return BookInfo: Game of Thrones II (case sensitive query)", async () => {
        const filterSystem = new FilterSystem();
        const expectedResult = [{
            "ISBN": "148-71-77362-42-3",
            "title": "Game of Thrones II",
            "author": "J. R. R. Tolkien"
        }];

        filterSystem.setFilterWord('Game of Thrones II');
        filterSystem.setIgnoreCase(false);

        await filterSystem.process(TestBookInfo);

        const result = filterSystem.getItems();

        expect(result.length).toBe(1);
        expect(result).toStrictEqual(expectedResult);
    });
    
    /**
     * 測試FilterSystem是否正常處裡case insensitive的過濾請求
     */ 
    test("Should return BookInfo: Game of Thrones II (case insensitive query)", async () => {
        const filterSystem = new FilterSystem();
        const expectedResult = [{
            "ISBN": "148-71-77362-42-3",
            "title": "Game of Thrones II",
            "author": "J. R. R. Tolkien"
        }];

        filterSystem.setFilterWord('game of thrones ii');
        filterSystem.setIgnoreCase(true);

        await filterSystem.process(TestBookInfo);

        const result = filterSystem.getItems();

        expect(result.length).toBe(1);
        expect(result).toStrictEqual(expectedResult);
    });
    
    /**
     * 測試若BookInfo List中有含有undefined欄位的BookInfo，
     * FilterSystem是否正常處裡過濾請求
     */ 
    test("Should return BookInfo: Game of Thrones II (containing undefined item)", async () => {
        const filterSystem = new FilterSystem();
        const undefinedBookInfo: BookInfo[] = [
            {
                "ISBN": "148-71-77362-42-3",
                "title": "Game of Thrones II",
                "author": "J. R. R. Tolkien"
            },
            {
                "ISBN": undefined,
                "title": undefined,
                "author": undefined
            }
        ];
        const expectedResult = [{
            "ISBN": "148-71-77362-42-3",
            "title": "Game of Thrones II",
            "author": "J. R. R. Tolkien"
        }];

        filterSystem.setFilterWord('Game of Thrones II');
        filterSystem.setIgnoreCase(false);

        await filterSystem.process(undefinedBookInfo);

        const result = filterSystem.getItems();

        expect(result.length).toBe(1);
        expect(result).toStrictEqual(expectedResult);
    });

    /**
     * 測試FilterSystem是否正常回傳含有多的符合的結果的過濾請求
     */ 
    test("Should return BookInfo: Game of Thrones I, Game of Thrones II (multi-result)", async () => {
        const filterSystem = new FilterSystem();
        const expectedResult = [{
            "ISBN": "255-03-71788-05-4",
            "title": "Game of Thrones I",
            "author": "Ray Bradbury"
        },
        {
            "ISBN": "148-71-77362-42-3",
            "title": "Game of Thrones II",
            "author": "J. R. R. Tolkien"
        }];

        filterSystem.setFilterWord('Game of Thrones');
        filterSystem.setIgnoreCase(false);

        await filterSystem.process(TestBookInfo);

        const result = filterSystem.getItems();

        expect(result.length).toBe(2);
        expect(result).toStrictEqual(expectedResult);
    });

    /**
     * 測試FilterSystem處理的BookInfo List為重複內容的array，
     * 運作是否正常
     */
    test("Should return BookInfo: Game of Thrones II (duplicate BookInfo list)", async () => {
        const filterSystem = new FilterSystem();
        const duplicateTestBookInfo = duplicateTestingDataGenerator();
        const expectedResult = duplicateItemArrayGenerator({
            "ISBN": "148-71-77362-42-3",
            "title": "Game of Thrones II",
            "author": "J. R. R. Tolkien"
        }, 10);

        filterSystem.setFilterWord('Game of Thrones II');
        filterSystem.setIgnoreCase(false);

        await filterSystem.process(duplicateTestBookInfo);

        const result = filterSystem.getItems();

        expect(result.length).toBe(10);
        expect(result).toStrictEqual(expectedResult);
    });

    /**
     * 測試FilterSystem處理的BookInfo List為稍大的array (4000筆資料)，
     * 運作是否正常
     */
    test("Should return BookInfo: Game of Thrones II (large BookInfo list)", async () => {
        const filterSystem = new FilterSystem();
        const largeTestBookInfo = largeTestingDataGenerator();
        const expectedResult = duplicateItemArrayGenerator({
            "ISBN": "148-71-77362-42-3",
            "title": "Game of Thrones II",
            "author": "J. R. R. Tolkien"
        }, 500);

        filterSystem.setFilterWord('Game of Thrones II');
        filterSystem.setIgnoreCase(false);

        await filterSystem.process(largeTestBookInfo);

        const result = filterSystem.getItems();

        expect(result.length).toBe(500);
        expect(result).toStrictEqual(expectedResult);
    });

    /**
     * 測試FilterSystem於case sensitivity的模式下過濾存在的書本，filter word
     * 設定為目標存在書本標題的全小寫，是否未回傳任何結果
     */
    test("Should return an empty result (case sensitivity)", async () => {
        const filterSystem = new FilterSystem();

        filterSystem.setFilterWord('game of thrones ii');
        filterSystem.setIgnoreCase(false);

        await filterSystem.process(TestBookInfo);

        const result = filterSystem.getItems();

        expect(result.length).toBe(0);
    });
    
    /**
     * 測試FilterSystem處理控的BookInfo List，是否正確回傳空的array
     */
    test("Should return an empty result (empty BookInfo list)", async () => {
        const filterSystem = new FilterSystem();

        filterSystem.setFilterWord('Game of Thrones II');
        filterSystem.setIgnoreCase(false);

        await filterSystem.process([]);

        const result = filterSystem.getItems();

        expect(result.length).toBe(0);
    });

    /**
     * 測試FilterSystem是否正確處理過濾不存在的書本
     */ 
    test("Should return an empty result (querying a non-exist book)", async () => {
        const filterSystem = new FilterSystem();

        filterSystem.setFilterWord('Game of Thrones III');
        filterSystem.setIgnoreCase(false);

        await filterSystem.process(TestBookInfo);

        const result = filterSystem.getItems();

        expect(result.length).toBe(0);
    });

    /**
     * 測試若設定空白的filter word，FilterSystem是否正常處理過濾請求
     */ 
    test("Should return the whole BookInfo list (empty filter word)", async () => {
        const filterSystem = new FilterSystem();

        filterSystem.setFilterWord('');
        filterSystem.setIgnoreCase(false);

        await filterSystem.process(TestBookInfo);

        const result = filterSystem.getItems();

        expect(result.length).toBe(8);
        expect(result).toStrictEqual(TestBookInfo);
    });
});
