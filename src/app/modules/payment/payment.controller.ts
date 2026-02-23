import { RequestHandler } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/asyncCatch";
import sendResponse from "../../utils/sendResponse";

// Success page handler
const paymentSuccess: RequestHandler = catchAsync(async (req, res) => {
  const { session_id } = req.query;
  
  // Return HTML page with success message and auto-close
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Successful</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          color: #333;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 500px;
          width: 90%;
          animation: slideIn 0.5s ease-out;
        }
        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: #4CAF50;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: scaleIn 0.5s ease-out;
        }
        .success-icon::before {
          content: '✓';
          color: white;
          font-size: 40px;
          font-weight: bold;
        }
        h1 {
          color: #4CAF50;
          margin-bottom: 15px;
          font-size: 28px;
        }
        p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 25px;
          font-size: 16px;
        }
        .countdown {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          margin-top: 20px;
          font-weight: 600;
        }
        .countdown span {
          color: #007bff;
          font-weight: bold;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success-icon"></div>
        <h1>Payment Successful!</h1>
        <p>Your payment has been processed successfully. Your booking is confirmed and you will receive a confirmation email shortly.</p>
        <div class="countdown">
          This window will close automatically in <span id="countdown">5</span> seconds...
        </div>
      </div>

      <script>
        let countdown = 5;
        const countdownElement = document.getElementById('countdown');
        
        const timer = setInterval(() => {
          countdown--;
          countdownElement.textContent = countdown;
          
          if (countdown <= 0) {
            clearInterval(timer);
            // Try to close the window
            window.close();
            
            // If window doesn't close (browser security), redirect to app
            setTimeout(() => {
              window.location.href = 'https://renee-dashboard-update.vercel.app';
            }, 1000);
          }
        }, 1000);
      </script>
    </body>
    </html>
  `;

  res.status(httpStatus.OK).send(html);
});

// Cancel page handler
const paymentCancel: RequestHandler = catchAsync(async (req, res) => {
  const { session_id } = req.query;
  
  // Return HTML page with cancel message and auto-close
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Cancelled</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          color: #333;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 500px;
          width: 90%;
          animation: slideIn 0.5s ease-out;
        }
        .cancel-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: #ff6b6b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: scaleIn 0.5s ease-out;
        }
        .cancel-icon::before {
          content: '✕';
          color: white;
          font-size: 40px;
          font-weight: bold;
        }
        h1 {
          color: #ff6b6b;
          margin-bottom: 15px;
          font-size: 28px;
        }
        p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 25px;
          font-size: 16px;
        }
        .countdown {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          margin-top: 20px;
          font-weight: 600;
        }
        .countdown span {
          color: #dc3545;
          font-weight: bold;
        }
        .btn {
          background: #007bff;
          color: white;
          padding: 12px 30px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          margin-top: 15px;
          transition: background 0.3s;
        }
        .btn:hover {
          background: #0056b3;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="cancel-icon"></div>
        <h1>Payment Cancelled</h1>
        <p>Your payment has been cancelled. No charges were made to your account. You can try again whenever you're ready.</p>
        <div class="countdown">
          This window will close automatically in <span id="countdown">5</span> seconds...
        </div>
        <a href="https://renee-dashboard-update.vercel.app" class="btn">Return to App</a>
      </div>

      <script>
        let countdown = 5;
        const countdownElement = document.getElementById('countdown');
        
        const timer = setInterval(() => {
          countdown--;
          countdownElement.textContent = countdown;
          
          if (countdown <= 0) {
            clearInterval(timer);
            // Try to close the window
            window.close();
            
            // If window doesn't close (browser security), redirect to app
            setTimeout(() => {
              window.location.href = 'https://renee-dashboard-update.vercel.app';
            }, 1000);
          }
        }, 1000);
      </script>
    </body>
    </html>
  `;

  res.status(httpStatus.OK).send(html);
});

export const PaymentController = {
  paymentSuccess,
  paymentCancel,
};
