import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  useBanks,
  usePayoutAccounts,
  useLookupPayoutAccount,
  useCreatePayoutAccount,
  useSetPrimaryPayoutAccount,
  useDeletePayoutAccount,
} from "@/features/settings/payout-hooks";
import { PaadiApiError } from "@paadi/api-client";
import { theme } from "@/lib/theme";
import { Delete, CheckCircle2 } from "lucide-react-native";

type FlowMode = "list" | "add_account";
type AddStep = "input" | "verify_pin";

export default function PayoutPage() {
  const router = useRouter();

  const [mode, setMode] = useState<FlowMode>("list");
  const [addStep, setAddStep] = useState<AddStep>("input");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState<string[]>([]);
  const maxLength = 4;

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletePin, setDeletePin] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBankPicker, setShowBankPicker] = useState(false);

  const { data: banksData, isLoading: isLoadingBanks } = useBanks();
  const { data: accountsData, isLoading: isLoadingAccounts } =
    usePayoutAccounts();
  const lookupMutation = useLookupPayoutAccount();
  const createMutation = useCreatePayoutAccount();
  const setPrimaryMutation = useSetPrimaryPayoutAccount();
  const deleteMutation = useDeletePayoutAccount();
  const createError = createMutation.error as PaadiApiError | null;
  const deleteError = deleteMutation.error as PaadiApiError | null;

  const selectedBank = banksData?.banks.find((b) => b.code === bankCode);

  // Wipe lookup data when bank or account number changes
  useEffect(() => {
    if (lookupMutation.data || lookupMutation.error) {
      lookupMutation.reset();
    }
    if (addStep === "verify_pin") {
      setAddStep("input");
      setPin([]);
    }
  }, [bankCode, accountNumber]);

  function handlePinPress(num: string) {
    if (showDeleteModal) {
      if (deletePin.length < maxLength) setDeletePin((prev) => [...prev, num]);
    } else {
      if (pin.length < maxLength) setPin((prev) => [...prev, num]);
    }
  }

  function handlePinDelete() {
    if (showDeleteModal) {
      setDeletePin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
  }

  function handleLookup() {
    if (!bankCode || accountNumber.length !== 10) return;
    lookupMutation.mutate({ bankCode, accountNumber });
  }

  function handleCommitCreate() {
    if (pin.length !== maxLength) return;
    createMutation.mutate(
      { bankCode, accountNumber, pin: pin.join("") },
      {
        onSuccess: () => {
          setMode("list");
          setAddStep("input");
          setBankCode("");
          setAccountNumber("");
          setPin([]);
        },
        onError: () => {
          setPin([]);
        },
      }
    );
  }

  function handleCommitDelete() {
    if (!deletingId || deletePin.length !== maxLength) return;
    deleteMutation.mutate(
      { id: deletingId, pin: deletePin.join("") },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          setDeletingId(null);
          setDeletePin([]);
        },
        onError: () => {
          setDeletePin([]);
        },
      }
    );
  }

  // ---- Keypad Component ----
  const PinKeypad = ({ small }: { small?: boolean }) => (
    <View style={small ? styles.keypadSmall : styles.keypad}>
      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
        <TouchableOpacity
          key={num}
          style={small ? styles.keyButtonSmall : styles.keyButton}
          onPress={() => handlePinPress(num)}
        >
          <Text style={small ? styles.keyTextSmall : styles.keyText}>{num}</Text>
        </TouchableOpacity>
      ))}
      <View style={small ? styles.keyButtonSmall : styles.keyButton} />
      <TouchableOpacity
        style={small ? styles.keyButtonSmall : styles.keyButton}
        onPress={() => handlePinPress("0")}
      >
        <Text style={small ? styles.keyTextSmall : styles.keyText}>0</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={small ? styles.keyButtonSmall : styles.keyButton}
        onPress={handlePinDelete}
      >
        <Delete size={small ? 16 : 20} color="rgba(17,24,39,0.4)" />
      </TouchableOpacity>
    </View>
  );

  const PinDots = ({ pinArray, small, fillColor }: { pinArray: string[]; small?: boolean; fillColor?: string }) => (
    <View style={small ? styles.dotsRowSmall : styles.dotsRow}>
      {Array.from({ length: maxLength }).map((_, idx) => (
        <View
          key={idx}
          style={[
            small ? styles.dotSmall : styles.dot,
            pinArray[idx] !== undefined
              ? { backgroundColor: fillColor ?? theme.colors.secondary }
              : styles.dotEmpty,
          ]}
        />
      ))}
    </View>
  );

  // ---- Main Render ----
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (mode === "add_account") {
            if (addStep === "verify_pin") setAddStep("input");
            else setMode("list");
          } else {
            router.back();
          }
        }}
      >
        <Text style={styles.backArrow}>{"←"}</Text>
        <Text style={styles.backLabel}>
          {mode === "list" ? "Payout Accounts" : "Add Account"}
        </Text>
      </TouchableOpacity>

      {/* ---- LIST VIEW ---- */}
      {mode === "list" && (
        <View style={styles.listSection}>
          {isLoadingAccounts ? (
            <View style={styles.centerLoading}>
              <ActivityIndicator size="small" color={theme.colors.secondary} />
              <Text style={styles.loadingText}>Loading accounts...</Text>
            </View>
          ) : accountsData?.accounts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>{""}</Text>
              <Text style={styles.emptyTitle}>No settlement account linked</Text>
              <Text style={styles.emptyDescription}>
                Add where your group payouts settle out instantly into cold cash.
              </Text>
            </View>
          ) : (
            accountsData?.accounts.map((acc) => (
              <View
                key={acc.id}
                style={[
                  styles.accountCard,
                  acc.isPrimary && styles.accountCardPrimary,
                ]}
              >
                <TouchableOpacity
                  style={styles.accountInfo}
                  onPress={() => {
                    if (!acc.isPrimary) {
                      setPrimaryMutation.mutate(acc.id);
                    }
                  }}
                  activeOpacity={acc.isPrimary ? 1 : 0.6}
                >
                  <View style={styles.accountIcon}>
                    <Text>{""}</Text>
                  </View>
                  <View style={styles.accountDetails}>
                    <Text style={styles.accountName}>{acc.accountName}</Text>
                    <Text style={styles.accountBank}>
                      {acc.bankName} {"· ····"}
                      {acc.accountNumberLast4}
                    </Text>
                    {acc.isPrimary && (
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryBadgeText}>PRIMARY PAYOUT</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    setDeletingId(acc.id);
                    setDeletePin([]);
                    setShowDeleteModal(true);
                  }}
                >
                  <Delete size={16} color="rgba(17,24,39,0.3)" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ))
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setMode("add_account")}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonLabel}>Add payout account</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ---- ADD ACCOUNT WIZARD ---- */}
      {mode === "add_account" && (
        <View style={styles.addSection}>
          {addStep === "input" ? (
            <View style={styles.addForm}>
              {/* Bank Picker */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Select Bank</Text>
                <TouchableOpacity
                  style={styles.bankPicker}
                  onPress={() => setShowBankPicker(true)}
                >
                  <Text
                    style={
                      selectedBank
                        ? styles.bankPickerText
                        : styles.bankPickerPlaceholder
                    }
                  >
                    {selectedBank
                      ? selectedBank.name
                      : "Choose partner institution..."}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Account Number */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Account Number</Text>
                <TextInput
                  style={styles.accountInput}
                  keyboardType="number-pad"
                  maxLength={10}
                  value={accountNumber}
                  onChangeText={(t) =>
                    setAccountNumber(t.replace(/[^0-9]/g, ""))
                  }
                  placeholder="0000000000"
                  placeholderTextColor="rgba(17,24,39,0.3)"
                />
              </View>

              {/* Lookup Results */}
              {lookupMutation.isPending && (
                <View style={styles.lookupPending}>
                  <ActivityIndicator size="small" color={theme.colors.secondary} />
                  <Text style={styles.lookupPendingText}>
                    Querying clearing house registry...
                  </Text>
                </View>
              )}

              {lookupMutation.error && (
                <View style={styles.lookupError}>
                  <Text style={styles.lookupErrorText}>
                    Account verification failed. Double-check your numbers.
                  </Text>
                </View>
              )}

              {lookupMutation.data && (
                <View style={styles.lookupSuccess}>
                  <CheckCircle2
                    size={20}
                    color={theme.colors.success}
                    strokeWidth={2.5}
                  />
                  <View style={styles.lookupSuccessContent}>
                    <Text style={styles.lookupSuccessLabel}>
                      Verified Identity Matched
                    </Text>
                    <Text style={styles.lookupSuccessName}>
                      {lookupMutation.data.accountName}
                    </Text>
                  </View>
                </View>
              )}

              {/* Action Button */}
              {!lookupMutation.data ? (
                <TouchableOpacity
                  style={[
                    styles.verifyButton,
                    (!bankCode ||
                      accountNumber.length !== 10 ||
                      lookupMutation.isPending) &&
                      styles.buttonDisabled,
                  ]}
                  disabled={
                    !bankCode ||
                    accountNumber.length !== 10 ||
                    lookupMutation.isPending
                  }
                  onPress={handleLookup}
                >
                  <Text style={styles.verifyButtonText}>Verify Account</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.ctaAddButton}
                  onPress={() => setAddStep("verify_pin")}
                >
                  <Text style={styles.ctaAddText}>
                    Yes, That Is Me {"➔"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            /* PIN Authorization Step */
            <View style={styles.pinAuthContainer}>
              <View style={styles.pinAuthIcon}>
                <Text>{""}</Text>
              </View>
              <Text style={styles.pinAuthTitle}>Authorize Attachment</Text>
              <Text style={styles.pinAuthDescription}>
                Enter your 4-digit security PIN to bind this settlement channel
                permanently to your profile wallet.
              </Text>

              <PinDots pinArray={pin} />

              {createMutation.error && (
                <Text style={styles.pinErrorText}>
                  {createError?.statusCode === 401
                    ? "Incorrect security PIN code. Try again."
                    : "Registration rejected. Please try again."}
                </Text>
              )}

              <PinKeypad />

              <TouchableOpacity
                style={[
                  styles.ctaAddButton,
                  (pin.length !== maxLength || createMutation.isPending) &&
                    styles.buttonDisabled,
                ]}
                disabled={pin.length !== maxLength || createMutation.isPending}
                onPress={handleCommitCreate}
              >
                {createMutation.isPending ? (
                  <ActivityIndicator color={theme.colors.ink} />
                ) : (
                  <Text style={styles.ctaAddText}>Confirm & Add Account</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* ---- DELETE MODAL ---- */}
      <Modal
        visible={showDeleteModal}
        animationType="fade"
        transparent
        onRequestClose={() => {
          setShowDeleteModal(false);
          setDeletingId(null);
          setDeletePin([]);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderIcon}>
                <Delete size={20} color={theme.colors.danger} strokeWidth={2.5} />
              </View>
              <Text style={styles.modalTitle}>Remove payout path?</Text>
            </View>
            <Text style={styles.modalDescription}>
              Enter your 4-digit transaction security PIN to authorize
              decoupling this banking settlement channel destination.
            </Text>

            <PinDots pinArray={deletePin} small fillColor={theme.colors.danger} />

            {deleteMutation.error && (
              <Text style={styles.pinErrorText}>
                {deleteError?.statusCode === 401
                  ? "Invalid PIN code"
                  : "Request failed"}
              </Text>
            )}

            <PinKeypad small />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalDeleteButton,
                  (deletePin.length !== maxLength ||
                    deleteMutation.isPending) &&
                    styles.buttonDisabled,
                ]}
                disabled={
                  deletePin.length !== maxLength || deleteMutation.isPending
                }
                onPress={handleCommitDelete}
              >
                {deleteMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalDeleteText}>Yes, Delete Path</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowDeleteModal(false);
                  setDeletingId(null);
                  setDeletePin([]);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ---- BANK PICKER MODAL ---- */}
      <Modal
        visible={showBankPicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBankPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bankPickerModal}>
            <Text style={styles.bankPickerModalTitle}>Choose your bank</Text>
            <ScrollView
              style={styles.bankList}
              showsVerticalScrollIndicator={false}
            >
              {banksData?.banks.map((bank) => (
                <TouchableOpacity
                  key={bank.code}
                  style={styles.bankItem}
                  onPress={() => {
                    setBankCode(bank.code);
                    setShowBankPicker(false);
                  }}
                >
                  <Text style={styles.bankItemText}>{bank.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.bankPickerCancel}
              onPress={() => setShowBankPicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing[5],
    paddingBottom: theme.spacing[8] + 80,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  backArrow: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
    padding: 4,
  },
  backLabel: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },

  // List
  listSection: {
    marginTop: theme.spacing[6],
    gap: theme.spacing[4],
  },
  centerLoading: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  loadingText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
  },
  emptyState: {
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 2,
    borderColor: "rgba(17,24,39,0.08)",
    borderStyle: "dashed",
    padding: theme.spacing[8],
    alignItems: "center",
    backgroundColor: "rgba(17,24,39,0.02)",
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
  },
  emptyDescription: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
    marginTop: 4,
    textAlign: "center",
    maxWidth: 220,
  },
  accountCard: {
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    backgroundColor: theme.colors.white,
    padding: theme.spacing[4],
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  accountCardPrimary: {
    borderColor: theme.colors.secondary,
    backgroundColor: "rgba(255,45,120,0.03)",
  },
  accountInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: "rgba(17,24,39,0.04)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    textTransform: "uppercase",
  },
  accountBank: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.5)",
    marginTop: 2,
  },
  primaryBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(255,45,120,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,45,120,0.1)",
    alignSelf: "flex-start",
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.secondary,
    letterSpacing: 1,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    marginTop: theme.spacing[6],
    width: "100%",
    borderRadius: theme.borderRadius["2xl"],
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderBottomWidth: 4,
  },
  addButtonLabel: {
    fontWeight: theme.fontWeight.black,
    fontSize: theme.fontSize.sm,
    color: theme.colors.ink,
  },

  // Add Account Form
  addSection: {
    marginTop: theme.spacing[6],
  },
  addForm: {
    gap: theme.spacing[5],
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: "rgba(17,24,39,0.6)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bankPicker: {
    height: 52,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: "rgba(17,24,39,0.06)",
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[4],
    justifyContent: "center",
  },
  bankPickerText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
  },
  bankPickerPlaceholder: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.3)",
  },
  accountInput: {
    height: 52,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: "rgba(17,24,39,0.06)",
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[4],
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    letterSpacing: 4,
  },
  lookupPending: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: theme.spacing[2],
  },
  lookupPendingText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.5)",
  },
  lookupError: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    backgroundColor: "rgba(239,68,68,0.05)",
    padding: 12,
  },
  lookupErrorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
  },
  lookupSuccess: {
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 2,
    borderColor: "rgba(16,185,129,0.3)",
    backgroundColor: "rgba(16,185,129,0.05)",
    padding: theme.spacing[4],
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  lookupSuccessContent: {
    flex: 1,
  },
  lookupSuccessLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.black,
    color: "rgba(16,185,129,0.7)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  lookupSuccessName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    marginTop: 2,
    textTransform: "uppercase",
  },
  verifyButton: {
    marginTop: theme.spacing[2],
    width: "100%",
    borderRadius: theme.borderRadius["2xl"],
    backgroundColor: theme.colors.ink,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderBottomWidth: 4,
  },
  verifyButtonText: {
    fontWeight: theme.fontWeight.black,
    fontSize: theme.fontSize.sm,
    color: theme.colors.white,
  },
  ctaAddButton: {
    marginTop: theme.spacing[2],
    width: "100%",
    borderRadius: theme.borderRadius["2xl"],
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderBottomWidth: 4,
  },
  ctaAddText: {
    fontWeight: theme.fontWeight.black,
    fontSize: theme.fontSize.sm,
    color: theme.colors.ink,
  },
  buttonDisabled: {
    opacity: 0.4,
  },

  // PIN Auth
  pinAuthContainer: {
    alignItems: "center",
  },
  pinAuthIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: "rgba(255,45,120,0.1)",
    borderWidth: 2,
    borderColor: theme.colors.ink,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing[4],
  },
  pinAuthTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  pinAuthDescription: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.5)",
    marginTop: 4,
    textAlign: "center",
    maxWidth: 240,
    marginBottom: theme.spacing[6],
  },
  pinErrorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.danger,
    textAlign: "center",
    marginBottom: theme.spacing[4],
  },

  // Pin Dots
  dotsRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: theme.spacing[8],
  },
  dotsRowSmall: {
    flexDirection: "row",
    gap: 16,
    marginBottom: theme.spacing[6],
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.ink,
  },
  dotSmall: {
    width: 14,
    height: 14,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.ink,
  },
  dotEmpty: {
    backgroundColor: theme.colors.white,
  },

  // Keypad
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: theme.spacing[4],
    width: 280,
    marginBottom: theme.spacing[6],
  },
  keypadSmall: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: theme.spacing[2],
    width: 240,
    marginBottom: theme.spacing[6],
  },
  keyButton: {
    width: 93,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  keyButtonSmall: {
    width: 80,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  keyTextSmall: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.6)",
    justifyContent: "flex-end",
    padding: theme.spacing[5],
  },
  modalCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius["3xl"],
    borderWidth: 2,
    borderColor: theme.colors.ink,
    padding: theme.spacing[6],
    borderBottomWidth: 4,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: theme.spacing[4],
  },
  modalHeaderIcon: {
    padding: 10,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 2,
    borderColor: "rgba(239,68,68,0.2)",
  },
  modalTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  modalDescription: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.7)",
    lineHeight: 18,
    marginBottom: theme.spacing[4],
    textAlign: "center",
  },
  modalActions: {
    width: "100%",
    gap: 12,
  },
  modalDeleteButton: {
    width: "100%",
    borderRadius: theme.borderRadius["2xl"],
    backgroundColor: theme.colors.danger,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderBottomWidth: 4,
  },
  modalDeleteText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.sm,
    color: theme.colors.white,
  },
  modalCancelButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.4)",
  },

  // Bank Picker Modal
  bankPickerModal: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius["3xl"],
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderBottomWidth: 4,
    padding: theme.spacing[4],
    maxHeight: "70%",
  },
  bankPickerModalTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  bankList: {
    maxHeight: 400,
  },
  bankItem: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.xl,
  },
  bankItemText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
  },
  bankPickerCancel: {
    paddingVertical: 10,
    alignItems: "center",
    marginTop: theme.spacing[2],
  },
});
