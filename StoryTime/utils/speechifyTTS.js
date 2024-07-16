import axios from "axios"
import { Audio } from "expo-av"

const SPEECHIFY_API_KEY = "Md5OfVY3VxPkj8wcnVjSLNsZ7AH1QI6HukZolmGXhG8="
const API_BASE_URL = "https://api.sws.speechify.com/v1"
const VOICE_ID = "kim"

const fetchSpeechifyTTS = async (text) => {
	try {
		const response = await axios.post(
			`${API_BASE_URL}/audio/speech`,
			{
				input: `<speak>${text}</speak>`,
				voice_id: VOICE_ID,
				audio_format: "mp3",
			},
			{
				headers: {
					Authorization: `Bearer ${SPEECHIFY_API_KEY}`,
					"Content-Type": "application/json",
				},
			}
		)

		const audioUrl = response.data.audio_url
		return audioUrl
	} catch (error) {
		console.error("Error fetching TTS from Speechify:", error)
		throw error
	}
}

const playAudio = async (audioUrl) => {
	const { sound } = await Audio.Sound.createAsync(
		{ uri: audioUrl },
		{ shouldPlay: true }
	)
	await sound.playAsync()
}

export const readStory = async (story) => {
	try {
		const audioUrl = await fetchSpeechifyTTS(story)
		await playAudio(audioUrl)
	} catch (error) {
		console.error("Error reading story:", error)
	}
}

export const stopReading = () => {
	Audio.Sound.stopAsync()
}

export default readStory
