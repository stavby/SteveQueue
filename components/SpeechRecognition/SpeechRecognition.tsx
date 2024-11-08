import React, { useEffect } from 'react';
import { PermissionsAndroid, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
      onInput(await SpeechAndroid.startSpeech(speechMessage, language));
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={startSpeech} disabled={isEnabled}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
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
    marginVertical: 8,
    backgroundColor: '#3700B3',
    paddingVertical: 50,
    paddingHorizontal: 100,
    width: 300,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});
