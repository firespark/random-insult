const generateInsultButton = document.getElementById('generate-insult');
const logo = document.querySelector('.logo');
const insultArea = document.querySelector('.insult-area');
const menuLinks = document.querySelectorAll('.nav-link');

const warningButton = document.getElementById('warning-button');

const adult = localStorage.getItem('adult');

let lang = 'en';

let urlInsult = createUrlInsult(lang);
const urlFace = 'https://base.gagara-web.ru/proxy.php?csurl=' + encodeURIComponent('https://thispersondoesnotexist.com');
const urlName = 'https://randomuser.me/api/';


function createUrlInsult(lang) {
    return 'https://base.gagara-web.ru/corsproxy.php?url=' + encodeURIComponent('https://evilinsult.com/generate_insult.php?type=plain&type=json&lang=' + lang);
}

async function getName() {
    const res = await fetch(urlName);
    const data = await res.json();
    return data.results[0].name;
}
async function getQuote() {
    const res = await fetch(urlInsult);
    const data = await res.json();
    const regex = /(?<![а-яё])(?:(?:(?:у|[нз]а|(?:хитро|не)?вз?[ыьъ]|с[ьъ]|(?:и|ра)[зс]ъ?|(?:о[тб]|п[оа]д)[ьъ]?|(?:\S(?=[а-яё]))+?[оаеи-])-?)?(?:[её](?:б(?!о[рй]|рач)|п[уа](?:ц|тс))|и[пб][ае][тцд][ьъ]).*?|(?:(?:н[иеа]|(?:ра|и)[зс]|[зд]?[ао](?:т|дн[оа])?|с(?:м[еи])?|а[пб]ч|в[ъы]?|пр[еи])-?)?ху(?:[яйиеёю]|л+и(?!ган)).*?|бл(?:[эя]|еа?)(?:[дт][ьъ]?)?|\S*?(?:п(?:[иеё]зд|ид[аое]?р|ед(?:р(?!о)|[аое]р|ик)|охую)|бля(?:[дбц]|тс)|[ое]ху[яйиеё]|хуйн).*?|(?:о[тб]?|про|на|вы)?м(?:анд(?:[ауеыи](?:л(?:и[сзщ])?[ауеиы])?|ой|[ао]в.*?|юк(?:ов|[ауи])?|е[нт]ь|ища)|уд(?:[яаиое].+?|е?н(?:[ьюия]|ей))|[ао]л[ао]ф[ьъ](?:[яиюе]|[еёо]й))|елд[ауые].*?|ля[тд]ь|(?:[нз]а|по)х)(?![а-яё])/ig;
    return data.contents.insult.replace(regex,'😡😡');
    
}
async function getFace() {
    const res = await fetch(urlFace);
    const blob = await res.blob()
    const objectURL = URL.createObjectURL(blob);
    return objectURL;
}

async function getData() {
    await createSpinner();

    const fullName = await getName();
    const quote = await getQuote();
    const face = await getFace();

    await createInsultHTML(fullName, quote, face);

}

async function createSpinner() {
    if (!generateInsultButton.classList.contains('hidden')) {
        generateInsultButton.classList.add('hidden');
    }
    
    insultArea.innerHTML = '<img class="spinner-img" src="img/spinner.gif" alt="">';
}

async function createInsultHTML(fullName, quote, face) {
    playAudio();
    generateInsultButton.classList.remove('hidden');
    insultArea.innerHTML = `<div class="insult-img-block">
                    <img class="insult-img" src="${face}" alt="">
                </div>
                <div class="insult-text">${quote}</div>
                <div class="insult-name">— ${fullName.first} ${fullName.last}</div>`;
}

function playAudio() {
    const audio = new Audio();
    const audioID = Math.floor(Math.random() * 3) + 1;
    audio.src = `./audio/${audioID}.mp3`;
    audio.currentTime = 0;
    audio.play();
}

getData();

generateInsultButton.onclick = function () {
    getData();
};

logo.onclick = function () {
    getData();
};

function clearClassActive() {
    menuLinks.forEach(link => {
        link.classList.remove('active');        
    });
}


menuLinks.forEach(link => {
    
    link.addEventListener('click', function() {
        clearClassActive();
        lang = this.dataset.lang;
        urlInsult = createUrlInsult(lang);
        this.classList.add('active');
        getData();

    });
    
});

if (adult == 'false' || adult == null) {
    document.querySelector('.warning-overlay').classList.remove('hidden');
    document.body.classList.add('ohidden');
}

warningButton.onclick = function () {
    localStorage.setItem('adult', true);
    document.querySelector('.warning-overlay').classList.add('hidden');
    document.body.classList.remove('ohidden');
};


document.getElementById('year').textContent = new Date().getFullYear();