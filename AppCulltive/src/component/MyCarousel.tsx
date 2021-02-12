import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Components
import Carousel, {Pagination} from 'react-native-snap-carousel';

// Assets
import {someStyles} from '../Styles';
import {someColors} from '../Colors';
const {height, width} = Dimensions.get('window');

//TODO: Validate data, if value === std (sensorData.list) do ...
// - show activity indicator instead (loading value state)
// - print old value
// - print error message
// - show loading (general)

const MyCarousel: React.FC = (props) => {
  // const carouselRef = useRef('');

  //TODO: Validate props
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

  const renderItem = ({item}: any) => {
    return (
      <View
        style={{
          width: width * 0.8,
          height: height * 0.75,
          marginVertical: 8,
          marginHorizontal: 8,
          padding: 4,
          backgroundColor: someColors.white.color,
          shadowColor: someColors.primary.color,
          shadowOffset: 2,
          shadowOpacity: 0.2,
          shadowRadius: 16,
          borderRadius: 24,
          elevation: 5,
          alignSelf: 'center',
          justifyContent: 'space-around',
        }}>
        <View style={{flex: 1}}>
          <Text
            style={[
              someStyles.h1,
              someColors.black,
              {marginHorizontal: 8, marginTop: 24},
            ]}>
            {item.title}
          </Text>
          <Text
            style={[
              someStyles.h3,
              someColors.gray,
              {
                textAlign: 'center',
                alignSelf: 'stretch',
              },
            ]}>
            {item.text}
          </Text>
        </View>
        <View style={{flex: 5, flexDirection: 'row', alignSelf: 'center'}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <Text
              style={[
                someStyles.h1_number,
                someColors.tertiary,
                {
                  position: 'relative',
                  alignItems: 'center',
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  fontSize: 96,
                },
              ]}>
              {item.value}
            </Text>
            <Text
              style={[
                someStyles.h1,
                someColors.dark_gray,
                {
                  fontSize: 32,
                  position: 'relative',
                  bottom: 12,
                  left: 12,
                },
              ]}>
              {item.unit}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{}}>
      <Carousel
        data={props.data}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        loop={true}
        onSnapToItem={(index) => setIndex(index)}
      />
      <Pagination
        dotsLength={props.data.length}
        activeDotIndex={index}
        containerStyle={{
          paddingTop: 7,
          paddingBottom: 1,
        }}
        dotColor={'#3cbc40'}
        dotStyle={{
          width: 9,
          height: 9,
          borderRadius: 4.5,
          marginHorizontal: 2,
        }}
        inactiveDotColor={'lightgrey'}
        inactiveDotOpacity={2}
        inactiveDotScale={1}
      />
    </View>
  );
};

export default MyCarousel;

/* <Carousel
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
/>

<Pagination
dotsLength={props.data.length}
activeDotIndex={index}
containerStyle={styles.paginationContainer}
dotColor={'#3cbc40'}
dotStyle={styles.paginationDot}
inactiveDotColor={'lightgrey'}
inactiveDotOpacity={2}
inactiveDotScale={1}
/> */
