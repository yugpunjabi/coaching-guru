import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../../constant/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function CourseListGrid({ courseList, option }) {
  const router = useRouter();

  const onPress = (course) => {
    router.push({
      pathname: option.path,
      params: {
        courseParams: JSON.stringify(course),
      },
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={courseList}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onPress(item)}
            key={index}
            style={styles.card}
          >
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={Colors.GRAY}
              style={styles.checkIcon}
            />
            {option?.icon && (
              <Image
                source={option.icon}
                style={styles.image}
              />
            )}
            <Text style={styles.titleText}>{item.courseTitle}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ensures it takes up the full screen
    backgroundColor: Colors.BACKGROUND || '#fff',
  },
  listContent: {
    padding: 20,
    paddingBottom: 50, 
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: Colors.WHITE,
    margin: 7,
    borderRadius: 15,
    elevation: 1,
  },
  checkIcon: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  image: {
    width: '100%',
    height: 70,
    resizeMode: 'contain',
  },
  titleText: {
    fontFamily: 'outfit',
    textAlign: 'center',
    marginTop: 7,
  },
});
