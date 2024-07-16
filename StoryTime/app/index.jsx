import { router } from "expo-router"
import {
	View,
	Text,
	Image,
	ScrollView,
	ImageBackground,
	StyleSheet,
	Animated,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRef } from "react"
import logo from "../assets/images/KyDaTaLogoGold.png"
import background from "../assets/backgrounds/paperIndex.jpg"
import { CustomButton } from "../components"

const Index = () => {
	const fadeAnim = useRef(new Animated.Value(1)).current

	return (
		<Animated.View style={{ flex: 1, opacity: fadeAnim }}>
			<SafeAreaView style={{ flex: 1 }}>
				<ImageBackground
					source={background}
					resizeMode="cover"
					style={StyleSheet.absoluteFillObject}
				>
					<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
						<View style={{ flex: 1 }}>
							<View
								style={{
									position: "absolute",
									top: 70,
									left: 0,
								}}
							>
								<Image
									source={logo}
									style={{ width: 75, height: 75 }}
								/>
							</View>
							<View
								style={{
									flex: 1,
									justifyContent: "center",
									alignItems: "center",
									paddingHorizontal: 20,
								}}
							>
								<View
									style={{
										position: "absolute",
										top: "35%",
										shadowColor: "#39effc",
										shadowOffset: {
											width: 0,
											height: 0,
										},
										shadowOpacity: 0.8,
										shadowRadius: 20,
										elevation: 10,
									}}
								></View>
								<View
									style={{
										position: "absolute",
										top: "40%",
										transform: [{ translateY: -50 }],

										padding: 10,
										borderRadius: 10,
										marginBottom: 20,
									}}
								>
									<Text className="text-5xl text-white font-bold text-center">
										StoryTime{"\n"}
										<Text className="text-lg text-amber-200">
											with Kydata
										</Text>
									</Text>
								</View>
								<View
									style={{
										position: "absolute",
										top: "65%",
										width: 300,
										alignItems: "center",
									}}
								>
									<View
										style={{
											padding: 10,
											borderRadius: 10,
											marginBottom: 20,
										}}
									>
										<Text className="text-base font-pregular text-white text-center">
											Unleash Your Imagination: {"\n"}Dive
											into a World of Stories and
											Adventures with StoryTime
										</Text>
									</View>
								</View>
							</View>
						</View>
					</ScrollView>
				</ImageBackground>
				<CustomButton
					title="Sign In"
					handlePress={() => router.push("/sign-in")}
					containerStyles={{ marginTop: 20 }}
					textStyles={{ color: "white" }}
					isLoading={false}
				/>
			</SafeAreaView>
		</Animated.View>
	)
}

export default Index
