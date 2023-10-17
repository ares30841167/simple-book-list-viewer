import { mockedSetter } from "../__test__/MockSetter";
import { MockSytemItems } from "../__test__/TestingData";
import { ListViewerManager, UpdateType } from "./ListManager";

import { DataBaseSystem } from "./DataBaseSystem";
import { WordPuritySystem } from "./WordPuritySystem";
import { FilterSystem } from "./FilterSystem";
import { SortSystem } from "./SortSystem";
import { DisplayRangeSystem } from "./DisplayRangeSystem";

import { HashGenerator } from "../utils/HashGenerator";

import { WordPurityService } from "@externals/word-purity";
import { BookDataBaseService } from "@externals/simple-db";

jest.mock('./DataBaseSystem');
jest.mock('./WordPuritySystem');
jest.mock('./FilterSystem');
jest.mock('./SortSystem');
jest.mock('./DisplayRangeSystem');

jest.mock('../utils/HashGenerator');

jest.mock('@externals/word-purity');
jest.mock('@externals/simple-db');

/**
 * getMockSystemsInstance會取得所有jest mock的子系統的實例
 * @returns 所有system的mock實例
 */
function getMockSystemsInstance() {
    const mockDataBaseSystemInstance = jest.mocked(DataBaseSystem).mock.instances[0];
    const mockWordPuritySystemInstance = jest.mocked(WordPuritySystem).mock.instances[0];
    const mockFilterSystemInstance = jest.mocked(FilterSystem).mock.instances[0];
    const mockSortSystemInstance = jest.mocked(SortSystem).mock.instances[0];
    const mockDisplayRangeSystemInstance = jest.mocked(DisplayRangeSystem).mock.instances[0];

    return {
        mockDataBaseSystem: mockDataBaseSystemInstance,
        mockWordPuritySystem: mockWordPuritySystemInstance,
        mockFilterSystem: mockFilterSystemInstance,
        mockSortSystem: mockSortSystemInstance,
        mockDisplayRangeSystem: mockDisplayRangeSystemInstance
    }
}

/**
 * getMockSystemItems會取得所有子系統應該含有的items欄位假資料
 * @returns 所有子系統應該含有的items欄位假資料
 */
function getMockSystemItems() {
    return {
        mockDataBaseSystemItems: [MockSytemItems[0]],
        mockWordPuritySystemItems: [MockSytemItems[1]],
        mockFilterSystemItems: [MockSytemItems[2]],
        mockSortSystemItems: [MockSytemItems[3]],
        mockDisplayRangeSystemItems: [MockSytemItems[4]]
    }
}

/**
 * mockGetItemsFunction會將所有子系統下的getItems函式替換為spy
 */
function mockGetItemsFunction() {
    const mockSystems = getMockSystemsInstance();
    const mockSystemItems = getMockSystemItems();

    jest.spyOn(mockSystems.mockDataBaseSystem, 'getItems')
        .mockReturnValue(mockSystemItems.mockDataBaseSystemItems);

    jest.spyOn(mockSystems.mockWordPuritySystem, 'getItems')
        .mockReturnValue(mockSystemItems.mockWordPuritySystemItems);

    jest.spyOn(mockSystems.mockFilterSystem, 'getItems')
        .mockReturnValue(mockSystemItems.mockFilterSystemItems);

    jest.spyOn(mockSystems.mockSortSystem, 'getItems')
        .mockReturnValue(mockSystemItems.mockSortSystemItems);
    
    jest.spyOn(mockSystems.mockDisplayRangeSystem, 'getItems')
        .mockReturnValue(mockSystemItems.mockDisplayRangeSystemItems);
}

/**
 * mockGetUpdateMessageFunction會將所有子系統下的getUpdateMessage
 * 函式替換為spy
 */
