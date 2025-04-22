import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      'chatbot.title': 'Chatbot',
      'chatbot.open': 'Ouvrir le Chatbot',
      'chatbot.placeholder': 'Posez votre question...',
      'chatbot.error': 'Erreur lors du traitement de votre demande.',
    },
  },
  en: {
    translation: {
      'chatbot.title': 'Chatbot',
      'chatbot.open': 'Open Chatbot',
      'chatbot.placeholder': 'Ask your question...',
      'chatbot.error': 'Error processing your request.',
    },
  },
  es: {
    translation: {
      'chatbot.title': 'Chatbot',
      'chatbot.open': 'Abrir Chatbot',
      'chatbot.placeholder': 'Haz tu pregunta...',
      'chatbot.error': 'Error al procesar tu solicitud.',
    },
  },
  pt: {
    translation: {
      'chatbot.title': 'Chatbot',
      'chatbot.open': 'Abrir Chatbot',
      'chatbot.placeholder': 'Faça sua pergunta...',
      'chatbot.error': 'Erro ao processar sua solicitação.',
    },
  },
  ar: {
    translation: {
      'chatbot.title': 'روبوت الدردشة',
      'chatbot.open': 'فتح روبوت الدردشة',
      'chatbot.placeholder': 'اطرح سؤالك...',
      'chatbot.error': 'خطأ أثناء معالجة طلبك.',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'fr',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;