import { QueryPart, RequestPart } from '.';

// export class SortBy implements QueryPart {
// 	sortBy: string;

// 	constructor(sortBy: string) {
// 		this.sortBy = sortBy;
// 	}

// 	toQuery(): { [key: string]: any } {
// 		return {
// 			_sort: this.sortBy,
// 		};
// 	}
// }

export const SortBy: (sort: string, order: 'asc' | 'desc') => QueryPart =
	(sortBy: string, order: 'asc' | 'desc' = 'asc') =>
	() => ({
		_sort: `${order == 'asc' ? '' : '-'}${sortBy}`,
	});
export const Count: (count: number) => QueryPart = (count: number) => () => ({
	_count: count,
});

export const PatientSearch: (patient: string) => QueryPart =
	(patient: string) => () => ({
		patient: patient,
	});

export const Everything: RequestPart = () => '$everything';
