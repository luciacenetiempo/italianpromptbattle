import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const LOGO_PATH = path.join(PUBLIC_DIR, 'assets/img/logo-w.png');
const FOOTER_PATH = path.join(PUBLIC_DIR, 'assets/img/poster-footer.png');

// Configurazione font robusta per produzione
const getFontConfig = () => {
  // Font stack semplificato e compatibile con la maggior parte dei server
  const fontStack = [
    'Arial',
    'Helvetica', 
    'sans-serif'
  ];
  
  return fontStack.join(', ');
};

// Test di rendering del testo per verificare che i font funzionino
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testFontRendering = (ctx: any, font: string) => {
  try {
    ctx.font = `400 20px ${font}`;
    const testText = 'Test ABC 123 àèéìòù';
    const metrics = ctx.measureText(testText);
    console.log(`Test font ${font}:`, {
      width: metrics.width,
      actualBoundingBoxAscent: metrics.actualBoundingBoxAscent,
      actualBoundingBoxDescent: metrics.actualBoundingBoxDescent
    });
    return metrics.width > 0;
  } catch (error) {
    console.error(`Errore test font ${font}:`, error);
    return false;
  }
};

// Sanitizza il testo per rimuovere caratteri problematici
const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  // Rimuovi caratteri di controllo e caratteri non stampabili
  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Caratteri di controllo
    .replace(/[\uFFFD]/g, '') // Carattere di sostituzione Unicode
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Spazi zero-width
    .trim();
};

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, fraseAndromeda, firmaAutore } = await request.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl richiesto' }, { status: 400 });
    }

    // Scarica l'immagine dall'URL di Replicate
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
    }
    
    const imageBuffer = await response.arrayBuffer();
    const img = await loadImage(Buffer.from(imageBuffer));

    // Dimensioni fisse del poster finale
    const posterWidth = 1240;
    const posterHeight = 1754;

    console.log('Dimensioni poster:', { posterWidth, posterHeight });
    console.log('Dimensioni immagine originale:', { width: img.width, height: img.height });

    // Canvas
    const canvas = createCanvas(posterWidth, posterHeight);
    const ctx = canvas.getContext('2d');

    // Usa configurazione font robusta
    const primaryFont = getFontConfig();
    console.log('Usando font stack robusto per produzione');
    
    // Test di rendering del font
    testFontRendering(ctx, primaryFont);

    // Sfondo nero
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, posterWidth, posterHeight);

    // Immagine originale ridimensionata all'86% della larghezza del canvas, mantenendo proporzioni
    const imageWidth = posterWidth * 0.86; // 86% della larghezza del canvas
    const imageHeight = (img.height * imageWidth) / img.width; // Mantiene proporzioni
    const imageX = posterWidth * 0.06; // 6% dal lato sinistro
    const imageY = 0; // 0px dall'alto
    ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);

    console.log('Immagine originale ridimensionata:', { x: imageX, y: imageY, width: imageWidth, height: imageHeight });

    // Logo PNG in alto a sinistra
    try {
      const logoImg = await loadImage(LOGO_PATH);
      
      // Dimensioni logo: larghezza 320px, altezza proporzionale
      const logoWidth = 320;
      const logoHeight = (logoImg.height * logoWidth) / logoImg.width; // Mantiene proporzioni
      
      // Posizione: X=60px, Y=45px
      ctx.drawImage(logoImg, 60, 45, logoWidth, logoHeight);
      console.log('Logo PNG aggiunto con successo:', { x: 60, y: 45, width: logoWidth, height: logoHeight });
    } catch (e) {
      console.error('Errore caricamento logo PNG:', e);
      // Fallback: disegna un rettangolo per test
      ctx.fillStyle = '#dcaf6c';
      ctx.fillRect(60, 45, 320, 80);
      ctx.fillStyle = '#000000';
      ctx.font = `600 48px ${primaryFont}`;
      ctx.fillText('IPB LOGO', 80, 95);
      console.log('Fallback logo disegnato - più grande e visibile');
    }

    // Testo "MILANO" e "Novembre 2025" in alto a destra
    ctx.fillStyle = '#dcaf6c';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    
    // Posizione X: 40px dal bordo destro
    const textX = posterWidth - 40;
    
    // MILANO in 30px
    ctx.font = `600 30px ${primaryFont}`;
    ctx.fillText('MILANO', textX, 60);
    
    // Novembre 2025 in 25px, line height 30px
    ctx.font = `600 25px ${primaryFont}`;
    ctx.fillText('Novembre 2025', textX, 90);

    // Frase Andromeda e firma in basso
    const frase = sanitizeText(fraseAndromeda || '"Se non stai rischiando, non stai creando."');
    const firma = sanitizeText(firmaAutore ? `created by — ${firmaAutore}` : '');
    
    // Frase Andromeda: posizione Y=1340px, font size 48px, line height 48px, area max 820px
    ctx.font = `500 48px ${primaryFont}`;
    ctx.fillStyle = '#ffffff'; // Bianco
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Funzione per wrappare il testo
    const wrapText = (text: string, maxWidth: number) => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      return lines;
    };
    
    // Wrappa il testo e disegna le righe
    const wrappedLines = wrapText(frase, 820);
    const lineHeight = 48;
    
    wrappedLines.forEach((line, index) => {
      ctx.fillText(line, posterWidth / 2, 1340 + (index * lineHeight));
    });
    
    // Firma in basso
    ctx.font = `400 20px ${primaryFont}`;
    ctx.fillStyle = '#dc6f5a';
    ctx.fillText(firma, posterWidth / 2, 1340 + (wrappedLines.length * lineHeight) + 20);

    console.log('Testo aggiunto');

    // Footer in basso
    try {
      const footerImg = await loadImage(FOOTER_PATH);
      
      // Footer: posizione 0px dal basso, 0px da sinistra, tutta la larghezza
      const footerY = posterHeight - footerImg.height; // Posiziona dal basso
      ctx.drawImage(footerImg, 0, footerY, posterWidth, footerImg.height);
      console.log('Footer aggiunto con successo:', { x: 0, y: footerY, width: posterWidth, height: footerImg.height });
    } catch (e) {
      console.error('Errore caricamento footer:', e);
    }

    // Restituisce il buffer del poster finale
    const buffer = canvas.toBuffer('image/png');
    const base64 = buffer.toString('base64');
    
    console.log('Poster finale generato, size:', buffer.length);
    return NextResponse.json({ 
      success: true, 
      posterData: `data:image/png;base64,${base64}`,
      size: buffer.length
    });
  } catch (error) {
    console.error('Errore build-poster:', error);
    return NextResponse.json({ error: 'Errore durante la creazione del poster', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 