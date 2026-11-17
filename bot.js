import { Telegraf } from 'telegraf';
import axios from 'axios';
import 'dotenv/config';

// Bot Token එක මෙතැනට දාන්න (නැත්නම් Render එකේ Environment Variables වල දාන්න)
const bot = new Telegraf(process.env.BOT_TOKEN || '9058361124:AAF2oWuWKBK0K7V5OYELrD7Ld6X4bcAcTlY');

bot.start((ctx) => {
  ctx.reply('👋 Hello! Welcome to Zyglo Grabber.\n\nSend me any TikTok, Instagram, or Facebook video link, and I will download it for you instantly for FREE! 🚀');
});

bot.on('text', async (ctx) => {
  const text = ctx.message.text;

  if (text.startsWith('http://') || text.startsWith('https://')) {
    const processingMsg = await ctx.reply('⏳ Fetching video, please wait...');

    try {
      // Free API එක හරහා Video Data ලබා ගැනීම
      const encodedUrl = encodeURIComponent(text);
      const apiResponse = await axios.get(`https://tikwm.com/api/?url=${encodedUrl}`);
      
      if (apiResponse.data && apiResponse.data.data) {
        const videoData = apiResponse.data.data;
        const videoUrl = videoData.play; // Watermark නැති වීඩියෝ ලින්ක් එක

        await ctx.replyWithVideo(videoUrl, {
          caption: '✨ Downloaded successfully via @zylograbbwe_bot',
        });

        // Processing මැසේජ් එක ඩිලෙට් කිරීම
        await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id);
      } else {
        await ctx.reply('❌ Sorry, I could not fetch the video. Please check if the link is correct.');
      }
    } catch (error) {
      await ctx.reply('❌ An error occurred while processing your request. Try another link.');
    }
  } else {
    ctx.reply('⚠️ Please send a valid video link (TikTok, Instagram, etc.).');
  }
});

bot.launch();
console.log('🤖 Zyglo Grabber Bot is running and ready!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));