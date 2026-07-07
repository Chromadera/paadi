import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../types';
import { BottomNav } from '../components/BottomNav';
import type { TabName } from '../components/BottomNav';

import {
  PreOnboardingSplashScreen,
  PreOnboardingPotsScreen,
  PreOnboardingSplitScreen,
  OnboardingStartScreen,
  OnboardingWelcomeScreen,
  OnboardingPhoneScreen,
  OnboardingPhoneInputScreen,
  OnboardingOTPScreen,
  OnboardingOTPInputScreen,
  OnboardingNameScreen,
  OnboardingUsernameScreen,
  OnboardingPasswordScreen,
  OnboardingPINScreen,
  OnboardingPINInputScreen,
  OnboardingConfirmPINScreen,
  OnboardingBiometricsScreen,
  VerificationScreen,
  VerificationAltScreen,
  VerificationErrorScreen,
  ReloginScreen,
  HomeScreen,
  PotsScreen,
  PotsEmptyScreen,
  ActivityScreen,
  ActivityEmptyScreen,
  ProfileScreen,
  ProfileExtendedScreen,
  PotDetailsScreen,
  PotDetailsInputScreen,
  PotDetailsEndingScreen,
  CreatePotScreen,
  PotCreationOtherScreen,
  PotSplitScreen,
  PotReviewScreen,
  PotAddBankAccountScreen,
  PotBankPickerScreen,
  PotAddBankPayoutScreen,
  EditProfileScreen,
  SettingsScreen,
  SecurityScreen,
  ChangePINScreen,
  ChangePINInputScreen,
  ConfirmNewPINScreen,
  NotificationsScreen,
} from '../screens';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabParamList>();

const routeToTab: Record<string, TabName> = {
  HomeTab: 'home',
  PotsTab: 'pots',
  ActivityTab: 'activity',
  ProfileTab: 'profile',
};

const tabToRoute: Record<TabName, string> = {
  home: 'HomeTab',
  pots: 'PotsTab',
  activity: 'ActivityTab',
  profile: 'ProfileTab',
};

function TabBar({ state, navigation }: BottomTabBarProps) {
  const activeTab = routeToTab[state.routeNames[state.index]] ?? 'home';

  return (
    <BottomNav
      activeTab={activeTab}
      onTabPress={(tab) => navigation.navigate(tabToRoute[tab])}
      onCenterPress={() => {
        // Navigate to CreatePot via parent (root stack) navigator
        navigation.getParent()?.navigate('CreatePot');
      }}
    />
  );
}

function TabNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <MainTabs.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <TabBar {...props} />}
        initialRouteName="HomeTab"
      >
        <MainTabs.Screen name="HomeTab" component={HomeScreen} />
        <MainTabs.Screen name="PotsTab" component={PotsScreen} />
        <MainTabs.Screen name="ActivityTab" component={ActivityScreen} />
        <MainTabs.Screen name="ProfileTab" component={ProfileScreen} />
      </MainTabs.Navigator>
    </View>
  );
}

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
        initialRouteName="PreOnboardingSplash"
      >
        {/* ── Pre-Onboarding flow ── */}
        <RootStack.Screen name="PreOnboardingSplash" component={PreOnboardingSplashScreen} />
        <RootStack.Screen name="PreOnboardingPots" component={PreOnboardingPotsScreen} />
        <RootStack.Screen name="PreOnboardingSplit" component={PreOnboardingSplitScreen} />

        {/* ── Onboarding flow ── */}
        <RootStack.Screen name="OnboardingStart" component={OnboardingStartScreen} />
        <RootStack.Screen name="OnboardingWelcome" component={OnboardingWelcomeScreen} />
        <RootStack.Screen name="OnboardingPhone" component={OnboardingPhoneScreen} />
        <RootStack.Screen name="OnboardingPhoneInput" component={OnboardingPhoneInputScreen} />
        <RootStack.Screen name="OnboardingOTP" component={OnboardingOTPScreen} />
        <RootStack.Screen name="OnboardingOTPInput" component={OnboardingOTPInputScreen} />
        <RootStack.Screen name="OnboardingName" component={OnboardingNameScreen} />
        <RootStack.Screen name="OnboardingUsername" component={OnboardingUsernameScreen} />
        <RootStack.Screen name="OnboardingPassword" component={OnboardingPasswordScreen} />
        <RootStack.Screen name="OnboardingPIN" component={OnboardingPINScreen} />
        <RootStack.Screen name="OnboardingPINInput" component={OnboardingPINInputScreen} />
        <RootStack.Screen name="OnboardingConfirmPIN" component={OnboardingConfirmPINScreen} />
        <RootStack.Screen name="OnboardingBiometrics" component={OnboardingBiometricsScreen} />

        {/* ── Auth / Verification ── */}
        <RootStack.Group screenOptions={{ presentation: 'modal', animation: 'fade_from_bottom' }}>
          <RootStack.Screen name="Verification" component={VerificationScreen} />
          <RootStack.Screen name="VerificationAlt" component={VerificationAltScreen} />
          <RootStack.Screen name="VerificationError" component={VerificationErrorScreen} />
          <RootStack.Screen name="Relogin" component={ReloginScreen} />
        </RootStack.Group>

        {/* ── Main app (tabs) ── */}
        <RootStack.Screen name="MainTabs" component={TabNavigator} />

        {/* ── Pot detail flow ── */}
        <RootStack.Screen name="PotDetails" component={PotDetailsScreen} />
        <RootStack.Screen name="PotDetailsInput" component={PotDetailsInputScreen} />
        <RootStack.Screen name="PotDetailsEnding" component={PotDetailsEndingScreen} />
        <RootStack.Screen name="CreatePot" component={CreatePotScreen} />
        <RootStack.Screen name="PotCreationOther" component={PotCreationOtherScreen} />
        <RootStack.Screen name="PotSplit" component={PotSplitScreen} />
        <RootStack.Screen name="PotReview" component={PotReviewScreen} />
        <RootStack.Screen name="PotAddBankAccount" component={PotAddBankAccountScreen} />
        <RootStack.Screen name="PotBankPicker" component={PotBankPickerScreen} />
        <RootStack.Screen name="PotAddBankPayout" component={PotAddBankPayoutScreen} />

        {/* ── Profile / Settings ── */}
        <RootStack.Screen name="ProfileExtended" component={ProfileExtendedScreen} />
        <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
        <RootStack.Screen name="Settings" component={SettingsScreen} />
        <RootStack.Screen name="Security" component={SecurityScreen} />
        <RootStack.Screen name="ChangePIN" component={ChangePINScreen} />
        <RootStack.Screen name="ChangePINInput" component={ChangePINInputScreen} />
        <RootStack.Screen name="ConfirmNewPIN" component={ConfirmNewPINScreen} />
        <RootStack.Screen name="Notifications" component={NotificationsScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
