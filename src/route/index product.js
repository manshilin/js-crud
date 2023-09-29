// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

//===============================================================

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

static updateById = (id, data) => {
  const index = this.#list.findIndex((product) => product.id === id)
  if (index !== -1) {
    this.#list[index] = {...this.#list[index], ...data}
    return true
  }
 }
//deleteById(id) Видаляє товар по його ID зі списку створених товарів
static deleteById(id) {
  const index = this.#list.findIndex((product) => product.id === id)
  if (index !== -1) {
    this.#list.splice(index, 1); // Видалення за допомогою splice
    return  true;
  } else {
    return  false;
  }
}

}

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
      info: 'Product information updated',
    })
  } else {
    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('product-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-alert',
      info: 'Oops! Something went wrong.',
    })
  }
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.get('/product-delete', function (req, res) {
  const { id } = req.query;
  const result = Product.deleteById(Number(id))
  if (result) {

     const list = Product.getList()
  res.render('product-alert', {
    style: 'product-alert',
    info: 'Product was deleted!'
  });
  } else {
    res.render('product-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-alert',
      info: 'Oops! Something went wrong.',
    })

  }
});

//=====================================================================
module.exports = router