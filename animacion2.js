var canvas = document.getElementById("animacion");
var ctx = canvas.getContext('2d');   //pincel 

var velocidad=10;
var intervalo;

var img = new Image();
img.src = "FB1.png";


var dx = 2;
var rectTile = canvas.getBoundingClientRect();
var xPos = 0;		// Posicion del raton
var yPos = 0;
var flag =0;		// indicar si esta el menu o no
var yBird = 200;		//	Posicion del pajaro en y
var xBird = 60;		//	Posicion del pajaro en x
var score = 0;		//	Puntaje
var indice=0;
var espacioT =150;
var espacioT2 =150;
var p1=0;
var p2=0;
var distanciaT=170;
let tuberia = 
[
	//xDown, yDown, xUP, yUP
	[canvas.width,200,canvas.width,0],
	[canvas.width+distanciaT,200,canvas.width,0],
]
var escTXUP=56;
var escTXDOWN=84;
let skinB =[
[
	[3,491,17,12,34,24],
	[31,491,17,12,34,24],
	[59,491,17,12,34,24],
],
[
	[87,491,17,12,34,24],
	[115,329,17,12,34,24],
	[115,355,17,12,34,24],
],
[
	[115,381,17,12,34,24],
	[115,407,17,12,34,24],
	[115,433,17,12,34,24]
]
]
var nivel = 0;	//indicar cuando el ave cambia de color


img.onload = function (){ //carga la imagen y despues ejecuta la funcion 

	setInterval(draw,velocidad); 	//cada 50 milisegundos va a estar mostrando el draw, dibuja la porcion, espera 50 y luego mostra el sig.
	


}

canvas.addEventListener('mousedown',playBoton, false);
canvas.addEventListener('mousedown',animationBird, false);
canvas.addEventListener('mousedown', reiniciarJuego,false);

function menu(){

	ctx.drawImage(img, 351, 91, 89, 25, 50, 50, 178, 50);		// dibujar titulo
	ctx.drawImage(img, 354, 118, 52, 29, 85 , 150, 104, 58);		//dibujar boton
	ctx.drawImage(img, 310, 91, 19, 16, 120 , 230, 57, 48);//310,91 de 19*16

}
function draw(){
	
	escenario();

	if(flag == 0)
		menu();
	if(flag == 1){
		// comienza "juego"
		
		tuberia[0][0] -= dx; //para que se vaya horizontalmente
		tuberia[1][0] -= dx; //para que se vaya horizontalmente

		dificultad()
		dibujaTuberia();

		pajaro();
		colision();
		puntaje();
	}
	if(flag==2){
		gameOver()
	}


}

function dibujaTuberia(){

	//Obstaculo 1
	if(tuberia[0][0]+50 < 0){ 
		tuberia[0][0] = canvas.width;	//cords x1
		tuberia[0][1]=getRandomInt(200,400);//cord y1
		p1++;
	}
	
	tuberia[0][3]=tuberia[0][1]-320-espacioT	// yRandom-320-espacioT
	ctx.drawImage(img, escTXDOWN, 323, 26, 160, tuberia[0][0], tuberia[0][1], 52, 320);
	ctx.drawImage(img, escTXUP, 323, 26, 160, tuberia[0][0], tuberia[0][3], 52, 320);

	//Obstaculo 2
	if(tuberia[1][0]+50 < 0){ 
		tuberia[1][0] = canvas.width+distanciaT;	//cords x2
		tuberia[1][1]=getRandomInt(200,400);	//cords y2
		p2++;
		
	}
	if((tuberia[0][0] >= tuberia[1][0]) && (tuberia[0][0] <= tuberia[1][0]+52+distanciaT) ) //|| ((tuberia[1][0]+52 >= tuberia[0][0]) && (tuberia[1][0]+52 <= tuberia[0][0]+52+distanciaT)) ) 		
		tuberia[0][0] = tuberia[1][0]+52+distanciaT

	if((tuberia[0][0] - tuberia[1][0]+52 <distanciaT) && tuberia[0][0]+52<= 0 )
		tuberia[0][0] = tuberia[1][0]+52+distanciaT;

	
	tuberia[1][3] = tuberia[1][1]-320-espacioT2	// espacioT es para el espacio por donde va a pasar el ave
	ctx.drawImage(img, escTXDOWN, 323, 26, 160, tuberia[1][0], tuberia[1][1], 52, 320);
	ctx.drawImage(img, escTXUP, 323, 26, 160, tuberia[1][0], tuberia[1][3], 52, 320);
}

function playBoton(e){
	var relativeX = e.clientX - rectTile.left;
	var relativeY = e.clientY - rectTile.top;

	xPos=relativeX;
	yPos=relativeY;
	//console.log(xPos, yPos);
 
	if(xPos >= 85 && xPos <=189 && yPos >=150 && yPos <=208 && flag==0)
		flag =1
}

function pajaro(){
	// Dibujar la caida del pajaro y
	if(yBird<=486) 
			yBird += 1;
	if(score==20)
		nivel=1;
	if(score==40)
		nivel=2;
	ctx.drawImage(img, skinB[nivel][indice][0], skinB[nivel][indice][1], skinB[nivel][indice][2], skinB[nivel][indice][3], 68, yBird, skinB[nivel][indice][4], skinB[nivel][indice][5]);
	indice = (indice+1)%3;
}

