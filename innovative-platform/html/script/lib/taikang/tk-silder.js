;(function ($, window, document, undefined) {

  var Silder = function (elem) {
    var self = this;

    this.$oWrapper = elem;
    this.$slider_wrap = this.$oWrapper.find('.slider-wrapper');
    this.$slider_item = this.$slider_wrap.find('.item');
    this.$slider_prev = this.$oWrapper.find('.slider-prev');
    this.$slider_next = this.$oWrapper.find('.slider-next');
    this.$slider_title = this.$oWrapper.find('.slider-title').find('h2');
    this.$slider_author = this.$oWrapper.find('.slider-title').find('span');
    this.$slider_btn = this.$oWrapper.find('.slider-btns').find('.item');

    this.slider_w = this.$oWrapper.width();
    this.slider_len = this.$slider_item.length;
    this.data_title = [];
    this.data_author = [];
    this.b_stop = true;
    this.iNum = 0;
    this.iNum2 = 0;
    this.timer = null;

    this.$slider_item.each(function  (i) {
      self.data_title.push($(this).attr('data-title'));
      self.data_author.push($(this).attr('data-author') ? $(this).attr('data-author') : '');
    });
  };

  Silder.prototype = {
    inital: function () {
      var self = this;

      this.$slider_wrap.css({width: this.slider_len * this.slider_w});

      this.setInfo(0);

      this.$slider_btn.click(function () {
        self.setInfo($(this).index());

        self.iNum = $(this).index();
        self.iNum2 = $(this).index();
      });

      this.$slider_prev.click(function () {
        if (self.b_stop) {
          self.b_stop = false;
        
          if (self.iNum === 0) {
            self.iNum = self.$slider_item.length - 1;
          } else {
            self.iNum --;
          }

          self.iNum2 --;

          self.setInfo(self.iNum);
        }
      });

      this.$slider_next.click(function () {
        if (self.b_stop) {
          self.b_stop = false;

          if (self.iNum === self.$slider_item.length - 1) {
            self.iNum = 0;
          } else {
            self.iNum ++;
          }

          self.iNum2 ++;

          self.setInfo(self.iNum);
        }
      });

      // 自动播放
      this.autoPlay();

      this.$oWrapper.hover(function () {
        clearInterval(self.timer);
      }, function () {
        self.autoPlay();
      });
    },

    setInfo: function (index) {
      var self = this;

      if (this.iNum2 <= this.slider_len - 1 && this.iNum2 !== -1) { // 普通情况下
        this.$slider_wrap.animate({left: this.slider_w * -index}, function () {
          self.b_stop = true;
        });
      } else if (this.iNum2 > this.slider_len - 1) { // 最后一张无缝切到第一张
        this.$slider_item.eq(0).css({position: 'relative', left: this.slider_w * this.slider_len});

        this.$slider_wrap.animate({left: -this.slider_w * this.iNum2}, function () {
          self.b_stop = true;

          self.iNum2 = 0;
          self.$slider_item.eq(0).css({position: 'static'});
          self.$slider_wrap.css({left: 0});
        });
      } else { // 第一张无缝切到最后一张
        this.$slider_item.eq(this.slider_len - 1).css({position: 'relative', left: -this.slider_w * this.slider_len});

        this.$slider_wrap.an
        self.b_stop = true;
        this.$slider_wrap.animate({left: -this.slider_w * this.iNum2}, function () {
          self.iNum2 = self.slider_len - 1;
          self.$slider_item.eq(self.slider_len - 1).css({position: 'static'});
          self.$slider_wrap.css({left: (self.slider_len - 1) * -self.slider_w});
        });
      }

      this.$slider_btn.removeClass('item-cur');
      this.$slider_btn.eq(index).addClass('item-cur');

      this.$slider_title.html(this.data_title[index]);
      if (this.data_author[index]) {
        this.$slider_author.html(this.data_author[index]);
      } else {
        this.$slider_author.html('');
      }
    },

    autoPlay: function () {
      var self = this;

      this.timer = setInterval(function () {
        self.$slider_next.click();
      }, 4000);
    },

    constructor: Silder
  };

  $.fn.slider = function () {
    var silder = new Silder(this);
    silder.inital();
  };

})(jQuery, window, document);