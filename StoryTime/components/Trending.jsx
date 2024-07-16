import { useState, useEffect } from "react"
import {
	FlatList,
	ImageBackground,
	TouchableOpacity,
	Text,
	StyleSheet,
	View,
} from "react-native"
import * as Animatable from "react-native-animatable"
import { icons } from "../constants"

const zoomIn = {
	0: {
		scale: 0.9,
	},
	1: {
		scale: 1,
	},
}

const zoomOut = {
	0: {
		scale: 1,
	},
	1: {
		scale: 0.9,
	},
}

const TrendingItem = ({ activeItem, item }) => {
	return (
		<Animatable.View
			style={styles.itemContainer}
			animation={activeItem === item.$id ? zoomIn : zoomOut}
			duration={500}
		>
			<TouchableOpacity style={styles.touchable} activeOpacity={0.7}>
				<ImageBackground
					source={{
						uri: item.thumbnail, // Assuming thumbnail is available, otherwise use a placeholder
					}}
					style={styles.imageBackground}
					resizeMode="cover"
				>
					<View style={styles.textContainer}>
						<Text style={styles.title}>{item.title}</Text>
						<Text style={styles.likes}>Likes: {item.likes}</Text>
					</View>
				</ImageBackground>
			</TouchableOpacity>
		</Animatable.View>
	)
}

const Trending = ({ stories }) => {
	const [activeItem, setActiveItem] = useState(stories[0]?.$id || null)

	const viewableItemsChanged = ({ viewableItems }) => {
		if (viewableItems.length > 0) {
			setActiveItem(viewableItems[0].key)
		}
	}

	// Sort stories by likes in descending order
	const sortedStories = [...stories].sort((a, b) => b.likes - a.likes)

	return (
		<FlatList
			data={sortedStories}
			horizontal
			keyExtractor={(item) => item.$id}
			renderItem={({ item }) => (
				<TrendingItem activeItem={activeItem} item={item} />
			)}
			onViewableItemsChanged={viewableItemsChanged}
			viewabilityConfig={{
				itemVisiblePercentThreshold: 70,
			}}
			contentContainerStyle={styles.flatListContent}
		/>
	)
}

const styles = StyleSheet.create({
	itemContainer: {
		marginRight: 20,
	},
	touchable: {
		position: "relative",
		justifyContent: "center",
		alignItems: "center",
	},
	imageBackground: {
		width: 200,
		height: 300,
		borderRadius: 20,
		overflow: "hidden",
		justifyContent: "flex-end",
		paddingBottom: 10,
		paddingHorizontal: 10,
		backgroundColor: "rgba(0,0,0,0.3)", // Fallback color if thumbnail is missing
	},
	textContainer: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		borderRadius: 10,
		padding: 5,
	},
	title: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	likes: {
		color: "white",
		fontSize: 14,
	},
	flatListContent: {
		paddingHorizontal: 10,
	},
})

export default Trending
