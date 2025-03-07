/**
 * Format angka menjadi format mata uang Rupiah
 * @param amount Jumlah yang akan diformat
 * @returns String dalam format Rupiah (contoh: Rp 1.000.000)
 */
export const formatCurrency = (amount: number): string => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}; 