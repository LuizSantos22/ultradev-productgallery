(function($) {
    $(document).ready(function() {

        var DESKTOP_BREAKPOINT = 768;
        var $slider = $('#itemslider-zoom');

        if (!$slider.length) return;

        if ($(window).width() >= DESKTOP_BREAKPOINT) {
            initVerticalSlider($slider);
        } else {
            initHorizontalSlider($slider);
        }

        $(window).on('themeResize', function() {
            if ($(window).width() >= DESKTOP_BREAKPOINT) {
                destroyHorizontalSlider($slider);
                initVerticalSlider($slider);
            } else {
                destroyVerticalSlider($slider);
                initHorizontalSlider($slider);
            }
        });

        initLightbox();
        initMainImageSwipe($slider);

        // ── SWIPE NA IMAGEM PRINCIPAL (mobile) ────────────────────

        function initMainImageSwipe($slider) {
            var $viewport = $('#main-image-viewport');
            if (!$viewport.length) return;

            var touchStartX = 0;
            var touchStartY = 0;
            var SWIPE_THRESHOLD = 40; // px mínimos para considerar swipe

            $viewport[0].addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].clientX;
                touchStartY = e.changedTouches[0].clientY;
            }, { passive: true });

            $viewport[0].addEventListener('touchend', function(e) {
                var dx = e.changedTouches[0].clientX - touchStartX;
                var dy = e.changedTouches[0].clientY - touchStartY;

                // Ignora se o movimento foi mais vertical que horizontal (scroll de página)
                if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;

                var $items   = $slider.children('.item');
                var total    = $items.length;
                if (total < 2) return;

                // Descobre o item atualmente ativo pela src da imagem principal
                var currentSrc = $('#image').attr('src') || '';
                var currentIdx = -1;
                $items.each(function(i) {
                    var $img = $(this).find('img');
                    if ($img.length && currentSrc.indexOf($img.attr('src').split('/').pop()) !== -1) {
                        currentIdx = i;
                    }
                });
                if (currentIdx === -1) currentIdx = 0;

                var nextIdx = dx < 0
                    ? Math.min(currentIdx + 1, total - 1)  // swipe esquerda → próximo
                    : Math.max(currentIdx - 1, 0);          // swipe direita  → anterior

                if (nextIdx === currentIdx) return;

                // Simula clique no item alvo
                $items.eq(nextIdx).find('a').trigger('click');

                // Atualiza posição visível do slider para o item ativo
                if ($(window).width() < DESKTOP_BREAKPOINT) {
                    var itemWidth = $items.first().outerWidth(true) || 74;
                    $slider.animate({ scrollLeft: nextIdx * itemWidth }, 250);
                }
            }, { passive: true });
        }

        // ── VERTICAL SLIDER (desktop) ─────────────────────────────

        function initVerticalSlider($slider) {
            $slider.addClass('vertical-slider');

            var $upBtn     = $('.vertical-slider-arrow.up');
            var $downBtn   = $('.vertical-slider-arrow.down');
            var itemHeight = $slider.children('.item').first().outerHeight(true) || 76;
            var visible    = 5;
            var total      = $slider.children('.item').length;
            var current    = 0;

            if (total <= visible) {
                $upBtn.prop('disabled', true);
                $downBtn.prop('disabled', true);
                return;
            }

            function updateArrows() {
                $upBtn.prop('disabled', current === 0);
                $downBtn.prop('disabled', current >= total - visible);
            }

            function scrollTo(index) {
                if (index < 0) index = 0;
                if (index > total - visible) index = total - visible;
                current = index;
                $slider.animate({ scrollTop: current * itemHeight }, 300);
                updateArrows();
            }

            $upBtn.off('click.vslider').on('click.vslider', function(e) {
                e.preventDefault();
                scrollTo(current - 1);
            });

            $downBtn.off('click.vslider').on('click.vslider', function(e) {
                e.preventDefault();
                scrollTo(current + 1);
            });

            updateArrows();
        }

        function destroyVerticalSlider($slider) {
            $slider.removeClass('vertical-slider');
            $('.vertical-slider-arrow').off('click.vslider');
            $slider.scrollTop(0);
        }

        // ── HORIZONTAL SLIDER (mobile) — scroll nativo + setas ────

        function initHorizontalSlider($slider) {
            $slider.removeClass('vertical-slider');

            // Troca ícones para horizontal
            $('.vertical-slider-arrow.up').removeClass('ic-up').addClass('ic-left');
            $('.vertical-slider-arrow.down').removeClass('ic-down').addClass('ic-right');

            var $leftBtn  = $('.vertical-slider-arrow.up');   // up  → esquerda
            var $rightBtn = $('.vertical-slider-arrow.down');  // down → direita
            var itemWidth = $slider.children('.item').first().outerWidth(true) || 74;

            function updateArrows() {
                var scrollLeft = $slider.scrollLeft();
                var maxScroll  = $slider[0].scrollWidth - $slider[0].clientWidth;
                $leftBtn.prop('disabled',  scrollLeft <= 0);
                $rightBtn.prop('disabled', scrollLeft >= maxScroll - 1);
            }

            $leftBtn.off('click.hslider').on('click.hslider', function(e) {
                e.preventDefault();
                $slider.animate({ scrollLeft: $slider.scrollLeft() - itemWidth }, 250);
            });

            $rightBtn.off('click.hslider').on('click.hslider', function(e) {
                e.preventDefault();
                $slider.animate({ scrollLeft: $slider.scrollLeft() + itemWidth }, 250);
            });

            $slider.off('scroll.hslider').on('scroll.hslider', updateArrows);

            updateArrows();
        }

        function destroyHorizontalSlider($slider) {
            // Restaura ícones para vertical
            $('.vertical-slider-arrow.up').removeClass('ic-left').addClass('ic-up');
            $('.vertical-slider-arrow.down').removeClass('ic-right').addClass('ic-down');

            var $leftBtn  = $('.vertical-slider-arrow.up');
            var $rightBtn = $('.vertical-slider-arrow.down');
            $leftBtn.off('click.hslider');
            $rightBtn.off('click.hslider');
            $slider.off('scroll.hslider');
            $slider.scrollLeft(0);
        }

        // ── LIGHTBOX ──────────────────────────────────────────────

        function initLightbox() {
            if (typeof $.fn.colorbox === 'undefined') return;
            $('a[rel="lightbox-gallery"]').colorbox({
                rel:         'lightbox-gallery',
                maxWidth:    '95%',
                maxHeight:   '95%',
                photo:       true,
                scalePhotos: true,
                current:     '{current} / {total}'
            });
        }

    });
})(jQuery);