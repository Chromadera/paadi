import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows, componentSizes } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Icon } from '../components/Icon';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ── Toggle Switch ──────────────────────────────────────────────────────
// Matches HTML: 48×28 track, 24px handle, 14px radius
// On: fg background, handle at right. Off: border color, handle at left.
const ToggleSwitch: React.FC<{ value: boolean; onToggle: () => void }> = ({ value, onToggle }) => (
  <Pressable
    onPress={onToggle}
    style={[
      toggleStyles.track,
      { backgroundColor: value ? colors.fg : colors.border },
    ]}
  >
    <View
      style={[
        toggleStyles.handle,
        value ? toggleStyles.handleOn : toggleStyles.handleOff,
      ]}
    />
  </Pressable>
);

const toggleStyles = StyleSheet.create({
  track: {
    width: componentSizes.toggleTrack.width,
    height: componentSizes.toggleTrack.height,
    borderRadius: 14,
    justifyContent: 'center',
    flexShrink: 0,
  },
  handle: {
    width: componentSizes.toggleHandle.size,
    height: componentSizes.toggleHandle.size,
    borderRadius: componentSizes.toggleHandle.size / 2,
    backgroundColor: colors.surface,
    position: 'absolute',
    top: 2,
  },
  handleOn: { right: 2 },
  handleOff: { left: 2 },
});

// ── Security Item ──────────────────────────────────────────────────────

interface SecurityItemProps {
  icon: React.ComponentProps<typeof Icon>['name'];
  label: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}

const SecurityItem: React.FC<SecurityItemProps> = ({
  icon,
  label,
  subtitle,
  rightElement,
  onPress,
  isLast,
}) => {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      style={[
        itemStyles.row,
        !isLast && itemStyles.divider,
      ]}
      onPress={onPress}
    >
      <View style={itemStyles.iconBox}>
        <Icon name={icon} size={18} color={colors.muted60} />
      </View>
      <View style={itemStyles.body}>
        <Text style={itemStyles.label}>{label}</Text>
        {subtitle ? <Text style={itemStyles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightElement || (
        onPress ? (
          <Icon name="chevronRight" size={18} color={colors.muted} strokeWidth={2} />
        ) : null
      )}
    </Wrapper>
  );
};

const itemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['4'],
    gap: spacing['3'],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBg,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: {
    flex: 1,
  },
  label: {
    fontSize: typography.sizes['lg-'],
    fontWeight: typography.weights.bold,
    color: colors.settingsText,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.muted,
    marginTop: 2,
  },
  rightValue: {
    fontSize: typography.sizes['base-'],
    fontWeight: typography.weights.bold,
    color: colors.muted,
  },
});

// ── Section Card ───────────────────────────────────────────────────────

const SectionCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={sectionStyles.card}>
    {children}
  </View>
);

const sectionStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.brutSm,
    marginBottom: spacing['4'],
  },
});

// ── Screen ─────────────────────────────────────────────────────────────

export const SecurityScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [faceIdEnabled, setFaceIdEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ScreenHeader title="Security" onBack={() => navigation.goBack()} />

        {/* PIN Section */}
        <SectionCard>
          <SecurityItem
            icon="lock"
            label="Change PIN"
            subtitle="Update your 4-digit PIN"
            onPress={() => navigation.navigate('ChangePIN')}
          />
          <SecurityItem
            icon="arrowRight"
            label="Reset PIN"
            subtitle="Forgot your PIN?"
            onPress={() => navigation.navigate('Relogin')}
            isLast
          />
        </SectionCard>

        {/* Biometrics Section */}
        <SectionCard>
          <SecurityItem
            icon="user"
            label="Face ID"
            rightElement={<ToggleSwitch value={faceIdEnabled} onToggle={() => setFaceIdEnabled(!faceIdEnabled)} />}
          />
          <SecurityItem
            icon="lock"
            label="Auto-Lock"
            isLast
            rightElement={<Text style={itemStyles.rightValue}>5 minutes</Text>}
          />
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    paddingHorizontal: layoutScreenPadding,
    paddingBottom: spacing['8'],
    paddingTop: spacing['0'],
  },
});

const layoutScreenPadding = 20;
