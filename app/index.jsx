import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Colors from '../constant/Colors';
import { useRouter } from "expo-router";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './../config/firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";

export default function Index() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const result = await getDoc(doc(db, 'users', user.email));
          const data = result.data();

          if (data) {
            setUserDetail({ ...data, email: user.email });
            router.replace('/(tabs)/home');
          } else {
            console.warn("⚠️ No user data found in Firestore.");
          }
        } catch (error) {
          console.error("❌ Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <Image
        source={require('./../assets/images/landing.png')}
        style={{
          width: '100%',
          height: 300,
          marginTop: 70
        }}
      />

      <View style={{
        padding: 25,
        backgroundColor: Colors.PRIMARY,
        height: '100%',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35
      }}>
        <Text style={styles.title}>Welcome to Coaching Guru</Text>
        <Text style={styles.subtitle}>
          Transform your ideas into engaging education content, effortlessly with AI!📚💻
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/signUp')}>
          <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/auth/signIn')}
          style={[styles.button, {
            backgroundColor: Colors.PRIMARY,
            borderWidth: 1,
            borderColor: Colors.WHITE
          }]}>
          <Text style={[styles.buttonText, { color: Colors.WHITE }]}>Already have an Account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'outfit'
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: Colors.WHITE,
    fontFamily: 'outfit-bold'
  },
  subtitle: {
    fontSize: 20,
    color: Colors.WHITE,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'outfit'
  }
});
