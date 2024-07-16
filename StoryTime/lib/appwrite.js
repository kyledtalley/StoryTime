import {
	Account,
	Avatars,
	Client,
	Storage,
	ID,
	Permission,
	Role,
	Databases,
	Query,
} from "appwrite"

export const appWriteConfig = {
	endpoint: "https://cloud.appwrite.io/v1",
	projectId: "6665ca0200047a5bc3be",
	databaseId: "6665cb3f001102cf8263",
	storyCollectionId: "6665cc30002d2da3c6d8",
	userCollectionId: "6665cb6f0026231d0ca4",
	storageId: "6665cd65003111a1ed56",
}

const client = new Client()
	.setEndpoint(appWriteConfig.endpoint)
	.setProject(appWriteConfig.projectId)

export const account = new Account(client)
const storage = new Storage(client)
const avatars = new Avatars(client)
const databases = new Databases(client)

export async function createUser(email, password, username) {
	try {
		const newAccount = await account.create(
			ID.unique(),
			email,
			password,
			username
		)

		if (!newAccount) throw new Error("Failed to create account")

		const avatarUrl = avatars.getInitials(username)

		await signIn(email, password)

		const newUser = await databases.createDocument(
			appWriteConfig.databaseId,
			appWriteConfig.userCollectionId,
			ID.unique(),
			{
				email: email,
				username: username,
				avi: avatarUrl,
			},
			[
				Permission.read(Role.users()),
				Permission.update(Role.users()),
				Permission.delete(Role.users()),
				Permission.write(Role.users()),
			]
		)

		return newUser
	} catch (error) {
		console.error("Error creating user:", error)
		throw new Error(error)
	}
}

export async function signIn(email, password) {
	try {
		const session = await account.createEmailPasswordSession(
			email,
			password
		)
		return session
	} catch (error) {
		console.error("Error signing in:", error)
		throw new Error(error)
	}
}

export async function getAccount() {
	try {
		const currentAccount = await account.get()
		return currentAccount
	} catch (error) {
		console.error("Error getting account:", error)
		throw new Error(error)
	}
}

export async function getCurrentUser() {
	try {
		const currentAccount = await account.get()
		if (!currentAccount) throw new Error("No current account")

		// console.log(`Fetching user document for email: ${currentAccount.email}`)

		const userResponse = await databases.listDocuments(
			appWriteConfig.databaseId,
			appWriteConfig.userCollectionId,
			[Query.equal("email", currentAccount.email)]
		)

		if (userResponse.documents.length === 0) {
			throw new Error("User document not found")
		}

		const currentUser = userResponse.documents[0]
		// console.log(`Fetched user document: ${JSON.stringify(currentUser)}`)

		if (!isValidDocumentId(currentUser.$id)) {
			console.error(`Invalid currentUser document ID: ${currentUser.$id}`)
			throw new Error("Invalid currentUser document ID")
		}

		return currentUser
	} catch (error) {
		console.error("Error fetching current user:", error)
		return null
	}
}

export async function signOut() {
	try {
		const session = await account.deleteSession("current")
		return session
	} catch (error) {
		console.error("Error signing out:", error)
		throw new Error(error)
	}
}

export async function saveStory(form) {
	try {
		const currentAccount = await account.get()

		if (!currentAccount) throw new Error("No current account")

		const currentUser = await databases.listDocuments(
			appWriteConfig.databaseId,
			appWriteConfig.userCollectionId,
			[Query.equal("email", currentAccount.email)]
		)

		if (currentUser.total === 0) throw new Error("User document not found")

		const userDocument = currentUser.documents[0]

		const permissions = [
			Permission.read(Role.any()), // Anyone can read
			Permission.read(Role.users()), // Any authenticated user can read
			Permission.write(Role.users()), // Any authenticated user can write
			Permission.update(Role.users()), // Any authenticated user can update
			Permission.delete(Role.users()), // Any authenticated user can delete
		]

		const newStory = await databases.createDocument(
			appWriteConfig.databaseId,
			appWriteConfig.storyCollectionId,
			ID.unique(),
			{
				title: form.title,
				prompt: form.prompt,
				content: form.content,
				likes: 0,
				userId: userDocument.$id, // Store the user document ID as a string
			},
			permissions // Set permissions here
		)

		userDocument.stories = [...userDocument.stories, newStory.$id]

		await databases.updateDocument(
			appWriteConfig.databaseId,
			appWriteConfig.userCollectionId,
			userDocument.$id,
			{
				stories: userDocument.stories,
			},
			permissions // Set permissions here as well
		)

		return newStory.$id
	} catch (error) {
		console.error("Error saving story:", error.message)
		throw new Error(error.message)
	}
}

