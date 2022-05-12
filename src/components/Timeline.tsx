import { Badge, Box, Flex, Heading, Spinner, Tag, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FhirRequest } from '../utils/fhir';
import { GetRequest } from '../utils/fhir/httpRequest';
import { Count, Everything, PatientSearch, SortBy } from '../utils/fhir/meta';
import { Id, Observation, Patient } from '../utils/fhir/resources';
import GenericTimeline from './GenericTimeline';
import "./Timeline.css";

interface TimelineProps {
	patientId: string;
}

const Timeline: React.FC<TimelineProps> = ({ patientId }) => {
	const request = useMemo(() => new FhirRequest<fhir4.Bundle>(GetRequest, [Observation], [SortBy("date", "desc"), PatientSearch(patientId)]), [patientId]);

	const renderResource = useCallback((observation: fhir4.Observation) => {
		const date = Date.parse(observation.effectiveDateTime);
		const dateString = new Date(date).toLocaleDateString();
		const timeString = new Date(date).toLocaleTimeString();
		return <li className="rb-item" ng-repeat="itembx" key={observation.id}>
			<div className="timestamp">{dateString}<br />{timeString}</div>
			<div className="item-title">{observation.code.text}</div>

			<div className="item-value">{observation.valueQuantity?.value} {observation.valueQuantity?.unit}</div>

			<Badge position="absolute" right="1" top="1" colorScheme="blue">Observation</Badge>
		</li>;
	}, []);

	return <div className="rb-container"> <ul className="rb"><GenericTimeline renderResource={renderResource} request={request} /></ul></div >;

	// const [isLoaded, setIsLoaded] = useState<boolean>(false);
	// const [data, setData] = useState<fhir4.Observation[] | null>(null);
	// const [nextUrl, setNextUrl] = useState<string | null>(null);

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		setIsLoaded(false);
	// 		const request = new FhirRequest<fhir4.Bundle>(GetRequest, [Observation], [SortBy("date", "desc"), PatientSearch(patientId), Count(100)]);
	// 		const response = await request.do();

	// 		const observations = response.entry.map(entry => entry.resource as fhir4.Observation);
	// 		setData(observations);
	// 		setIsLoaded(true);
	// 		setNextUrl(response.link.find(link => link.relation === "next")?.url);
	// 	}

	// 	fetchData();
	// }, []);

	// if (!data || !isLoaded) {
	// 	return <Spinner />;
	// }

	// // return <Flex direction="column">
	// // 	{data.map(observation => {
	// // 		const date = Date.parse(observation.effectiveDateTime);
	// // 		const dateString = new Date(date).toLocaleDateString();
	// // 		const timeString = new Date(date).toLocaleTimeString();

	// // 		return <Flex key={observation.id} m={3} shadow="base" align="center">
	// // 			<Box className="circle" mx={5} />
	// // 			<Box>
	// // 				<Heading as="h3" size="sm">{observation.code.text}</Heading>
	// // 				<Text>{observation.valueQuantity?.value} {observation.valueQuantity?.unit}</Text>

	// // 				<Text color="gray.500">{dateString}  -  {timeString}</Text>
	// // 			</Box>
	// // 		</Flex>;
	// // 	}
	// // 	)}
	// // </Flex>;

	// // https://codepen.io/blackellis/pen/bGVoXBr
	// return <div className="rb-container">
	// 	<ul className="rb">
	// 		{data.map(observation => {
	// 			const date = Date.parse(observation.effectiveDateTime);
	// 			const dateString = new Date(date).toLocaleDateString();
	// 			const timeString = new Date(date).toLocaleTimeString();
	// 			return <li className="rb-item" ng-repeat="itembx" key={observation.id}>
	// 				<div className="timestamp">{dateString}<br />{timeString}</div>
	// 				<div className="item-title">{observation.code.text}</div>

	// 				<div className="item-value">{observation.valueQuantity?.value} {observation.valueQuantity?.unit}</div>

	// 				<Badge position="absolute" right="1" top="1" colorScheme="blue">Observation</Badge>
	// 			</li>;
	// 		})}
	// 	</ul>
	// </div>
}

export default Timeline;