let title = document.querySelector(".title");
let subtitle = document.querySelector(".subtitle");

const time_line = new TimelineMax();

time_line
  .fromTo(title, 2, { opacity: 0 }, { opacity: 1, ease: Power2.easeInout })
  .fromTo(
    subtitle,
    2,
    { opacity: 0 },
    { opacity: 1, ease: Power2.easeInout },
    "-=1.5"
  );

window.addEventListener("keydown", (e) => {
  if ((e.key = " " && e.target == document.body)) {
    e.preventDefault();
    window.location.href = document.getElementById("myGame").href;
  }
});
