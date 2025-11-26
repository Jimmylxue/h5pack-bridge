import { GeolocationOptions, GeolocationResponse } from '../types/location'
import { H5PackBridge } from '../core'
import { BaseModule } from '../core/base'

export class LocationModule extends BaseModule {
	constructor(bridgeManager: H5PackBridge) {
		super(bridgeManager, 'location')
	}

	async getCurrentPosition(options: GeolocationOptions = {}) {
		const params = { enableHighAccuracy: false, maximumAge: 0, ...options }
		try {
			return await this.call<GeolocationResponse>('getCurrentPosition', params)
		} catch (error: any) {
			return this.handleError(error, 'Failed to get current location')
		}
	}
}
