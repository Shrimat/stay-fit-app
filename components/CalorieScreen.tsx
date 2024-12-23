import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text } from 'react-native';

function CalorieScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Calorie Screen</Text>
    </View>
  );
}

export default CalorieScreen;