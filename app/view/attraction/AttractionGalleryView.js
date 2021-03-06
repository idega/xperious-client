define([
   'app'
],function(
    app) {


    return Backbone.View.extend({

        template: 'attraction/gallery',


        events: {
            'click .thumbs-holder a' : 'thumb'
        },


        serialize: function() {
            return {
                product: app.attractions.product.toJSON() 
            };
        },

        afterRender: function() {
            var position = 1;
            this.$('.thumbs-holder').jcarousel({
                    position: 1,
                    wrap: null,
                    scroll: 1,
                    buttonNextHTML: null,
                    buttonPrevHTML: null,
                    itemFallbackDimension: 100,
                    initCallback: function(carousel) {
                        $(".controls .prev").click(function() {
                            carousel.prev();
                            position = Math.max(1, position - 1);
                            return false;
                        });

                        $(".controls .next").click(function() {
                            carousel.next();
                            position = Math.min(carousel.last, position + 1);
                            return false;
                        });
                    },
                    itemLoadCallback: function(carousel) {
                        carousel.get(position).find('a').trigger('click');
                    }
            });

            this.$('.thumbs-holder a').each(_.bind(function(index, e) {
                if (this.parseVimeo(e.href)) {
                    this.vimeoThumb(e);
                } else if (this.parseYoutube(e.href)) {
                    this.youtubeThumb(e);
                } else {
                    $(e).append('<div class="zoom"><br></div>');
                }
            }, this));
        },
        

        thumb: function(e) {
            var media = this.$('.media-holder');
            var prev = media.find('img, iframe');
            prev.addClass('current-image');

            var html = this.embed(e.currentTarget.href);
            media.imagesLoaded(function() {
                prev.fadeOut(function() {
                    prev.remove();
                    html.removeClass('new-image');
                });
            }).prepend(html);
            return false;
        },


        parseVimeo: function(url) {
            var regExp = /http(s)?:\/\/(www\.)?vimeo.com\/(.+)($|\/)/;
            var match = url.match(regExp);
            if (match) {
                return match[3];
            }
            return false;
        },


        parseYoutube: function(url) {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[7].length == 11) {
                return match[7];
            }
            return false;
        },


        vimeoThumb: function(e) {
            $.ajax({
                url: 
                    'http://vimeo.com/api/v2/video/' +
                        this.parseVimeo(e.href) + 
                        '.json',
                dataType: 'jsonp',
                success: function(data) {
                    $(e).find('img').css('background-image', 
                    	'url("' + data[0].thumbnail_medium + '")');
                    $(e).append('<div class="video"><br></div>');
                }
            });
        },


        youtubeThumb: function(e) {
            $(e).find('img').css(
                    'background-image', 
                    'url("http://img.youtube.com/vi/' + 
                        this.parseYoutube(e.href) +
                        '/default.jpg")');
            $(e).append('<div class="video"><br></div>');
        },


        embed: function(href) {
            if (this.parseVimeo(href)) {
                return $('<div class="video-wrap vimeo"><iframe src="http://player.vimeo.com/video/' + this.parseVimeo(href) + '?autoplay=1" width="780" height="500" frameborder="0"></iframe></div>');

            } else if (this.parseYoutube(href)) {
                return $('<div class="video-wrap youtube"><iframe id="ytplayer" type="text/html" width="780" height="500" src="http://www.youtube.com/embed/' + this.parseYoutube(href) +  '?autoplay=1" frameborder="0"/></div>');

            } else {
                return $('<img class="new-image" src="" style="background-image: url(' + href + ');" />"');
            }
        }

    });

});