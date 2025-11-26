import { LocationModule } from '@src/modules/LocationModule'
import { CameraModule } from '../modules/CameraModule'
import { generateId } from '../utils'

type TCallBack = {
	resolve: (value: unknown) => void
	reject: (reason: any) => void
	timeoutId: NodeJS.Timeout
}

// 定义模块类型映射
type ModuleMap = {
	camera?: CameraModule
	location?: LocationModule
}

type ModuleName = keyof ModuleMap

export type H5PackBridgeInstance = H5PackBridge & ModuleMap
export class H5PackBridge {
	callbacks: Map<string, TCallBack> = new Map()
	modules: ModuleMap = {}

	public isAvailable: boolean = false

	constructor() {
		if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
			this.isAvailable = true
		}

		this.setupEventListeners()
	}

	// 使用 getter 替代 Proxy
	get camera(): CameraModule | undefined {
		return this.modules.camera
	}

	get location(): LocationModule | undefined {
		return this.modules.location
	}

	// 注册模块 - 使用泛型确保类型安全
	registerModule<T extends ModuleName>(
		moduleName: T,
		module: ModuleMap[T]
	): void {
		this.modules[moduleName] = module
	}

	// 获取模块 - 类型安全的方法
	getModule<T extends ModuleName>(moduleName: T): ModuleMap[T] | undefined {
		return this.modules?.[moduleName] as ModuleMap[T] | undefined
	}

	callNative(module: string, action: string, params: any) {
		return new Promise((resolve, reject) => {
			if (!this.isAvailable) {
				reject(new Error('Native bridge not available'))
				return
			}

			const callId = `call_${generateId()}`

			const timeoutId = setTimeout(() => {
				this.cleanupCallback(callId)
				reject(new Error('Bridge call timeout'))
			}, 30000) // 30秒超时

			this.callbacks.set(callId, { resolve, reject, timeoutId })

			const message = {
				type: 'bridge_call',
				callId,
				module,
				action,
				params,
				timestamp: Date.now(),
			}

			window.ReactNativeWebView!.postMessage(JSON.stringify(message))
		})
	}

	// 设置消息处理器
	setupEventListeners() {
		// 兼容不同环境的通信方式
		if (window.ReactNativeWebView) {
			// React Native WebView 环境
			// @ts-ignore
			document.addEventListener('message', this.handleNativeMessage)
		}

		// 标准方式
		window.addEventListener('message', this.handleNativeMessage)
	}

	handleNativeMessage = (event: MessageEvent) => {
		try {
			const data = JSON.parse(event.data)

			if (data.type === 'bridge_response') {
				const { callId, success, data: result, error } = data
				const callback = this.callbacks.get(callId)

				if (callback) {
					this.cleanupCallback(callId)

					if (success) {
						callback.resolve(result)
					} else {
						callback.reject(new Error(error || 'Native call failed'))
					}
				}
			}
		} catch (error) {
			console.error('Failed to handle native message:', error)
		}
	}

	// 清理回调
	cleanupCallback(callId: string) {
		const callback = this.callbacks.get(callId)
		if (callback) {
			clearTimeout(callback.timeoutId)
			this.callbacks.delete(callId)
		}
	}
}