function animationBird(e){
	// salto del ave
	if(flag == 1){
		if(score<40){
			yBird -=30;
			if(yBird <0)
				yBird = 0;
		}
		else{
			yBird -=50;
			if(yBird <0)
				yBird = 0;
		}
		
		
	}
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

function colision(){
	//verifica si el ave choca con el obstaculo, usar un for para no tener que hacer varias condiciones
	
	//Tuberia 1 DOWN
	if((xBird+34 >= tuberia[0][0] && xBird+34 <=tuberia[0][0]+52) && (yBird+24 >= tuberia[0][1] && yBird+24 <=tuberia[0][1]+320)  )
		flag=2;
	//Tuberia 1 UP
	if( (xBird+34 >= tuberia[0][0] && xBird+34 <=tuberia[0][0]+52) && (yBird + 24 >= tuberia[0][3] && yBird+24 <=tuberia[0][1]+320-espacioT) &&(yBird >= tuberia[0][3] && yBird <=tuberia[0][1]-espacioT)) 
		flag=2;
	//Tuberia 2 DOWN
	if( (xBird+34 >= tuberia[1][0] && xBird+34 <=tuberia[1][0]+52) && (yBird+24 >= tuberia[1][1] && yBird+24 <=tuberia[1][1]+320))
		flag=2;
	//Tuberia 2 UP
	if((xBird+34 >= tuberia[1][0] && xBird+34 <=tuberia[1][0]+52) && (yBird + 24 >= tuberia[1][3] && yBird+24 <=tuberia[1][1]+320-espacioT2) &&(yBird >= tuberia[1][3] && yBird <=tuberia[1][1]-espacioT2) )
		flag=2;
	
}


function puntaje(){
	ctx.font = '30px Verdana'; // Fuente y tamaño
	ctx.fillStyle = 'white';  // Color del texto
	ctx.fillText('Puntaje: ' + score, 15, 25); 
	if(xBird == tuberia[0][0]+52 ||xBird == tuberia[1][0]+52){
		score++;
	}
	
	if(flag==0)
		score = 0;
		
}
function gameOver(){
	ctx.font = '30px Verdana'; // Fuente y tamaño
	ctx.fillStyle = 'red';  // Color del texto
	ctx.fillText('Puntaje: ' + score, 65, 260); 
	ctx.drawImage(img, 395, 59, 96, 21, 50, 60, 192, 42);
	ctx.drawImage(img, 354, 118, 52, 29, 85 , 150, 104, 58);		//dibujar boton
	ctx.drawImage(img, 315, 122, 33, 18, 162 , 192, 66, 36);	//raton

	//dibujar medallas
	if(score>=10 && score<20)
		ctx.drawImage(img, 112, 477, 22, 22, 115 , 280, 44, 44);		
	if(score>=20 && score<40)
		ctx.drawImage(img, 112, 453, 22, 22, 115 , 280, 44, 44);
	if(score>=40)
		ctx.drawImage(img, 121, 282, 22, 22, 115 , 280, 44, 44);
}


function reiniciarJuego(e){
	var relativeX = e.clientX - rectTile.left;
	var relativeY = e.clientY - rectTile.top;

	xPos=relativeX;
	yPos=relativeY;
	console.log(xPos, yPos);
 
	if(xPos >= 85 && xPos <=189 && yPos >=150 && yPos <=208 && flag==2)
	{
		tuberia[0][0] = canvas.width;
		tuberia[1][0] = canvas.width+distanciaT;
		nivel=0;
		flag =1;
		score =0;
		yBird=200;
		tuberia[0][1]=getRandomInt(200,400);
		tuberia[1][1]=getRandomInt(200,400);
		espacioT=150
		espacioT2=espacioT
		clearInterval(intervalo);
		velocidad=10
		p1=0;
		p2=p1;
		esc2=canvas.width
		xesc2=289
		escTXDOWN=84;
		escTXUP=56;
		i=1;
	}
}

function dificultad(){
	//Para score de 20 hasta el 40
	if(p1==9 && tuberia[0][0]+52<=0)
		espacioT=100;
	if(p2==9 && tuberia[1][0]+52<=0)
		espacioT2=100;


	//Para nivel 3
	if(score>=40){
		clearInterval(intervalo); // Detener el setInterval actual

		// Crear un nuevo setInterval con la nueva velocidad
		velocidad = 9.999;
		intervalo = setInterval(draw, velocidad);
		escTXDOWN=0;
		escTXUP=28;
		if(tuberia[0][0]+52<=0)
			espacioT=150;
		if(tuberia[1][0]+52<=1)
			espacioT2=150;
		
		
	}
}

function escenario(){	
	// imprimir fondo de imagen	
	ctx.clearRect(0,0,canvas.width,canvas.height);	
	ctx.drawImage(img, 0, 0, 143, 255,0,0, canvas.width, canvas.height);

	if (score>=20 && flag==1)
			ctx.drawImage(img, 146, 0, 144, 255,0,0, canvas.width, canvas.height);
	
}
