import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import React, { useState, useContext } from 'react';
import Colors from './../../constant/Colors';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { UserDetailContext } from '../../context/UserDetailContext';

export default function SignUp() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);

  // State variables
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form validation
  const isFormValid = fullName.trim() && email.trim() && password.length >= 6;

  // Create user in Firebase Auth and save to Firestore
  const handleSignUp = async () => {
    setErrorMsg('');

    // Basic checks
    if (!isFormValid) {
      setErrorMsg('Please fill all fields correctly.');
      return;
    }

    try {
      setIsLoading(true);

      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = result.user;

      const userData = {
        name: fullName.trim(),
        email: email.trim(),
        member: false,
        uid: user.uid,
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      setUserDetail(userData);
      router.replace('/'); // Go to home page
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('Email already registered.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg('Invalid email address.');
      } else {
        setErrorMsg('Failed to create account. Try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('./../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Create New Account</Text>

        <TextInput
          placeholder="Full Name"
          style={styles.textInput}
          onChangeText={setFullName}
        />
        <TextInput
          placeholder="Email"
          style={styles.textInput}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          style={styles.textInput}
          onChangeText={setPassword}
          secureTextEntry
        />

        {password !== '' && password.length < 6 && (
          <Text style={styles.helperText}>Password must be at least 6 characters.</Text>
        )}

        {errorMsg !== '' && (
          <Text style={styles.errorText}>{errorMsg}</Text>
        )}

        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          disabled={!isFormValid || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginRedirect}>
          <Text style={{ fontFamily: 'outfit' }}>Already have an account?</Text>
          <Pressable onPress={() => router.push('/auth/signIn')}>
            <Text style={styles.loginLink}>Sign In Here</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  scrollContainer: {
    padding: 25,
    paddingTop: 80,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    fontFamily: 'outfit-bold',
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 15,
    fontFamily: 'outfit',
  },
  helperText: {
    alignSelf: 'flex-start',
    fontSize: 13,
    color: 'gray',
    marginTop: 5,
    fontFamily: 'outfit',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    alignSelf: 'flex-start',
    fontSize: 14,
    fontFamily: 'outfit',
  },
  button: {
    width: '100%',
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'outfit',
  },
  loginRedirect: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 5,
  },
  loginLink: {
    color: Colors.PRIMARY,
    fontFamily: 'outfit-bold',
  },
});
