'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeSectionProps {
  orderId: string;
  total: number;
}

export default function QRCodeSection({ orderId, total }: QRCodeSectionProps) {
  return (
    <div className="bg-white p-6 rounded-2xl mb-6 shadow-lg shadow-black/20 relative group">
      <QRCodeSVG 
        value={JSON.stringify({ orderId, total })} 
        size={200}
        level="H"
        includeMargin={true}
      />
      <div className="absolute inset-0 border-4 border-dashed border-primary/20 rounded-2xl animate-pulse pointer-events-none"></div>
    </div>
  );
}
