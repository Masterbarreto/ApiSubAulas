import { getDb } from '../../db.js';

export const getAulas = async (req, res) => {
    try {
        const db = await getDb();
        const aulas = await db.collection('aulas').find({ concluida: false }).toArray();
        const resultado = aulas.map(aula => ({
            _id: aula._id,
            título: aula.título,
            Horario: aula.Horario,
            DesAula: aula.DesAula
        }));
        res.status(200).json(resultado);
    } catch (err) {
        console.error('Erro ao buscar aulas:', err);
        res.status(500).json({ error: 'Erro ao buscar aulas' });
    }
};