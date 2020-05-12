import React, {useEffect, useRef, useState} from 'react';

import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import Carousel, {Pagination} from 'react-native-snap-carousel';

import {someStyles} from '../Styles';

const {height, width} = Dimensions.get('window');

const MyCarousel: React.FC = (props) => {
  const carouselRef = useRef(null);

  const [slider1ActiveSlide, setSlider1ActiveSlide] = useState(0);
  const [index, setIndex] = useState(0);

  const renderItem = ({item, index}) => {
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
        }}>
        <Text style={someStyles.h1}>{item.title}</Text>
        <Text style={[someStyles.h3, {alignSelf: 'center'}]}>{item.text}</Text>
        <Text style={[someStyles.h3, {alignSelf: 'center'}]}>{item.value}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        layout={'default'}
        ref={carouselRef}
        data={props.data}
        inactiveSlideOpacity={0.1}
        inactiveSlideScale={0.5}
        sliderWidth={width}
        itemWidth={width}
        itemHeight={height}
        renderItem={renderItem}
        containerCustomStyle={{overflow: 'visible'}}
        contentContainerCustomStyle={{overflow: 'visible'}}
        loopClonesPerSide={5}
        onSnapToItem={(index) => setIndex(index)}
      />

      <View style={styles.containerPagination}>
        <Pagination
          dotsLength={props.data.length}
          activeDotIndex={index}
          containerStyle={styles.paginationContainer}
          dotColor={'#3cbc40'}
          dotStyle={styles.paginationDot}
          inactiveDotColor={'lightgrey'}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.7}
          carouselRef={carouselRef}
        />
      </View>
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

//Carousel props
//loop={true}
//firstItem={renderFirstItem}
//apparitionDelay={2}//estar al loro de esta propiedad
//loop={true}
//enableMomentum={false}
//lockScrollWhileSnapping={true}
//autoplay={true}
//autoplayDelay={3000}
//autoplayInterval={2000}
/*activeAnimationOptions={{
        friction: 8,
        tension: 10
      }}*/

// Pagination props
//tappableDots={!!carouselRef}