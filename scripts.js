document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navUl = document.querySelector('nav ul');

    mobileMenuBtn.addEventListener('click', function() {
        navUl.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
        this.querySelector('i').classList.toggle('fa-bars');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.getAttribute('href') === '#') return;
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                if (navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                }
            }
        });
    });

    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            
            if (!name || !phone || !service) {
                alert('Пожалуйста, заполните обязательные поля: Имя, Телефон и Услуга');
                return;
            }

            const serviceNames = {
                'rent': 'Аренда транспорта',
                'cargo': 'Грузоперевозки',
                'pets': 'Перевозка животных',
                'tour': 'Поездка с экскурсоводом',
                'business': 'Business Class (Mercedes E-Class, BMW 5 Series)',
                'premium': 'Premium Class (Mercedes S-Class, Audi A8)',
                'luxury': 'Luxury Class (Rolls-Royce, Bentley)'
            };

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            const botToken = '7870596117:AAHOuyQjgr3zXBGLAwl4h24OyMFskhxEQRI';
            const chatId = '1071153460';
            
            const message = `📌 Новая заявка:\n\n` +
                            `👤 Имя: ${data.name}\n` +
                            `📞 Телефон: ${data.phone}\n` +
                            `🚗 Услуга: ${serviceNames[data.service] || data.service}\n` +
                            `📅 Дата: ${data.date || 'не указана'}\n` +
                            `💬 Комментарий: ${data.comments || 'нет'}`;

            try {
                const response = await fetch(
                    `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`
                );
                
                if (response.ok) {
                    alert('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                    this.reset();
                } else {
                    const errorData = await response.json();
                    console.error('Ошибка Telegram API:', errorData);
                    alert('❌ Ошибка отправки. Пожалуйста, попробуйте ещё раз или свяжитесь с нами другим способом.');
                }
            } catch (error) {
                console.error('Ошибка сети:', error);
                alert('⚠️ Ошибка сети. Пожалуйста, проверьте интернет-соединение и попробуйте снова.');
            }
        });
    }

    if (window.location.hash === '#order') {
        const urlParams = new URLSearchParams(window.location.search);
        const service = urlParams.get('service');
        if (service) {
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                serviceSelect.value = service;
            }
        }
    }
}); 
