function sendFormData() {
  var name = document.querySelector('input[name="name"]').value;
  var phone = document.querySelector('input[name="phone"]').value;
  var telegram = document.querySelector('input[name="telegram"]').value;

  if (name && phone && telegram) {
    var products = JSON.parse(localStorage.getItem('productData'));

    var productsMessage = '';
    if (products && products.length > 0) {
      productsMessage += 'Товары в корзине:\n\n';
      var totalPrice = 0;
      products.forEach(function (product) {
        productsMessage += 'Название: ' + product.title + '\n';
        productsMessage += 'Цена: ' + product.price + '\n';
        productsMessage += 'Количество: ' + product.quantity + '\n';
        productsMessage += 'Тип: ' + product.typeOFProduct + '\n';
        var subtotal = product.price * product.quantity;
        totalPrice += subtotal;
        productsMessage += 'Сумма: ' + subtotal + '\n';
        productsMessage += '\n';
      });
      productsMessage += 'Общая сумма заказа: ' + totalPrice + '\n';
    } else {
      productsMessage = 'В корзине нет товаров.';
    }

    var message = 'Новая заявка!\n\n';
    message += 'Имя: ' + name + '\n';
    message += 'Номер телефона: ' + phone + '\n';
    message += 'Телеграм: ' + telegram + '\n\n';
    message += productsMessage;

    var token = '7110479734:AAFDVUnl4ElCNha1986QBps_0GMMT-TGWo8';

    var chatId = '-1002114939309';

    var url =
      'https://api.telegram.org/bot' +
      token +
      '/sendMessage?chat_id=' +
      chatId +
      '&text=' +
      encodeURIComponent(message);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert('Заявка успешно отправлена в чат!');
        localStorage.removeItem('productData');
        location.reload();
      })
      .catch((error) => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при отправке заявки.');
      });
  } else {
    alert('Пожалуйста, заполните все поля формы.');
  }
}
const basketCount = document.querySelector('#cart');
const basketModl = document.querySelector('#basketModal');
const basketModlContent = document.querySelector('#basketModal-container');
const mobilBurgerModal = document.getElementById('mobil-burger-modal');
const burgerModalLiNav = document.querySelectorAll('.burger-modal-li');
const mainUnitContainer = document.getElementById('main_unit-container');
const productMainWrapp = document.getElementById('product__main_wrapp');
const navItem = document.querySelectorAll('.nav-item');
const productMain = document.getElementById('product__main');
const productAddBasketBtn = document.getElementById('product__add-basket_btn');
const reviewBlockBtns = document.querySelectorAll('.review__more_btn');
const burgermenuNavs = document.querySelectorAll('.burger-modal-li a');

if (!localStorage.getItem('productData')) localStorage.setItem('productData', JSON.stringify([]));
else basketCount.textContent = JSON.parse(localStorage.getItem('productData')).length;

const swiperBanner = new Swiper('.swiper_baner', {
  slidesPerView: 1,
  spaceBetween: 10,
  direction: 'horizontal',
  loop: false,
  navigation: {
    nextEl: '#nextslide_baner',
    prevEl: '#prevslide_baner'
  }
});

