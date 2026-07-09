// admin/products.js

/**
 * Recupera l'elenco di tutti i prodotti direttamente da Supabase
 * @returns {Promise<Array>}
 */
async function getProducts() {
    const supabase = await window.getSupabaseClient();
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        throw error;
    }
    return data || [];
}

/**
 * Aggiunge un nuovo prodotto direttamente in Supabase
 * @param {Object} product - I dati del prodotto da inserire
 * @returns {Promise<Object>} - Il prodotto creato
 */
async function addProduct(product) {
    const supabase = await window.getSupabaseClient();
    const { data, error } = await supabase
        .from('products')
        .insert([{
            squadra: product.squadra,
            categoria: product.categoria,
            versione: product.versione,
            stagione: product.stagione,
            prezzo: parseFloat(product.prezzo),
            immagine: product.immagine
        }])
        .select();

    if (error) {
        throw error;
    }
    return data[0];
}

/**
 * Aggiorna un prodotto esistente direttamente in Supabase
 * @param {string|number} id - L'ID del prodotto da modificare
 * @param {Object} product - I dati aggiornati del prodotto
 * @returns {Promise<Object>} - Il prodotto modificato
 */
async function updateProduct(id, product) {
    const supabase = await window.getSupabaseClient();
    const { data, error } = await supabase
        .from('products')
        .update({
            squadra: product.squadra,
            categoria: product.categoria,
            versione: product.versione,
            stagione: product.stagione,
            prezzo: parseFloat(product.prezzo),
            immagine: product.immagine
        })
        .eq('id', id)
        .select();

    if (error) {
        throw error;
    }
    return data[0];
}

/**
 * Elimina un prodotto direttamente da Supabase
 * @param {string|number} id - L'ID del prodotto da eliminare
 * @returns {Promise<any>}
 */
async function deleteProduct(id) {
    const supabase = await window.getSupabaseClient();
    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .select();

    if (error) {
        throw error;
    }
    return data;
}

// Espone le funzioni dei prodotti globalmente
window.getProducts = getProducts;
window.addProduct = addProduct;
window.updateProduct = updateProduct;
window.deleteProduct = deleteProduct;
