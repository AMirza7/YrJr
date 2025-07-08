import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import BackButton from "@/components/navigation/BackButton";
import { useModal } from "@/contexts/ModalContext";
import CaseFolderManager, {
  CaseFolder,
} from "@/components/legal/CaseFolderManager";

export default function CaseFoldersScreen() {
  const [folders, setFolders] = useState<CaseFolder[]>([
    {
      id: "folder1",
      title: "State vs. John Doe - Theft Case",
      caseType: "Criminal",
      courtName: "Sessions Court, Delhi",
      opponentParty: "State of Delhi",
      filingDate: new Date("2024-01-15"),
      status: "Active",
      priority: "High",
      documents: [
        {
          id: "doc1",
          name: "FIR Copy",
          type: "scan",
          createdAt: new Date("2024-01-15"),
          size: "2.1 MB",
        },
        {
          id: "doc2",
          name: "Bail Application Draft",
          type: "draft",
          createdAt: new Date("2024-01-20"),
          size: "156 KB",
        },
        {
          id: "doc3",
          name: "Client Meeting Notes",
          type: "note",
          createdAt: new Date("2024-01-18"),
          size: "45 KB",
        },
      ],
      timeline: [
        {
          id: "event1",
          title: "FIR Filed",
          date: new Date("2024-01-15"),
          type: "fir",
        },
        {
          id: "event2",
          title: "Arrest Made",
          date: new Date("2024-01-18"),
          type: "arrest",
        },
        {
          id: "event3",
          title: "Bail Application Filed",
          date: new Date("2024-01-22"),
          type: "bail",
        },
      ],
      linkedUsers: [
        {
          id: "user1",
          name: "Advocate Sharma",
          role: "Lawyer",
          email: "sharma@legal.com",
        },
        {
          id: "user2",
          name: "John Doe",
          role: "Client",
          email: "john.doe@email.com",
        },
        {
          id: "user3",
          name: "Legal Assistant",
          role: "Assistant",
          email: "assistant@legal.com",
        },
      ],
      notes: [
        {
          id: "note1",
          content:
            "Client meeting scheduled for next week to discuss bail conditions",
          createdAt: new Date("2024-01-20"),
          createdBy: "Advocate Sharma",
        },
        {
          id: "note2",
          content: "Need to gather character witnesses for bail application",
          createdAt: new Date("2024-01-21"),
          createdBy: "Legal Assistant",
        },
      ],
      tags: ["theft", "bail", "criminal", "urgent"],
    },
    {
      id: "folder2",
      title: "Property Dispute - Ram vs Shyam",
      caseType: "Property",
      courtName: "District Court, Gurgaon",
      opponentParty: "Shyam Kumar",
      filingDate: new Date("2024-01-10"),
      status: "Pending",
      priority: "Medium",
      documents: [
        {
          id: "doc4",
          name: "Sale Deed",
          type: "scan",
          createdAt: new Date("2024-01-10"),
          size: "3.2 MB",
        },
        {
          id: "doc5",
          name: "Property Documents",
          type: "attachment",
          createdAt: new Date("2024-01-12"),
          size: "5.8 MB",
        },
      ],
      timeline: [
        {
          id: "event4",
          title: "Dispute Initiated",
          date: new Date("2024-01-05"),
          type: "custom",
        },
        {
          id: "event5",
          title: "Notice Sent",
          date: new Date("2024-01-10"),
          type: "custom",
        },
      ],
      linkedUsers: [
        {
          id: "user4",
          name: "Advocate Verma",
          role: "Lawyer",
          email: "verma@legal.com",
        },
        {
          id: "user5",
          name: "Ram Singh",
          role: "Client",
          email: "ram.singh@email.com",
        },
      ],
      notes: [
        {
          id: "note3",
          content: "Need to verify property registration documents",
          createdAt: new Date("2024-01-12"),
          createdBy: "Advocate Verma",
        },
      ],
      tags: ["property", "dispute", "sale deed"],
    },
  ]);

  const handleCreateFolder = (folder: Omit<CaseFolder, "id">) => {
    const newFolder: CaseFolder = {
      ...folder,
      id: Date.now().toString(),
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  const handleUpdateFolder = (
    folderId: string,
    updates: Partial<CaseFolder>,
  ) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, ...updates } : folder,
      ),
    );
  };

  const { showConfirm, showSuccess } = useModal();

  const handleDeleteFolder = (folderId: string) => {
    showConfirm(
      "Delete Folder",
      "Are you sure you want to delete this case folder? This action cannot be undone.",
      () => {
        setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
        showSuccess("Case folder deleted successfully");
      },
      "destructive",
    );
  };

  const handleAddDocument = (
    folderId: string,
    document: CaseFolder["documents"][0],
  ) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? { ...folder, documents: [...folder.documents, document] }
          : folder,
      ),
    );
  };

  const handleRemoveDocument = (folderId: string, documentId: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              documents: folder.documents.filter(
                (doc) => doc.id !== documentId,
              ),
            }
          : folder,
      ),
    );
  };

  const handleAddNote = (folderId: string, noteContent: string) => {
    const newNote = {
      id: Date.now().toString(),
      content: noteContent,
      createdAt: new Date(),
      createdBy: "Current User",
    };

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? { ...folder, notes: [...folder.notes, newNote] }
          : folder,
      ),
    );
  };

  const handleLinkUser = (
    folderId: string,
    userId: string,
    role: CaseFolder["linkedUsers"][0]["role"],
  ) => {
    // Implementation for linking users
    console.log("Linking user:", { folderId, userId, role });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Home" color="#fff" />
      </View>
      <CaseFolderManager
        folders={folders}
        onCreateFolder={handleCreateFolder}
        onUpdateFolder={handleUpdateFolder}
        onDeleteFolder={handleDeleteFolder}
        onAddDocument={handleAddDocument}
        onRemoveDocument={handleRemoveDocument}
        onAddNote={handleAddNote}
        onLinkUser={handleLinkUser}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#8b5cf6",
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
});