export const getUserStories = async (userId) => {
	// console.log(`Fetching stories for userId: ${userId}`)
	if (!isValidDocumentId(userId)) {
		console.error(`Invalid userId: ${userId}`)
		throw new Error("Invalid userId")
	}

	try {
		const response = await databases.listDocuments(
			appWriteConfig.databaseId,
			appWriteConfig.storyCollectionId,
			[Query.equal("userId", userId)]
		)

		// console.log(`Fetched stories response: ${JSON.stringify(response)}`)

		// Extract only the content from each story
		const storyContents = response.documents.map((story) => ({
			$id: story.$id, // Ensure the story ID is included
			title: story.prompt, // Using prompt as the title
			content: story.content,
		}))

		// console.log(`Story contents: ${JSON.stringify(storyContents)}`)
		return storyContents
	} catch (error) {
		console.error("Error fetching user stories:", error)
		throw error
	}
}

export const getUserById = async (userId) => {
	try {
		const user = await databases.getDocument(
			appWriteConfig.databaseId,
			appWriteConfig.userCollectionId,
			userId
		)
		return user
	} catch (error) {
		if (error.code === 404) {
			console.error(`User with ID ${userId} not found`)
			return null
		} else {
			console.error("Error fetching user by ID:", error)
			throw error
		}
	}
}

const isValidDocumentId = (id) => {
	const validIdPattern = /^\w{1,36}$/
	return validIdPattern.test(id)
}

export const getStoryById = async (storyId) => {
	try {
		const story = await databases.getDocument(
			appWriteConfig.databaseId,
			appWriteConfig.storyCollectionId,
			storyId
		)
		return story
	} catch (error) {
		console.error("Error fetching story by ID:", error)
		throw error
	}
}

export const getAllStories = async () => {
	try {
		const response = await databases.listDocuments(
			appWriteConfig.databaseId,
			appWriteConfig.storyCollectionId
		)
		// console.log(`Fetched all stories response: ${JSON.stringify(response)}`)
		const stories = response.documents.map((story) => ({
			$id: story.$id,
			title: story.prompt || "Untitled", // Use prompt as the title or "Untitled" if missing
			content: story.content || "No content available",
			userId: story.userId.$id || story.userId, // Extract user ID if it's an object
			avatar: null, // Assuming no avatar information available
		}))
		return stories
	} catch (error) {
		console.error("Error fetching all stories:", error)
		throw error
	}
}

// export const getLatestStories = async () => {
// 	try {
// 		const response = await databases.listDocuments(
// 			appWriteConfig.databaseId,
// 			appWriteConfig.storyCollectionId,
// 			[Query.orderDesc("$createdAt")] // Assuming you want to get the latest stories based on creation date
// 		)

// 		// Extract necessary details from each story
// 		const stories = response.documents.map((story) => ({
// 			$id: story.$id,
// 			title: story.prompt || "Untitled",
// 			content: story.content || "No content available",
// 			userId: story.userId,
// 			avatar: null, // Assuming no avatar information available
// 			createdAt: story.$createdAt,
// 		}))
// 		return stories
// 	} catch (error) {
// 		console.error("Error fetching latest stories:", error)
// 		throw error
// 	}
// }

// export const bookmarkStory = async (userId, storyId, refreshUserData) => {
export const bookmarkStory = async (userId, storyId) => {
	try {
		const userDocument = await databases.getDocument(
			appWriteConfig.databaseId,
			appWriteConfig.userCollectionId,
			userId
		)

		const updatedBookmarkedStories = [
			...userDocument.bookmarkedStories,
			storyId,
		]

		console.log(
			"Updating user with new bookmarked stories:",
			updatedBookmarkedStories
		)

		await databases.updateDocument(
			appWriteConfig.databaseId,
			appWriteConfig.userCollectionId,
			userId,
			{
				bookmarkedStories: updatedBookmarkedStories,
			}
		)

		console.log("User document updated successfully")

		// Refresh user data after bookmarking
		// refreshUserData()
	} catch (error) {
		console.error("Error bookmarking story:", error)
		throw error
	}
}

