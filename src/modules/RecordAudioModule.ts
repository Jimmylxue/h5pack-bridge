import { StartOptions, StopResult } from '@src/types/recordAudio'
import { H5PackBridge } from '../core'
import { BaseModule } from '../core/base'

export class RecordAudioModule extends BaseModule {
	constructor(bridgeManager: H5PackBridge) {
		super(bridgeManager, 'recordAudio')
	}

	/**
	 * 开始录音
	 * @returns 录音文件路径
	 */
	async start(options: StartOptions = {}) {
		try {
			return await this.call<string>('start', options)
		} catch (error: any) {
			return this.handleError(error, 'Failed to start record audio')
		}
	}

	/**
	 * 停止录音
	 * @returns 录音文件路径和录音时长
	 */
	async stop() {
		try {
			return await this.call<StopResult>('stop')
		} catch (error: any) {
			return this.handleError(error, 'Failed to stop record audio')
		}
	}

	/**
	 * 取消录音
	 */
	async cancel() {
		try {
			return await this.call<void>('cancel')
		} catch (error: any) {
			return this.handleError(error, 'Failed to cancel record audio')
		}
	}

	/**
	 * 重新开始录音
	 */
	async restart(options: StartOptions = {}) {
		try {
			return await this.call<string>('restart', options)
		} catch (error: any) {
			return this.handleError(error, 'Failed to restart record audio')
		}
	}

	/**
	 * 检查权限
	 */
	async checkPermission() {
		try {
			return await this.call<boolean>('checkPermission')
		} catch (error: any) {
			return this.handleError(error, 'Failed to check record audio permission')
		}
	}

	/**
	 * 申请权限
	 */
	async requestPermission() {
		try {
			return await this.call<boolean>('requestPermission')
		} catch (error: any) {
			return this.handleError(
				error,
				'Failed to request record audio permission'
			)
		}
	}
}
