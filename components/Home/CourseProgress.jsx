import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { imageAssets } from '../../constant/Option';
import Colors from '../../constant/Colors';
import CourseProgressCard from '../Shared/CourseProgressCard';

export default function CourseProgress({ courseList }) {
    return (
        <View style={{ marginTop: 10 }}>
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 25,
                color: Colors.WHITE
            }}>
                Progress
            </Text>

            <FlatList
                data={courseList}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    const totalChapters = item?.chapters?.length || 0;
                    const completedChapters = item?.completedChapter?.length || 0;
                    const progress = totalChapters > 0 ? completedChapters / totalChapters : 0;

                    return (
                        <View key={index}>
                            <CourseProgressCard item={item} index={index} />
                        </View>
                    );
                }}
            />
        </View>
    );
}
