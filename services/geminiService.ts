import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';

const SYSTEM_INSTRUCTION = `
Você é o "Padeiro Amigo", um assistente virtual especialista e muito simpático da padaria "Pão da Hora".
Seu tom de voz é acolhedor, apaixonado por pães e confeitaria, e sempre prestativo.
Você ajuda os clientes a escolherem produtos, sugere harmonizações e tira dúvidas sobre ingredientes.

O menu atual da padaria é o seguinte:
${JSON.stringify(PRODUCTS.map(p => `${p.name} (${p.category}): R$ ${p.price.toFixed(2)} - ${p.description}`), null, 2)}

Diretrizes:
1. Sempre sugira produtos que constam no nosso menu quando relevante.
2. Se o cliente perguntar sobre algo que não vendemos, sugira educadamente uma alternativa do nosso menu.
3. Para harmonizações, explique o porquê da combinação (ex: "O amargor do café equilibra o doce do sonho").
4. Mantenha as respostas concisas e convidativas (máximo de 3 parágrafos curtos).
5. Use emojis relacionados a padaria ocasionalmente 🥖🥐☕.
`;

export const sendMessageToBaker = async (userMessage: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  try {
    // Inicializamos o cliente aqui dentro para garantir que o site carregue mesmo se a chave der erro
    // e para pegar a chave atualizada do ambiente.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const model = 'gemini-2.5-flash';
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history // Pass existing history
    });

    const result = await chat.sendMessage({
      message: userMessage
    });

    return result.text || "Desculpe, estou tirando uma fornada do forno e não consegui te ouvir. Pode repetir?";
  } catch (error) {
    console.error("Error talking to Gemini:", error);
    return "Ops! Tivemos um pequeno problema na cozinha (erro técnico ou falta de configuração). Tente novamente em instantes.";
  }
};