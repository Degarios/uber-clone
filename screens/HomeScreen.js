import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, Image } from 'react-native';
import React from 'react';
import tw from 'tailwind-react-native-classnames';
import NavOptions from '../components/NavOptions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from 'react-redux';
import { setDestination, setOrigin } from '../slices/navSlice';
import NavFavorites from '../components/NavFavorites';

const HomeScreen = () => {
    const dispatch = useDispatch();

  return (
    <SafeAreaView style={ [ tw`bg-white h-full`, styles.androidView ] }>
      <View style={tw`p-5`}>
        <Image 
        source={{uri: "https://links.papareact.com/gzs",}} 
        style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
        }}
        />

        <GooglePlacesAutocomplete 
            placeholder='Where From?'
            styles={{
                container: {
                    flex: 0,
                },
                textInput: {
                    fontSize: 18,
                },
            }}
            onPress={(data, details = null) => {
                dispatch(setOrigin({
                    location: details.geometry.location,
                    description: data.description
                }));    

                dispatch(setDestination(null));
            }}
            fetchDetails={true}
            enablePoweredByContainer={false}
            minLength={2}
            query={{
                key: GOOGLE_MAPS_APIKEY,
                language: 'en',
            }}
            nearbyPlacesAPI='GooglePlacesSearch'
            debounce={400}
        />
        <NavOptions />
        <NavFavorites />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    androidView: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    }
});