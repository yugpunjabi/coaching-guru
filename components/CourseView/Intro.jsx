import { View, Text, Image, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { imageAssets } from '../../constant/Option'
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constant/Colors'
import Button from '../../components/Shared/Button'
import { useRouter } from 'expo-router'
import { UserDetailContext } from '../../context/UserDetailContext'
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function Intro({ course, enroll }) {
    const router = useRouter();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);

    const data = {
        ...course,
        createdBy: userDetail?.email,
        createdOn: new Date(),
        enrolled: true
    }

    const onEnrollCourse = async () => {
        const docId = Date.now().toString();
        setLoading(true)
        await setDoc(doc(db, 'Courses', docId), data)
        setLoading(false);
        router.push({
            pathname: `/courseView/` + docId,
            params: {
                courseParams: JSON.stringify(data),
                enroll: false
            }
        })
    }

    const onStartCourse = () => {
        const firstChapter = course?.chapters?.[0];
        if (!firstChapter) return;

        router.push({
            pathname: '/chapterView',
            params: {
                chapterParams: JSON.stringify({ ...firstChapter, courseData: course }),
                docId: course?.docId,
                chapterIndex: 0
            }
        });
    };

    return (
        <View>
            <Image source={imageAssets[course?.banner_image]}
                style={{
                    width: '100%',
                    height: 280
                }}
            />
            <View style={{
                padding: 20
            }}>
                <Text style={{
                    fontFamily: 'outfit-bold',
                    fontSize: 25,
                }}>{course?.courseTitle}</Text>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 5,
                    alignItems: 'center',
                    marginTop: 5
                }}>
                    <Ionicons name="book-outline" size={24} color="black" />
                    <Text style={{
                        fontFamily: 'outfit',
                        fontSize: 18
                    }}>
                        {course?.chapters?.length} Chapters
                    </Text>
                </View>

                <Text style={{
                    fontFamily: 'outfit-bold',
                    fontSize: 20,
                    marginTop: 10
                }}>Descirption:</Text>

                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 18,
                    color: Colors.GRAY
                }}>{course?.description}</Text>

                {enroll == 'true' ? (
                    <Button
                        text="Enroll Now"
                        loading={loading}
                        onPress={onEnrollCourse}
                    />
                ) : (
                    <Button
                        text={'Start Now'}
                        onPress={onStartCourse}
                    />
                )}
            </View>

            <Pressable style={{
                position: 'absolute',
                top: 40,
                left: 20,
                backgroundColor: Colors.WHITE,
                borderRadius: 20,
                padding: 6,
                zIndex: 10
            }} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="black" />
            </Pressable>
        </View>
    )
}
