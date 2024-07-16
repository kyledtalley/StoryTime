// import React, { useEffect, useRef, useState } from "react"
// import {
// 	View,
// 	Text,
// 	StyleSheet,
// 	ImageBackground,
// 	TouchableOpacity,
// 	ScrollView,
// 	Animated,
// 	Alert,
// } from "react-native"
// import { useRoute, useNavigation } from "@react-navigation/native"
// import { getStoryById } from "../../lib/appwrite"
// import background from "../../assets/backgrounds/tempStoryBackground1.jpg"
// import { useGlobalContext } from "../../context/GlobalProvider"

// const Story = () => {
// 	const route = useRoute()
// 	const navigation = useNavigation()
// 	const { storyId } = route.params || {}
// 	const fadeAnim = useRef(new Animated.Value(1)).current
// 	const [loading, setLoading] = useState(true)
// 	const [story, setStory] = useState(null)
// 	const { user } = useGlobalContext()

// 	useEffect(() => {
// 		const fetchStory = async () => {
// 			try {
// 				const fetchedStory = await getStoryById(storyId)
// 				setStory(fetchedStory)
// 			} catch (error) {
// 				Alert.alert("Error", "Failed to fetch story")
// 				navigation.goBack()
// 			} finally {
// 				setLoading(false)
// 			}
// 		}

// 		fetchStory()
// 	}, [storyId])

// 	useEffect(() => {
// 		if (loading) {
// 			Animated.loop(
// 				Animated.sequence([
// 					Animated.timing(fadeAnim, {
// 						toValue: 0,
// 						duration: 500,
// 						useNativeDriver: true,
// 					}),
// 					Animated.timing(fadeAnim, {
// 						toValue: 1,
// 						duration: 500,
// 						useNativeDriver: true,
// 					}),
// 				])
// 			).start()
// 		}
// 	}, [fadeAnim, loading])

// 	return (
// 		<View style={styles.container}>
// 			<ImageBackground source={background} style={styles.background}>
// 				{loading ? (
// 					<View style={styles.noStoryContainer}>
// 						<Animated.Text
// 							style={[styles.loadingText, { opacity: fadeAnim }]}
// 						>
// 							Taking your imagination to new places...
// 						</Animated.Text>
// 					</View>
// 				) : story ? (
// 					<ScrollView>
// 						<Text style={styles.storyText}>{story.content}</Text>
// 					</ScrollView>
// 				) : (
// 					<View style={styles.noStoryContainer}>
// 						<Text style={styles.noStoryText}>
// 							Do you want to hear a bedtime story?
// 						</Text>
// 						<TouchableOpacity
// 							onPress={() => navigation.navigate("Create")}
// 						>
// 							<Text style={styles.linkText}>Create a Story</Text>
// 						</TouchableOpacity>
// 					</View>
// 				)}
// 			</ImageBackground>
// 		</View>
// 	)
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 	},
// 	background: {
// 		flex: 1,
// 		resizeMode: "cover",
// 		padding: 20,
// 	},
// 	storyText: {
// 		marginTop: 20,
// 		opacity: 1,
// 		fontSize: 18,
// 		fontFamily: "serif",
// 		color: "#fff",
// 		backgroundColor: "rgba(0, 0, 0, 0.5)", // Add a semi-transparent background
// 		padding: 10,
// 		borderRadius: 10,
// 	},
// 	noStoryContainer: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 	},
// 	noStoryText: {
// 		fontSize: 18,
// 		fontFamily: "serif",
// 		color: "#000",
// 		marginBottom: 10,
// 	},
// 	linkText: {
// 		fontSize: 18,
// 		fontFamily: "serif",
// 		color: "#e74c3c",
// 		textDecorationLine: "underline",
// 	},
// 	loadingText: {
// 		fontSize: 24,
// 		color: "#fff",
// 		textAlign: "center",
// 		marginBottom: 20,
// 	},
// })

// export default Story
