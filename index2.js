
const $containerMain = $(".cards-section");
const $mainContent = $(".main-content");
const $containerIntresting = $(".conteiner-intresting");
const $containerWasWhath = $(".conteiner-watch")


// ADD TO INTRESTING

const addItemToIntr = (currentId) => {

  axios.patch(`http://localhost:3000/offers/${currentId}`,
    {
      favorite: true
    }
  )
    .then(function (response) {
      console.log(response.data)
    })
    .catch(function (error) {
      alert(error)
    })

}
const delItemFromIntr = (currentId) => {

  axios.patch(`http://localhost:3000/offers/${currentId}`,
    {
      favorite: false
    })
    .then(function (response) {
      console.log(response.data)
    })
    .catch(function (error) {
      alert(error)
    })

}
var cardTmpl = $('.card-sm');

// MODAL 
const MODAL_FIELDS = [
  {
    getId: () => '#m-card-imgurl',
    getKey: () => 'picture'
  },
  {
    getId: () => '#m-card-title',
    getKey: () => 'title'
  },
  {
    getId: () => '#m-card-description',
    getKey: () => 'info'
  },
  {
    getId: () => '#m-card-author',
    getKey: () => 'author'
  },
  {
    getId: () => '#m-card-rooms',
    getKey: () => 'rooms'
  },
  {
    getId: () => '#m-card-tel',
    getKey: () => 'telephone'
  },
  {
    getId: () => '#m-card-floors',
    getKey: () => 'floors'
  },
  {
    getId: () => '#m-card-adress',
    getKey: () => 'adress'
  },
  {
    getId: () => '#m-card-area',
    getKey: () => 'area'
  },
  {
    getId: () => '#m-card-price',
    getKey: () => 'price'
  },
  {
    getId: () => '#m-card-lng',
    getKey: () => 'lng'
  },
  {
    getId: () => '#m-card-lat',
    getKey: () => 'lat'
  },
  {
    getId: () => '#select-flat:selected',
    getKey: () => 'flat',
  }
];

function collectDataFromModal($modal) {
  let result = {};

  _.each(MODAL_FIELDS, (input) => {

    result[input.getKey()] = (($modal.find(input.getId()).val()) + {
      "favorite": false,
      "alreadySee": false

    });

  });
  console.log(result);

  return result;
}

function updateDataInDb(card, collectedData) {
  const result = _.extend({}, card, collectedData);
  axios.put(`http://localhost:3000/offers/${result.id}`, result)
    .then(resp => {
      console.log(resp);
    })
  //.catch(err=>console.error(err));
}


function updateDataInUi(card, collectedData) {
  const $card = $(`#${card.guid}`)

  $card.find('img')
    .prop('src', collectedData.picture);
  $card.find('#card-title')
    .text(collectedData.title);
  $card.find('#card-text')
    .text(collectedData.info);
  $card.find('#author')
    .text(collectedData.author)
  $card.find('#card-rooms')
    .text(collectedData.rooms);
  $card.find('#card-floor')
    .text(collectedData.floor);
    $card.find('.area')
    .text(collectedData.area); 
    $card.find('.price')
    .text(collectedData.price); 
  $card.find('#card-tel')
    .text(collectedData.telephone);

}

function showModal(dataCard) {
  let $modal = $('#modal-details').clone()

  $modal.find('#select-flat-form').hide();
 
  $modal.find('#m-card-author')
    .val(dataCard.author);
  $modal.find('#m-card-imgurl')
    .val(dataCard.picture);
  $modal.find('#m-card-title')
    .val(dataCard.title);
  $modal.find('#m-card-description')
    .val(dataCard.info);
  $modal.find('#author')
    .val(dataCard.author);
  $modal.find('#m-card-rooms')
    .val(dataCard.rooms);
  $modal.find('#m-card-adress')
    .val(dataCard.adress);
  $modal.find('#m-card-lat')
    .val(dataCard.lat);
  $modal.find('#m-card-lng')
    .val(dataCard.lng);
  $modal.find('#m-card-floors')
    .val(dataCard.floor);
  $modal.find('#m-card-tel')
    .val(dataCard.telephone);

  $modal
    .modal()
    .find('#save-btn')
    .on('click', () => {
      const collectedData = collectDataFromModal($modal);
      updateDataInUi(dataCard, collectedData);
      updateDataInDb(dataCard, collectedData);
      $modal.modal('hide');
    })
  $modal
    .on('hidden.bs.modal', () => {
      $modal.remove();
    })
  $modal
    .find('#close-btn')
    .on('click', () => {
      $modal.modal('hide');
    })
}


