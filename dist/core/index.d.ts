import { LocationModule } from '@src/modules/LocationModule';
import { CameraModule } from '../modules/CameraModule';
type TCallBack = {
    resolve: (value: unknown) => void;
    reject: (reason: any) => void;
    timeoutId: NodeJS.Timeout;
};
type ModuleMap = {
    camera?: CameraModule;
    location?: LocationModule;
};
type ModuleName = keyof ModuleMap;
export type H5PackBridgeInstance = H5PackBridge & ModuleMap;
export declare class H5PackBridge {
    callbacks: Map<string, TCallBack>;
    modules: ModuleMap;
    isAvailable: boolean;
    constructor();
    get camera(): CameraModule | undefined;
    get location(): LocationModule | undefined;
    registerModule<T extends ModuleName>(moduleName: T, module: ModuleMap[T]): void;
    getModule<T extends ModuleName>(moduleName: T): ModuleMap[T] | undefined;
    callNative(module: string, action: string, params: any): Promise<unknown>;
    setupEventListeners(): void;
    handleNativeMessage: (event: MessageEvent) => void;
    cleanupCallback(callId: string): void;
}
export {};
