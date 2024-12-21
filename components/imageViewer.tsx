import { Image } from 'expo-image';
import React from 'react';
import { View, StyleSheet } from "react-native";

type Props = {
    imgSource: string;
}

function ImageViewer({ imgSource }: Props) {
    return <Image source={imgSource} style={styles.image}/>
}

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    }
})

export default ImageViewer;