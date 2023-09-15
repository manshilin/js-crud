// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

//===============================================================

class User {
  static #list = []
  id = null
  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }
  static getList = () => {
    return this.#list
  }
  static getById = (id) => {
    return this.#list.find((user) => user.id === id)
  }
  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, data) => {
    const user = this.getById(id)
    if (user) {
    
        this.update(id, data)
        return true
  
    } else {
      return false
    }
  }
  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
}
}

class Product {
 static #list = []
 id = null
  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 100000)
    this.createDate = new Date().toISOString()
    
  }
  static getList = () => {
    return this.#list
  }
  static addProduct = (product) => {
    this.#list.push(product)
  }
// getById(id) Знаходить товар в списку створених товарів за допомогою ID, яке повинно бути числом, та яке
// передається як аргумент
static getById = (id) => {
  return this.#list.find((product) => product.id === id)
}
// updateById (id, data) Оновлює властивості аргументу data в об’єкт товару, який був знайдений по ID. Можна
// оновлювати price, name, description
static updateById = (id, data) => {
  const index = this.#list.findIndex((product) => product.id === id)
  if (index !== -1) {
    this.#list[index] = {...this.#list[index], ...data}
  }
 }
//deleteById(id) Видаляє товар по його ID зі списку створених товарів
static deleteById = (id) => {
  this.#list = this.#list.filter((product) => product.id !== id)
}

}


// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})
// ↑↑ сюди вводимо JSON дані
// ================================================================
router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body
  const user = new User(email, login, password)
  User.add(user)
  res.render('success-info', {
    style: 'success-info',
    info: 'User was created successfully!',
  })
})

// ================================================================
router.get('/user-delete', function (req, res) {
  const { id } = req.query
  User.deleteById(Number(id))
  res.render('success-info', {
    style: 'success-info',
    info: 'User was deleted successfully!',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false
  const user = User.getById(Number(id))

  if(user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result ? 'Email updated successfully!' : 'User not found!',
  })
})

// ================================================================
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },

  })
})
// ↑↑ сюди вводимо JSON дані
// ================================================================
router.post('/product-create', function (req, res) {
  const { name, price, description} = req.body
  const product = new Product(name, price, description)
  Product.addProduct(product)
  res.render('product-alert', {
    style: 'product-alert',
    info: 'Product was created successfully!',
  })
})

// ================================================================
router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },

  })
})
// ↑↑ сюди вводимо JSON дані

// Підключаємо роутер до бек-енду
//Потрібно створити GET endpoint з PATH container/product-edit з даними товару /product-edit
// який приймає query параметр з назвою id в посилані  та повертає container/product-edit з даними товару

// ================================================================
// Handle GET request for displaying the edit form
router.get('/product-edit', function (req, res) {
  const { id } = req.query;
  const product = Product.getById(Number(id));
  res.render('product-edit', {
    style: 'product-edit',
    data: {
      product,
    },
  });
});
//===================================================================

// Handle POST request for updating the product
// router.post('/product-edit', function (req, res) {
//   const { name, price, description, id } = req.body;
//   const existingProduct = Product.getById(Number(id));

//   if (!existingProduct) {
//     res.render('product-edit', {
//       style: 'product-edit',
//       data: {
//         product: null,
//         message: 'Product not found',
//       },
//     });
//     return;
//   }

//   const updatedData = {};
//   if (name) updatedData.name = name;
//   if (price) updatedData.price = price;
//   if (description) updatedData.description = description;

//   Product.updateById(Number(id), updatedData);
//   const list = Product.getList()

//   // Redirect to the GET /product-edit route to display the updated product
//   res.redirect('/product-edit?id=' + id);

// });

router.post('/product-edit', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id, name, price, description } = req.body
  const product = Product.updateById(Number(id), {
    name,
    price,
    description,
  })
  console.log(id)
  console.log(product)
  if (product) {
    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('product-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-alert',
      info: 'Інформація про товар оновлена',
    })
  } else {
    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('product-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-alert',
      info: 'Сталася помилка',
    })
  }
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
module.exports = router