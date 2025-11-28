import { H5PackBridge } from '../core'
import { BaseModule } from '../core/base'
import { CameraOptions, ImageLibraryOptions, TAsset } from '../types/camera'

export class CameraModule extends BaseModule {
	constructor(bridgeManager: H5PackBridge) {
		super(bridgeManager, 'camera')
	}

	async open(options: CameraOptions = {}) {
		const params = {
			cameraType: options.cameraType || 'back', // front|back
			mediaType: 'photo',
			saveToPhotos: false,
			...options,
		}
		try {
			return await this.call<TAsset>('open', params)
		} catch (error: any) {
			return this.handleError(error, 'Failed to open camera')
		}
	}

	async scan() {
		try {
			return await this.call<TAsset>('scan')
		} catch (error: any) {
			return this.handleError(error, 'Failed to open scan')
		}
	}

	async chooseImage(options: ImageLibraryOptions = {}) {
		const params = {
			mediaType: 'photo' as const,
			includeBase64: options?.includeBase64 || false,
			maxWidth: options?.maxWidth || 1024,
			maxHeight: options?.maxHeight || 1024,
			quality: options?.quality || 0.8,
			selectionLimit: options?.selectionLimit || 9, // 最多选择数量
			...options,
		}
		try {
			return await this.call<TAsset[]>('chooseImage', params)
		} catch (error: any) {
			return this.handleError(error, 'Failed to choose image')
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
