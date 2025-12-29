import { Injectable } from "@nestjs/common";
import * as QRCode from "qrcode";

@Injectable()
export class QrService {
    async generateQRCode(data: string): Promise<string> {
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(data, {
                width: 300,
                margin: 2,
                color: {
                    dark: "#000000",
                    light: "#ffffff",
                },
                errorCorrectionLevel: "H",
            });
            return qrCodeDataUrl;
        } catch (error) {
            console.error("QR kod yaratishda xatolik:", error);
            throw error;
        }
    }

    async generateQRCodeBuffer(data: string): Promise<Buffer> {
        try {
            return await QRCode.toBuffer(data, {
                width: 300,
                margin: 2,
                errorCorrectionLevel: "H",
            });
        } catch (error) {
            console.error("QR kod buffer yaratishda xatolik:", error);
            throw error;
        }
    }
}
