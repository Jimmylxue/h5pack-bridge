import { H5PackBridge } from '../core';
import { BaseModule } from '../core/base';
import { CameraOptions, OptionsCommon, TAsset } from '../types/camera';
export declare class CameraModule extends BaseModule {
    constructor(bridgeManager: H5PackBridge);
    open(options: CameraOptions): Promise<void | TAsset>;
    chooseImage(options?: OptionsCommon): Promise<void | TAsset[]>;
    checkPermission(): Promise<boolean | void>;
    requestPermission(): Promise<unknown>;
}
