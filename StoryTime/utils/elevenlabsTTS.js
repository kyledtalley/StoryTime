import axios from "axios"
import * as FileSystem from "expo-file-system"
import { Audio } from "expo-av"

const ELEVEN_LABS_API_KEY =
	"sk_d9d2a49f12d472b0bf96da24873eff6d68da5955a9101c45"
const API_BASE_URL = "https://api.elevenlabs.io/v1"

const fetchElevenLabsTTS = async (text, voiceId) => {
	const options = {
		method: "POST",
		headers: {
			"xi-api-key": ELEVEN_LABS_API_KEY,
			"Content-Type": "application/json",
			Accept: "audio/mpeg",
		},
		data: JSON.stringify({
			text: text,
			model_id: "eleven_turbo_v2",
			voice_settings: {
				stability: 1,
				similarity_boost: 1,
				style: 1,
				use_speaker_boost: true,
			},
		}),
	}

	try {
		const response = await axios.post(
			`${API_BASE_URL}/text-to-speech/${voiceId}?enable_logging=true&optimize_streaming_latency=1&output_format=mp3_44100_192`,
			options.data,
			{
				headers: options.headers,
				responseType: "arraybuffer",
			}
		)

		const audioPath = FileSystem.documentDirectory + "speech.mp3"
		const uint8Array = new Uint8Array(response.data)
		const base64String = uint8Array.reduce(
			(data, byte) => data + String.fromCharCode(byte),
			""
		)
		const base64Audio = btoa(base64String)

		await FileSystem.writeAsStringAsync(audioPath, base64Audio, {
			encoding: FileSystem.EncodingType.Base64,
		})

		return audioPath
	} catch (error) {
		console.error("Error fetching TTS from Eleven Labs:", error)
		throw error
	}
}

const playAudio = async (audioPath) => {
	const { sound } = await Audio.Sound.createAsync(
		{ uri: audioPath },
		{ shouldPlay: true }
	)
	await sound.playAsync()
}

export const readStory = async (story, voiceId) => {
	try {
		const audioPath = await fetchElevenLabsTTS(story, voiceId)
		await playAudio(audioPath)
	} catch (error) {
		console.error("Error reading story:", error)
	}
}

export const stopReading = async () => {
	const { sound } = await Audio.Sound.createAsync({})
	await sound.stopAsync()
}

export default readStory
