import React, { createContext, useContext, useState, ReactNode } from "react";

type PySandpackContextType = {
    code: string;
    setCode: (code: string) => void;
    result: Result | undefined;
    setResult: (result: Result | undefined) => void;
    error: Error | undefined;
    setError: (error: Error | undefined) => void;
    isRunning: boolean;
    setIsRunning: (isRunning: boolean) => void;
}

const PySandpackContext = createContext<PySandpackContextType | undefined>(undefined);

type PySandpackProviderProps = {
    children: ReactNode;
};

type Result = {
    type: 'string';
    data: any;
}

export const PySandpackProvider = ({ children }: PySandpackProviderProps) => {
    const [code, setCode] = useState<string>("");
    const [result, setResult] = useState<Result>();
    const [error, setError] = useState<Error>();
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const contextValue: PySandpackContextType = {
        code,
        setCode,
        result,
        setResult,
        error,
        setError,
        isRunning,
        setIsRunning,
    };

    return (
        <PySandpackContext.Provider value={contextValue}>
            {children}
        </PySandpackContext.Provider>
    );
};

export const usePySandpack = () => {
    const context = useContext(PySandpackContext);

    if (!context) {
        throw new Error("usePySandpack must be used within a PySandpackProvider");
    }
    return context;
};
