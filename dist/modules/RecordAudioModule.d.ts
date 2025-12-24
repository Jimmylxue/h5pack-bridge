import { StartOptions, StopResult } from '@src/types/recordAudio';
import { H5PackBridge } from '../core';
import { BaseModule } from '../core/base';
export declare class RecordAudioModule extends BaseModule {
    constructor(bridgeManager: H5PackBridge);
    /**
     * 开始录音
     * @returns 录音文件路径
     */
    start(options?: StartOptions): Promise<string | void>;
    /**
     * 停止录音
     * @returns 录音文件路径和录音时长
     */
    stop(): Promise<void | StopResult>;
    /**
     * 取消录音
     */
    cancel(): Promise<void>;
    /**
     * 重新开始录音
     */
    restart(options?: StartOptions): Promise<string | void>;
    /**
     * 检查权限
     */
    checkPermission(): Promise<boolean | void>;
    /**
     * 申请权限
     */
    requestPermission(): Promise<boolean | void>;
}
