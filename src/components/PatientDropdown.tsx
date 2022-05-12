import { Select, Skeleton, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FhirRequest } from "../utils/fhir";

const fetchPatients = async (): Promise<fhir4.Patient[]> => {
	const request = FhirRequest.getPatients({
		"_count": 100,
	});
	const response = await request.get();
	console.log(response);
	const patients = response.entry.map(entry => entry.resource as fhir4.Patient);
	console.log(patients);
	return patients;
}

interface PatientDropdownProps {
	currentPatientId: string;
	onChange: (patientId: string) => void;
}

const PatientDropdown: React.FC<PatientDropdownProps> = ({ onChange, currentPatientId }) => {
	const [isPending, setIsPending] = useState(true);
	const [patients, setPatients] = useState([] as fhir4.Patient[]);
	const [error, setError] = useState(null as Error | null);

	useEffect(() => {
		const fetchData = async () => {
			setIsPending(true);
			try {
				const patients = await fetchPatients();
				setPatients(patients);
			} catch (error) {
				setError(error);
			} finally {
				setIsPending(false);
			}
		}

		fetchData();
	}, []);

	if (isPending) {
		return <Skeleton h={10} />;
	}

	if (error) {
		return <Text color="red">{error.message}</Text>
	}

	return <Select onChange={(ev) => {
		onChange(ev.target.value);
	}} value={currentPatientId}>
		{patients.map((patient) => {
			const name = `${patient.name[0].family}, ${patient.name[0].given.join(" ")}`;
			return <option key={patient.id} value={patient.id} >{name}</option>
		})}
	</Select>;
}

export default PatientDropdown;