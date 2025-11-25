import { H5PackBridge } from '.'

export class BaseModule {
	constructor(private h5packBridge: H5PackBridge, private moduleName: string) {}

	async call<T>(action: any, params?: any) {
		return this.h5packBridge.callNative(this.moduleName, action, params) as T
	}

	handleError(error: Error, defaultMessage: string = 'Operation failed') {
		console.error(`[${this.moduleName}] Error:`, error)
		throw new Error(error.message || defaultMessage)
	}
}
