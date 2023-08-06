
const searchWrapper = document.querySelector('.wrapper');
const searchLine = document.querySelector('.search__input');
const autocomlit = document.querySelector('.autocomplit');
const listOfRepo = document.querySelector('.list');


const debounce = (fn, debounceTime) => {
    let timeout;
    return function(){
        const fnCall = ()=>{
            fn.apply(this, arguments)
        }
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, debounceTime);
    };
};

searchRepos = debounce(searchRepos, 500);

searchLine.addEventListener('keyup',searchRepos);
autocomlit.addEventListener('click', async function(evt){
    let target = evt.target;
    if(target.tagName == 'LI'){
        await addToList(target.textContent);
        autocomlit.classList.remove('active');
        searchLine.value = '';
    }
})

async function searchRepos(){
    let searchValue = searchLine.value;
    let autocomplitSize = 0;
    let autocomplitArr = []
    if(searchValue){
        return await fetch(`https://api.github.com/search/repositories?q=${searchValue}`)
    .then(response => {
        if(response.ok){
            response.json().then(response => {
                response.items.forEach(repo => {
                    if(autocomplitSize < 5){
                        autocomplitArr.push(repo.name);
                        autocomplitSize++; 
                    }
                });
                autocomplitArr = autocomplitArr.map((item)=>{
                    return item = '<li>' + item + '</li>';
                })
                showAutocomplit(autocomplitArr);
            })

        }
        else{

        }
    })
    } 
    else{
        autocomlit.classList.remove('active')
    } 
} 
function showAutocomplit(list){
    autocomlit.innerHTML = list.join('');
    autocomlit.classList.add('active');
}
async function addToList(name){

    const item = document.createElement('div');
    const item_wrap = document.createElement('div');
    return await fetch(`https://api.github.com/search/repositories?q=${name}`)
    .then(response=>{
        if(response.ok){
            response.json().then(data=>{
                let ownerText = data.items[0].owner.login;
                let stars = data.items[0].stargazers_count;
                item.classList.add('list__item');
                item.setAttribute('id', name);
                item_wrap.insertAdjacentHTML('beforeend', `<p>Name: ${name} </p>`);
                item_wrap.insertAdjacentHTML('beforeend', `<p>Owner: ${ownerText} </p>`);
                item_wrap.insertAdjacentHTML('beforeend', `<p>Stars: ${stars} </p>`);
                item.append(item_wrap)
                item.insertAdjacentHTML('beforeend', `<button class="list__button">Delete</button>`);
                item.addEventListener('click', function(evt){
                    let target = evt.target;
                    if(target.tagName == 'BUTTON'){
                       item.remove(); 
                    }
                })                
                listOfRepo.append(item);

            })
        }    
    })
    

}