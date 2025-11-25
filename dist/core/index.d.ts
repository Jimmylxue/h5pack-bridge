import { CameraModule } from '../modules/CameraModule';
type TCallBack = {
    resolve: (value: unknown) => void;
    reject: (reason: any) => void;
    timeoutId: NodeJS.Timeout;
};
export declare class H5PackBridge {
    callbacks: Map<string, TCallBack>;
    modules: Map<string, CameraModule>;
    isAvailable: boolean;
    constructor();
    registerModule(moduleName: string, module: any): void;
    callNative(module: string, action: string, params: any): Promise<unknown>;
    setupEventListeners(): void;
    handleNativeMessage: (event: MessageEvent) => void;
    cleanupCallback(callId: string): void;
}
export {};
