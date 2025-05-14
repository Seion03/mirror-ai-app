import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const QuickWorkoutPage = () => {
  const router = useRouter();
  
  const handleSquatPress = () => {
    router.push('./index1');  // ✅ CORRECT - relative path in same directory
  };
  
  const handlePushUpPress = () => {
    router.push('./index1');  // ✅ CORRECT - relative path in same directory
  };
  
  const goBack = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={['#1a2a6c', '#2a3a7c']}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      
        <Text style={styles.header}>CHOOSE YOUR WORKOUT</Text>
        <Text style={styles.subHeader}>Start Your Fitness Journey</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSquatPress}>
            <LinearGradient
              colors={['#FF416C', '#FF4B2B']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>SQUATS</Text>
              <Text style={styles.buttonSubText}>Build Lower Body Strength</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handlePushUpPress}>
            <LinearGradient
              colors={['#4776E6', '#8E54E9']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>PUSH-UPS</Text>
              <Text style={styles.buttonSubText}>Upper Body Power</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subHeader: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 40,
    fontWeight: '500',
    letterSpacing: 1,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  button: {
    width: width * 0.85,
    height: 100,
    marginVertical: 12,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  buttonGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  buttonSubText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default QuickWorkoutPage;