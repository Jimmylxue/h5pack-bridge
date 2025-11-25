// types/global.d.ts
import { WebViewProps } from 'react-native-webview'
import { H5PackBridge } from './src/core'

declare global {
	namespace ReactNativeWebView {
		interface WebView extends React.Component<WebViewProps> {
			// 这里可以添加 WebView 的特定方法
			postMessage: (message: string) => void
			injectJavaScript: (script: string) => void
			reload: () => void
			// 添加其他你需要的方法
		}
	}

	interface Window {
		ReactNativeWebView?: ReactNativeWebView.WebView
		__H5PACK_BRIDGE_RECEIVER__?: (event: MessageEvent) => void
		H5PackBridge: any
		h5packBridge: any
	}

	interface Global {
		ReactNativeWebView?: ReactNativeWebView.WebView
	}

	// 对于现代 TypeScript，使用 globalThis
	var ReactNativeWebView: ReactNativeWebView.WebView | undefined
}

// 确保这个文件被当作模块处理
export {}
