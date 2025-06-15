import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import Colors from '../../constant/Colors';
import Button from '../../components/Shared/Button';
import Prompt from '../../constant/Prompt';
import { getChatModel, getCourseModel, generationConfig } from '../../config/AiModel';
import { db } from '../../config/firebaseConfig';
import { UserDetailContext } from '../../context/UserDetailContext';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import ErrorBoundary from '../../components/ErrorBoundary';

function AddCourseContent() {
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const onTopicSelect = (topic) => {
    const isAlreadyExist = selectedTopics.includes(topic);
    if (!isAlreadyExist) {
      setSelectedTopics(prev => [...prev, topic]);
    } else {
      setSelectedTopics(selectedTopics.filter(item => item !== topic));
    }
  };

  const isTopicSelected = (topic) => selectedTopics.includes(topic);

  const onGenerateCourse = async () => {
    setLoading(true);
  
    if (selectedTopics.length === 0) {
      alert("Please select at least one topic.");
      setLoading(false);
      return;
    }
  
    try {
      const PROMPT = selectedTopics.join(', ') + Prompt.COURSE;
      console.log("🧠 Sending prompt to Gemini:", PROMPT);
  
      const model = await getCourseModel();
      const chat = await model.startChat({ generationConfig, history: [] });
      const aiResp = await chat.sendMessage(PROMPT);
  
      const raw = await aiResp.response.text();
      console.log("📦 Raw AI response:", raw);
  
      // Clean Gemini's response
      const cleaned = raw.replace(/```json|```/g, '').trim();
  
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(cleaned);
      } catch (err) {
        console.error("❌ Failed to parse JSON. Raw:", cleaned);
        alert("Gemini returned invalid course data. Please try again.");
        return;
      }
  
      console.log("✅ Parsed JSON response:", jsonResponse);
  
      const courses = jsonResponse?.courses;
      if (!Array.isArray(courses)) {
        console.error("❌ 'courses' is not an array:", courses);
        alert("Invalid course format. Try again.");
        return;
      }
  
      if (!userDetail?.email) {
        throw new Error("User email is undefined. Cannot create course.");
      }
      const docId = Date.now().toString();
      for (const course of courses) {
        await setDoc(doc(db, 'Courses',docId ), {
          ...course,
          createdOn: new Date(),
          createdBy: userDetail.email,
          docId: docId
        });
      }
  
      console.log("✅ All courses saved to Firestore.");
      alert("Courses generated and saved!");
      router.push('/(tabs)/home');
  
    } catch (err) {
      console.error("❌ Failed to process course:", err.message);
      alert("Something went wrong while generating the course.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const onGenerateTopic = async () => {
    setLoading(true);
    let topicIdea = [];

    try {
      const PROMPT = userInput + Prompt.IDEA;
      const chat = await getChatModel();
      const aiResp = await chat.sendMessage(PROMPT);
      const raw = await aiResp.response.text();

      const cleaned = raw.replace(/```json|```/g, '').trim();

      try {
        topicIdea = JSON.parse(cleaned);
        console.log("✅ Parsed topic idea:", topicIdea);
      } catch (err) {
        console.warn("⚠️ Could not parse JSON. Raw response:", raw);
      }
    } catch (error) {
      console.error("Gemini Error:", error);
    } finally {
      setTopics(Array.isArray(topicIdea) ? topicIdea : []);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create New Course</Text>

      <Text style={styles.subHeading}>What you want to learn today?</Text>

      <Text style={styles.description}>
        Write what course you want to create (Ex. Learn React Js, Digital Marketing Guide, 10th Science Chapter)
      </Text>

      <TextInput
        placeholder='(Ex. Learn Python, Learn 12th Chemistry)'
        placeholderTextColor={Colors.GRAY}
        style={styles.textInput}
        numberOfLines={3}
        multiline={true}
        onChangeText={setUserInput}
        value={userInput}
      />

      <Button text={'Generate Topic'} type='outline' onPress={onGenerateTopic} loading={loading} />

      {topics.length > 0 && (
        <View style={{ marginTop: 15, marginBottom: 15 }}>
          <Text style={styles.topicTitle}>Select all topics which you want to add in the course:</Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
            {topics.map((item, index) => (
              <Pressable key={index} onPress={() => onTopicSelect(item)}>
                <Text style={{
                  padding: 7,
                  borderWidth: 0.4,
                  borderRadius: 99,
                  paddingHorizontal: 15,
                  backgroundColor: isTopicSelected(item) ? Colors.PRIMARY : null,
                  color: isTopicSelected(item) ? Colors.WHITE : Colors.PRIMARY
                }}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          {selectedTopics.length > 0 && (
            <Button text='Generate Course' onPress={onGenerateCourse} loading={loading} />
          )}
        </View>
      )}
    </ScrollView>
  );
}

export default function AddCourse() {
  return (
    <ErrorBoundary>
      <AddCourseContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: Colors.WHITE,
    flex: 1
  },
  heading: {
    fontFamily: 'outfit-bold',
    fontSize: 30
  },
  subHeading: {
    fontFamily: 'outfit',
    fontSize: 30
  },
  description: {
    fontFamily: 'outfit',
    fontSize: 20,
    marginTop: 8,
    color: Colors.GRAY
  },
  textInput: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    height: 100,
    marginTop: 10,
    fontSize: 18,
    color: Colors.GRAY
  },
  topicTitle: {
    fontFamily: 'outfit',
    fontSize: 20,
    marginBottom: 10
  }
});
