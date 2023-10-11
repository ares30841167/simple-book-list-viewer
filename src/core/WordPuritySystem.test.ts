import { mockedSetter } from '../__test__/MockSetter'
import { MaskedBookInfo } from '../__test__/ExpectingData'
import { largeTestingDataGenerator, duplicateItemArrayGenerator, repeatArrayGenerator } from '../__test__/DataGenerator'
import { WordPuritySystem } from './WordPuritySystem'
import { WordPurityService } from '@externals/word-purity'
import { TestBookInfo } from '../__test__/TestingData'

jest.mock('@externals/word-purity', () => {
    return {
        WordPurityService: jest.fn().mockImplementation(() => {
            return {
                words: jest.fn(),
                constructor: jest.fn(),
                addWord: jest.fn(),
                purity: jest.fn().mockImplementation((str: string, purityWords: string[] = [
                    "Copperfield",
                    "Wonderland"
                ]) => {
                    let maskedString = str;

                    purityWords.forEach(keyword => {
                        const regex = new RegExp(keyword, "gi");
                        const mask = '*'.repeat(keyword.length);
                        maskedString = maskedString.replace(regex, mask);
                    });

                    return maskedString;
                })
            };
        })
    };
});

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
        expect(mockWordPurityServiceInstance.addWord).toHaveBeenCalledWith(dufaultPurityWords);
    });

    test("Should set the disable to true", () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = mockedSetter(new WordPuritySystem(mockWordPurityServiceInstance), 'disable');

        wordPuritySystem.setDisablePurity(true);

        expect(wordPuritySystem._mockVar).toBe(true);
    });

    test("Should get an undefined from the disable", () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = mockedSetter(new WordPuritySystem(mockWordPurityServiceInstance), 'disable');

        const result = wordPuritySystem.isDisablePurity();

        expect(result).toBe(undefined);
    });

    test("Should return a masked TestBookInfo list", async () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);

        await wordPuritySystem.process(TestBookInfo);

        const result = wordPuritySystem.getItems();

        expect(result).toStrictEqual(MaskedBookInfo);
    });

    test("Should return a masked BookInfo list (large BookInfo list)", async () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);
        const largeBookInfo = largeTestingDataGenerator();
        const expectedResult = repeatArrayGenerator(MaskedBookInfo, 500);

        await wordPuritySystem.process(largeBookInfo);

        const result = wordPuritySystem.getItems();

        expect(result).toStrictEqual(expectedResult);
    });

    test("Should return a masked BookInfo list (duplicate BookInfo list)", async () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);
        const duplicateBookInfo = duplicateItemArrayGenerator({
            "ISBN": "680-71-48243-17-0",
            "title": "Alice Adventures in Wonderland",
            "author": "Stephenie Meyer"
        }, 100);
        const expectedResult = duplicateItemArrayGenerator({
            "ISBN": "680-71-48243-17-0",
            "title": "Alice Adventures in **********",
            "author": "Stephenie Meyer"
        }, 100);

        await wordPuritySystem.process(duplicateBookInfo);

        const result = wordPuritySystem.getItems();

        expect(result).toStrictEqual(expectedResult);
    });

    test("Should return a masked BookInfo (one word different from the keyword)", async () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);
        const testBookInfo = [{
            "ISBN": "680-71-48243-17-0",
            "title": "Alice Adventures in Wonderlands",
            "author": "Stephenie Meyer"
        }];
        const expectedResult = [{
            "ISBN": "680-71-48243-17-0",
            "title": "Alice Adventures in **********s",
            "author": "Stephenie Meyer"
        }];

        await wordPuritySystem.process(testBookInfo);

        const result = wordPuritySystem.getItems();

        expect(result).toStrictEqual(expectedResult);
    });

    test("Should return a masked BookInfo (keyword within a word)", async () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);
        const testBookInfo = [{
            "ISBN": "680-71-48243-17-0",
            "title": "Alice Adventures in sWonderlands",
            "author": "Stephenie Meyer"
        }];
        const expectedResult = [{
            "ISBN": "680-71-48243-17-0",
            "title": "Alice Adventures in s**********s",
            "author": "Stephenie Meyer"
        }];

        await wordPuritySystem.process(testBookInfo);

        const result = wordPuritySystem.getItems();

        expect(result).toStrictEqual(expectedResult);
    });

    test("Should return a masked BookInfo (keyword appears two times)", async () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);
        const testBookInfo = [{
            "ISBN": "680-71-48243-17-0",
            "title": "Wonderland Alice Adventures in Wonderland",
            "author": "Stephenie Meyer"
        }];
        const expectedResult = [{
            "ISBN": "680-71-48243-17-0",
            "title": "********** Alice Adventures in **********",
            "author": "Stephenie Meyer"
        }];

        await wordPuritySystem.process(testBookInfo);

        const result = wordPuritySystem.getItems();

        expect(result).toStrictEqual(expectedResult);
    });

    test("Should return a masked BookInfo (two different keywords in the same time)", async () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);
        const testBookInfo = [{
            "ISBN": "680-71-48243-17-0",
            "title": "Copperfield Alice Adventures in Wonderland",
            "author": "Stephenie Meyer"
        }];
        const expectedResult = [{
            "ISBN": "680-71-48243-17-0",
            "title": "*********** Alice Adventures in **********",
            "author": "Stephenie Meyer"
        }];

        await wordPuritySystem.process(testBookInfo);

        const result = wordPuritySystem.getItems();

        expect(result).toStrictEqual(expectedResult);
    });

    test("Should return the same BookInfo (no keyword)", async () => {
        const mockWordPurityServiceInstance = new WordPurityService();
        const wordPuritySystem = new WordPuritySystem(mockWordPurityServiceInstance);
        const testBookInfo = [
            {
                "ISBN": "148-71-77362-42-3",
                "title": "Game of Thrones II",
                "author": "J. R. R. Tolkien"
            }
        ];

        await wordPuritySystem.process(testBookInfo);

        const result = wordPuritySystem.getItems();

        expect(result).toStrictEqual(testBookInfo);
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
