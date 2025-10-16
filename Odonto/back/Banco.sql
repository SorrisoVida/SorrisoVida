-- Arquivo: criar_tabela_pacientes.sql

CREATE TABLE pacientes (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome_completo VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100) NOT NULL UNIQUE, -- O email deve ser único para login
    senha_hash VARCHAR(255) NOT NULL,   -- Campo para armazenar o hash seguro da senha
    termos_aceitos BOOLEAN NOT NULL DEFAULT 0, -- 1 para Sim, 0 para Não
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exemplo de inserção de um registro (apenas para teste, não use no código PHP de cadastro)
-- INSERT INTO pacientes (nome_completo, telefone, email, senha_hash, termos_aceitos)
-- VALUES ('Exemplo de Paciente', '(99) 99999-9999', 'teste@exemplo.com', '$2y$10$HASH_DA_SENHA_AQUI', 1);