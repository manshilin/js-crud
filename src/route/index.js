// Підключаємо технологію express для back-end сервера
const express = require('express')
const { TRUE } = require('sass')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

//===============================================================
class Product {
  static #list = []
  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }
  static add(...data) {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
    return newProduct
  }
  static getList() {
    return this.#list
  }
  static getById(id) {
    return this.#list.find((product) => product.id === id)
  }
  // Фільтруємо товар, щоб вилучити той з  яким id порівнюємо
  static getRandomeList = (id) => {
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    //Відсортуємо за допомогою Math.random та перемешаємо масив
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    return shuffledList.slice(0, 3)
  }
}

Product.add(
  'https://picsum.photos/seed/picsum/200/300',
  `1Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  250,
)
Product.add(
  'https://picsum.photos/seed/picsum/200/300',
  `2Комп'ютер Art Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  37000,
  100,
)
Product.add(
  'https://picsum.photos/seed/picsum/200/300',
  `3Комп'ютер SuperArt Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  47000,
  10,
)
Product.add(
  'https://picsum.photos/seed/picsum/200/300',
  `4Комп'ютер SuperArt Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  47000,
  5,
)
Product.add(
  'https://picsum.photos/seed/picsum/200/300',
  `5Комп'ютер SuperArt Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  47000,
  3,
)
// ================================================================
class Purchase {
  static DELIVERY_PRICE = 150;
  static #BONUS_FACTOR = 0.1;
  static #list = [];
  static #count = 0;
  static #bonusAccount = new Map();

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0;
  };

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR;
  };

  static updateBonusBalance = (email, price, bonusUse = 0) => {
    const amount = this.calcBonusAmount(price);
    const currentBalance = Purchase.getBonusBalance(email);
    const updatedBalance = currentBalance + amount - bonusUse;
    Purchase.#bonusAccount.set(email, updatedBalance);
    console.log(updatedBalance, amount, bonusUse);
    return amount;
  };

  constructor(data, product) {
    this.id = ++Purchase.#count;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.comment = data.comment || null;
    this.bonus = data.bonus || 0;
    this.promocode = data.promocode || null;

    this.totalPrice = data.totalPrice;
    this.productPrice = data.productPrice;
    this.deliveryPrice = data.deliveryPrice;
    this.amount = data.amount;

    this.product = product;
  }

  static add = (...args) => {
    const newPurchase = new Purchase(...args);
    Purchase.#list.push(newPurchase);
    return newPurchase;
  };

  static getList = () => {
    return Purchase.#list.reverse().map(({ id, product, totalPrice, bonus }) => ({
      id,
      product: `${product.title}  ${product.price}`,
      totalPrice: totalPrice,
      bonus
    }));
  };

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id);
  };

  static update = (id, data) => {
    const purchase = Purchase.getById(id);

    if (purchase) {
      if (data.firstName) {
        purchase.firstName = data.firstName;
      }
      if (data.lastName) {
        purchase.lastName = data.lastName;
      }
      if (data.email) {
        purchase.email = data.email;
      }
      if (data.phone) {
        purchase.phone = data.phone;
      }
      return true;
    } else {
      return false;
    }
  };
}
// ================================================================
class Promocode {
  static #list = []
  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }
   static add = (name, factor) => {
    const newPromocode = new Promocode(name, factor)
    this.#list.push(newPromocode)
    return newPromocode
}

  static getByName = (name) => {
    return Promocode.#list.find(
      (item) => item.name === name,
    )
  }
  static calc = (promo, price  ) => {
    return price * promo.factor
  }

}
Promocode.add('promo1', 0.9)
Promocode.add('promo2', 0.8)
Promocode.add('promo3', 0.7)
// router.get Створює нам один ентпоїнт
router.get('/alert', function (req, res) {
  res.render('alert', {
    style: 'alert',
    message: 'Операція успішна',
    info: 'Товар створено',
    link: '/test-path',
  })
})
// ===============================================================
// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    },
  })
})
// ↑↑ сюди вводимо JSON дані
//=====================================================================
router.get('/purchase-product', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',
    data: {
      list: Product.getRandomeList(id),
      product: Product.getById(id),
    },
  })
})
// ↑↑ сюди вводимо JSON дані

//=====================================================================
router.post('/purchase-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)
  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Операція не успішна',
        info: 'Введіть кількість товару',
        link: '/purchase-product?id=' + id,
      },
    })
  }
  const product = Product.getById(id)
  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: `Операція не успішна є тільки ${product.amount} одиниць товару`,
        info: 'Введіть меншу кількість товару',
        link: '/purchase-product?id=' + id,
      },
    })
  }
  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(productPrice)
  

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-create',
    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} ${amount} шт.`,
          price: `${productPrice} грн.`,
        },
        {
          text: `Доставка`,
          price: `${Purchase.DELIVERY_PRICE} грн.`,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})

