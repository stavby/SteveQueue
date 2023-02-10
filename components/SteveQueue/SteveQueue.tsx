import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { addSongToQueue, moveSongToFront } from '../../code/apiUtils/Queue';
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
import { Switch } from 'react-native-switch';

interface SteveQueueProps {
  tokenExpired: () => void;
}

export const SteveQueue = ({ tokenExpired }: SteveQueueProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isPlayNext, setIsPlayNext] = useState(false);

  const searchAndAdd = async (searchTitle: string) => {
    if (!(await isTokenUpToDate())) {
      tokenExpired();
      return;
    }

    let success = true;
    setIsSearching(true);
    try {
      await go(searchTitle, isPlayNext);
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

  const toggleIsPlayNext = () => setIsPlayNext(!isPlayNext);

  return (
    <View style={styles.container}>
      <LoadingAnimation isLoading={isSearching} text='Loading ... :)' />
      <View style={styles.playNextSwitch}>
        <Text style={styles.playNextText}>Play next?</Text>
        <Switch activeText='' inActiveText='' value={isPlayNext} onValueChange={toggleIsPlayNext} circleSize={30} />
      </View>
      <Text style={styles.title}>Let's go!</Text>
      <SpeechRecognition title='English' onInput={searchAndAdd} language={LANGUAGE.ENGLISH} isEnabled={isSearching} />
      <SpeechRecognition
        title='עברית'
        onInput={searchAndAdd}
        language={LANGUAGE.HEBREW}
        speechMessage={'דבר.י אח.ות שלי'}
        isEnabled={isSearching}
      />
    </View>
  );
};

const go = async (searchTitle: string, isPlayNext: boolean) => {
  const songUri = await getSongUri(searchTitle);
  if (songUri) {
    await addSongToQueue(songUri);
    if (isPlayNext) {
      await moveSongToFront(songUri);
    }
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
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  playNextSwitch: {
    position: 'absolute',
    right: 0,
    marginRight: 20,
    top: 0,
    marginTop: 20,
    flexDirection: 'row',
  },
  playNextText: {
    color: 'white',
    fontSize: 18,
    marginRight: 5,
  },
});
