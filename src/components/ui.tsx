import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import type { ComponentProps, ReactNode } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { Fonts, MAX_CONTENT_WIDTH, Radius, Space, useTheme, type Colors } from '@/theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function haptic(kind: 'light' | 'success' | 'error' = 'light') {
  if (Platform.OS === 'web') return;
  if (kind === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  else
    Haptics.notificationAsync(
      kind === 'success' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
    ).catch(() => {});
}

// ───────────────────────── Text ─────────────────────────

type TextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'bodyStrong' | 'small' | 'caption' | 'label';
type ColorKey = keyof Colors;

const textStyles: Record<TextVariant, TextStyle> = {
  display: { fontFamily: Fonts.display, fontSize: 30, lineHeight: 38 },
  h1: { fontFamily: Fonts.display, fontSize: 24, lineHeight: 31 },
  h2: { fontFamily: Fonts.display, fontSize: 19, lineHeight: 26 },
  h3: { fontFamily: Fonts.bodyExtra, fontSize: 17, lineHeight: 23 },
  body: { fontFamily: Fonts.body, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: Fonts.bodyBold, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: Fonts.body, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: Fonts.bodySemi, fontSize: 12.5, lineHeight: 17 },
  label: { fontFamily: Fonts.bodyBold, fontSize: 12, lineHeight: 16, letterSpacing: 0.8, textTransform: 'uppercase' },
};

export function Txt({
  variant = 'body',
  color = 'text',
  style,
  ...rest
}: TextProps & { variant?: TextVariant; color?: ColorKey }) {
  const { c } = useTheme();
  return <Text style={[textStyles[variant], { color: c[color] }, style]} {...rest} />;
}

// ───────────────────────── Layout ─────────────────────────

export function Screen({
  children,
  scroll = true,
  edges = ['top'],
  contentStyle,
  footer,
}: {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
  footer?: ReactNode;
}) {
  const { c } = useTheme();
  const inner = [styles.content, contentStyle];
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: c.bg }}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={inner}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, styles.centerColumn]}>
          <View style={[inner, { flex: 1 }]}>{children}</View>
        </View>
      )}
      {footer}
    </SafeAreaView>
  );
}

export function Row({ children, gap = Space.sm, style }: { children: ReactNode; gap?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

export function Card({
  children,
  style,
  tone = 'surface',
  onPress,
  accessibilityLabel,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'surface' | 'alt' | 'primary' | 'teal';
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const { c } = useTheme();
  const bg = { surface: c.surface, alt: c.surfaceAlt, primary: c.primary, teal: c.tealSoft }[tone];
  const border = tone === 'surface' ? c.border : 'transparent';
  const base = [styles.card, { backgroundColor: bg, borderColor: border }, style];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        haptic();
        onPress();
      }}
      style={({ pressed }) => [base, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}>
      {children}
    </Pressable>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <Row style={{ justifyContent: 'space-between', marginTop: Space.xl, marginBottom: Space.md }}>
      <Txt variant="h2">{title}</Txt>
      {action}
    </Row>
  );
}

// ───────────────────────── Controls ─────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'teal';

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconRight,
  disabled,
  loading,
  small,
  style,
  accessibilityLabel,
}: {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  loading?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const { c } = useTheme();
  const palette: Record<ButtonVariant, { bg: string; fg: string; border: string }> = {
    primary: { bg: c.primary, fg: c.onPrimary, border: c.primary },
    secondary: { bg: c.surface, fg: c.text, border: c.border },
    ghost: { bg: 'transparent', fg: c.text, border: 'transparent' },
    danger: { bg: c.dangerSoft, fg: c.dangerText, border: c.dangerSoft },
    teal: { bg: c.tealSoft, fg: c.tealText, border: c.tealSoft },
  };
  const p = palette[variant];
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => {
        haptic();
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        { backgroundColor: p.bg, borderColor: p.border },
        pressed && { opacity: 0.85 },
        isDisabled && { opacity: 0.45 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={small ? 16 : 19} color={p.fg} />}
          <Text
            style={[
              { fontFamily: Fonts.bodyExtra, fontSize: small ? 14 : 16, color: p.fg },
              { flexShrink: 1, textAlign: 'center' },
            ]}>
            {title}
          </Text>
          {iconRight && <Ionicons name={iconRight} size={small ? 16 : 19} color={p.fg} />}
        </>
      )}
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  label,
  color,
  size = 22,
}: {
  icon: IconName;
  onPress: () => void;
  label: string;
  color?: string;
  size?: number;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={10}
      onPress={() => {
        haptic();
        onPress();
      }}
      style={({ pressed }) => [styles.iconButton, { backgroundColor: c.surfaceAlt }, pressed && { opacity: 0.7 }]}>
      <Ionicons name={icon} size={size} color={color ?? c.text} />
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? c.text : c.surfaceAlt,
          borderColor: selected ? c.text : c.border,
        },
        pressed && { opacity: 0.8 },
      ]}>
      {icon && <Ionicons name={icon} size={15} color={selected ? c.bg : c.text} />}
      <Text style={{ fontFamily: Fonts.bodyBold, fontSize: 14, color: selected ? c.bg : c.text }}>{label}</Text>
    </Pressable>
  );
}

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'primary' | 'success' | 'danger' | 'teal' }) {
  const { c } = useTheme();
  const map = {
    neutral: [c.surfaceAlt, c.textMuted],
    primary: [c.primarySoft, c.primary],
    success: [c.successSoft, c.successText],
    danger: [c.dangerSoft, c.dangerText],
    teal: [c.tealSoft, c.tealText],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={{ fontFamily: Fonts.bodyBold, fontSize: 12, color: fg }}>{label}</Text>
    </View>
  );
}