//=====================================================================
router.post('/purchase-submit', function (req, res) {
  // res.render генерує нам HTML сторінку

  const id = Number(req.query.id)
  
  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,
    bonus,
    firstName,
    lastName,
    email,
    phone,
    comment,
    promocode,
  } = req.body

  const product = Product.getById(id)
  console.log(product)


  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Операція не успішна',
        info: 'Товар не знайдено',
        link: '/purchase-list',
      },
    })  
  }
  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  bonus = Number(bonus)
  amount = Number(amount) 
  console.log(totalPrice, productPrice, deliveryPrice, amount)

  if (isNaN (totalPrice) || isNaN (productPrice) || isNaN (deliveryPrice) || isNaN (amount)) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Операція не успішна',
        info: 'Введіть коректні дані',
        link: '/purchase-list',
      },
    })

  }

  if (!firstName || !lastName || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Операція не успішна',
        info: 'Незаповнені всі обовязкові поля',
        link: '/purchase-list',
      },

    })
  }
  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.updateBonusBalance(email, totalPrice, bonus) 
  
  console.log(bonusAmount)
  if (bonus > bonusAmount) {
    bonus = bonusAmount}
  Purchase.updateBonusBalance(email, totalPrice, bonus)
  totalPrice -= bonus}

  else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  
  if (promocode) {
     promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc( promocode, totalPrice)
      console.log(totalPrice)
    }
  }
   
 


  const addPurchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstName,
      lastName,
      email,
      phone,
      comment,
      promocode,
    },
    product,
  )
  product.amount -= amount
  bonus =Purchase.calcBonusAmount(totalPrice)
  console.log(addPurchase)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    data: {
      message: 'Операція успішна',
      info: 'Товар замовлено',
      link: '/purchase-list',
    },
  })
})
//=====================================================================
router.get('/purchase-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  const purchaseList = Purchase.getList()


  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-list',
    data: {
      list: purchaseList,
    },
    })

  })
// ↑↑ сюди вводимо JSON дані
//=====================================================================
router.get('/purchase-details', function (req, res) {
  const purchaseId = Number(req.query.id);
  const purchase = Purchase.getById(purchaseId);

  res.render('purchase-details', {
    style: 'purchase-details',
    data: {
      purchase,
    },
  });
});

//=====================================================================
router.get('/purchase-edit', function (req, res) {
  const purchaseId = Number(req.query.id);
  const purchase = Purchase.getById(purchaseId);

  res.render('purchase-edit', {
    style: 'purchase-edit',
    data: {
      purchase,
    },
  });
});

//=====================================================================
router.post('/purchase-edit', function (req, res) {
  const purchaseId = Number(req.body.id); // Отримайте ID покупки з форми
  console.log( purchaseId);

  // Отримайте дані, введені в форму, які ви хочете змінити
  const updatedData = {
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    email: req.body.email,
    phone: req.body.telephone, // Ви маєте поміняти 'telephone' на 'phone', оскільки в вашій формі використовується 'telephone'
  };

  // Оновіть покупку за допомогою методу Purchase.update
   Purchase.update(purchaseId, updatedData);
  

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Операція успішна',
      info: 'Дані оновлено',
      link: '/purchase-details?id= '+purchaseId,
    },
  });
});

//=====================================================================
module.exports = router
