import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, Barcode, Keyboard, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  quantity: number;
  onSerialNumbersChange: (serialNumbers: string[]) => void;
  serialNumbers: string[];
}

export function BarcodeScanner({ quantity, onSerialNumbersChange, serialNumbers }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        
        // Start scanning for barcodes
        startBarcodeDetection();
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Unable to access camera. Please use manual entry.');
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please use manual entry.',
        variant: 'destructive'
      });
    }
  };

  const startBarcodeDetection = () => {
    // Use BarcodeDetector API if available
    if ('BarcodeDetector' in window) {
      const barcodeDetector = new (window as any).BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'qr_code', 'upc_a', 'upc_e']
      });

      scanIntervalRef.current = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          try {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            if (barcodes.length > 0) {
              const barcode = barcodes[0].rawValue;
              handleBarcodeDetected(barcode);
            }
          } catch (e) {
            // Ignore detection errors
          }
        }
      }, 200);
    } else {
      // Fallback: prompt for manual entry
      toast({
        title: 'Barcode Detection',
        description: 'Native barcode detection not available. Please enter barcodes manually or use a USB scanner.',
      });
      stopCamera();
    }
  };

  const handleBarcodeDetected = (barcode: string) => {
    if (!barcode || serialNumbers.includes(barcode)) {
      if (serialNumbers.includes(barcode)) {
        toast({
          title: 'Duplicate Serial Number',
          description: 'This serial number has already been scanned.',
          variant: 'destructive'
        });
      }
      return;
    }

    if (serialNumbers.length >= quantity) {
      toast({
        title: 'Quantity Reached',
        description: 'All serial numbers have been captured.',
      });
      stopCamera();
      return;
    }

    const newSerialNumbers = [...serialNumbers, barcode];
    onSerialNumbersChange(newSerialNumbers);
    
    toast({
      title: 'Barcode Scanned',
      description: `Serial: ${barcode} (${newSerialNumbers.length}/${quantity})`,
    });

    // Auto-stop if all serials captured
    if (newSerialNumbers.length >= quantity) {
      stopCamera();
      toast({
        title: 'All Serial Numbers Captured',
        description: `Successfully scanned ${quantity} items.`,
      });
    }
  };

  const handleManualAdd = () => {
    if (!manualInput.trim()) return;
    
    handleBarcodeDetected(manualInput.trim());
    setManualInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleManualAdd();
    }
  };

  const removeSerialNumber = (index: number) => {
    const newSerialNumbers = serialNumbers.filter((_, i) => i !== index);
    onSerialNumbersChange(newSerialNumbers);
  };

  const remainingCount = Math.max(0, quantity - serialNumbers.length);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Serial Numbers / Barcodes</Label>
        <Badge variant="secondary">
          {serialNumbers.length} / {quantity} captured
        </Badge>
      </div>

      {/* Camera Scanner */}
      {isScanning ? (
        <div className="relative rounded-lg overflow-hidden bg-black">
          <video
            ref={videoRef}
            className="w-full h-48 object-cover"
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-24 border-2 border-green-500 rounded-lg opacity-75" />
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={stopCamera}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-2 right-2 text-center text-white text-sm bg-black/50 py-1 rounded">
            Point camera at barcode
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={startCamera}
            disabled={remainingCount === 0}
            className="flex-1"
          >
            <Camera className="mr-2 h-4 w-4" />
            Scan with Camera
          </Button>
        </div>
      )}

      {cameraError && (
        <p className="text-sm text-destructive">{cameraError}</p>
      )}

      {/* Manual Entry */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter serial number or scan with USB scanner..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
            disabled={remainingCount === 0}
          />
        </div>
        <Button
          type="button"
          onClick={handleManualAdd}
          disabled={!manualInput.trim() || remainingCount === 0}
        >
          <Keyboard className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Use camera scanning or connect a USB barcode scanner. {remainingCount > 0 ? `${remainingCount} more to scan.` : 'All serial numbers captured!'}
      </p>

      {/* Scanned Serial Numbers List */}
      {serialNumbers.length > 0 && (
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Scanned Serial Numbers</Label>
              {serialNumbers.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onSerialNumbersChange([])}
                  className="text-destructive h-7"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Clear All
                </Button>
              )}
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {serialNumbers.map((serial, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1.5 px-2 bg-muted rounded text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-600" />
                    <span className="font-mono">{serial}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeSerialNumber(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
