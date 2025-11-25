import { defineConfig } from 'rollup'
import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve' // 修正：应该是 node-resolve

const extensions = ['.ts', '.tsx']

const noDeclarationFiles = { compilerOptions: { declaration: false } }

// 添加 UMD 配置
function umdConfig(prod) {
	return {
		input: 'src/index.ts',
		output: {
			file: prod ? 'dist/h5pack-bridge.min.js' : 'dist/h5pack-bridge.js',
			format: 'umd',
			name: 'H5PackBridge', // 全局变量名，在 HTML 中通过这个名称访问
			indent: false,
		},
		plugins: [
			resolve({ extensions }), // 修正：使用 node-resolve
			commonjs(),
			typescript(
				prod
					? { useTsconfigDeclarationDir: true }
					: { tsconfigOverride: noDeclarationFiles }
			),
			babel({
				extensions,
				plugins: [['@babel/plugin-transform-runtime']],
				babelHelpers: 'runtime',
			}),
			prod && terser(),
		],
	}
}

// 保持原有的 ES 模块和 CommonJS 配置用于其他环境
function moduleConfig(prod, type) {
	return {
		input: 'src/index.ts',
		output: {
			file: prod
				? `dist/h5PackBridge.${type === 'cjs' ? 'cjs' : 'esm'}.prod.js`
				: `dist/h5PackBridge.${type === 'cjs' ? 'cjs' : 'esm'}.js`,
			format: type,
			indent: false,
		},
		plugins: [
			resolve({ extensions }),
			commonjs(),
			typescript(
				prod && type === 'cjs'
					? { useTsconfigDeclarationDir: true }
					: { tsconfigOverride: noDeclarationFiles }
			),
			babel({
				extensions,
				plugins: [['@babel/plugin-transform-runtime']],
				babelHelpers: 'runtime',
			}),
			prod && terser(),
		],
	}
}

export default defineConfig([
	umdConfig(false), // 开发版 UMD
	umdConfig(true), // 生产版 UMD（压缩）
	moduleConfig(false, 'esm'), // ES 模块
	moduleConfig(true, 'esm'), // ES 模块
])
