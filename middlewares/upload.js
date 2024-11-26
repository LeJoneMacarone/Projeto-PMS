const multer = require('multer');

// Configuração de armazenamento na memória (para BLOBs no banco de dados)
const memoryStorage = multer.memoryStorage();

// Filtro de tipos de arquivos
const fileFilter = (allowedTypes) => {
    return (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // Aceita o arquivo
        } else {
            cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
        }
    };
};

// Upload para documentos (ex.: PDFs)
const uploadDocument = multer({
    storage: memoryStorage,
    fileFilter: fileFilter(['application/pdf']), // Apenas PDFs
    limits: { fileSize: 5 * 1024 * 1024 }, // Máx. 5MB
});

// Upload para imagens (ex.: perfil de usuário)
const uploadImage = multer({
    storage: memoryStorage,
    fileFilter: fileFilter(['image/jpeg', 'image/png']), // Apenas JPEG e PNG
    limits: { fileSize: 2 * 1024 * 1024 }, // Máx. 2MB
});

module.exports = {
    uploadDocument,
    uploadImage,
};