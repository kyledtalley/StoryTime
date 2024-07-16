import React, { useState, useEffect } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import {
	View,
	FlatList,
	Text,
	RefreshControl,
	ImageBackground,
	StyleSheet,
} from "react-native"
import {
	getBookmarkedStoriesByUserId,
	getCurrentUser,
} from "../../lib/appwrite"
import { useGlobalContext } from "../../context/GlobalProvider"
import { EmptyState, StoryCard } from "../../components"
import background from "../../assets/backgrounds/bookmarkBackground3.jpg"

const Bookmark = () => {
	const { user } = useGlobalContext()
	const [bookmarkedStories, setBookmarkedStories] = useState([])
	const [refreshing, setRefreshing] = useState(false)
	const [error, setError] = useState(null)

	const fetchBookmarkedStories = async () => {
		try {
			const currentUser = await getCurrentUser()
			if (!currentUser) {
				throw new Error("User not found")
			}
			const stories = await getBookmarkedStoriesByUserId(currentUser.$id)
			setBookmarkedStories(stories)
		} catch (error) {
			setError(error)
			console.error("Error fetching bookmarked stories:", error)
		}
	}

	useEffect(() => {
		fetchBookmarkedStories()
	}, [user])

	const onRefresh = async () => {
		setRefreshing(true)
		await fetchBookmarkedStories()
		setRefreshing(false)
	}

	if (error) {
		console.error("Error fetching bookmarked stories:", error)
	}

	return (
		<ImageBackground source={background} style={styles.background}>
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>Bookmarks</Text>
				</View>
				<FlatList
					data={bookmarkedStories || []}
					keyExtractor={(item) => item.$id.toString()}
					renderItem={({ item }) => (
						<StoryCard
							title={item.title}
							content={item.content}
							userId={item.userId.username || "Unknown"}
							avatar={item.userId.avi || null}
							storyId={item.$id}
						/>
					)}
					ListEmptyComponent={() => (
						<EmptyState
							title="No Bookmarked Stories"
							subtitle="You haven't bookmarked any stories yet"
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
	background: {
		flex: 1,
	},
	container: {
		flex: 1,
		paddingHorizontal: 16,
	},
	header: {
		width: "100%",
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		padding: 16,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
		borderRadius: 8,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#cdffee",
	},
	flatListContent: {
		paddingBottom: 16,
	},
})

export default Bookmark
