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
// 	Button,
// } from "react-native"
// import { useRoute } from "@react-navigation/native"
// import { router } from "expo-router"
// import background from "../../assets/backgrounds/tempStoryBackground1.jpg"
// import { saveStory } from "../../lib/appwrite" // Import the saveStory function
// import { useGlobalContext } from "../../context/GlobalProvider" // Import the global context

// const GuestStory = () => {
// 	const route = useRoute()
// 	const { story } = route.params || {}
// 	const fadeAnim = useRef(new Animated.Value(1)).current
// 	const [loading, setLoading] = useState(false)
// 	const { user } = useGlobalContext() // Get the user from the global context

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

// 	useEffect(() => {
// 		if (story) {
// 			setLoading(false)
// 		}
// 	}, [story])

// 	const handleCreateNavigation = () => {
// 		router.push("/create")
// 	}

// 	const handleSaveAndPublish = async () => {
// 		if (!user || !user.$id) {
// 			Alert.alert("Error", "User is not logged in.")
// 			return
// 		}

// 		try {
// 			await saveStory({
// 				title: "Story Title", // Replace with actual title
// 				content: story,
// 				creatorId: user.$id,
// 			})
// 			Alert.alert(
// 				"Story Saved",
// 				"Your story has been saved and published!"
// 			)
// 		} catch (error) {
// 			Alert.alert("Error", "There was an error saving your story.")
// 		}
// 	}

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
// 						<Text style={styles.storyText}>{story}</Text>
// 						<Button
// 							title="Save and Publish"
// 							onPress={handleSaveAndPublish}
// 						/>
// 					</ScrollView>
// 				) : (
// 					<View style={styles.noStoryContainer}>
// 						<Text style={styles.noStoryText}>
// 							Do you want to hear a bedtime story?
// 						</Text>
// 						<TouchableOpacity onPress={handleCreateNavigation}>
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
// 		color: "#3e2723",
// 		marginBottom: 10,
// 	},
// 	linkText: {
// 		fontSize: 18,
// 		fontFamily: "serif",
// 		color: "#1e88e5",
// 		textDecorationLine: "underline",
// 	},
// 	loadingText: {
// 		fontSize: 24,
// 		color: "#fff",
// 		textAlign: "center",
// 		marginBottom: 20,
// 	},
// })

// export default GuestStory
