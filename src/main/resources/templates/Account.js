async function register(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
        // Перед выполнением запроса на регистрацию обновляем токен
        await refreshToken();

        const response = await fetch('http://localhost:8080/register', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        document.getElementById('registrationMessage').innerText = 'Registration successful';
    } catch (error) {
        console.error('Error during registration:', error);
        document.getElementById('registrationMessage').innerText = 'Registration failed';
    }
}

async function login(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
        // Перед выполнением запроса на вход обновляем токен
        await refreshToken();

        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        document.getElementById('loginMessage').innerText = 'Login successful';
    } catch (error) {
        console.error('Error during login:', error);
        document.getElementById('loginMessage').innerText = 'Login failed';
    }
}

async function refreshToken() {
    try {
        const response = await fetch('http://localhost:8080/refreshToken', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.jwtToken);
    } catch (error) {
        console.error('Error refreshing token:', error);
        // Если обновление токена не удалось, перенаправляем пользователя на страницу входа
        window.location.href = 'index.html';
    }
}