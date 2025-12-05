/**
 * Vercel Serverless API - AI 聊天
 * /api/chat.js
 */

const { generateAIResponse } = require('../backend/utils/aiResponse');

module.exports = async (req, res) => {
  // 設置 CORS 頭
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 方法' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: '無效的消息格式',
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        error: '消息不能為空',
      });
    }

    const response = await generateAIResponse(message);

    res.status(200).json({
      success: true,
      userMessage: message,
      aiResponse: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('錯誤:', error);
    res.status(500).json({
      error: error.message || '伺服器內部錯誤',
      timestamp: new Date().toISOString(),
    });
  }
};
