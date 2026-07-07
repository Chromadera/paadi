// Mock React Native modules that our code imports
jest.mock("react-native", () => {
  return {
    Platform: { OS: "ios", select: jest.fn((obj) => obj.ios) },
    StyleSheet: {
      create: (styles) => styles,
      flatten: (style) => style,
      hairlineWidth: 1,
    },
    View: "View",
    Text: "Text",
    TextInput: "TextInput",
    TouchableOpacity: "TouchableOpacity",
    ActivityIndicator: "ActivityIndicator",
    ScrollView: "ScrollView",
    RefreshControl: "RefreshControl",
    Switch: "Switch",
    Modal: "Modal",
    Dimensions: {
      get: jest.fn().mockReturnValue({ width: 390, height: 844 }),
    },
    Linking: {
      openURL: jest.fn().mockResolvedValue(undefined),
      canOpenURL: jest.fn().mockResolvedValue(true),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    Share: {
      share: jest.fn().mockResolvedValue({ action: "sharedAction" }),
    },
    Alert: {
      alert: jest.fn(),
    },
  };
});

// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: jest.fn().mockReturnValue({}),
  usePathname: jest.fn().mockReturnValue("/home"),
  Stack: "Stack",
  Tabs: "Tabs",
}));

// Mock lucide-react-native
jest.mock("lucide-react-native", () => ({
  Clock: "Clock",
  Eye: "Eye",
  EyeOff: "EyeOff",
  Check: "Check",
  X: "X",
  Delete: "Delete",
  Fingerprint: "Fingerprint",
  CheckCircle: "CheckCircle",
  Loader2: "Loader2",
  ArrowLeft: "ArrowLeft",
  Home: "Home",
  Layers: "Layers",
  Activity: "Activity",
  CircleUser: "CircleUser",
  Plus: "Plus",
  Trash2: "Trash2",
  ChevronRight: "ChevronRight",
  ShieldAlert: "ShieldAlert",
  Wallet: "Wallet",
  Landmark: "Landmark",
  ArrowUpRight: "ArrowUpRight",
  ArrowDownLeft: "ArrowDownLeft",
  Settings: "Settings",
  ShieldCheck: "ShieldCheck",
  Lock: "Lock",
  Bell: "Bell",
  User: "User",
  Zap: "Zap",
  Tv: "Tv",
  Calendar: "Calendar",
  Users: "Users",
  Receipt: "Receipt",
  Copy: "Copy",
  CreditCard: "CreditCard",
  ExternalLink: "ExternalLink",
  LogOut: "LogOut",
  UserPlus: "UserPlus",
  Sparkles: "Sparkles",
  Hash: "Hash",
  Camera: "Camera",
  BellRing: "BellRing",
  Smartphone: "Smartphone",
  MessageSquare: "MessageSquare",
  Phone: "Phone",
  UserCheck: "UserCheck",
  ChevronLeft: "ChevronLeft",
  CheckCircle2: "CheckCircle2",
}));

// Mock expo-clipboard
jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn().mockResolvedValue(undefined),
  getStringAsync: jest.fn().mockResolvedValue(""),
}));

// Define __DEV__ globally for react-native imports in test environment
global.__DEV__ = true;
