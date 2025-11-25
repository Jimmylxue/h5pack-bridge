(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.H5PackBridge = {}));
})(this, (function (exports) { 'use strict';

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

class H5PackBridge {
  callbacks = new Map();
  modules = new Map();
  isAvailable = false;
  constructor() {
    if (typeof window !== 'undefined' && window.ReactNativeWebView) {
      this.isAvailable = true;
    }
    this.setupEventListeners();
    return new Proxy(this, {
      get(target, prop) {
        // 如果访问的是已注册的模块名，返回模块实例
        if (target.modules.has(prop)) {
          return target.modules.get(prop);
        }
        // 否则返回类的原有属性
        return target[prop];
      }
    });
  }
  // 注册模块
  registerModule(moduleName, module) {
    this.modules.set(moduleName, module);
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

class CameraModule extends BaseModule {
  constructor(bridgeManager) {
    super(bridgeManager, 'camera');
  }
  async open(options) {
    try {
      return await this.call('open', {
        cameraType: options.cameraType || 'back' // front|back
      });
    } catch (error) {
      return this.handleError(error, 'Failed to open camera');
    }
  }
  async chooseImage(options = {}) {
    try {
      return await this.call('chooseImage', options);
    } catch (error) {
      return this.handleError(error, 'Failed to open camera');
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

const h5packBridge = new H5PackBridge();
h5packBridge.registerModule('camera', new CameraModule(h5packBridge));
// 自动挂载到全局对象
if (typeof window !== 'undefined') {
  window.h5packBridge = h5packBridge;
}

exports.CameraModule = CameraModule;
exports["default"] = h5packBridge;
exports.h5packBridge = h5packBridge;

Object.defineProperty(exports, '__esModule', { value: true });

}));
