import { H5PackBridge } from './core'
import { CameraModule } from './modules/CameraModule'
export { CameraModule } from './modules/CameraModule'

export const h5packBridge = new H5PackBridge()

h5packBridge.registerModule('camera', new CameraModule(h5packBridge))

// 自动挂载到全局对象
if (typeof window !== 'undefined') {
	window.h5packBridge = h5packBridge
}

export default h5packBridge
