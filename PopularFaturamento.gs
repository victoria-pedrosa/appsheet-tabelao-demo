var SHEET_ID_FAT = 'ID_EXEMPLO';

function popularTable4() {
  var ss = SpreadsheetApp.openById(SHEET_ID_FAT);
    var allTabs = ss.getSheets().map(function(s){ return s.getName(); });
      Logger.log('Abas: ' + allTabs.join(', '));
        var fonte = ss.getSheets().find(function(s){ return s.getName().trim() === 'faturamento_empresas'; });
          if (!fonte) { Logger.log('faturamento_empresas nao encontrada'); return; }
            var lastRow = fonte.getLastRow();
              var allData = fonte.getRange(5, 1, lastRow - 4, 9).getValues();
                var headers = ['Row_ID','Competencia','Codigo','Empresa','Saidas_RS','Servicos_RS','Outros_RS','Total_RS'];
                  var cleanRows = [];
                    for (var i = 1; i < allData.length; i++) {
                        var row = allData[i];
                            var competencia = String(row[0] || '').trim();
                                var codigo = String(row[1] || '').trim();
                                    if (!codigo || codigo === '' || codigo === 'Codigo') continue;
                                        if (!competencia || competencia === '') continue;
                                            cleanRows.push([competencia + '|' + codigo, competencia, codigo, String(row[3] || '').trim(), parseFloat(row[5]) || 0, parseFloat(row[6]) || 0, parseFloat(row[7]) || 0, parseFloat(row[8]) || 0]);
                                              }
                                                var destTab = ss.getSheetByName('Table 4');
                                                  if (!destTab) { Logger.log('Aba Table 4 nao encontrada. Abas: ' + allTabs.join(', ')); return; }
                                                    destTab.clearContents();
                                                      destTab.getRange(1,1,1,headers.length).setValues([headers]);
                                                        if (cleanRows.length > 0) destTab.getRange(2,1,cleanRows.length,headers.length).setValues(cleanRows);
                                                          SpreadsheetApp.flush();
                                                            Logger.log('Table 4 populada: ' + cleanRows.length + ' linhas.');
                                                            }