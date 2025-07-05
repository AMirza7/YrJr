import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { UserRole, SignupData } from "@/types";
import {
  validateEmail,
  validatePhone,
  validatePassword,
} from "@/constants/auth";
import {
  getRoleColor,
  getRoleIcon,
  ROLE_DESCRIPTIONS,
} from "@/constants/roles";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import TermsCheckbox from "@/components/auth/TermsCheckbox";
import PasswordInput from "@/components/ui/PasswordInput";
import PhoneInput from "@/components/ui/PhoneInput";

export default function SignupScreen() {
  const { theme } = useTheme();
  const { t } = useLocalization();

  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "law_student",
    specialization: [],
    practiceYears: undefined,
    barCouncilNumber: "",
    officeAddress: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const roles: { value: UserRole; label: string; description: string }[] = [
    {
      value: "law_student",
      label: t("lawStudent"),
      description: "Currently studying law or general user",
    },
    {
      value: "law_office_helper",
      label: t("lawOfficeHelper"),
      description: "Administrative support",
    },
    {
      value: "lawyer_assistant",
      label: t("lawyerAssistant"),
      description: "Supporting legal professionals",
    },
    {
      value: "junior_lawyer",
      label: t("juniorLawyer"),
      description: "Early career lawyer",
    },
    {
      value: "lawyer",
      label: t("seniorLawyer"),
      description: "Experienced legal practitioner",
    },
  ];

  const specializations = [
    "Civil Law",
    "Criminal Law",
    "Corporate Law",
    "Family Law",
    "Property Law",
    "Labour Law",
    "Tax Law",
    "Constitutional Law",
    "Environmental Law",
    "Intellectual Property",
    "International Law",
    "Banking Law",
    "Insurance Law",
    "Consumer Protection",
    "Cyber Law",
  ];

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert(t("error"), t("enterName"));
      return false;
    }

    if (!validatePhone(formData.phone)) {
      Alert.alert(t("error"), t("invalidPhone"));
      return false;
    }

    // Email is optional, but if provided, must be valid
    if (formData.email && !validateEmail(formData.email)) {
      Alert.alert(t("error"), t("invalidEmail"));
      return false;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      Alert.alert("Password Error", passwordValidation.errors.join("\n"));
      return false;
    }

    if (formData.password !== confirmPassword) {
      Alert.alert(t("error"), t("passwordsNotMatch"));
      return false;
    }

    // Check terms acceptance
    if (!termsAccepted) {
      setTermsError(true);
      Alert.alert(t("error"), t("acceptTermsRequired"));
      return false;
    }

    setTermsError(false);
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const signupData: SignupData = {
        ...formData,
        specialization:
          selectedSpecializations.length > 0
            ? selectedSpecializations
            : undefined,
      };

      const result = await authService.signup(formData, referralCode);

      if (result.success) {
        // Show referral code applied toast if referral code was provided
        if (referralCode.trim()) {
          Alert.alert(
            "🎉 Success!",
            "Referral code applied! You'll earn rewards when you subscribe.",
          );
        }
        // For lawyers, redirect to profile completion after email verification
        const isLawyer =
          formData.role === "lawyer" || formData.role === "junior_lawyer";

        Alert.alert(
          "🎉 Account Created Successfully!",
          isLawyer
            ? `Welcome ${formData.name}! Your account has been created successfully. Please verify your email and complete your professional profile to get full access.`
            : `Welcome ${formData.name}! Your account has been created successfully. Let's verify your email and phone number to secure your account.`,
          [
            {
              text: "Continue",
              onPress: () =>
                router.push({
                  pathname: "/verify-email",
                  params: {
                    email: formData.email,
                    phone: formData.phone,
                    nextStep: isLawyer ? "profile-completion" : "phone",
                    role: formData.role,
                  },
                }),
            },
          ],
        );
      } else {
        Alert.alert(t("error"), result.message || t("signupFailed"));
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSpecialization = (spec: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec],
    );
  };

  const shouldShowLegalFields =
    formData.role === "lawyer" || formData.role === "junior_lawyer";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/landing");
              }
            }}
          >
            <Text style={styles.backButtonText}>← {t("back")}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the legal community</Text>
        </View>

        <View style={styles.form}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
                autoCapitalize="words"
              />
            </View>

            <PhoneInput
              label={t("phoneNumber") + " *"}
              value={formData.phone}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phone: text }))
              }
              error={
                !validatePhone(formData.phone) && formData.phone.length > 0
              }
              errorMessage={
                formData.phone.length > 0 && !validatePhone(formData.phone)
                  ? t("invalidPhone")
                  : undefined
              }
              placeholder="XXXXX-XXXXX"
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: text.toLowerCase(),
                  }))
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Referral Code (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter referral code"
                value={referralCode}
                onChangeText={setReferralCode}
                autoCapitalize="characters"
                maxLength={20}
              />
              <Text style={styles.inputHint}>
                Have a referral code? Enter it to get special benefits!
              </Text>
            </View>

            <PasswordInput
              label={t("password") + " *"}
              value={formData.password}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, password: text }))
              }
              placeholder="Create a strong password"
            />

            <PasswordInput
              label={t("confirmPassword") + " *"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              error={
                confirmPassword.length > 0 &&
                formData.password !== confirmPassword
              }
              errorMessage={
                confirmPassword.length > 0 &&
                formData.password !== confirmPassword
                  ? t("passwordsNotMatch")
                  : undefined
              }
            />
          </View>

          {/* Role Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Role</Text>
            <Text style={styles.sectionDescription}>
              Select the role that best describes your position in the legal
              field
            </Text>

            {roles.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={[
                  styles.roleOption,
                  formData.role === role.value && styles.roleOptionSelected,
                  {
                    borderColor:
                      formData.role === role.value
                        ? getRoleColor(role.value)
                        : "#e5e7eb",
                  },
                ]}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, role: role.value }))
                }
              >
                <View style={styles.roleContent}>
                  <Text style={styles.roleIcon}>{getRoleIcon(role.value)}</Text>
                  <View style={styles.roleText}>
                    <Text
                      style={[
                        styles.roleLabel,
                        formData.role === role.value && {
                          color: getRoleColor(role.value),
                        },
                      ]}
                    >
                      {role.label}
                    </Text>
                    <Text style={styles.roleDescription}>
                      {role.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Legal Professional Details - Optional for post-signup */}
          {shouldShowLegalFields && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Legal Professional Details (Optional)
              </Text>
              <Text style={styles.sectionDescription}>
                You can complete these details after signup to access advanced
                features
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Years of Practice</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Number of years practicing law"
                  value={formData.practiceYears?.toString() || ""}
                  onChangeText={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      practiceYears: text ? parseInt(text) : undefined,
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Office Address</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter your office/practice address"
                  value={formData.officeAddress}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, officeAddress: text }))
                  }
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          )}

          {/* Specializations */}
          {(shouldShowLegalFields || formData.role === "lawyer_assistant") && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Areas of Specialization</Text>
              <Text style={styles.sectionDescription}>
                Select your areas of legal expertise (optional)
              </Text>

              <View style={styles.specializationsGrid}>
                {specializations.map((spec) => (
                  <TouchableOpacity
                    key={spec}
                    style={[
                      styles.specializationTag,
                      selectedSpecializations.includes(spec) &&
                        styles.specializationTagSelected,
                    ]}
                    onPress={() => toggleSpecialization(spec)}
                  >
                    <Text
                      style={[
                        styles.specializationText,
                        selectedSpecializations.includes(spec) &&
                          styles.specializationTextSelected,
                      ]}
                    >
                      {spec}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Terms and Conditions */}
          <View style={styles.section}>
            <TermsCheckbox
              isChecked={termsAccepted}
              onToggle={setTermsAccepted}
              error={termsError}
            />
          </View>

          <TouchableOpacity
            style={[styles.signupButton, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.signupButtonText}>
              {loading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>
              Already have an account?{" "}
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#1e40af",
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 80,
    textAlignVertical: "top",
  },

  roleOption: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  roleOptionSelected: {
    backgroundColor: "#f8fafc",
    borderWidth: 2,
  },
  roleContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  roleText: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  roleDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  specializationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specializationTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  specializationTagSelected: {
    backgroundColor: "#1e40af",
    borderColor: "#1e40af",
  },
  specializationText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  specializationTextSelected: {
    color: "#fff",
  },
  termsContainer: {
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#1e40af",
  },
  termsText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  termsLink: {
    color: "#1e40af",
    fontWeight: "500",
  },
  signupButton: {
    backgroundColor: "#1e40af",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginPrompt: {
    alignItems: "center",
    marginTop: 20,
  },
  loginPromptText: {
    fontSize: 14,
    color: "#6b7280",
  },
  loginLink: {
    color: "#1e40af",
    fontWeight: "500",
  },
  inputHint: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    fontStyle: "italic",
  },
});
