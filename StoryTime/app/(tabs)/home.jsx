import React, { useState, useEffect } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import {
	View,
	Image,
	FlatList,
	RefreshControl,
	Text,
	ImageBackground,
	StyleSheet,
} from "react-native"
import { EmptyState, StoryCard, SearchInput } from "../../components"
import { getAllStories, getUserById } from "../../lib/appwrite"
import useAppwrite from "../../lib/useAppwrite"
import { useGlobalContext } from "../../context/GlobalProvider"
import { isValidDocumentId } from "../../utils"
import logo from "../../assets/images/KyDaTaLogoGold.png"
import background from "../../assets/backgrounds/storytimealtbackgroundUnedited.jpg"

const Home = () => {
	const { user } = useGlobalContext()
	const {
		data: stories,
		refetch,
		error,
	} = useAppwrite(getAllStories, [], { enabled: true })
	const [refreshing, setRefreshing] = useState(false)
	const [storiesWithUser, setStoriesWithUser] = useState([])

	useEffect(() => {
		if (error) {
			console.error("Error fetching stories:", error)
		}
	}, [error])

	useEffect(() => {
		const fetchUserDetails = async () => {
			const storiesWithUserDetails = await Promise.all(
				(stories || []).map(async (story) => {
					const userId =
						typeof story.userId === "string"
							? story.userId
							: story.userId.$id

					if (!isValidDocumentId(userId)) {
						console.error(
							`Invalid userId: ${JSON.stringify(
								userId
							)} for story ${story.$id}`
						)
						return story // Return story without user details if userId is invalid
					}

					try {
						const user = await getUserById(userId)
						if (user) {
							return {
								...story,
								username: user.username,
								avatar: user.avi,
							}
						} else {
							return story // Return story without user details if user is not found
						}
					} catch (err) {
						console.error(
							`Error fetching user data for story ${story.$id}:`,
							err
						)
						return story // Return story without user details if there's an error
					}
				})
			)
			setStoriesWithUser(storiesWithUserDetails)
		}

		if (stories) {
			fetchUserDetails()
		}
	}, [stories])

	const onRefresh = async () => {
		setRefreshing(true)
		await refetch()
		setRefreshing(false)
	}

	return (
		<ImageBackground source={background} style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<View style={styles.headerContent}>
						<View>
							<Text style={styles.welcomeText}>
								Welcome Back,
							</Text>
							<Text style={styles.usernameText}>
								{user?.username || ""}
							</Text>
						</View>
						<View style={styles.logoContainer}>
							<Image
								source={user?.avi ? { uri: user.avi } : logo}
								style={styles.logo}
								resizeMode="contain"
							/>
						</View>
					</View>
					<SearchInput />
				</View>
				<FlatList
					data={storiesWithUser || []}
					keyExtractor={(item) => item.$id}
					renderItem={({ item }) => (
						<StoryCard
							question={item.title}
							content={item.content}
							userId={item.username} // Pass username
							avatar={item.avatar}
							storyId={item.$id} // Ensure storyId is passed
							initialLikes={item.likes} // Pass initial likes
						/>
					)}
					ListEmptyComponent={() => (
						<EmptyState
							title="No Stories Found"
							subtitle="No stories created yet"
						/>
					)}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					contentContainerStyle={styles.flatListContent}
				/>
			</SafeAreaView>
		</ImageBackground>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
	},
	header: {
		width: "100%",
		padding: 16,
		justifyContent: "center",
		marginBottom: 16,
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		borderRadius: 8,
	},
	headerContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	welcomeText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#ffffff",
	},
	usernameText: {
		fontSize: 24,
		fontWeight: "600",
		color: "#7915d6",
	},
	logoContainer: {
		overflow: "visible",
		marginTop: 8,
	},
	logo: {
		width: 36,
		height: 36,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#FFD700",
	},
	flatListContent: {
		paddingBottom: 16,
	},
})

export default Home
