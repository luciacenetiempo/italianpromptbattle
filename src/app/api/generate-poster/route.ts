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

    let requestBody;
    try {
      requestBody = await request.json();
    } catch (jsonError) {
      console.error('Error parsing request body:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { prompt } = requestBody;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json( 
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('Generating poster for prompt:', prompt);

    let result;
    try {
      result = await replicate.run(
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
    } catch (replicateError) {
      console.error('Replicate API error:', replicateError);
      if (replicateError instanceof Error) {
        throw new Error(`Replicate API error: ${replicateError.message}`);
      }
      throw new Error('Replicate API error: Unknown error');
    }
    
    console.log('Raw result from Replicate:', result);
    console.log('Result type:', typeof result);
    console.log('Result constructor:', result?.constructor?.name);

    // Replicate può restituire diversi formati a seconda del modello
    let imageUrl: string;

    if (Array.isArray(result) && result.length > 0) {
      const output = result[0];
      console.log('Output from Replicate (array):', output);
      console.log('Output type:', typeof output);

      // Se è già una stringa URL
      if (typeof output === 'string') {
        imageUrl = output;
      }
      // Se è un oggetto con metodo url()
      else if (output && typeof output.url === 'function') {
        const urlObj = output.url();
        imageUrl = urlObj?.href || urlObj?.toString() || String(output);
      }
      // Se è un oggetto con proprietà url come stringa
      else if (output && typeof output === 'object' && 'url' in output) {
        const urlProp = (output as { url?: string | { href?: string } }).url;
        if (typeof urlProp === 'string') {
          imageUrl = urlProp;
        } else if (urlProp && typeof urlProp === 'object' && 'href' in urlProp) {
          imageUrl = urlProp.href ?? String(urlProp);
        } else {
          imageUrl = String(urlProp ?? '');
        }
      }
      // Se è un File/Blob object
      else if (output && typeof output === 'object') {
        imageUrl = String(output);
      }
      else {
        throw new Error('Invalid output format from Replicate: ' + JSON.stringify(output));
      }
    }
    // Se il risultato è direttamente una stringa URL
    else if (typeof result === 'string') {
      imageUrl = result;
    }
    else {
      throw new Error('No valid output received from Replicate. Result: ' + JSON.stringify(result));
    }

    console.log('Image URL from Replicate:', imageUrl);

    // Valida che imageUrl sia un URL valido
    if (!imageUrl || typeof imageUrl !== 'string') {
      throw new Error('Invalid image URL received from Replicate');
    }

    // Verifica che sia un URL valido (inizia con http:// o https://)
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      throw new Error(`Invalid URL format: ${imageUrl}`);
    }

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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Dettagli più informativi per il debug
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = {
      message: errorMessage,
      type: error instanceof Error ? error.constructor.name : typeof error,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error instanceof Error ? error.stack : undefined
      })
    };
    
    return NextResponse.json(
      { 
        error: 'Failed to generate poster',
        details: errorMessage,
        ...(process.env.NODE_ENV === 'development' && errorDetails)
      },
      { status: 500 }
    );
  }
} 