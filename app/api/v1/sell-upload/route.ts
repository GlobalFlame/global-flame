import { supabase } from '../../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title');
    const price = parseFloat(formData.get('price'));
    const category = formData.get('category') || 'digital'; // Default or from form

    if (!file || !title || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (price < 0.01 || price > 20.00) {
      return NextResponse.json({ error: 'Price must be between .01 and .00' }, { status: 400 });
    }

    const userId = 'mock-user-id'; // Replace with Supabase Auth later

    const filePath = ${userId}/;
    const { error: uploadError } = await supabase.storage
      .from('flames')
      .upload(filePath, file);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { error: insertError } = await supabase
      .from('market_items')
      .insert({
        user_id: userId,
        category,
        title,
        price,
        file_path: filePath,
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Upload successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
