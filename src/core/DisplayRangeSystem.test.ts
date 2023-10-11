import { TestBookInfo } from '../__test__/TestingData'
import { mockedSetter } from '../__test__/MockSetter'
import { largeTestingDataGenerator, duplicateTestingDataGenerator } from '../__test__/DataGenerator'
import { DisplayRangeSystem } from './DisplayRangeSystem'

describe("DisplayRangeSystem class", () => {
    test("Should set the startRange to 3", () => {
        const displayRangeSystem = mockedSetter(new DisplayRangeSystem(), 'startRange');

        displayRangeSystem.setRange(3, 4);

        expect(displayRangeSystem._mockVar).toBe(3);
    });

    test("Should set the endRange to 4", () => {
        const displayRangeSystem = mockedSetter(new DisplayRangeSystem(), 'endRange');

        displayRangeSystem.setRange(3, 4);

        expect(displayRangeSystem._mockVar).toBe(4);
    });

    test("Should set the startRange to 3 (string input)", () => {
        const displayRangeSystem = mockedSetter(new DisplayRangeSystem(), 'startRange');

        displayRangeSystem.setRange('3', '4');

        expect(displayRangeSystem._mockVar).toBe(3);
    });

    test("Should set the endRange to 4 (string input)", () => {
        const displayRangeSystem = mockedSetter(new DisplayRangeSystem(), 'endRange');

        displayRangeSystem.setRange('3', '4');

        expect(displayRangeSystem._mockVar).toBe(4);
    });

    test("Should throw a end range cannot less than start range error", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        expect(() => { displayRangeSystem.setRange('4', '3') }).toThrowError("End Range cannot less than Start Range");
    });

    test("Should throw an invalid string input error", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        expect(() => { displayRangeSystem.setRange('foo', '3') }).toThrowError("Invalid String Input");
    });

    test("Should throw an invalid float input error", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        expect(() => { displayRangeSystem.setRange(0.4, 3) }).toThrowError("Invalid Float Input");
    });

    test("Should throw a cannot be less than 0 error (zero)", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        expect(() => { displayRangeSystem.setRange(0, 3) }).toThrowError("Cannot be less than 0");
    });

    test("Should throw a cannot be less than 0 error (neg)", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        expect(() => { displayRangeSystem.setRange(-10, 3) }).toThrowError("Cannot be less than 0");
    });

    test("Should get 1 from the startRange", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        const startRange = displayRangeSystem.getStartRange();

        expect(startRange).toBe(1);
    });

    test("Should get 10 from the endRange", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        const endRange = displayRangeSystem.getEndRange();

        expect(endRange).toBe(10);
    });

    test("Should return all the BookInfo", async () => {
        const displayRangeSystem = new DisplayRangeSystem();

        displayRangeSystem.setRange(1, 100);

        await displayRangeSystem.process(TestBookInfo);

        const result = displayRangeSystem.getItems();

        expect(result.length).toBe(8);
        expect(result).toStrictEqual(TestBookInfo);
    });

    test("Should return the third to fourth BookInfo", async () => {
        const displayRangeSystem = new DisplayRangeSystem();
        const expectedResult = [
            {
                "ISBN": "712-03-87188-05-4",
                "title": "Bone of fire",
                "author": "Willain Bradbury"
            },
            {
                "ISBN": "774-13-13326-60-1",
                "title": "To Kill a Mockingbird",
                "author": "Danielle Steel"
            }
        ]

        displayRangeSystem.setRange(3, 4);

        await displayRangeSystem.process(TestBookInfo);

        const result = displayRangeSystem.getItems();

        expect(result.length).toBe(2);
        expect(result).toStrictEqual(expectedResult);
    });

    test("Should return BookInfo: Game of Thrones II (duplicate BookInfo list)", async () => {
        const displayRangeSystem = new DisplayRangeSystem();
        const duplicateTestBookInfo = duplicateTestingDataGenerator();
        const expectedResult = [{
            "ISBN": "148-71-77362-42-3",
            "title": "Game of Thrones II",
            "author": "J. R. R. Tolkien"
        }];

        displayRangeSystem.setRange(5, 5);

        await displayRangeSystem.process(duplicateTestBookInfo);

        const result = displayRangeSystem.getItems();

        expect(result.length).toBe(1);
        expect(result).toStrictEqual(expectedResult);
    });

    test("Should return BookInfo: Game of Thrones II (large BookInfo list)", async () => {
        const displayRangeSystem = new DisplayRangeSystem();
        const largeTestBookInfo = largeTestingDataGenerator();
        const expectedResult = [{
            "ISBN": "148-71-77362-42-3",
            "title": "Game of Thrones II",
            "author": "J. R. R. Tolkien"
        }];

        displayRangeSystem.setRange(2000, 2000);

        await displayRangeSystem.process(largeTestBookInfo);

        const result = displayRangeSystem.getItems();

        expect(result.length).toBe(1);
        expect(result).toStrictEqual(expectedResult);
    });

    test("Should get an empty result (empty BookInfo array)", async () => {
        const displayRangeSystem = new DisplayRangeSystem();

        await displayRangeSystem.process([]);

        const result = displayRangeSystem.getItems();

        expect(result.length).toBe(0);
    });
    
});
