import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { addSongToQueue } from '../../code/apiUtils/Queue';
import { getSongUri } from '../../code/apiUtils/Search';
import { SongNotFoundError } from '../../code/errors/SongNotFoundError';
import { SpeechRecognition } from '../../components/SpeechRecognition/SpeechRecognition';
import { LANGUAGE } from '../../types';
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation';
import Snackbar from 'react-native-snackbar';
import { NoActiveDeviceError } from '../../code/errors/NoActiveDeviceError';
import { isTokenUpToDate } from '../../code/apiUtils/Authentication';
import { NotPremiumError } from '../../code/errors/NotPremiumError';
import { GeneralError } from '../../code/errors/GeneralError';

interface SteveQueueProps {
  tokenExpired: () => void;
}

export const SteveQueue = ({ tokenExpired }: SteveQueueProps) => {
  const [isSearching, setIsSearching] = useState(false);

  const searchAndAdd = async (searchTitle: string) => {
    if (!(await isTokenUpToDate())) {
      tokenExpired();
      return;
    }

    let success = true;
    setIsSearching(true);
    try {
      await go(searchTitle);
    } catch (error) {
      const allowedErrors = [SongNotFoundError, NoActiveDeviceError, NotPremiumError, GeneralError];
      if (!allowedErrors.some((errorType) => error instanceof errorType)) {
        throw error;
      }

      showError((error as Error).message);
      success = false;
    }
    setIsSearching(false);
    if (success) {
      showSongAddedToQueue();
    }
  };

  return (
    <View style={styles.container}>
      <LoadingAnimation isLoading={isSearching} text='Loading ... :)' />
      <Text style={styles.title}>Let's go!</Text>
      <SpeechRecognition title='English' onInput={searchAndAdd} language={LANGUAGE.ENGLISH} isEnabled={isSearching} />
      <SpeechRecognition
        title='עברית'
        onInput={searchAndAdd}
        language={LANGUAGE.HEBREW}
        speechMessage={'דבר אח שלי'}
        isEnabled={isSearching}
      />
    </View>
  );
};

const go = async (searchTitle: string) => {
  const songUri = await getSongUri(searchTitle);
  if (songUri) {
    await addSongToQueue(songUri);
  }
};

const showError = (message: string) => {
  Snackbar.show({
    text: message,
    duration: Snackbar.LENGTH_LONG,
    backgroundColor: 'red',
  });
};

const showSongAddedToQueue = () => {
  Snackbar.show({
    text: 'Song added to queue! :)',
    duration: Snackbar.LENGTH_LONG,
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
