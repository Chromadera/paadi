// ═══════════════════════════════════════════════════════════════════════
// Paadi Mobile Design System — React Native Theme
// Neubrutalist-deco, yellow/black
// Every value sourced from design-html/css/paadi-mobile.css
// ═══════════════════════════════════════════════════════════════════════

// ── Colors ───────────────────────────────────────────────────────────
export const colors = {
  // Backgrounds
  bg: '#FFFDF5',
  surface: '#FFFFFF',
  pageBg: '#e8e5df',

  // Foreground
  fg: '#111827',
  muted: 'rgba(17,24,39,0.4)',
  muted60: 'rgba(17,24,39,0.6)',
  settingsText: 'rgba(17,24,39,0.8)',
  placeholder: 'rgba(17,24,39,0.25)',
  stepPillText: 'rgba(17,24,39,0.5)',

  // Borders
  border: 'rgba(17,24,39,0.06)',
  borderSubtle: 'rgba(17,24,39,0.10)',

  // Brand
  accent: '#FFD200',
  accentSoft: 'rgba(255,210,0,0.15)',
  accentGlow: 'rgba(255,210,0,0.5)',

  // Semantic
  danger: '#EF4444',
  logoutText: '#DC2626',
  success: '#10B981',
  successDark: '#16a34a',
  successBg: '#ECFDF5',
  successBorder: '#A7F3D0',
  warning: '#F59E0B',
  warningDark: '#92400E',
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',
  verifiedText: '#047857',
  pink: '#F472B6',
  pinkSoft: 'rgba(244,114,182,0.05)',
  pinkBorder: 'rgba(244,114,182,0.1)',

  // Navigation
  navActive: '#ca8a04',
  navInactive: 'rgba(17,24,39,0.35)',
  navBg: 'rgba(255,255,255,0.88)',

  // Surfaces / utility backgrounds
  surfaceBg: '#f1f5f9',          // progress track, activity icon bg, dividers
  surfaceBgAlt: '#f8fafc',       // pot card divider
  segmentedBg: 'rgba(17,24,39,0.04)',
  stepPillBg: 'rgba(17,24,39,0.05)',
  settlementIconBg: 'rgba(17,24,39,0.06)',
  actionSheetHandle: 'rgba(17,24,39,0.15)',

  // Chevrons
  chevron: 'rgba(17,24,39,0.25)',
  chevronMuted: 'rgba(17,24,39,0.3)',

  // Badge backgrounds
  badgeOpenBg: 'rgba(16,185,129,0.1)',
  badgeOpenBorder: 'rgba(16,185,129,0.2)',
  badgeSettledBg: 'rgba(16,185,129,0.08)',

  // Misc
  overlay: 'rgba(0,0,0,0.3)',
  deviceFrameBorder: '#1a1a1a',
  walletIconStroke: 'rgba(17,24,39,0.6)',
  calendarIconStroke: 'rgba(17,24,39,0.4)',
  kycArrow: 'rgba(146,64,14,0.6)',
} as const;

// ── Border Radius ────────────────────────────────────────────────────
export const radius = {
  xs: 4,        // badges, active dots
  sm: 10,       // segmented, toggle, nav items, settings icons
  base: 12,     // inputs, option items, icon circles, banners
  md: 16,       // buttons, cards, bottom nav, quick actions
  lg: 24,       // balance card, pot cards, illustrations, action sheet
  full: 999,    // progress bars, pills
} as const;

// ── Spacing Scale (4px base) ─────────────────────────────────────────
export const spacing = {
  px: 1,
  '0': 0,
  '0.5': 2,
  '1': 4,
  '1.5': 6,
  '2': 8,
  '2.5': 10,
  '3': 12,
  '3.5': 14,
  '4': 16,
  '4.5': 18,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
} as const;

