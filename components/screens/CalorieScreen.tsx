import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  TextInput,
  SectionList,
  Text,
  Pressable,
  SafeAreaView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button } from "@react-navigation/elements";
import { WeekCalendar, CalendarProvider } from "react-native-calendars";
import uuid from "react-native-uuid";

const FOOD_URL = "https://world.openfoodfacts.org/api/v2/product"

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
    <View style={styles.container}>
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
        <View style={styles.container}>
          <View>
            <CalendarProvider
              onDateChanged={(date: string) => setDateSelected(date)}
              date={dateSelected}
            >
              <WeekCalendar firstDay={1} hideDayNames={false} />
            </CalendarProvider>
          </View>
          <SafeAreaView style={{flex: 1}}>
            <SectionList
              sections={foodData}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.itemText}>{item[1]}</Text>
                  <MaterialIcons
                    onPress={() => handleFoodDelete(item[0])}
                    name="delete"
                    size={24}
                    color="black"
                  />
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
              renderSectionHeader={({ section: { title } }) => (
                <View style={styles.header}>
                  <Text style={styles.headerText}>{title}</Text>
                </View>
              )}
              renderSectionFooter={({ section: { title } }) => (
                <View>
                  <View style={styles.spacing} />
                  <View style={[styles.footer, styles.sectionGap]}>
                    <Pressable onPress={() => onPressNavigateToLogScreen(title)}>
                      <Text style={styles.footerText}>Log {title}!</Text>
                    </Pressable>
                  </View>
                </View>
              )}
              stickySectionHeadersEnabled={true}
              contentContainerStyle={styles.contentContainer}
            />
          </SafeAreaView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  
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
  title: {
    fontSize: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // For Android shadow
  },
  itemText: {
    fontSize: 16,
    color: '#212529',
  },
  separator: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginHorizontal: 10,
  },
  footer: {
    backgroundColor: '#e9ecef',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  footerText: {
    fontSize: 14,
    color: '#495057',
  },
  sectionSeparator: {
    height: 20,
  },
  sectionGap: {
    marginBottom: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  spacing: {
    height: 10, 
  },
});

export default CalorieScreen;