export const getBookmarkedStories = async (userId) => {
	try {
		const user = await databases.getDocument(
			appWriteConfig.databaseId,
			appWriteConfig.userCollectionId,
			userId
		)

		const bookmarkedStoryIds = user.bookmarkedStories || []

		if (bookmarkedStoryIds.length === 0) {
			return []
		}

		const stories = await Promise.all(
			bookmarkedStoryIds.map(async (storyId) => {
				try {
					return await databases.getDocument(
						appWriteConfig.databaseId,
						appWriteConfig.storyCollectionId,
						storyId
					)
				} catch (error) {
					console.error("Error fetching story:", error)
					return null
				}
			})
		)

		// Filter out any null values in case some story fetching failed
		return stories.filter((story) => story !== null)
	} catch (error) {
		console.error("Error fetching bookmarked stories:", error)
		throw error
	}
}
// Example usage in some component
const handleBookmark = async (storyId) => {
	try {
		await bookmarkStory(user.$id, storyId)
		// await bookmarkStory(user.$id, storyId, refreshUserData)
	} catch (error) {
		console.error("Error bookmarking story:", error)
	}
}

export const getBookmarkedStoriesByUserId = async (userId) => {
	console.log(`Fetching bookmarked stories for userId: ${userId}`)
	if (!isValidDocumentId(userId)) {
		console.error(`Invalid userId: ${userId}`)
		throw new Error("Invalid userId")
	}

	try {
		const user = await databases.getDocument(
			appWriteConfig.databaseId,
			appWriteConfig.userCollectionId,
			userId
		)

		const bookmarkedStoryObjects = user.bookmarkedStories || []
		console.log(`Bookmarked story objects:`, bookmarkedStoryObjects)

		// Extract the IDs from the bookmarked story objects
		const bookmarkedStoryIds = bookmarkedStoryObjects.map(
			(story) => story.$id
		)
		console.log(`Bookmarked story IDs:`, bookmarkedStoryIds)

		const validBookmarkedStoryIds =
			bookmarkedStoryIds.filter(isValidDocumentId)
		console.log(`Valid bookmarked story IDs:`, validBookmarkedStoryIds)

		if (validBookmarkedStoryIds.length === 0) {
			return []
		}

		const stories = await Promise.all(
			validBookmarkedStoryIds.map(async (storyId) => {
				try {
					return await databases.getDocument(
						appWriteConfig.databaseId,
						appWriteConfig.storyCollectionId,
						storyId
					)
				} catch (error) {
					console.error("Error fetching story:", error)
					return null
				}
			})
		)

		return stories.filter((story) => story !== null)
	} catch (error) {
		console.error("Error fetching bookmarked stories:", error)
		throw error
	}
}

// Add these functions in your appwrite.js

// Function to like a story
export const likeStory = async (storyId, userId) => {
	try {
		const story = await databases.getDocument(
			appWriteConfig.databaseId,
			appWriteConfig.storyCollectionId,
			storyId
		)
		const updatedLikes = story.likes + 1

		await databases.updateDocument(
			appWriteConfig.databaseId,
			appWriteConfig.storyCollectionId,
			storyId,
			{ likes: updatedLikes }
		)

		return updatedLikes
	} catch (error) {
		console.error("Error liking story:", error)
		throw error
	}
}

export const dislikeStory = async (storyId, userId) => {
	try {
		const story = await databases.getDocument(
			appWriteConfig.databaseId,
			appWriteConfig.storyCollectionId,
			storyId
		)
		const updatedLikes = story.likes > 0 ? story.likes - 1 : 0

		await databases.updateDocument(
			appWriteConfig.databaseId,
			appWriteConfig.storyCollectionId,
			storyId,
			{ likes: updatedLikes }
		)

		return updatedLikes
	} catch (error) {
		console.error("Error disliking story:", error)
		throw error
	}
}

export const unlikeStory = async (storyId, userId) => {
	try {
		const story = await getStoryById(storyId)

		const updatedLikes = story.likes - 1
		const updatedLikedBy = story.likedBy.filter((id) => id !== userId)

		const updatedStory = await databases.updateDocument(
			appWriteConfig.databaseId,
			appWriteConfig.storyCollectionId,
			storyId,
			{
				likes: updatedLikes,
				likedBy: updatedLikedBy,
			}
		)

		return updatedStory
	} catch (error) {
		console.error("Error unliking story:", error)
		throw error
	}
}
