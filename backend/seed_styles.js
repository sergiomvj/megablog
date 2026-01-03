import { pool } from './services/db.js';
import { v4 as uuidv4 } from 'uuid';

const blogStyles = [
    {
        style_key: 'analitica',
        name: 'Analítica / Reflexiva / Argumentativa',
        description: 'Explorar múltiplos lados de uma questão, contextualizar com base histórica, cultural ou técnica e promover reflexão crítica.',
        tone_of_voice: 'Neutro, analítico ou sóbrio (pode conter sarcasmo)',
        target_audience: 'Leitores que buscam profundidade e embasamento técnico/histórico',
        editorial_guidelines: {
            goal: 'Incentivar o leitor a formar opinião com base em argumentos sólidos.',
            characteristics: [
                'Contexto histórico e dados de base',
                'Exposição de diferentes visões (contrapontos reais)',
                'Incentiva questionamento e posicionamento consciente'
            ]
        }
    },
    {
        style_key: 'informativa',
        name: 'Informativa / Noticiosa',
        description: 'Informar de forma clara, objetiva e rápida sobre acontecimentos relevantes.',
        tone_of_voice: 'Impessoal, direto e objetivo',
        target_audience: 'Pessoas que buscam atualização rápida e fatos verídicos',
        editorial_guidelines: {
            goal: 'Cobertura de fatos em tempo real com clareza.',
            characteristics: [
                'Tom impessoal',
                'Foco em veracidade',
                'Contextualização de breaking news'
            ]
        }
    },
    {
        style_key: 'educacional',
        name: 'Educacional / Didática',
        description: 'Ensinar ou explicar algo de forma clara, com linguagem acessível.',
        tone_of_voice: 'Didático, claro e encorajador',
        target_audience: 'Estudantes ou curiosos buscando aprender novas habilidades ou conceitos',
        editorial_guidelines: {
            goal: 'Linguagem simples sem simplificar o conteúdo.',
            characteristics: [
                'Estrutura passo a passo',
                'Uso de listas, exemplos e metáforas'
            ]
        }
    },
    {
        style_key: 'satirica',
        name: 'Satírica / Irônica',
        description: 'Criticar com humor, ironia ou exagero inteligente.',
        tone_of_voice: 'Provocativo, criativo e não convencional',
        target_audience: 'Público que aprecia crítica social ácida e humor inteligente',
        editorial_guidelines: {
            goal: 'Criticar temas sérios com tom de brincadeira.',
            characteristics: [
                'Linguagem cômica',
                'Forte potencial de viralização'
            ]
        }
    },
    {
        style_key: 'comportamental',
        name: 'Comportamental / Social',
        description: 'Explorar dilemas, hábitos e fenômenos do comportamento humano.',
        tone_of_voice: 'Empático, observador e contemporâneo',
        target_audience: 'Pessoas interessadas em auto-conhecimento e fenômenos sociais',
        editorial_guidelines: {
            goal: 'Abordagem relacional sobre dilemas do cotidiano.',
            characteristics: [
                'Tom empático',
                'Dados psicológicos ou antropológicos'
            ]
        }
    },
    {
        style_key: 'narrativa',
        name: 'Narrativa / Storytelling',
        description: 'Criar conexão por meio de histórias reais ou ficcionais.',
        tone_of_voice: 'Literário, emocional ou cinematográfico',
        target_audience: 'Leitores que preferem aprendizado e conexão via jornadas e personagens',
        editorial_guidelines: {
            goal: 'Criar conexão emocional intensa.',
            characteristics: [
                'Técnicas narrativas (personagem, conflito, virada)',
                'Estilo fluido e envolvente'
            ]
        }
    }
];

const articleStyles = [
    { key: 'analitico', name: 'Artigo Analítico', desc: 'Exploração profunda de um tema com dados e contexto.' },
    { key: 'opiniao', name: 'Opinião Embasada', desc: 'Posicionamento pessoal fundamentado em fatos históricos.' },
    { key: 'comparativo', name: 'Comparativo Técnico', desc: 'Análise lado a lado com critérios claros de avaliação.' },
    { key: 'noticia', name: 'Notícia Comentada', desc: 'Relato de fato recente seguido de breve análise editorial.' },
    { key: 'tutorial', name: 'Tutorial Passo a Passo', desc: 'Guia prático para execução de uma tarefa específica.' },
    { key: 'guia', name: 'Guia Definitivo', desc: 'Compilado completo sobre um assunto ou conceito.' },
    { key: 'lista', name: 'Lista / Top 10', desc: 'Seleção curada de itens ou dicas organizadas por relevância.' },
    { key: 'cronica', name: 'Crônica / Reflexão', desc: 'Texto literário sobre fenômenos do cotidiano ou comportamento.' },
    { key: 'entrevista', name: 'Entrevista', desc: 'Diálogo estruturado com foco em insights emocionais ou técnicos.' },
    { key: 'case', name: 'Estudo de Caso', desc: 'História real detalhada de um sucesso ou fracasso.' }
];

async function seed() {
    try {
        console.log('Seeding Blog Styles...');
        for (const style of blogStyles) {
            await pool.query(
                `INSERT INTO blog_styles (id, style_key, name, description, tone_of_voice, target_audience, editorial_guidelines)
                 VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), tone_of_voice=VALUES(tone_of_voice)`,
                [uuidv4(), style.style_key, style.name, style.description, style.tone_of_voice, style.target_audience, JSON.stringify(style.editorial_guidelines)]
            );
        }

        console.log('Seeding Article Styles...');
        for (const style of articleStyles) {
            await pool.query(
                `INSERT INTO article_styles (id, style_key, name, description)
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)`,
                [uuidv4(), style.key, style.name, style.desc]
            );
        }

        console.log('Seed successful!');
        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
