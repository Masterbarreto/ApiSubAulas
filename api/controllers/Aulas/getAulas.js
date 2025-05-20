import { getDb } from '../../db.js';

export const getAulas = async (req, res) => {
    try {
        const db = await getDb();
        const aulas = await db.collection('aulas').find({ concluida: false }).toArray();
        const resultado = aulas.map(aula => ({
            _id: aula._id,
            titulo: aula.titulo,      // Corrija para "titulo" se no banco não tem acento
            DesAula: aula.DesAula     // Descrição da aula
        }));
        res.status(200).json(resultado);
    } catch (err) {
        console.error('Erro ao buscar aulas:', err);
        res.status(500).json({ error: 'Erro ao buscar aulas' });
    }
};