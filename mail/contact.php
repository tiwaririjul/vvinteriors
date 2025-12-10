<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Enable all error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if PHPMailer is installed
if (!file_exists('../vendor/autoload.php')) {
    http_response_code(500);
    die('PHPMailer not found. Please run "composer require phpmailer/phpmailer" in the project directory.');
}

require '../vendor/autoload.php';

// Log to a file for debugging
function logMessage($message) {
    $logFile = __DIR__ . '/mail_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

logMessage("Form submission received");

// Validate inputs
if(empty($_POST['name']) || empty($_POST['subject']) || empty($_POST['message']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  logMessage("Invalid input: " . json_encode($_POST));
  exit('Invalid input');
}

$name = strip_tags($_POST['name']);
$email = strip_tags($_POST['email']);
$m_subject = strip_tags($_POST['subject']);
$message = strip_tags($_POST['message']);

logMessage("Processing email from: $name <$email>, Subject: $m_subject");

$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = 2;                      // Enable verbose debug output (2 for commands and data)
    $mail->Debugoutput = function($str, $level) {
        logMessage("PHPMailer Debug: $str");
    };
    
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';      // Use Gmail SMTP server
    $mail->SMTPAuth   = true;
    $mail->Username   = 'tiwaririjull7@gmail.com';      // Your Gmail address
    $mail->Password   = 'tlzu fmog njps oame';         // Use App Password (not your Gmail password)
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    //Recipients
    $mail->setFrom($email, $name);
    $mail->addAddress('tiwaririjul13@gmail.com');     // Your destination email
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(false);
    $mail->Subject = "$m_subject:  $name";
    $mail->Body    = "You have received a new message from your website contact form.\n\n"
        . "Here are the details:\n\n"
        . "Name: $name\n"
        . "Email: $email\n"
        . "Subject: $m_subject\n"
        . "Message:\n$message";

    $mail->send();
    logMessage("Message sent successfully");
    http_response_code(200);
    echo "Message has been sent";
} catch (Exception $e) {
    logMessage("Failed to send message: " . $mail->ErrorInfo);
    http_response_code(500);
    echo "Failed to send message. Mailer Error: {$mail->ErrorInfo}";
}
?>
