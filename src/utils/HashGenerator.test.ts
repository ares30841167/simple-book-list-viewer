import { HashGenerator } from './HashGenerator'

describe("HashGenerator class", () => {
    beforeEach(() => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.99);
    });

    afterEach(() => {
        jest.spyOn(global.Math, 'random').mockRestore();
    })

    test("Should throw an hash number can't less than 0 error (zero)", () => {
        const hashGenerator = new HashGenerator();

        expect(() => { hashGenerator.g(0) }).toThrowError("Hash number can't less than 0");
    });

    test("Should throw an hash number can't less than 0 error (neg)", () => {
        const hashGenerator = new HashGenerator();

        expect(() => { hashGenerator.g(-1) }).toThrowError("Hash number can't less than 0");
    });

    test("Should return 5 uppercase a", () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0);

        const hashGenerator = new HashGenerator();
        const expectedResult = "AAAAA";

        const result = hashGenerator.g(5);

        expect(result).toBe(expectedResult);
    });

    test("Should return 5 uppercase n", () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

        const hashGenerator = new HashGenerator();
        const expectedResult = "NNNNN";

        const result = hashGenerator.g(5);

        expect(result).toBe(expectedResult);
    });

    test("Should return 5 uppercase z", () => {
        const hashGenerator = new HashGenerator();
        const expectedResult = "ZZZZZ";

        const result = hashGenerator.g(5);

        expect(result).toBe(expectedResult);
    });

    test("Should return 100000 uppercase z", () => {
        const hashGenerator = new HashGenerator();
        const expectedResult = "Z".repeat(100000);

        const result = hashGenerator.g(100000);

        expect(result).toBe(expectedResult);
    });

    test("Should return a normal ISBN string (normal pattern)", () => {
        const hashGenerator = new HashGenerator();
        const expectedResult = "999-9-99-999999-9";

        const result = hashGenerator.simpleISBN("000-0-00-000000-0");

        expect(result).toBe(expectedResult);
    });

    test("Should return a normal ISBN string (messy pattern)", () => {
        const hashGenerator = new HashGenerator();
        const expectedResult = "999-9-99-999999-9";

        const result = hashGenerator.simpleISBN("2e5-!-p9-79as32-@");

        expect(result).toBe(expectedResult);
    });

    test("Should return a normal ISBN string (all number pattern)", () => {
        const hashGenerator = new HashGenerator();
        const expectedResult = "9999999999999";

        const result = hashGenerator.simpleISBN("0000000000000");

        expect(result).toBe(expectedResult);
    });

    test("Should return a normal ISBN string (all dash pattern)", () => {
        const hashGenerator = new HashGenerator();
        const expectedResult = "-------------";

        const result = hashGenerator.simpleISBN("-------------");

        expect(result).toBe(expectedResult);
    });

    test("Should return a normal ISBN string (chinese pattern)", () => {
        const hashGenerator = new HashGenerator();
        const expectedResult = "99";

        const result = hashGenerator.simpleISBN("測試");

        expect(result).toBe(expectedResult);
    });

    test("Should return a normal ISBN string (special character)", () => {
        const hashGenerator = new HashGenerator();
        const largePatternString = "�";
        const expectedResult = "9";

        const result = hashGenerator.simpleISBN(largePatternString);

        expect(result).toBe(expectedResult);
    });

    test("Should return a normal ISBN string (large pattern)", () => {
        const hashGenerator = new HashGenerator();
        const largePatternString = "A".repeat(1000000);
        const expectedResult = "9".repeat(1000000);

        const result = hashGenerator.simpleISBN(largePatternString);

        expect(result).toBe(expectedResult);
    });

    test("Should return an empty ISBN string", () => {
        const hashGenerator = new HashGenerator();

        const result = hashGenerator.simpleISBN("");

        expect(result.length).toBe(0);
    });
});
