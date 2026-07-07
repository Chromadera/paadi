import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useSubmitBvn } from "@/features/kyc/hooks";
import { PaadiApiError } from "@paadi/api-client";
import { theme } from "@/lib/theme";

export default function KycBvnPage() {
  const router = useRouter();
  const submitBvnMutation = useSubmitBvn();
  const [bvn, setBvn] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const isPending = submitBvnMutation.isPending;

  function handleSubmit() {
    setErrorMsg("");

    if (!/^\d{11}$/.test(bvn)) {
      setErrorMsg("BVN must be exactly 11 digits.");
      return;
    }

    submitBvnMutation.mutate(bvn, {
      onSuccess: () => {
        router.push("/verify/selfie");
      },
      onError: (err) => {
        const apiErr = err as PaadiApiError;
        setErrorMsg(
          apiErr.message ??
            "BVN name check failed. Ensure your registered profile name matches the bank records."
        );
      },
    });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{"←"}</Text>
        </TouchableOpacity>
        <Text style={styles.brand}>Paadi</Text>
        <View style={styles.spacer} />
      </View>

      {/* Core */}
      <View style={styles.coreArea}>
        {/* Icon & Title */}
        <View style={styles.titleSection}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>#</Text>
          </View>
          <Text style={styles.title}>Verify BVN</Text>
          <Text style={styles.subtitle}>
            Enter your 11-digit Bank Verification Number. This verifies your
            identity and is not shared with anyone.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {errorMsg && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Bank Verification Number (BVN)
            </Text>
            <TextInput
              style={styles.bvnInput}
              keyboardType="number-pad"
              maxLength={11}
              value={bvn}
              onChangeText={(t) =>
                setBvn(t.replace(/\D/g, "").slice(0, 11))
              }
              editable={!isPending}
              placeholder="22200000000"
              placeholderTextColor="rgba(17,24,39,0.3)"
            />
          </View>

          <TouchableOpacity
            style={[styles.ctaButton, isPending && styles.ctaDisabled]}
            onPress={handleSubmit}
            disabled={isPending}
            activeOpacity={0.7}
          >
            {isPending ? (
              <ActivityIndicator color={theme.colors.ink} />
            ) : (
              <>
                <Text style={styles.ctaText}>Continue</Text>
                <Text style={styles.ctaArrow}>{"➔"}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerBrand}>Secured by Nomba</Text>
        <Text style={styles.footerHint}>
          Dial *565*0# from your registered mobile line to check your BVN.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[8],
    paddingTop: theme.spacing[5],
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  },
  backArrow: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
    padding: theme.spacing[2],
  },
  brand: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  spacer: {
    width: 40,
  },
  coreArea: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: theme.spacing[6],
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "rgba(255,210,0,0.1)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  title: {
    fontSize: 26,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  subtitle: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 18,
  },
  form: {
    gap: theme.spacing[4],
  },
  errorBanner: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    backgroundColor: "rgba(239,68,68,0.1)",
    padding: 12,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    textAlign: "center",
  },
  fieldGroup: {
    gap: 6,
    marginTop: theme.spacing[2],
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  bvnInput: {
    height: 52,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.white,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.ink,
    textAlign: "center",
    letterSpacing: 4,
    borderBottomWidth: 4,
  },
  ctaButton: {
    width: "100%",
    borderRadius: theme.borderRadius["2xl"],
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: theme.spacing[4],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderBottomWidth: 4,
    marginTop: theme.spacing[2],
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
  ctaArrow: {
    fontSize: theme.fontSize.base,
  },
  footer: {
    flexShrink: 0,
    alignItems: "center",
    gap: 8,
    paddingTop: theme.spacing[4],
  },
  footerBrand: {
    fontSize: 9,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.3)",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  footerHint: {
    fontSize: 10,
    color: "rgba(17,24,39,0.4)",
    textAlign: "center",
    paddingHorizontal: theme.spacing[4],
    lineHeight: 16,
  },
});
