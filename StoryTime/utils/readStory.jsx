import * as Speech from "expo-speech"

const readStory = (
	story,
	voiceIdentifier = "com.apple.eloquence.en-GB.Reed"
) => {
	// Fetch available voices
	Speech.getAvailableVoicesAsync()
		.then((voices) => {
			console.log("Available voices:", voices)

			// Select the specified voice or default to the first available voice
			const selectedVoice =
				voices.find((voice) => voice.identifier === voiceIdentifier) ||
				voices[0]

			// If no voices are available, log an error and return
			if (!selectedVoice) {
				console.error("No voices available")
				return
			}

			// Speak the story with the selected voice
			Speech.speak(story, {
				language: "en",
				pitch: 1.2,
				rate: 0.9,
				voice: selectedVoice.identifier,
			})
		})
		.catch((error) => {
			console.error("Error fetching available voices:", error)
		})
}

export const stopReading = () => {
	Speech.stop()
}

export default readStory
