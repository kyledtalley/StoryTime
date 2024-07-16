import React, { useState, useEffect } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import {
	View,
	Image,
	FlatList,
	TouchableOpacity,
	RefreshControl,
	ImageBackground,
	StyleSheet,
} from "react-native"
import { icons } from "../../constants"
import { signOut, getUserStories, getCurrentUser } from "../../lib/appwrite"
import { useGlobalContext } from "../../context/GlobalProvider"
import { EmptyState, InfoBox, StoryCard } from "../../components"
import logo from "../../assets/images/KyDaTaLogoGold.png"
import background from "../../assets/backgrounds/profilebackgroundTemp.jpg"

const Profile = () => {
	const { user, setUser, setIsLogged } = useGlobalContext()
	const [stories, setStories] = useState([])
	const [error, setError] = useState(null)
	const [refreshing, setRefreshing] = useState(false)

	const fetchUserStories = async () => {
		try {
			const currentUser = await getCurrentUser()
			// console.log(`Fetched currentUser: ${JSON.stringify(currentUser)}`)
			if (!currentUser) {
				throw new Error("User not found")
			}
			const userStories = await getUserStories(currentUser.$id)
			// console.log(`Fetched user stories: ${JSON.stringify(userStories)}`)
			setStories(userStories)
		} catch (error) {
			setError(error)
			console.error("Error fetching user stories:", error)
		}
	}

	useEffect(() => {
		fetchUserStories()
	}, [])

	const onRefresh = async () => {
		setRefreshing(true)
		await fetchUserStories()
		setRefreshing(false)
	}

	const logout = async () => {
		try {
			await signOut()
			setUser(null)
			setIsLogged(false)
		} catch (error) {
			console.error("Error signing out:", error)
		}
	}

	if (error) {
		console.error("Error fetching user stories:", error)
	}

	return (
		<ImageBackground source={background} style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<FlatList
					data={stories || []}
					keyExtractor={(item) => item.$id.toString()}
					renderItem={({ item }) => (
						<StoryCard
							title={item.prompt}
							content={item.content}
							userId={user?.username || "Unknown"}
							avatar={user?.avi || null}
							storyId={item.$id} // Ensure storyId is passed
						/>
					)}
					ListEmptyComponent={() => (
						<EmptyState
							title="No Stories Found"
							subtitle="No stories found for this profile"
						/>
					)}
					ListHeaderComponent={() => (
						<View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
							<TouchableOpacity
								onPress={logout}
								className="flex w-full items-end mb-10"
							>
								<Image
									source={icons.logout}
									resizeMode="contain"
									className="w-6 h-6"
								/>
							</TouchableOpacity>

							<View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
								<Image
									source={{ uri: user?.avi || logo }}
									className="w-[90%] h-[90%] rounded-lg"
									resizeMode="cover"
								/>
							</View>

							<InfoBox
								title={user?.username}
								containerStyles="mt-5"
								titleStyles="text-lg"
							/>

							<View className="mt-5 flex flex-row">
								<InfoBox
									title={stories.length}
									subtitle="Stories"
									titleStyles="text-xl"
									containerStyles="mr-10"
								/>
								<InfoBox
									title="1.2k"
									subtitle="Followers"
									titleStyles="text-xl"
								/>
							</View>
						</View>
					)}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
				/>
			</SafeAreaView>
		</ImageBackground>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
export default Profile
