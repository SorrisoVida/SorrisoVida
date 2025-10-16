document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.register-form');
    const submitButton = form.querySelector('.primary-submit');
    const formInputs = form.querySelectorAll('input:not([type="checkbox"])');
    
    const ERROR_CLASS = 'input-error';

    // --- Funções de Máscara (Formatação Automática) ---

    // Máscara para CPF: 000.000.000-00
    const applyCpfMask = (input) => {
        let value = input.value.replace(/\D/g, "");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        input.value = value.substring(0, 14);
    };

    // Máscara para Telefone: (00) 00000-0000
    const applyPhoneMask = (input) => {
        let value = input.value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d)(\d{4})$/, "$1-$2");
        input.value = value.substring(0, 15);
    };

    document.getElementById('cpf').addEventListener('input', (e) => applyCpfMask(e.target));
    document.getElementById('phone').addEventListener('input', (e) => applyPhoneMask(e.target));

    // --- Função de Validação ---
    
    function validateField(input) {
        let isValid = true;
        const value = input.value.trim();
        input.classList.remove(ERROR_CLASS);

        if (input.hasAttribute('required') && value === '') {
            isValid = false;
        } else if (input.id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
        } else if (input.id === 'password' && value.length < 6) {
            isValid = false;
        } else if (input.id === 'confirm-password') {
            const password = document.getElementById('password').value;
            if (value !== password || value === '') {
                isValid = false;
            }
        }
        
        if (!isValid) {
            input.classList.add(ERROR_CLASS);
        }
        return isValid;
    }

    // Validação ao sair do campo (Blur)
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });

    // --- Lógica de Submissão ---
    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        let formValid = true;

        // 1. Valida todos os campos ao submeter
        formInputs.forEach(input => {
            if (!validateField(input)) {
                formValid = false;
            }
        });
        
        // 2. Valida os Termos
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            alert('Você deve aceitar os Termos de Uso.');
            formValid = false;
        }

        if (!formValid) {
            return; // Interrompe se houver erros
        }

        // 3. Efeito de Carregamento e Confirmação (mesmo padrão anterior)
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Processando Cadastro...';
        
        // Simulação de envio
        setTimeout(() => {
            submitButton.textContent = 'Conta Criada com Sucesso!';
            submitButton.style.backgroundColor = 'var(--success-color)';
            
            // Opcional: Redirecionar ou exibir modal
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.backgroundColor = 'var(--secondary-color)';
                submitButton.disabled = false;
                form.reset();
            }, 2500); 
            
        }, 2000); 
    });
});