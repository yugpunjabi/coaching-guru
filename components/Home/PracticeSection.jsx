import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { PracticeOption } from '../../constant/Option';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';

export default function PracticeSection({ course }) {
  const router = useRouter();

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontFamily: 'outfit-bold', fontSize: 25 }}>Practice</Text>

      <FlatList
        data={PracticeOption}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/practice' + item.path,
                params: {
                  courseParams: JSON.stringify(course),
                },
              })
            }
            key={index}
            style={{
              flex: 1,
              margin: 5,
              aspectRatio: 1,
            }}
          >
            <Image
              source={item?.image}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: 160,
                borderRadius: 15,
              }}
            />
            <Text
              style={{
                position: 'absolute',
                padding: 15,
                fontFamily: 'outfit',
                fontSize: 15,
                color: Colors.WHITE,
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
