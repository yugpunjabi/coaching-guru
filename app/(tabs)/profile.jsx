import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useContext } from 'react';
import { UserDetailContext } from '../../context/UserDetailContext';
import Colors from '../../constant/Colors.jsx';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const handleLogout = () => {
    setUserDetail(null);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />

      <Text style={styles.name}>{userDetail?.name}</Text>
      <Text style={styles.email}>{userDetail?.email}</Text>

      <View style={styles.optionsContainer}>
        <Option
          icon="add"
          label="Add Course"
          onPress={() => router.push('/addCourse')}
        />
        <Option
          icon="book"
          label="My Course"
          iconSet="FontAwesome5"
          onPress={() => router.push('/home')}
        />
        <Option
          icon="trending-up"
          label="Course Progress"
          onPress={() => router.push('/progress')}
        />
        {/* <Option
          icon="subscriptions"
          label="My Subscription"
          iconSet="MaterialIcons"
          onPress={() => router.push('/subscription')}
        /> */}
        <Option
          icon="log-out-outline"
          label="Logout"
          onPress={handleLogout}
        />
      </View>

      <Text style={styles.watermark}>Developed by Yug Punjabi</Text>
    </View>
  );
}

const Option = ({ icon, label, iconSet = 'Ionicons', onPress }) => {
  const IconComponent =
    iconSet === 'Ionicons'
      ? Ionicons
      : iconSet === 'FontAwesome5'
        ? FontAwesome5
        : MaterialIcons;

  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <IconComponent name={icon} size={20} color={Colors.PRIMARY} />
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: -20,
    fontFamily: 'outfit-bold',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 10,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: -20,
    fontFamily: 'outfit-bold',
  },
  email: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'outfit',
  },
  optionsContainer: {
    gap: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#f6f6f6',
    borderRadius: 12,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'outfit',
  },
  watermark: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 12,
    fontFamily: 'outfit',
    marginTop: 30,
    marginBottom: 10,
  },
});
