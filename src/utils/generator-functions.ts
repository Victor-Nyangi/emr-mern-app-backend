import crypto from "crypto";

const generatePolicyNumber = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `POL-${year}-${month}-${randomPart}`; // Example: POL-2505-ABC123
};

const generateMemberIdHashed = (patientId: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(patientId.toString());
  return hash.digest("hex").substring(0, 12).toUpperCase(); // Take a portion for brevity
};

export { generatePolicyNumber, generateMemberIdHashed };
