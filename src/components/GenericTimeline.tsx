import React, { useCallback, useEffect, useState } from 'react';
import { FhirRequest } from '../utils/fhir';
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from '@chakra-ui/react';

interface GenericTimelineProps<T extends fhir4.Resource> {
	request: FhirRequest<fhir4.Bundle>,
	renderResource: (resource: T) => React.ReactElement
}

export default function GenericTimeline<T extends fhir4.Resource>({ request, renderResource }: GenericTimelineProps<T>): React.ReactElement {
	const [nextUrl, setNextUrl] = useState<string | null>("");
	const [data, setData] = useState<T[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await request.do();

			const resources = response.entry.map(entry => entry.resource as T);
			setData(resources);
			setNextUrl(response.link.find(link => link.relation === "next")?.url);
		}

		fetchData();
	}, []);

	const fetchData = useCallback(
		async () => {
			if (!nextUrl) {
				return;
			}

			const sanizitedUrl = new URL(nextUrl);
			if (process.env.NODE_ENV === 'development') {
				sanizitedUrl.port = "3000"; // TODO: remove this hack
			}
			const response = await fetch(sanizitedUrl.toString()); //TODO integrate with FhirRequest
			const resources = await response.json() as fhir4.Bundle;
			setData(data.concat(resources.entry.map(entry => entry.resource as T)));
			setNextUrl(resources.link.find(link => link.relation === "next")?.url);

		},
		[nextUrl],
	)


	return <InfiniteScroll
		dataLength={data.length}
		next={fetchData}
		hasMore={nextUrl !== null && nextUrl !== undefined}
		loader={<Spinner />}
		endMessage={
			<p style={{ textAlign: "center", color: "white" }}>
				<b>Yay! You have seen it all</b>
			</p>
		}
	>
		{data.map(renderResource)}
	</InfiniteScroll>
}
