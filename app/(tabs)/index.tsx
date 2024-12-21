import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ImageViewer from "@/components/imageViewer";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker"

const PlaceHolderImage = require("../../assets/images/background-image.png");

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.")
    }

  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={selectedImage || PlaceHolderImage}/>
      </View>
      <View style={styles.footerContainer}>
        <Button onPress={pickImageAsync} label="Choose a photo" theme="primary" />
        <Button label="Use this photo"/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  imageContainer: {
    flex: 1
  }, 
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center"
  }
});

export default Index;
