import React, { useEffect, useRef, useState } from "react"
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Animated,
	Alert,
	Button,
	ImageBackground,
	TouchableOpacity,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRoute, useNavigation } from "@react-navigation/native"
import { getStoryById, bookmarkStory, getCurrentUser } from "../../lib/appwrite"
import { useGlobalContext } from "../../context/GlobalProvider"
import background from "../../assets/backgrounds/tempStoryBackground1.jpg"
import readStory, { stopReading } from "../../utils/elevenlabsTTS"

const voices = {
	Okole: "yxzqv7jXBIZY16OevUlW",
	Andrea: "Crm8VULvkVs5ZBDa1Ixm",
	Eden: "YCWtGUjb6aTzXFqTcOem",
	Ahutosh: "zeTFANH8Ybln8sjiUtmJ",
	Emma: "L9yKVmHHU9sfkCzlxBZS",
}

const StoryDetail = () => {
	const route = useRoute()
	const navigation = useNavigation()
	const { storyId } = route.params || {}
	const fadeAnim = useRef(new Animated.Value(1)).current
	const [loading, setLoading] = useState(true)
	const [story, setStory] = useState(null)
	const { user, setNarration } = useGlobalContext()
	const [isBookmarked, setIsBookmarked] = useState(false)
	const [selectedVoice, setSelectedVoice] = useState(Object.keys(voices)[0])

	useEffect(() => {
		const fetchStory = async () => {
			try {
				const fetchedStory = await getStoryById(storyId)
				setStory(fetchedStory)
			} catch (error) {
				Alert.alert("Error", "Failed to fetch story")
				navigation.goBack()
			} finally {
				setLoading(false)
			}
		}

		if (storyId) {
			fetchStory()
		} else {
			Alert.alert("Error", "No story ID provided")
			navigation.goBack()
		}
	}, [storyId, navigation])

	useEffect(() => {
		if (loading) {
			Animated.loop(
				Animated.sequence([
					Animated.timing(fadeAnim, {
						toValue: 0,
						duration: 500,
						useNativeDriver: true,
					}),
					Animated.timing(fadeAnim, {
						toValue: 1,
						duration: 500,
						useNativeDriver: true,
					}),
				])
			).start()
		}
	}, [fadeAnim, loading])

	const handleBookmark = async () => {
		try {
			const currentUser = await getCurrentUser()
			if (!currentUser) {
				throw new Error("User not found")
			}

			await bookmarkStory(currentUser.$id, storyId)
			setIsBookmarked(true)
			Alert.alert("Success", "Story bookmarked successfully!")
		} catch (error) {
			console.error("Error bookmarking story:", error)
			Alert.alert(
				"Error",
				"Failed to bookmark the story. Please try again."
			)
		}
	}

	const handleNarrate = () => {
		if (story && story.content) {
			setNarration({ story: story.content, title: story.title })
			readStory(story.content, voices[selectedVoice])
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground source={background}>
				{loading ? (
					<View style={styles.loadingContainer}>
						<Text style={styles.loadingText}>
							Taking your imagination to new places...
						</Text>
					</View>
				) : (
					<ScrollView>
						<Text style={styles.title}>{story?.title}</Text>
						<Text style={styles.content}>{story?.content}</Text>
						<Button
							title={
								isBookmarked ? "Bookmarked" : "Bookmark Story"
							}
							onPress={handleBookmark}
							disabled={isBookmarked}
							color="#f8d803"
						/>
						<View style={styles.voicePickerContainer}>
							<Text style={styles.voicePickerLabel}>
								Select Voice:
							</Text>
							<Picker
								selectedValue={selectedVoice}
								onValueChange={(itemValue) =>
									setSelectedVoice(itemValue)
								}
								style={styles.picker}
							>
								{Object.keys(voices).map((voice) => (
									<Picker.Item
										key={voice}
										label={voice}
										value={voice}
									/>
								))}
							</Picker>
						</View>
						<TouchableOpacity
							style={styles.narrateButton}
							onPress={handleNarrate}
						>
							<Text style={styles.narrateButtonText}>
								Narrate Story
							</Text>
						</TouchableOpacity>
					</ScrollView>
				)}
			</ImageBackground>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: "600",
		padding: 20,
		color: "#fffab1c1",
	},
	content: {
		fontSize: 16,
		padding: 20,
		color: "#ffffff",
	},
	noStoryContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	noStoryText: {
		fontSize: 18,
		fontFamily: "serif",
		color: "#000",
	},
	loadingText: {
		fontSize: 24,
		color: "#ffffff",
		textAlign: "center",
	},
	narrateButton: {
		backgroundColor: "#7b00ff",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
		marginTop: 15,
	},
	narrateButtonText: {
		color: "#fff",
		fontSize: 16,
	},
	voicePickerContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 10,
	},
	voicePickerLabel: {
		color: "#ffffff",
		fontSize: 16,
		marginRight: 10,
	},
	picker: {
		flex: 1,
		backgroundColor: "#fff",
		borderRadius: 5,
	},
})

export default StoryDetail