function mockGetUpdateMessageFunction() {
    const mockSystems = getMockSystemsInstance();

    jest.spyOn(mockSystems.mockDataBaseSystem, 'getUpdateMessage').mockReturnValue("Data Base Update");
    jest.spyOn(mockSystems.mockWordPuritySystem, 'getUpdateMessage').mockReturnValue("Dom Purity Update");
    jest.spyOn(mockSystems.mockFilterSystem, 'getUpdateMessage').mockReturnValue("Filter Update");
    jest.spyOn(mockSystems.mockSortSystem, 'getUpdateMessage').mockReturnValue("Sort Update");
    jest.spyOn(mockSystems.mockDisplayRangeSystem, 'getUpdateMessage').mockReturnValue("Display Range Update");
}

/**
 * mockProcessFunction會將所有子系統下的process函式替換為spy
 * @returns 所有子系統下的mock process函式的spy物件
 */
function mockProcessFunction() {
    const mockSystems = getMockSystemsInstance();

    const dataBaseSystemProcessSpy = jest.spyOn(mockSystems.mockDataBaseSystem, 'process');
    const wordPuritySystemProcessSpy = jest.spyOn(mockSystems.mockWordPuritySystem, 'process');
    const filterSystemProcessSpy = jest.spyOn(mockSystems.mockFilterSystem, 'process');
    const sortSystemProcessSpy = jest.spyOn(mockSystems.mockSortSystem, 'process');
    const displayRangeSystemProcessSpy = jest.spyOn(mockSystems.mockDisplayRangeSystem, 'process');

    return {
        dataBaseSystemProcessSpy: dataBaseSystemProcessSpy,
        wordPuritySystemProcessSpy: wordPuritySystemProcessSpy,
        filterSystemProcessSpy: filterSystemProcessSpy,
        sortSystemProcessSpy: sortSystemProcessSpy,
        displayRangeSystemProcessSpy: displayRangeSystemProcessSpy,
    }
}

