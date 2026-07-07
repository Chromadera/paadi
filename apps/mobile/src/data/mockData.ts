import { Pot, ActivityItem, UserProfile, BankAccount } from '../types';

export const pots: Pot[] = [
  {
    id: '1',
    title: 'Dinner at Yellow Chilli',
    targetAmount: 25000,
    collectedAmount: 12000,
    endDate: 'Jul 15',
    status: 'open',
    memberCount: 5,
    paidCount: 3,
    avatarIndices: [2, 3, 4, 5, 6],
  },
  {
    id: '2',
    title: 'IKEDC Electricity — June',
    targetAmount: 30000,
    collectedAmount: 18500,
    endDate: 'Jun 30',
    status: 'open',
    memberCount: 3,
    paidCount: 2,
    avatarIndices: [3, 4, 5],
  },
  {
    id: '3',
    title: 'Data Subscription — May',
    targetAmount: 15000,
    collectedAmount: 15000,
    endDate: 'May 28',
    status: 'settled',
    memberCount: 3,
    paidCount: 3,
    avatarIndices: [6, 7, 8],
  },
];

export const activityItems: ActivityItem[] = [
  { id: '1', title: 'Chidi paid ₦5,000', time: '2 min ago', amount: 5000, type: 'credit', icon: 'send' },
  { id: '2', title: 'Dinner at Yellow Chilli', time: '1 hr ago', amount: -3000, type: 'debit', icon: 'pot' },
  { id: '3', title: 'Auto-save to Wallet', time: 'Yesterday', amount: 2000, type: 'credit', icon: 'wallet' },
  { id: '4', title: 'Withdrawal to Wema', time: 'Jun 24', amount: -15000, type: 'debit', icon: 'bank' },
  { id: '5', title: 'IKEDC Electricity pot', time: 'Jun 22', amount: 10000, type: 'credit', icon: 'pot' },
  { id: '6', title: 'Bonus from referral', time: 'Jun 20', amount: 500, type: 'credit', icon: 'gift' },
];

export const userProfile: UserProfile = {
  name: 'Chidi',
  phone: '+234 801 234 5678',
  email: 'chidi@example.com',
  walletBalance: 45200,
  bankName: 'Wema Bank',
  accountNumber: '90224410',
  kycVerified: false,
  avatarIndex: 1,
};

export const bankAccounts: BankAccount[] = [
  { id: '1', bankName: 'Wema Bank', accountNumber: '90224410', accountName: 'Chidi Obi' },
  { id: '2', bankName: 'GTBank', accountNumber: '01234567', accountName: 'Chidi Obi' },
];

export const avatarSources = [
  require('../../assets/avatars/avatar-1.png'),
  require('../../assets/avatars/avatar-2.png'),
  require('../../assets/avatars/avatar-3.png'),
  require('../../assets/avatars/avatar-4.png'),
  require('../../assets/avatars/avatar-5.png'),
  require('../../assets/avatars/avatar-6.png'),
  require('../../assets/avatars/avatar-7.png'),
  require('../../assets/avatars/avatar-8.png'),
];

export const logoMark = require('../../assets/logos/Logomark.png');
export const illustrationGetStarted = require('../../assets/get.jpg');
export const illustrationOnboarding = require('../../assets/onboardin.jpg');
