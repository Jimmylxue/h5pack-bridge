import { TBaseParams } from '@src/types/app';
import { H5PackBridge } from '../core';
import { BaseModule } from '../core/base';
export declare class AppModule extends BaseModule {
    constructor(bridgeManager: H5PackBridge);
    exit(options?: TBaseParams): Promise<void>;
    relaunch(options?: TBaseParams): Promise<void>;
    refresh(options?: TBaseParams): Promise<void>;
}
