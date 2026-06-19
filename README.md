# Agenda Inteligente

Agenda Inteligente e um sistema leve de clientes, profissionais, leads e agendamentos, pensado para evoluir para uma aplicacao Windows instalada.

## Objetivo

O projeto deve funcionar como uma agenda inteligente para Windows. Quando instalado, o sistema deve poder iniciar junto com o Windows e solicitar autorizacao para gerar alertas sonoros e visuais de agendamentos.

## Funcionalidades atuais

- calendario mensal interativo;
- cadastro de clientes;
- cadastro de profissionais;
- agendamentos por profissional;
- relatorio individual por profissional em outra aba;
- ultimos agendamentos, metricas e resumo do profissional;
- edicao de profissional e agendamentos pelo relatorio;
- alertas sonoros, visuais e notificacoes do navegador;
- configuracoes de alerta pela engrenagem no topo;
- importacao e exportacao de dados em JSON;
- armazenamento local no navegador.

## Alertas

A engrenagem no topo abre as configuracoes de alerta:

- ativar/desativar som;
- ativar/desativar alerta visual na tela;
- ativar/desativar notificacoes do Windows/navegador;
- definir o tempo padrao de lembrete para novos agendamentos;
- testar alerta.

Para notificacoes do Windows/navegador, o usuario precisa autorizar quando o sistema solicitar permissao.

## Como executar agora

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Depois abra:

```text
http://127.0.0.1:4173/
```

## Proximos passos para Windows

- empacotar como aplicativo desktop;
- configurar inicializacao junto com o Windows;
- manter servico de alertas ativo em segundo plano;
- criar instalador;
- assinar o aplicativo quando houver distribuicao publica.
