import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Progress from 'react-native-progress';
import Colors from '../../constant/Colors';
import Button from '../../components/Shared/Button';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function ChapterView() {
    const { chapterParams, docId, chapterIndex } = useLocalSearchParams();
    const chapters = JSON.parse(chapterParams);
    const [currentPage, setCurrentPage] = useState(0);
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    const GetProgress = (currentPage) => {
        return currentPage / chapters?.content?.length;
    }

    const onChapterComplete = async () => {
        setLoader(true);
        await updateDoc(doc(db, 'Courses', docId), {
            completedChapter: arrayUnion(Number(chapterIndex))
        });
        setLoader(false);
        router.replace(`/courseView/${docId}`);
    };


    const totalPages = chapters?.content?.length || 0;

    // Clamp the currentPage to a valid range
    const currentContent = currentPage < totalPages ? chapters.content[currentPage] : null;

    const isContentEmpty = !chapters?.content || chapters.content.length === 0;

    return (
        <View style={styles.container}>
            <Progress.Bar
                progress={GetProgress(currentPage)}
                width={Dimensions.get('window').width * 0.9}
                color={Colors.PRIMARY}
                unfilledColor={Colors.BG_GRAY}
                borderColor={Colors.BG_GRAY}
                height={10}
                style={styles.progressBar}
            />

            <View style={styles.contentContainer}>
                {isContentEmpty ? (
                    <>
                        <Text style={styles.noDataText}>No data available</Text>
                    </>
                ) : currentContent ? (
                    <>
                        <Text style={styles.topicText}>{currentContent.topic}</Text>

                        <Text style={styles.explainText}>{currentContent.explain}</Text>

                        {currentContent.code?.trim() && (
                            <Text style={[styles.codeExampleText, { backgroundColor: Colors.BLACK, color: Colors.WHITE }]}>
                                {currentContent.code}
                            </Text>
                        )}

                        {currentContent.example?.trim() && (
                            <Text style={styles.codeExampleText}>
                                {currentContent.example}
                            </Text>
                        )}
                    </>
                ) : (
                    <Text style={styles.noDataText}>No data available</Text>
                )}
            </View>

            <View style={styles.buttonContainer}>
                {currentPage < totalPages - 1 ? (
                    <Button
                        text={'Next'}
                        onPress={() => setCurrentPage(currentPage + 1)}
                    />
                ) : (
                    <Button
                        text={'Finish'}
                        onPress={onChapterComplete}
                        loading={loader}
                    />
                )}
            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        backgroundColor: Colors.WHITE,
        flex: 1
    },
    progressBar: {
        alignSelf: 'center',
        marginVertical: 10
    },
    contentContainer: {
        marginTop: 20
    },
    topicText: {
        fontFamily: 'outfit-bold',
        fontSize: 25
    },
    explainText: {
        fontFamily: 'outfit',
        fontSize: 20,
        marginTop: 7
    },
    codeExampleText: {
        padding: 15,
        backgroundColor: Colors.BG_GRAY,
        fontFamily: 'outfit',
        borderRadius: 15,
        fontSize: 18,
        marginTop: 15
    },
    codeBlock: {
        backgroundColor: Colors.BLACK,
        color: Colors.WHITE
    },
    noDataText: {
        fontFamily: 'outfit',
        fontSize: 20,
        color: 'red'
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 15,
        width: '100%',
        left: 25
    }
});
