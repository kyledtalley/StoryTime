import axios from "axios"

const generateStory = async (prompt, options = {}) => {
	const {
		maxTokens = 7777,
		minTokens = 400,
		temperature = 0.8,
		frequencyPenalty = 0.0,
		presencePenalty = 0.0,
	} = options

	try {
		const response = await axios.post(
			"https://api.openai.com/v1/completions",
			{
				prompt,
				max_tokens: maxTokens,
				temperature,
				frequency_penalty: frequencyPenalty,
				presence_penalty: presencePenalty,
			}
		)

		return response.data.choices[0].text.trim() // Ensure the text is trimmed
	} catch (error) {
		console.error(
			"Failed to fetch response from StoryTime. Please try again.",
			error
		)
		throw new Error(
			`Failed to fetch response from StoryTime. Error: ${error.message}`
		)
	}
}

export default generateStory
