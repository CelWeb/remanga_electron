const https = require('https');

var wait_data;

function search(text) {
  test = https.get('https://api.remanga.org/api/search/?query=' + text + '&count=10', (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      wait_data = JSON.parse(data).content
      add("manga" ,wait_data)
    });
  })
};

function clear_SearchData(){
  var search_result = document.getElementById("search-result");
  search_result.innerHTML = "";
}

function add(type, ins) {
  i = 0;
  var search_result = document.getElementById("search-result");
  clear_SearchData();
  if (ins.length == 0){
    search_result.innerHTML = "<h1>Error!</h1>"
    return;
  }
  while (i < ins.length) {
    var br = document.createElement("br");
    var child = document.createElement("input");
    child.type = "submit";
    if (type == "manga"){
      document.getElementById('back-button').hidden = true
      child.value = ins[i].rus_name;
      child.className = "btn btn-primary"
      child.dataset.id = ins[i].id;
      child.onerror = ""
      child.addEventListener('click', () => { get_tomes(event.target.dataset.id) });
    } else if (type == "tome") {
      document.getElementById('back-button').hidden = true
      child.value = "Глава " + ins[i].chapter + " " + ins[i].name
      child.className = "btn btn-primary"
      child.dataset.id = ins[i].id;
      if (ins[i].paid == true){
        continue
      }
      child.addEventListener('click', () => { get_chapters(event.target.dataset.id) });
    } else if (type == "chapters"){
      document.getElementById('back-button').hidden = false
      child = document.createElement("img")
      child.src = wait_data[0].link
      child.className = "btn btn-primary"
      child.className = "card-img-top"
      child.dataset.page = 0
      child.dataset.json = JSON.stringify(wait_data)
      child.addEventListener('click', () => { next_prev_page("next", wait_data) });
      search_result.appendChild(child)
      search_result.appendChild(br)
      break
    }
    search_result.appendChild(child)
    search_result.appendChild(br)
    i = i + 1;
  }
}

function next_prev_page(type, ins){
  manga_id = document.getElementById("manga-id").dataset.manga_id
  if (manga_id == undefined){
    return
  }
  img = document.getElementsByClassName("card-img-top")[0]
  if (ins == "back-button"){
    ins = JSON.parse(img.dataset.json)
  }
  try {
    page = parseInt(img.dataset.page)
  }catch(e){}
  if(type == "next"){
    try{
      img.src = ins[page + 1].link
      img.dataset.page = page + 1
    }catch(e){
      get_tomes(manga_id)
    }
  }else if (type == "prev"){
    try{
      img.src = ins[page - 1].link
      img.dataset.page = page - 1
    }catch(e){
      get_tomes(manga_id)
    }
  }
  window.location.href = '#search-result'
}

function get_tomes(ins) {
  test = https.get('https://api.remanga.org/api/titles/chapters/?branch_id=' + ins, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      wait_data = JSON.parse(data).content
      clear_SearchData();
      add("tome", wait_data.reverse())
      document.getElementById("manga-id").dataset.manga_id = ins
    });
  })
};

function get_chapters(ins){
  test = https.get('https://api.remanga.org/api/titles/chapters/' + ins + "/", (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      wait_data = JSON.parse(data).content.pages
      add("chapters", wait_data)
    });
  })
}

function search_manga(){
  text = document.getElementById('search-place').value
  search(text)
}

document.getElementById('search-button').addEventListener('click', () => {
  search_manga();
})

document.getElementById('search-place').addEventListener('change', () => {

  search_manga();
})

document.getElementById('back-button').addEventListener('click', () => {
  next_prev_page("prev", "back-button");
})

document.getElementsByClassName('navbar-brand')[0].addEventListener('click', () => {
  document.getElementById('search-result').innerHTML = "<h1>Search russian manga without ads and slow performance</h1>"
})

document.addEventListener('keydown', () => {
  if (event.code == 'ArrowLeft') {
    next_prev_page("prev", wait_data)
  }else if (event.code == 'ArrowRight'){
    next_prev_page("next", wait_data)
  }
});