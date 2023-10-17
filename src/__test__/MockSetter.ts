/**
 * mockedSetter會將傳入的mockedClass中名稱為targetVariableName
 * 的變數對應的getter和setter替換為mock方法，若使用者賦值給指定的變數，會將使用者
 * 賦的值重新導向到class內的public _mockVar變數存放，方便外部確認變數情況。同時也
 * 會將getter重新定義為回傳_mockVar變數的值，以供接下來的測試流程使用
 * @param mockedClass 欲處理的class
 * @param targetVariableName 欲替換的目標變數名稱
 * @returns 處理完class
 */
export function mockedSetter(mockedClass: Record<string, any>, targetVariableName: string) {
    mockedClass._mockVar = undefined;

    const mockedSetter = jest.fn();

    mockedSetter.mockImplementation((val) => {
        mockedClass._mockVar = val;
    });

    Object.defineProperty(mockedClass, targetVariableName, {
        get: () => {
            return mockedClass._mockVar;
        },
        set: mockedSetter,
        configurable: true,
    });

    return mockedClass;
}