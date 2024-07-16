import React, { useState } from "react"
import { SafeAreaView, ScrollView, TouchableOpacity, Text } from "react-native"
import FormField from "./components/FormField"

const ExampleForm = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	})

	const handleChangeText = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	const handleSubmit = () => {
		// Handle form submission
		console.log(formData)
	}

	return (
		<SafeAreaView>
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				<FormField
					title="Email"
					value={formData.email}
					placeholder="Enter your email"
					handleChangeText={(value) =>
						handleChangeText("email", value)
					}
					keyboardType="email-address"
				/>
				<FormField
					title="Password"
					value={formData.password}
					placeholder="Enter your password"
					handleChangeText={(value) =>
						handleChangeText("password", value)
					}
					secureTextEntry
				/>
				<TouchableOpacity onPress={handleSubmit}>
					<Text>Submit</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	)
}

export default ExampleForm
