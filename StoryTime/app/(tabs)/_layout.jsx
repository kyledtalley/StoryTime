import { StatusBar } from "expo-status-bar"
import { Redirect, Tabs } from "expo-router"
import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native"

import { icons } from "../../constants"
import { Loader } from "../../components"
import { useGlobalContext } from "../../context/GlobalProvider"
import logo from "../../assets/images/KyDaTaLogoGold.png"
import { stopReading } from "../../utils/readStory"

const TabIcon = ({ icon, color, name, focused }) => {
	return (
		<View style={styles.tabIconContainer}>
			<Image
				source={icon}
				resizeMode="contain"
				style={[styles.tabIconImage, { tintColor: color }]}
			/>
			<Text
				style={[
					focused ? styles.tabIconTextFocused : styles.tabIconText,
					{ color: color },
				]}
			>
				{name}
			</Text>
		</View>
	)
}

const TabLayout = () => {
	const { loading, isLogged, user, narration, setNarration } =
		useGlobalContext()

	if (!loading && !isLogged) return <Redirect href="/sign-in" />

	return (
		<>
			<View style={styles.headerContainer}>
				<Image source={logo} style={styles.logo} resizeMode="contain" />
				<Text style={styles.headerText}>Welcome to Kydata</Text>
			</View>

			<Tabs
				screenOptions={{
					tabBarActiveTintColor: "#6f01ff",
					tabBarInactiveTintColor: "#1c00714d",
					tabBarShowLabel: false,
					tabBarStyle: styles.tabBar,
				}}
			>
				<Tabs.Screen
					name="home"
					options={{
						title: "Home",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.home}
								color={color}
								name="Home"
								focused={focused}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name="bookmarks"
					options={{
						title: "Bookmark",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.bookmark}
								color={color}
								name="Bookmarked"
								focused={focused}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="create"
					options={{
						title: "Create",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.plus}
								color={color}
								name="Create"
								focused={focused}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: "Profile",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.profile}
								color={color}
								name="Profile"
								focused={focused}
							/>
						),
					}}
				/>
			</Tabs>

			<Loader isLoading={loading} />
			<StatusBar backgroundColor="#0000000" style="light" />

			{narration && (
				<View style={styles.narrationOverlay}>
					<Text style={styles.narrationTitle}>{narration.title}</Text>
					<View style={styles.narrationControls}>
						<TouchableOpacity
							onPress={() => {
								stopReading()
								setNarration(null)
							}}
						>
							<Text style={styles.stopButtonText}>Stop</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	tabIconContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 2,
	},
	tabIconImage: {
		width: 24,
		height: 24,
	},
	tabIconText: {
		fontFamily: "regular",
		fontSize: 10,
	},
	tabIconTextFocused: {
		fontFamily: "semibold",
		fontSize: 10,
	},
	headerContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	logo: {
		width: 36,
		height: 40,
	},
	headerText: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
		marginLeft: 16,
		textShadowColor: "rgba(0, 0, 0, 0.75)",
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 10,
	},
	tabBar: {
		backgroundColor: "#ffffff",
		borderTopWidth: 1,
		borderTopColor: "#9500ff",
		height: 84,
	},
	narrationOverlay: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	narrationTitle: {
		color: "#fff",
		fontSize: 16,
	},
	narrationControls: {
		flexDirection: "row",
		alignItems: "center",
	},
	stopButtonText: {
		color: "red",
		fontSize: 16,
		marginLeft: 16,
	},
})

export default TabLayout
