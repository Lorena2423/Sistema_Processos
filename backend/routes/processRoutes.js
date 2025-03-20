const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Cadastrar Processos (somente Procuradores)
router.post('/', authenticateToken, authorizeRole('procurador'), (req, res) => {
    const { numero, nome, assunto, status, descricao, data_inicio, data_fim, cliente_id } = req.body;
    const procurador_id = req.user.id;

    if (!numero || !nome || !assunto || !status || !cliente_id) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    const query = 'INSERT INTO processos (numero, nome, assunto, status, procurador_id, cliente_id, descricao, data_inicio, data_fim) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [numero, nome, assunto, status, procurador_id, cliente_id, descricao, data_inicio, data_fim], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar processo:', err);
            return res.status(500).json({ error: 'Erro ao cadastrar processo' });
        }
        res.status(201).json({ message: 'Processo cadastrado com sucesso', id: result.insertId });
    });
});

// Editar Processos (somente Procuradores que criaram o processo)
router.put('/:id', authenticateToken, authorizeRole('procurador'), (req, res) => {
    const { id } = req.params;
    const { nome, descricao, data_inicio, data_fim, cliente_id } = req.body;
    const procurador_id = req.user.id;

    db.query('SELECT procurador_id FROM processos WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Processo não encontrado' });
        }

        if (results[0].procurador_id !== procurador_id) {
            return res.status(403).json({ error: 'Você não tem permissão para editar esse processo' });
        }

        db.query(
            'UPDATE processos SET nome = ?, descricao = ?, data_inicio = ?, data_fim = ?, cliente_id = ? WHERE id = ?',
            [nome, descricao, data_inicio, data_fim, cliente_id, id],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Erro ao editar processo' });
                }
                res.json({ message: 'Processo atualizado com sucesso' });
            }
        );
    });
});

// Excluir Processos (somente Procuradores que criaram o processo)
router.delete('/:id', authenticateToken, authorizeRole('procurador'), (req, res) => {
    const { id } = req.params;
    const procurador_id = req.user.id;

    db.query('SELECT procurador_id FROM processos WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Processo não encontrado' });
        }

        if (results[0].procurador_id !== procurador_id) {
            return res.status(403).json({ error: 'Você não tem permissão para excluir esse processo' });
        }

        db.query('DELETE FROM processos WHERE id = ?', [id], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao excluir processo' });
            }
            res.json({ message: 'Processo excluído com sucesso' });
        });
    });
});

// Listar Processos do Usuário (Clientes e Procuradores)
router.get('/', authenticateToken, (req, res) => {
    const user_id = req.user.id;
    const query = req.user.role === 'procurador' ?
        'SELECT * FROM processos WHERE procurador_id = ?' :
        'SELECT * FROM processos WHERE cliente_id = ?';

    db.query(query, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar processos' });
        }
        res.json(results);
    });
});

// Obter detalhes de um processo específico
router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    db.query('SELECT * FROM processos WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Processo não encontrado' });
        }

        const processo = results[0];

        if (
            (req.user.role === 'cliente' && processo.cliente_id !== user_id) ||
            (req.user.role === 'procurador' && processo.procurador_id !== user_id)
        ) {
            return res.status(403).json({ error: 'Acesso negado ao processo' });
        }

        res.json(processo);
    });
});

module.exports = router;
