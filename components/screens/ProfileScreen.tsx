import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { Button } from '@react-navigation/elements';

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button onPress={() => navigation.goBack()}>Go back home</Button>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileScreen;