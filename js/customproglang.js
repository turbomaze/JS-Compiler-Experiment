/********************\
| Custom Programming |
|       Language     |
| @author Anthony    |
| @version 0.1       |
| @date 2014/04/30   |
| @edit 2014/04/30   |
\********************/

/**********
 * config */

/*************
 * constants */

/*********************
 * working variables */

/******************
 * work functions */
function initCustomProgLang() {
	
}

/********************
 * helper functions */
function $s(sel) {
	if (sel.charAt(0) === '#') return document.getElementById(sel.substring(1));
	else return false;
}

function currentTimeMillis() {
	return new Date().getTime();
}

function getRandNum(lower, upper) { //returns number in [lower, upper)
	return Math.floor((Math.random()*(upper-lower))+lower);
}

/***********
 * objects */

window.addEventListener('load', function() {
	initCustomProgLang();
});