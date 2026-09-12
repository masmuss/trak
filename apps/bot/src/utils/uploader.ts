export type FileInfo = {
	fileId: string;
	fileType: string;
	storageUrl: string;
};

export function processTelegramFile(fileId: string, fileType?: string): FileInfo {
	const mimeType = fileType ?? 'application/octet-stream';

	return {
		fileId,
		fileType: mimeType,
		storageUrl: `telegram://${fileId}`
	};
}
