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