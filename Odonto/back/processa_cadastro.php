<?php
// Arquivo: processa_cadastro.php

// Inclui o arquivo de conexão
require_once 'conexao.php'; // Certifica-se de que a conexão ($pdo) está disponível

// Verifica se o formulário foi enviado através do método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- 1. Função de Sanitização (reutilizada do código anterior) ---
    function sanitize_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    // --- 2. Recebimento e Sanitização dos Dados ---
    $nomeCompleto     = sanitize_input($_POST['fullName']);
    $telefone         = sanitize_input($_POST['phone']);
    $email            = sanitize_input($_POST['email']);
    $senha            = $_POST['password']; // Senha sem sanitização HTML
    $confirmarSenha   = $_POST['confirmPassword'];
    $termosConcordados = isset($_POST['terms']) ? 1 : 0; // 1 (Sim) ou 0 (Não) para o DB

    // Array de erros para validação
    $erros = [];

    // --- 3. Validações (Essenciais) ---
    if (empty($nomeCompleto) || empty($telefone) || empty($email) || empty($senha) || empty($confirmarSenha)) {
        $erros[] = "Todos os campos marcados são obrigatórios.";
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erros[] = "O e-mail fornecido é inválido.";
    }
    if (strlen($senha) < 6) {
        $erros[] = "A senha deve ter no mínimo 6 caracteres.";
    }
    if ($senha !== $confirmarSenha) {
        $erros[] = "As senhas não coincidem.";
    }
    if ($termosConcordados === 0) {
         $erros[] = "Você deve concordar com os Termos de Uso.";
    }

    // --- 4. Processamento dos Dados e Inserção no DB ---

    if (empty($erros)) {
        try {
            // A. Cria o Hash da Senha (Segurança!)
            $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

            // B. Prepara a Query SQL (Prepared Statement)
            // Os sinais de interrogação (?) são placeholders para evitar Injeção SQL
            $sql = "INSERT INTO pacientes (nome_completo, telefone, email, senha_hash, termos_aceitos) 
                    VALUES (:nome, :tel, :email, :hash, :termos)";
            
            $stmt = $pdo->prepare($sql);

            // C. Binda (Liga) os parâmetros (valores) com os placeholders
            $stmt->bindParam(':nome', $nomeCompleto);
            $stmt->bindParam(':tel', $telefone);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':hash', $senha_hash);
            $stmt->bindParam(':termos', $termosConcordados, PDO::PARAM_INT); // Especifica que é um inteiro

            // D. Executa a Inserção
            $stmt->execute();

            // Mensagem de Sucesso
            echo "<h2>✅ Cadastro realizado com sucesso!</h2>";
            echo "<p>Bem-vindo(a), " . htmlspecialchars($nomeCompleto) . ". Seus dados foram salvos.</p>";
            
        } catch (PDOException $e) {
            // Se o e-mail for duplicado (UNIQUE), por exemplo.
            if ($e->getCode() == 23000) {
                echo "<h2>🚫 Erro no Cadastro</h2>";
                echo "<p>O e-mail **" . htmlspecialchars($email) . "** já está cadastrado.</p>";
            } else {
                // Outros erros do banco de dados (apenas para debug)
                echo "<h2>🚫 Erro Fatal no Banco de Dados</h2>";
                echo "Erro: " . $e->getMessage();
            }
        }
        
    } else {
        // Exibe os erros de validação
        echo "<h2>🚫 Erro(s) no Cadastro:</h2>";
        echo "<ul>";
        foreach ($erros as $erro) {
            echo "<li>" . $erro . "</li>";
        }
        echo "</ul>";
    }

} else {
    // Se o script foi acessado diretamente
    echo "Acesso inválido. Por favor, utilize o formulário de cadastro.";
}
?>