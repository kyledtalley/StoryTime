// import { useState, useEffect } from "react"
// import { SafeAreaView } from "react-native-safe-area-context"
// import { FlatList, Image, RefreshControl, Text, View } from "react-native"
// import { EmptyState, SearchInput, Trending, StoryCard } from "../../components"
// import { getAllStories, getLatestStories } from "../../lib/appwrite"
// import useAppwrite from "../../lib/useAppwrite"
// import { useGlobalContext } from "../../context/GlobalProvider"
// import logo from "../../assets/images/KyDaTaLogoGold.png"

// const GuestHome = () => {
// 	const { user } = useGlobalContext()
// 	const { data: stories, refetch } = useAppwrite(getAllStories, [], {
// 		enabled: true,
// 	})
// 	const { data: latestStories } = useAppwrite(getLatestStories, [], {
// 		enabled: true,
// 	})

// 	const [refreshing, setRefreshing] = useState(false)

// 	useEffect(() => {
// 		console.log("Stories:", stories)
// 		console.log("Latest Stories:", latestStories)
// 	}, [stories, latestStories])

// 	const onRefresh = async () => {
// 		setRefreshing(true)
// 		await refetch()
// 		setRefreshing(false)
// 	}

// 	return (
// 		<SafeAreaView className="bg-primary">
// 			<FlatList
// 				data={stories}
// 				keyExtractor={(item) => item.$id}
// 				renderItem={({ item }) => (
// 					<StoryCard
// 						title={item.title}
// 						content={item.content}
// 						creator={item.creator.username}
// 						avatar={item.creator.avi}
// 					/>
// 				)}
// 				ListHeaderComponent={() => (
// 					<View className="flex my-6 px-4 space-y-6">
// 						<View className="flex justify-between items-start flex-row mb-6">
// 							<View>
// 								<Text className="font-pmedium text-sm text-gray-100">
// 									Welcome Back
// 								</Text>
// 								<Text className="text-2xl font-psemibold text-white">
// 									{user?.username || "Guest"}
// 								</Text>
// 							</View>
// 							<View className="mt-1.5">
// 								<Image
// 									source={logo}
// 									className="w-9 h-10"
// 									resizeMode="contain"
// 								/>
// 							</View>
// 						</View>
// 						<SearchInput />
// 						<View className="w-full flex-1 pt-5 pb-8">
// 							<Text className="text-lg font-pregular text-gray-100 mb-3">
// 								Latest Stories
// 							</Text>
// 							<Trending stories={latestStories ?? []} />
// 						</View>
// 					</View>
// 				)}
// 				ListEmptyComponent={() => (
// 					<EmptyState
// 						title="No Stories Found"
// 						subtitle="No stories created yet"
// 					/>
// 				)}
// 				refreshControl={
// 					<RefreshControl
// 						refreshing={refreshing}
// 						onRefresh={onRefresh}
// 					/>
// 				}
// 			/>
// 		</SafeAreaView>
// 	)
// }

// export default GuestHome
