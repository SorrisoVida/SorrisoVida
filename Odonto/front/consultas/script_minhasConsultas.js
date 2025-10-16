document.addEventListener('DOMContentLoaded', () => {
    const consultasList = document.getElementById('consultasList');
    const filterStatus = document.getElementById('filterStatus');

    // 1. Simulação de Dados de Consultas (Em um sistema real, isso seria um FETCH do PHP)
    const mockConsultas = [
        { id: 101, data: '2025-11-15', horario: '09:00', servico: 'Tratamento de Canal', dentista: 'Dr. Ana Oliveira', status: 'Agendada' },
        { id: 102, data: '2025-10-24', horario: '10:30', servico: 'Limpeza e Avaliação', dentista: 'Dr. Ana Oliveira', status: 'Confirmada' },
        { id: 103, data: '2025-08-01', horario: '14:00', servico: 'Clareamento Dental', dentista: 'Dr. Carlos Silva', status: 'Realizada' },
        { id: 104, data: '2025-12-05', horario: '16:00', servico: 'Extração', dentista: 'Dra. Beatriz Santos', status: 'Agendada' },
        { id: 105, data: '2025-07-01', horario: '11:00', servico: 'Limpeza', dentista: 'Dr. Ana Oliveira', status: 'Cancelada' },
    ];

    // 2. Função para mapear status para classe CSS
    function getStatusClass(status) {
        return 'status-' + status.toLowerCase().replace(/\s+/g, '');
    }

    // 3. Função para renderizar a lista de consultas
    function renderConsultas(consultas) {
        consultasList.innerHTML = ''; // Limpa o conteúdo atual

        if (consultas.length === 0) {
            consultasList.innerHTML = `
                <div class="card empty-state">
                    <i class="fas fa-calendar-times fa-3x"></i>
                    <p>Nenhuma consulta encontrada com o filtro selecionado.</p>
                </div>
            `;
            return;
        }

        consultas.forEach(consulta => {
            const isFuture = new Date(consulta.data) >= new Date().setHours(0,0,0,0);
            const canCancel = isFuture && (consulta.status === 'Agendada' || consulta.status === 'Confirmada');

            const itemHTML = `
                <div class="consulta-item">
                    <div class="consulta-info">
                        <h4>${consulta.servico} (${consulta.id})</h4>
                        <p><i class="fas fa-calendar-day"></i> ${new Date(consulta.data).toLocaleDateString('pt-BR')}, ${consulta.horario}</p>
                        <p><i class="fas fa-user-md"></i> Dentista: ${consulta.dentista}</p>
                    </div>
                    
                    <div class="consulta-actions">
                        <span class="status-tag ${getStatusClass(consulta.status)}">${consulta.status}</span>
                        
                        ${canCancel ? 
                            `<button class="btn-cancelar" data-id="${consulta.id}" onclick="handleCancel(${consulta.id})">
                                <i class="fas fa-times"></i> Cancelar
                            </button>` 
                            : ''}
                        
                        <button class="btn-detalhes" data-id="${consulta.id}" onclick="handleDetails(${consulta.id})">
                            Detalhes
                        </button>
                    </div>
                </div>
            `;
            consultasList.innerHTML += itemHTML;
        });
    }

    // 4. Função de Filtragem
    function filterAndRender() {
        const selectedStatus = filterStatus.value;
        
        let filteredConsultas;
        
        if (selectedStatus === 'Todas') {
            filteredConsultas = mockConsultas;
        } else {
            filteredConsultas = mockConsultas.filter(c => c.status === selectedStatus);
        }
        
        // Ordena por data (as mais próximas primeiro)
        filteredConsultas.sort((a, b) => new Date(a.data) - new Date(b.data));
        
        renderConsultas(filteredConsultas);
    }

    // 5. Handlers de Ação (Ações de Botão)
    window.handleCancel = function(id) {
        if (confirm(`Tem certeza que deseja cancelar a consulta #${id}?`)) {
            // Em um sistema real: enviar requisição POST/DELETE para o PHP
            alert(`Simulação: Requisição de cancelamento para #${id} enviada.`);
            // Recarregar os dados após o sucesso
        }
    }
    
    window.handleDetails = function(id) {
        alert(`Simulação: Abrir modal ou página de detalhes da consulta #${id}.`);
    }


    // 6. Inicialização
    filterStatus.addEventListener('change', filterAndRender);
    filterAndRender(); // Renderiza a lista na inicialização
});