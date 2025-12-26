function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

class H5PackBridge {
  callbacks = new Map();
  modules = {};
  isAvailable = false;
  constructor() {
    if (typeof window !== 'undefined' && window.ReactNativeWebView) {
      this.isAvailable = true;
    }
    this.setupEventListeners();
  }
  // 使用 getter 替代 Proxy
  get camera() {
    return this.modules.camera;
  }
  get location() {
    return this.modules.location;
  }
  get recordAudio() {
    return this.modules.recordAudio;
  }
  get app() {
    return this.modules.app;
  }
  // 注册模块 - 使用泛型确保类型安全
  registerModule(moduleName, module) {
    this.modules[moduleName] = module;
  }
  // 获取模块 - 类型安全的方法
  getModule(moduleName) {
    return this.modules?.[moduleName];
  }
  callNative(module, action, params) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject(new Error('Native bridge not available'));
        return;
      }
      const callId = `call_${generateId()}`;
      const timeoutId = setTimeout(() => {
        this.cleanupCallback(callId);
        reject(new Error('Bridge call timeout'));
      }, 30000); // 30秒超时
      this.callbacks.set(callId, {
        resolve,
        reject,
        timeoutId
      });
      const message = {
        type: 'bridge_call',
        callId,
        module,
        action,
        params,
        timestamp: Date.now()
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    });
  }
  // 设置消息处理器
  setupEventListeners() {
    // 兼容不同环境的通信方式
    if (window.ReactNativeWebView) {
      // React Native WebView 环境
      // @ts-ignore
      document.addEventListener('message', this.handleNativeMessage);
    }
    // 标准方式
    window.addEventListener('message', this.handleNativeMessage);
  }
  handleNativeMessage = event => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'bridge_response') {
        const {
          callId,
          success,
          data: result,
          error
        } = data;
        const callback = this.callbacks.get(callId);
        if (callback) {
          this.cleanupCallback(callId);
          if (success) {
            callback.resolve(result);
          } else {
            callback.reject(new Error(error || 'Native call failed'));
          }
        }
      }
    } catch (error) {
      console.error('Failed to handle native message:', error);
    }
  };
  // 清理回调
  cleanupCallback(callId) {
    const callback = this.callbacks.get(callId);
    if (callback) {
      clearTimeout(callback.timeoutId);
      this.callbacks.delete(callId);
    }
  }
}

class BaseModule {
  h5packBridge;
  moduleName;
  constructor(h5packBridge, moduleName) {
    this.h5packBridge = h5packBridge;
    this.moduleName = moduleName;
  }
  async call(action, params) {
    return this.h5packBridge.callNative(this.moduleName, action, params);
  }
  handleError(error, defaultMessage = 'Operation failed') {
    console.error(`[${this.moduleName}] Error:`, error);
    throw new Error(error.message || defaultMessage);
  }
}

class AppModule extends BaseModule {
  constructor(bridgeManager) {
    super(bridgeManager, 'app');
  }
  async exit(options = {}) {
    try {
      return await this.call('exit', options);
    } catch (error) {
      return this.handleError(error, 'Failed to exit');
    }
  }
  async relaunch(options = {}) {
    try {
      return await this.call('relaunch', options);
    } catch (error) {
      return this.handleError(error, 'Failed to relaunch');
    }
  }
  async refresh(options = {}) {
    try {
      return await this.call('refresh', options);
    } catch (error) {
      return this.handleError(error, 'Failed to refresh');
    }
  }
}

class CameraModule extends BaseModule {
  constructor(bridgeManager) {
    super(bridgeManager, 'camera');
  }
  async open(options = {}) {
    const params = {
      cameraType: options.cameraType || 'back',
      // front|back
      mediaType: 'photo',
      saveToPhotos: false,
      ...options
    };
    try {
      return await this.call('open', params);
    } catch (error) {
      return this.handleError(error, 'Failed to open camera');
    }
  }
  async scan() {
    try {
      return await this.call('scan');
    } catch (error) {
      return this.handleError(error, 'Failed to open scan');
    }
  }
  async chooseImage(options = {}) {
    const params = {
      mediaType: 'photo',
      includeBase64: options?.includeBase64 || false,
      maxWidth: options?.maxWidth || 1024,
      maxHeight: options?.maxHeight || 1024,
      quality: options?.quality || 0.8,
      selectionLimit: options?.selectionLimit || 9,
      // 最多选择数量
      ...options
    };
    try {
      return await this.call('chooseImage', params);
    } catch (error) {
      return this.handleError(error, 'Failed to choose image');
    }
  }
  async checkPermission() {
    try {
      return await this.call('checkPermission');
    } catch (error) {
      return this.handleError(error, 'Failed to check camera permission');
    }
  }
  // 申请权限
  async requestPermission() {
    try {
      return await this.call('requestPermission');
    } catch (error) {
      return this.handleError(error, 'Failed to request camera permission');
    }
  }
}

class LocationModule extends BaseModule {
  constructor(bridgeManager) {
    super(bridgeManager, 'location');
  }
  async getCurrentPosition(options = {}) {
    const params = {
      enableHighAccuracy: false,
      maximumAge: 0,
      ...options
    };
    try {
      return await this.call('getCurrentPosition', params);
    } catch (error) {
      return this.handleError(error, 'Failed to get current location');
    }
  }
}

class RecordAudioModule extends BaseModule {
  constructor(bridgeManager) {
    super(bridgeManager, 'recordAudio');
  }
  /**
   * 开始录音
   * @returns 录音文件路径
   */
  async start(options = {}) {
    try {
      return await this.call('start', options);
    } catch (error) {
      return this.handleError(error, 'Failed to start record audio');
    }
  }
  /**
   * 停止录音
   * @returns 录音文件路径和录音时长
   */
  async stop() {
    try {
      return await this.call('stop');
    } catch (error) {
      return this.handleError(error, 'Failed to stop record audio');
    }
  }
  /**
   * 取消录音
   */
  async cancel() {
    try {
      return await this.call('cancel');
    } catch (error) {
      return this.handleError(error, 'Failed to cancel record audio');
    }
  }
  /**
   * 重新开始录音
   */
  async restart(options = {}) {
    try {
      return await this.call('restart', options);
    } catch (error) {
      return this.handleError(error, 'Failed to restart record audio');
    }
  }
  /**
   * 检查权限
   */
  async checkPermission() {
    try {
      return await this.call('checkPermission');
    } catch (error) {
      return this.handleError(error, 'Failed to check record audio permission');
    }
  }
  /**
   * 申请权限
   */
  async requestPermission() {
    try {
      return await this.call('requestPermission');
    } catch (error) {
      return this.handleError(error, 'Failed to request record audio permission');
    }
  }
}

const h5packBridge = new H5PackBridge();
h5packBridge.registerModule('camera', new CameraModule(h5packBridge));
h5packBridge.registerModule('location', new LocationModule(h5packBridge));
h5packBridge.registerModule('recordAudio', new RecordAudioModule(h5packBridge));
h5packBridge.registerModule('app', new AppModule(h5packBridge));
// 自动挂载到全局对象
if (typeof window !== 'undefined') {
  window.h5packBridge = h5packBridge;
}

export { CameraModule, h5packBridge as default, h5packBridge };
