import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Colors from '../../../constant/Colors';
import Intro from '../../../components/CourseView/Intro';
import Chapters from '../../../components/CourseView/Chapters';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebaseConfig';

export default function CourseView() {
  const { courseParams, courseId, enroll } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const GetCourseById=async()=>{
    const docRef=await getDoc(doc(db,'Courses',courseId));
    const courseData=docRef.data();
  }

  useEffect(() => {
    const loadCourse = async () => {
      try {
        if (courseParams) {
          setCourse(JSON.parse(courseParams));
        } else if (courseId) {
          const docSnap = await getDoc(doc(db, 'Courses', courseId));
          if (docSnap.exists()) {
            setCourse({ ...docSnap.data(), docId: courseId });
          } else {
            console.error('No such course found');
          }
        }
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseParams, courseId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No course data available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
          <Intro course={course} enroll={enroll} />
          <Chapters course={course} />
        </View>
      }
    />
  );
}
