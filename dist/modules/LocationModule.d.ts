import { GeolocationOptions, GeolocationResponse } from '../types/location';
import { H5PackBridge } from '../core';
import { BaseModule } from '../core/base';
export declare class LocationModule extends BaseModule {
    constructor(bridgeManager: H5PackBridge);
    getCurrentPosition(options?: GeolocationOptions): Promise<void | GeolocationResponse>;
}
