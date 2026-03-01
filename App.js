import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { DataProvider } from './src/contexts/DataContext';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import VerifyEmailScreen from './src/screens/auth/VerifyEmailScreen';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import HealthScreen from './src/screens/HealthScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import MemoriesScreen from './src/screens/MemoriesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import TermsOfServiceScreen from './src/screens/TermsOfServiceScreen';
import TabBar from './src/components/TabBar';
import Colors from './src/theme/colors';

const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="Notifications" component={NotificationsScreen} />
      <ProfileStack.Screen name="Privacy" component={PrivacyScreen} />
      <ProfileStack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <ProfileStack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Health" component={HealthScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Memories" component={MemoriesScreen} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [wasUnverified, setWasUnverified] = useState(false);
  const [isNewSignup, setIsNewSignup] = useState(false);

  // Only show verification screen for brand new signups (not existing accounts logging in)
  const isUnverified = user && !user.emailVerified;

  // Track new signup: user just appeared and is unverified (fresh account)
  if (isUnverified && !wasUnverified) {
    setWasUnverified(true);
    // A new unverified user means they just signed up
    // creationTime ≈ lastSignInTime means first login (new account)
    const created = user.metadata?.creationTime;
    const lastSign = user.metadata?.lastSignInTime;
    if (created && lastSign && created === lastSign) {
      setIsNewSignup(true);
    }
  }
  if (!isUnverified && wasUnverified) {
    setWasUnverified(false);
    setIsNewSignup(false);
    if (user) setShowWelcome(true);
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (loading) {
    return <SplashScreen onFinish={() => {}} />;
  }

  // User just verified — show welcome
  if (showWelcome && user) {
    return <WelcomeScreen onFinish={() => setShowWelcome(false)} />;
  }

  // Only block with verification screen for new signups, not existing accounts
  if (isUnverified && isNewSignup) {
    return <VerifyEmailScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <DataProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </DataProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