const fetchData = async () => {
  try {
    const response = await fetch('./dataProduct/dataProduct.json');
    const { eSigs, chewingGum, iqos, sticks } = await response.json();
    const eSigsBlock = document.querySelector('#eSigs');
    const chewingGumBlock = document.querySelector('#chewingGum');
    const iqosBlock = document.querySelector('#iqos');
    const sticksBlock = document.querySelector('#sticks');

    const HTMLTemplate = (idElement, data) => {
      for (let product of data) {
        const new_test = JSON.stringify(product);
        idElement.innerHTML += ` 
      <div class="swiper-slide">
        <div class="product-contaianer-wrapp">
          <div class="product-contaianer">
            <div class="product-block">
              <div class="product-block-img-container">
                <img class="product-block-img" src="${product.img}" alt="Product 1" />
                <p class="product-title">${product.title}</p>
              </div>
              <button
                class="product-btn"
                data-test = '${new_test}'
             
              >
                Подробнее
              </button>
            </div>
          </div>
        </div>
      </div> `;
      }
    };

    HTMLTemplate(eSigsBlock, eSigs);
    HTMLTemplate(chewingGumBlock, chewingGum);
    HTMLTemplate(iqosBlock, iqos);
    HTMLTemplate(sticksBlock, sticks);

    const test_product_data = document.querySelectorAll('.product-btn');
    test_product_data.forEach((el) => {
      el.addEventListener('click', (e) => {
        mainUnitContainer.style.display = 'none';
        productMainWrapp.style.display = 'flex';
        const newproduct = e.target.getAttribute('data-test');
        const Testproduct = JSON.parse(newproduct);
        const { img, moreDetails, productOptionImage, title, typeOfProduct, price } = Testproduct;
        productMain.innerHTML = `
       <div class="product__img_container">
        <img src="${img}" alt="product" class="product__img" />
        <div class="product__img_menu-container" onclick="handleImageClick(event)">
        ${productOptionImage.map((item) => `<img src='${item}' alt='product' class='product__img_manu' data-src='${item}' />`).join('')}
      </div>
      
        <div class="productMobal_add_price-container">
          <div class="product__price_container">${price}<span>Р</span></div>
          <button type="button" class="product__add-basket_btn">Добавить в корзину</button>
        </div>
      </div>
      <div class="product__info_container">
        <div class="product__title_contianer">
          <h1>${title}</h1>
          <div class="product__view-quantity_container">
            <div class="product__title_container">
              <div class="product__title">Вид</div>
              <select class="product__options" id="product__options" oninput="updatePriceOnChange(event)">
                       ${typeOfProduct
                         .map((item) => `<option value='${item.type}' id ="${item.id}">${item.type}</option>`)
                         .join('')}
              </select>
            </div>
            <div class="c_title_container">
              <div class="product__title_container">
                <div class="product__title">Кол-во</div>
              <input class="product__options product_input"  id ="product_input"  oninput="quantityField(event); updatePriceOnChange(event)";" type="number" value="1">
              </div>
            </div>
          </div>
        </div>
        <div class="product__description_container">${moreDetails}</div>
        <div class="product__price_contianer">
          <div class="product__price_container">${price} <span>&#8381;</span></div>
          <button type="button" class="product__add-basket_btn" id = "product__add-basket_btn"onclick="addbasketProductStorage('${img}','${title}','${price}')">Добавить в корзину</button>
        </div>
      </div>
`;
      });
    });
    const swiperDefultSetting = {
      slidesPerView: 4,
      spaceBetween: 35,
      direction: 'horizontal',
      loop: true,
      watchOverflow: false
    };
    const swiperBreakpoits = {
      350: {
        slidesPerView: 2,
        spaceBetween: 6
      },
      648: {
        slidesPerView: 3,
        spaceBetween: 6
      },
      780: {
        slidesPerView: 2,
        spaceBetween: 10
      },
      1000: {
        slidesPerView: 3,
        spaceBetween: 35
      },
      1290: {
        slidesPerView: 4,
        spaceBetween: 35
      }
    };
    const swiperESigsBlock = new Swiper('.eSigsBlock', {
      ...swiperDefultSetting,
      navigation: {
        nextEl: '#eSigsBlocknextBtn'
      },
      breakpoints: swiperBreakpoits
    });
    const swiperChewingGumBlcok = new Swiper('.chewingGumBlcok', {
      ...swiperDefultSetting,
      navigation: {
        nextEl: '#chewingGumnexBtn'
      },
      breakpoints: swiperBreakpoits
    });
    const swiperIqosBlock = new Swiper('.iqosBlock', {
      ...swiperDefultSetting,
      navigation: {
        nextEl: '#iqosBlocknexBtn'
      },
      breakpoints: swiperBreakpoits
    });
    const swiperSticksBlock = new Swiper('.sticksBlock', {
      ...swiperDefultSetting,
      navigation: {
        nextEl: '#sticksBlocknexBtn'
      },
      breakpoints: swiperBreakpoits
    });
    const reviws = document.querySelector('.reviews');
    const reviewsSwiper_Block = new Swiper(reviws, {
      slidesPerView: 3,
      spaceBetween: 31,
      direction: 'horizontal',
      loop: true,
      navigation: {
        nextEl: '#nextReview',
        prevEl: '#prevReview'
      },
      watchOverflow: false,
      breakpoints: {
        350: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        500: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        780: {
          slidesPerView: 2,
          spaceBetween: 35
        },
        1000: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });
    const nextReview = document.querySelector('#nextReview');
    const prevReview = document.querySelector('#prevReview');
    if (reviewsSwiper_Block.isBeginning) {
      prevReview.style.display = 'none';
      nextReview.style.display = 'flex';
    }
    if (reviewsSwiper_Block.isEnd) {
      prevReview.style.display = 'flex';
      nextReview.style.display = 'none';
    }
    nextReview.addEventListener('click', () => {
      if (reviewsSwiper_Block.isBeginning) {
        prevReview.style.display = 'none';
        nextReview.style.display = 'flex';
      }
      if (reviewsSwiper_Block.isEnd) {
        prevReview.style.display = 'flex';
        nextReview.style.display = 'none';
      }
    });
    prevReview.addEventListener('click', () => {
      if (reviewsSwiper_Block.isBeginning) {
        prevReview.style.display = 'none';
        nextReview.style.display = 'flex';
      }
      if (reviewsSwiper_Block.isEnd) {
        prevReview.style.display = 'flex';
        nextReview.style.display = 'none';
      }
    });

    // console.log(reviewsSwiper_Block.isBeginning);
    // console.log(reviewsSwiper_Block.isEnd);

    return { eSigs, chewingGum, iqos, sticks };
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchData();

const calculatePrice = (type, quantity, title) => {
  let price = 0;

  // СНЮС

  if (title === 'ODENS') {
    if (type === 'COLD DRY, 13 ГР' || type === 'MINI' || type === 'SLIM') {
      if (quantity >= 5000) {
        price = 275;
      } else if (quantity >= 2500) {
        price = 295;
      } else if (quantity >= 250) {
        price = 315;
      } else if (quantity >= 60) {
        price = 335;
      } else {
        price = 485;
      }
    } else if (type === 'COLD DRY, 16 ГР') {
      if (quantity >= 5000) {
        price = 290;
      } else if (quantity >= 2500) {
        price = 310;
      } else if (quantity >= 250) {
        price = 330;
      } else if (quantity >= 60) {
        price = 350;
      } else {
        price = 500;
      }
    } else if (type === 'COLA, 16 ГР' || type === 'DOUBLE MINT, 16 ГР') {
      if (quantity >= 5000) {
        price = 300;
      } else if (quantity >= 2500) {
        price = 320;
      } else if (quantity >= 250) {
        price = 340;
      } else if (quantity >= 60) {
        price = 360;
      } else {
        price = 510;
      }
    }
  }
  if (title === 'SIBERIA') {
    if (type === '13гр') {
      if (quantity >= 5000) {
        price = 300;
      } else if (quantity >= 2500) {
        price = 320;
      } else if (quantity >= 250) {
        price = 340;
      } else if (quantity >= 60) {
        price = 360;
      } else {
        price = 510;
      }
    } else if (type === '16гр') {
      if (quantity >= 5000) {
        price = 315;
      } else if (quantity >= 2500) {
        price = 335;
      } else if (quantity >= 250) {
        price = 355;
      } else if (quantity >= 60) {
        price = 375;
      } else {
        price = 525;
      }
    } else if (type === 'SLIM') {
      if (quantity >= 5000) {
        price = 300;
      } else if (quantity >= 2500) {
        price = 320;
      } else if (quantity >= 250) {
        price = 340;
      } else if (quantity >= 60) {
        price = 360;
      } else {
        price = 510;
      }
    }
  }

  if (title === 'FISHKA') {
    if (type === 'MEDIUM') {
      if (quantity >= 2500) {
        price = 265;
      } else if (quantity >= 250) {
        price = 290;
      } else if (quantity >= 60) {
        price = 320;
      } else {
        price = 470;
      }
    } else if (type === 'STRONG' || type === 'BUBLE GUM' || type === 'COLA') {
      if (quantity >= 2500) {
        price = 275;
      } else if (quantity >= 250) {
        price = 300;
      } else if (quantity >= 60) {
        price = 330;
      } else {
        price = 480;
      }
    }
  }

  if (title === 'ARQ') {
    if (quantity >= 2500) {
      price = 285;
    } else if (quantity >= 250) {
      price = 295;
    } else if (quantity >= 60) {
      price = 305;
    } else {
      price = 455;
    }
  }

  if (title === 'HUSKY') {
    if (quantity >= 2500) {
      price = 300;
    } else if (quantity >= 250) {
      price = 310;
    } else if (quantity >= 60) {
      price = 320;
    } else {
      price = 470;
    }
  }

  if (title === 'PITBULL') {
    if (
      type === 'Гранат мята MINI 10гр' ||
      'Арбуз мята MINI 10гр' ||
      'Малина мята MINI 10гр' ||
      'Мята MINI 10гр' ||
      'Лайм мята MINI 10гр'
    ) {
      if (quantity >= 2500) {
        price = 270;
      } else if (quantity >= 250) {
        price = 280;
      } else if (quantity >= 60) {
        price = 290;
      } else {
        price = 440;
      }
    } else if (
      type === 'Персик мята SLIM 13гр' ||
      'Мята SLIM 13гр' ||
      'Лимонад мята SLIM 13гр' ||
      'Вишня мята SLIM 13гр' ||
      'Сладкая мята MINI 13гр'
    ) {
      if (quantity >= 2500) {
        price = 280;
      } else if (quantity >= 250) {
        price = 290;
      } else if (quantity >= 60) {
        price = 300;
      } else {
        price = 450;
      }
    }
  }

  if (title === 'ADMIRAL') {
    if (
      type === 'Мята STRONG SLIM' ||
      'Кола STRONG SLIM' ||
      'Жвачка STRONG SLIM' ||
      'Вишня STRONG SLIM' ||
      'Малина STRONG SLIM' ||
      'Мята LITE SLIM' ||
      'Кола LITE SLIM' ||
      'Жвачка LITE SLIM' ||
      'Вишня LITE SLIM' ||
      'Малина LITE SLIM'
    ) {
      if (quantity >= 2500) {
        price = 280;
      } else if (quantity >= 250) {
        price = 290;
      } else if (quantity >= 60) {
        price = 300;
      } else {
        price = 450;
      }
    } else if (
      type === 'Мята STANDART STRONG' ||
      'Ананас STANDART STRONG' ||
      'Лесные ягоды STANDART STRONG' ||
      'Благородный табак STANDART STRONG' ||
      'Виноград STANDART STRONG'
    ) {
      if (quantity >= 2500) {
        price = 270;
      } else if (quantity >= 250) {
        price = 280;
      } else if (quantity >= 60) {
        price = 290;
      } else {
        price = 440;
      }
    }
  }

  if (title === 'ICEBERG') {
    if (quantity >= 2500) {
      price = 210;
    } else if (quantity >= 250) {
      price = 240;
    } else if (quantity >= 60) {
      price = 260;
    } else {
      price = 410;
    }
  }

  // ЭЛЕКТРОННЫЕ СИГАРЕТЫ
  if (title === 'WAKA SOLO 1800') {
    if (quantity >= 1000) {
      price = 552;
    } else if (quantity >= 40) {
      price = 552;
    } else {
      price = 552;
    }
  }

  if (title === 'WAKA SLAM 2300') {
    if (quantity >= 1000) {
      price = 673;
    } else if (quantity >= 40) {
      price = 673;
    } else {
      price = 673;
    }
  }

  if (title === 'WAKA SMASH 6000') {
    if (quantity >= 1000) {
      price = 390;
    } else if (quantity >= 40) {
      price = 410;
    } else {
      price = 650;
    }
  }
  if (title === 'WAKA SoPRO 7000') {
    if (quantity >= 1000) {
      price = 370;
    } else if (quantity >= 40) {
      price = 430;
    } else {
      price = 600;
    }
  }
  if (title === 'WAKA SoPRO 10000') {
    if (quantity >= 1000) {
      price = 530;
    } else if (quantity >= 40) {
      price = 550;
    } else {
      price = 800;
    }
  }
  if (title === 'SMPO Ola') {
    if (quantity >= 1000) {
      price = 380;
    } else if (quantity >= 40) {
      price = 380;
    } else {
      price = 380;
    }
  }
  if (title === 'DLTA DL6000') {
    if (quantity >= 1000) {
      price = 520;
    } else if (quantity >= 40) {
      price = 520;
    } else {
      price = 520;
    }
  }
  if (title === 'DLTA DL8000') {
    if (quantity >= 1000) {
      price = 840;
    } else if (quantity >= 40) {
      price = 840;
    } else {
      price = 840;
    }
  }
  if (title === 'Viento VT 6000') {
    if (quantity >= 1000) {
      price = 670;
    } else if (quantity >= 40) {
      price = 670;
    } else {
      price = 670;
    }
  }
  if (title === 'Fummo Target') {
    if (quantity >= 1000) {
      price = 620;
    } else if (quantity >= 40) {
      price = 620;
    } else {
      price = 620;
    }
  }
  if (title === 'Fummo Spirit') {
    if (quantity >= 1000) {
      price = 945;
    } else if (quantity >= 40) {
      price = 945;
    } else {
      price = 945;
    }
  }
  if (title === 'Fummo Indic') {
    if (quantity >= 1000) {
      price = 1065;
    } else if (quantity >= 40) {
      price = 1065;
    } else {
      price = 1065;
    }
  }

  // IQOS

  if (title === 'IQOS Iluma') {
    if (quantity >= 1000) {
      price = 7200;
    } else if (quantity >= 400) {
      price = 7200;
    } else {
      price = 7200;
    }
  }

  if (title === 'IQOS Iluma Prime') {
    if (quantity >= 1000) {
      price = 12500;
    } else if (quantity >= 400) {
      price = 12500;
    } else {
      price = 12500;
    }
  }

  if (title === 'TEREA') {
    if (quantity >= 1000) {
      price = 200;
    } else if (quantity >= 400) {
      price = 200;
    } else {
      price = 200;
    }
  }

  // console.log("Price for", type, "with quantity", quantity, "and title", title, "is", price);
  return price;
};

const updatePriceOnChange = (event) => {
  const newQuantity = parseInt(document.getElementById('product_input').value); // Получаем новое количество из поля ввода
  const productType = document.getElementById('product__options').value; // Получаем значение выбранного вида продукта
  const productTitle = document.querySelector('.product__title_contianer h1').textContent.trim(); // Получаем название продукта

  const newPrice = calculatePrice(productType, newQuantity, productTitle); // Вычисляем новую цену

  // Обновляем цену на странице
  document.querySelectorAll('.product__price_container').forEach((priceContainer) => {
    priceContainer.textContent = newPrice + ' ₽';
  });
};

// Глобальная функция для обработки клика на изображении в меню
function handleImageClick(event) {
  const newImgSrc = event.target.getAttribute('data-src'); // Получаем путь к новому изображению
  const productImg = document.querySelector('.product__img'); // Находим основное изображение
  productImg.setAttribute('src', newImgSrc); // Меняем его src на путь нового изображения
}


let moreButtonState = false;
reviewBlockBtns.forEach((moreBtn) => {
  moreBtn.addEventListener('click', () => {
    moreButtonState = !moreButtonState;
    if (moreButtonState) {
      moreBtn.parentNode.querySelector('.text').style.height = 'max-content';
      moreBtn.textContent = 'свернуть';
    } else {
      if (outerWidth > 500) {
        moreBtn.parentNode.querySelector('.text').style.height = '170px';
      } else if (outerWidth < 500) {
        moreBtn.parentNode.querySelector('.text').style.height = '94px';
      }
      moreBtn.textContent = 'подробнее...';
    }
  });
});

document.addEventListener('DOMContentLoaded ', function () {
  var downloadTrigger = document.getElementById('downloadTrigger');

  downloadTrigger.addEventListener('click ', function () {
    var downloadLink = document.createElement('a ');
    downloadLink.href = 'Новый-документ.pdf '; // Замените на путь к вашему документу
    downloadLink.download = 'Типы.pdf '; // Замените на желаемое имя файла

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
});

// Проверяем, было ли уже показано окно
if (!localStorage.getItem('ageConfirmationShown')) {
  // Если окно еще не было показано, показываем его
  window.onload = function () {
    document.getElementById('ageModal').style.display = 'flex';
  };

  // Помечаем, что окно было показано
  localStorage.setItem('ageConfirmationShown', 'true');
}

// Функция для обработки ответа "Да"
function confirmAge() {
  document.getElementById('ageModal').style.display = 'none';
  // Записываем информацию о подтверждении возраста
  localStorage.setItem('ageConfirmed', 'true');
}

const rejectAge = () => alert('Вы должны быть старше 18 лет для доступа к сайту.');

const openForm = () => {
  if (basketModl.style.display == 'block') basketModl.style.display = 'none';
  if (mobilBurgerModal.style.display == 'block') mobilBurgerModal.style.display = 'none';
  document.getElementById('myForm').style.display = 'flex';
};

const basketProductHtml = (basketModlContent, storageProduct) => {
  const calculatePrice = (type, quantity, title) => {
    let price = 0;

    // СНЮС

    if (title === 'ODENS') {
      if (type === 'COLD DRY, 13 ГР' || type === 'MINI' || type === 'SLIM') {
        if (quantity >= 5000) {
          price = 275;
        } else if (quantity >= 2500) {
          price = 295;
        } else if (quantity >= 250) {
          price = 315;
        } else if (quantity >= 60) {
          price = 335;
        } else {
          price = 485;
        }
      } else if (type === 'COLD DRY, 16 ГР') {
        if (quantity >= 5000) {
          price = 290;
        } else if (quantity >= 2500) {
          price = 310;
        } else if (quantity >= 250) {
          price = 330;
        } else if (quantity >= 60) {
          price = 350;
        } else {
          price = 500;
        }
      } else if (type === 'COLA, 16 ГР' || type === 'DOUBLE MINT, 16 ГР') {
        if (quantity >= 5000) {
          price = 300;
        } else if (quantity >= 2500) {
          price = 320;
        } else if (quantity >= 250) {
          price = 340;
        } else if (quantity >= 60) {
          price = 360;
        } else {
          price = 510;
        }
      }
    }
    if (title === 'SIBERIA') {
      if (type === '13гр') {
        if (quantity >= 5000) {
          price = 300;
        } else if (quantity >= 2500) {
          price = 320;
        } else if (quantity >= 250) {
          price = 340;
        } else if (quantity >= 60) {
          price = 360;
        } else {
          price = 510;
        }
      } else if (type === '16гр') {
        if (quantity >= 5000) {
          price = 315;
        } else if (quantity >= 2500) {
          price = 335;
        } else if (quantity >= 250) {
          price = 355;
        } else if (quantity >= 60) {
          price = 375;
        } else {
          price = 525;
        }
      } else if (type === 'SLIM') {
        if (quantity >= 5000) {
          price = 300;
        } else if (quantity >= 2500) {
          price = 320;
        } else if (quantity >= 250) {
          price = 340;
        } else if (quantity >= 60) {
          price = 360;
        } else {
          price = 510;
        }
      }
    }

    if (title === 'FISHKA') {
      if (type === 'MEDIUM') {
        if (quantity >= 2500) {
          price = 265;
        } else if (quantity >= 250) {
          price = 290;
        } else if (quantity >= 60) {
          price = 320;
        } else {
          price = 470;
        }
      } else if (type === 'STRONG' || type === 'BUBLE GUM' || type === 'COLA') {
        if (quantity >= 2500) {
          price = 275;
        } else if (quantity >= 250) {
          price = 300;
        } else if (quantity >= 60) {
          price = 330;
        } else {
          price = 480;
        }
      }
    }

    if (title === 'ARQ') {
      if (quantity >= 2500) {
        price = 285;
      } else if (quantity >= 250) {
        price = 295;
      } else if (quantity >= 60) {
        price = 305;
      } else {
        price = 455;
      }
    }

    if (title === 'HUSKY') {
      if (quantity >= 2500) {
        price = 300;
      } else if (quantity >= 250) {
        price = 310;
      } else if (quantity >= 60) {
        price = 320;
      } else {
        price = 470;
      }
    }

    if (title === 'PITBULL') {
      if (
        type === 'Гранат мята MINI 10гр' ||
        'Арбуз мята MINI 10гр' ||
        'Малина мята MINI 10гр' ||
        'Мята MINI 10гр' ||
        'Лайм мята MINI 10гр'
      ) {
        if (quantity >= 2500) {
          price = 270;
        } else if (quantity >= 250) {
          price = 280;
        } else if (quantity >= 60) {
          price = 290;
        } else {
          price = 440;
        }
      } else if (
        type === 'Персик мята SLIM 13гр' ||
        'Мята SLIM 13гр' ||
        'Лимонад мята SLIM 13гр' ||
        'Вишня мята SLIM 13гр' ||
        'Сладкая мята MINI 13гр'
      ) {
        if (quantity >= 2500) {
          price = 280;
        } else if (quantity >= 250) {
          price = 290;
        } else if (quantity >= 60) {
          price = 300;
        } else {
          price = 450;
        }
      }
    }

    if (title === 'ADMIRAL') {
      if (
        type === 'Мята STRONG SLIM' ||
        'Кола STRONG SLIM' ||
        'Жвачка STRONG SLIM' ||
        'Вишня STRONG SLIM' ||
        'Малина STRONG SLIM' ||
        'Мята LITE SLIM' ||
        'Кола LITE SLIM' ||
        'Жвачка LITE SLIM' ||
        'Вишня LITE SLIM' ||
        'Малина LITE SLIM'
      ) {
        if (quantity >= 2500) {
          price = 280;
        } else if (quantity >= 250) {
          price = 290;
        } else if (quantity >= 60) {
          price = 300;
        } else {
          price = 450;
        }
      } else if (
        type === 'Мята STANDART STRONG' ||
        'Ананас STANDART STRONG' ||
        'Лесные ягоды STANDART STRONG' ||
        'Благородный табак STANDART STRONG' ||
        'Виноград STANDART STRONG'
      ) {
        if (quantity >= 2500) {
          price = 270;
        } else if (quantity >= 250) {
          price = 280;
        } else if (quantity >= 60) {
          price = 290;
        } else {
          price = 440;
        }
      }
    }

    if (title === 'ICEBERG') {
      if (quantity >= 2500) {
        price = 210;
      } else if (quantity >= 250) {
        price = 240;
      } else if (quantity >= 60) {
        price = 260;
      } else {
        price = 410;
      }
    }

    // ЭЛЕКТРОННЫЕ СИГАРЕТЫ
    if (title === 'WAKA SOLO 1800') {
      if (quantity >= 1000) {
        price = 552;
      } else if (quantity >= 40) {
        price = 552;
      } else {
        price = 552;
      }
    }

    if (title === 'WAKA SLAM 2300') {
      if (quantity >= 1000) {
        price = 673;
      } else if (quantity >= 40) {
        price = 673;
      } else {
        price = 673;
      }
    }

    if (title === 'WAKA SMASH 6000') {
      if (quantity >= 1000) {
        price = 390;
      } else if (quantity >= 40) {
        price = 410;
      } else {
        price = 650;
      }
    }
    if (title === 'WAKA SoPRO 7000') {
      if (quantity >= 1000) {
        price = 370;
      } else if (quantity >= 40) {
        price = 430;
      } else {
        price = 600;
      }
    }
    if (title === 'WAKA SoPRO 10000') {
      if (quantity >= 1000) {
        price = 530;
      } else if (quantity >= 40) {
        price = 550;
      } else {
        price = 800;
      }
    }
    if (title === 'SMPO Ola') {
      if (quantity >= 1000) {
        price = 380;
      } else if (quantity >= 40) {
        price = 380;
      } else {
        price = 380;
      }
    }
    if (title === 'DLTA DL6000') {
      if (quantity >= 1000) {
        price = 520;
      } else if (quantity >= 40) {
        price = 520;
      } else {
        price = 520;
      }
    }
    if (title === 'DLTA DL8000') {
      if (quantity >= 1000) {
        price = 840;
      } else if (quantity >= 40) {
        price = 840;
      } else {
        price = 840;
      }
    }
    if (title === 'Viento VT 6000') {
      if (quantity >= 1000) {
        price = 670;
      } else if (quantity >= 40) {
        price = 670;
      } else {
        price = 670;
      }
    }
    if (title === 'Fummo Target') {
      if (quantity >= 1000) {
        price = 620;
      } else if (quantity >= 40) {
        price = 620;
      } else {
        price = 620;
      }
    }
    if (title === 'Fummo Spirit') {
      if (quantity >= 1000) {
        price = 945;
      } else if (quantity >= 40) {
        price = 945;
      } else {
        price = 945;
      }
    }
    if (title === 'Fummo Indic') {
      if (quantity >= 1000) {
        price = 1065;
      } else if (quantity >= 40) {
        price = 1065;
      } else {
        price = 1065;
      }
    }

    // IQOS

    if (title === 'IQOS Iluma') {
      if (quantity >= 1000) {
        price = 7200;
      } else if (quantity >= 400) {
        price = 7200;
      } else {
        price = 7200;
      }
    }

    if (title === 'IQOS Iluma Prime') {
      if (quantity >= 1000) {
        price = 12500;
      } else if (quantity >= 400) {
        price = 12500;
      } else {
        price = 12500;
      }
    }

    if (title === 'TEREA') {
      if (quantity >= 1000) {
        price = 200;
      } else if (quantity >= 400) {
        price = 200;
      } else {
        price = 200;
      }
    }

    // console.log("Price for", type, "with quantity", quantity, "and title", title, "is", price);
    return price;
  };

  let summ = 0;
  storageProduct.forEach((count) => {
    count.totalPrice = calculatePrice(count.typeOFProduct, count.quantity, count.title) * count.quantity;
    // console.log("Total price for", count.typeOFProduct, "with quantity", count.quantity, "is", count.totalPrice);
    summ += count.totalPrice;
  });

  // console.log("Summ:", summ);

  basketModlContent.innerHTML = `<div class="basketModal-product-block-wrapp">
    ${storageProduct
      .map(
        (item, index) =>
          `<div class="basketModal-product-block">
            <div class="basketModal-img-container">
              <img src="${item.img}" />
              <div class="basketModal-title-container">
                <h3>${item.title} <p class ="basket__title_view">${item.typeOFProduct}</p></h3>
                <p>${item.quantity} штук</p>
              </div>
            </div>
            <img src="./images/icons/cross.png" alt="delet" class="basketModal-delet-product" onclick="deletProductStorage(${index})" />
          </div>`
      )
      .join('')}
    </div >
    <div class="basketModal-total-amount">
      <div class="basketModal-total-container">
        <div>Итог:</div>
        <div>${summ}<span> рублей.</span></div>
      </div>
      <button class="basketModla-btn" type="button" onclick="openForm()">Оставить заявку</button>
    </div>`;
};

const closeForm = () => (document.getElementById('myForm').style.display = 'none ');
const openMobalBurger = () => {
  if (basketModl.style.display == 'flex') basketModl.style.display = 'none';
  mobilBurgerModal.style.display = 'block';
};
const closeMobalBurger = () => (mobilBurgerModal.style.display = 'none');
const openBasker = () => {
  basketModl.style.display = 'flex';
  if (basketModl.style.display == 'flex') mobilBurgerModal.style.display = 'none';
  const basketProducts = JSON.parse(localStorage.getItem('productData'));
  basketProductHtml(basketModlContent, basketProducts);
};
const closeBasker = () => (basketModl.style.display = 'none');
const deletProductStorage = (id) => {
  const ProductsStorage = JSON.parse(localStorage.getItem('productData'));
  const newProductStorage = ProductsStorage.filter((elem, index) => index !== id);
  localStorage.setItem('productData', JSON.stringify(newProductStorage));
  basketProductHtml(basketModlContent, newProductStorage);
  basketCount.textContent = newProductStorage.length;
};

burgerModalLiNav.forEach((nav) => {
  nav.addEventListener('click', () => {
    mobilBurgerModal.style.display = 'none';
    if (mainUnitContainer.style.display == 'none' && productMainWrapp.style.display == 'flex') {
      mainUnitContainer.style.display = 'block';
      productMainWrapp.style.display = 'none';
    }
  });
});
navItem.forEach((nav) => {
  nav.addEventListener('click', () => {
    if (mainUnitContainer.style.display == 'none' && productMainWrapp.style.display == 'flex') {
      mainUnitContainer.style.display = 'block';
      productMainWrapp.style.display = 'none';
    }
  });
});
const ClickHomePage = () => {
  if (mainUnitContainer.style.display == 'none' && productMainWrapp.style.display == 'flex') {
    mainUnitContainer.style.display = 'block';
    productMainWrapp.style.display = 'none';
  }
};

const quantityField = (e) => {
  if (e.target.value.length == 2) {
    let firstNumber = parseInt(e.target.value.charAt(0), 10);
    if (firstNumber == 0) document.getElementById('product_input').value = 1;
  }
  if (e.target.value < 0) document.getElementById('product_input').value = 1;
};
const addbasketProductStorage = (img, title, price) => {
  const typeoFProduct = document.getElementById('product__options');
  const quantity = Number(document.getElementById('product_input').value);
  const typeID = typeoFProduct.options[typeoFProduct.selectedIndex].id;
  const typeValue = typeoFProduct.value;
  const countBlockAnimate = document.querySelector('.cart-count');
  countBlockAnimate.classList.add('cart-countAniamtiaon');
  setTimeout(function () {
    countBlockAnimate.classList.remove('cart-countAniamtiaon');
  }, 1000);

  addnewProduct = JSON.parse(localStorage.getItem('productData'));
  let newQuantity = 0;
  if (quantity == 0) {
    newQuantity = 1;
    document.getElementById('product_input').value = newQuantity;
  } else newQuantity = quantity;

  if (addnewProduct.length == 0) {
    let sum = 0;
    if (newQuantity > 1) sum = Number(price) * newQuantity;
    addnewProduct.push({
      img: img,
      title: title,
      quantity: newQuantity,
      typeID: Number(typeID),
      typeOFProduct: typeValue,
      price: Number(price),
      totalPrice: sum
    });
    localStorage.setItem('productData', JSON.stringify(addnewProduct));
  } else {
    addnewProduct = addnewProduct.map((item) => {
      if (item.title === title && item.typeID === Number(typeID)) {
        (item.quantity = item.quantity + newQuantity), (item.totalPrice = item.quantity * item.price);
        return item;
      } else return item;
    });
    let isFound = addnewProduct.some((item) => item.title === title && item.typeID === Number(typeID));
    if (!isFound) {
      let sum = 0;
      if (newQuantity > 1) sum = Number(price) * newQuantity;
      addnewProduct.push({
        img: img,
        title: title,
        quantity: newQuantity,
        typeID: Number(typeID),
        typeOFProduct: typeValue,
        price: Number(price),
        totalPrice: sum
      });
    }

    localStorage.setItem('productData', JSON.stringify(addnewProduct));
  }
  basketProductHtml(basketModlContent, addnewProduct);

  basketCount.textContent = JSON.parse(localStorage.getItem('productData')).length;
};

function submitForm() {
  var formData = new FormData(document.getElementById('applicationForm '));

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        // Ваши действия после успешной отправки формы
        alert('Заявка успешно отправлена! ');
        closeForm(); // Закрываем форму после успешной отправки
      } else {
        // Ваши действия в случае ошибки отправки формы
        alert('Произошла ошибка при отправке заявки. ');
      }
    }
  };

  xhr.open('POST ', 'submit.php ', true);
  xhr.send(formData);
}
burgermenuNavs.forEach((el) => {
  el.addEventListener('click', () => {
    setTimeout(() => {
      const blockId = el.getAttribute('href').substring(1);
      const blockSection = document.getElementById(blockId);
      let test_block = blockSection.offsetTop;
      window.scrollTo({
        top: test_block - 100,
        behavior: 'smooth'
      });
    }, 12);
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const navbarLinks = document.querySelectorAll('.navbar a');
  window.addEventListener('scroll', () => {
    updateActiveNav();
  });

  navbarLinks.forEach((link) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      navbarLinks.forEach((link) => link.classList.remove('active'));
      this.classList.add('active');
      updateAnimationPosition(this);
      const targetId = this.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });

  function updateActiveNav() {
    const scrollPosition = window.scrollY;
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;

    navbarLinks.forEach((link) => {
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        let offset = 0;

        // Рассчитываем смещение в зависимости от способа скролла
        if (scrollPosition >= targetSection.offsetTop - navbarHeight - 130) {
          offset = 200; // Если скролл произошел ручками
        } else {
          offset = 200; // Если скролл был инициирован нажатием на кнопку навигации
        }
        const targetSectionTop = targetSection.offsetTop - navbarHeight - offset;
        const targetSectionBottom = targetSectionTop + targetSection.offsetHeight;
        // if (targetId === 'contact') {
        //   offset += 700; // Больший отступ для раздела "Контакты"
        // }

        if (scrollPosition >= targetSectionTop && scrollPosition < targetSectionBottom) {
          updateAnimationPosition(link);
          navbarLinks.forEach((link) => link.classList.remove('active'));
          link.classList.add('active');
        } else if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          updateAnimationPosition(link);
          navbarLinks.forEach((link) => link.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  function updateAnimationPosition(clickedLink) {
    const navbarAnimation = document.querySelector('.navbar_animation');
    const linkRect = clickedLink.getBoundingClientRect();
    navbarAnimation.style.left = `${linkRect.left}px`;
    navbarAnimation.style.width = `${linkRect.width}px`;
  }

  function scrollToSection(targetId) {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      window.scrollTo({
        top: targetSection.offsetTop - navbarHeight - 200, // Смещение на 50px вверх при скролле ручками
        behavior: 'smooth'
      });
    }
  }
});
