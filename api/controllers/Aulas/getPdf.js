import { getDb } from '../../db.js';
import { ObjectId } from 'mongodb';

export const getPdf = async (req, res) => {
  try {
    const id = req.params.id || req.query.id;
    if (!id) return res.status(400).json({ error: 'ID não informado.' });

    const db = await getDb();
    const arquivosCol = db.collection('arquivosAulas');
    const arquivo = await arquivosCol.findOne({ _id: new ObjectId(id.trim()) });

    if (!arquivo) {
      return res.status(404).json({ error: 'Arquivo não encontrado.' });
    }

    // Garante que é Buffer
    let fileBuffer = arquivo.data;
    // Se vier como Binary do MongoDB, converte para Buffer
    if (fileBuffer && fileBuffer._bsontype === 'Binary' && fileBuffer.buffer) {
      fileBuffer = Buffer.from(fileBuffer.buffer);
    } else if (fileBuffer && fileBuffer.type === 'Buffer' && Array.isArray(fileBuffer.data)) {
      fileBuffer = Buffer.from(fileBuffer.data);
    }

    res.setHeader('Content-Type', arquivo.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${arquivo.nome}"`);
    res.status(200).end(fileBuffer); // <- igual ao Battisti
  } catch (err) {
    console.error('Erro ao buscar arquivo:', err);
    res.status(500).json({ error: 'Erro ao buscar o arquivo.' });
  }
};
