let scanHistory: any[] = [];

export const addScan = (scan: any) => {
  scanHistory.unshift({
    ...scan,
    date: new Date().toLocaleString(),
  });
};

export const getScans = () => {
  return scanHistory;
};

export const deleteScan = (index: number) => {
  scanHistory.splice(index, 1);
};

export const clearScans = () => {
  scanHistory = [];
};