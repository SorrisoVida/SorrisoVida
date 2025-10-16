-- =========================================================
-- ARQUIVO: modelo_de_dados_sorrisovida.sql
-- DESCRIÇÃO: Criação das tabelas Pacientes e Agendamentos
--            com relacionamentos (Chaves Estrangeiras).
-- =========================================================

-- 1. Criação do Banco de Dados (Opcional, se você já tiver um)
-- Se você já tem um banco de dados chamado 'dentacare_db', pule esta linha.
CREATE DATABASE IF NOT EXISTS dentacare_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dentacare_db;

-- 2. Tabela de Pacientes (A tabela principal de usuários)
-- Esta tabela armazena os dados do cadastro inicial.
CREATE TABLE IF NOT EXISTS pacientes (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome_completo VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100) NOT NULL UNIQUE,          -- Garante que cada e-mail seja único (essencial para login)
    senha_hash VARCHAR(255) NOT NULL,            -- Armazena o hash seguro da senha
    termos_aceitos BOOLEAN NOT NULL DEFAULT 0,   -- 1 para Sim, 0 para Não
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Tabela de Agendamentos (Relacionada aos pacientes)
-- Esta tabela armazena os dados da consulta agendada.
CREATE TABLE IF NOT EXISTS agendamentos (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    
    -- Coluna Chave Estrangeira: Liga o agendamento ao paciente
    paciente_id INT(11) NOT NULL, 
    
    servico VARCHAR(150) NOT NULL,
    dentista VARCHAR(150) NOT NULL,
    data_consulta DATE NOT NULL,
    horario TIME NOT NULL,
    observacoes TEXT,
    
    -- Status da Consulta
    status ENUM('Agendada', 'Confirmada', 'Cancelada', 'Realizada') DEFAULT 'Agendada',
    
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Definição da Chave Estrangeira (O Relacionamento)
    -- Isso garante que um 'agendamento' só pode existir se o 'paciente_id' existir na tabela 'pacientes'.
    FOREIGN KEY (paciente_id) 
        REFERENCES pacientes(id) 
        ON DELETE CASCADE -- Se o paciente for deletado, seus agendamentos também são.
        ON UPDATE CASCADE
        
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Índices (Para otimizar a busca)
-- Estes índices aceleram as consultas mais comuns (como buscar consultas por paciente ou por data).
CREATE INDEX idx_agend_paciente ON agendamentos (paciente_id);
CREATE INDEX idx_agend_data_dentista ON agendamentos (data_consulta, dentista);

-- =========================================================
-- FIM DO SCRIPT SQL
-- =========================================================