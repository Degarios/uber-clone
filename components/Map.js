import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import MapView, {Marker} from 'react-native-maps';
import tw from 'tailwind-react-native-classnames';
import { useDispatch, useSelector } from 'react-redux';
import { selectDestionation, selectOrigin, settravelTimeInformation } from '../slices/navSlice';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from "@env";

const Map = () => {
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestionation);
    const mapRef = useRef(null);
    const dispatch =useDispatch();

    useEffect(() => {
        if (!origin || !destination) return;

        // Zoom and fit to the markers
        mapRef.current.fitToSuppiedMarkers([ 'origin' , 'destination' ], {
            edgePadding: { top: 50, right: 50, bottom: 50, Left: 50 },
        });
    }, [origin, destination]);

    useEffect(() => {
        if (!origin || !destination) return;

        const getTravelTime = async() => {
            fetch(`https://maps.googleapi.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&keys=${GOOGLE_MAPS_APIKEY}`)
            .then(res => res.json)
            .then(data => {
                dispatch(settravelTimeInformation(data.rows[0].elements[0]));
            })
        };

        getTravelTime();

    }, [ origin, destination, GOOGLE_MAPS_APIKEY ]);

  return (
    <MapView
        style={tw`flex-1`}
        mapType='mutedStandard'
        initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        }}
    >
        {origin && destination && (
            <MapViewDirections 
                origin={origin.description}
                destination={destination.description}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3}
                strokeColor='black'
            />
        )}

        {destination?.location && (
            <Marker 
                coordinate={{
                    latitude: destination.location.lat,
                    longitude: destination.location.lng,
                }}
                title='Destination'
                description={destination.description}
                identifier='destination'
            />
        )}
        {origin?.location && (
            <Marker 
                coordinate={{
                    latitude: origin.location.lat,
                    longitude: origin.location.lng,
                }}
                title='Origin'
                description={origin.description}
                identifier='origin'
            />
        )}
    </MapView>
    /*
    <MapView
        style={tw`flex-1`}
        mapType='mutedStandard'
        initialRegion={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        }}
    >
        {origin?.location && (
            <Marker 
                coordinate={{
                    latitude: origin.location.lat,
                    longitude: origin.location.lng,
                }}
                title='Origin'
                description={origin.description}
                identifier='origin'
            />
        )}
    </MapView>
    */
  )
}

export default Map

const styles = StyleSheet.create({})