import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { writeFile } from 'node:fs/promises';
import path from 'path'; 

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
 
export async function POST(request: NextRequest) {
  try {
    // Verifica che la variabile d'ambiente sia configurata
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error('REPLICATE_API_TOKEN non configurata');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json( 
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('Generating poster for prompt:', prompt);

    const result = await replicate.run(
      "luciacenetiempo/prompt-to-poster:dcd1e6e1dbab869ba5ae6df74feced87d07a82ac9539d196a6d7c97d7834bbbb",
      {
        input: {
          model: "dev",
          go_fast: true,
          lora_scale: 1.5,
          megapixels: "1",
          num_outputs: 1,
          aspect_ratio: "3:4",
          output_format: "png",
          guidance_scale: 3.5,
          output_quality: 100,
          prompt_strength: 0.8,
          extra_lora_scale: 1,
          num_inference_steps: 28,
          prompt: prompt + ' , flat black background, in style IPBSTYLE'
        }
      }
    );
    
    const [output] = result as unknown[];

    console.log('Generation completed:', output);
    console.log('Output type:', typeof output);
    console.log('Output constructor:', output?.constructor?.name);

    // Replicate restituisce un buffer dell'immagine, non un URL
    if (!output || typeof output !== 'object') {
      throw new Error('No valid output received from Replicate');
    }

    // Creiamo un nome file unico per l'immagine
    const timestamp = Date.now();
    const filename = `poster-${timestamp}.png`;
    const publicDir = path.join(process.cwd(), 'public', 'generated');
    const filePath = path.join(publicDir, filename);

    // Assicuriamoci che la directory esista
    try {
      await writeFile(filePath, output as Buffer);
      console.log('Image saved to:', filePath);
    } catch (error) {
      console.error('Error saving image:', error);
      throw new Error('Failed to save generated image');
    }

    // Restituiamo l'URL relativo per il frontend
    const imageUrl = `/generated/${filename}`;
    
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      prompt: prompt
    });

  } catch (error) {
    console.error('Error generating poster:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate poster',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 