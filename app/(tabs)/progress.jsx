import { View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '../../context/UserDetailContext';
import CourseProgressCard from '../../components/Shared/CourseProgressCard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';

export default function Progress() {
  const { userDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (userDetail) GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    setCourseList([]);
    const q = query(collection(db, 'Courses'), where('createdBy', '==', userDetail?.email));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      data.docId = docSnap.id;
      setCourseList((prev) => [...prev, data]);
    });
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require('../../assets/images/wave.png')}
        style={{ position: 'absolute', width: '100%', height: 700 }}
      />

      <View style={{ flex: 1, padding: 20, paddingTop: 40 }}>
        <Text
          style={{
            fontFamily: 'outfit-bold',
            fontSize: 30,
            color: Colors.WHITE,
            marginBottom: 10,
          }}
        >
          Course Progress
        </Text>

        <FlatList
          data={courseList}
          showsVerticalScrollIndicator={false}
          onRefresh={GetCourseList}
          refreshing={loading}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item,index }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/courseView/${item?.docId}`,
                  params: {
                    courseParams: JSON.stringify(item),
                  },
                })
              }
              style={{ marginBottom: 15 }}
            >
              <CourseProgressCard item={item} index={index} width={windowWidth - 40} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