// ── Typography ───────────────────────────────────────────────────────
export const typography = {
  sizes: {
    '2xs': 9,     // badges
    xs: 10,       // card labels, quick actions, pot meta, activity time
    'sm-': 11,    // segmented buttons
    sm: 12,       // body emphasis, step pills, status bar
    'base-': 13,  // settings items
    base: 14,     // body, pot titles, buttons, inputs
    'lg-': 15,    // pot amounts
    lg: 18,       // subsection headers
    xl: 20,       // section titles, brand name
    '2xl-': 22,   // onboarding h2
    '2xl': 24,    // screen headers, amounts
    '3xl': 26,    // onboarding titles
    '4xl-': 28,   // avatar text
    '4xl': 36,    // balance hero
    '5xl': 40,
  },
  weights: {
    normal: '400' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
  lineHeights: {
    tight: 1.0 as const,    // display amounts
    snug: 1.2 as const,     // headings
    normal: 1.45 as const,  // body (matches CSS body { line-height: 1.45 })
    relaxed: 1.6 as const,
  },
  letterSpacing: {
    tight: -0.5,     // large amounts (24px+)
    heading: -0.3,   // h1/h2 titles
    normal: 0,       // body
    wide: 1,         // uppercase labels
    wider: 2,        // balance label
  },
} as const;

// ── Shadow Presets ───────────────────────────────────────────────────
export const shadows = {
  // Hard brutalist (solid offset, no blur)
  brut: {
    shadowColor: colors.fg,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  brutMd: {
    shadowColor: colors.fg,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  brutSm: {
    shadowColor: colors.fg,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },

  // Button shadows
  btnRest: {
    shadowColor: colors.fg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  btnActive: {
    shadowColor: colors.fg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  btnSmRest: {
    shadowColor: colors.fg,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  btnSmActive: {
    shadowColor: colors.fg,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },

  // Soft elevation (with blur)
  card: {
    shadowColor: 'rgba(0,0,0,0.02)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 4,
  },
  segmentedActive: {
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  nav: {
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 12,
  },
  glow: {
    shadowColor: colors.accentGlow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 16,
  },
} as const;

// ── Animation Tokens ─────────────────────────────────────────────────
export const animation = {
  fast: {
    duration: 120,
    easing: 'ease' as const,
  },
  sheet: {
    duration: 200,
    // cubic-bezier(0.23, 1, 0.32, 1) — use easing function in Animated.timing
  },
  progress: {
    duration: 300,
    easing: 'ease' as const,
  },
} as const;

// ── Icon Tokens ──────────────────────────────────────────────────────
export const iconSizes = {
  xs: 12,    // calendar, bank, country dropdown
  sm: 16,    // wallet, shield, verified check, chevrons
  md: 18,    // quick actions, brand mark
  lg: 20,    // button icons, settlement cards
  xl: 22,    // bottom nav tabs
  '2xl': 24, // center FAB
} as const;

export const iconStrokeWidths = {
  thin: 2,       // inactive nav, chevrons
  normal: 2.25,  // wallet icon
  thick: 2.5,    // active nav, quick actions, calendar
  heavy: 3,      // center FAB, brand mark plus
} as const;

export const iconContainers = {
  quickAction: { size: 40, radius: radius.base },     // 40×40, 12px
  activity: { size: 36, radius: radius.base },         // 36×36, 12px
  settlement: { size: 36, radius: radius.base },       // 36×36, 12px
  settings: { size: 36, radius: radius.sm },            // 36×36, 10px
  brandMark: { size: 32, radius: radius.base },         // 32×32, 12px
  logo: { size: 44, radius: 14 },                       // 44×44, 14px
  fab: { size: 48, radius: radius.md },                 // 48×48, 16px
} as const;

// ── Component Size Tokens ────────────────────────────────────────────
export const componentSizes = {
  touchMin: 44,
  avatar: {
    sm: 26,
    md: 48,
    lg: 72,
    xl: 80,
  },
  bottomNav: {
    height: 56,
    bottomOffset: 20,
    horizontalMargin: 16,
    centerFabSize: 48,
    centerFabOverlap: 24,
  },
  progressBar: {
    height: 10,
  },
  toggleTrack: {
    width: 48,
    height: 28,
  },
  toggleHandle: {
    size: 24,
  },
  pinKey: {
    height: 64,
    radius: 16,
  },
} as const;

// ── Layout Constants ─────────────────────────────────────────────────
export const layout = {
  screenPadding: 20,
  bottomNavHeight: 56,
  statusBarHeight: 44,   // iOS with Dynamic Island
  androidStatusBar: 24,  // Android plain status bar
  homeIndicatorHeight: 34,
  maxContentWidth: 412,
  minScreenHeight: 860,
  deviceWidth: {
    android: 412,
    ios: 390,
  },
} as const;

// ── Legacy Shadow Helpers (kept for backward compatibility) ──────────
export const neoShadow = (offset = 2, color = colors.fg) => ({
  shadowColor: color,
  shadowOffset: { width: offset, height: offset },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: offset * 2,
});

export const neoShadowPressed = (offset = 1, color = colors.fg) => ({
  shadowColor: color,
  shadowOffset: { width: offset, height: offset },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: offset * 2,
});
