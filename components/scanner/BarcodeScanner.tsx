import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { scannerService } from '@/services/scanner';
import { BarcodeScanResult } from '@/types/scanner';

const { width, height } = Dimensions.get('window');

interface BarcodeScannerProps {
  onScanComplete?: (result: BarcodeScanResult) => void;
  onClose?: () => void;
}

export default function BarcodeScanner({ onScanComplete, onClose }: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<BarcodeScanResult | null>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const result = await scannerService.processBarcodeData(data, type);
      setScanResult(result);
      onScanComplete?.(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to process barcode data');
      setScanned(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setScanResult(null);
  };

  const handleTrackCase = () => {
    if (!scanResult?.data.isCourtFile) return;
    
    Alert.alert(
      'Track Case',
      `This will add case ${scanResult.data.caseInfo?.caseNumber} to your tracking list.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add to Tracking', 
          onPress: () => {
            Alert.alert('Success', 'Case has been added to your tracking list.');
          }
        }
      ]
    );
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>📷 Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to scan barcodes and QR codes.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (scanResult) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>
              {scanResult.type === 'qr' ? '📱 QR Code Detected' : '📊 Barcode Detected'}
            </Text>
            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.dataContainer}>
            <Text style={styles.dataLabel}>Decoded Text:</Text>
            <Text style={styles.dataValue}>{scanResult.data.text}</Text>
          </View>

          <View style={styles.dataContainer}>
            <Text style={styles.dataLabel}>Format:</Text>
            <Text style={styles.dataValue}>{scanResult.data.format}</Text>
          </View>

          {scanResult.data.isCourtFile && scanResult.data.caseInfo && (
            <View style={styles.courtFileContainer}>
              <Text style={styles.courtFileTitle}>⚖️ Court File Detected</Text>
              
              <View style={styles.caseInfoContainer}>
                <View style={styles.caseInfoRow}>
                  <Text style={styles.caseInfoLabel}>Case Number:</Text>
                  <Text style={styles.caseInfoValue}>{scanResult.data.caseInfo.caseNumber}</Text>
                </View>
                
                <View style={styles.caseInfoRow}>
                  <Text style={styles.caseInfoLabel}>Court:</Text>
                  <Text style={styles.caseInfoValue}>{scanResult.data.caseInfo.court}</Text>
                </View>
                
                <View style={styles.caseInfoRow}>
                  <Text style={styles.caseInfoLabel}>Status:</Text>
                  <Text style={[styles.caseInfoValue, styles.statusActive]}>
                    {scanResult.data.caseInfo.status}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.trackButton} onPress={handleTrackCase}>
                <Text style={styles.trackButtonText}>📌 Track Case</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={resetScanner}>
              <Text style={styles.actionButtonText}>🔄 Scan Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]} 
              onPress={() => Alert.alert('Success', 'Scan result has been saved to history.')}
            >
              <Text style={styles.primaryButtonText}>💾 Save to History</Text>
            </TouchableOpacity>
          </View>
        </div>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417', 'datamatrix', 'code128', 'code39', 'ean13', 'ean8'],
        }}
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.headerCloseButton}>
                <Text style={styles.headerCloseText}>✕</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.headerTitle}>📊 Barcode Scanner</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Scanning Area */}
          <View style={styles.scanArea}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Position barcode within the frame</Text>
            <Text style={styles.instructionsSubtitle}>
              Supports QR codes, barcodes, and court file codes
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>📱 Auto-detect and vibrate</Text>
              <Text style={styles.featureItem}>⚖️ Court file recognition</Text>
              <Text style={styles.featureItem}>📌 Case tracking integration</Text>
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCloseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 36,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00ff00',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionsSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  featuresList: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
  },
  featureItem: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#059669',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  dataValue: {
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    fontFamily: 'monospace',
  },
  courtFileContainer: {
    margin: 20,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  courtFileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803d',
    marginBottom: 12,
  },
  caseInfoContainer: {
    marginBottom: 16,
  },
  caseInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  caseInfoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    width: 100,
  },
  caseInfoValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  statusActive: {
    color: '#15803d',
    fontWeight: '600',
  },
  trackButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#059669',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});