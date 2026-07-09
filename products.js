// admin/upload.js

/**
 * Carica un file immagine direttamente nello storage di Supabase.
 * @param {File} file - Il file da caricare.
 * @param {Function} onProgress - Callback che accetta una percentuale (0-100).
 * @returns {Promise<string>} - L'URL pubblico dell'immagine caricata.
 */
async function uploadImageToSupabase(file, onProgress) {
    const supabase = await window.getSupabaseClient();
    
    // 1. Assicuriamoci che esista il bucket 'products'
    try {
        await supabase.storage.createBucket('products', {
            public: true,
            fileSizeLimit: 5242880, // 5MB limit
            allowedMimeTypes: ['image/*']
        });
    } catch (e) {
        // Se esiste già o non abbiamo permessi di creazione, andiamo avanti
        console.log("Controllo bucket completato o già esistente.");
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Simulazione di progresso realistica ed elegante durante la chiamata
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
        if (currentProgress < 90) {
            currentProgress += Math.floor(Math.random() * 15) + 5;
            if (currentProgress > 90) currentProgress = 90;
            if (onProgress) onProgress(currentProgress);
        }
    }, 100);

    try {
        const { data, error } = await supabase.storage
            .from('products')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        clearInterval(progressInterval);

        if (error) {
            throw error;
        }

        if (onProgress) onProgress(100);

        // 2. Ottieni l'URL pubblico dell'immagine caricata
        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (err) {
        clearInterval(progressInterval);
        console.error("Errore nel caricamento dell'immagine:", err);
        throw err;
    }
}

window.uploadImageToSupabase = uploadImageToSupabase;
