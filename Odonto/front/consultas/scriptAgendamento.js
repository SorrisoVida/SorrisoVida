document.addEventListener('DOMContentLoaded', () => {
    const dataInput = document.getElementById('dataConsulta');
    const dentistaSelect = document.getElementById('dentista');
    const horarioSelect = document.getElementById('horario');
    const horarioFeedback = document.getElementById('horarioFeedback');

    // 1. Simulação de Horários Disponíveis por Dentista e Data (em um ambiente real, viria do PHP/API)
    const mockHorarios = {
        'Dr. Ana Oliveira': {
            '2025-10-20': ['09:00', '10:00', '14:00'],
            '2025-10-21': ['11:00', '13:00'],
            '2025-10-24': ['10:30', '15:00', '16:00']
        },
        'Dr. Carlos Silva': {
            '2025-10-20': ['11:00', '15:00', '17:00'],
            '2025-10-22': ['08:00', '09:00', '14:00']
        }
        // ... outros dentistas e datas
    };

    // 2. Função principal para atualizar os horários
    function atualizarHorariosDisponiveis() {
        const dataSelecionada = dataInput.value;
        const dentistaSelecionado = dentistaSelect.value;
        
        horarioSelect.innerHTML = ''; // Limpa as opções atuais
        horarioSelect.disabled = true;

        if (!dataSelecionada || !dentistaSelecionado) {
            horarioSelect.innerHTML = '<option value="">Selecione a Data e o Dentista</option>';
            horarioFeedback.textContent = '';
            return;
        }

        const horariosDisponiveis = mockHorarios[dentistaSelecionado] ? mockHorarios[dentistaSelecionado][dataSelecionada] : null;

        if (horariosDisponiveis && horariosDisponiveis.length > 0) {
            // Adiciona a primeira opção padrão
            horarioSelect.innerHTML = '<option value="">Selecione um Horário</option>';
            
            // Adiciona os horários encontrados
            horariosDisponiveis.forEach(horario => {
                const option = document.createElement('option');
                option.value = horario;
                option.textContent = horario;
                horarioSelect.appendChild(option);
            });

            horarioSelect.disabled = false;
            horarioFeedback.textContent = `Encontrados ${horariosDisponiveis.length} horários disponíveis.`;
        } else {
            horarioSelect.innerHTML = '<option value="">Nenhum horário disponível</option>';
            horarioFeedback.textContent = 'Nenhum horário disponível para esta data e dentista.';
        }
    }

    // 3. Adiciona listeners de evento
    dataInput.addEventListener('change', atualizarHorariosDisponiveis);
    dentistaSelect.addEventListener('change', atualizarHorariosDisponiveis);

    // 4. Configura o mínimo de data para ser hoje
    const today = new Date().toISOString().split('T')[0];
    dataInput.setAttribute('min', today);

    // 5. Garante que os horários sejam carregados se houver dados pré-selecionados
    atualizarHorariosDisponiveis();
});