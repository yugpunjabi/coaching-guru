import { View, Text, Image, Pressable, Dimensions, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constant/Colors';
import FlipCard from 'react-native-flip-card';
import * as Progress from 'react-native-progress';
import { FlashList } from '@shopify/flash-list';

export default function Flashcards() {
    const { courseParams } = useLocalSearchParams();
    console.log("Raw courseParams:", courseParams);
    const course = JSON.parse(courseParams || "{}");
    console.log("Parsed course:", course);
    const flashcard = course?.flashcards;
    console.log("Extracted flashcard:", flashcard);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const width = Dimensions.get('window').width;

    const GetProgress = () => currentPage / flashcard?.length;

    const onScroll = (event) => {
        const index = Math.round(event?.nativeEvent?.contentOffset?.x / width);
        setCurrentPage(index);
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Background Image */}
            <Image
                source={require('../../assets/images/wave.png')}
                style={{ height: 800, width: '100%', position: 'absolute' }}
            />

            {/* Main Content */}
            <View style={{ padding: 25, width: '100%', flex: 1 }}>
                {/* Header */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={30} color="white" />
                    </Pressable>
                    <Text
                        style={{
                            fontFamily: 'outfit-bold',
                            fontSize: 25,
                            color: Colors.WHITE,
                        }}
                    >
                        {currentPage + 1} of {flashcard?.length}
                    </Text>
                </View>

                {/* Progress Bar */}
                <View style={{ marginTop: 20 }}>
                    <Progress.Bar
                        progress={GetProgress()}
                        width={width * 0.9}
                        color={Colors.WHITE}
                        height={10}
                    />
                </View>

                {/* Flashcard List */}
                <View style={{ marginTop: 60, flex: 1 }}>
                    <FlashList
                        data={flashcard}
                        estimatedItemSize={100}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        keyExtractor={(_,index)=> index.toString()}
                        contentContainerStyle={{width:width *flashcard.length}}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    width,
                                    height: Dimensions.get('window').height * 0.4,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <FlipCard style={styles.flipCard}>
                                    <View style={styles.frontCard}>
                                        <Text style={{ fontFamily: 'outfit-bold', fontSize: 28 }}>
                                            {item?.front}
                                        </Text>
                                    </View>
                                    <View style={styles.backCard}>
                                        <Text
                                            style={{
                                                width: width * 0.78,
                                                fontFamily: 'outfit',
                                                padding: 20,
                                                textAlign: 'center',
                                                fontSize: 28,
                                                color: Colors.WHITE,
                                            }}
                                        >
                                            {item?.back}
                                        </Text>
                                    </View>
                                </FlipCard>
                            </View>
                        )}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flipCard: {
        width: Dimensions.get('window').width * 0.78,
        height: 400,
        backgroundColor: Colors.WHITE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginHorizontal: Dimensions.get('window').width * 0.05,
    },
    frontCard: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        height: '100%',
    },
    backCard: {
        display: 'flex',
        justifyContent: 'center',
        borderRadius: 20,
        alignItems: 'center',
        height: '100%',
        backgroundColor: Colors.PRIMARY,
    },
});
