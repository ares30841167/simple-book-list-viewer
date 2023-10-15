import { TestBookInfo } from '../__test__/TestingData'
import { mockedSetter } from '../__test__/MockSetter'
import { largeTestingDataGenerator, duplicateTestingDataGenerator, duplicateItemArrayGenerator } from '../__test__/DataGenerator'
import { FilterSystem } from './FilterSystem'
import { BookInfo } from '@externals/simple-db'

describe("FilterSystem class", () => {
    test("Should get an empty array from the items", () => {
        const filterSystem = new FilterSystem();

        const result = filterSystem.getItems();

        expect(result).toStrictEqual([]);
    });

    test("Should get a filter update msg from the updateMessage", () => {
        const filterSystem = new FilterSystem();

        const result = filterSystem.getUpdateMessage();

        expect(result).toBe("Filter Update");
    });

    test("Should set the filterWord to foo", () => {
        const filterSystem = mockedSetter(new FilterSystem(), 'filterWord');

        filterSystem.setFilterWord('foo');

        expect(filterSystem._mockVar).toBe('foo');
    });

    test("Should get an empty string from the filterWord", () => {
        const filterSystem = new FilterSystem();

        const filterWord = filterSystem.getFilterWord();

        expect(filterWord).toBe('');
    });

    test("Should set the IgnoreCase to true", () => {
        const filterSystem = mockedSetter(new FilterSystem(), 'ignoreCase');

        filterSystem.setIgnoreCase(true);

        expect(filterSystem._mockVar).toBe(true);
    });

    test("Should get a false from the ignoreCase", () => {
        const filterSystem = new FilterSystem();

        const ignoreCase = filterSystem.isIgnoreCase();

        expect(ignoreCase).toBe(false);
    });

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

    test("Should return an empty result (case sensitivity)", async () => {
        const filterSystem = new FilterSystem();

        filterSystem.setFilterWord('game of thrones ii');
        filterSystem.setIgnoreCase(false);

        await filterSystem.process(TestBookInfo);

        const result = filterSystem.getItems();

        expect(result.length).toBe(0);
    });
    
    test("Should return an empty result (empty BookInfo list)", async () => {
        const filterSystem = new FilterSystem();

        filterSystem.setFilterWord('Game of Thrones II');
        filterSystem.setIgnoreCase(false);

        await filterSystem.process([]);

        const result = filterSystem.getItems();

        expect(result.length).toBe(0);
    });

    test("Should return an empty result (querying a non-exist book)", async () => {
        const filterSystem = new FilterSystem();

        filterSystem.setFilterWord('Game of Thrones III');
        filterSystem.setIgnoreCase(false);

        await filterSystem.process(TestBookInfo);

        const result = filterSystem.getItems();

        expect(result.length).toBe(0);
    });

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
