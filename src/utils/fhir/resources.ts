import { RequestPart } from '.';

// export class PatientResource implements RequestPart {
// 	constructor() {}

// 	toUrlPart(): string {
// 		return 'Patient';
// 	}
// }

// export class Id {
// 	id: string;

// 	constructor(id: string) {
// 		this.id = id;
// 	}

// 	toUrlPart(): string {
// 		return this.id;
// 	}
// }

export const Patient: RequestPart = () => 'Patient';
export const Id: (id: string) => RequestPart = (id: string) => () => id;
export const Observation: RequestPart = () => 'Observation';
