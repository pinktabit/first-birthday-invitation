const SHEET_NAME = "RSVP";

function doGet() {
  return createJsonOutput({
    ok: true,
    message: "RSVP endpoint is ready.",
  });
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      payload.attendance || "",
      payload.name || "",
      payload.phone || "",
      payload.guests || "",
      payload.message || "",
      payload.submittedAt || "",
    ]);

    return createJsonOutput({
      ok: true,
    });
  } catch (error) {
    return createJsonOutput({
      ok: false,
      message: error.message,
    });
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "기록시각",
      "참석여부",
      "성함",
      "연락처",
      "본인 외 인원",
      "전달사항",
      "클라이언트 제출시각",
    ]);
  }

  return sheet;
}

function createJsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
