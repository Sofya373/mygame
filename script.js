//Если надо очистить сохранение
//localStorage.clear();
//объявление переменных для кода
let score = localStorage.getItem("score")
	? Number(localStorage.getItem("score"))
	: 0;
let countClick = 300;
let energy = localStorage.getItem("energy")
	? Number(localStorage.getItem("energy"))
	: 500;
let fullEnergy = localStorage.getItem("fullEnergy")
	? Number(localStorage.getItem("fullEnergy"))
	: 500;
let percentEnergy;

let priceLvlEnergy = localStorage.getItem("priceLvlEnergy")
	? Number(localStorage.getItem("priceLvlEnergy"))
	: 300;
let lvlEnergy = localStorage.getItem("lvlEnergy")
	? Number(localStorage.getItem("lvlEnergy"))
	: 0;
let countEnergy = localStorage.getItem("countEnergy")
	? Number(localStorage.getItem("countEnergy"))
	: 100;
let scoreInHour = localStorage.getItem("scoreInHour")
	? Number(localStorage.getItem("scoreInHour"))
	: 0;

let countRestart = 0;
let today = new Date().toDateString();
let saveDataGame = localStorage.getItem("countRestartDate");
if (today !== saveDataGame) {
	countRestart = 0;
	localStorage.setItem("countRestart", countRestart);
	localStorage.setItem("countRestartDate", today);
} else {
	countRestart = Number(localStorage.getItem("countRestart"));
}

//переменные для отображения на странице HTML
let scoreHTML = document.getElementById("score");
let energyHTML = document.getElementById("energyText");
let energyFillHTML = document.getElementById("energyFill");

let priceLvlEnergyHTML = document.getElementById("priceLvlEnergy");
let lvlEnergyHTML = document.querySelectorAll(".lvlFullEnergy");
let countEnergyHTML = document.getElementById("countEnergy");

let countRestartHTML = document.querySelectorAll(".lvlRestart");

let scoreInHourHTML = document.getElementById("scoreInHour");

//Структура данных для карточек пассивного дохода
let cardsData = {
	1: {
		img: "PngCardSmoke.png",
		title: "Аромат",
		level: 0,
		bonus: 800,
		price: 400,
		coef: 2.5,
	},
	2: {
		img: "pngCardTeacup.png",
		title: "Пиала",
		level: 0,
		bonus: 600,
		price: 1205,
		coef: 3.2,
	},
	3: {
		img: "pngCardBun.png",
		title: "Маньтоу",
		level: 0,
		bonus: 1750,
		price: 830,
		coef: 3,
	},
	4: {
		img: "pngCardSword.png",
		title: "Меч",
		level: 0,
		bonus: 5300,
		price: 3708,
		coef: 1.5,
	},
	5: {
		img: "pngCardMushrooms.png",
		title: "Угощение",
		level: 0,
		bonus: 4000,
		price: 2104,
		coef: 2.3,
	},
};

//Восстановление уровня пассивного дохода при загрузке
Object.keys(cardsData).forEach(id => {
	let savedCard = JSON.parse(localStorage.getItem(`card${id}`));
	if (savedCard) {
		cardsData[id] = savedCard;
	}
});

let cardPassive = document.querySelectorAll(".cardPassive");
cardPassive.forEach(card => {
	let id = card.getAttribute("data-id");
	let data = cardsData[id];
	if (data) {
		card.innerHTML = `<div class="imageCard" 
		style="
		padding-top:1%;
		background-image: url('${data.img}');
		 background-size: 100% 98%;">
							<p class="lvlText">
							ур. <span id="lvl${id}" class="lvlPassive">${data.level}</span>
							</p>
						</div>
						<p class="textCard" style="text-align: center;" >${data.title}</p>`;
	}
});

let dialog = document.getElementById("screenPassive");
cardPassive.forEach(card => {
	let touchstartX = 0;
	let touchEndX = 0;
	card.addEventListener("touchstart", event => {
		touchstartX = event.changedTouches[0].screenX;
	});
	card.addEventListener("touchend", event => {
		touchEndX = event.changedTouches[0].screenX;
		if (Math.abs(touchstartX - touchEndX) < 10) {
			let id = card.getAttribute("data-id");
			let data = cardsData[id];
			if (data) {
				dialog.innerHTML = `	
		   <form method="dialog">
				<button class="closeButton">X</button>
				<img class="imgDialog" src="${data.img}" />
				<h2>${data.title}</h2>
				<div class="textContainer">
					<p>ур. <span class="lvlPassive">${data.level}</span></p>
					<img src="pngcoin.png" />
					<p>+<span class="bonusPassive">${data.bonus}</span> в час</p>
				</div>
				<button class="pay payPassiveCard">
					<p>Купить за <span class="pricePassive">${data.price}</span></p>
				</button>
			</form>`;
				if (score < data.price) {
					dialog.querySelector(".payPassiveCard").style.background = "grey";
				}
				dialog.showModal();
				dialog
					.querySelector(".payPassiveCard")
					.addEventListener("touchstart", event => {
						payPassiveCard(id, data);
					});
			}
		}
	});
});

