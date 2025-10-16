<?php
// Arquivo: conexao.php

// ------------------------------------------
// Configurações do Banco de Dados
// ------------------------------------------
define('DB_HOST', 'localhost'); // Geralmente 'localhost'
define('DB_NAME', 'dentacare_db'); // Nome do seu banco de dados
define('DB_USER', 'root'); // Seu usuário do banco (ex: 'root' no XAMPP)
define('DB_PASS', ''); // Sua senha do banco (ex: vazia '' no XAMPP)
define('DB_CHARSET', 'utf8mb4'); // Codificação de caracteres

// ------------------------------------------
// Tentativa de Conexão com PDO
// ------------------------------------------
try {
    // String de Conexão (DSN)
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    
    // Cria a nova instância PDO
    $pdo = new PDO($dsn, DB_USER, DB_PASS);

    // Configura o PDO para lançar exceções em caso de erro (melhor para debug)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Você pode remover o 'echo' abaixo em produção. É apenas para testar a conexão.
    // echo "Conexão com o banco de dados estabelecida com sucesso!"; 

} catch (PDOException $e) {
    // Em caso de falha na conexão, exibe o erro (bom para desenvolvimento)
    die("Falha na conexão com o banco de dados: " . $e->getMessage());
}

// A variável $pdo agora contém o objeto de conexão que será usado para todas as interações.
?>