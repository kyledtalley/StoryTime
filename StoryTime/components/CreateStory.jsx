import React, { useState, useRef, useEffect } from "react"
import {
	View,
	Text,
	TextInput,
	ScrollView,
	StyleSheet,
	FlatList,
	Animated,
	TouchableOpacity,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import OpenAI from "openai"
import { useGlobalContext } from "../context/GlobalProvider"
import { useRouter } from "expo-router"
import { saveStory } from "../lib/appwrite"
import * as Speech from "expo-speech"

const readStory = (story, voice = "en-us-x-sfg#male_1-local") => {
	Speech.speak(story, {
		language: "en",
		pitch: 1.0,
		rate: 1.0,
		voice,
	})
}

const CreateStory = () => {
	const { user } = useGlobalContext()
	const [conversation, setConversation] = useState([])
	const [question, setQuestion] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [nameInput, setNameInput] = useState("")
	const [names, setNames] = useState([])
	const [selectedAgeGroup, setSelectedAgeGroup] = useState("")
	const [roles, setRoles] = useState({})
	const [notes, setNotes] = useState({})
	const chatboxRef = useRef(null)
	const fadeAnim = useRef(new Animated.Value(1)).current
	const router = useRouter()

	const openai = new OpenAI({
		apiKey: "sk-proj-NXghqxCxsZYvpTHlC8WkT3BlbkFJLqzXC83aLc5N3m7JWdFH",
	})

	const handleAddName = () => {
		if (nameInput.trim() !== "") {
			setNames((prevNames) => [...prevNames, nameInput.trim()])
			setNameInput("")
		}
	}

	const handleRemoveName = (nameToRemove) => {
		setNames((prevNames) =>
			prevNames.filter((name) => name !== nameToRemove)
		)
		setRoles((prevRoles) => {
			const newRoles = { ...prevRoles }
			delete newRoles[nameToRemove]
			return newRoles
		})
		setNotes((prevNotes) => {
			const newNotes = { ...prevNotes }
			delete newNotes[nameToRemove]
			return newNotes
		})
	}

	const handleRoleChange = (name, role) => {
		setRoles((prevRoles) => ({ ...prevRoles, [name]: role }))
	}

	const handleNotesChange = (name, note) => {
		setNotes((prevNotes) => ({ ...prevNotes, [name]: note }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (loading) return

		const timestamp = new Date().toLocaleTimeString()
		setConversation((prevConversation) => [
			...prevConversation,
			{ role: "user", content: question, timestamp },
		])
		setLoading(true)
		setError(null)

		const prompt = `Create a bedtime story for a ${selectedAgeGroup} year old child named ${names
			.map((name) => {
				const role = roles[name] ? ` who is a ${roles[name]}` : ""
				const note = notes[name] ? ` (${notes[name]})` : ""
				return `${name}${role}${note}`
			})
			.join(", ")}. ${question}`

		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 1000,
			useNativeDriver: true,
		}).start()

		const fadeInTimeout = setTimeout(() => {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}).start()
		}, 4000)

		try {
			const response = await openai.chat.completions.create({
				model: "gpt-4",
				messages: [
					{
						role: "user",
						content: prompt,
					},
				],
				max_tokens: 7777,
			})

			let botMessage = response.choices[0].message.content

			if (botMessage.length > 10000) {
				botMessage = botMessage.substring(0, 9996) + "..."
			}

			setConversation((prevConversation) => [
				...prevConversation,
				{
					role: "bot",
					content: botMessage,
					timestamp: new Date().toLocaleTimeString(),
				},
			])

			if (!user || !user.$id) {
				throw new Error("User is not logged in")
			}

			const storyData = {
				title: `Bedtime Story for ${selectedAgeGroup} year old`,
				prompt: prompt,
				content: botMessage,
			}
			const storyId = await saveStory(storyData)
			setLoading(false)
			clearTimeout(fadeInTimeout)
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}).start()

			router.push({
				pathname: "/screens/story-detail",
				params: { storyId },
			})
		} catch (err) {
			console.error("Error fetching AI story response", err)
			setError(
				"Failed to fetch response from StoryTime. Please try again."
			)
			setLoading(false)
		}

		setQuestion("")
	}

	useEffect(() => {
		if (chatboxRef.current) {
			chatboxRef.current.scrollToEnd({ animated: true })
		}
	}, [conversation, loading])

	return (
		<View style={styles.container}>
			<Animated.View
				style={{
					flex: 1,
					opacity: fadeAnim,
					width: "100%",
					height: "100%",
				}}
			>
				<Text style={styles.title}>Want to hear a bedtime story?</Text>

				<ScrollView style={styles.chatbox} ref={chatboxRef}>
					{loading && (
						<View style={styles.loadingContainer}>
							<Animated.Text
								style={[
									styles.loadingText,
									{
										opacity: fadeAnim.interpolate({
											inputRange: [0, 1],
											outputRange: [0, 1],
										}),
									},
								]}
							>
								Taking your imagination to new places...
							</Animated.Text>
						</View>
					)}

					{error && <Text style={styles.errorMessage}>{error}</Text>}
					<View style={styles.formContainer}>
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Type your message:</Text>
							<TextInput
								value={question}
								onChangeText={setQuestion}
								style={styles.input}
								placeholder="Type in your prompt..."
								placeholderTextColor="#999999"
								editable={!loading}
							/>
						</View>
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Enter a name:</Text>
							<TextInput
								value={nameInput}
								onChangeText={setNameInput}
								style={styles.input}
								placeholder="Enter a name..."
								placeholderTextColor="#999999"
							/>
							<TouchableOpacity
								style={styles.addButton}
								onPress={handleAddName}
							>
								<Text style={styles.addButtonText}>
									Add Character
								</Text>
							</TouchableOpacity>
						</View>
						<FlatList
							data={names}
							renderItem={({ item }) => (
								<View style={styles.nameItemContainer}>
									<Text style={styles.nameItem}>
										Character: {item}
									</Text>
									<TextInput
										style={styles.roleInput}
										placeholder="Role..."
										placeholderTextColor="#999999"
										value={roles[item] || ""}
										onChangeText={(text) =>
											handleRoleChange(item, text)
										}
									/>
									<TextInput
										style={styles.notesInput}
										placeholder="Additional notes..."
										value={notes[item] || ""}
										onChangeText={(text) =>
											handleNotesChange(item, text)
										}
										placeholderTextColor="#999999"
									/>
									<TouchableOpacity
										onPress={() => handleRemoveName(item)}
									>
										<Text style={styles.removeButton}>
											Remove
										</Text>
									</TouchableOpacity>
								</View>
							)}
							keyExtractor={(item, index) => index.toString()}
						/>
						<View style={styles.inputGroup}>
							<Text style={styles.label}>
								Select an age group:
							</Text>
							<Picker
								selectedValue={selectedAgeGroup}
								onValueChange={(itemValue) =>
									setSelectedAgeGroup(itemValue)
								}
								style={styles.picker}
								itemStyle={{ color: "#fff" }}
							>
								<Picker.Item
									label="Select an age group"
									value=""
								/>
								<Picker.Item label="0-2 years" value="0-2" />
								<Picker.Item label="3-5 years" value="3-5" />
								<Picker.Item label="6-8 years" value="6-8" />
								<Picker.Item label="9-10 years" value="9-10" />
							</Picker>
						</View>
						<View style={styles.buttonContainer}>
							<TouchableOpacity
								style={styles.submitButton}
								onPress={handleSubmit}
								disabled={loading}
							>
								<Text style={styles.submitButtonText}>
									{loading ? "Sending..." : "Send"}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</Animated.View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
		color: "#7b00ff", // add glow
		glowColor: "#7b00ff",
		shadowColor: "#7b00ff",
		shadowOffset: {
			width: 20,
			height: 20,
		},
	},
	chatbox: {
		flex: 1,
		marginBottom: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		fontSize: 36,
		color: "#7b00ff",
		textAlign: "center",
	},
	errorMessage: {
		color: "red",
		textAlign: "center",
		marginBottom: 10,
	},
	formContainer: {
		backgroundColor: "#0000006b",
		padding: 20,
		borderRadius: 20,
	},
	inputGroup: {
		marginBottom: 15,
	},
	label: {
		fontSize: 16,
		color: "#fff",
		marginBottom: 5,
	},
	input: {
		borderWidth: 1,
		borderColor: "#7b00ff",
		padding: 10,
		borderRadius: 5,
		color: "#fff",
		backgroundColor: "#00000072",
	},
	picker: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#7b00ff",
		padding: 5,
		borderRadius: 10,
		color: "#fff",
		backgroundColor: "#40005c62",
	},
	nameItemContainer: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 10,
		borderWidth: 1,
		borderColor: "#7b00ff",
		backgroundColor: "#40005c62",
		borderRadius: 10,
		marginBottom: 10,
	},
	nameItem: {
		fontSize: 16,
		color: "#fff",
		flex: 1,
		marginBottom: 5,
	},
	roleInput: {
		borderWidth: 1,
		borderColor: "#7b00ff",
		padding: 5,
		borderRadius: 5,
		color: "#fff",
		backgroundColor: "#00000072",
		flex: 1,
		marginBottom: 5,
		marginRight: 10,
	},
	notesInput: {
		borderWidth: 1,
		borderColor: "#7b00ff",
		padding: 5,
		borderRadius: 5,
		color: "#fff",
		backgroundColor: "#00000072",
		flex: 2,
		marginRight: 10,
	},
	removeButton: {
		color: "red",
	},
	buttonContainer: {
		flexDirection: "row",
		marginTop: 20,
	},
	submitButton: {
		backgroundColor: "#7b00ff",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
		marginHorizontal: 5,
	},
	submitButtonText: {
		color: "#fff",
		fontSize: 16,
	},
	addButton: {
		backgroundColor: "#7b00ff",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
		marginTop: 15,
	},
	addButtonText: {
		color: "#fff",
		fontSize: 16,
	},
})

export default CreateStory
