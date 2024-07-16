import { Link, router } from "expo-router"
import background from "../../assets/backgrounds/storytimebackground.png"
import logo from "../../assets/images/KyDaTaLogoGold.png"
import { signIn, getCurrentUser } from "../../lib/appwrite"
import { SafeAreaView } from "react-native-safe-area-context"
import React, { useState } from "react"
import FormField from "../../components/FormField"
import { useGlobalContext } from "../../context/GlobalProvider"
import {
	View,
	Text,
	Image,
	ScrollView,
	ImageBackground,
	StyleSheet,
	Alert,
} from "react-native"
import CustomButton from "../../components/CustomButton"
import "../../styles/auth/sign-in.css"

const Login = () => {
	const { setUser, setIsLogged } = useGlobalContext()
	const [form, setForm] = useState({
		email: "",
		password: "",
	})
	const [isSubmitting, setIsSubmitting] = useState(false)

	const submit = async () => {
		if (form.email === "" || form.password === "") {
			Alert.alert("Error", "Please fill in all fields")
			return
		}

		setIsSubmitting(true)

		try {
			await signIn(form.email, form.password)
			const result = await getCurrentUser()
			if (result) {
				setUser(result)
				setIsLogged(true)
				Alert.alert("Success", "User signed in successfully")
				router.replace("/home")
			} else {
				Alert.alert("Error", "Failed to fetch user after sign-in")
			}
		} catch (error) {
			Alert.alert("Error", error.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<SafeAreaView className="bg-primary h-full">
			<ImageBackground
				source={background}
				resizeMode="cover"
				style={StyleSheet.absoluteFillObject}
			>
				<ScrollView>
					<View
						className="w-full flex justify-center items-center h-full px-4"
						style={{ minHeight: "100%" }}
					>
						<View style={{ position: "absolute" }}>
							<Image
								source={logo}
								style={{ width: 200, height: 200 }}
								resizeMode="contain"
							/>
							<Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
								Log in to Kydata
							</Text>
							<FormField
								title="Email"
								value={form.email}
								handleChangeText={(e) =>
									setForm({ ...form, email: e })
								}
								otherStyles="mt-7"
								keyboardType="email-address"
							/>
							<FormField
								title="Password"
								value={form.password}
								handleChangeText={(e) =>
									setForm({ ...form, password: e })
								}
								otherStyles="mt-7"
							/>
							<CustomButton
								title="Log in"
								handlePress={submit}
								containerStyles="mt-7"
								isLoading={isSubmitting}
							/>
							<View className="justify-center pt-5 flex-row gap-2">
								<Text className="text-white">
									Don't have an account?{" "}
								</Text>
								<Link
									href="/sign-up"
									className="font-psemibold text-secondary"
								>
									Sign Up
								</Link>
							</View>
						</View>
					</View>
				</ScrollView>
			</ImageBackground>
		</SafeAreaView>
	)
}

export default Login
