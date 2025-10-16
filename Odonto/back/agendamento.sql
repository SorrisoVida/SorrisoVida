-- Arquivo: criar_tabela_agendamentos.sql

CREATE TABLE agendamentos (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    -- Chave estrangeira ligando ao paciente que agendou (Assumindo que sua tabela de cadastro é 'pacientes')
    paciente_id INT(11) NOT NULL, 
    servico VARCHAR(150) NOT NULL,
    dentista VARCHAR(150) NOT NULL,
    data_consulta DATE NOT NULL,
    horario TIME NOT NULL,
    observacoes TEXT,
    status ENUM('Agendada', 'Confirmada', 'Cancelada', 'Realizada') DEFAULT 'Agendada',
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Restrição de chave estrangeira
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Adicione um índice para consultas rápidas por data e dentista
CREATE INDEX idx_data_dentista ON agendamentos (data_consulta, dentista);