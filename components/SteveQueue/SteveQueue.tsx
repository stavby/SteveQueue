import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { Switch } from 'react-native-switch';
import { isTokenUpToDate } from '../../code/apiUtils/Authentication';
import { addSongToQueue, moveSongToFront } from '../../code/apiUtils/Queue';
import { getSongUri } from '../../code/apiUtils/Search';
import { GeneralError, NoActiveDeviceError, NotPremiumError, SongNotFoundError } from '../../code/errors';
import { SpeechRecognition } from '../../components/SpeechRecognition/SpeechRecognition';
import { LANGUAGE } from '../../types';
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation';
import CustomSearchBar from '../Utils/CustomSearchBar';

type SteveQueueProps = {
  tokenExpired: (pendingRequest: string) => void;
  resetCurrentRequest: () => void;
  currentRequest?: string;
};

export const SteveQueue = ({ tokenExpired, currentRequest, resetCurrentRequest }: SteveQueueProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isPlayNext, setIsPlayNext] = useState(false);
  useEffect(() => {
    if (currentRequest) {
      searchAndAdd(currentRequest);
      resetCurrentRequest();
    }
  }, [currentRequest]);

  const searchAndAdd = async (searchTitle: string) => {
    if (!(await isTokenUpToDate())) {
      tokenExpired(searchTitle);
      return;
    }

    let success = true;
    setIsSearching(true);
    try {
      await go(searchTitle, isPlayNext);
    } catch (error) {
      const allowedErrors = [SongNotFoundError, NoActiveDeviceError, NotPremiumError, GeneralError];
      if (!allowedErrors.some((errorType) => error instanceof errorType)) {
        console.error(error);
        showError('Something went wrong, please try again');
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
      <Text style={styles.title}>Drive safe ;)</Text>
        <SpeechRecognition
          title='English'
          onInput={searchAndAdd}
          language={LANGUAGE.ENGLISH}
          isEnabled={isSearching}
          />
        <SpeechRecognition
          title='Hebrew'
          onInput={searchAndAdd}
          language={LANGUAGE.HEBREW}
          speechMessage={'דבר.י אח.ות שלי'}
          isEnabled={isSearching}
          />
      <View style={styles.searchBar}>
        <CustomSearchBar handleSearch={searchAndAdd} />
      </View>
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
  searchBar: {
    position: 'absolute',
    bottom: 35
  }
});
