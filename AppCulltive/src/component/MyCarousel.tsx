import React, {useEffect, useRef, useState} from 'react';

import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Carousel, {Pagination} from 'react-native-snap-carousel';

import {someStyles} from '../Styles';

const {height, width} = Dimensions.get('window');

const MyCarousel: React.FC = (props) => {
  // const carouselRef = useRef('');

  const [data, setData] = useState(props);

  useEffect(() => {
    console.log('Props:' + JSON.stringify(props.data));
  }, [data]);

  //FIXME: Pagination, index slowly moving
  const [index, setIndex] = useState(0);
  const [slider1ActiveSlide, setSlider1ActiveSlide] = useState(0);

  //TODO: handle onPress goes to respective Chart.tsx passing id as props.
  const _onPressCarouselButton = () => {
    // here handle carousel press
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          width: width * 0.8,
          height: 240,
          marginVertical: 8,
          marginHorizontal: 32,
          padding: 16,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: 5,
          shadowOpacity: 0.1,
          shadowRadius: 20,
          borderRadius: 16,
          elevation: 5,
          alignSelf: 'center',
          justifyContent: 'space-around',
        }}>
        <View>
          <Text style={[someStyles.h1, {color: '#2a628f'}]}>{item.title}</Text>
          <Text
            style={[
              someStyles.h3,
              {
                textAlign: 'center',
                alignSelf: 'center',
                color: '#49ACFD',
                // color: '#b5b6b7',
              },
            ]}>
            {item.text}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <Text
            style={[
              someStyles.h1_number,
              {color: '#3381FF', alignSelf: 'center'},
            ]}>
            {item.value}
          </Text>
          <Text
            style={[
              someStyles.h1,
              {color: '#3381FF', fontSize: 32, alignSelf: 'center'},
            ]}>
            {item.unit}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={props.data}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        loop={true}
        onSnapToItem={(index) => setIndex(index)}
      />
      {/* <Carousel
        layout={'default'}
        data={props.data}
        inactiveSlideOpacity={0.2}
        inactiveSlideScale={0.5}
        sliderWidth={width}
        itemWidth={width}
        itemHeight={height}
        renderItem={renderItem}
        containerCustomStyle={{overflow: 'visible'}}
        contentContainerCustomStyle={{overflow: 'visible'}}
        loopClonesPerSide={3}
        activeAnimationType={'timing'}
        loop={true}
        swipeThreshold={5}
        lockScrollTimeoutDuration={10}
        onSnapToItem={(index) => setIndex(index)}
      /> */}
      {/* <Pagination
        dotsLength={props.data.length}
        activeDotIndex={index}
        containerStyle={styles.paginationContainer}
        dotColor={'#3cbc40'}
        dotStyle={styles.paginationDot}
        inactiveDotColor={'lightgrey'}
        inactiveDotOpacity={2}
        inactiveDotScale={1}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerPagination: {
    width: '100%',
    height: 20,
  },
  paginationContainer: {
    paddingTop: 7,
    paddingBottom: 1,
  },
  paginationDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginHorizontal: 2,
  },
  logoStyle: {},
});

export default MyCarousel;
