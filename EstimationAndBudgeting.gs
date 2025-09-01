/**
 * Project Closure Checklist Tool
 * Role Based Access Control Web App
 */

function doGet(e) {
  return HtmlService.createTemplateFromFile("index").evaluate().setTitle("Project Closure Checklist Tool");
}

// Include files
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Get user role from Google Sheets
function getUserRole(email) {
  const ss = SpreadsheetApp.openById("YOUR_SHEET_ID");
  const sheet = ss.getSheetByName("UserRoles");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) return data[i][1];
  }
  return "Viewer";
}

// Save checklist data
function saveChecklist(data) {
  const ss = SpreadsheetApp.openById("YOUR_SHEET_ID");
  const sheet = ss.getSheetByName("Checklists");
  sheet.appendRow([new Date(), data.project, data.item, data.status, data.remarks, Session.getActiveUser().getEmail()]);
  return "Checklist saved successfully!";
}

// Get all checklist data
function getChecklists() {
  const ss = SpreadsheetApp.openById("YOUR_SHEET_ID");
  const sheet = ss.getSheetByName("Checklists");
  const data = sheet.getDataRange().getValues();
  return data;
}

// Generate Closure Report (PDF)
function generateClosureReport() {
  const ss = SpreadsheetApp.openById("YOUR_SHEET_ID");
  const sheet = ss.getSheetByName("Checklists");
  const data = sheet.getDataRange().getValues();
  let doc = DocumentApp.create("Closure Report");
  let body = doc.getBody();
  body.appendParagraph("Project Closure Checklist Report").setHeading(DocumentApp.ParagraphHeading.HEADING1);
  data.forEach((row, i) => {
    if (i === 0) return;
    body.appendParagraph(row.join(" | "));
  });
  doc.saveAndClose();
  return doc.getUrl();
}
