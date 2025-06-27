import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { styles } from "@/constants/AppStyles";

interface LegalSection {
  number: string;
  title: string;
  description: string;
  punishment?: string;
  cognizable: boolean;
  bailable: boolean;
}

const IPC_SECTIONS: LegalSection[] = [
  {
    number: "302",
    title: "Murder",
    description:
      "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
    punishment: "Death or Life imprisonment + Fine",
    cognizable: true,
    bailable: false,
  },
  {
    number: "378",
    title: "Theft",
    description:
      "Whoever, intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.",
    punishment: "Imprisonment up to 3 years or fine or both",
    cognizable: true,
    bailable: true,
  },
  {
    number: "420",
    title: "Cheating and dishonestly inducing delivery of property",
    description:
      "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
    punishment: "Imprisonment up to 7 years + Fine",
    cognizable: true,
    bailable: false,
  },
];

const BNS_SECTIONS: LegalSection[] = [
  {
    number: "103",
    title: "Murder",
    description:
      "Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.",
    punishment: "Death or Life imprisonment + Fine",
    cognizable: true,
    bailable: false,
  },
  {
    number: "303",
    title: "Theft",
    description:
      "Whoever, intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.",
    punishment: "Imprisonment up to 3 years or fine or both",
    cognizable: true,
    bailable: true,
  },
  {
    number: "318",
    title: "Cheating and dishonestly inducing delivery of property",
    description:
      "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
    punishment: "Imprisonment up to 7 years + Fine",
    cognizable: true,
    bailable: false,
  },
];

export default function SectionComparatorScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComparison, setSelectedComparison] = useState<number | null>(
    null,
  );

  const filteredSections = IPC_SECTIONS.filter(
    (section) =>
      section.number.includes(searchTerm) ||
      section.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getCorrespondingBNS = (ipcIndex: number) => {
    return BNS_SECTIONS[ipcIndex];
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View>
            <Text style={styles.title}>⚖️ Section Comparator</Text>
            <Text style={styles.subtitle}>Compare IPC vs BNS sections</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: "#64748b",
                paddingHorizontal: 12,
                paddingVertical: 8,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { fontSize: 14 }]}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TextInput
          style={styles.input}
          placeholder="Search by section number or title"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {/* Section List */}
        <Text
          style={[
            styles.text,
            {
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 16,
              marginTop: 20,
            },
          ]}
        >
          Available Sections
        </Text>

        {filteredSections.map((section, index) => (
          <TouchableOpacity
            key={section.number}
            style={[
              styles.card,
              selectedComparison === index && {
                borderColor: "#1e40af",
                borderWidth: 2,
              },
            ]}
            onPress={() =>
              setSelectedComparison(selectedComparison === index ? null : index)
            }
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <Text style={[styles.text, { fontWeight: "600", fontSize: 16 }]}>
                Section {section.number} - {section.title}
              </Text>
              <Text style={{ fontSize: 16, color: "#1e40af" }}>
                {selectedComparison === index ? "−" : "+"}
              </Text>
            </View>

            <Text style={[styles.text, { fontSize: 14, marginBottom: 8 }]}>
              {section.description}
            </Text>

            <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
              <View
                style={{
                  backgroundColor: section.cognizable ? "#10b981" : "#ef4444",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{ color: "#ffffff", fontSize: 10, fontWeight: "600" }}
                >
                  {section.cognizable ? "COGNIZABLE" : "NON-COGNIZABLE"}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: section.bailable ? "#10b981" : "#ef4444",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{ color: "#ffffff", fontSize: 10, fontWeight: "600" }}
                >
                  {section.bailable ? "BAILABLE" : "NON-BAILABLE"}
                </Text>
              </View>
            </View>

            {section.punishment && (
              <Text style={[styles.text, { fontSize: 12, color: "#64748b" }]}>
                Punishment: {section.punishment}
              </Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Comparison View */}
        {selectedComparison !== null && (
          <View style={{ marginTop: 20 }}>
            <Text
              style={[
                styles.text,
                { fontSize: 18, fontWeight: "600", marginBottom: 16 },
              ]}
            >
              IPC vs BNS Comparison
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              {/* IPC Section */}
              <View
                style={[styles.card, { flex: 1, backgroundColor: "#fef3c7" }]}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      fontWeight: "600",
                      fontSize: 14,
                      marginBottom: 8,
                      color: "#92400e",
                    },
                  ]}
                >
                  IPC Section {filteredSections[selectedComparison].number}
                </Text>
                <Text style={[styles.text, { fontSize: 14 }]}>
                  {filteredSections[selectedComparison].title}
                </Text>
              </View>

              {/* BNS Section */}
              <View
                style={[styles.card, { flex: 1, backgroundColor: "#dbeafe" }]}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      fontWeight: "600",
                      fontSize: 14,
                      marginBottom: 8,
                      color: "#1e40af",
                    },
                  ]}
                >
                  BNS Section {getCorrespondingBNS(selectedComparison).number}
                </Text>
                <Text style={[styles.text, { fontSize: 14 }]}>
                  {getCorrespondingBNS(selectedComparison).title}
                </Text>
              </View>
            </View>

            <View style={[styles.card, { marginTop: 10 }]}>
              <Text
                style={[styles.text, { fontWeight: "600", marginBottom: 8 }]}
              >
                Key Changes
              </Text>
              <Text style={[styles.text, { fontSize: 14, color: "#64748b" }]}>
                • Section number changed from{" "}
                {filteredSections[selectedComparison].number} to{" "}
                {getCorrespondingBNS(selectedComparison).number}
              </Text>
              <Text style={[styles.text, { fontSize: 14, color: "#64748b" }]}>
                • Definition and punishment remain largely the same
              </Text>
              <Text style={[styles.text, { fontSize: 14, color: "#64748b" }]}>
                • Updated language for clarity
              </Text>
            </View>
          </View>
        )}

        {filteredSections.length === 0 && (
          <View style={styles.card}>
            <Text
              style={[styles.text, { textAlign: "center", color: "#64748b" }]}
            >
              No sections found matching your search
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