const showModalNewObj = (db) => {
  const modal = $("#modal-details")
  $(modal).modal("show");
  modal
    .modal()
    .find("#save-btn")
    .on("click", () => {
      let modalFLat = $(modal).find("#select-flat:selected");
      let modalAuthor = $(modal).find("#m-card-author");
      let modalInfo = $(modal).find("#m-card-description");
      let modalFloors = $(modal).find("#m-card-floors");
      let modalRooms = $(modal).find("#m-card-rooms");
      let modalArea = $(modal).find("#m-card-area");
      let modalPrice = $(modal).find("#m-card-price");
      let modalAdress = $(modal).find("#m-card-adress");
      let modalLng = $(modal).find("#m-card-lng");
      let modalLat = $(modal).find("#m-card-lat");
      let modalTelephone = $(modal).find("#m-card-tel");


      const key = {
        ["id"]: Math.floor(Math.random() * (100 - 24 + 1) + 24),
        ["flat"]: modalFLat.val(),
        ["author"]: modalAuthor.val(),
        ["info"]: modalInfo.val(),
        ["floors"]: modalFloors.val(),
        ["rooms"]: modalRooms.val(),
        ["area"]: modalArea.val(),
        ["price"]: modalPrice.val(),
        ["adress"]: modalAdress.val(),
        ["lng"]: modalLng.val(),
        ["lat"]: modalLat.val(),
        ["telephone"]: modalTelephone.val(),
        ["favorite"]: false,
        ["alreadySee"]: false,
      }
      modal.modal("hide");
      axios.post(`http://localhost:3000/offers`, key);
    })
}

// FUNCTION FOR CREATE MAP IN CARD

function initMap(lat, lng) {

  let uluru = new google.maps.LatLng(lat, lng);
  let element = document.getElementById('map');
  if (element === null) {
    return;
  } else {
    let map = new google.maps.Map(
      document.getElementById('map'), { zoom: 15, center: uluru });
    let marker = new google.maps.Marker({ position: uluru, map: map });
  }
}



const cardOpenTmpl = $('.card-open-tmpl');

const createCardForOpen = (dataCard, cardOpenTmpl) => {
  let clone = cardOpenTmpl.clone()
    .prop('id', dataCard.guid)
    .appendTo('.cards-section');

  clone.find('#img')
    .prop('src', dataCard.picture);

  clone.find('.card-title')
    .text(dataCard.title);

  clone.find('#card-text')
    .text(dataCard.info);

  clone.find('#author')
    .text(dataCard.author)

  clone.find('#card-rooms')
    .text("Кількість кімнат: " + dataCard.rooms);

  clone.find('.tel')
    .text("Контактні дані: " + dataCard.telephone);

  clone.find('#card-area')
    .text("Общая площадь: " + dataCard.area);

  clone.find('#card-adress')
    .text("Aдреса: " + dataCard.adress);

  clone.find('#card-floor')
    .text('Поверх: ' + dataCard.floor);

  clone.find('#card-price')
    .text('Вартість: ' + dataCard.price + ' тис.грн.');

  clone.find('#mapCard')
    .html(document.getElementById('map'));
  clone.find(".forMap")
    .prop('id', "map");

  let lat = dataCard.lat;
  let lng = dataCard.lng;
  initMap(lat, lng);

  clone.find("#favorite")
    .prop('id', dataCard.id)
    .on('click', () => {
      const currentId = event.currentTarget.id;

      if (dataCard.favorite === false) {
        addItemToIntr(currentId);
        clone.find(".favorite_off").addClass('favorite_on').removeClass('favorite_off')
      }
      else {
        delItemFromIntr(currentId);
        clone.find(".favorite_on").removeClass('favorite_on').addClass('favorite_off')
      }
    });

  if (dataCard.favorite === true) {
    clone.find(".favorite_off").addClass('favorite_on').removeClass('favorite_off')
  } else {
    clone.find(".favorite_on").addClass('favorite_off').removeClass('favorite_on')
  }
  clone.find('.btn_edit')
    .attr('id', new Date()
      .getTime())
    .on("click", function () {
      showModal(dataCard);
    });
  clone.find('.btn_close-card')
    .attr('id', new Date()
    .getTime())
    .on("click", function () {
      axios
        .get('http://localhost:3000/offers?_page=1&_limit=6')
        .then(response => {
          console.log(response);
          const db = response.data;
          $('.filter').removeClass("display_none");
          $('.main_slider').show();
          $(clone).hide();
          showSection(db);
          axios.patch(`http://localhost:3000/offers/${dataCard.id}`,
            {
              alreadySee: true
            })
            .then(function (response) {
              console.log(response.data)
            })
            .catch(function (error) {
              alert(error)
            })
        })
    })
}

// FUNCTION FOR CREATE CARD IN MAIN SECTION

