import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { Button } from '@react-navigation/elements';

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()}>Go back home</Button>
    </View>
  );
}

export default ProfileScreen;