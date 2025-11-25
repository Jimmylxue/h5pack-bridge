import { H5PackBridge } from '.';
export declare class BaseModule {
    private h5packBridge;
    private moduleName;
    constructor(h5packBridge: H5PackBridge, moduleName: string);
    call<T>(action: any, params?: any): Promise<T>;
    handleError(error: Error, defaultMessage?: string): void;
}
