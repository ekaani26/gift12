// Paste into the Apps Script project bound to "diwlai camp data".
// Set LEAD_SECRET in Project Settings > Script properties before deployment.
// Set SPREADSHEET_ID privately in Script properties alongside LEAD_SECRET.
var TAB_NAME = 'Gift12 Leads';
var HEADERS = ['Submission ID', 'Created at', 'Name', 'Phone', 'Status', 'Updated at'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;
  try {
    var data = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('LEAD_SECRET');
    if (!secret || data.secret !== secret) return reply_({ ok: false });
    if (typeof data.id !== 'string' || !/^[a-f0-9-]{36}$/i.test(data.id) ||
        typeof data.name !== 'string' || !data.name.trim() || data.name.length > 30 ||
        typeof data.phone !== 'string' || (data.phone !== '' && !/^\d{10,15}$/.test(data.phone))) {
      return reply_({ ok: false });
    }
    lock.waitLock(10000);
    locked = true;
    var book = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
    var sheet = book.getSheetByName(TAB_NAME);
    if (!sheet) sheet = book.insertSheet(TAB_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    var actual = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (actual.join('|') !== HEADERS.join('|')) throw new Error('Unexpected headers');
    var last = sheet.getLastRow();
    var match = last > 1 ? sheet.getRange(2, 1, last - 1, 1).createTextFinder(data.id).matchEntireCell(true).findNext() : null;
    var row = match ? match.getRow() : last + 1;
    var now = new Date();
    var old = match ? sheet.getRange(row, 1, 1, 6).getValues()[0] : null;
    // A late name-only retry must never erase an already saved phone number.
    var phone = data.phone || (old ? String(old[3]) : '');
    var safeName = /^[=+\-@\t\r\n]/.test(data.name.trim()) ? "'" + data.name.trim() : data.name.trim();
    if (row > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 100);
    sheet.getRange(row, 3, 1, 2).setNumberFormat('@');
    sheet.getRange(row, 1, 1, 6).setValues([[
      data.id, old ? old[1] : now, safeName, phone,
      phone ? 'Name + phone' : 'Name only', now
    ]]);
    sheet.getRange(row, 2).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    sheet.getRange(row, 6).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    SpreadsheetApp.flush();
    return reply_({ ok: true });
  } catch (error) {
    return reply_({ ok: false });
  } finally {
    if (locked) lock.releaseLock();
  }
}

function reply_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
