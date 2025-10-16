document.addEventListener('DOMContentLoaded', () => {
    // 1. Dados de Simulação (que viriam de uma API real)
    const proximaConsultaData = {
        data: 'Quarta-feira, 24 de Julho',
        hora: '10:30 AM',
        dentista: 'Dr. Ana Oliveira',
        procedimento: 'Limpeza e Avaliação',
        agendada: true // Flag para checar se há consulta
    };

    // 2. Lógica para Exibir a Próxima Consulta
    const cardConsulta = document.querySelector('.next-appointment');

    if (cardConsulta) {
        if (proximaConsultaData.agendada) {
            // Preenche os campos do card
            cardConsulta.querySelector('.date').textContent = proximaConsultaData.data;
            cardConsulta.querySelector('.time').textContent = proximaConsultaData.hora;
            cardConsulta.querySelectorAll('.details')[0].textContent = proximaConsultaData.dentista;
            cardConsulta.querySelectorAll('.details')[1].textContent = proximaConsultaData.procedimento;
        } else {
            // Caso não haja consulta agendada
            cardConsulta.innerHTML = `
                <h3>Próxima Consulta</h3>
                <p>Você não possui consultas futuras agendadas.</p>
                <button class="cta-button">Agendar Agora</button>
            `;
        }
    }


    // 3. Lógica para Navegação do Menu (Simulação de Ativação)
    const menuItems = document.querySelectorAll('.sidebar li');
    
    // Adiciona um listener de clique a cada item do menu
    menuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Remove a classe 'active' de todos os itens
            menuItems.forEach(i => i.classList.remove('active'));

            // Adiciona a classe 'active' ao item clicado
            event.currentTarget.classList.add('active');

            // Simula a mudança de conteúdo/navegação
            const tituloTela = event.currentTarget.textContent.trim();
            const mainContent = document.querySelector('.main-content h2');
            
            if (mainContent) {
                mainContent.textContent = tituloTela;
                
                // Exemplo de console log para mostrar que a navegação funcionou
                console.log(`Tela alterada para: ${tituloTela}`);
            }

            // Em um app real, você faria uma requisição AJAX ou mudaria a URL aqui.
        });
    });
});