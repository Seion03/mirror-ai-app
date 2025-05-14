import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { auth, db } from '../../scripts/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { useUser } from '../../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogin = async () => {
    console.log('Logging in with:', email, password);

    if (!email || !password) {
      Alert.alert('Error', 'Both fields are required');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const userQuery = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        Alert.alert('Error', 'No user found with this email in the database.');
        return;
      }

      const userData = querySnapshot.docs[0].data();
      setUser({ email: userData.email, name: userData.name });
      Alert.alert('Success', 'Logged in successfully!');
      console.log('User logged in:', email);
      router.replace('/(tabs)'); // Use replace instead of push
    } catch (error) {
      Alert.alert('Login Error', (error as any).message);
      console.error(error);
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <Text style={styles.title}>Login to Mirror AI</Text>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="#4A00E0" style={styles.icon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#4A00E0" style={styles.icon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <LinearGradient
            colors={['#4A00E0', '#8E2DE2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  formContainer: {
    width: '70%',
    maxWidth: 500,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 25,
    paddingVertical: 12,
    width: '100%',
    elevation: 3,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
  button: {
    width: '50%',
    height: 45,
    borderRadius: 15,
    marginTop: 20,
    overflow: 'hidden',
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: 20,
  },
  signupText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginPage;