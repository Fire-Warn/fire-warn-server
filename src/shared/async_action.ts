export class AsyncAction {
	constructor(
		private name: string,
		private readonly action: () => Promise<any>,
		private readonly successCallback?: (result?: any) => any,
		private readonly failureCallback?: (error: any) => any,
	) {}

	public run(delay: number = 0) {
		setTimeout(() => {
			Promise.resolve(this.action())
				.then(result => {
					if (this.successCallback) {
						this.successCallback(result);
					}
				})
				.catch(error => {
					console.error(`${this.name} failed. ${error.message}`);
					if (this.failureCallback) {
						this.failureCallback(error);
					}
				});
		}, delay);
	}
}
