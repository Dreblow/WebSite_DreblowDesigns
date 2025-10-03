<?php
// Validate and sanitize input
$name = htmlspecialchars(trim($_POST['name']));
$email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
$message = htmlspecialchars(trim($_POST['message']));

// Spam honeypot check
if (!empty($_POST['website']) || !$name || !$email || empty($message)) {
    echo "Invalid submission.";
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load PHPMailer from correct local path
require __DIR__ . '/../../global/PHPMailer-master/src/Exception.php';
require __DIR__ . '/../../global/PHPMailer-master/src/PHPMailer.php';
require __DIR__ . '/../../global/PHPMailer-master/src/SMTP.php';

// Load SMTP credentials from an external file
$config = require __DIR__ . '/../../resources/config.php';

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;           // Enable SMTP authentication
    $mail->Username = $config['smtp_username']; // Load from config
    $mail->Password = $config['smtp_password']; // Load from config
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption, `PHPMailer::ENCRYPTION_SMTPS` for SSL
    $mail->Port = 587;                // TCP port to connect to

    // Set email fields
    $mail->setFrom($_POST['email'], $_POST['name']);
    $mail->addAddress('derek.dreblow@dreblowdesigns.com');   // Add a recipient

    // Content
    $mail->isHTML(true);  // Set email format to HTML
    $mail->Subject = 'New Contact from DreblowDesigns.com - ' . $_POST['name'];
    $mail->Body    = "Name: " . $_POST['name'] . "\nEmail: " . $_POST['email'] . "\n\nMessage:\n" . $_POST['message'];

        $mail->Body = "
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #ffffff; /* pure white background */
                            color: #1B4C84; /* primary text color */
                            padding: 20px;
                        }
                        .container {
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(27, 76, 132, 0.15); /* soft brand blue shadow */
                            border-left: 4px solid #0077cc; /* accent bar */
                        }
                        .label {
                            font-weight: bold;
                            color: #0077cc; /* brighter blue for emphasis */
                            margin-top: 10px;
                        }
                        .message {
                            margin-top: 15px;
                            white-space: pre-wrap;
                        }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <h2>You've received a new message via DreblowDesigns.com</h2>
                        <p class='label'>Name:</p>
                        <p>{$_POST['name']}</p>
                        <p class='label'>Email:</p>
                        <p>{$_POST['email']}</p>
                        <p class='label'>Message:</p>
                        <div class='message'>{$_POST['message']}</div>
                    </div>
                </body>
            </html>
    ";

    $mail->send();
    
    // Return a response for AJAX
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>