import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useCreatePotStore } from "@/features/create-pot/store";
import {
  useElectricityProviders,
  useCableProviders,
  useCablePlans,
  useLookupElectricityCustomer,
  useLookupCableCustomer,
} from "@/features/create-pot/hooks";
import { usePayoutAccounts } from "@/features/settings/payout-hooks";
import { theme } from "@/lib/theme";
import { Zap, Tv, Landmark, ShieldCheck } from "lucide-react-native";

export default function CreatePotPage() {
  const router = useRouter();
  const store = useCreatePotStore();

  const { data: payoutData, isPending: loadingPayouts } = usePayoutAccounts();
  const { data: discos, isPending: loadingDiscos } = useElectricityProviders();
  const { data: cableProviders, isPending: loadingCableProv } = useCableProviders();
  const { data: cablePlans, isPending: loadingCablePlans } = useCablePlans(store.billerProductCode);

  const lookupElectricity = useLookupElectricityCustomer();
  const lookupCable = useLookupCableCustomer();

  const [errorMsg, setErrorMsg] = useState("");

  // Auto-set primary payout account if bank_payout is selected
  useEffect(() => {
    if (store.settlementType === "bank_payout" && payoutData?.accounts) {
      const primary = payoutData.accounts.find((a) => a.isPrimary) || payoutData.accounts[0];
      if (primary) {
        store.setField("payoutAccountId", primary.id);
      }
    }
  }, [store.settlementType, payoutData]);

  const isVerifying = lookupElectricity.isPending || lookupCable.isPending;

  function handleVerifyBiller() {
    setErrorMsg("");
    store.setField("billerCustomerName", undefined);

    if (!store.billerProductCode) {
      setErrorMsg("Please select a provider.");
      return;
    }
    if (!store.billerCustomerId) {
      setErrorMsg("Please enter the customer ID / meter / smartcard number.");
      return;
    }

    if (store.billerCategory === "electricity") {
      if (!store.meterType) {
        setErrorMsg("Please select a meter type.");
        return;
      }
      lookupElectricity.mutate(
        {
          disco: store.billerProductCode,
          customerId: store.billerCustomerId,
          meterType: store.meterType,
        },
        {
          onSuccess: (res) => {
            store.setField("billerCustomerName", res.customerName);
          },
          onError: (err: any) => {
            setErrorMsg(err.message ?? "Meter verification failed. Check the details.");
          },
        }
      );
    } else {
      lookupCable.mutate(
        {
          cableTvType: store.billerProductCode,
          customerId: store.billerCustomerId,
        },
        {
          onSuccess: (res) => {
            store.setField("billerCustomerName", res.customerName);
          },
          onError: (err: any) => {
            setErrorMsg(err.message ?? "Smartcard verification failed. Check the details.");
          },
        }
      );
    }
  }

  function handleNext() {
    setErrorMsg("");

    if (store.settlementType === "bank_payout") {
      if (!store.payoutAccountId) {
        setErrorMsg("Please select or add a payout account.");
        return;
      }
    } else {
      if (!store.billerCategory) {
        setErrorMsg("Please select a bill category.");
        return;
      }
      if (!store.billerProductCode) {
        setErrorMsg("Please select a provider/plan.");
        return;
      }
      if (!store.billerCustomerId) {
        setErrorMsg("Please enter customer ID.");
        return;
      }
      if (!store.billerCustomerName) {
        setErrorMsg("Please verify the biller account before proceeding.");
        return;
      }
    }

    router.push("/pots/split");
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create Pot</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>Step 1/3</Text>
        </View>
      </View>

      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* Settlement Type Picker */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          How will collected funds be settled?
        </Text>
        <View style={styles.pickerRow}>
          <TouchableOpacity
            style={[
              styles.pickerCard,
              store.settlementType === "bill_payment" && styles.pickerCardActive,
            ]}
            onPress={() => {
              store.setField("settlementType", "bill_payment");
              store.setField("billerCategory", "electricity");
            }}
            activeOpacity={0.7}
          >
            <View style={styles.pickerIcon}>
              <Zap size={20} color={theme.colors.ink} />
            </View>
            <Text style={styles.pickerTitle}>Bill Payment</Text>
            <Text style={styles.pickerSubtitle}>
              Pay electricity/cable directly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pickerCard,
              store.settlementType === "bank_payout" && styles.pickerCardActive,
            ]}
            onPress={() => {
              store.setField("settlementType", "bank_payout");
              store.setField("billerCategory", undefined);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.pickerIcon}>
              <Landmark size={20} color={theme.colors.ink} />
            </View>
            <Text style={styles.pickerTitle}>Bank Payout</Text>
            <Text style={styles.pickerSubtitle}>
              Withdraw settled cash to bank
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bank Payout Fields */}
      {store.settlementType === "bank_payout" && (
        <View style={styles.card}>
          {loadingPayouts ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : payoutData?.accounts && payoutData.accounts.length > 0 ? (
            <View>
              <Text style={styles.cardLabel}>Payout Account</Text>
              <View style={styles.payoutList}>
                {payoutData.accounts.map((acc) => (
                  <TouchableOpacity
                    key={acc.id}
                    style={[
                      styles.payoutOption,
                      store.payoutAccountId === acc.id && styles.payoutOptionActive,
                    ]}
                    onPress={() => store.setField("payoutAccountId", acc.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.payoutOptionText,
                        store.payoutAccountId === acc.id && styles.payoutOptionTextActive,
                      ]}
                    >
                      {acc.bankName} - {acc.accountName} (*{acc.accountNumberLast4})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.noPayoutContainer}>
              <Text style={styles.noPayoutText}>No payout accounts found.</Text>
              <TouchableOpacity
                style={styles.noPayoutCta}
                onPress={() => router.push("/settings/payout")}
                activeOpacity={0.7}
              >
                <Text style={styles.noPayoutCtaText}>Add Payout Account</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Bill Payment Fields */}
      {store.settlementType === "bill_payment" && (
        <View style={styles.card}>
          {/* Bill Category Toggle */}
          <View>
            <Text style={styles.cardLabel}>Bill Category</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  store.billerCategory === "electricity" && styles.toggleButtonActive,
                ]}
                onPress={() => {
                  store.setField("billerCategory", "electricity");
                  store.setField("billerProductCode", undefined);
                  store.setField("billerCustomerId", undefined);
                  store.setField("billerCustomerName", undefined);
                  store.setField("meterType", "PREPAID");
                }}
                activeOpacity={0.7}
              >
                <Zap
                  size={14}
                  color={
                    store.billerCategory === "electricity"
                      ? theme.colors.ink
                      : "rgba(17,24,39,0.4)"
                  }
                />
                <Text
                  style={[
                    styles.toggleText,
                    store.billerCategory === "electricity" && styles.toggleTextActive,
                  ]}
                >
                  Electricity
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  store.billerCategory === "cable" && styles.toggleButtonActive,
                ]}
                onPress={() => {
                  store.setField("billerCategory", "cable");
                  store.setField("billerProductCode", undefined);
                  store.setField("billerCustomerId", undefined);
                  store.setField("billerCustomerName", undefined);
                  store.setField("meterType", undefined);
                }}
                activeOpacity={0.7}
              >
                <Tv
                  size={14}
                  color={
                    store.billerCategory === "cable"
                      ? theme.colors.ink
                      : "rgba(17,24,39,0.4)"
                  }
                />
                <Text
                  style={[
                    styles.toggleText,
                    store.billerCategory === "cable" && styles.toggleTextActive,
                  ]}
                >
                  Cable TV
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Provider Select */}
          <View style={styles.fieldGroup}>
            <Text style={styles.cardLabel}>Provider</Text>
            {store.billerCategory === "electricity" ? (
              loadingDiscos ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <View style={styles.providerList}>
                  {(discos ?? []).map((d) => (
                    <TouchableOpacity
                      key={d.code}
                      style={[
                        styles.providerOption,
                        store.billerProductCode === d.code && styles.providerOptionActive,
                      ]}
                      onPress={() => {
                        store.setField("billerProductCode", d.code);
                        store.setField("billerCustomerName", undefined);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.providerOptionText,
                          store.billerProductCode === d.code && styles.providerOptionTextActive,
                        ]}
                      >
                        {d.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )
            ) : loadingCableProv ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <View style={styles.providerList}>
                {(cableProviders ?? []).map((c) => (
                  <TouchableOpacity
                    key={c.code}
                    style={[
                      styles.providerOption,
                      store.billerProductCode === c.code && styles.providerOptionActive,
                    ]}
                    onPress={() => {
                      store.setField("billerProductCode", c.code);
                      store.setField("billerCustomerName", undefined);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.providerOptionText,
                        store.billerProductCode === c.code && styles.providerOptionTextActive,
                      ]}
                    >
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Cable Plans */}
          {store.billerCategory === "cable" && store.billerProductCode && (
            <View style={styles.fieldGroup}>
              <Text style={styles.cardLabel}>Bouquet / Plan</Text>
              {loadingCablePlans ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <View style={styles.providerList}>
                  {(cablePlans ?? []).map((p) => (
                    <TouchableOpacity
                      key={p.code}
                      style={styles.providerOption}
                      onPress={() => {
                        store.setField("totalKobo", p.amountKobo ?? 0);
                        store.setField("description", `Bouquet: ${p.name}`);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.providerOptionText}>
                        {p.name} - ₦{((p.amountKobo ?? 0) / 100).toLocaleString()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Meter Type (Electricity only) */}
          {store.billerCategory === "electricity" && (
            <View style={styles.fieldGroup}>
              <Text style={styles.cardLabel}>Meter Type</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    store.meterType === "PREPAID" && styles.toggleButtonActive,
                  ]}
                  onPress={() => store.setField("meterType", "PREPAID")}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      store.meterType === "PREPAID" && styles.toggleTextActive,
                    ]}
                  >
                    PREPAID
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    store.meterType === "POSTPAID" && styles.toggleButtonActive,
                  ]}
                  onPress={() => store.setField("meterType", "POSTPAID")}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      store.meterType === "POSTPAID" && styles.toggleTextActive,
                    ]}
                  >
                    POSTPAID
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Customer ID Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.cardLabel}>
              {store.billerCategory === "electricity"
                ? "Meter Number"
                : "Smartcard / Decoder Number"}
            </Text>
            <View style={styles.verifyRow}>
              <TextInput
                style={styles.input}
                value={store.billerCustomerId || ""}
                onChangeText={(text) => {
                  store.setField("billerCustomerId", text.replace(/\D/g, ""));
                  store.setField("billerCustomerName", undefined);
                }}
                editable={!isVerifying}
                placeholder={
                  store.billerCategory === "electricity"
                    ? "e.g. 0101234567"
                    : "e.g. 1023456789"
                }
                placeholderTextColor="rgba(17,24,39,0.3)"
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  (!store.billerCustomerId || isVerifying) && styles.verifyButtonDisabled,
                ]}
                onPress={handleVerifyBiller}
                disabled={isVerifying || !store.billerCustomerId}
                activeOpacity={0.7}
              >
                {isVerifying ? (
                  <ActivityIndicator size="small" color={theme.colors.ink} />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Verified Banner */}
          {store.billerCustomerName && (
            <View style={styles.verifiedBanner}>
              <ShieldCheck size={16} color="#047857" />
              <View>
                <Text style={styles.verifiedBannerLabel}>Account Verified</Text>
                <Text style={styles.verifiedBannerName}>
                  {store.billerCustomerName}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Continue CTA */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={handleNext}
        activeOpacity={0.7}
      >
        <Text style={styles.ctaText}>Continue to Splits</Text>
        <Text style={styles.ctaArrow}>{">"}</Text>
      </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing[2],
  },
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  stepBadge: {
    backgroundColor: "rgba(17,24,39,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  stepText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.5)",
  },
  errorBox: {
    marginTop: theme.spacing[4],
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    borderRadius: theme.borderRadius.xl,
    padding: 12,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    textAlign: "center",
  },
  section: {
    marginTop: theme.spacing[5],
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  pickerRow: {
    flexDirection: "row",
    gap: 12,
  },
  pickerCard: {
    flex: 1,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 2,
    borderColor: "rgba(17,24,39,0.06)",
    backgroundColor: theme.colors.white,
    gap: 10,
  },
  pickerCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: "rgba(255,210,0,0.05)",
  },
  pickerIcon: {
    padding: 8,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: "rgba(17,24,39,0.06)",
    alignSelf: "flex-start",
  },
  pickerTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  pickerSubtitle: {
    fontSize: 10,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
  },
  card: {
    marginTop: theme.spacing[5],
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    borderRadius: theme.borderRadius["2xl"],
    padding: theme.spacing[4],
    gap: theme.spacing[4],
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(17,24,39,0.04)",
    padding: 4,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.xl - 2,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.white,
  },
  toggleText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
  },
  toggleTextActive: {
    color: theme.colors.ink,
  },
  fieldGroup: {
    gap: 6,
  },
  input: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: 12,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.ink,
  },
  verifyRow: {
    flexDirection: "row",
    gap: 8,
  },
  verifyButton: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderRadius: theme.borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  verifiedBanner: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: theme.borderRadius.xl,
    padding: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  verifiedBannerLabel: {
    fontSize: 9,
    fontWeight: theme.fontWeight.bold,
    color: "#047857",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  verifiedBannerName: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.extrabold,
    color: "#047857",
  },
  providerList: {
    gap: 6,
  },
  providerOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: "rgba(17,24,39,0.04)",
  },
  providerOptionActive: {
    backgroundColor: "rgba(255,210,0,0.15)",
  },
  providerOptionText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.6)",
  },
  providerOptionTextActive: {
    color: theme.colors.ink,
    fontWeight: theme.fontWeight.bold,
  },
  payoutList: {
    gap: 6,
    marginTop: 6,
  },
  payoutOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: "rgba(17,24,39,0.04)",
  },
  payoutOptionActive: {
    backgroundColor: "rgba(255,210,0,0.15)",
  },
  payoutOptionText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.6)",
  },
  payoutOptionTextActive: {
    color: theme.colors.ink,
    fontWeight: theme.fontWeight.bold,
  },
  noPayoutContainer: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  noPayoutText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
  },
  noPayoutCta: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderRadius: theme.borderRadius.xl,
  },
  noPayoutCtaText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  ctaButton: {
    marginTop: theme.spacing[6],
    width: "100%",
    paddingVertical: 16,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderBottomWidth: 4,
    borderRadius: theme.borderRadius["2xl"],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  ctaText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
  ctaArrow: {
    fontSize: theme.fontSize.base,
  },
});
