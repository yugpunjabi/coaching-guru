import { View, Text, Image, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constant/Colors';
import * as Progress from 'react-native-progress';
import Button from '../../components/Shared/Button';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import Summary from './summary';

export default function Quiz() {
  const { courseParams } = useLocalSearchParams();
  const router = useRouter();

  if (!courseParams) return <Text>Course not found.</Text>;

  const course = JSON.parse(courseParams);
  const quiz = course?.quiz;

  const [selectedOption, setSelectedOption] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);

  const GetProgress = () => currentPage / quiz?.length;

  const onOptionSelect = (selectedChoice) => {
    setResult((prev) => ({
      ...prev,
      [currentPage]: {
        userChoice: selectedChoice,
        isCorrect: quiz[currentPage]?.correctAns === selectedChoice,
        question: quiz[currentPage]?.question,
        correctAns: quiz[currentPage]?.correctAns,
      },
    }));
  };

  const onQuizFinish = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'Courses', course.docId), {
        quizResult: result,
      });
      setLoading(false);
      router.replace({
        pathname: '/practice/summary',
        params: {
          quizResultParam: JSON.stringify(result)
        }
      }); 
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <View>
      <Image
        source={require('../../assets/images/wave.png')}
        style={{ height: 800, width: '100%' }}
      />
      <View style={{ position: 'absolute', padding: 25, width: '100%' }}>
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
          <Text style={{ fontFamily: 'outfit-bold', fontSize: 25, color: Colors.WHITE }}>
            {currentPage + 1} of {quiz.length}
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Progress.Bar
            progress={GetProgress()}
            width={Dimensions.get('window').width * 0.9}
            color={Colors.WHITE}
            height={10}
          />
        </View>

        <View
          style={{
            padding: 25,
            backgroundColor: Colors.WHITE,
            marginTop: 30,
            height: Dimensions.get('screen').height * 0.65,
            elevation: 1,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 25, fontFamily: 'outfit-bold', textAlign: 'center' }}>
            {quiz[currentPage].question}
          </Text>

          {quiz[currentPage]?.options.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedOption(index);
                onOptionSelect(item);
              }}
              key={index}
              style={{
                padding: 20,
                borderWidth: 1,
                borderRadius: 15,
                marginTop: 8,
                backgroundColor: selectedOption == index ? Colors.LIGHT_GREEN : null,
                borderColor: selectedOption == index ? Colors.GREEN : null,
              }}
            >
              <Text style={{ fontFamily: 'outfit', fontSize: 20 }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedOption !== undefined &&
          (quiz.length - 1 > currentPage ? (
            <Button
              text={'Next'}
              onPress={() => {
                setCurrentPage(currentPage + 1);
                setSelectedOption(null);
              }}
            />
          ) : (
            <Button text="Finish" loading={loading} onPress={onQuizFinish} />
          ))}
      </View>
    </View>
  );
}
