export interface Pot {
  id: string;
  title: string;
  targetAmount: number;
  collectedAmount: number;
  endDate: string;
  status: 'open' | 'settled' | 'cancelled';
  memberCount: number;
  paidCount: number;
  avatarIndices: number[];
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  amount: number;
  type: 'credit' | 'debit';
  icon: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  walletBalance: number;
  bankName: string;
  accountNumber: string;
  kycVerified: boolean;
  avatarIndex: number;
}

export type RootStackParamList = {
  PreOnboardingSplash: undefined;
  PreOnboardingPots: undefined;
  PreOnboardingSplit: undefined;
  OnboardingStart: undefined;
  OnboardingWelcome: undefined;
  OnboardingPhone: undefined;
  OnboardingPhoneInput: undefined;
  OnboardingOTP: undefined;
  OnboardingOTPInput: undefined;
  OnboardingName: undefined;
  OnboardingUsername: undefined;
  OnboardingPassword: undefined;
  OnboardingPIN: undefined;
  OnboardingPINInput: undefined;
  OnboardingConfirmPIN: undefined;
  OnboardingBiometrics: undefined;
  Verification: undefined;
  VerificationAlt: undefined;
  VerificationError: undefined;
  Relogin: undefined;
  MainTabs: undefined;
  PotDetails: { potId: string };
  PotDetailsInput: { potId: string };
  PotDetailsEnding: { potId: string };
  CreatePot: undefined;
  PotCreationOther: undefined;
  PotSplit: undefined;
  PotReview: undefined;
  PotAddBankAccount: undefined;
  PotBankPicker: undefined;
  PotAddBankPayout: { potId: string };
  ProfileExtended: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Security: undefined;
  ChangePIN: undefined;
  ChangePINInput: undefined;
  ConfirmNewPIN: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  PotsTab: undefined;
  ActivityTab: undefined;
  ProfileTab: undefined;
};
