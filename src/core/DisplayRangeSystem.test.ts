import { TestBookInfo } from '../__test__/TestingData'
import { mockedSetter } from '../__test__/MockSetter'
import { largeTestingDataGenerator, duplicateTestingDataGenerator } from '../__test__/DataGenerator'
import { DisplayRangeSystem } from './DisplayRangeSystem'

describe("DisplayRangeSystem class", () => {
    /**
     * 測試DisplayRangeSystem.setRange是否正確將startRange設定為3
     */ 
    test("Should set the startRange to 3", () => {
        const displayRangeSystem = mockedSetter(new DisplayRangeSystem(), 'startRange');

        displayRangeSystem.setRange(3, 4);

        expect(displayRangeSystem._mockVar).toBe(3);
    });

    /**
     * 測試DisplayRangeSystem.setRange是否正確將endRange設定為4
     */ 
    test("Should set the endRange to 4", () => {
        const displayRangeSystem = mockedSetter(new DisplayRangeSystem(), 'endRange');

        displayRangeSystem.setRange(3, 4);

        expect(displayRangeSystem._mockVar).toBe(4);
    });

    /**
     * 測試DisplayRangeSystem.setRange若傳入的值為字串型態，是否正確
     * 將startRange設定為3
     */ 
    test("Should set the startRange to 3 (string input)", () => {
        const displayRangeSystem = mockedSetter(new DisplayRangeSystem(), 'startRange');

        displayRangeSystem.setRange('3', '4');

        expect(displayRangeSystem._mockVar).toBe(3);
    });

    /**
     * 測試DisplayRangeSystem.setRange若傳入的值為字串型態，是否正確
     * 將endRange設定為4
     */ 
    test("Should set the endRange to 4 (string input)", () => {
        const displayRangeSystem = mockedSetter(new DisplayRangeSystem(), 'endRange');

        displayRangeSystem.setRange('3', '4');

        expect(displayRangeSystem._mockVar).toBe(4);
    });

    /**
     * 測試若DisplayRangeSystem.setRange之傳入參數第一個參數值大於第二個參數值，DisplayRangeSystem應擲出
     * End Range cannot less than Start Range錯誤
     */ 
    test("Should throw a end range cannot less than start range error", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        expect(() => { displayRangeSystem.setRange('4', '3') }).toThrowError("End Range cannot less than Start Range");
    });

    /**
     * 測試若DisplayRangeSystem.setRange之傳入參數不為可轉換為數值的字串，DisplayRangeSystem應擲出
     * Invalid String Input錯誤
     */ 
    test("Should throw an invalid string input error", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        expect(() => { displayRangeSystem.setRange('foo', '3') }).toThrowError("Invalid String Input");
    });

    /**
     * 測試若DisplayRangeSystem.setRange之傳入參數為浮點數，DisplayRangeSystem應擲出
     * Invalid Float Input錯誤
     */ 
    test("Should throw an invalid float input error", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        expect(() => { displayRangeSystem.setRange(0.4, 3) }).toThrowError("Invalid Float Input");
    });

    /**
     * 測試若DisplayRangeSystem.setRange之傳入參數為0或小於0，DisplayRangeSystem應擲出
     * Cannot be less than 0錯誤
     */ 
    test("Should throw a cannot be less than 0 error (zero)", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        expect(() => { displayRangeSystem.setRange(0, 3) }).toThrowError("Cannot be less than 0");
    });

    /**
     * 測試若DisplayRangeSystem.setRange之傳入參數為0或小於0，DisplayRangeSystem應擲出
     * Cannot be less than 0錯誤
     */ 
    test("Should throw a cannot be less than 0 error (neg)", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        expect(() => { displayRangeSystem.setRange(-10, 3) }).toThrowError("Cannot be less than 0");
    });

    /**
     * 測試若items為空，DisplayRangeSystem.getItems是否正確回傳空array
     */ 
    test("Should get an empty array from the items", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        const result = displayRangeSystem.getItems();

        expect(result).toStrictEqual([]);
    });

    /**
     * 測試DisplayRangeSystem.getUpdateMessage是否回傳正確的字串
     */ 
    test("Should get a display range update msg from the updateMessage", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        const result = displayRangeSystem.getUpdateMessage();

        expect(result).toBe("Display Range Update");
    });

    /**
     * 測試DisplayRangeSystem.getStartRange是否正確回傳1
     */ 
    test("Should get 1 from the startRange", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        const startRange = displayRangeSystem.getStartRange();

        expect(startRange).toBe(1);
    });

    /**
     * 測試DisplayRangeSystem.getEndRange是否正確回傳10
     */ 
    test("Should get 10 from the endRange", () => {
        const displayRangeSystem = new DisplayRangeSystem();

        const endRange = displayRangeSystem.getEndRange();

        expect(endRange).toBe(10);
    });

    /**
     * 測試DisplayRangeSystem中設定的range超過資料筆數，是否正確回傳
     * 所有BookInfo
     */
    test("Should return all the BookInfo", async () => {
        const displayRangeSystem = new DisplayRangeSystem();

        displayRangeSystem.setRange(1, 100);

        await displayRangeSystem.process(TestBookInfo);

        const result = displayRangeSystem.getItems();

        expect(result.length).toBe(8);
        expect(result).toStrictEqual(TestBookInfo);
    });

    /**
     * 測試DisplayRangeSystem中設定的range為3到4，是否正確回傳
     * 第3-4個BookInfo
     */
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

    /**
     * 測試DisplayRangeSystem處理的BookInfo List為重複內容的array，
     * 運作是否正常
     */
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

    /**
     * 測試DisplayRangeSystem處理的BookInfo List為稍大的array (4000筆資料)，
     * 運作是否正常
     */
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

    /**
     * 測試DisplayRangeSystem處理的BookInfo List為空，是否正常回傳空array
     */
    test("Should get an empty result (empty BookInfo array)", async () => {
        const displayRangeSystem = new DisplayRangeSystem();

        await displayRangeSystem.process([]);

        const result = displayRangeSystem.getItems();

        expect(result.length).toBe(0);
    });
    
});
