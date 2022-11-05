/** @jsx h */

import blog, { ga, redirects, h } from 'blog';

blog({
  title: 'Hi, I\'m Adam!',
  description:
    'I attempt to write monthly posts about JavaScript stuff.',
  // header: <header>Your custom header</header>,
  // section: <section>Your custom section</section>,
  // footer: <footer>Your custom footer</footer>,
  avatar:
    'https://raw.githubusercontent.com/Adamduehansen/adh-blog/main/pb.PNG',
  avatarClass: 'rounded-full',
  author: 'Adam Due Hansen',
  links: [
    { title: "Email", url: "mailto:adamduehan@gmail.com" },
    { title: "GitHub", url: "https://github.com/adamduehansen" }, 
  ]
  
  // middlewares: [

  // If you want to set up Google Analytics, paste your GA key here.
  // ga("UA-XXXXXXXX-X"),

  // If you want to provide some redirections, you can specify them here,
  // pathname specified in a key will redirect to pathname in the value.
  // redirects({
  //  "/hello_world.html": "/hello_world",
  // }),

  // ]
});
