import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  TextInput,
  SectionList,
  FlatList,
  Text,
  Pressable,
  SafeAreaView,
  Keyboard,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { WeekCalendar, CalendarProvider } from "react-native-calendars";
import uuid from "react-native-uuid";

const FOOD_URL_BARCODE = "https://world.openfoodfacts.org/api/v3/product";
const FOOD_URL_SEARCH =
  "https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=";
const FOOD_SEARCH_PARAMS = "&json=true&page_size=10&lc=en";

function CalorieScreen() {
  const navigation = useNavigation();
  const [currentComponent, setCurrentComponent] = useState("Main");
  const todayDate = new Date().toISOString().split("T")[0];
  const [refresh, setRefresh] = React.useState<number>(0);
  const [foodData, setFoodData] = React.useState<any[]>([]);
  const [searchData, setSearchData] = React.useState<any[]>([]);
  const [foodName, setFoodName] = React.useState<string>("");
  const [mealType, setMealType] = React.useState<string>("");
  const [dateSelected, setDateSelected] = React.useState<string>(todayDate);
  const [foodInfo, setFoodInfo] = React.useState<object>({});

  useEffect(() => {
    fetch("http://192.168.1.114:5000/food")
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
  }, [dateSelected, currentComponent, refresh]);

  const searchFood = () => {
    Keyboard.dismiss();
    let url = FOOD_URL_SEARCH + foodName + FOOD_SEARCH_PARAMS;
    console.log(url);
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        let populate: any[] = [];
        data.products.map((item: any) => {
          if (item.product_name_en && item.product_name_en !== "") {
            populate.push({
              id: item._id,
              title: `${item.product_name_en}-${item.brands}`,
            });
          }
        });
        setSearchData(populate);
      })
      .catch((e) => console.log(e));

    // let url = FOOD_URL_BARCODE + "/" + foodName + ".json";
    // fetch(url)
    //   .then((resp) => resp.json())
    //   .then((data) => {
    //     let info = {
    //       Calories: null,
    //       Proteins: null,
    //       Carbohydrates: null,
    //       Fat: null,
    //     };
    //     console.log(data);
    //     if (data.status === "success") {
    //       info.Calories = data.product.nutriments["energy-kcal_100g"];
    //       info.Proteins = data.product.nutriments.proteins_100g;
    //       info.Carbohydrates = data.product.nutriments.carbohydrates_100g;
    //       info.Fat = data.product.nutriments.fat_100g;
    //       setFoodName(data.product.product_name);
    //       setFoodInfo(info);
    //     }

    //   })
    //   .catch((e) => console.log(e));
  };

  const logFood = () => {
    if (foodName === "") {
      alert("Please enter a food name.");
      return;
    }

    fetch("http://192.168.1.114:5000/food", {
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
    setCurrentComponent("Log Food");
  };

  const handleFoodDelete = (foodId: string) => {
    console.log("Deleting food: ", foodId);
    fetch(`http://192.168.1.114:5000/food/${foodId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setRefresh((prevRefresh) => prevRefresh + 1);
      })
      .catch((error) => console.error("Error:", error));
  };

  const renderComponent = () => {
    switch (currentComponent) {
      case "Main":
        return (
          <SafeAreaView style={styles.container}>
            <View style={{ flex: 0.3 }}>
              <CalendarProvider
                onDateChanged={(date: string) => setDateSelected(date)}
                date={dateSelected}
              >
                <WeekCalendar firstDay={1} hideDayNames={false} />
              </CalendarProvider>
            </View>
            <View style={{ flex: 1 }}>
              <SectionList
                sections={foodData}
                keyExtractor={(item, index) => `${item[0]}-${index}`}
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
                SectionSeparatorComponent={() => (
                  <View style={styles.sectionSeparator} />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View style={styles.header}>
                    <Text style={styles.headerText}>{title}</Text>
                  </View>
                )}
                renderSectionFooter={({ section: { title } }) => (
                  <View>
                    <View style={styles.spacing} />
                    <View style={[styles.footer, styles.sectionGap]}>
                      <Pressable
                        onPress={() => onPressNavigateToLogScreen(title)}
                      >
                        <Text style={styles.footerText}>Log {title}!</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
                stickySectionHeadersEnabled={true}
                contentContainerStyle={styles.contentContainer}
              />
            </View>
          </SafeAreaView>
        );
      case "Log Food":
        return (
          <View style={{ flex: 1 }}>
            <MaterialIcons
              onPress={() => {
                setCurrentComponent("Main");
                setFoodInfo({});
                setFoodName("");
                setSearchData([]);
              }}
              name="chevron-left"
              size={30}
            />
            <View style={styles.rowContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter Food Name"
                placeholderTextColor="grey"
                value={foodName}
                onChangeText={setFoodName}
              />
              <MaterialIcons
                onPress={searchFood}
                name="search"
                size={24}
                color="grey"
              />
              <MaterialIcons
                onPress={() => {}}
                name="camera-alt"
                size={24}
                color="grey"
              />
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                data={searchData}
                renderItem={({ item }) => (
                  <View style={styles.searchItem}>
                    <Pressable onPress={() => setFoodName(item.title)}>
                      <Text style={styles.searchItemText}>{item.title}</Text>
                    </Pressable>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={logFood}>
                <Text style={styles.buttonText}>Log Food</Text>
              </Pressable>
            </View>
          </View>
        );
      case "Camera":
        return (
          <View style={{ flex: 1 }}>
            
          </View>
        );
    }
  };

  console.log(foodData);
  console.log(searchData);

  return (
    <SafeAreaView style={styles.container}>{renderComponent()}</SafeAreaView>
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
    width: 200,
    borderWidth: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#6c757d",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // For Android shadow
  },
  itemText: {
    fontSize: 16,
    color: "#212529",
  },
  separator: {
    height: 1,
    backgroundColor: "#dee2e6",
    marginHorizontal: 10,
  },
  footer: {
    backgroundColor: "#e9ecef",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  footerText: {
    fontSize: 14,
    color: "#495057",
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
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    margin: 10,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    marginVertical: 5,
  },
  key: {
    fontWeight: "bold",
    marginRight: 10,
  },
  value: {
    color: "#555",
  },
  searchItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 10, // Space between items
    elevation: 2, // For Android shadow
  },
  searchItemText: {
    fontSize: 16,
    color: "#212529",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default CalorieScreen;
