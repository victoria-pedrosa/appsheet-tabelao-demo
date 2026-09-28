function criarAbaEntregas() {
  var ss = SpreadsheetApp.openById('ID_EXEMPLO');
  var existing = ss.getSheetByName('Entregas_Acessorias');
  if (existing) ss.deleteSheet(existing);
  var sheet = ss.insertSheet('Entregas_Acessorias');
  var headers = ['Obrigação / Tarefa','Tipo','Empresa','EmpID','CNPJ','Cidade','Estado',
    'Prazo legal','Prazo Técnico','Data da entrega','Status','Departamento',
    'Responsável prazo','Responsável entrega','Competência','Protocolo'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  var hr = sheet.getRange(1, 1, 1, headers.length);
  hr.setBackground('#1a73e8'); hr.setFontColor('#ffffff'); hr.setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 150); sheet.setColumnWidth(3, 200); sheet.setColumnWidth(10, 120);
  SpreadsheetApp.flush();
  Logger.log('Aba Entregas_Acessorias criada!');
}

function importarDadosCSV() {
  var ss = SpreadsheetApp.openById('ID_EXEMPLO');
  var sheet = ss.getSheetByName('Entregas_Acessorias');
  if (!sheet) { criarAbaEntregas(); sheet = ss.getSheetByName('Entregas_Acessorias'); }
  var files = DriveApp.searchFiles('title contains "S3D_gestao"');
  if (!files.hasNext()) { Logger.log('CSV nao encontrado'); return; }
  var file = files.next();
  var content = file.getBlob().getDataAsString('UTF-8');
  var rows = Utilities.parseCsv(content, ';');
  var lr = sheet.getLastRow();
  if (lr > 1) sheet.getRange(2, 1, lr - 1, 16).clearContent();
  if (rows.length > 1) sheet.getRange(2, 1, rows.length - 1, rows[0].length).setValues(rows.slice(1));
  SpreadsheetApp.flush();
  Logger.log('Importados ' + (rows.length - 1) + ' registros de ' + file.getName());
}

// ============================================================
// CEP AUTO-FILL
// ============================================================

function buscarCEP(cep) {
  cep = String(cep).replace(/\D/g, '');
    if (cep.length !== 8) return null;
      try {
          var resp = UrlFetchApp.fetch('https://viacep.com.br/ws/' + cep + '/json/', {muteHttpExceptions: true});
              if (resp.getResponseCode() !== 200) return null;
                  var dados = JSON.parse(resp.getContentText());
                      if (dados.erro) return null;
                          return dados;
                            } catch(err) {
                                Logger.log('Erro ViaCEP: ' + err.message);
                                    return null;
                                      }
                                      }

                                      function doGet(e) {
                                        var output = {success: false};
                                          try {
                                              var cep = e.parameter.cep || '';
                                                  var rowNum = parseInt(e.parameter.rowNum || '0');
                                                      if (!cep || rowNum < 2) {
                                                            output.error = 'Parametros invalidos: cep=' + cep + ', rowNum=' + rowNum;
                                                                  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
                                                                      }
                                                                          var dados = buscarCEP(cep);
                                                                              if (!dados) {
                                                                                    output.error = 'CEP nao encontrado: ' + cep;
                                                                                          return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
                                                                                              }
                                                                                                  var ss = SpreadsheetApp.openById('ID_EXEMPLO');
                                                                                                      var sheet = ss.getSheetByName('Empresas');
                                                                                                          if (!sheet) throw new Error('Aba Empresas nao encontrada');
                                                                                                              var cidadeCell = sheet.getRange(rowNum, 33);
                                                                                                                  var enderecoCell = sheet.getRange(rowNum, 34);
                                                                                                                      var updated = [];
                                                                                                                          if (!cidadeCell.getValue() || cidadeCell.getValue().toString().trim() === '') {
                                                                                                                                cidadeCell.setValue(dados.localidade);
                                                                                                                                      updated.push('Cidade=' + dados.localidade);
                                                                                                                                          }
                                                                                                                                              if ((!enderecoCell.getValue() || enderecoCell.getValue().toString().trim() === '') && dados.logradouro) {
                                                                                                                                                    var end = dados.logradouro + (dados.bairro ? ', ' + dados.bairro : '');
                                                                                                                                                          enderecoCell.setValue(end);
                                                                                                                                                                updated.push('ENDERECO=' + end);
                                                                                                                                                                    }
                                                                                                                                                                        SpreadsheetApp.flush();
                                                                                                                                                                            output.success = true;
                                                                                                                                                                                output.localidade = dados.localidade;
                                                                                                                                                                                    output.uf = dados.uf;
                                                                                                                                                                                        output.updated = updated;
                                                                                                                                                                                          } catch(err) {
                                                                                                                                                                                              output.error = err.message;
                                                                                                                                                                                                }
                                                                                                                                                                                                  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
                                                                                                                                                                                                  }

                                                                                                                                                                                                  function onEditCEP(e) {
                                                                                                                                                                                                    if (!e || !e.range) return;
                                                                                                                                                                                                      var sheet = e.range.getSheet();
                                                                                                                                                                                                        if (sheet.getName() !== 'Empresas') return;
                                                                                                                                                                                                          var col = e.range.getColumn();
                                                                                                                                                                                                            var row = e.range.getRow();
                                                                                                                                                                                                              if (col !== 35 || row < 2) return;
                                                                                                                                                                                                                var cep = e.range.getValue();
                                                                                                                                                                                                                  if (!cep) return;
                                                                                                                                                                                                                    var dados = buscarCEP(cep);
                                                                                                                                                                                                                      if (!dados) { Logger.log('CEP nao encontrado: ' + cep); return; }
                                                                                                                                                                                                                        var cidadeCell = sheet.getRange(row, 33);
                                                                                                                                                                                                                          if (!cidadeCell.getValue() || cidadeCell.getValue().toString().trim() === '') {
                                                                                                                                                                                                                              cidadeCell.setValue(dados.localidade);
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                  var enderecoCell = sheet.getRange(row, 34);
                                                                                                                                                                                                                                    if ((!enderecoCell.getValue() || enderecoCell.getValue().toString().trim() === '') && dados.logradouro) {
                                                                                                                                                                                                                                        enderecoCell.setValue(dados.logradouro + (dados.bairro ? ', ' + dados.bairro : ''));
                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                            SpreadsheetApp.flush();
                                                                                                                                                                                                                                              Logger.log('CEP ' + cep + ' -> ' + dados.localidade + '/' + dados.uf);
                                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                              function instalarTriggerCEP() {
                                                                                                                                                                                                                                                var triggers = ScriptApp.getProjectTriggers();
                                                                                                                                                                                                                                                  for (var i = 0; i < triggers.length; i++) {
                                                                                                                                                                                                                                                      if (triggers[i].getHandlerFunction() === 'onEditCEP') {
                                                                                                                                                                                                                                                            ScriptApp.deleteTrigger(triggers[i]);
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                    ScriptApp.newTrigger('onEditCEP')
                                                                                                                                                                                                                                                                        .forSpreadsheet('ID_EXEMPLO')
                                                                                                                                                                                                                                                                            .onEdit()
                                                                                                                                                                                                                                                                                .create();
                                                                                                                                                                                                                                                                                  Logger.log('Trigger onEditCEP instalado!');
                                                                                                                                                                                                                                                                                  }