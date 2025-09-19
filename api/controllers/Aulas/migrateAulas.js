import { getDb } from "../../db.js";

/**
 * Script de migração para converter aulas do formato antigo para o novo formato
 * Converte campos "curso" e "Turma" para arrays "cursos" e "turmas"
 */
export const migrateAulasFormat = async () => {
    try {
        const db = await getDb();
        const aulasCol = db.collection('aulas');
        
        // Busca todas as aulas que ainda têm o formato antigo
        const aulasAntigas = await aulasCol.find({
            $or: [
                { curso: { $exists: true, $type: "string" } },
                { Turma: { $exists: true, $type: "string" } }
            ]
        }).toArray();

        console.log(`Encontradas ${aulasAntigas.length} aulas para migrar.`);

        let migratedCount = 0;

        for (const aula of aulasAntigas) {
            const updateFields = {};

            // Migra o campo curso para cursos (array)
            if (aula.curso && typeof aula.curso === 'string') {
                updateFields.cursos = [aula.curso];
                updateFields.$unset = { ...updateFields.$unset, curso: "" };
            }

            // Migra o campo Turma para turmas (array)
            if (aula.Turma && typeof aula.Turma === 'string') {
                updateFields.turmas = [aula.Turma];
                updateFields.$unset = { ...updateFields.$unset, Turma: "" };
            }

            if (Object.keys(updateFields).length > 0) {
                await aulasCol.updateOne(
                    { _id: aula._id },
                    {
                        $set: updateFields,
                        ...(updateFields.$unset && { $unset: updateFields.$unset })
                    }
                );
                migratedCount++;
            }
        }

        console.log(`Migração concluída! ${migratedCount} aulas foram atualizadas.`);
        return { success: true, migratedCount };

    } catch (error) {
        console.error('Erro durante a migração:', error);
        return { success: false, error: error.message };
    }
};

// Função para executar a migração via API
export const runMigration = async (req, res) => {
    try {
        const result = await migrateAulasFormat();
        
        if (result.success) {
            res.status(200).json({
                message: 'Migração executada com sucesso!',
                migratedCount: result.migratedCount
            });
        } else {
            res.status(500).json({
                error: 'Erro durante a migração',
                details: result.error
            });
        }
    } catch (error) {
        console.error('Erro ao executar migração:', error);
        res.status(500).json({
            error: 'Erro interno do servidor durante a migração'
        });
    }
};