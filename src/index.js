import { } from "dotenv/config";
import Telegraf from "telegraf";
import searchBooks from "./searchBooks";

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "https://books-and-bot.herokuapp.com/";

const createMessageText = book => {
  return `
<strong>${book.title}</strong>
<em>${book.author}</em>
<a href="${book.cover_url}">&#8205;</a>`;
};
console.log("BOT_TOKEN",BOT_TOKEN)
console.log("PORT",PORT)
console.log("URL",URL)
console.log("WS",`${URL}/bot${BOT_TOKEN}`)
const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => ctx.reply('Hello'))
bot.help((ctx) => ctx.reply('Help message'))
bot.on('message', async ctx => {
  console.log("ctx",ctx)
  console.log("ctx.message",ctx.message)
  const searchResults = await searchBooks(ctx.message.text);
  console.log("searchResults",searchResults)
  const results =
    searchResults && searchResults.length
      ? searchResults.map((book, id) => ({
        id,
        type: "article",
        title: book.title,
        description: book.author,
        thumb_url: book.thumb_url,
        input_message_content: {
          message_text: createMessageText(book),
          parse_mode: "HTML"
        },
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Show on Goodreads",
                url: book.url
              }
            ]
          ]
        }
      }))
      : [];
  console.log("results",results)
  ctx.reply(results);
})
bot.action('delete', ({ deleteMessage }) => deleteMessage())
/*
bot.on("inline_query", async ctx => {
  const searchResults = await searchBooks(ctx.inlineQuery.query);
  const results =
    searchResults && searchResults.length
      ? searchResults.map((book, id) => ({
        id,
        type: "article",
        title: book.title,
        description: book.author,
        thumb_url: book.thumb_url,
        input_message_content: {
          message_text: createMessageText(book),
          parse_mode: "HTML"
        },
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Show on Goodreads",
                url: book.url
              }
            ]
          ]
        }
      }))
      : [];
  ctx.answerInlineQuery(results);
});
*/
bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT);
bot.launch();
