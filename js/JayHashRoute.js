/*
 * JayHashRoute Library v1
 * Hash Routing made easier for faster development
 * Author -> Mar Mattheo Paypa
 * All Rights Reserved 2020
 */

export const JayHashRoute = function(container, pages, defaultPage){
  window.addEventListener('hashchange', e=> this.onRoutChange(e));
  this.container = container;
  this.defaultPage = defaultPage;
  this.pages = pages;
  this.autoLoad();
  this.relationships = {defaultPage:''};
  this.suffix = '';
  this.prefix = '';
};

JayHashRoute.prototype.checkRouter = function(hash){
  if(hash.split('')[hash.length-1] == '/'){
    hash = hash.substring(0, hash.length-1);
  }
  if(hash.indexOf('/') !== -1){
    let count = 0;
    let arrayHash = hash.split('/');
    arrayHash.forEach((arrHash, index)=>{
      if(index < arrayHash.length-1){
        for (let [parent, value] of Object.entries(this.relationships)){
          if(arrHash == parent && value.indexOf(arrayHash[arrayHash.length-1]) !== -1){
            count++;
          }
        }
      }
    });
    if(count == arrayHash.length-1){
      this.loadContent(arrayHash[arrayHash.length-1])
    } else {this.badURL()}
  } 
  else {
    let isChild = false;
    for(let [parent, child] of Object.entries(this.relationships)){
      if(child.indexOf(hash) !== -1){
        isChild = true;
      }
    }
    isChild?this.badURL():this.loadContent(hash);
  }
}

JayHashRoute.prototype.addRelationship = function(relationships){
  this.relationships = relationships;
}

JayHashRoute.prototype.addTitleSuffix = function(suffix){
  this.suffix = suffix;
}

JayHashRoute.prototype.addTitlePrefix = function(prefix){
  this.prefix = prefix;
}

JayHashRoute.prototype.onRoutChange = function(e) {
  let hash = window.location.hash.substring(1);
  this.checkRouter(hash);
};

JayHashRoute.prototype.titleWithUnderlineFix = function(title){
  let finalTitle = '';
  title.forEach((el)=>{
    finalTitle += el.charAt(0).toUpperCase() + el.substring(1) + ' ';
  });
  return finalTitle;
}

JayHashRoute.prototype.determineTitle = function(url){
  if(url.split('').indexOf('_') !== -1){
    const urlArr = url.split('_');
  document.title = `${this.prefix}${this.titleWithUnderlineFix(urlArr)}${this.suffix}`;
  } else {
    document.title = `${this.prefix}${url.charAt(0).toUpperCase() + url.substring(1)}${this.suffix}`;
  }
  
}

JayHashRoute.prototype.loadContent = function(url) {
  window.scrollTo(0,0);
  let count = 0;
  for (let [key, value] of Object.entries(this.pages)) {
    if(url == key){
      this.updateContent(value);
      this.determineTitle(url);
    } else {count++};
  }
  if(count == Object.entries(this.pages).length){
    this.badURL();
  }
};

JayHashRoute.prototype.updateContent = function(content) {

  while(this.container.firstElementChild){
    this.container.firstElementChild.remove();
  }
  this.container.innerHTML = content;
};

JayHashRoute.prototype.autoLoad = function() {
  window.addEventListener('load', ()=>{
    if(window.location.hash !== ''){
      let hash = window.location.hash.substring(1);
      this.checkRouter(hash);
    } else {
      window.location.hash = this.defaultPage;
    }
  })
};

JayHashRoute.prototype.preloadScreen = function(preloadScreen) {
  window.addEventListener('load', ()=>{
    if(window.location.hash.substring(1) != ''){
      preloadScreen.classList.add('d-none');
    } else {
      preloadScreen.classList.remove('d-none');
    }

    setTimeout(()=>{
      window.scrollTo(0,0);
    },50)
  });
}

JayHashRoute.prototype.badURL = function(){
  document.title = `${this.prefix}Page Not Found${this.suffix}`;
  this.container.innerHTML = `
  <style>
    body { background: rgb(14, 30, 37); color: white; overflow: hidden;
    margin: 0; padding: 0; }
    .title { margin: 0; font-size: 22px; line-height: 24px; color: #dc3545; margin-bottom:1rem;}
    .main { position: relative; display: flex; flex-direction: column;
align-items: center; justify-content: center; height: 80vh; width: 100vw; }
    .card { position: relative; display: flex; flex-direction: column; width:
75%; max-width: 364px; padding: 24px; background: white; color: rgb(14, 30,
37); border-radius: 8px; box-shadow: 0 2px 4px 0 rgba(14, 30, 37, .16); }
    .link { margin: 0; text-decoration: none; line-height: 24px; color: #00ad9f; }
    .link svg { position: relative; top: 2px; }
    .link:hover, .link:focus { text-decoration: underline; color: #007A70; }
    .link:hover svg path{ fill: #007A70; }
    p:last-of-type { margin: 0; }
  </style>
  <div class="main">
        <div class="card">
          <div class="header">
            <h1 class="title">Error 404: Page Not Found</h1>
          </div>
          <div class="body">
            <p>Looks like you've followed a broken link or entered a URL that doesn't exist on this site.</p>
            <p>
              <a class="link" id="back-link" href="#${this.defaultPage}">
                Back to our site
               </a>
            </p>
          </div>
        </div>
      </div>`;
}