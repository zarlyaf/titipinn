/**
 * TITIPIN SMAN7 BACKEND & ROUTER
 */

const SHEET_NAME = "Data_Pesanan";

/**
 * Fungsi untuk menampilkan antarmuka (Frontend).
 * Google Apps Script memanggil ini saat URL /exec dibuka di browser.
 */
function doGet() {
  try {
    return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Titipin SMAN7')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createHtmlOutput("<b>Error memuat halaman:</b> " + err.message);
  }
}

/**
 * Fungsi untuk menerima data dari Frontend.
 * Menangani pengiriman data pesanan dan mencatatnya ke Google Sheets.
 */
function doPost(e) {
  try {
    // Validasi parameter e
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Format data tidak valid atau kosong.");
    }

    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Setup sheet jika belum ada (Auto-Initialize)
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      const headers = ["Timestamp", "Nama", "WA", "Lokasi", "Waktu", "Barang", "Total"];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#FFE600");
    }
    
    // Pemrosesan daftar barang
    const items = Array.isArray(data.items) 
      ? data.items.map(i => `${i.namaBarang || i.name} (x${i.quantity || 1})`).join(", ")
      : "Data barang tidak terbaca";
    
    // Menambahkan baris ke Spreadsheet
    sheet.appendRow([
      new Date(),
      data.pembeli?.nama || "Tanpa Nama",
      data.pembeli?.wa || "-",
      data.lokasi || "Belum Ditentukan",
      `${data.tanggal || ""} ${data.jam || ""}`,
      items,
      data.total || 0
    ]);

    return ContentService.createTextOutput(JSON.stringify({ 
      "status": "success", 
      "message": "Data berhasil masuk ke Spreadsheet" 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Mencatat error ke log Apps Script untuk debugging
    console.error("Error di doPost:", err.toString());
    
    return ContentService.createTextOutput(JSON.stringify({ 
      "status": "error", 
      "message": err.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Fungsi untuk menyimpan data langsung dari sisi server jika menggunakan google.script.run
 */
function processOrder(data) {
  return doPost({ postData: { contents: JSON.stringify(data) } });
}

/**
 * Fungsi pembantu untuk menyertakan file CSS/JS secara terpisah (opsional)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
