import { H5PackBridge } from '../core'
import { BaseModule } from '../core/base'
import { CameraOptions, OptionsCommon, TAsset } from '../types/camera'

export class CameraModule extends BaseModule {
	constructor(bridgeManager: H5PackBridge) {
		super(bridgeManager, 'camera')
	}

	async open(options: CameraOptions) {
		try {
			return await this.call<TAsset>('open', {
				cameraType: options.cameraType || 'back', // front|back
			})
		} catch (error: any) {
			return this.handleError(error, 'Failed to open camera')
		}
	}

	async chooseImage(options: OptionsCommon = {}) {
		try {
			return await this.call<TAsset[]>('chooseImage', options)
		} catch (error: any) {
			return this.handleError(error, 'Failed to open camera')
		}
	}

	async checkPermission() {
		try {
			return await this.call<boolean>('checkPermission')
		} catch (error: any) {
			return this.handleError(error, 'Failed to check camera permission')
		}
	}

	// 申请权限
	async requestPermission() {
		try {
			return await this.call('requestPermission')
		} catch (error: any) {
			return this.handleError(error, 'Failed to request camera permission')
		}
	}
}