describe("ListViewerManager class", () => {
    beforeEach(() => {
        jest.mocked(DataBaseSystem).mockClear();
        jest.mocked(WordPuritySystem).mockClear();
        jest.mocked(FilterSystem).mockClear();
        jest.mocked(SortSystem).mockClear();
        jest.mocked(DisplayRangeSystem).mockClear();

        jest.mocked(HashGenerator).mockClear();

        jest.mocked(WordPurityService).mockClear();
        jest.mocked(BookDataBaseService).mockClear();
    });

    /**
     * 測試ListViewerManager是否正確Setup
     */ 
    test("Should setup normally", async () => {
        const listViewerManager = mockedSetter(new ListViewerManager(), 'processors');

        await listViewerManager.setUp();

        const mockDataBaseSystemInstance = jest.mocked(DataBaseSystem).mock.instances[0];
        const mockWordPurityServiceInstanceList = jest.mocked(WordPurityService).mock.instances;

        expect(mockDataBaseSystemInstance.connectDB).toBeCalled();
        expect(mockWordPurityServiceInstanceList.length).toBe(1);
        expect(listViewerManager._mockVar.length).toBe(5);
        expect(listViewerManager._mockVar[0]).toBeInstanceOf(DataBaseSystem);
        expect(listViewerManager._mockVar[1]).toBeInstanceOf(WordPuritySystem);
        expect(listViewerManager._mockVar[2]).toBeInstanceOf(FilterSystem);
        expect(listViewerManager._mockVar[3]).toBeInstanceOf(SortSystem);
        expect(listViewerManager._mockVar[4]).toBeInstanceOf(DisplayRangeSystem);
    });

    /**
     * 測試ListViewerManager.updateResult傳入UpdateType.Data，
     * 是否正確從DataBaseSystem子系統開始Update
     */ 
    test("Should update result starting from DataBaseSystem", async () => {
        const listViewerManager = mockedSetter(new ListViewerManager(), 'updateMsg');

        await listViewerManager.setUp();

        mockGetItemsFunction();
        mockGetUpdateMessageFunction();

        const processFunctionSpys = mockProcessFunction();
        const mockSystemItems = getMockSystemItems();

        const expectedUpdateMessage = [
            "Data Base Update",
            "Dom Purity Update",
            "Filter Update",
            "Sort Update",
            "Display Range Update"
        ];

        await listViewerManager.updateResult(UpdateType.Data);

        expect(listViewerManager._mockVar).toStrictEqual(expectedUpdateMessage);

        expect(processFunctionSpys.dataBaseSystemProcessSpy).toBeCalledWith([]);
        expect(processFunctionSpys.wordPuritySystemProcessSpy).toBeCalledWith(mockSystemItems.mockDataBaseSystemItems);
        expect(processFunctionSpys.filterSystemProcessSpy).toBeCalledWith(mockSystemItems.mockWordPuritySystemItems);
        expect(processFunctionSpys.sortSystemProcessSpy).toBeCalledWith(mockSystemItems.mockFilterSystemItems);
        expect(processFunctionSpys.displayRangeSystemProcessSpy).toBeCalledWith(mockSystemItems.mockSortSystemItems);
    });

    /**
     * 測試ListViewerManager.updateResult傳入非法的UpdateType，
     * 是否正確的未Update任何子系統
     */ 
    test("Should not update any result (illegal update type)", async () => {
        const listViewerManager = mockedSetter(new ListViewerManager(), 'updateMsg');

        await listViewerManager.setUp();

        await listViewerManager.updateResult(10 as any);

        expect(listViewerManager._mockVar).toStrictEqual([]);
    });

    /**
     * 測試ListViewerManager.getUpdateMessage是否回傳正確的字串
     */ 
    test("Should get an empty array from the updateMsg", () => {
        const listViewerManager = new ListViewerManager();

        const updateMsg = listViewerManager.getUpdateMessage();

        expect(updateMsg).toStrictEqual([]);
    });

    /**
     * 測試ListViewerManager.getProcessor傳入UpdateType.Data，是否
     * 正確回傳DataBaseSystem子系統的Instance
     */ 
    test("Should get a DataBaseSystem instance from the processors", async () => {
        const listViewerManager = new ListViewerManager();

        await listViewerManager.setUp();

        const processor = listViewerManager.getProcessor(UpdateType.Data);

        expect(processor).toBeInstanceOf(DataBaseSystem);
    });

    /**
     * 測試ListViewerManager.getProcessor傳入非法的UpdateType，是否
     * 正確回傳一個undefined作為結果
     */ 
    test("Should get undefined from the processors (illegal update type)", async () => {
        const listViewerManager = new ListViewerManager();

        await listViewerManager.setUp();

        expect(listViewerManager.getProcessor(-1 as any)).toBe(undefined);
        expect(listViewerManager.getProcessor(10 as any)).toBe(undefined);
    });

    /**
     * 測試ListViewerManager.generateDisplayItemRow是否正確回傳最後一個
     * 子系統所處理的items
     */ 
    test("Should get the last BookInfo Item from the processors' chain", async () => {
        const listViewerManager = new ListViewerManager();

        await listViewerManager.setUp();

        const mockDisplayRangeSystemInstance = jest.mocked(DisplayRangeSystem).mock.instances[0];

        const mockDisplayRangeSystemItems = [{
            "ISBN": "4",
            "title": "DisplayRangeSystem items",
            "author": ""
        }];

        jest.spyOn(mockDisplayRangeSystemInstance, 'getItems').mockReturnValue(mockDisplayRangeSystemItems);

        const displayItemRow = listViewerManager.generateDisplayItemRow();

        expect(displayItemRow).toStrictEqual(mockDisplayRangeSystemItems);
    });

    /**
     * 測試ListViewerManager.updateResult傳入非法的UpdateType (小於0)，
     * 是否擲出Cannot read properties of undefined錯誤
     */ 
    test("Should throw a cannot read properties of undefined error (illegal update type)", async () => {
        const listViewerManager = new ListViewerManager();

        await listViewerManager.setUp();

        await expect(listViewerManager.updateResult(-1 as any)).rejects.toThrowError("Cannot read properties of undefined");
    });
});
