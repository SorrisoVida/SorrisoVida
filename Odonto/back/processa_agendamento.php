<?php
// Arquivo: processa_agendamento.php

// 1. Inicia a sessão (necessário para obter o ID do usuário logado)
session_start();

// 2. Inclui o arquivo de conexão PDO
require_once 'conexao.php'; // Usa a conexão PDO que você já criou ($pdo)

// --- SIMULAÇÃO DE ID DO PACIENTE LOGADO ---
// Em um sistema real, o ID viria da sessão após o login.
// Para este exemplo acadêmico, defina um ID de paciente existente na sua tabela 'pacientes'.
$paciente_id = 1; // SUBSTITUA PELA VARIÁVEL DE SESSÃO REAL: $_SESSION['paciente_id'] ?? null;
// --- FIM DA SIMULAÇÃO ---

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Se o ID do paciente não estiver disponível (não logado), interrompe
    if (!$paciente_id) {
        die("Erro: Usuário não está logado para realizar um agendamento.");
    }

    // 3. Função de Sanitização (reutilizada)
    function sanitize_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    // 4. Recebimento e Sanitização dos Dados
    $servico        = sanitize_input($_POST['servico'] ?? '');
    $dataConsulta   = sanitize_input($_POST['dataConsulta'] ?? '');
    $dentista       = sanitize_input($_POST['dentista'] ?? '');
    $horario        = sanitize_input($_POST['horario'] ?? '');
    $observacoes    = sanitize_input($_POST['observacoes'] ?? '');

    // 5. Validações básicas (você pode expandir isso)
    if (empty($servico) || empty($dataConsulta) || empty($dentista) || empty($horario)) {
        die("Erro: Todos os campos obrigatórios (Serviço, Data, Dentista, Horário) devem ser preenchidos.");
    }
    
    // 6. Inserção no Banco de Dados (Prepared Statement)
    try {
        $sql = "INSERT INTO agendamentos (paciente_id, servico, dentista, data_consulta, horario, observacoes) 
                VALUES (:paciente_id, :servico, :dentista, :data_consulta, :horario, :obs)";
        
        $stmt = $pdo->prepare($sql);

        // Ligação dos parâmetros (Binding)
        $stmt->bindParam(':paciente_id', $paciente_id, PDO::PARAM_INT);
        $stmt->bindParam(':servico', $servico);
        $stmt->bindParam(':dentista', $dentista);
        $stmt->bindParam(':data_consulta', $dataConsulta);
        $stmt->bindParam(':horario', $horario);
        $stmt->bindParam(':obs', $observacoes);

        $stmt->execute();

        // 7. Feedback de Sucesso
        echo "<h2>✅ Agendamento Confirmado!</h2>";
        echo "<p>Sua consulta para **{$servico}** com **{$dentista}** na data **{$dataConsulta}** às **{$horario}** foi agendada com sucesso.</p>";
        echo '<p><a href="inicial.html">Voltar ao Início</a></p>';
        
    } catch (PDOException $e) {
        // Erro no Banco de Dados
        echo "<h2>🚫 Erro ao Agendar Consulta</h2>";
        echo "Detalhes do Erro: " . $e->getMessage();
    }
    
} else {
    echo "Acesso inválido. Por favor, utilize o formulário de agendamento.";
}
?>