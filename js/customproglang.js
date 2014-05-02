/********************\
| Custom Programming |
|       Language     |
| @author Anthony    |
| @version 0.1       |
| @date 2014/04/30   |
| @edit 2014/05/01   |
\********************/

/**********
 * config */
var MAX_IDEN_LEN = 1;
var MAX_NUM_LEN = 1; //compiles to javascript so this is doable

/*************
 * constants */

/*********************
 * working variables */
var program;
var idx;
var look;
var halt;

/******************
 * work functions */
function initCustomProgLang() {
	program = '';
	idx = 0;
	look = '';
	halt = true;
	
	$s('compile-btn').addEventListener('click', function() {
		$s('result').innerHTML = ''; //clear the old log
		
		program = $s('source').value;
		idx = 0;
		halt = false; //good to start
		
		getChar(); //start
		doProgram();
	});
}

function getChar() { if (halt) return;	
	look = program.charAt(idx);
	idx += 1;
}

function skipWhite() {
	while (isWhite(look) && !halt) {
		getChar();
	}
}

function match(c) { if (halt) return;
	if (c !== look) {
		expected('"'+c+'"');
	} else {
		getChar();
		skipWhite();
	}
}

function newLine() {
	if (look === '\n') {
		getChar();
	}
}

function getName() { if (halt) return;	
	if (!isAlpha(look)) {
		expected('Name');
		return;
	}
	
	var ret = '';
	while (isAlNum(look) && ret.length < MAX_IDEN_LEN && !halt) {
		ret += look.toUpperCase();
		getChar();
	}
	skipWhite();
	return ret;
}

function getNum() { if (halt) return;
	if (!isDigit(look)) {
		expected('Integer');
		return;
	}
	
	var ret = '';
	while (isDigit(look) && ret.length < MAX_NUM_LEN && !halt) {
		ret += look;
		getChar();
	}
	skipWhite();
	return ret;
}

function ident() { if (halt) return;
	var name = getName();
	if (look === '(') {
		match('(');
		match(')');
		emitln('BSR '+name);
	} else {
		emitln('D0 = '+getName()+';');
	}
}

function factor() { if (halt) return;
	if (look === '(') {
		match('(');
		expression();
		match(')');
	} else if (isAlpha(look)) {
		ident();
	} else emitln('D0 = '+getNum()+';');
}

function term() { if (halt) return;
	factor();
	while (isMulop(look) && !halt) {
		emitln('s.push(D0);');
		switch(look) {
			case '*': 
				multiply(); 
				break;
			case '/': 
				divide(); 
				break;
			default:
				expected('Mulop');
				break;
		}
	}
}

function add() { if (halt) return;
	match('+');
	term();
	emitln('D0 += s.pop();');
}

function subtract() { if (halt) return;
	match('-');
	term();
	emitln('D0 = s.pop() - D0;');
}

function multiply() { if (halt) return;
	match('*');
	factor();
	emitln('D0 *= s.pop();');
}

function divide() { if (halt) return;
	match('/');
	factor();
	emitln('D0 = s.pop()/D0;');
}

function expression() { if (halt) return;
	if (isAddop(look)) {
		emitln('D0 = 0;');
	} else {
		term();
	}
	
	while (isAddop(look) && !halt) {
		emitln('s.push(D0);');
		switch(look) {
			case '+': 
				add(); 
				break;
			case '-': 
				subtract(); 
				break;
			default:
				exprected('Addop');
				break;
		}
	}
}

function assignment() { if (halt) return;
	var name = getName();
	match('=');
	expression();
	emitln(name+' = D0;');
}

function other() { if (halt) return;
	emitln(getName());
}

function doProgram() { if (halt) return;
	emitln('s = [];'); //initialize the stack
	block();
	if (look !== 'e') {
	console.log(idx);
		expected('End');
	} else {
		emitln('//end of program');
	}
}

function block() { if (halt) return;
	while (['e','l'].indexOf(look) == -1 && !halt) {
		switch (look) {
			case 'i':
				doIf();
				break;
			case 'w':
				doWhile();
				break;
			default:
				other();
				break;
		}
	}
}

function doIf() { if (halt) return;
	match('i');
	emitln('if (');
	condition();
	emit(') {');
	block();
	if (look === 'l') {
		match('l');
		emitln('} else {');
		block();
	}
	emitln('}');
	match('e');
}

function doWhile() { if (halt) return;
	match('w');
	emitln('while (');
	condition();
	emit(') {');
	block();
	emitln('}');
	match('e'); //end while
}

function condition() { if (halt) return;
	emit('/*handle condition*/');
}

/********************
 * helper functions */
function $s(id) {
	return document.getElementById(id);
}

function currentTimeMillis() {
	return new Date().getTime();
}

function write(s, type, line) {
	type = type || '';
	var span = document.createElement('span');
	span.innerHTML = s;
	span.className = type;
	if (type.length > 0) {
		$s('result').appendChild(span);
	} else $s('result').innerHTML = $s('result').innerHTML+s;
}

function writeln(s, type) {
	write('<br>');
	write(s, type);
}

function emit(s) {
	write(s, halt ? 'mistake' : 'code');
}

function emitln(s) {
	writeln(s, halt ? 'mistake' : 'code');
}

function error(s) { if (halt) return;
	writeln('Error: '+s+'.', 'error');
}

function abort(s) { if (halt) return;
	error(s);
	halt = true;
}

function expected(s) { if (halt) return;
	abort(s+' expected');
}

function isAlpha(c) {
	return /[a-z]/i.test(c);
}

function isDigit(d) {
	return /[0-9]/i.test(d);
}

function isAlNum(c) {
	return /[a-z0-9]/i.test(c);
}

function isWhite(c) {
	return /[\t ]/.test(c);
}

function isAddop(o) {
	return ['+', '-'].indexOf(o) >= 0;
}

function isMulop(o) {
	return ['*', '/'].indexOf(o) >= 0;
}

/***********
 * objects */

window.addEventListener('load', function() {
	initCustomProgLang();
});
