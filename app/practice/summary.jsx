import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../constant/Colors';
import Button from '../../components/Shared/Button';

export default function QuizSummary() {
  const { quizResultParam } = useLocalSearchParams();
  const quizResult = JSON.parse(quizResultParam);
  const [correctAns, setCorrectAns] = useState(0);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const router = useRouter();

  useEffect(() => {
    CalculateResult();
  }, []);

  const CalculateResult = () => {
    if (quizResult !== undefined) {
      const correctAns_ = Object.entries(quizResult).filter(
        ([key, value]) => value?.isCorrect === true
      );
      const totalQues_ = Object.keys(quizResult).length;

      setCorrectAns(correctAns_.length);
      setTotalQuestion(totalQues_);
    }
  };

  const GetPercMark = () => {
    return ((correctAns / totalQuestion) * 100).toFixed(0);
  };

  return (
    <FlatList
      data={Object.entries(quizResult)}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <View>
          <Image
            source={require('../../assets/images/wave.png')}
            style={{
              width: '100%',
              resizeMode: 'cover',
              height: 200,
            }}
          />

          <View style={{ paddingHorizontal: 20, marginTop: -80 }}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'outfit-bold',
                fontSize: 30,
                color: Colors.WHITE,
              }}
            >
              Quiz Summary
            </Text>

            <View
              style={{
                backgroundColor: Colors.WHITE,
                padding: 20,
                borderRadius: 20,
                marginTop: 20,
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../../assets/images/trophy.png')}
                style={{
                  width: 100,
                  height: 100,
                  marginTop: -60,
                }}
              />
              <Text style={{ fontSize: 26, fontFamily: 'outfit-bold' }}>
                {GetPercMark() > 60 ? 'Congratulations!' : 'Try Again!'}
              </Text>

              <Text
                style={{
                  fontFamily: 'outfit',
                  color: Colors.GRAY,
                  fontSize: 17,
                }}
              >
                You gave {GetPercMark()}% Correct Answer
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  width: '100%',
                }}
              >
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultText}>Q {totalQuestion}</Text>
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultText}>✅ {correctAns}</Text>
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultText}>
                    ❌ {totalQuestion - correctAns}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 20 }}>
              <Button
                text={'Back To Home'}
                onPress={() => router.replace('/(tabs)/home')}
              />
            </View>

            <Text
              style={{
                fontFamily: 'outfit-bold',
                fontSize: 25,
                marginTop: 30,
              }}
            >
              Summary
            </Text>
          </View>
        </View>
      }
      renderItem={({ item }) => {
        const quizItem = item[1];
        return (
          <View
            style={{
              padding: 15,
              borderWidth: 1,
              marginTop: 5,
              marginHorizontal: 20,
              borderRadius: 15,
              backgroundColor:
                quizItem?.isCorrect === true
                  ? Colors.LIGHT_GREEN
                  : Colors.LIGHT_RED,
              borderColor:
                quizItem?.isCorrect === true
                  ? Colors.LIGHT_GREEN
                  : Colors.RED,
            }}
          >
            <Text
              style={{
                fontFamily: 'outfit',
                fontSize: 20,
              }}
            >
              {quizItem.question}
            </Text>
            <Text
              style={{
                fontFamily: 'outfit',
                fontSize: 15,
              }}
            >
              Ans: {quizItem?.correctAns}
            </Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  resultTextContainer: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    elevation: 1,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  resultText: {
    fontFamily: 'outfit',
    fontSize: 20,
  },
});
