import { mockedSetter } from '../__test__/MockSetter'
import { duplicateItemArrayGenerator } from '../__test__/DataGenerator'
import { WordPuritySystem } from './WordPuritySystem'
import { WordPurityService } from '@externals/word-purity'

jest.mock('@externals/word-purity');

describe("WordPuritySystem class", () => {
    beforeEach(() => {
        jest.mocked(WordPurityService).mockClear();
    });

    /**
     * 測試WordPuritySystem是否正確初始化並正確加入預設的purity words
     */ 
    test("Should initialized normally and add default purity words to WordPurityService", () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = mockedSetter(new WordPuritySystem(mockWordPurityServiceInstance), 'domPurity');
        const dufaultPurityWords = [
            "Copperfield",
            "Wonderland"
        ];

        wordPuritySystem.constructor(mockWordPurityServiceInstance);

        expect(wordPuritySystem._mockVar).toBe(mockWordPurityServiceInstance);
        expect(mockWordPurityServiceInstance.addWord).toBeCalledWith(dufaultPurityWords);
    });

    /**
     * 測試WordPuritySystem是否正確將disable設定為true
     */ 
    test("Should set the disable to true", () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = mockedSetter(new WordPuritySystem(mockWordPurityServiceInstance), 'disable');

        wordPuritySystem.setDisablePurity(true);

        expect(wordPuritySystem._mockVar).toBe(true);
    });

    /**
     * 測試若items為空，WordPuritySystem.getItems是否正確回傳空array
     */
    test("Should get an empty array from the items", () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);

        const result = wordPuritySystem.getItems();

        expect(result).toStrictEqual([]);
    });

    /**
     * 測試WordPurityService.getUpdateMessage是否回傳正確的字串
     */ 
    test("Should get a dom purity update msg from the updateMessage", () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);

        const result = wordPuritySystem.getUpdateMessage();

        expect(result).toBe("Dom Purity Update");
    });

    /**
     * 測試WordPuritySystem.isDisablePurity是否正確回傳undefined
     */ 
    test("Should get an undefined from the disable", () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = mockedSetter(new WordPuritySystem(mockWordPurityServiceInstance), 'disable');

        const result = wordPuritySystem.isDisablePurity();

        expect(result).toBe(undefined);
    });

    /**
     * 測試WordPuritySystem.process函式流程是否正確
     */ 
    test("Should return a masked TestBookInfo list", async () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const testBookInfo = [{
            "ISBN": "680-71-48243-17-0",
            "title": "Alice Adventures in Wonderland",
            "author": "Stephenie Meyer"
        }];
        const expectedResult = [{
            "ISBN": "680-71-48243-17-0",
            "title": "Alice Adventures in **********",
            "author": "Stephenie Meyer"
        }];

        let purityItemsSpy = jest.spyOn(mockWordPurityServiceInstance, 'purity').mockReturnValue("Alice Adventures in **********");

        const wordPuritySystem = mockedSetter(new WordPuritySystem(mockWordPurityServiceInstance), 'items');

        await wordPuritySystem.process(testBookInfo);

        expect(purityItemsSpy).toBeCalledWith("Alice Adventures in Wonderland");
        expect(wordPuritySystem._mockVar).toStrictEqual(expectedResult);
    });

    /**
     * 測試WordPuritySystem處理的BookInfo List為巨大的array (100000筆資料)，
     * 運作是否正常
     */
    test("Should return a masked BookInfo list (large BookInfo list)", async () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const largeBookInfo = duplicateItemArrayGenerator({
            "ISBN": "680-71-48243-17-0",
            "title": "Alice Adventures in Wonderland",
            "author": "Stephenie Meyer"
        }, 100000);
        const expectedResult = duplicateItemArrayGenerator({
            "ISBN": "680-71-48243-17-0",
            "title": "Alice Adventures in **********",
            "author": "Stephenie Meyer"
        }, 100000);

        let purityItemsSpy = jest.spyOn(mockWordPurityServiceInstance, 'purity').mockReturnValue("Alice Adventures in **********");

        const wordPuritySystem = mockedSetter(new WordPuritySystem(mockWordPurityServiceInstance), 'items');

        await wordPuritySystem.process(largeBookInfo);

        expect(purityItemsSpy).toBeCalledTimes(100000);
        expect(purityItemsSpy).toBeCalledWith("Alice Adventures in Wonderland");
        expect(wordPuritySystem._mockVar).toStrictEqual(expectedResult);
    });

    /**
     * 測試若disable為true，WordPuritySystem是否正確不處理任何資料並回傳
     * 未做任何處理的BookInfo List
     */
    test("Should return the same BookInfo (disable)", async () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);
        const testBookInfo = [{
            "ISBN": "680-71-48243-17-0",
            "title": "Alice Adventures in Wonderlands",
            "author": "Stephenie Meyer"
        }];

        wordPuritySystem.setDisablePurity(true);

        await wordPuritySystem.process(testBookInfo);

        const result = wordPuritySystem.getItems();

        expect(result).toStrictEqual(testBookInfo);
    });

    /**
     * 測試WordPurityService處理的BookInfo List為空，是否正常回傳空array
     */
    test("Should return an empty result", async () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);

        await wordPuritySystem.process([]);

        const result = wordPuritySystem.getItems();

        expect(result.length).toBe(0);
    });
});
