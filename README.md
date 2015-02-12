jQuery SimpleSlider
===

Current Version: 0.0.1

그냥 있으면 좋을 것 같아서 만듭니다.

## How to install

### from bower

```bash
$ bower install jquery.simpleslider
```

### from source

그냥 다운받은 후, script로 집어넣습니다.

```html
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="jquery.simpleslider.js"></script>
```

### amd

또는 amd를 지원합니다. requirejs와 함께 사용할 수 있습니다.

```javascript
requirejs.config({
    paths: {
        jquery: 'yourpath',
        'jquery.simpleslider': 'yourpath',
    },
    shim: {
        'jquery.simpleslider': {
            deps: ['jquery']
        }
    }
});
requirejs(['jquery', 'jquery.simpleslider'], function($) {
    /* Your Source.. */
});
```


## How to use

HTML이 다음과 같다면,

```html
<div class="slides" id="simpleSlider">
    <div class="slide slide-0"><img src="slide-image1.png" alt="" /></div>
    <div class="slide slide-1"><img src="slide-image2.png" alt="" /></div>
    <div class="slide slide-2"><img src="slide-image3.png" alt="" /></div>
    <div class="slide slide-3"><img src="slide-image4.png" alt="" /></div>
</div>
```

다음과 같이 사용합니다. (jQuery가 있다는 가정하에.)

```javascript
jQuery('#simpleSlider').simpleslider();
```

## Api

### Basic

`$.fn.simpleslider(settings)`

#### Settings

- type (default:'fade')
- duration (default:450)
- easing (default:"swing")
- interval (default:5000)
- controller (default:false)

- nextButton (default:null)
- prevButton (default:null)
- nextType (default:null)
- prevType (default:null)

- animations (default:{})

- autoplay (default:true)

#### Trigger

- initialize
- enterSlider
- leaveSlider
- beforeAnimation
- afterAnimation

#### Custom Animation

`function(currentSlide, nextSlide, callback, settings)`

Example.

```javascript
$('#simpleSlider').simpleslider({
    type: 'customAnimation',
    animations: {
        customAnimation: function(currentSlide, nextSlide, callback, settings) {
            currentSlide.fadeOut({
                duration: settings.duration,
                easing: settings.easing
            });
            nextSlide.fadeIn({
                duration: settings.duration,
                easing: settings.easing,
                complete: callback
            });
        }
    }
});
```


