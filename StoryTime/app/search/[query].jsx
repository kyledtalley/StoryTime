import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { View, Image, FlatList, TouchableOpacity, Text } from "react-native"
import { icons } from "../../constants"
import { signOut, searchStories, getCurrentUser } from "../../lib/appwrite"
import { useGlobalContext } from "../../context/GlobalProvider"
import { EmptyState, InfoBox, StoryCard } from "../../components"
import useAppwrite from "../../lib/useAppwrite"
import "../../styles/search/query.css"

const Search = ({ route }) => {
	const { query } = route.params
	const { user, setUser, setIsLogged } = useGlobalContext()
	const router = useRouter()

	const { data: stories, error } = useAppwrite(
		() => searchStories(query),
		[query]
	)

	const logout = async () => {
		try {
			await signOut()
			setUser(null)
			setIsLogged(false)
			router.replace("/sign-in")
		} catch (error) {
			console.error("Error signing out:", error)
		}
	}

	if (error) {
		console.error("Error fetching stories:", error)
	}

	return (
		<SafeAreaView className="container">
			<FlatList
				data={stories || []}
				keyExtractor={(item) => item.$id}
				renderItem={({ item }) => (
					<StoryCard
						title={item.title}
						content={item.content}
						creator={item.user?.username || "Unknown"} // Ensure creator info is displayed correctly
						avatar={item.user?.avi || null} // Ensure avatar info is displayed correctly
					/>
				)}
				ListEmptyComponent={() => (
					<EmptyState
						title="No stories Found"
						subtitle="No stories found for this topic"
					/>
				)}
				ListHeaderComponent={() => (
					<View className="header">
						<TouchableOpacity
							onPress={logout}
							className="logoutContainer"
						>
							<Image
								source={icons.logout}
								resizeMode="contain"
								className="logoutIcon"
							/>
						</TouchableOpacity>

						<View className="avatarContainer">
							<Image
								source={{ uri: user?.avi || logo }}
								className="avatar"
								resizeMode="cover"
							/>
						</View>

						<InfoBox
							title={user?.username}
							containerStyles="usernameContainer"
							titleStyles="usernameText"
						/>

						<View className="infoContainer">
							<InfoBox
								title={stories?.length || 0}
								subtitle="Stories"
								titleStyles="infoText"
								containerStyles="infoBox"
							/>
							<InfoBox
								title="1.2k"
								subtitle="Followers"
								titleStyles="infoText"
							/>
						</View>
					</View>
				)}
			/>
		</SafeAreaView>
	)
}

export default Search
