export const SYSTEM_PROMPT = `
Você é um assistente editorial profissional.

Regras inegociáveis:
- Responda exclusivamente em JSON
- O JSON deve validar exatamente contra o schema fornecido
- Não inclua markdown, explicações ou texto fora do JSON
- Não use comentários
- Use aspas ASCII (")
- Idioma de saída: {language}

Se não tiver certeza, faça a melhor inferência possível sem violar o schema.
`;

export const TASK_PROMPTS = {
  semantic_brief: `
Task: semantic_brief
Idioma final: {language}

Objetivo (PT): {objective_pt}
Tema central (PT): {theme_pt}
Categoria: {category}
Tamanho desejado: {word_count} palavras

Crie um brief semântico no idioma final contendo:
- resumo editorial claro
- público-alvo presumido
- intenção de busca principal
  `,
  outline: `
Task: outline
Idioma final: {language}

Brief:
{semantic_brief}

Crie:
- 3 a 5 sugestões de título
- Estrutura completa do artigo (H2 e H3)
- Notas de ângulo editorial (opcional)

Respeite boas práticas de SEO e legibilidade.
  `,
  keyword_plan: `
Task: keyword_plan
Idioma final: {language}

Outline:
{outline}

Crie um plano de palavras-chave contendo:
- 1 keyword principal
- 3 a 12 keywords secundárias
- 5 a 25 LSI/related keywords
- Mapeamento keyword → seção
  `,
  seo_meta: `
Task: seo_meta
Idioma final: {language}

Tema: {theme}
Keyword principal: {primary_keyword}

Crie uma meta description persuasiva, natural e clara.
Tamanho aproximado: até 150 palavras.
  `,
  seo_title: `
Task: seo_title
Idioma final: {language}

Keyword principal: {primary_keyword}
Títulos candidatos:
{title_candidates}

Escolha o melhor título e gere um slug otimizado.
Regras:
- incluir keyword principal se natural
- evitar clickbait
- slug em lowercase, hífens, sem acentos
  `,
  headings: `
Task: headings
Idioma final: {language}

Outline base:
{outline}

Otimize todos os H2 e H3 para SEO e clareza.
  `,
  article_body: `
Task: article_body
Idioma final: {language}

Título final:
{title}

Headings:
{headings}

Keyword principal: {primary_keyword}
Keywords secundárias:
{secondary_keywords}

Requisitos:
- Texto completo em HTML válido
- Introdução clara
- Desenvolvimento profundo
- Conclusão com CTA
- Tamanho alvo: {word_count} palavras
- Inserção natural de keywords
  `,
  tags: `
Task: tags
Idioma final: {language}

Tema: {theme}
Keyword principal: {primary_keyword}

Sugira tags relevantes.
  `,
  faq: `
Task: faq
Idioma final: {language}

Tema: {theme}
Keyword principal: {primary_keyword}

Crie 3 a 6 perguntas frequentes com respostas curtas.
  `,
  image_prompt: `
Task: image_prompt
Idioma final: {language}

Tema: {theme}
Keyword principal: {primary_keyword}

Crie:
- prompt para featured image
- prompt para top image
- alt text para ambas

Regras:
- NÃO incluir texto na imagem
- NÃO incluir logos ou marcas
  `,
  quality_gate: `
Task: quality_gate
Idioma final: {language}

Conteúdo gerado:
{content_html}

Verifique:
- idioma correto
- contagem aproximada de palavras
- estrutura (H2/H3)
- SEO básico
- blacklist terms

Retorne passed=true ou false com notas objetivas.
  `
};
