using System.Net;
using System.Net.Mail;
using Kursuch.Interfaces;

namespace Kursuch;

public class EmailService : IEmailService
{
    private readonly string _smtpServer = "smtp.gmail.com"; // Замените на ваш SMTP сервер
    private readonly int _smtpPort = 587; // Порт для SMTP
    private readonly string _smtpUser = "videofilmsshop@gmail.com";
    private readonly string _smtpPassword = "utkk bxeg wify umgy"; // Ваш пароль

    public async Task SendAsync(string toEmail, string subject, string body)
    {
        var smtpClient = new SmtpClient(_smtpServer)
        {
            Port = _smtpPort,
            Credentials = new NetworkCredential(_smtpUser, _smtpPassword),
            EnableSsl = true,
        };

        var message = new MailMessage
        {
            From = new MailAddress(_smtpUser),
            Subject = subject,
            Body = body,
            IsBodyHtml = true,
        };

        message.To.Add(toEmail);

        try
        {
            await smtpClient.SendMailAsync(message);
        }
        catch (Exception ex)
        {
            // Обработка ошибок (например, логирование)
            throw new Exception("Error sending email", ex);
        }
    }
}
