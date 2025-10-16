<?php
// Arquivo: cancelar_consulta.php

session_start();
require_once 'conexao.php'; // Inclui a conexão PDO

header('Content-Type: application/json');

// --- SIMULAÇÃO DE ID DO PACIENTE LOGADO ---
$paciente_id = 1; // SUBSTITUA PELA VARIÁVEL DE SESSÃO REAL
// --- FIM DA SIMULAÇÃO ---

if (!$paciente_id) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado.']);
    exit;
}

// Verifica se o ID da consulta foi enviado via POST
if (!isset($_POST['consulta_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID da consulta não fornecido.']);
    exit;
}

$consulta_id = $_POST['consulta_id'];

try {
    // 1. Atualiza o status da consulta para 'Cancelada'
    // IMPORTANTE: Garante que APENAS o paciente dono da consulta possa cancelar.
    $sql = "UPDATE agendamentos 
            SET status = 'Cancelada' 
            WHERE id = :id AND paciente_id = :paciente_id AND status IN ('Agendada', 'Confirmada')";
            
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $consulta_id, PDO::PARAM_INT);
    $stmt->bindParam(':paciente_id', $paciente_id, PDO::PARAM_INT);
    $stmt->execute();

    // 2. Verifica se alguma linha foi afetada
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Consulta cancelada com sucesso.']);
    } else {
        http_response_code(404); // Not Found ou Forbidden
        echo json_encode(['success' => false, 'message' => 'Consulta não encontrada, não pertence ao usuário, ou já foi finalizada/cancelada.']);
    }

} catch (PDOException $e) {
    error_log("Erro ao cancelar consulta: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro interno ao processar o cancelamento.']);
}
?>