import { getDb } from '../../db.js';
import { ObjectId } from 'mongodb';

export const getPdf = async (req, res) => {
  try {
    const db = await getDb();
    const arquivosCol = db.collection('arquivosAulas');
    const arquivo = await arquivosCol.findOne({ _id: new ObjectId(req.params.id) });

    if (!arquivo) {
      return res.status(404).json({ error: 'Arquivo não encontrado.' });
    }

    res.set({
      'Content-Type': arquivo.mimetype,
      'Content-Disposition': `attachment; filename="${arquivo.nome}"`
    });
    res.send(arquivo.data);
  } catch (err) {
    console.error('Erro ao buscar arquivo:', err);
    res.status(500).json({ error: 'Erro ao buscar o arquivo.' });
  }
};
