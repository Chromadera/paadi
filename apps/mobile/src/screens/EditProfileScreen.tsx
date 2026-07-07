import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, componentSizes } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { Icon } from '../components/Icon';
import { useMe } from '@/features/settings/profile-hooks';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { data: me } = useMe();
  const displayName = me?.profile?.displayName ?? `${me?.profile?.firstName ?? ''} ${me?.profile?.lastName ?? ''}`.trim();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ScreenHeader title="Edit Profile" onBack={() => navigation.goBack()} />

        {/* Avatar Section — centered, 72px with brut shadow, edit overlay button */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Avatar
              index={1}
              size={componentSizes.avatar.lg}
            />
            <Pressable style={styles.editAvatarBtn}>
              <Icon name="edit" size={14} color={colors.surface} />
            </Pressable>
          </View>
        </View>

        {/* Form — card-label style labels (10px extrabold uppercase) + inputs */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            value={displayName}
            containerStyle={styles.fieldSpacing}
          />
          <Input
            label="Username"
            value="@chidi_okonkwo"
            containerStyle={styles.fieldSpacing}
          />
          <Input
            label="Email"
            value={me?.email ?? ''}
            keyboardType="email-address"
            containerStyle={styles.fieldSpacing}
          />
          <View style={styles.fieldSpacing}>
            <Text style={styles.fieldLabel}>Phone</Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+234</Text>
              </View>
              <View style={styles.phoneInputFlex}>
                <Input value="801 234 5678" keyboardType="phone-pad" />
              </View>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.actions}>
          <Button title="Save Changes" onPress={() => navigation.goBack()} />
        </View>
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
  },

  // ── Avatar ──────────────────────────────────────────────────────────
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing['4'],
  },
  avatarWrap: {
    position: 'relative',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    backgroundColor: colors.fg,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },

  // ── Form ────────────────────────────────────────────────────────────
  form: {
    paddingTop: spacing['1'],
  },
  fieldLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    color: colors.muted,
    marginBottom: spacing['1'],
  },
  fieldSpacing: {
    marginBottom: spacing['4'],
  },

  // ── Phone Input ─────────────────────────────────────────────────────
  phoneRow: {
    flexDirection: 'row',
    gap: spacing['2'],
  },
  countryCode: {
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['3.5'],
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.base,
    backgroundColor: colors.segmentedBg,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  phoneInputFlex: {
    flex: 1,
  },

  // ── Actions ─────────────────────────────────────────────────────────
  actions: {
    marginTop: spacing['4'],
  },
});

const layoutScreenPadding = 20;
