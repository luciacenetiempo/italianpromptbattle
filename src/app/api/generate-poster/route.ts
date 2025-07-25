import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate'; 

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

console.log('Replicate instance created with auth:', !!process.env.REPLICATE_API_TOKEN);
 
export async function POST(request: NextRequest) {
  try {
    // Debug: log delle variabili d'ambiente
    console.log('Environment check:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('REPLICATE_API_TOKEN exists:', !!process.env.REPLICATE_API_TOKEN);
    console.log('REPLICATE_API_TOKEN length:', process.env.REPLICATE_API_TOKEN?.length);
    console.log('REPLICATE_API_TOKEN starts with:', process.env.REPLICATE_API_TOKEN?.substring(0, 10));
    
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
    
    console.log('Raw result from Replicate:', result);
    console.log('Result type:', typeof result);
    console.log('Result constructor:', result?.constructor?.name);

    // Replicate restituisce un array con oggetti file
    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error('No valid output received from Replicate');
    }

    const output = result[0];
    console.log('Output from Replicate:', output);
    console.log('Output type:', typeof output);
    console.log('Output has url method:', typeof output?.url === 'function');

    // Ottieni l'URL dell'immagine
    const imageUrl = output.url().href;
    console.log('Image URL from Replicate:', imageUrl);

    // In produzione (Vercel), non possiamo scrivere file
    // Restituiamo direttamente l'URL di Replicate
    console.log('Using Replicate URL directly:', imageUrl);
    
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