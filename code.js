(function () {

  var
    stringsArray = [],
    objectsArray = [];

  $(document).ready(function () {

    $(document).on('click', '.js-add-array', function (event) {
      event.preventDefault();

      if ($('#js-insert-array').val() !== '') {
        var strings = $('#js-insert-array').val();
        parseString(strings);
        $('#js-add-array-form').remove();
        makeObjectsArray();
        showObjectsArray();
      }
    });

    $(document).on('click', '.js-remove-slide', function (event) {
      var id = $(this).data('id');

      event.preventDefault();

      $.each(objectsArray, function(i, element) {
        if (element.id === id){
          objectsArray.splice(i, 1);
          return false;
        }
      });
      $(this).closest('.js-add-comment-item')[0].remove();
    });

    $(document).on('click', '.js-save-slides', function (event) {
      event.preventDefault();

      for (var i = 0; i < objectsArray.length; i++) {
        objectsArray[i].id = i;
        objectsArray[i].comment = $('#add-comment' + objectsArray[i].id).val();
        console.log(objectsArray[i]);
      }

      $('.js-add-comment-item').remove();
      $(this)[0].remove();
      showSlider();
      autoplaySlider();
    });

    $(document).on('click', '.js-btn-prev', function (event) {
      event.preventDefault();
      showPrevSlide();
    });

    $(document).on('click', '.js-btn-next', function (event) {
      event.preventDefault();
      showNextSlide();
    });

    $(document).on('click', '.js-bullet', function (event) {
      var
        $this = $(this),
        id = $this.data('id'),
        offset,
        $sliderList = $('.slider-list'),
        $slide = $('.slider-item[data-id="' + id + '"]');

      event.preventDefault();
      offset = id * $slide.width();
      $sliderList.css({transitionDuration: '0.3s', left: '-' + offset + 'px'});
      $slide.addClass('active').siblings().removeClass('active');
      $this.addClass('active').siblings().removeClass('active');
    });

    $(document).on('mouseenter', '.slider', function () {
      $(this).addClass('hover');
    });

    $(document).on('mouseleave', '.slider', function () {
      $(this).removeClass('hover');
    });

  });

  function parseString(text) {
    var urlRegex = /(https?:\/\/[^\s]+\.jpe?g)/g;
    text.replace(urlRegex, function (imageURL) {
      stringsArray.push(imageURL);
    });

  }

  function makeObjectsArray() {
    for (var i = 0; i < stringsArray.length; i++) {
      var obj = {};
      obj.id = parseInt([i]);
      obj.src = stringsArray[i];
      obj.comment = '';
      objectsArray.push(obj);
    }
  }

  function showObjectsArray() {
    var
      $block = $('<div>').addClass('add-comment-item js-add-comment-item'),
      $leftInnerBlock = $('<div>').addClass('add-comment-item__left-block'),
      $rightInnerBlock = $('<div>').addClass('add-comment-item__right-block'),
      $img = $('<img>').addClass('object-image'),
      $label = $('<label>').text('Комментарий'),
      $input = $('<input>').addClass('add-comment js-add-comment'),
      $button = $('<button>').addClass('remove-slide js-remove-slide');

    for (var i = 0; i < objectsArray.length; i++) {

      $leftInnerBlock.appendTo($block);
      $rightInnerBlock.appendTo($block);
      $label.attr('for', 'add-comment' + objectsArray[i].id).appendTo($rightInnerBlock);
      $input.attr('id', 'add-comment' + objectsArray[i].id).appendTo($label);
      $button.attr('data-id', objectsArray[i].id).text('Удалить').appendTo($rightInnerBlock);
      $img.attr('src', objectsArray[i].src).appendTo($leftInnerBlock);
      $block.clone().attr('data-id', objectsArray[i].id).appendTo('.js-container');
    }
    $('<button>').attr('type', 'button').addClass('js-save-slides').text('Сохранить').appendTo('.js-container');
  }

  function showSlider() {
    var
      $slider = $('<div>').addClass('slider'),
      $sliderListWrap = $('<div>').addClass('slider-list-wrap'),
      $sliderControls = $('<div>').addClass('slider-controls'),
      $sliderNavigation = $('<div>').addClass('slider-navigation'),
      $sliderNavigationBullet = $('<div>').addClass('slider-navigation-bullet js-bullet'),
      $sliderComment = $('<div>').addClass('slider-comment'),
      $sliderList = $('<ul>').addClass('slider-list'),
      $sliderItem = $('<li>').addClass('slider-item'),
      $sliderItemPic = $('<img>').addClass('slider-item-pic'),
      $sliderControlsButtonPrev = $('<img>').addClass('slider-controls-button slider-controls-button-prev js-btn-prev'),
      $sliderControlsButtonNext = $('<img>').addClass('slider-controls-button slider-controls-button-next js-btn-next');

    for (var i = 0; i < objectsArray.length; i++) {

      if (objectsArray[i].comment !== '' && objectsArray[i].comment !== undefined) {
        $sliderComment.text(objectsArray[i].comment).appendTo($sliderItem);
      } else {
        $sliderComment.remove();
      }

      $slider.appendTo('.js-container');
      $sliderListWrap.appendTo($slider);
      $sliderControls.appendTo($slider);
      $sliderControlsButtonPrev.attr('src', 'img/next.svg').appendTo($sliderControls);
      $sliderControlsButtonNext.attr('src', 'img/next.svg').appendTo($sliderControls);
      $sliderList.appendTo($sliderListWrap);
      $sliderNavigation.appendTo($sliderControls);
      $sliderItemPic.attr('src', objectsArray[i].src).appendTo($sliderItem);
      $sliderNavigationBullet.clone().attr('data-id', objectsArray[i].id).appendTo($sliderNavigation);
      $sliderItem.clone().attr('data-id', objectsArray[i].id).appendTo($sliderList);
    }
    $sliderList.children().first().addClass('active');
    $sliderNavigation.children().first().addClass('active');
  }

  function showPrevSlide() {
    var
      $slider = $('.slider'),
      $sliderList = $slider.find('.slider-list'),
      $currentSlide = $sliderList.find('.active'),
      $prevSlide = $currentSlide.prev(),
      $clone,
      offset;

    if ($prevSlide.length) {
      move();
    } else {
      $sliderList.css({transitionDuration: '0s'});
      $clone = $currentSlide.clone();
      $clone.appendTo($sliderList);
      offset = ($sliderList.children().length - 1) * $slider.width();
      $sliderList.css({left: '-' + offset + 'px'});
      move();
      $sliderList.on('transitionend', removeClone);
      $prevSlide = $clone.prev();
    }
    $prevSlide.addClass('active').siblings().removeClass('active');
    $('.js-bullet[data-id="' + $prevSlide.data('id') + '"]').addClass('active').siblings().removeClass('active');

    function move() {
      $sliderList.css({transitionDuration: '0.3s', left: '+=' + $slider.width() + 'px'});
    }

    function removeClone() {
      $sliderList.css({transitionDuration: '0s'});
      $clone.remove();
      offset = ($sliderList.children().length - 1) * $slider.width();
      $sliderList.css({left: '-' + offset + 'px'});
      $sliderList.off('transitionend', removeClone);
    }
  }

  function showNextSlide() {
    var
      $slider = $('.slider'),
      $sliderList = $slider.find('.slider-list'),
      $currentSlide = $sliderList.find('.active'),
      $nextSlide = $currentSlide.next(),
      $clone;

    if ($nextSlide.length) {
      move();
    } else {
      $sliderList.css({transitionDuration: '0s'});
      $clone = $currentSlide.clone();
      $clone.prependTo($sliderList);
      $sliderList.css({left: 0});
      move();
      $sliderList.on('transitionend', removeClone);
      $nextSlide = $clone.next();
    }
    $nextSlide.addClass('active').siblings().removeClass('active');
    $('.js-bullet[data-id="' + $nextSlide.data('id') + '"]').addClass('active').siblings().removeClass('active');

    function move() {
      $sliderList.css({transitionDuration: '0.3s', left: '-=' + $slider.width() + 'px'});
    }

    function removeClone() {
      $sliderList.css({transitionDuration: '0s'});
      $clone.remove();
      $sliderList.css({left: 0});
      $sliderList.off('transitionend', removeClone);
    }
  }

  function autoplaySlider() {

    setInterval(function(){
     if (!$('.slider').hasClass('hover')) {
      showNextSlide();
     }
     }, 7000)
  }

}());
