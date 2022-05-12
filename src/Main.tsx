import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
// import schema from "../public/fhir.schema.json";
// import data from "../public/patient-example.json";

import patientValidator from "@d4l/js-fhir-validator/r4/js/Patient";
import { Avatar, Box, Divider, Flex, Heading, Icon, Skeleton, SkeletonCircle, Spacer, Text, toast, Tooltip, useToast } from '@chakra-ui/react';
import { InfoIcon } from "@chakra-ui/icons";
import { FaMapPin, FaVenusMars, FaCalendar, FaPhone, FaUser } from "react-icons/fa";
import DataComponent from './components/DataComponent';
import { FhirRequest } from './utils/fhir';
import PatientDropdown from './components/PatientDropdown';
import { GetRequest } from './utils/fhir/httpRequest';
import { Id, Patient } from './utils/fhir/resources';
import { Everything } from './utils/fhir/meta';
import Timeline from './components/Timeline';

const Main: React.FC = () => {
	const [patientId, setPatientId] = useState("1");
	const [data, setData] = useState<fhir4.Patient | null>(null);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	const [isValid, setIsValid] = useState<boolean>(true);
	const patientName = useMemo(() => {
		if (!data) return null;

		let officialName = data.name.find(name => name.use === "official");
		if (!officialName) officialName = data.name[0];

		return {
			full: `${officialName.given.join(" ")} ${officialName.family}`,
			family: officialName.family,
		};
	}, [data]);
	const toast = useToast();

	useEffect(() => {
		const fetchData = async () => {
			setIsLoaded(false);
			// Artificial delay to simulate loading
			const timeoutProm = new Promise<void>((resolve,) => {
				setTimeout(() => {
					resolve();
				}, 1000);
			});
			await timeoutProm;

			const request = new FhirRequest<fhir4.Patient>(GetRequest, [Patient, Id("1")]);
			const data = await request.do();
			setData(data);
		}

		fetchData();
	}, [patientId]);

	useEffect(() => {
		if (!data) return;

		const valid = patientValidator(data);
		setIsValid(valid);

		if (valid && !isLoaded && data.id === patientId) {
			toast({
				title: "Successfully Loaded Your Data!",
				description: "We could successfully load your data!",
				status: "success",
				duration: 1000,
				isClosable: true,
			});

			setIsLoaded(true);
		}
	}, [data, toast, isLoaded]);

	if (!isValid) {
		return <div>
			<p>Invalid patient data</p>
		</div>
	}

	return (
		<>
			<PatientDropdown currentPatientId={patientId} onChange={setPatientId} />
			<Box p={5} shadow="md" borderWidth="1px" m={10}>
				<Skeleton className="App" isLoaded={isLoaded} >
					<Flex justify="center" align="center" pos="relative" p={3}>
						<Avatar name={patientName?.family} size="xl" />
						<Spacer />
						<Heading>{patientName?.full}</Heading>
						<Spacer />
						<Box pos="absolute" top={1} right={1}>
							<Tooltip label={`Id: ${data?.id}`}>
								<InfoIcon />
							</Tooltip>
						</Box>
					</Flex>
					<Divider />
					<Box p={4}>
						<>
							<DataComponent icon={FaCalendar} title="Birthday" data={data?.birthDate} />
							<DataComponent icon={FaVenusMars} title="Gender" data={data?.gender} />
							{data?.address?.map((addr, i) => {
								const addressText = `${addr.line[0]}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`
								return <DataComponent icon={FaMapPin} title="Address" data={addressText} key={`addr-${i}`} />;
							})}
							{data?.telecom?.sort((a, b) => a.rank - b.rank)
								.map((phone, i) => {
									if (!phone.value) return null;
									return <DataComponent icon={FaPhone} title={`Phone Nr (${phone.use})`} data={phone.value} key={`phone-${i}`} />;
								})}
							{data?.contact?.map((contact, i) => {
								return <DataComponent icon={FaUser} title="Contact" data={`${contact.name.given?.join(" ")} ${contact.name.family}`} key={`contact-${i}`} />;
							})}
						</>
					</Box>
				</Skeleton>
			</Box>
			<Timeline patientId={patientId} />
		</>
	);
}

export default Main;
