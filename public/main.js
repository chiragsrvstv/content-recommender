
var navItems = 3;
for(var i=0; i<navItems; i++) {
  if (document.links[i].href == document.URL) {
    document.links[i].className = 'item active';

  }
}
