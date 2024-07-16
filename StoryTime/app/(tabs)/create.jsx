import React from "react"
import { SafeAreaView, ScrollView, ImageBackground } from "react-native"
import background from "../../assets/backgrounds/storytimebackground.png"
import CreateStory from "../../components/CreateStory"

const Create = () => {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ImageBackground
				source={background}
				style={{ flex: 1 }}
				resizeMode="cover"
			>
				{/* <ScrollView
					contentContainerStyle={{ flexGrow: 1, padding: 20 }}
				> */}
				<CreateStory />
				{/* </ScrollView> */}
			</ImageBackground>
		</SafeAreaView>
	)
}

export default Create
