# h5Show

> Cool animation html building library, based on the power of CSS3 animation in modern browsers, it's lightweight,fast, responsive ! 	 it's for both developers and designers, you just need to write simple Html, then left all other things to the library.

It can be used to create **sliders,welcome pages,presentations** etc

Browser compatibility: Chrome,Safari,Firefox,Opera,Edge,ie11(*ie10 will be supported recently*)


##Features
- Fast and Lightweight
- Standard HTML,CSS3 based
- Flexible,responsive
- Support Url hash
- Easy to reuse,customize and extend

##HomePage
[h5show home](http://sandywalker.github.io/h5show)

##Demo
[h5show demo](http://sandywalker.github.io/h5show/demo)

##Document
[h5show docs](http://sandywalker.github.io/h5show/docs)


## Getting Started

Add stylesheet to the <head> element of your html.
```html
   <link rel="stylesheet" type="text/css" href="{path}/h5show.css">
```
Put h5show.js to appropriate place (commonly before the </body>) of your html.
```html
  <script type="text/javascript" src="{path}/h5show.min.js"></script>
```
Add a container in which you put the animation pages.
```html
<div id="showbox">

</div>
```
Set the container size,make sure position is relative or absolute,set overflow hidden.
```css
/* this is just an example */
#showBox{
  width:500px
  height:300px;
  position: absolute;
  overflow: hidden;
}
```
Add animation pages and sprite elements in it,set class:'page' to each page element.
```html
<div id="showBox">
   <div class="page">
       <h1>Hello h5Show</h1>
       <p>Amazing</p>
       <p>Flexible</p>
       <p>Powerful</p>
   </div>
   <div class="page">
     ...
   </div>
</div>
```
Now, let's add some magic , add dataset attributes to the elements which set the showtime and animation.
```html
<div id="showBox">
    <div class="page">
        <h1 data-time="0.5" data-show="expandOpen">Hello h5Show</h1>
        <p data-time="1" data-show="fadeInLeft">Amazing</p>
        <p data-time="1.25" data-show="fadeInLeft">Flexible</p>
        <p data-time="1.5" data-show="fadeInLeft">Powerful</p>
    </div>
    <div class="page">
      <h2>page2</h2>
    </div>
 </div>
```
Last Step,using Javascript to create the h5Show. It's down.
```js
  (function(){
    var show = new H5Show('showBox',{play:true});
  })();
```
To see the result , welcome to [h5show](http://sandywalker.github.io/h5show) home.
Visit  [docs](http://sandywalker.github.io/h5show/docs)  for more details, and [demo](http://sandywalker.github.io/h5show/demo) page to see some advanced usages.


## License

MIT © Sandy Duan
