# Demonstração — Preparação de abas de faturamento e entregas para AppSheet

> Projeto de portfólio de **Victória Pedrosa**. **Demonstração** de preparação de abas de faturamento e entregas para AppSheet — versão com dados fictícios (nomes, CNPJs, e-mails e IDs internos substituídos).

## Problema de negócio
O AppSheet do Tabelão precisava de abas de faturamento e entregas preparadas a partir da planilha principal.

## Antes x depois
| | Antes | Depois |
|---|---|---|
| Como é feito | Montagem manual das abas. | Scripts criam e populam as abas de faturamento e entregas acessórias para o AppSheet. |

## Ganho
- App sempre alimentado com dados atualizados.

## Tecnologias
APIs REST, Gatilhos agendados, Google Apps Script, Google Drive, Google Sheets

## Arquivos
- `AppendEntregas.gs`
- `Codigo.gs`
- `CriarAbaEntregas.gs`
- `Faturamento.gs`
- `PopularFaturamento.gs`

## Como usar
Crie um projeto no Google Apps Script, copie os arquivos `.gs`/`.html` e configure as Propriedades do script indicadas no código.

## Autora
Victória Pedrosa — Product Owner do Time de IA, automação de processos contábeis e fiscais.