function payPassiveCard(id, data) {
	if (score >= data.price) {
		score - data.price;
		data.level++;
		scoreInHour += data.bonus;
		data.price = Math.round(data.price * data.coef);
		data.bonus = Math.round((data.bonus * data.coef) / 2);

		localStorage.setItem(`card${id}`, JSON.stringify(data));
		document.getElementById(`lvl${id}`).innerText = data.level;
		saveData();
		dataScreen();
	}
}

let obj = document.getElementById("objectPanel");
if (obj) {
	obj.addEventListener("touchstart", clicker);
}

let obj2 = document.getElementById("clickFullEnergy");
let obj2Pay = document.getElementById("payLvlEnergy");
if (obj2) {
	obj2.addEventListener("touchstart", function () {
		if (score < priceLvlEnergy) {
			document.getElementById("payLvlEnergy").style.background = "grey";
		}
		document.getElementById("screenLvlEnergy").showModal();
	});
	obj2Pay.addEventListener("touchstart", payLvlEnergy);
}

let obj3 = document.getElementById("clickRestart");
let obj3Pay = document.getElementById("payLvlRestart");

if (obj3) {
	obj3.addEventListener("touchstart", function () {
		document.getElementById("screenRestart").showModal();
	});
	obj3Pay.addEventListener("touchstart", payRestart);
}

//Функция покупки восстановления энергии
function payRestart() {
	if (countRestart < 6) {
		energy = fullEnergy;
		countRestart++;
		saveData();
		dataScreen2();
	} else {
		document.getElementById("payLvlRestart").style.background = "grey";
	}
}

//Функция покупки уровня запаса энергии
function payLvlEnergy() {
	if (score >= priceLvlEnergy) {
		score -= priceLvlEnergy;
		lvlEnergy++;
		fullEnergy += countEnergy;
		priceLvlEnergy = Math.round(priceLvlEnergy * 3.25);
		countEnergy += 50;
		saveData();
		dataScreen2();
	}
}

//Функция на сохранение данных в локальном хранилище
function saveData() {
	localStorage.setItem("score", score);
	localStorage.setItem("scoreInHour", scoreInHour);
	localStorage.setItem("energy", energy);
	localStorage.setItem("fullEnergy", fullEnergy);
	localStorage.setItem("lvlEnergy", lvlEnergy);
	localStorage.setItem("priceLvlEnergy", priceLvlEnergy);
	localStorage.setItem("countEnergy", countEnergy);
	localStorage.setItem("countRestart", countRestart);
	localStorage.setItem("countRestartDate", today);
}

//Функция на загрузку данных на HTMLстраницe
function dataScreen() {
	scoreHTML.innerText = score;
	energyHTML.innerText = energy;
	fillEnergy();
	scoreInHourHTML.innerText = scoreInHour;
}
//Функция на загрузку данных на HTMLстранице Доход
function dataScreen2() {
	dataScreen();
	lvlEnergyHTML.forEach(element => {
		element.innerText = lvlEnergy;
	});
	priceLvlEnergyHTML.innerText = priceLvlEnergy;
	countEnergyHTML.innerText = countEnergy;

	countRestartHTML.forEach(element => {
		element.innerText = countRestart;
	});
}

//Проверка страницы запуска
let path = window.location.pathname;
if (path.includes("index.html")) dataScreen();
else if (path.includes("earnings.html")) dataScreen2();

function clicker(event) {
	if (energy >= 1) {
		score += countClick;
		energy--;
		scoreHTML.innerText = score;
		energyHTML.innerText = energy;
		fillEnergy();

		let img = event.currentTarget.querySelector("#objectImg");
		img.style.transform = "scale(0.9)";
		setTimeout(() => {
			img.style.transform = "";
		}, 100);
		const plus = document.createElement("div");
		plus.className = "plus";
		plus.innerText = "+" + countClick;
		const panel = event.currentTarget;
		const rect = panel.getBoundingClientRect();
		plus.style.left = `${event.clientX - rect.left}px`;
		plus.style.top = `${event.clientY - rect.top}px`;
		panel.appendChild(plus);
		setTimeout(() => {
			plus.remove();
		}, 2200);
		saveData();
	}
}

//Функция отрисовки контейнера энергии
function fillEnergy() {
	percentEnergy = (energy * 100) / fullEnergy;
	energyFillHTML.style.width = percentEnergy + "%";
}

//Функция восстановления контейнера энергии
function regenerateEnergy() {
	if (energy < fullEnergy) {
		energy++;
		energyHTML.innerText = energy;
		fillEnergy();
		saveData();
	}
}
setInterval(regenerateEnergy, 1000);
