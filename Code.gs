/**
 * TITIPIN SMAN7 BACKEND & ROUTER
 */

const SHEET_NAME = "Data_Pesanan";

// Fungsi untuk menampilkan antarmuka (Frontend)
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Titipin SMAN7')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Fungsi untuk menerima data dari Frontend (POST)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Setup sheet jika belum ada
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Timestamp", "Nama", "WA", "Lokasi", "Waktu", "Barang", "Total"]);
    }
    
    const items = data.items.map(i => `${i.namaBarang} (x${i.quantity})`).join(", ");
    
    sheet.appendRow([
      new Date(),
      data.pembeli.nama,
      data.pembeli.wa,
      data.lokasi,
      `${data.tanggal} ${data.jam}`,
      items,
      data.total
    ]);

    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fungsi pembantu untuk menyertakan file CSS/JS jika diperlukan
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
