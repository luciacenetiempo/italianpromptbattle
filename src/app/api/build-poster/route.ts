import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import fs from 'fs/promises';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const GENERATED_DIR = path.join(PUBLIC_DIR, 'generated');
const LOGO_PATH = path.join(PUBLIC_DIR, 'assets/img/logo-w.png');
const FOOTER_PATH = path.join(PUBLIC_DIR, 'assets/img/poster-footer.png');
const FONT_REGULAR = path.join(PUBLIC_DIR, 'fonts/gellix/Gellix-Regular.woff2');
const FONT_MEDIUM = path.join(PUBLIC_DIR, 'fonts/gellix/Gellix-Medium.woff2');
const FONT_SEMIBOLD = path.join(PUBLIC_DIR, 'fonts/gellix/Gellix-SemiBold.woff2');

export async function POST(request: NextRequest) {
  try {
    const { imagePath, fraseAndromeda, firmaAutore } = await request.json();
    if (!imagePath) {
      return NextResponse.json({ error: 'imagePath richiesto' }, { status: 400 });
    }

    // Carica l'immagine generata
    const inputImagePath = path.join(GENERATED_DIR, imagePath.replace(/^\/+/, ''));
    await fs.access(inputImagePath);
    const img = await loadImage(inputImagePath);

    // Dimensioni fisse del poster finale
    const posterWidth = 1240;
    const posterHeight = 1754;

    console.log('Dimensioni poster:', { posterWidth, posterHeight });
    console.log('Dimensioni immagine originale:', { width: img.width, height: img.height });

    // Canvas
    const canvas = createCanvas(posterWidth, posterHeight);
    const ctx = canvas.getContext('2d');

    // Registra i font Gellix
    try {
      registerFont(FONT_REGULAR, { family: 'Gellix' });
      registerFont(FONT_MEDIUM, { family: 'Gellix', weight: '500' });
      registerFont(FONT_SEMIBOLD, { family: 'Gellix', weight: '600' });
      console.log('Font Gellix registrati con successo');
    } catch (e) {
      console.error('Errore registrazione font:', e);
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
      ctx.font = '600 48px Gellix';
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
    ctx.font = '600 30px Gellix';
    ctx.fillText('MILANO', textX, 60);
    
    // Novembre 2025 in 25px, line height 30px
    ctx.font = '600 25px Gellix';
    ctx.fillText('Novembre 2025', textX, 90);

    // Frase Andromeda e firma in basso
    const frase = fraseAndromeda || '"Se non stai rischiando, non stai creando."';
    const firma = firmaAutore ? `created by — ${firmaAutore}` : '';
    
    // Frase Andromeda: posizione Y=1340px, font size 48px, line height 48px, area max 820px
    ctx.font = '500 48px Gellix';
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
    ctx.font = '400 20px Gellix';
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

    // Salva il poster finale
    const outName = `poster-final-${Date.now()}.png`;
    const outPath = path.join(GENERATED_DIR, outName);
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(outPath, buffer);

    console.log('Poster finale salvato:', outPath);
    return NextResponse.json({ success: true, url: `/generated/${outName}` });
  } catch (error) {
    console.error('Errore build-poster:', error);
    return NextResponse.json({ error: 'Errore durante la creazione del poster', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 