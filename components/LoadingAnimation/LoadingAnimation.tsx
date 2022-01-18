import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';

interface LoadingAnimationProps {
  isLoading: boolean;
  text: string;
}

export const LoadingAnimation = ({ isLoading, text }: LoadingAnimationProps) => {
  return (
    <>
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator color={'#2196F3'} size={200} />
          <Text style={styles.text}>{text}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loading: {
    zIndex: 3,
    elevation: 3,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .6)',
  },
});
