<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="x-ua-compatible" content="ie=edge">

    <link rel="stylesheet" href="/css/bootstrap.min.css">

    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootswatch/3.3.5/superhero/bootstrap.min.css">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">

    <title><!--TITLE--></title>
</head>
<body>
<div role="navigation" class="navbar navbar-default navbar-static-top"><div class="container-fluid"><div class="navbar-header"><a href="javascript:void(0)" class="navbar-brand"><i class="fa fa-rocket"></i> Isomorphic Example</a></div>
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav pull-right">
                <li>
                    <a href="javascript:void(0)"><b><i class="fa fa-cubes"></i> Mens: </b>v0.1.0</a>
                    </il>
            </ul>

        </div>
    </div>
</div>

<img id="bang1" src="/img/boom.png" style="display:none;opacity:0;position:absolute;z-index:2000; top:5px; left:5%"/>
<img id="bang2" src="/img/pow.png" style="display:none;opacity:0;position:absolute;z-index:2000; top:15%; right:10%;width:55%"/>
<img id="bang3" src="/img/bam.svg" style="display:none;opacity:0;position:absolute;z-index:2000; bottom:8%; left:15%;width:39%"/>

<div id="ghost" style="position:absolute;left:5%; top: 90%;height:60px;width:60px;z-index:3000">
    <img style="width:100%; height:100%" src="/img/ghost.svg"/>
</div>


<div id="hero" style="position:absolute;left:5%; top: 10%;z-index:3000">
</div>


<div class="container">
    <div class="row">
        <div class="col-sm-12">

<div id="mens-content">
    <!--MENS-->
</div>

            </div>
        </div>
    </div>

<script>

	window.sessionData = <!--SESSION-->;

    var
        po, s=document.getElementsByTagName('script')[0],
        a = ['/m.js', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/TweenMax.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/soundmanager2/2.97a.20150601/script/soundmanager2-jsmin.js'], l = a.length;

    for (var x = 0; x < l; x++) {
        po = document.createElement('script'); po.type = 'text/javascript'; po.async = true; po.src = a[x]; s.parentNode.insertBefore(po, s);
    }

    // Run when mithril loaded
    function bootstrap() {
        if (typeof m === 'undefined' || typeof io == "undefined") {
            setTimeout(bootstrap, 25);
            return;
        }
        // Do Something



        if (typeof TweenMax === 'undefined' || typeof soundManager === 'undefined') {
            setTimeout(bootstrap, 25);
            return;
        }

        console.log('All libraries loaded');

        soundManager.setup({
            url: 'https://cdnjs.cloudflare.com/ajax/libs/soundmanager2/2.97a.20150601/swf/soundmanager2.swf',
            flashVersion: 9, // optional: shiny features (default = 8)

            onready: function () {
                var s = soundManager.createSound({
                    id: 'music',
                    url: '/img/001.mp3',
                    autoPlay: true,
                    loops: -1
                });
                soundManager.createSound({
                    id: 'bang1',
                    url: '/img/punch.mp3',
                });
                soundManager.createSound({
                    id: 'bang2',
                    url: '/img/slap.mp3',
                });
                soundManager.createSound({
                    id: 'bang3',
                    url: '/img/punch2.mp3',
                });

            }
        });

        window.bang=function(id) {

            if (id <= 3 && id > 0) {
                console.log('bang' + id);
                var bang = document.getElementById('bang' + id);
                bang.style.display = "block";
                var tl = new TimelineMax({repeat:0, onComplete: function () {
                    console.log('hiding element');
                    bang.style.display = "none";

                }});
                tl.pause();
                tl.add(TweenMax.to(bang, .2, {autoAlpha: 1, Ease: Bounce.easeOut, repeat: 0}));
                tl.add(TweenMax.to(bang, 1.5, {autoAlpha: 0, Ease: Power2.easeOut, repeat: 0}));
                soundManager.play('bang' + id);
                tl.play();
            }
        }

        var main = 120,
        mainDiff= 360 - main,
        d = { mouth: mainDiff},
        hero = document.getElementById('hero'),
        ghost = document.getElementById('ghost');

        var updateHero = function (tween) {

            var diff = tween.target.mouth - mainDiff;
            var startAngle = (360-tween.target.mouth)/2;
            var endAngle = 360-(360-tween.target.mouth)/2;

            var x1 = 30 + 30*Math.cos(Math.PI*startAngle/180);
            var y1 = 30 + 30*Math.sin(Math.PI*startAngle/180);
            var x2 = 30 + 30*Math.cos(Math.PI*endAngle/180);
            var y2 = 30 + 30*Math.sin(Math.PI*endAngle/180);

            var path = "M30,30  L" + x1 + "," + y1 + "  A30,30 0 1,1 " + x2 + "," + y2 + " z";
            hero.innerHTML = '<svg width="60" height="60" >' +
                    '<path d="'+path+'" ' +
                    'fill="yellow" stroke="black" stroke-width="0" stroke-linejoin="round" />' +
                    '</svg>'
        }

        var t1 = TweenMax.to(d,.5, {mouth: 359, yoyo: true, Ease: Power2.easeOut, repeat: -1, onUpdate: updateHero, onUpdateParams:["{self}"]});

        var tl = new TimelineMax({repeat:-1});
        var tl2 = new TimelineMax({repeat:-1});
        tl.pause();
        tl2.pause();
        tl.add(TweenMax.to(hero,3, {left: '95%', ease:Linear.easeNone, repeat: 0}));
        tl.add(TweenMax.to(hero,.01, {rotation: '+=90', ease:Linear.easeNone, repeat: 0}));
        tl.add(TweenMax.to(hero,1.5, {top: '90%', ease:Linear.easeNone, repeat: 0}));
        tl.add(TweenMax.to(hero,.01, {rotation: '+=90', ease:Linear.easeNone, repeat: 0}));
        tl.add(TweenMax.to(hero,3, {left: '5%', ease:Linear.easeNone, repeat: 0}));
        tl.add(TweenMax.to(hero,.01, {rotation: '+=90', ease:Linear.easeNone, repeat: 0}));
        tl.add(TweenMax.to(hero,1.5, {top: '10%', ease:Linear.easeNone, repeat: 0}));
        tl.add(TweenMax.to(hero,.01, {rotation: '+=90', ease:Linear.easeNone, repeat: 0}));

        tl2.add(TweenMax.to(ghost,1.5, {top: '10%', ease:Linear.easeNone, repeat: 0}));
        tl2.add(TweenMax.to(ghost,3, {left: '95%', ease:Linear.easeNone, repeat: 0}));
        tl2.add(TweenMax.to(ghost,1.5, {top: '90%', ease:Linear.easeNone, repeat: 0}));
        tl2.add(TweenMax.to(ghost,3, {left: '5%', ease:Linear.easeNone, repeat: 0}));


        tl.play();
        tl2.play();

    }

    bootstrap();

</script>
</body>
</html>