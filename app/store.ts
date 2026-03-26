type Scan = {
  input: string;
  status: string;
  scamType?: string;
  threatType?: string;
  riskLevel?: string;
  date: string;
};

let scans: Scan[] = [];

export function addScan(scan: {
  input: string;
  status: string;
  scamType?: string;
  threatType?: string;
  riskLevel?: string;
}) {
  scans.unshift({
    ...scan,
    date: new Date().toLocaleString(),
  });
}

export function getScans() {
  return scans;
}

export function deleteScan(index: number) {
  scans.splice(index, 1);
}

export function clearScans() {
  scans = [];
}
let monitoredPlatforms: Record<string, boolean> = {
  whatsapp: false,
  sms: false,
  gmail: false,
  telegram: false,
  browser: false,
  instagram: false
};

export function setPlatform(platform: string, value: boolean) {
  monitoredPlatforms[platform] = value;
}

export function getPlatforms() {
  return monitoredPlatforms;
}

export type Settings = {
  sensitivity: 'low' | 'medium' | 'high';
  showConfidence: boolean;
  detailedAnalysis: boolean;
  autoScan: boolean;
};

let globalSettings: Settings = {
  sensitivity: 'medium',
  showConfidence: true,
  detailedAnalysis: true,
  autoScan: false,
};

export function getSettings() {
  return globalSettings;
}

export function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  globalSettings[key] = value;
}