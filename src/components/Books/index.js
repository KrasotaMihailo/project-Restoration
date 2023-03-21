// Тут мы описываем обработчики для роутов
const validation = require('./validation');
const modelBook = require('./modelBook');
const model = require('../Users/model');

// Получение всего списка книг
async function getBooks(req, res) {
  try {
    const books = await modelBook.find({});
    res.send(books);// ответ
  } catch (error) {
    console.log(error);
    res.send('Что-то пошло не так');
  }
}

// Создание книги
async function creatBook(req, res) {
  const { error } = validation.creatBook.validate(req.body);// Это блок валидации, валидация идет раньше чем действия по роуту,
  if (error) {
    return res.status(400).json({ message: error.details }); // если валидация не проходит то код дальше не выполняется
  }

  try {
    const authorBook = await model.findOne({ _id: req.body.authorId });
    if (!authorBook) { // если юзер существует
      return res.send('Такого автора нет');// ответ
    }
    const book = modelBook({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      authorId: req.body.authorId,
    });

    await book.save();
    res.send(book);// ответ
  } catch (error2) {
    console.log(error2);
    res.send('Что-то пошло не так');
  }
}

// и тут же экспортируем их
module.exports = {
  getBooks, creatBook,
};
