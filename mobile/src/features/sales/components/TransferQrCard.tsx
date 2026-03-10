import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../../ui/theme';

// ── Fake QR generator ────────────────────────────────────────
const QR_N = 21;
const QR_CELL = 9; // px per cell → 189px total

function generateMatrix(seed: string): boolean[][] {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = (((h << 5) + h) ^ seed.charCodeAt(i)) & 0x7fffffff;
  }
  const m: boolean[][] = Array.from({ length: QR_N }, () =>
    Array(QR_N).fill(false),
  );

  // Draw finder-pattern corner markers (7×7 each)
  const marker = (ro: number, co: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const outer = r === 0 || r === 6 || c === 0 || c === 6;
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        m[ro + r][co + c] = outer || inner;
      }
    }
  };
  marker(0, 0);   // top-left
  marker(0, 14);  // top-right
  marker(14, 0);  // bottom-left

  // Fill data area with seed-derived pseudo-random bits
  for (let r = 0; r < QR_N; r++) {
    for (let c = 0; c < QR_N; c++) {
      if (r < 8 && c < 8) continue;   // top-left finder
      if (r < 8 && c >= 13) continue; // top-right finder
      if (r >= 13 && c < 8) continue; // bottom-left finder
      h = (((h << 5) + h) ^ (r * QR_N + c)) & 0x7fffffff;
      m[r][c] = (h & 1) === 1;
    }
  }
  return m;
}

// ── Constants ────────────────────────────────────────────────
const TOTAL_SECS = 5 * 60; // 5 minutes

// ── Component ────────────────────────────────────────────────
interface Props {
  transactionCode: string;
  onConfirm: () => void;
  onRefresh: () => void;
}

export const TransferQrCard: React.FC<Props> = ({
  transactionCode,
  onConfirm,
  onRefresh,
}) => {
  const [secsLeft, setSecsLeft] = useState(TOTAL_SECS);
  const expired = secsLeft <= 0;
  const matrix = useMemo(() => generateMatrix(transactionCode), [transactionCode]);

  // Countdown tick
  useEffect(() => {
    if (expired) return;
    const t = setInterval(() => setSecsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [expired]);

  const mm = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');
  const isUrgent = secsLeft > 0 && secsLeft <= 60;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Thông tin chuyển khoản</Text>

      {/* QR visual */}
      <View style={styles.qrWrapper}>
        <View style={[styles.qrFrame, expired && styles.qrFrameDimmed]}>
          {matrix.map((row, r) => (
            <View key={r} style={{ flexDirection: 'row' }}>
              {row.map((filled, c) => (
                <View
                  key={c}
                  style={{
                    width: QR_CELL,
                    height: QR_CELL,
                    backgroundColor: filled ? '#000000' : '#ffffff',
                    opacity: expired ? 0.25 : 1,
                  }}
                />
              ))}
            </View>
          ))}
        </View>

        {/* Expired overlay */}
        {expired && (
          <View style={styles.expiredOverlay}>
            <View style={styles.expiredBadge}>
              <Ionicons name="time-outline" size={20} color="#ffffff" />
              <Text style={styles.expiredLabel}>Hết hạn</Text>
            </View>
          </View>
        )}
      </View>

      {/* Transaction code */}
      <View style={styles.codeRow}>
        <Text style={styles.codeKey}>Mã giao dịch:</Text>
        <Text style={styles.codeVal}>{transactionCode}</Text>
      </View>

      {/* Countdown OR refresh */}
      {!expired ? (
        <View style={styles.countdownRow}>
          <Ionicons
            name="time-outline"
            size={14}
            color={isUrgent ? '#EF4444' : colors.textSecondary}
          />
          <Text style={[styles.countdownText, isUrgent && styles.countdownUrgent]}>
            Còn lại {mm}:{ss}
          </Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh} activeOpacity={0.7}>
          <Ionicons name="refresh-outline" size={16} color={colors.primary} />
          <Text style={styles.refreshText}>Làm mới mã thanh toán</Text>
        </TouchableOpacity>
      )}

      {/* Confirm button */}
      <TouchableOpacity
        style={[styles.confirmBtn, expired && styles.confirmBtnDisabled]}
        onPress={expired ? undefined : onConfirm}
        activeOpacity={expired ? 1 : 0.8}
        disabled={expired}
      >
        <Text style={styles.confirmBtnText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  qrWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  qrFrame: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 8,
    backgroundColor: '#ffffff',
  },
  qrFrameDimmed: {
    opacity: 0.6,
  },
  expiredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239,68,68,0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  expiredLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  codeKey: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  codeVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.md,
  },
  countdownText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  countdownUrgent: {
    color: '#EF4444',
    fontWeight: '700',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  refreshText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.sm + 4,
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  confirmBtnDisabled: {
    backgroundColor: colors.textDisabled,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
