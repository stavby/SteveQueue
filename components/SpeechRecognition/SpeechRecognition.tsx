import React, { useEffect } from 'react';
import { Button, PermissionsAndroid, View, StyleSheet } from 'react-native';
import SpeechAndroid from 'react-native-android-voice';
import { LANGUAGE } from '../../types';

interface SpeechRecognitionProps {
  title: string;
  onInput: (results: string) => void;
  language: LANGUAGE;
  isEnabled: boolean;
  speechMessage?: string;
}

export const SpeechRecognition = ({
  title,
  onInput,
  language,
  isEnabled,
  speechMessage = 'Speak yo ...',
}: SpeechRecognitionProps) => {
  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  const startSpeech = async () => {
    try {
      onInput(await SpeechAndroid.startSpeech(speechMessage, SpeechAndroid[language]));
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <View style={styles.button}>
      <Button color='#3700B3' disabled={isEnabled} onPress={startSpeech} title={title}></Button>
    </View>
  );
};

const requestMicrophonePermission = async () => {
  try {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
  } catch (error) {
    console.warn(error);
  }
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
  },
});
