import React, { useState } from "react"
import { View, Text, Button, StyleSheet } from "react-native"
import generateStory from "../lib/generateStory"
import readStory from "../utils/readStory"

const StoryTeller = () => {
	const [story, setStory] = useState("")
	const [loading, setLoading] = useState(false)

	const handleGenerateStory = async () => {
		setLoading(true)
		try {
			const prompt =
				"Create a bedtime story for a 3-5 year old child about a magical adventure."
			const generatedStory = await generateStory(prompt)
			setStory(generatedStory)
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	const handleReadStory = () => {
		if (story) {
			readStory(story)
		} else {
			alert("Please generate a story first!")
		}
	}

	return (
		<View style={styles.container}>
			<Button
				title="Generate Story"
				onPress={handleGenerateStory}
				disabled={loading}
			/>
			{story && <Text style={styles.storyText}>{story}</Text>}
			<Button
				title="Read Story"
				onPress={handleReadStory}
				disabled={!story}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	storyText: {
		marginVertical: 20,
		fontSize: 18,
		textAlign: "center",
	},
})

export default StoryTeller
