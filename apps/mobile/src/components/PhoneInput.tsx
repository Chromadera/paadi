import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, typography, iconSizes, iconStrokeWidths, spacing } from '../theme';
import { Input } from './Input';
import { Icon } from './Icon';

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodePress: () => void;
  onPhoneChange: (text: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  countryCode,
  phoneNumber,
  onCountryCodePress,
  onPhoneChange,
}) => {
  return (
    <View style={styles.row}>
      <Pressable style={styles.countryCode} onPress={onCountryCodePress}>
        <Icon
          name="globe"
          size={iconSizes.xs}
          color={colors.fg}
          strokeWidth={iconStrokeWidths.thin}
        />
        <Text style={styles.countryCodeText}>{countryCode}</Text>
        <Icon
          name="chevronDown"
          size={iconSizes.xs}
          color={colors.chevron}
          strokeWidth={iconStrokeWidths.thin}
        />
      </Pressable>
      <View style={styles.inputWrapper}>
        <Input
          value={phoneNumber}
          onChangeText={onPhoneChange}
          placeholder="Phone number"
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginVertical: spacing['4'],
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['3.5'],
    backgroundColor: colors.segmentedBg,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.base,
  },
  countryCodeText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  inputWrapper: {
    flex: 1,
  },
});
