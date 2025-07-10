import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from '../../constant/Colors'
import * as Progress from 'react-native-progress';
import { imageAssets } from '../../constant/Option';

export default function CourseProgressCard({ item, width = 280 }) {
  const rawCompleted = item?.completedChapter?.length || 0;
  const totalChapters = item?.chapters?.length || 0;
  const completedChapters = Math.min(rawCompleted, totalChapters);
  const progress = totalChapters > 0 ? completedChapters / totalChapters : 0;

  return (
    <View
      style={{
        margin: 7,
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        width: width,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Image
          source={imageAssets[item?.banner_image]}
          style={{
            width: 80,
            height: 80,
            borderRadius: 8,
          }}
        />

        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: 'outfit-bold',
              fontSize: 19,
              flexWrap: 'wrap',
            }}
          >
            {item?.courseTitle}
          </Text>

          <Text
            style={{
              fontFamily: 'outfit',
              fontSize: 15,
            }}
          >
            {totalChapters} Chapter{totalChapters !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <Progress.Bar progress={progress} width={width - 30} />
        <Text
          style={{
            fontFamily: 'outfit',
            marginTop: 2,
          }}
        >
          {completedChapters} out of {totalChapters} Chapter{totalChapters !== 1 ? 's' : ''} Completed
        </Text>
      </View>
    </View>
  );
}
