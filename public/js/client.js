const pre = document.getElementById('preloader')
const bg = ['bg-one','bg-two','bg-three','bg-four']
window.addEventListener('load',()=>{
   document.getElementsByTagName('body')[0].classList.add(bg[Math.floor(Math.random()*(3 - 0 + 1) + 0)])
   setTimeout(() => {
     document.getElementById('pretitle').classList.add('animtext')
     setTimeout(() => {
        document.getElementById('subpre').classList.add('animtext')
        setTimeout(() => {
            pre.classList.add('vanish')
            // progress.style.strokeDashoffset = 10
            setTimeout(() => {
               // progress.style.strokeDashoffset = 100
            }, 3000);
        }, 1500);
     }, 500);
   }, 1000);
})
anime({
    targets: '.left_side_up',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 1500,
    delay: function(el, i) { return i * 250 },
    direction: 'alternate',
    loop: false
  });