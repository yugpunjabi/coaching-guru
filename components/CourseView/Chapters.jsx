import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Colors from '../../constant/Colors'
import { useRouter } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Chapters({ course }) {
    const router = useRouter();

    const isChapterCompleted = (index) => {
        if (!Array.isArray(course?.completedChapter)) return false;
        return course.completedChapter.includes(index);
    };

    return (
        <View style={{
            padding: 20
        }}>
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 25
            }}>Chapters</Text>

            <FlatList
                data={course?.chapters}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => {
                        router.push({
                            pathname: '/chapterView',
                            params: {
                                chapterParams: JSON.stringify({ ...item, courseData: course }),
                                docId: course?.docId,
                                chapterIndex: index
                            }
                        });

                    }} style={{
                        padding: 18,
                        borderWidth: 0.5,
                        borderRadius: 15,
                        marginTop: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 10
                        }}>
                            <Text style={styles.chapterText}>{index + 1.}</Text>
                            <Text style={styles.chapterText}>{item.chapterName}</Text>
                        </View>
                        {isChapterCompleted(index) ?
                            <AntDesign name="checkcircle" size={24} color={Colors.GREEN} />
                            : <FontAwesome6 name="play" size={24} color={Colors.PRIMARY} />}
                    </TouchableOpacity>
                )} />
        </View>
    )
}

const styles = StyleSheet.create({
    chapterText: {
        fontFamily: 'outfit',
        fontSize: 20
    }
})