import { TestBookInfo } from '../__test__/TestingData'
import { AscendingBookInfo, DescendingBookInfo } from '../__test__/ExpectingData'
import { duplicateTestingDataGenerator, duplicateItemArrayGenerator, largeTestingDataGenerator } from '../__test__/DataGenerator'
import { mockedSetter } from '../__test__/MockSetter'
import { SortSystem } from './SortSystem'
import { BookInfo } from '@externals/simple-db'

describe("SortSystem class", () => {
    test("Should set the sortType to ASC", () => {
        const sortSystem = mockedSetter(new SortSystem(), 'sortType');

        sortSystem.setSortType(SortSystem.ASC);

        expect(sortSystem._mockVar).toBe('ASC');
    });

    test("Should set the sortType to DESC", () => {
        const sortSystem = mockedSetter(new SortSystem(), 'sortType');

        sortSystem.setSortType(SortSystem.DESC);

        expect(sortSystem._mockVar).toBe('DESC');
    });

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

    test("Should get ASC from the sortType", () => {
        const sortSystem = new SortSystem();
    
        const sortType = sortSystem.getSortType();
    
        expect(sortType).toBe('ASC');
    });

    test("Should sort by ascending", async () => {
        const sortSystem = new SortSystem();

        sortSystem.setSortType(SortSystem.ASC);

        await sortSystem.process(TestBookInfo);

        const result = sortSystem.getItems();

        expect(result.length).toBe(8);
        expect(result).toStrictEqual(AscendingBookInfo);
    });

    test("Should sort by descending", async () => {
        const sortSystem = new SortSystem();

        sortSystem.setSortType(SortSystem.DESC);

        await sortSystem.process(TestBookInfo);

        const result = sortSystem.getItems();

        expect(result.length).toBe(8);
        expect(result).toStrictEqual(DescendingBookInfo);
    });

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

    test("Should get an empty result (empty BookInfo array)", async () => {
        const sortSystem = new SortSystem();

        sortSystem.setSortType(SortSystem.DESC);

        await sortSystem.process([]);

        const result = sortSystem.getItems();

        expect(result.length).toBe(0);
    });
});

