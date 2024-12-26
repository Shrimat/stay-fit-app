import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  TextInput,
  SectionList,
  Text,
  Pressable,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button } from "@react-navigation/elements";
import { WeekCalendar, CalendarProvider } from "react-native-calendars";
import uuid from "react-native-uuid";

function CalorieScreen() {
  const navigation = useNavigation();
  const todayDate = new Date().toISOString().split("T")[0];
  const [refresh, setRefresh] = React.useState<number>(0);
  const [pressed, setPressed] = React.useState<boolean>(false);
  const [foodData, setFoodData] = React.useState<any[]>([]);
  const [foodName, setFoodName] = React.useState<string>("");
  const [mealType, setMealType] = React.useState<string>("");
  const [dateSelected, setDateSelected] = React.useState<string>(todayDate);

  useEffect(() => {
    fetch("http://localhost:5000/food")
      .then((response) => response.json())
      .then((data) => {
        let filteredData: { title: string; data: any[] }[] = [
          { title: "Breakfast", data: [] },
          { title: "Lunch", data: [] },
          { title: "Dinner", data: [] },
          { title: "Snacks", data: [] },
        ];
        data.forEach((i: any) => {
          if (i.date === dateSelected) {
            if (i.meal === "Breakfast") {
              filteredData[0].data.push([i.id, i.food]);
            } else if (i.meal === "Lunch") {
              filteredData[1].data.push([i.id, i.food]);
            } else if (i.meal === "Dinner") {
              filteredData[2].data.push([i.id, i.food]);
            } else {
              filteredData[3].data.push([i.id, i.food]);
            }
          }
        });
        setFoodData(filteredData);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, [dateSelected, pressed, refresh]);

  const logFood = () => {
    if (foodName === "") {
      alert("Please enter a food name.");
      return;
    }
    // setFoodData((prev) => [...prev, foodName]);
    fetch("http://localhost:5000/food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: mealType,
        data: { id: uuid.v4(), date: dateSelected, food: foodName },
      }),
    });
    alert(`Logged ${foodName}!`);
    setFoodName("");
  };

  const onPressNavigateToLogScreen = (meal: string) => {
    setMealType(meal);
    setPressed(true);
  };

  const handleFoodDelete = (foodId: string) => {
    console.log("Deleting food: ", foodId);
    fetch(`http://localhost:5000/food/${foodId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data)
        setRefresh((prevRefresh) => prevRefresh + 1);
      })
      .catch((error) => console.error("Error:", error));
  };

  console.log(foodData);

  return (
    <View style={{ flex: 1 }}>
      {pressed ? (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter Food Name"
            placeholderTextColor="grey"
            value={foodName}
            onChangeText={setFoodName}
          />
          <Button onPress={logFood}>Log Food</Button>
          <Button onPress={() => setPressed(false)}>Back</Button>
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <CalendarProvider
              onDateChanged={(date: string) => setDateSelected(date)}
              date={dateSelected}
            >
              <WeekCalendar firstDay={1} hideDayNames={false} />
            </CalendarProvider>
          </View>
          <View style={styles.listContainer}>
            <SectionList
              sections={foodData}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => (
                <View>
                  <Text style={styles.title}>{item[1]}</Text>
                  <MaterialIcons
                    onPress={() => handleFoodDelete(item[0])}
                    name="delete"
                    size={24}
                    color="black"
                  />
                </View>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.header}>{title}</Text>
              )}
              renderSectionFooter={({ section: { title } }) => (
                <Pressable onPress={() => onPressNavigateToLogScreen(title)}>
                  <Text>Log Food</Text>
                </Pressable>
              )}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    marginLeft: 150,
  },
  flatList: {
    flex: 1,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
  },
});

export default CalorieScreen;
