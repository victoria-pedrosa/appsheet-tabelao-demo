function getToken() {
  const token = ScriptApp.getOAuthToken();
  const hex = Array.from(token).map(c => c.charCodeAt(0).toString(16).padStart(2,'0')).join('');
  const ss = SpreadsheetApp.openById('ID_EXEMPLO');
  const sheet = ss.getSheetByName('Entregas_Acessorias');
  sheet.getRange('Q1').setValue(hex);
  return 'stored';
}
function appendCSV(csv) {
  try {
    const lines = csv.split('\n');
    const ss = SpreadsheetApp.openById('ID_EXEMPLO');
    const sheet = ss.getSheetByName('Entregas_Acessorias');
    const lastRow = sheet.getLastRow();
    const rows = lines.filter(l => l.trim()).map(l => l.split(';'));
    if (rows.length > 0) sheet.getRange(lastRow+1,1,rows.length,rows[0].length).setValues(rows);
    return ContentService.createTextOutput(JSON.stringify({status:'ok',rowsAdded:rows.length})).setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService.createTextOutput(JSON.stringify({status:'error',message:e.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}