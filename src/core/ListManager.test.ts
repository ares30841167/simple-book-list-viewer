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

function getMockSystemItems() {
    return {
        mockDataBaseSystemItems: [MockSytemItems[0]],
        mockWordPuritySystemItems: [MockSytemItems[1]],
        mockFilterSystemItems: [MockSytemItems[2]],
        mockSortSystemItems: [MockSytemItems[3]],
        mockDisplayRangeSystemItems: [MockSytemItems[4]]
    }
}

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

function mockGetUpdateMessageFunction() {
    const mockSystems = getMockSystemsInstance();

    jest.spyOn(mockSystems.mockDataBaseSystem, 'getUpdateMessage').mockReturnValue("Data Base Update");
    jest.spyOn(mockSystems.mockWordPuritySystem, 'getUpdateMessage').mockReturnValue("Dom Purity Update");
    jest.spyOn(mockSystems.mockFilterSystem, 'getUpdateMessage').mockReturnValue("Filter Update");
    jest.spyOn(mockSystems.mockSortSystem, 'getUpdateMessage').mockReturnValue("Sort Update");
    jest.spyOn(mockSystems.mockDisplayRangeSystem, 'getUpdateMessage').mockReturnValue("Display Range Update");
}

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

    test("Should not update any result (illegal update type)", async () => {
        const listViewerManager = mockedSetter(new ListViewerManager(), 'updateMsg');

        await listViewerManager.setUp();

        await listViewerManager.updateResult(10 as any);

        expect(listViewerManager._mockVar).toStrictEqual([]);
    });

    test("Should get an empty array from the updateMsg", () => {
        const listViewerManager = new ListViewerManager();

        const updateMsg = listViewerManager.getUpdateMessage();

        expect(updateMsg).toStrictEqual([]);
    });

    test("Should get a DataBaseSystem instance from the processors", async () => {
        const listViewerManager = new ListViewerManager();

        await listViewerManager.setUp();

        const processor = listViewerManager.getProcessor(UpdateType.Data);

        expect(processor).toBeInstanceOf(DataBaseSystem);
    });

    test("Should get undefined from the processors (illegal update type)", async () => {
        const listViewerManager = new ListViewerManager();

        await listViewerManager.setUp();

        expect(listViewerManager.getProcessor(-1 as any)).toBe(undefined);
        expect(listViewerManager.getProcessor(10 as any)).toBe(undefined);
    });

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

    test("Should throw a cannot read properties of undefined error (illegal update type)", async () => {
        const listViewerManager = new ListViewerManager();

        await listViewerManager.setUp();

        await expect(listViewerManager.updateResult(-1 as any)).rejects.toThrowError("Cannot read properties of undefined");
    });
});
