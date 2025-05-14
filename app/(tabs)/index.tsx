import { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../scripts/firebase';

const { width, height } = Dimensions.get('window');

const Dashboard = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
    signOut(auth).then(() => {
      // After successful logout, redirect to explore page
      router.replace('/(auth)/explore');
    }).catch(error => {
      console.error('Error signing out:', error);
    });
  };

  const handleQuickWorkout = () => {
    router.push('/(workouts)/quick-workout' as any);
  };

  return (
    <LinearGradient
      colors={['#1a2a6c', '#2a3a7c']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header Title */}
        <Text style={styles.headerTitle}></Text>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#ffffff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.profileIcon}>
            <Ionicons name="person-circle-outline" size={30} color="#ffffff" />
          </View>
          <Text style={styles.welcomeText}>Welcome back!</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            {/* Quick Workout */}
            <TouchableOpacity
              style={styles.workoutOption}
              onPress={handleQuickWorkout}
            >
              <LinearGradient
                colors={['#FF416C', '#FF4B2B']}
                style={styles.gradientOption}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="flash" size={24} color="#ffffff" />
                </View>
                <Text style={styles.optionTitle}>Quick Workout</Text>
                <Text style={styles.optionDescription}>
                  Start an instant personalized workout session
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Collaborative Workout */}
            <TouchableOpacity
              style={styles.workoutOption}
              onPress={() => router.push('/room')}
            >
              <LinearGradient
                colors={['#4776E6', '#8E54E9']}
                style={styles.gradientOption}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="people" size={24} color="#ffffff" />
                </View>
                <Text style={styles.optionTitle}>Collaborative Workout</Text>
                <Text style={styles.optionDescription}>
                  Train together with friends or join community workouts
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#ffffff',
    marginLeft: 5,
    fontSize: 12,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 40,
  },
  profileIcon: {
    marginRight: 15,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: '700',
    color: '#ffffff',
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  workoutOption: {
    marginBottom: 20,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientOption: {
    padding: 20,
    minHeight: 100,
  },
  iconContainer: {
    marginBottom: 10,
  },
  optionTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
  },
  optionDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
  },
});

export default Dashboard;