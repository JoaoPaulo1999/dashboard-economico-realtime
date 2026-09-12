# Atlas Economico

Painel estatico de indicadores economicos brasileiros e globais. Os dados sao carregados diretamente no navegador a partir de fontes publicas, sem chave de API.

## Executar

Abra `index.html` em um navegador ou publique a pasta em GitHub Pages. Para evitar restricoes de CORS de alguns provedores, prefira servir a pasta por um servidor HTTP local, por exemplo:

```text
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Atualizacao

O painel inicia uma carga ao abrir e tenta atualizar a cada 10 segundos. Se uma carga anterior ainda estiver em andamento, a nova tentativa e ignorada para evitar requisicoes concorrentes. O botao **Atualizar agora** permite disparar uma carga manual.

Os dados podem permanecer como `N/D` quando uma fonte estiver fora do ar, bloquear CORS, ainda nao tiver publicado o periodo ou estiver fora do horario de negociacao. Os valores exibidos nao sao recomendacao de investimento.

## Fontes publicas

- Banco Central do Brasil SGS: Selic, CDI e IBC-Br, em `api.bcb.gov.br`.
- Banco Central do Brasil Olinda / Expectativas de Mercado: projecoes Focus de Selic, IPCA, PIB e cambio, em `olinda.bcb.gov.br`.
- Banco Central do Brasil Indicadores Selecionados: planilhas XLSX de composicao setorial e IBCR, em `bcb.gov.br/content/indeco/indicadoresselecionados`.
- IBGE SIDRA: populacao, em `apisidra.ibge.gov.br`.
- IBGE SIDRA tabela 5938, variável 37: PIB estadual a preços correntes das 27 unidades federativas, em `apisidra.ibge.gov.br`.
- Ipeadata: PIB trimestral, PIB nominal e IGP-M, em `ipeadata.gov.br`.
- AwesomeAPI: cambio USD, EUR, CNY e JPY contra BRL, em `economia.awesomeapi.com.br`.
- Yahoo Finance Chart API: indices e commodities de referencia, em `query1.finance.yahoo.com`.
- Brapi: listagem publica de acoes brasileiras classificadas como `stock`, em `brapi.dev`.
- Wikipedia: composicao publica atualizada dos constituintes do S&amp;P 500, em `en.wikipedia.org/wiki/List_of_S%26P_500_companies`.
- MDIC / Comex Stat: balanca comercial, em `balanca.economia.gov.br`.
- SheetJS via jsDelivr: leitura das planilhas XLSX no navegador, em `cdn.jsdelivr.net`.

As fontes podem alterar formato, limites, disponibilidade ou politica de acesso sem aviso. O projeto nao controla esses servicos.

## Publicar no GitHub

1. Crie um repositorio e envie `index.html`, `styles.css`, `app.js` e `README.md`. A planilha local nao e necessaria: os dados regionais sao carregados online do BCB.
2. Em **Settings > Pages**, selecione a branch principal e a pasta `/ (root)`.
3. Aguarde a URL gerada pelo GitHub Pages.

Como o projeto e estatico, nao ha segredo para configurar. Nao adicione chaves privadas ao repositorio.

## Limites de dados publicos

Todas as fontes sao acessadas diretamente pelo navegador e nao exigem chave. A disponibilidade, o CORS, os limites de requisicao e o horario de negociacao dependem de cada provedor. O painel atualiza a cada 10 segundos, mas ignora uma nova tentativa enquanto a carga anterior estiver em andamento; por isso uma fonte lenta nao cria requisicoes sobrepostas. Em caso de indisponibilidade, o card mostra `N/D` ou mantem o ultimo estado disponivel.
