/**
 * TITIPIN SMAN7 BACKEND - Google Apps Script
 * Deploy sebagai Web App dengan akses "Anyone"
 */

const SHEET_NAME = "Data_Pesanan";

/**
 * Inisialisasi Spreadsheet saat pertama kali
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Timestamp", 
      "Nama Pembeli", 
      "Kelas", 
      "WA Pembeli", 
      "Lokasi COD", 
      "Waktu COD", 
      "Daftar Barang", 
      "Total Bayar"
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#FFE600");
  }
}

/**
 * Handler untuk menerima data dari Frontend (POST request)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    // Format daftar barang menjadi teks tunggal
    const itemString = data.items.map(i => `${i.namaBarang} (x${i.quantity})`).join(", ");
    
    // Masukkan data ke baris baru
    sheet.appendRow([
      new Date(),
      data.pembeli.nama,
      data.pembeli.kelas,
      data.pembeli.wa,
      data.lokasi,
      `${data.tanggal} @ ${data.jam}`,
      itemString,
      data.total
    ]);

    // Opsi: Kirim Email Notifikasi ke Admin
    // MailApp.sendEmail("admin@sman7.sch.id", "Pesanan Baru Titipin Sman7", `Ada pesanan baru dari ${data.pembeli.nama}`);

    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "Data berhasil dicatat di Spreadsheet"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handler untuk testing (GET request)
 */
function doGet() {
  return ContentService.createTextOutput("Backend Titipin Sman7 Aktif!");
}
