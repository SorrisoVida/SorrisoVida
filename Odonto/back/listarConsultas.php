<?php
// Arquivo: listar_consultas.php

session_start();
require_once 'conexao.php'; // Inclui a conexão PDO

header('Content-Type: application/json'); // Garante que a resposta seja JSON

// --- SIMULAÇÃO DE ID DO PACIENTE LOGADO ---
$paciente_id = 1; // SUBSTITUA PELA VARIÁVEL DE SESSÃO REAL: $_SESSION['paciente_id'] ?? null;
// --- FIM DA SIMULAÇÃO ---

if (!$paciente_id) {
    http_response_code(401);
    echo json_encode(['error' => 'Usuário não autenticado.']);
    exit;
}

try {
    // Busca todas as consultas do paciente, ordenadas pela data (mais próximas primeiro)
    $sql = "SELECT id, servico, dentista, data_consulta, horario, status 
            FROM agendamentos 
            WHERE paciente_id = :paciente_id
            ORDER BY data_consulta ASC, horario ASC";
            
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':paciente_id', $paciente_id, PDO::PARAM_INT);
    $stmt->execute();

    // Obtém todos os resultados como um array associativo
    $consultas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Envia o array de consultas como JSON para o JavaScript
    echo json_encode($consultas);

} catch (PDOException $e) {
    // Loga o erro internamente e retorna uma mensagem genérica
    error_log("Erro ao buscar consultas: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Ocorreu um erro interno ao carregar as consultas.']);
}
?>