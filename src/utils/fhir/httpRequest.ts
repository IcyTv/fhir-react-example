export type Request<T> = (url: URL, data?: any) => Promise<T>;

export async function GetRequest<T>(url: URL, _data?: any): Promise<T> {
	const response = await fetch(url.href, {
		headers: {
			Accept: 'application/json',
		},
	});
	return await (response.json() as Promise<T>);
}

export async function PostRequest<T>(url: URL, data?: any): Promise<T> {
	const response = await fetch(url.href, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	return await (response.json() as Promise<T>);
}
