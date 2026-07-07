import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors, radius, shadows } from '../theme';
import { avatarSources } from '../data/mockData';

interface AvatarProps {
  index: number;
  size?: number;
  showBorder?: boolean;
  style?: any;
}

export const Avatar: React.FC<AvatarProps> = ({
  index,
  size = 72,
  showBorder = true,
  style,
}) => {
  const source = avatarSources[index % avatarSources.length];
  const isSmall = size <= 30;

  return (
    <Image
      source={source}
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: showBorder ? 2 : 0,
          borderColor: isSmall ? colors.surface : colors.fg,
        },
        size >= 40 && shadows.brutMd,
        style,
      ]}
    />
  );
};

interface AvatarStackProps {
  indices: number[];
  size?: number;
  overlap?: number;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({
  indices,
  size = 26,
  overlap = 10,
}) => {
  return (
    <View style={styles.stack}>
      {indices.map((index, i) => (
        <View
          key={index}
          style={[
            styles.stackItem,
            { marginLeft: i > 0 ? -overlap : 0, zIndex: i },
          ]}
        >
          <Avatar index={index} size={size} showBorder />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.accent,
  },
  stack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackItem: {
    borderRadius: radius.full,
  },
});
