import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_C6w47E2i_FtKAPZkEYkM2WQHWQoWGv4zL');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Estrai i dati dal form
    const { name, company, email, message } = formData;
    
    // Prepara il contenuto dell'email
    const emailContent = `
Nuova richiesta di partnership per Italian Prompt Battle!

Dettagli della richiesta:
- Nome: ${name}
- Azienda: ${company}
- Email: ${email}
- Messaggio: ${message || 'Nessun messaggio fornito'}

Data e ora: ${new Date().toLocaleString('it-IT')}
    `;

    // Invia l'email usando Resend
    const { data, error } = await resend.emails.send({
      // from: 'onboarding@resend.dev',
      from: 'Partnership - IPB <onboarding@resend.dev>',
      to: 'italianpromptbattle@gmail.com',
      subject: `Nuova richiesta di partnership da ${company}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    });

    if (error) {
      console.error('Errore Resend:', error);
      return NextResponse.json(
        { error: 'Errore nell\'invio dell\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);
    return NextResponse.json(
      { error: 'Errore nell\'invio dell\'email' },
      { status: 500 }
    );
  }
} 