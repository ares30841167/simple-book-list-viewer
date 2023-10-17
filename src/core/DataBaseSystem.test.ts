import { mockedSetter } from '../__test__/MockSetter'
import { HashGenerator } from "../utils/HashGenerator";
import { BookDataBaseService } from '@externals/simple-db'
import { DataBaseSystem } from './DataBaseSystem'
import { TestBookInfo } from '../__test__/TestingData'

jest.mock('@externals/simple-db');
jest.mock('../utils/HashGenerator');

describe("DataBaseSystem class", () => {
    beforeEach(() => {
        jest.mocked(BookDataBaseService).mockClear();
        jest.mocked(HashGenerator).mockClear();
    });

    /**
     * 測試DataBaseSystem是否正確初始化並正常注入依賴物件
     */ 
    test("Should initialized normally and inject dependencies correctly", () => {
        // init databaseSystem var
        let databaseSystem = undefined;

        // check db
        const mockBookDataBaseServiceInstance = new BookDataBaseService();
        databaseSystem = mockedSetter(new DataBaseSystem(), 'db');

        databaseSystem.constructor(mockBookDataBaseServiceInstance, null);

        expect(databaseSystem._mockVar).toBe(mockBookDataBaseServiceInstance);

        // check hashGenerator
        const mockHashGeneratorInstance = new HashGenerator();
        databaseSystem = mockedSetter(new DataBaseSystem(), 'hashGenerator');

        databaseSystem.constructor(null, mockHashGeneratorInstance);

        expect(databaseSystem._mockVar).toBe(mockHashGeneratorInstance);
    });

    /**
     * 測試若items為空，DataBaseSystem.getItems是否正確回傳空array
     */ 
    test("Should get an empty array from the items", () => {
        const databaseSystem = new DataBaseSystem();

        const result = databaseSystem.getItems();

        expect(result).toStrictEqual([]);
    });

    /**
     * 測試DataBaseSystem.getUpdateMessage是否回傳正確的字串
     */ 
    test("Should get a data base update msg from the updateMessage", () => {
        const databaseSystem = new DataBaseSystem();

        const result = databaseSystem.getUpdateMessage();

        expect(result).toBe("Data Base Update");
    });

    /**
     * 測試DataBaseSystem.connectDB內的各連接流程是否正確以對應的參數被呼叫
     */ 
    test("Should connect to the db", async () => {
        const mockBookDataBaseServiceInstance = new BookDataBaseService();
        const testBookInfo = {
            "ISBN": "148-71-77362-42-3",
            "title": "Game of Thrones II",
            "author": "J. R. R. Tolkien"
        };
        const setUpSpy = jest.spyOn(mockBookDataBaseServiceInstance, 'setUp').mockResolvedValue("success");
        const getBooksSpy = jest.spyOn(mockBookDataBaseServiceInstance, 'getBooks').mockResolvedValue([testBookInfo]);

        const databaseSystem = mockedSetter(new DataBaseSystem(mockBookDataBaseServiceInstance, null), 'items');

        const res = await databaseSystem.connectDB();
        
        expect(setUpSpy).toBeCalledWith("http://localhost", 4000);
        expect(getBooksSpy).toBeCalled();

        expect(databaseSystem._mockVar).toStrictEqual([testBookInfo]);
        expect(res).toBe("success");
    });

    /**
     * 測試若BookDataBaseService.setUp()發生錯誤，DatabaseSystem應擲出
     * Cannnot connect to DB錯誤
     */ 
    test("Should throw a cannnot connect to db error", async () => {
        const mockBookDataBaseServiceInstance = new BookDataBaseService();

        const setUpSpy = jest.spyOn(mockBookDataBaseServiceInstance, 'setUp').mockRejectedValue(new Error("timeout"));

        const databaseSystem = new DataBaseSystem(mockBookDataBaseServiceInstance, null);

        await expect(databaseSystem.connectDB()).rejects.toThrowError("Cannnot connect to DB");

        expect(setUpSpy).toBeCalledWith("http://localhost", 4000);
    });

    /**
     * 測試DataBaseSystem.addBook函式流程是否正確
     */ 
    test("Should add a BookInfo into the db", async () => {
        const mockBookDataBaseServiceInstance = new BookDataBaseService();
        const mockHashGeneratorInstance = new HashGenerator();
        const expectedBookInfo = {
            ISBN: "999-99-99999-99-9",
            title: "foo",
            author: "bar",
        }

        const addBookSpy = jest.spyOn(mockBookDataBaseServiceInstance, 'addBook');
        const simpleISBNSpy = jest.spyOn(mockHashGeneratorInstance, 'simpleISBN').mockReturnValue("999-99-99999-99-9");

        const databaseSystem = new DataBaseSystem(mockBookDataBaseServiceInstance, mockHashGeneratorInstance);

        await databaseSystem.addBook("foo", "bar");
        
        expect(simpleISBNSpy).toBeCalledWith("000-00-00000-00-0");
        expect(addBookSpy).toBeCalledWith(expectedBookInfo);
    });

    /**
     * 測試若DatabaseSystem.addBook傳入null，DatabaseSystem應發生錯誤並擲出
     * Add book failed錯誤
     */ 
    test("Should throw an add book failed error (title or author is null)", async () => {
        const databaseSystem = new DataBaseSystem();
        
        await expect(databaseSystem.addBook(null, null)).rejects.toThrowError("Add book failed");
        await expect(databaseSystem.addBook(null, "bar")).rejects.toThrowError("Add book failed");
        await expect(databaseSystem.addBook("foo", null)).rejects.toThrowError("Add book failed");
    });

    /**
     * 測試若BookDataBaseService.addBook發生錯誤，DatabaseSystem應擲出
     * Add book failed錯誤
     */ 
    test("Should throw an add book failed error (addBook failed)", async () => {
        const mockBookDataBaseServiceInstance = new BookDataBaseService();
        const mockHashGeneratorInstance = new HashGenerator();
        const expectedBookInfo = {
            ISBN: "999-99-99999-99-9",
            title: "foo",
            author: "bar",
        }

        const addBookSpy = jest.spyOn(mockBookDataBaseServiceInstance, 'addBook').mockRejectedValue(new Error("add failed"));
        const simpleISBNSpy = jest.spyOn(mockHashGeneratorInstance, 'simpleISBN').mockReturnValue("999-99-99999-99-9");

        const databaseSystem = new DataBaseSystem(mockBookDataBaseServiceInstance, mockHashGeneratorInstance);
        
        await expect(databaseSystem.addBook("foo", "bar")).rejects.toThrowError("Add book failed");
        
        expect(simpleISBNSpy).toBeCalledWith("000-00-00000-00-0");
        expect(addBookSpy).toBeCalledWith(expectedBookInfo);
    });

    /**
     * 測試DataBaseSystem.deleteBook函式流程是否正確
     */ 
    test("Should delete a BookInfo from the db", async () => {
        const mockBookDataBaseServiceInstance = new BookDataBaseService();

        const deleteBookSpy = jest.spyOn(mockBookDataBaseServiceInstance, 'deleteBook');

        const databaseSystem = new DataBaseSystem(mockBookDataBaseServiceInstance, null);

        await databaseSystem.deleteBook("999-99-99999-99-9");
        
        expect(deleteBookSpy).toBeCalledWith("999-99-99999-99-9");
    });

    /**
     * 測試DataBaseSystem.deleteBook若傳入錯誤的參數，函式是否擲出
     * Delete book failed錯誤
     */ 
    test("Should throw a delete book failed error (bookISBN is null)", async () => {
        const databaseSystem = new DataBaseSystem();

        await expect(databaseSystem.deleteBook(null)).rejects.toThrowError("Delete book failed");
    });

    /**
     * 測試若BookDataBaseService.deleteBook發生錯誤，DatabaseSystem應擲出
     * Delete book failed錯誤
     */ 
    test("Should throw a delete book failed error (deleteBook failed)", async () => {
        const mockBookDataBaseServiceInstance = new BookDataBaseService();

        const deleteBookSpy = jest.spyOn(mockBookDataBaseServiceInstance, 'deleteBook').mockRejectedValue(new Error("delete failed"));

        const databaseSystem = new DataBaseSystem(mockBookDataBaseServiceInstance, null);

        await expect(databaseSystem.deleteBook("999-99-99999-99-9")).rejects.toThrowError("Delete book failed");
        
        expect(deleteBookSpy).toBeCalledWith("999-99-99999-99-9");
    });

    /**
     * 測試DataBaseSystem.process函式流程是否正確
     */ 
    test("Should get all the BookInfo from the db", async () => {
        const mockBookDataBaseServiceInstance = new BookDataBaseService();

        const getBooksSpy = jest.spyOn(mockBookDataBaseServiceInstance, 'getBooks').mockResolvedValue(TestBookInfo);

        const databaseSystem = mockedSetter(new DataBaseSystem(mockBookDataBaseServiceInstance, null), 'items');

        await databaseSystem.process([]);
        
        expect(getBooksSpy).toBeCalled();
        expect(databaseSystem._mockVar).toBe(TestBookInfo);
    });

    /**
     * 測試呼叫DataBaseSystem.process時，若BookDataBaseService.getBooks發生錯誤，
     * 是否忽略錯誤並繼續正常運行
     */ 
    test("Should do nothing when catching an error while the process method being called", () => {
        const mockBookDataBaseServiceInstance = new BookDataBaseService();

        const getBooksSpy = jest.spyOn(mockBookDataBaseServiceInstance, 'getBooks').mockRejectedValue(new Error("read failed"));

        const databaseSystem = mockedSetter(new DataBaseSystem(mockBookDataBaseServiceInstance, null), 'items');

        expect(databaseSystem.process([])).resolves;
        
        expect(getBooksSpy).toBeCalled();
        expect(databaseSystem._mockVar).toBe(undefined);
    });
});
