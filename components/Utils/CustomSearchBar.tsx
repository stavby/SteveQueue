import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Keyboard, Button } from 'react-native';
import CloseIcon from '../../assets/close.svg';
import SearchIcon from '../../assets/search.svg';

const SEARCH_ICON_SIZE = 28;
const CLOSE_ICON_SIZE = 23;

type CustomSearchBarProps = {
  handleSearch: (text: string) => Promise<void>
};

const CustomSearchBar = ({ handleSearch }: CustomSearchBarProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const onSearch = () => {
    Keyboard.dismiss();

    if(searchText) {
      handleSearch(searchText);
      setSearchText('');
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchBar,
          isClicked && styles.clickedSearchBar
        ]}
      >
        <SearchIcon
          title='search'
          color='black'
          onPress={onSearch}  
          width={SEARCH_ICON_SIZE}
          height={SEARCH_ICON_SIZE}
        />
        <TextInput
          style={styles.input}
          placeholder='Search'
          value={searchText}
          onChangeText={setSearchText}
          onFocus={() => setIsClicked(true)}
        />
        {isClicked && (
            <CloseIcon
              onPress={() => setSearchText('')}
              title='close'
              color='black'
              width={CLOSE_ICON_SIZE}
              height={CLOSE_ICON_SIZE}
            />
        )}  
      </View>
      {isClicked && (
          <Button
            title='CANCEL'
            color='#121212'
            onPress={() => {
              Keyboard.dismiss();
              setSearchText('');
              setIsClicked(false);
            }}
          />
      )}
    </View>
  );
};

export default CustomSearchBar;

const styles = StyleSheet.create({
  container: {
    margin: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
  },
  searchBar: {
    padding: 10,
    flexDirection: 'row',
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#d9dbda',
    width: '100%',
  },
  clickedSearchBar: {
    width: '85%',
    justifyContent: 'space-evenly',
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: '90%',
  },
});