function getMail() {
  var INDEX_START_THREAD = 0;
  // Max number is 500
  var MAX_THREAD_NUMBER = 5;
  
  // refarence search keywords
  // https://support.google.com/mail/answer/7190?hl=ja
  //  after:2018/10/02
  var keyword = '予約 -from:yoyaku newer_than:2d'
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var threads = GmailApp.search(keyword,INDEX_START_THREAD,MAX_THREAD_NUMBER);
  
  var row = sheet.getLastRow() + 1;
  for(var threads_key in threads){
    var thread = threads[threads_key];
    var messages = thread.getMessages();
    for(messages_key in messages){
      setMessageToSheet(messages[messages_key], sheet, row);
      thread.markRead();
      row++;
    }
    addLabelToMail(thread);
    Utilities.sleep(1000);
  }
}

/**
 * messageの値をsheetに追記していく
 */
function setMessageToSheet(message, sheet, row) {
  var date = message.getDate();
  var from = message.getFrom();
  var to = message.getTo();
  var subject = message.getSubject();
  var body = message.getBody();
  var body_limited = body.substring(0,49999);
  
  sheet.getRange(row,1).setValue(date);
  sheet.getRange(row,2).setValue(from);
  sheet.getRange(row,3).setValue(to);
  sheet.getRange(row,4).setValue(subject);
  sheet.getRange(row,5).setValue(body_limited);
}

/**
 * 取得したメールに対して、わかりやすくなるように用意しておいたラベルを付ける
 */
function addLabelToMail(thread) {
  var label = GmailApp.getUserLabelByName("YOYAKU");
  label.addToThread(thread);
}