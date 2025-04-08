import type { Review } from "../reviews"
import type { Book } from "../books"
import type { User } from "../users"

export function getApprovalEmailTemplate(review: Review, book: Book, user: User) {
    const bookTitle = book.title
    const userName = `${user.firstName} ${user.lastName}`
    const rating = review.rating
    const comment = review.comment

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          padding: 20px;
          border: 1px solid #eaeaea;
          border-radius: 5px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 10px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
        .stars {
          color: #FFD700;
          font-size: 20px;
        }
        .review-box {
          background-color: #f9f9f9;
          border-left: 4px solid #4CAF50;
          padding: 10px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>A sua avaliação foi aprovada!</h2>
        </div>
        <div class="content">
          <p>Olá, ${userName}!</p>
          
          <p>Temos o prazer de informar que sua avaliação para o livro <strong>${bookTitle}</strong> foi aprovada e já está publicada em nosso site.</p>
          
          <div class="review-box">
            <p><strong>Sua avaliação:</strong></p>
            <p class="stars">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p>
            <p><em>"${comment}"</em></p>
          </div>
          
          <p>Agradecemos por compartilhar a sua opinião com a comunidade Biblio.Gest!</p>
          
          <p>Atenciosamente,<br>Equipe Biblio.Gest</p>
        </div>
        <div class="footer">
          <p>Este é um email automático. Por favor, não responda a este email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getRejectionEmailTemplate(review: Review, book: Book, user: User) {
    const bookTitle = book.title
    const userName = `${user.firstName} ${user.lastName}`
    const rating = review.rating
    const comment = review.comment

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          padding: 20px;
          border: 1px solid #eaeaea;
          border-radius: 5px;
        }
        .header {
          background-color: #f44336;
          color: white;
          padding: 10px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
        .stars {
          color: #FFD700;
          font-size: 20px;
        }
        .review-box {
          background-color: #f9f9f9;
          border-left: 4px solid #f44336;
          padding: 10px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Atualização sobre sua avaliação</h2>
        </div>
        <div class="content">
          <p>Olá, ${userName}!</p>
          
          <p>Agradecemos por compartilhar sua opinião sobre o livro <strong>${bookTitle}</strong>.</p>
          
          <p>Após revisão, sua avaliação não foi aprovada para publicação em nosso site. Isso pode ocorrer por diversos motivos, incluindo o não cumprimento das nossas diretrizes de conteúdo.</p>
          
          <div class="review-box">
            <p><strong>Sua avaliação:</strong></p>
            <p class="stars">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p>
            <p><em>"${comment}"</em></p>
          </div>
          
          <p>Você pode enviar uma nova avaliação a qualquer momento, seguindo nossas diretrizes de conteúdo.</p>
          
          <p>Atenciosamente,<br>Equipe Biblio.Gest</p>
        </div>
        <div class="footer">
          <p>Este é um email automático. Por favor, não responda a este email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
