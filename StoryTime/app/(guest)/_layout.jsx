// import { StatusBar } from "expo-status-bar"
// import { Redirect, Tabs } from "expo-router"
// import { Image, Text, View } from "react-native"

// import { icons } from "../../constants"
// import { Loader } from "../../components"
// import { useGlobalContext } from "../../context/GlobalProvider"
// import logo from "../../assets/images/KyDaTaLogoGold.png" // Ensure the import is correct

// const TabIcon = ({ icon, color, name, focused }) => {
// 	return (
// 		<View className="flex items-center justify-center gap-2">
// 			<Image
// 				source={icon}
// 				resizeMode="contain"
// 				style={{ tintColor: color }}
// 				className="w-6 h-6"
// 			/>
// 			<Text
// 				className={`${
// 					focused ? "font-psemibold" : "font-pregular"
// 				} text-xs`}
// 				style={{ color: color }}
// 			>
// 				{name}
// 			</Text>
// 		</View>
// 	)
// }

// const TabLayout = () => {
// 	const { loading, isLogged, user } = useGlobalContext()

// 	if (!loading && !isLogged) return <Redirect href="/sign-in" />

// 	return (
// 		<>
// 			<View className="absolute top-0 left-0 p-4 flex-row items-center">
// 				<Image
// 					source={logo}
// 					className="w-9 h-10"
// 					resizeMode="contain"
// 				/>
// 				<Text
// 					className="text-2xl font-psemibold text-white ml-4"
// 					style={{
// 						fontWeight: "bold",
// 						textShadowColor: "rgba(0, 0, 0, 0.75)",
// 						textShadowOffset: { width: -1, height: 1 },
// 						textShadowRadius: 10,
// 					}}
// 				>
// 					Welcome to Kydata
// 				</Text>
// 			</View>
// 			<Tabs
// 				screenOptions={{
// 					tabBarActiveTintColor: "#FFA001",
// 					tabBarInactiveTintColor: "#CDCDE0",
// 					tabBarShowLabel: false,
// 					tabBarStyle: {
// 						backgroundColor: "#161622",
// 						borderTopWidth: 1,
// 						borderTopColor: "#232533",
// 						height: 84,
// 					},
// 				}}
// 			>
// 				<Tabs.Screen
// 					name="guesthome"
// 					options={{
// 						title: "Guest Home",
// 						headerShown: false,
// 						tabBarIcon: ({ color, focused }) => (
// 							<TabIcon
// 								icon={icons.home}
// 								color={color}
// 								name="Guest Home"
// 								focused={focused}
// 							/>
// 						),
// 					}}
// 				/>
// 				<Tabs.Screen
// 					name="gueststory"
// 					options={{
// 						title: "Story",
// 						headerShown: false,
// 						tabBarIcon: ({ color, focused }) => (
// 							<TabIcon
// 								icon={icons.book}
// 								color={color}
// 								name="Story"
// 								focused={focused}
// 							/>
// 						),
// 					}}
// 				/>
// 			</Tabs>

// 			<Loader isLoading={loading} />
// 			<StatusBar backgroundColor="#161622" style="light" />
// 		</>
// 	)
// }

// export default TabLayout
