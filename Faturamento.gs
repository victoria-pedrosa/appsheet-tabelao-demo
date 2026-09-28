/**
 * Faturamento.gs - Cria aba Faturamento_DB limpa para o AppSheet
 * Headers originais na linha 5 da aba fonte; linhas sem Código são ignoradas.
 */

var SHEET_ID = 'ID_EXEMPLO';

function criarFaturamentoDB() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var fonte = ss.getSheets().find(function(s){ return s.getName().trim() === 'faturamento_empresas'; });
  if (!fonte) { Logger.log('Aba faturamento_empresas nao encontrada'); return; }

  var lastRow = fonte.getLastRow();
  if (lastRow < 6) { Logger.log('Sem dados'); return; }

  // Linha 5 = cabecalho, linha 6+ = dados; pegar ate 9 colunas (A:I)
  var allData = fonte.getRange(5, 1, lastRow - 4, 9).getValues();

  var headers = ['Row_ID','Competencia','Codigo','Empresa','Saidas_RS','Servicos_RS','Outros_RS','Total_RS'];
  var cleanRows = [];

  for (var i = 1; i < allData.length; i++) {
    var row = allData[i];
    var competencia = String(row[0] || '').trim();
    var codigo = String(row[1] || '').trim();
    if (!codigo || codigo === '' || codigo === 'Codigo') continue;
    if (!competencia || competencia === '') continue;

    cleanRows.push([
      competencia + '|' + codigo,
      competencia,
      codigo,
      String(row[3] || '').trim(),
      parseFloat(row[5]) || 0,
      parseFloat(row[6]) || 0,
      parseFloat(row[7]) || 0,
      parseFloat(row[8]) || 0
    ]);
  }

  var db = ss.getSheetByName('Faturamento_DB');
  if (!db) { db = ss.insertSheet('Faturamento_DB'); }
  else { db.clearContents(); }

  db.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (cleanRows.length > 0) {
    db.getRange(2, 1, cleanRows.length, headers.length).setValues(cleanRows);
  }

  Logger.log('Faturamento_DB atualizado: ' + cleanRows.length + ' linhas');
  SpreadsheetApp.flush();

  function popularTable4() {
    var ss = SpreadsheetApp.openById(SHEET_ID);
      
        // Listar abas existentes
          var allTabs = ss.getSheets().map(function(s){ return s.getName(); });
            Logger.log('Abas existentes: ' + allTabs.join(', '));
              
                // Fonte de dados
                  var fonte = ss.getSheets().find(function(s){ return s.getName().trim() === 'faturamento_empresas'; });
                    if (!fonte) { Logger.log('Aba faturamento_empresas nao encontrada'); return; }
                      
                        var lastRow = fonte.getLastRow();
                          if (lastRow < 6) { Logger.log('Sem dados'); return; }
                            
                              var allData = fonte.getRange(5, 1, lastRow - 4, 9).getValues();
                                var headers = ['Row_ID','Competencia','Codigo','Empresa','Saidas_RS','Servicos_RS','Outros_RS','Total_RS'];
                                  var cleanRows = [];
                                    
                                      for (var i = 1; i < allData.length; i++) {
                                          var row = allData[i];
                                              var competencia = String(row[0] || '').trim();
                                                  var codigo = String(row[1] || '').trim();
                                                      if (!codigo || codigo === '' || codigo === 'Codigo') continue;
                                                          if (!competencia || competencia === '') continue;
                                                              cleanRows.push([
                                                                    competencia + '|' + codigo,
                                                                          competencia, codigo,
                                                                                String(row[3] || '').trim(),
                                                                                      parseFloat(row[5]) || 0, parseFloat(row[6]) || 0,
                                                                                            parseFloat(row[7]) || 0, parseFloat(row[8]) || 0
                                                                                                ]);
                                                                                                  }
                                                                                                    
                                                                                                      // Destino: aba 'Table 4' criada pelo AppSheet DB
                                                                                                        var destTab = ss.getSheetByName('Table 4');
                                                                                                          if (!destTab) { Logger.log('Aba Table 4 nao encontrada. Abas: ' + allTabs.join(', ')); return; }
                                                                                                            
                                                                                                              destTab.clearContents();
                                                                                                                destTab.getRange(1,1,1,headers.length).setValues([headers]);
                                                                                                                  if (cleanRows.length > 0) {
                                                                                                                      destTab.getRange(2,1,cleanRows.length,headers.length).setValues(cleanRows);
                                                                                                                        }
                                                                                                                          SpreadsheetApp.flush();
                                                                                                                            Logger.log('Table 4 populada com ' + cleanRows.length + ' linhas. Pronto!');
                                                                                                                            }
}