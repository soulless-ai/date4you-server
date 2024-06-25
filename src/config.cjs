module.exports = {
    serverDomain: '127.0.0.1',
    serverPort: 5500,
    serverSSLkeyURL: '',
    serverSSLcrtURL: '',
    secretKey: '',
    transporterMailRU: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // SSL подключение
        auth: {
            user: '4ap9911@gmail.com',
            pass: 'vjtdmqjaujqlmkmk', // пароль приложения
        },
    },
    poolClients: {
        user: 'qqq',
        host: 'dpg-cpta5nmehbks73f1j5mg-a.oregon-postgres.render.com',
        database: 'database_97c1',
        password: 'qbfM0Ju1x9GMLKnIhd47B87oSVxQOzvv',
        port: 5432,
        ssl: {
            rejectUnauthorized: true // SSL подключение
        }
    },
    confirmationCodeSendOptions: {
        from: function(transporter) { return transporter.auth.user; }, // Адрес отправителя
        subject: 'Код подтверждения', // Тема письма
        text: `Ваш код подтверждения: ` // Текст письма
    },
};