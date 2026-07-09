import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Enable JSON body parsing for API requests
app.use(express.json({ limit: '10mb' }));

// Serve static files from root directory
app.use(express.static(__dirname));

// Lazy initialization of the Supabase client to prevent startup crash if keys are missing
let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Warning: SUPABASE_URL or SUPABASE_ANON_KEY not set. Falling back to local database.");
    return null;
  }
  
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseClient;
  } catch (err) {
    console.warn("⚠️ Information: Supabase client is not initialized or invalid credentials:", err.message);
    return null;
  }
}

// GET /api/config - Ritorna la configurazione di Supabase per il seeding lato client
app.get('/api/config', (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  res.json({ supabaseUrl: supabaseUrl || null, supabaseAnonKey: supabaseAnonKey || null });
});

// GET /api/products - Ottieni i prodotti da Supabase. Ritorna vuoto in caso di errore o non configurato
app.get('/api/products', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.json({ success: false, source: 'local_fallback', products: [] });
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn("⚠️ Information: Unable to fetch products from Supabase (this is normal if the table doesn't exist yet):", error.message);
      return res.json({ success: false, error: error.message, products: [] });
    }

    if (!data || data.length === 0) {
      return res.json({ success: true, source: 'supabase_empty', products: [] });
    }

    return res.json({ success: true, source: 'supabase', products: data });
  } catch (err) {
    console.warn("⚠️ Information: Server error or exception during fetch from Supabase:", err.message);
    return res.json({ success: false, error: err.message, products: [] });
  }
});

// POST /api/products - Crea un prodotto (predisposizione pannello amministratore)
app.post('/api/products', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(503).json({ success: false, error: "Supabase non configurato" });
  }

  try {
    const { squadra, categoria, versione, stagione, prezzo, immagine } = req.body;
    if (!squadra || !categoria || !versione || !stagione) {
      return res.status(400).json({ success: false, error: "Campi obbligatori mancanti: squadra, categoria, versione, stagione" });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ squadra, categoria, versione, stagione, prezzo: prezzo || 23.99, immagine: immagine || "" }])
      .select();

    if (error) {
      console.warn("⚠️ Error inserting product:", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({ success: true, product: data[0] });
  } catch (err) {
    console.warn("⚠️ Server error during insert:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/products/:id - Modifica un prodotto (predisposizione pannello amministratore)
app.put('/api/products/:id', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(503).json({ success: false, error: "Supabase non configurato" });
  }

  try {
    const { id } = req.params;
    const { squadra, categoria, versione, stagione, prezzo, immagine } = req.body;

    const { data, error } = await supabase
      .from('products')
      .update({ squadra, categoria, versione, stagione, prezzo, immagine })
      .eq('id', id)
      .select();

    if (error) {
      console.warn("⚠️ Error updating product:", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, error: "Prodotto non trovato" });
    }

    return res.json({ success: true, product: data[0] });
  } catch (err) {
    console.warn("⚠️ Server error during update:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/products/:id - Elimina un prodotto (predisposizione pannello amministratore)
app.delete('/api/products/:id', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(503).json({ success: false, error: "Supabase non configurato" });
  }

  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.warn("⚠️ Error deleting product:", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({ success: true, deleted: data });
  } catch (err) {
    console.warn("⚠️ Server error during delete:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products/seed - Popola Supabase in blocco se vuoto (utile per prima configurazione)
app.post('/api/products/seed', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(503).json({ success: false, error: "Supabase non configurato" });
  }

  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, error: "Fornire una lista di prodotti valida nell'array 'products'" });
    }

    // Seleziona prima per verificare se esistono prodotti per evitare di duplicare
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.warn("⚠️ Error counting products during seed:", countError.message);
      return res.status(500).json({ success: false, error: countError.message });
    }

    if (count > 0) {
      return res.json({ success: true, message: "Il database Supabase contiene già dei prodotti. Seeding ignorato per sicurezza.", count });
    }

    const cleanProducts = products.map(p => ({
      squadra: p.squadra,
      categoria: p.categoria,
      versione: p.versione,
      stagione: p.stagione,
      prezzo: p.prezzo || 23.99,
      immagine: p.immagine || ""
    }));

    const { data, error } = await supabase
      .from('products')
      .insert(cleanProducts)
      .select();

    if (error) {
      console.warn("⚠️ Error batch inserting products during seed:", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({ success: true, message: "Seeding completato con successo!", count: data.length });
  } catch (err) {
    console.warn("⚠️ Server error during seed:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback all routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
