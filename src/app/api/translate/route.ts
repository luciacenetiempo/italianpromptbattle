import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Testo richiesto' },
        { status: 400 }
      );
    }

    // Utilizzo Google Translate API (gratuito per piccoli volumi)
    // In alternativa, potresti usare DeepL, Azure Translator, o altri servizi
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=en&dt=t&q=${encodeURIComponent(text)}`);
    
    if (!response.ok) {
      throw new Error('Errore nella traduzione');
    }

    const data = await response.json();
    
    // La risposta di Google Translate è un array complesso
    // Il testo tradotto è nel primo elemento del primo array
    const translatedText = data[0]?.[0]?.[0] || text;
    
    return NextResponse.json({ 
      success: true, 
      originalText: text,
      translatedText: translatedText 
    });
    
  } catch (error) {
    console.error('Errore nella traduzione:', error);
    return NextResponse.json(
      { error: 'Errore durante la traduzione' },
      { status: 500 }
    );
  }
} 