const createCard = (dataCard, cardTmpl) => {


  let clone = cardTmpl.clone()
    .prop('id', dataCard.guid)
    .appendTo('.cards-section');

  clone.find('#img')
    .prop('src', dataCard.picture);
  clone.find('#card-title')
    .text(dataCard.title);
  clone.find('#card-text')
    .text(dataCard.info);
  clone.find('#author')
    .text(dataCard.author)
  clone.find('#card-rooms')
    .text("Кількість кімнат: " + dataCard.rooms);
    clone.find('#card-floor')
    .text("Поверх: " + dataCard.floor); 
    clone.find('#card-area')
    .text("Загальна площа: " + dataCard.area); 
    clone.find('#card-price')
    .text("Вартість: " + dataCard.price + "тис.грн.")
  clone.find('#card-tel')
    .text("Контакти: " + dataCard.telephone);

  clone.find("#favorite")
    .prop('id', dataCard.id)
    .on('click', () => {

      const currentId = event.currentTarget.id;

      if (dataCard.favorite === false) {
        addItemToIntr(currentId);
        clone.find(".favorite_off").addClass('favorite_on').removeClass('favorite_off')
      }
      else {
        delItemFromIntr(currentId);
        clone.find(".favorite_on").removeClass('favorite_on').addClass('favorite_off')
      }
    });

  if (dataCard.favorite === true) {

    clone.find(".favorite_off").addClass('favorite_on').removeClass('favorite_off')
  }
  else {
    clone.find(".favorite_on").addClass('favorite_off').removeClass('favorite_on')
  }

  clone.find('.btn_open')
    .attr('id', new Date().getTime())
    .on("click", function () {
      $('.cards-section').empty();
      $('.filter').addClass("display_none");
      $('.main_slider').hide();
      $('#more').hide();
      createCardForOpen(dataCard, cardOpenTmpl);

    });

  return clone;
}


// FUNCTION FOR CREATE CARD IN SECTION ALREADY SEEN
const cardSeenTmpl = $('.card-sm_seen');
const createSeenCard = (dataCard, cardSeenTmpl) => {

  let clone = cardSeenTmpl.clone()
    .prop('id', dataCard.guid)
    .appendTo('#section_seen');

  clone.find('#img')
    .prop('src', dataCard.picture);
  clone.find('#card-title')
    .text(dataCard.title);
  clone.find('#card-text')
    .text(dataCard.info);
  clone.find('#author')
    .text(dataCard.author)
    .prop('title', dataCard.author);
  clone.find('.price')
    .text("Ціна: " + dataCard.price + " грн.");
  clone.find('.tel')
    .text("Контактні дані: моб. " + dataCard.telephone);

  clone.find("#favorite")
    .prop('id', dataCard.id)
    .on('click', () => {

      const currentId = event.currentTarget.id;

      if (dataCard.favorite === false) {
        addItemToIntr(currentId);
        clone.find(".favorite_off").addClass('favorite_on').removeClass('favorite_off')
      }
      else {
        delItemFromIntr(currentId);
        clone.find(".favorite_on").removeClass('favorite_on').addClass('favorite_off')
      }
    });

  if (dataCard.favorite === true) {

    clone.find(".favorite_off").addClass('favorite_on').removeClass('favorite_off')
  }
  else {
    clone.find(".favorite_on").addClass('favorite_off').removeClass('favorite_on')
  }
  clone.find('.btn_open').
    attr('id', new Date().getTime())
    .on("click", function () {
      $containerMain.empty();
    $('.filter').addClass("display_none");
    $('.main_slider').hide();
    $('#more').hide();
    createCardForOpen(dataCard, cardOpenTmpl);


    });
  return clone;
}

// CREATE SECTION

const showAllSections = (db) => {
  $.each(db, function (name, section) {
    showSection(section);
  })
}

const showSeenSection = (section) => {
  $.each(section.reverse(), function (key, objInSection) {
    createSeenCard(objInSection, cardSeenTmpl);
  });
}

const showSection = (section) => {
  $.each(section.reverse(), function (key, objInSection) {
    createCard(objInSection, cardTmpl);
  });


}


// FILTER FUNCTION

const filterPrice = () => {
  $("#polzunok").slider({
    animate: "slow",
    range: true,
    values: [0, 100],
    slide: function (event, ui) {
      $("#from").val(ui.values[0]);
      $("#under").val(ui.values[1])
    }
  });
  $("#from").val($("#polzunok").slider("values", 0));
  $("#under").val($("#polzunok").slider("values", 1));

}

