import { Text, TouchableOpacity } from "react-native"

const CustomButton = ({ title, handlePress, isLoading }) => {
	return (
		<TouchableOpacity
			onPress={handlePress}
			className={`bg-purple-400 opacity-50 rounded-xl min-h-[62px] min-w-[200px] flex justify-center items-center ${
				isLoading ? "opacity-50" : ""
			}`}
			disabled={isLoading}
		>
			<Text>{title}</Text>
		</TouchableOpacity>
	)
}

export default CustomButton
