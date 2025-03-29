// import React from "react";
// import { View, StyleSheet } from "react-native";
// import { WeekCalendar, CalendarProvider } from "react-native-calendars";

// function CalendarWidget() {
//   const todayDate = new Date().toISOString().split('T')[0];
//   const [dateSelected, setDateSelected] = React.useState(todayDate);
//   console.log(dateSelected);
//   return (
//     <View style={styles.container}>
//       <CalendarProvider onDateChanged={(date) => setDateSelected(date)} date={todayDate}>
//         <WeekCalendar firstDay={1} hideDayNames={false}/>
//       </CalendarProvider>
//     </View>
//   );
// }

// const styles = StyleSheet.create({ 
//     container: {
//         flex: 1,
//     },
// });

// export default CalendarWidget;
