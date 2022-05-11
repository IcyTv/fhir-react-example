import { As, Flex, FlexProps, Icon, Text } from "@chakra-ui/react";
import React from "react";

/**
 * Generic Data Component Properties
 */
interface DataComponentProps extends FlexProps {
	icon: As<any>;
	title: string;
	data: string;
}


/**
 * Generic Data Component
 */

const DataComponent: React.FC<DataComponentProps> = ({ icon, title, data, ...rest }) => {
	return <Flex m={2}  {...rest}>
		<Icon as={icon} w={6} h={6} mr={3} />
		<Text fontWeight="bold" mr={1}>{title + ":"}</Text>
		<Text>{data}</Text>
	</Flex>;
}

export default DataComponent;