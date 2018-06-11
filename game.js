var game = document.getElementById('game');
var roads = 1;
var money = 0;
var supply = 10;
var prices = 10;
var roadInvestment = 0;
var totalRoads = 1;
function start(){
    game.innerHTML = `
        <div id="info">
            <h2>You have been selected as the urban planner for cityville<h2>
            <p>
                Your city specializes in the production of apples and your 
                goal is to bring their supply up and price down to be competitive 
                in the global market.
            </p>
        </div>
        <button onclick="work()">Begin work</button>
        `
}
function work(){
    game.innerHTML = `
        <div class="inline">
            <p id="gdp">GDP: 
                <span style="color:green">
                    $${getMoney()}
                </span>
            </p>
            <p id="taxes">Tax revenue: 
                <span style="color:green">
                    $${getMoney()/10}
                </span>
            </p>
            <p id="supply">Apples per year: 
                <span style="color:gray">
                    ${supply}
                </span>
            </p>    
            <p id="prices">Export costs: 
                <span style="color:gray">
                    $${prices}
                </span>
            </p>  
        </div>
        <div id="actions">
            <button onclick="opendiv('build')">Build infrastructure</button>
            <div id="build" style="display:none">
                <p>
                    <button onclick="openPay(300, roadInvestment)" class="normal small">Road</button>
                </p>
            </div>
        </div>
        <button onclick="multiExec({open:opendiv('map'), draw:drawMap()})" class="normal">View map</button>
	    <canvas height="300" width="1000"id="map" style="display:none">
	    	
	    </canvas>    
        <div class="message" id="cantPay" style="display:none">
            Hi! I am the CEO of Apple Pies, Incorporated. 
            You have an untapped apple supply, but it's too expensive to move them around on one road. 
            Why don't we partner to build some roads? I will help with finances.<br><button class="normal small" style="border-color:transparent" onclick="multiExec({increase:increaseInvestment(1000), openthis:opendiv('cantPay')})">Accept</button>
        </div> 
        <div class="alert-wrapper" id="alert" style="display:none;">
            <div class="alert" id="alert-content">

            </div>
        </div>       
        `
}
function opendiv(i){
    var d = document.getElementById(i);
    if((i == 'cantPay' && roads <= 1) || i != 'cantPay'){
        if(d.style.display == 'none'){
            d.style.display = 'block';
        }else{
            d.style.display = 'none'
        }
    }
}
function increaseInvestment(num, investment){
    roadInvestment += num
}
async function drawMap(){
    var canvas = document.getElementById('map');
    var map = canvas.getContext('2d');
    for(let i = 0; i < roads; i++){
        let x1;
        let y1;
        let x2;
        let y2;
        if(i % 2 === 0){
            x1 = 0;
            x2 = 1000;
            y1 = await setBounds(300, 0, 1000);
            y2 = await setBounds(290, 10, 1000);
        }else{
            y1 = 0;
            y2 = 300;
            x1 = await setBounds(1000, 0, 1000);
            x2 = await setBounds(990, 10, 1000);
        }
        map.moveTo(x1, y1);
        map.lineTo(x2,y2);
        map.stroke()
    }
    roads = 0;
}
function multiExec(obj){
    for(let key in obj){
        obj[key]()
    }
}
function setBounds(max, min, factor){
    var n = 0;
    while(n < min || n > max || n === 0){
        n = factor * Math.random()
    }
    return n
}
function getMoney(){
    money = (supply*5)/(0.5*prices);
    if(!money){
        money = 0;
    }
    return money
}
function makeAlert(content){
    var alertContent = document.getElementById('alert-content');
    alertContent.innerHTML = content;
    opendiv('alert')
}
function openPay(price, investment){
    var money = getMoney();
    var content;
    if(money + investment < price){
        content = `<h1>Road</h1>
        Sorry, you only have $${Math.round(money/10 + investment)}; you need $${Math.round(price - money/10 - investment)}<br>
        <button onclick="multiExec({delete:opendiv('alert'),emit:opendiv('cantPay')})">Cancel</button>`;
        roadInvestment -= price  
    }else{
        content = `<h2>Road</h2>
        <p class="inline">Supply <span style="color:green">+${Math.round(25/totalRoads)}</span></p>
        <p class="inline">Prices <span style="color:red">-$${Math.round(prices * 10)/100}</span></p>
        <button onclick="multiExec({increase:buildroad(1), delete:opendiv('alert')})">Buy now!</button>`
    }
    makeAlert(content)
}
function deletediv(id){
    document.getElementById(id).outerHTML = null;
}
function buildroad(num){
    supply += 25/totalRoads;
    prices = prices * 0.9;
    document.getElementById('gdp').innerHTML = `GDP: <span style="color:green">$${Math.round(getMoney())}</span>`;
    document.getElementById('taxes').innerHTML = `Tax revenue: <span style="color:green">$${Math.round(getMoney()/10)}</span>`;
    document.getElementById('prices').innerHTML = `Apples per year: <span style="color:grey">${Math.round(supply)}</span>`;
    document.getElementById('supply').innerHTML = `Export costs: <span style="color:grey">$${Math.round(prices * 100)/100}</span>`;
    roads += num;
    totalRoads += num;
    if(totalRoads > 5){
        makeAlert('<h2>Get out!</h2><br>Your term is over!<br><button onclick="reloadPage()">Ok</button>')
    }
}
function reloadPage(){
    location.reload()
}