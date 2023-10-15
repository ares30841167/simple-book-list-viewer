import { mockedSetter } from '../__test__/MockSetter'
import { duplicateItemArrayGenerator } from '../__test__/DataGenerator'
import { WordPuritySystem } from './WordPuritySystem'
import { WordPurityService } from '@externals/word-purity'

jest.mock('@externals/word-purity');

describe("WordPuritySystem class", () => {
    beforeEach(() => {
        jest.mocked(WordPurityService).mockClear();
    });

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

    test("Should set the disable to true", () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = mockedSetter(new WordPuritySystem(mockWordPurityServiceInstance), 'disable');

        wordPuritySystem.setDisablePurity(true);

        expect(wordPuritySystem._mockVar).toBe(true);
    });

    test("Should get an empty array from the items", () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);

        const result = wordPuritySystem.getItems();

        expect(result).toStrictEqual([]);
    });

    test("Should get a dom purity update msg from the updateMessage", () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);

        const result = wordPuritySystem.getUpdateMessage();

        expect(result).toBe("Dom Purity Update");
    });

    test("Should get an undefined from the disable", () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = mockedSetter(new WordPuritySystem(mockWordPurityServiceInstance), 'disable');

        const result = wordPuritySystem.isDisablePurity();

        expect(result).toBe(undefined);
    });

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

    test("Should return an empty result", async () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);

        await wordPuritySystem.process([]);

        const result = wordPuritySystem.getItems();

        expect(result.length).toBe(0);
    });
});