/** Kennzeichnung für neue Funktionen, die noch getestet werden. */
export function BetaBadge({ small }: { small?: boolean }) {
  const { c } = useTheme();
  return (
    <View
      accessibilityLabel="Beta-Funktion"
      style={[styles.badge, { backgroundColor: c.text, paddingHorizontal: small ? 6 : 8, alignSelf: 'center' }]}>
      <Text style={{ fontFamily: Fonts.bodyExtra, fontSize: small ? 10 : 11, letterSpacing: 0.8, color: c.bg }}>BETA</Text>
    </View>
  );
}

export function ListRow({
  icon,
  iconTint,
  title,
  subtitle,
  right,
  onPress,
  disabled,
}: {
  icon?: IconName;
  iconTint?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      disabled={!onPress || disabled}
      style={({ pressed }) => [styles.listRow, pressed && { opacity: 0.7 }, disabled && { opacity: 0.5 }]}>
      {icon && (
        <View style={[styles.listIcon, { backgroundColor: c.surfaceAlt }]}>
          <Ionicons name={icon} size={20} color={iconTint ?? c.text} />
        </View>
      )}
      <View style={{ flex: 1, gap: 2 }}>
        <Txt variant="bodyStrong">{title}</Txt>
        {subtitle ? (
          <Txt variant="small" color="textMuted">
            {subtitle}
          </Txt>
        ) : null}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={c.textMuted} /> : null)}
    </Pressable>
  );
}

export function Divider() {
  const { c } = useTheme();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.border, marginVertical: Space.xs }} />;
}

// ───────────────────────── Progress ─────────────────────────

export function ProgressBar({ value, color, height = 8 }: { value: number; color?: string; height?: number }) {
  const { c } = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
      style={{ height, borderRadius: height, backgroundColor: c.surfaceAlt, overflow: 'hidden' }}>
      <View style={{ width: `${pct * 100}%`, height: '100%', borderRadius: height, backgroundColor: color ?? c.primary }} />
    </View>
  );
}

export function ProgressRing({
  value,
  size = 120,
  stroke = 12,
  color,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: ReactNode;
}) {
  const { c } = useTheme();
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={c.surfaceAlt} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color ?? c.primary}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

// ───────────────────────── Dialog ─────────────────────────

/** Plattformübergreifender Bestätigungsdialog (Alert.alert funktioniert im Web nicht). */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Abbrechen',
  destructive,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { c } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={[styles.overlay, { backgroundColor: c.overlay }]} onPress={onCancel}>
        <Pressable style={[styles.dialog, { backgroundColor: c.surface, borderColor: c.border }]} onPress={() => {}}>
          <Txt variant="h2">{title}</Txt>
          {message ? (
            <Txt color="textMuted" style={{ marginTop: Space.sm }}>
              {message}
            </Txt>
          ) : null}
          <View style={{ gap: Space.sm, marginTop: Space.xl }}>
            <Button title={confirmLabel} variant={destructive ? 'danger' : 'primary'} onPress={onConfirm} />
            <Button title={cancelLabel} variant="secondary" onPress={onCancel} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: IconName; title: string; text: string; action?: ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: Space.xxl, gap: Space.sm }}>
      <View style={[styles.emptyIcon, { backgroundColor: c.surfaceAlt }]}>
        <Ionicons name={icon} size={28} color={c.textMuted} />
      </View>
      <Txt variant="h3" style={{ textAlign: 'center' }}>
        {title}
      </Txt>
      <Txt color="textMuted" style={{ textAlign: 'center', maxWidth: 320 }}>
        {text}
      </Txt>
      {action ? <View style={{ marginTop: Space.md }}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  centerColumn: { alignItems: 'center' },
  content: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: Space.lg,
    paddingTop: Space.md,
    paddingBottom: Space.xxl,
  },
  card: { borderRadius: Radius.lg, borderWidth: 1, padding: Space.lg },
  button: {
    minHeight: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
  },
  buttonSmall: { minHeight: 40, paddingHorizontal: Space.lg, borderRadius: Radius.sm + 2 },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.pill, alignSelf: 'flex-start' },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: Space.md, paddingVertical: Space.md },
  listIcon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Space.xl },
  dialog: { width: '100%', maxWidth: 420, borderRadius: Radius.xl, borderWidth: 1, padding: Space.xl },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
});
