import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import fs from 'fs/promises';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const LOGO_PATH = path.join(PUBLIC_DIR, 'assets/img/logo-w.png');
const FOOTER_PATH = path.join(PUBLIC_DIR, 'assets/img/poster-footer.png');

// URL dei font Gellix
const FONT_BASE_URL = 'https://www.italianpromptbattle.com/fonts/gellix';
const FONT_REGULAR_URL = `${FONT_BASE_URL}/Gellix-Regular.woff2`;
const FONT_MEDIUM_URL = `${FONT_BASE_URL}/Gellix-Medium.woff2`;
const FONT_SEMIBOLD_URL = `${FONT_BASE_URL}/Gellix-SemiBold.woff2`;

// Funzione per caricare font da URL
async function loadFontFromUrl(url: string, family: string, weight?: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch font: ${response.statusText}`);
    
    const buffer = await response.arrayBuffer();
    const tempPath = `/tmp/${family}-${weight || 'regular'}.woff2`;
    
    // Salva temporaneamente il font
    await fs.writeFile(tempPath, Buffer.from(buffer));
    registerFont(tempPath, { family, weight });
    console.log(`Font ${family} caricato con successo da ${url}`);
  } catch (error) {
    console.error(`Errore caricamento font ${family} da ${url}:`, error);
  }
}

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

    // Carica i font Gellix dall'URL del sito
    try {
      await loadFontFromUrl(FONT_REGULAR_URL, 'Gellix');
      await loadFontFromUrl(FONT_MEDIUM_URL, 'Gellix', '500');
      await loadFontFromUrl(FONT_SEMIBOLD_URL, 'Gellix', '600');
      console.log('Font Gellix caricati con successo dall\'URL');
    } catch (e) {
      console.error('Errore caricamento font Gellix dall\'URL, usando font di sistema:', e);
    }

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
      ctx.font = '600 48px Gellix, Arial, sans-serif';
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
    ctx.font = '600 30px Gellix, Arial, sans-serif';
    ctx.fillText('MILANO', textX, 60);
    
    // Novembre 2025 in 25px, line height 30px
    ctx.font = '600 25px Gellix, Arial, sans-serif';
    ctx.fillText('Novembre 2025', textX, 90);

    // Frase Andromeda e firma in basso
    const frase = fraseAndromeda || '"Se non stai rischiando, non stai creando."';
    const firma = firmaAutore ? `created by — ${firmaAutore}` : '';
    
    // Frase Andromeda: posizione Y=1340px, font size 48px, line height 48px, area max 820px
    ctx.font = '500 48px Gellix, Arial, sans-serif';
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
    ctx.font = '400 20px Gellix, Arial, sans-serif';
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