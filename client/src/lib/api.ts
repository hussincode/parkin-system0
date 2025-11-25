import { apiRequest } from "./queryClient";

export async function scanQRCode(qrCode: string) {
  return await apiRequest("POST", "/api/scan", { qrCode });
}

export default {};
