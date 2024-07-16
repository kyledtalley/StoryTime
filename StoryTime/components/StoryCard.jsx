import React, { useState, useEffect } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { icons } from "../constants"
import { likeStory, dislikeStory, getStoryById } from "../lib/appwrite"

const StoryCard = ({
	question,
	content,
	userId,
	avatar,
	storyId,
	initialLikes,
}) => {
	const router = useRouter()
	const [likes, setLikes] = useState(initialLikes)
	const [hasLiked, setHasLiked] = useState(false)
	const [hasDisliked, setHasDisliked] = useState(false)

	useEffect(() => {
		const fetchStoryLikes = async () => {
			try {
				const story = await getStoryById(storyId)
				setLikes(story.likes)
			} catch (error) {
				console.error("Error fetching story likes:", error)
			}
		}

		fetchStoryLikes()
	}, [storyId])

	const handlePress = () => {
		router.push({
			pathname: "/screens/story-detail",
			params: { storyId, question, content, userId, avatar },
		})
	}

	const handleLike = async () => {
		try {
			if (hasLiked) {
				const updatedLikes = await dislikeStory(storyId, userId)
				setLikes(updatedLikes)
				setHasLiked(false)
			} else {
				if (hasDisliked) {
					await handleDislike() // Remove dislike first
				}
				const updatedLikes = await likeStory(storyId, userId)
				setLikes(updatedLikes)
				setHasLiked(true)
			}
		} catch (error) {
			console.error("Error liking story:", error)
		}
	}

	const handleDislike = async () => {
		try {
			if (hasDisliked) {
				const updatedLikes = await likeStory(storyId, userId)
				setLikes(updatedLikes)
				setHasDisliked(false)
			} else {
				if (hasLiked) {
					await handleLike() // Remove like first
				}
				const updatedLikes = await dislikeStory(storyId, userId)
				setLikes(updatedLikes)
				setHasDisliked(true)
			}
		} catch (error) {
			console.error("Error disliking story:", error)
		}
	}

	return (
		<TouchableOpacity onPress={handlePress} style={styles.container}>
			<View style={styles.row}>
				<View style={styles.avatarContainer}>
					<Image
						source={avatar ? { uri: avatar } : icons.profile}
						style={styles.avatar}
						resizeMode="cover"
					/>
				</View>
				<View style={styles.textContainer}>
					<Text style={styles.question} numberOfLines={1}>
						{typeof question === "string" ? question : ""}
					</Text>
					<Text style={styles.userId} numberOfLines={1}>
						{typeof userId === "string" ? userId : ""}
					</Text>
					<Text style={styles.content} numberOfLines={2}>
						{typeof content === "string" ? content : ""}
					</Text>
				</View>
				<View style={styles.menuContainer}>
					<Image
						source={icons.menu}
						style={styles.menuIcon}
						resizeMode="contain"
					/>
				</View>
			</View>
			<View style={styles.likesContainer}>
				<TouchableOpacity onPress={handleDislike}>
					<Text style={styles.dislikeButton}>
						{hasDisliked ? "Undislike" : "Dislike"}
					</Text>
				</TouchableOpacity>
				<Text style={styles.likesCount}>Likes: {likes}</Text>
				<TouchableOpacity onPress={handleLike}>
					<Text style={styles.likeButton}>
						{hasLiked ? "Unlike" : "Like"}
					</Text>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
		alignItems: "center",
		paddingHorizontal: 16,
		marginBottom: 28,
		backgroundColor: "#0000006b",
		borderRadius: 10,
		padding: 16,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
	},
	avatarContainer: {
		width: 46,
		height: 46,
		borderRadius: 23,
		borderWidth: 1,
		borderColor: "#FFD700",
		justifyContent: "center",
		alignItems: "center",
		padding: 0.5,
	},
	avatar: {
		width: "100%",
		height: "100%",
		borderRadius: 23,
	},
	textContainer: {
		flex: 1,
		marginLeft: 12,
		justifyContent: "center",
	},
	question: {
		fontSize: 16,
		fontWeight: "600",
		color: "#ffd555",
	},
	userId: {
		fontSize: 12,
		color: "#CDCDE0",
	},
	content: {
		fontSize: 14,
		color: "#ffffff",
	},
	menuContainer: {
		paddingTop: 8,
	},
	menuIcon: {
		width: 20,
		height: 20,
	},
	likesContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 10,
		width: "100%",
	},
	likeButton: {
		color: "#00FF00",
	},
	dislikeButton: {
		color: "#FF0000",
	},
	likesCount: {
		color: "#ffffff",
	},
})

export default StoryCard
