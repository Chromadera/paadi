import React from 'react';
import * as LucideIcons from 'lucide-react-native';
import { colors } from '../theme';

export type IconName =
  | 'home' | 'grid' | 'activity' | 'user' | 'plus' | 'send' | 'request'
  | 'bills' | 'airtime' | 'chevronRight' | 'chevronLeft' | 'chevronDown'
  | 'calendar' | 'bank' | 'shield' | 'check' | 'bell' | 'settings'
  | 'logout' | 'edit' | 'lock' | 'eye' | 'eyeOff' | 'arrowRight'
  | 'wallet' | 'gift' | 'pot' | 'phone' | 'mail' | 'camera' | 'search'
  | 'close' | 'info' | 'warning' | 'success' | 'google' | 'apple'
  | 'delete' | 'globe';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

type LucideIcon = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

const iconMap: Record<IconName, LucideIcon> = {
  home: LucideIcons.House,
  grid: LucideIcons.LayoutGrid,
  activity: LucideIcons.Activity,
  user: LucideIcons.User,
  plus: LucideIcons.Plus,
  send: LucideIcons.SendHorizonal,
  request: LucideIcons.ArrowDownToLine,
  bills: LucideIcons.Zap,
  airtime: LucideIcons.Smartphone,
  chevronRight: LucideIcons.ChevronRight,
  chevronLeft: LucideIcons.ChevronLeft,
  chevronDown: LucideIcons.ChevronDown,
  calendar: LucideIcons.Calendar,
  bank: LucideIcons.Building2,
  shield: LucideIcons.Shield,
  check: LucideIcons.Check,
  bell: LucideIcons.Bell,
  settings: LucideIcons.Settings,
  logout: LucideIcons.LogOut,
  edit: LucideIcons.Pencil,
  lock: LucideIcons.Lock,
  eye: LucideIcons.Eye,
  eyeOff: LucideIcons.EyeOff,
  arrowRight: LucideIcons.ArrowRight,
  wallet: LucideIcons.Wallet,
  gift: LucideIcons.Gift,
  pot: LucideIcons.CircleDollarSign,
  phone: LucideIcons.Phone,
  mail: LucideIcons.Mail,
  camera: LucideIcons.Camera,
  search: LucideIcons.Search,
  close: LucideIcons.X,
  info: LucideIcons.Info,
  warning: LucideIcons.TriangleAlert,
  success: LucideIcons.CircleCheck,
  // Brand logos — lucide doesn't have these; rendered as text initials
  google: LucideIcons.Chrome,
  apple: LucideIcons.Apple,
  delete: LucideIcons.Delete,
  globe: LucideIcons.Globe,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = colors.fg,
  strokeWidth = 2,
}) => {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} color={color} strokeWidth={strokeWidth} />;
};
