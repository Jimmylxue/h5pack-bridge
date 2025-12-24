export type StartOptions = {
	fileName?: string
	sampleRate?: number
	bitRate?: number
}

export type StopResult = {
	path: string
	durationMs: number
}
