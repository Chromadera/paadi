import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useCreatePotStore, SplitInput } from "@/features/create-pot/store";
import { theme } from "@/lib/theme";
import { Plus, Trash2 } from "lucide-react-native";

export default function SplitPage() {
  const router = useRouter();
  const store = useCreatePotStore();

  const [title, setTitle] = useState(store.title);
  const [description, setDescription] = useState(store.description);
  const [totalAmountNaira, setTotalAmountNaira] = useState(
    store.totalKobo ? (store.totalKobo / 100).toString() : ""
  );
  const [splitMode, setSplitMode] = useState(store.splitMode);
  const [splits, setSplits] = useState<SplitInput[]>(store.splits);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync back to store on every change
  useEffect(() => {
    store.setField("title", title);
    store.setField("description", description);
    const amountKobo = Math.round((parseFloat(totalAmountNaira) || 0) * 100);
    store.setField("totalKobo", amountKobo);
    store.setField("splitMode", splitMode);
    store.setField("splits", splits);
  }, [title, description, totalAmountNaira, splitMode, splits]);

  function handleAddSplit() {
    if (splits.length >= 50) return;
    setSplits([...splits, { label: `Friend ${splits.length}`, weight: 1 }]);
  }

  function handleRemoveSplit(index: number) {
    if (splits.length <= 2) return;
    const newSplits = [...splits];
    newSplits.splice(index, 1);
    setSplits(newSplits);
  }

  function handleSplitChange(index: number, key: keyof SplitInput, val: any) {
    const newSplits = [...splits];
    newSplits[index] = { ...newSplits[index], [key]: val };
    setSplits(newSplits);
  }

  // Calculate sum for validation
  const totalKobo = Math.round((parseFloat(totalAmountNaira) || 0) * 100);
  let currentSum = 0;
  if (splitMode === "amount") {
    currentSum = splits.reduce((sum, s) => sum + (s.amountKobo || 0), 0);
  } else if (splitMode === "percent") {
    currentSum = splits.reduce((sum, s) => sum + (s.percent || 0), 0);
  }

  function handleNext() {
    setErrorMsg("");

    if (!title.trim() || title.length < 3 || title.length > 120) {
      setErrorMsg("Title must be between 3 and 120 characters.");
      return;
    }
    if (totalKobo <= 0) {
      setErrorMsg("Total collection amount must be greater than N0.");
      return;
    }
    if (splits.some((s) => !s.label.trim())) {
      setErrorMsg("All participants must have a label.");
      return;
    }

    if (splitMode === "amount") {
      const sum = splits.reduce((sum, s) => sum + (s.amountKobo || 0), 0);
      if (sum !== totalKobo) {
        setErrorMsg(
          `The sum of all split amounts (N${(sum / 100).toLocaleString()}) must equal the total pot amount (N${(totalKobo / 100).toLocaleString()}).`
        );
        return;
      }
    } else if (splitMode === "percent") {
      const sum = splits.reduce((sum, s) => sum + (s.percent || 0), 0);
      if (sum !== 100) {
        setErrorMsg(`The sum of all split percentages (${sum}%) must equal exactly 100%.`);
        return;
      }
    }

    router.push("/pots/review");
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pot Details</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>Step 2/3</Text>
        </View>
      </View>

      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* Basic Fields */}
      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Pot Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. December Suya Split"
            placeholderTextColor="rgba(17,24,39,0.3)"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="What is this split collection for?"
            placeholderTextColor="rgba(17,24,39,0.3)"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Total Pot Amount (N)</Text>
          <TextInput
            style={styles.input}
            value={totalAmountNaira}
            onChangeText={setTotalAmountNaira}
            placeholder="50,000"
            placeholderTextColor="rgba(17,24,39,0.3)"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Split Configuration */}
      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Split Formula</Text>
          <View style={styles.splitModeRow}>
            <TouchableOpacity
              style={[
                styles.splitModeButton,
                splitMode === "weight" && styles.splitModeButtonActive,
              ]}
              onPress={() => {
                setSplitMode("weight");
                setSplits(splits.map((s) => ({ label: s.label, weight: 1 })));
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.splitModeText,
                  splitMode === "weight" && styles.splitModeTextActive,
                ]}
              >
                Weight
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.splitModeButton,
                splitMode === "amount" && styles.splitModeButtonActive,
              ]}
              onPress={() => {
                setSplitMode("amount");
                setSplits(splits.map((s) => ({ label: s.label, amountKobo: 0 })));
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.splitModeText,
                  splitMode === "amount" && styles.splitModeTextActive,
                ]}
              >
                Amount
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.splitModeButton,
                splitMode === "percent" && styles.splitModeButtonActive,
              ]}
              onPress={() => {
                setSplitMode("percent");
                setSplits(
                  splits.map((s) => ({
                    label: s.label,
                    percent: Math.round(100 / splits.length),
                  }))
                );
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.splitModeText,
                  splitMode === "percent" && styles.splitModeTextActive,
                ]}
              >
                %
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Participants */}
        <View style={styles.fieldGroup}>
          <View style={styles.participantsHeader}>
            <Text style={styles.label}>
              Participants ({splits.length}/50)
            </Text>
            {splitMode !== "weight" && (
              <Text style={styles.sumText}>
                Sum:{" "}
                {splitMode === "amount"
                  ? `N${(currentSum / 100).toLocaleString()} / N${(totalKobo / 100).toLocaleString()}`
                  : `${currentSum}% / 100%`}
              </Text>
            )}
          </View>

          {splits.map((split, i) => (
            <View key={i} style={styles.splitRow}>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveSplit(i)}
                disabled={splits.length <= 2}
              >
                <Trash2
                  size={16}
                  color={
                    splits.length <= 2
                      ? "rgba(17,24,39,0.15)"
                      : "rgba(17,24,39,0.3)"
                  }
                />
              </TouchableOpacity>

              <TextInput
                style={styles.splitLabelInput}
                value={split.label}
                onChangeText={(text) => handleSplitChange(i, "label", text)}
                placeholder={`e.g. Friend ${i}`}
                placeholderTextColor="rgba(17,24,39,0.3)"
              />

              {splitMode === "weight" && (
                <TextInput
                  style={styles.splitValueInput}
                  value={split.weight?.toString() || ""}
                  onChangeText={(text) =>
                    handleSplitChange(i, "weight", parseFloat(text) || 0)
                  }
                  placeholder="1"
                  placeholderTextColor="rgba(17,24,39,0.3)"
                  keyboardType="numeric"
                />
              )}

              {splitMode === "amount" && (
                <View style={styles.amountInputWrapper}>
                  <Text style={styles.nairaPrefix}>N</Text>
                  <TextInput
                    style={styles.splitValueInputNaira}
                    value={split.amountKobo ? (split.amountKobo / 100).toString() : ""}
                    onChangeText={(text) =>
                      handleSplitChange(
                        i,
                        "amountKobo",
                        Math.round((parseFloat(text) || 0) * 100)
                      )
                    }
                    placeholder="0"
                    placeholderTextColor="rgba(17,24,39,0.3)"
                    keyboardType="numeric"
                  />
                </View>
              )}

              {splitMode === "percent" && (
                <View style={styles.percentInputWrapper}>
                  <TextInput
                    style={styles.splitValuePercent}
                    value={split.percent?.toString() || ""}
                    onChangeText={(text) =>
                      handleSplitChange(i, "percent", parseInt(text) || 0)
                    }
                    placeholder="0"
                    placeholderTextColor="rgba(17,24,39,0.3)"
                    keyboardType="numeric"
                  />
                  <Text style={styles.percentSuffix}>%</Text>
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={styles.addParticipantButton}
            onPress={handleAddSplit}
            activeOpacity={0.7}
          >
            <Plus size={16} color="rgba(17,24,39,0.5)" />
            <Text style={styles.addParticipantText}>Add Participant</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Continue CTA */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={handleNext}
        activeOpacity={0.7}
      >
        <Text style={styles.ctaText}>Continue to Review</Text>
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
  card: {
    marginTop: theme.spacing[5],
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    borderRadius: theme.borderRadius["2xl"],
    padding: theme.spacing[4],
    gap: theme.spacing[4],
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  input: {
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
  textArea: {
    minHeight: 72,
    paddingTop: 12,
  },
  splitModeRow: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(17,24,39,0.04)",
    padding: 4,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },
  splitModeButton: {
    flex: 1,
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.xl - 2,
    justifyContent: "center",
    alignItems: "center",
  },
  splitModeButtonActive: {
    backgroundColor: theme.colors.white,
  },
  splitModeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
  },
  splitModeTextActive: {
    color: theme.colors.ink,
  },
  participantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  sumText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
  },
  splitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  removeButton: {
    padding: 8,
  },
  splitLabelInput: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.1)",
    backgroundColor: theme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.ink,
  },
  splitValueInput: {
    width: 64,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.1)",
    backgroundColor: theme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.ink,
    textAlign: "center",
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: 96,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.1)",
    backgroundColor: theme.colors.white,
  },
  nairaPrefix: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.3)",
    paddingLeft: 10,
  },
  splitValueInputNaira: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 10,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.ink,
    textAlign: "right",
  },
  percentInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: 80,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.1)",
    backgroundColor: theme.colors.white,
  },
  splitValuePercent: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 10,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.ink,
    textAlign: "right",
  },
  percentSuffix: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.3)",
    paddingRight: 10,
  },
  addParticipantButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.1)",
    borderStyle: "dashed",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  addParticipantText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.5)",
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
