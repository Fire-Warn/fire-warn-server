export interface AudioTtsResponse {
	status: string;
	message: string | null;
	res: string | null;
	data: Array<{ name: string; id: number; error: string | null }>;
}