const getCheckFloorsCheckbox = () => {

  let checkboxesChecked = {};

  checkboxesChecked.rooms = [];
  checkboxesChecked.floor = [];
  checkboxesChecked.flat = [];
  checkboxesChecked.house = [];

  let checkboxesRoom = $('.checkboxRoom');

  for (let index = 0; index < checkboxesRoom.length; index++) {
    if (checkboxesRoom[index].checked) {
      checkboxesChecked.rooms.push(checkboxesRoom[index].value);

    }
  }

  var checkboxesFloor = $('.checkboxFloor');
  for (let index = 0; index < checkboxesFloor.length; index++) {
    if (checkboxesFloor[index].checked) {
      checkboxesChecked.floor.push(checkboxesFloor[index].value);

    }
  }

  let flatOrHouse = $('.checkboxFLatOrHouse');
  for (let index = 0; index < flatOrHouse.length; index++) {
    if (flatOrHouse[index].checked && flatOrHouse[index].value === "Квартира") {
      checkboxesChecked.flat.push("Квартира");
      // checkboxesChecked.house.push("false");
    } else if (flatOrHouse[index].checked && flatOrHouse[index].value === "Дім") {
      checkboxesChecked.flat.push("Дім");
    }
  }

  return checkboxesChecked;
}



const strForFilterRooms = () => {
  let str;
  let filter = "";

  let baseFilter = getCheckFloorsCheckbox();
  for (var nameFilter in baseFilter) {
    if (nameFilter !== undefined) {
      $.each(baseFilter[nameFilter], function (index, valueFilter) {

        filter += nameFilter + "=" + valueFilter + "&";

      })
    }
  }
  str = `http://localhost:3000/offers?${filter}`;

  return str;

}


var filterResult = () => {
  axios
    .get(strForFilterRooms())

    .then(response => {

      var filtredData = response.data;
      showSection(filtredData);

    })
}

var filterIntrsng = () => {
  axios
    .get('http://localhost:3000/offers?favorite=true')

    .then(response => {

      var filtredData = response.data;

      showSection(filtredData);

    });

}

const showPage = () => {
  let page = "";
  $('#more').on('click', function () {
    axios
      .get("http://localhost:3000/offers")
      .then(response => {
        const db = response.data;
        for (let i = 1; i < db.lenght; i++) {
          page = page + i;
        }
      })
  })
  let str = `http://localhost:3000/offers?_page=${page}&_limit=6`;
}


$(document).ready(function () {

  axios
    .get('http://localhost:3000/offers?_page=1&_limit=6')
    .then(response => {

      const db = response.data;
      showSection(db);
      filterPrice();
      let page = "1";
      $('#more').on('click', function () {
        page++;
        axios
          .get(`http://localhost:3000/offers?_page=${page}&_limit=6`)
          .then(response => {
            const db = response.data;
            showSection(db);

          })
      });
      if ($('#section_seen') !== "") {
        $('.already_see').show();
        axios
          .get('http://localhost:3000/offers?alreadySee=true')
          .then(response => {
            console.log(response);
            const db = response.data;
            showSeenSection(db);
            $('.slick-slider').slick({
              infinite: true,
              autoplay: true,
              slidesToShow: 5, //сколько слайдов показывать в карусели
              slidesToScroll: 3, // сколько слайдов прокручивать за раз
              responsive: [
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                  }
                }
              ]
            });
          })
      }
      $('.brand').on("click", function () {
        $containerMain.empty();
        $('.main_slider').show();
        $('.filter').show();
        $('#more').show();
        showSection(db);
      });
      $('#create_new').on("click", function () {
        showModalNewObj(db);
      })
      $("#flat_menu").on("click", function () {
        $('.main_slider').hide();
        $containerMain.empty();
        $('#house').prop('checked', false);
        $('#flat').prop('checked', true);
        axios.
          get('http://localhost:3000/offers?house=flat')
          .then(response => {
            const db = response.data;
            showSection(db);
          });
      });

      $("#house_menu").on("click", function () {
        $('.main_slider').hide();
        $containerMain.empty();
        $('#flat').prop('checked', false);
        $('#house').prop('checked', true);
        axios.
          get('http://localhost:3000/offers?house=house')
          .then(response => {
            const db = response.data;
            showSection(db);
          });
      });

    });


  $('#filterAll').on("click", function () {
    $containerMain.empty();
    axios
      .get(strForFilterRooms())

      .then(response => {

        var filtredData = response.data;
        var filtredArray = [];
        var priceArray = [];
        var inputPrice = $('.inputPrice');
        for (var index = 0; index < inputPrice.length; index++) {
          priceArray.push(inputPrice[index].value);
        }
        for (var i = 0; i < filtredData.length; i++) {

          if (filtredData[i].price >= priceArray[0] && filtredData[i].price < priceArray[1]) {
            filtredArray.push(filtredData[i]);
          }
        }
        showSection(filtredArray);
      })
  })

  $('#intrng').on("click", function () {
    $('.main_slider').hide();
    $containerMain.empty();
    filterIntrsng();

  })


})
