import { TBaseParams } from '@src/types/app'
import { H5PackBridge } from '../core'
import { BaseModule } from '../core/base'

export class AppModule extends BaseModule {
	constructor(bridgeManager: H5PackBridge) {
		super(bridgeManager, 'app')
	}

	async exit(options: TBaseParams = {}) {
		try {
			return await this.call<void>('exit', options)
		} catch (error: any) {
			return this.handleError(error, 'Failed to exit')
		}
	}

	async relaunch(options: TBaseParams = {}) {
		try {
			return await this.call<void>('relaunch', options)
		} catch (error: any) {
			return this.handleError(error, 'Failed to relaunch')
		}
	}

	async refresh(options: TBaseParams = {}) {
		try {
			return await this.call<void>('refresh', options)
		} catch (error: any) {
			return this.handleError(error, 'Failed to refresh')
		}
	}
}
