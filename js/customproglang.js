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
		emit('s = [];'); //initialize the stack
		
		while (look !== '.' && !halt) {
			assignment();
			newLine();
		}
	});
}

function getChar() { if (halt) return;	
	look = program.charAt(idx);
	idx += 1;
}

function match(c) { if (halt) return;
	if (c === look) getChar();
	else expected('"'+c+'"');
}

function newLine() {
	if (look === '\n') {
		getChar();
		console.log('yeah: '+look);
	}
}

function getName() { if (halt) return;	
	if (!isAlpha(look)) {
		expected('Name');
		return;
	}

	var ret = look.toUpperCase();
	getChar();
	return ret;
}

function getNum() { if (halt) return;	
	if (!isDigit(look)) {
		expected('Integer');
		return;
	}

	var ret = look;
	getChar();
	return ret;
}

function ident() { if (halt) return;
	var name = getName();
	if (look === '(') {
		match('(');
		match(')');
		emit('BSR '+name);
	} else {
		emit('D0 = '+getName()+';');
	}
}

function factor() { if (halt) return;
	if (look === '(') {
		match('(');
		expression();
		match(')');
	} else if (isAlpha(look)) {
		ident();
	} else emit('D0 = '+getNum()+';');
}

function term() { if (halt) return;
	factor();
	while (isMulop(look) && !halt) {
		emit('s.push(D0);');
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
	emit('D0 += s.pop();');
}

function subtract() { if (halt) return;
	match('-');
	term();
	emit('D0 = s.pop() - D0;');
}

function multiply() { if (halt) return;
	match('*');
	factor();
	emit('D0 *= s.pop();');
}

function divide() { if (halt) return;
	match('/');
	factor();
	emit('D0 = s.pop()/D0;');
}

function expression() { if (halt) return;
	if (isAddop(look)) {
		emit('D0 = 0;');
	} else {
		term();
	}
	
	while (isAddop(look) && !halt) {
		emit('s.push(D0);');
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

function assignment() {
	var name = getName();
	match('=');
	expression();
	emit(name+' = D0;');
}

/********************
 * helper functions */
function $s(id) {
	return document.getElementById(id);
}

function currentTimeMillis() {
	return new Date().getTime();
}

function write(s, type) {
	var li = document.createElement('li');
	li.innerHTML = s;
	li.className = type || '';
	$s('result').appendChild(li);
}

function emit(s) {
	write(s, halt ? 'mistake' : 'code');
}

function error(s) {
	write('Error: '+s+'.', 'error');
}

function abort(s) {
	error(s);
	halt = true;
}

function expected(s) {
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
