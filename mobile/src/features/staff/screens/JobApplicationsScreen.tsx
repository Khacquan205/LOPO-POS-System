import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { useAuthStore } from '../../../store/auth.store';
import {
  getMyJoinRequests,
  type MyJoinRequest,
  type JoinRequestStatus,
} from '../services/jobApplications.service';
import type { MainStackParamList } from '../../../types/navigation';

// ── Helpers ──────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function getStatusLabel(status: JoinRequestStatus): string {
  switch (status) {
    case 'pending':
      return 'Chờ duyệt';
    case 'approved':
      return 'Đã duyệt';
    case 'rejected':
      return 'Đã từ chối';
    default:
      return status;
  }
}

function getStatusColor(status: JoinRequestStatus): string {
  switch (status) {
    case 'pending':
      return colors.linkOrange;
    case 'approved':
      return colors.success;
    case 'rejected':
      return colors.error;
    default:
      return colors.textSecondary;
  }
}

// ── Main component ───────────────────────────────────────────

export const JobApplicationsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [allRequests, setAllRequests] = useState<MyJoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Fetch data on focus
  const fetchData = useCallback(
    async (silent = false) => {
      if (!accessToken) return;
      if (!silent) setIsLoading(true);
      try {
        const data = await getMyJoinRequests(accessToken);
        setAllRequests(data);
      } catch {
        // silently fail – list will stay empty
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [accessToken],
  );

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const handleRefresh = (): void => {
    setIsRefreshing(true);
    fetchData(true);
  };

  // Filter by store name search
  const filteredRequests = allRequests.filter((r) =>
    r.store_name.toLowerCase().includes(searchText.toLowerCase().trim()),
  );

  // Group: pending first, then others
  const pendingRequests = filteredRequests.filter((r) => r.status === 'pending');
  const otherRequests = filteredRequests.filter((r) => r.status !== 'pending');

  // ── Render item ────────────────────────────────────────────
  const renderItem = ({ item }: { item: MyJoinRequest }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.dateText}>{formatDateTime(item.requested_at)}</Text>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          {getStatusLabel(item.status)}
        </Text>
      </View>
      <Text style={styles.storeName}>{item.store_name}</Text>
    </View>
  );

  // ── Section list data ──────────────────────────────────────
  const hasPending = pendingRequests.length > 0;
  const hasOther = otherRequests.length > 0;

  // ── Empty state ────────────────────────────────────────────
  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="briefcase-outline" size={56} color={colors.border} />
        <Text style={styles.emptyText}>Bạn chưa có yêu cầu xin việc nào</Text>
        <Text style={styles.emptySubText}>
          Quét QR cửa hàng để gửi yêu cầu tham gia
        </Text>
      </View>
    );
  };

  return (
    <Screen edges={['bottom']} style={styles.screen}>
      <ScreenHeader title="Danh sách xin việc" />

      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm cửa hàng"
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
          <Ionicons name="search" size={18} color={colors.textSecondary} />
        </View>
      </View>

      {/* Scan QR button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate('ScanQrJob')}
        activeOpacity={0.75}
      >
        <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
        <Text style={styles.scanButtonText}>Quét QR Xin Việc</Text>
      </TouchableOpacity>

      {/* Loading state */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={[]}
          renderItem={null}
          ListHeaderComponent={
            <>
              {/* Pending section */}
              {hasPending && (
                <>
                  <Text style={styles.sectionTitle}>Yêu cầu đang chờ</Text>
                  {pendingRequests.map((item) => (
                    <React.Fragment key={item.request_id}>
                      {renderItem({ item })}
                    </React.Fragment>
                  ))}
                </>
              )}

              {/* Other section */}
              {hasOther && (
                <>
                  <Text style={[styles.sectionTitle, hasPending && styles.sectionTitleSpaced]}>
                    Đã xử lý
                  </Text>
                  {otherRequests.map((item) => (
                    <React.Fragment key={item.request_id}>
                      {renderItem({ item })}
                    </React.Fragment>
                  ))}
                </>
              )}

              {/* Empty */}
              {!hasPending && !hasOther && renderEmpty()}
            </>
          }
          ListEmptyComponent={null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </Screen>
  );
};

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    padding: 0,
  },
  searchWrapper: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 44,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.white,
  },
  scanButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionTitleSpaced: {
    marginTop: spacing.lg,
  },
  card: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: spacing.xs,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  storeName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  emptySubText: {
    fontSize: 13,
    color: colors.textDisabled,
    textAlign: 'center',
  },
});
