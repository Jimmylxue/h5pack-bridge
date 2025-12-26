import { H5PackBridge } from './core'
import { AppModule } from './modules/AppModule'
import { CameraModule } from './modules/CameraModule'
import { LocationModule } from './modules/LocationModule'
export { CameraModule } from './modules/CameraModule'
import { RecordAudioModule } from './modules/RecordAudioModule'

export const h5packBridge = new H5PackBridge()

h5packBridge.registerModule('camera', new CameraModule(h5packBridge))
h5packBridge.registerModule('location', new LocationModule(h5packBridge))
h5packBridge.registerModule('recordAudio', new RecordAudioModule(h5packBridge))
h5packBridge.registerModule('app', new AppModule(h5packBridge))

// 自动挂载到全局对象
if (typeof window !== 'undefined') {
	window.h5packBridge = h5packBridge
}

export default h5packBridge
