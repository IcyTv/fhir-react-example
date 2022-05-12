// Alles hier ist SEEHR basic
// Es muss sich wirklich mehr überlegt werden wie genau wir Request URLs aufbauen wollen
// Hier würde sich ein OO Design gut anbieten
// Oder wir machen hier halt auch Composition, also z.B. GetRequest + Patient + Id => /Patient/{id}
export enum ResourceType {
	Patient = 'Patient',
	Observation = 'Observation',
	Condition = 'Condition',
	Procedure = 'Procedure',
}

export class FhirRequest<T extends fhir4.Resource> {
	baseUrl: string;
	authToken: string;
	resourceType: ResourceType;
	id?: string;
	query: { [key: string]: any } = {};
	validateFunc: (response: any) => boolean;

	constructor(
		resourceType: ResourceType,
		id?: string,
		query?: { [key: string]: string },
		validateFunc: (response: any) => boolean = () => true
	) {
		this.baseUrl = process.env.REACT_APP_HAPI_BASE_URL;
		this.authToken = process.env.REACT_APP_HAPI_AUTH_TOKEN;
		this.resourceType = resourceType;
		this.id = id;
		this.query = query || {};
		this.validateFunc = validateFunc;
	}

	async get(): Promise<T> {
		const url = this.buildUrl();

		const response = await fetch(url, {
			headers: {
				...(this.authToken
					? { Authorization: `Bearer ${this.authToken}` }
					: {}),
				Accept: 'application/json',
			},
		});
		const data = await response.json();

		if (!this.validateFunc(data)) {
			throw new Error('Invalid response');
		}

		return data as T;
	}

	buildUrl(): string {
		const url = new URL(window.location.protocol + window.location.host);
		url.pathname = `/${this.baseUrl}/${this.resourceType}`;
		if (this.id) {
			url.pathname += `/${this.id}`;
		}
		Object.keys(this.query).forEach((key) => {
			url.searchParams.append(key, this.query[key].toString());
		});

		console.log(url);

		return url.toString();
	}

	static getPatient(id: string | number): FhirRequest<fhir4.Patient> {
		return new FhirRequest(ResourceType.Patient, id.toString());
	}

	static getPatients(query: { [key: string]: any }): FhirRequest<fhir4.Bundle> {
		return new FhirRequest(ResourceType.Patient, undefined, query);
	}
}
