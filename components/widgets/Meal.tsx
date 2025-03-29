// import React from "react";
// import {
//   Text,
//   View,
//   StyleSheet,
//   Pressable,
//   SectionList,
// } from "react-native";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// type Props = {
//   mealType: string;
//   onPress: () => void;
//   foodData: any[];
// };

// function MealWidget({ mealType, onPress, foodData }: Props) {
//   const handleFoodDelete = (foodId: string) => {
//     console.log("Deleting food: ", foodId);
//     fetch(`http://localhost:5000/food/${foodId}`, {
//       method: "DELETE",
//     })
//       .then((json) => console.log(json))
//       .catch((error) => console.log(error));
//   };

//   return (
//     <View style={styles.container}>
//       <SectionList
//         sections={foodData}
//         keyExtractor={(item, index) => item + index}
//         renderItem={({ item }) => (
//           <View>
//             <Text style={styles.title}>{item[1]}</Text>
//             <MaterialIcons
//               onPress={() => handleFoodDelete(item[0])}
//               name="delete"
//               size={24}
//               color="black"
//             />
//           </View>
//         )}
//         renderSectionHeader={({ section: { title } }) => (
//           <Text style={styles.header}>{title}</Text>
//         )}
//         renderSectionFooter={() => (
//           <Pressable onPress={onPress}>
//             <Text>Log Food</Text>
//           </Pressable>
//         )}
//       />
//       {/* <Pressable onPress={onPress}>
//         <Text>Log Food</Text>
//       </Pressable> */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     marginLeft: 150,
//   },
//   header: {
//     fontSize: 32,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 24,
//   },
// });

// export default MealWidget;
