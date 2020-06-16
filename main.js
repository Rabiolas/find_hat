const prompt = require('prompt-sync')({sigint: true});

class Field {
    constructor(field) {
        this.field = field;
        this.rows = field.length;
        this.columns = field[0].length;
        this.currentPosition = [0,0];
        this.move = '';
        this.victoryMess = ' \n!!!! CONGRATULATIONS, you win!!!!\n';
        this.inGame = true
    }

    //prompts user and checks if he types valid key
    promptUser() {
        const options = ['u','d','r','l']; 
        if ( !(options.some((option) => option === this.move)) ) {
            console.log('Chose either up, down, right, left by tipping the first letter of the respective option e.g. for up type u');
            this.move = prompt('Which way ?')
        }
    }

    //checks for valid moves i.e. in border. if not log loss message, if yes returns true
    validMove() {
        if (this.move === 'u' && this.currentPosition[0] === 0) {
            return false;
        } else if (this.move === 'l' && this.currentPosition[1] === 0) {
            return false;
        } else if (this.move === 'r' && this.currentPosition[1] === (this.columns-1)) {       
            return false;
        } else if (this.move === 'd' && this.currentPosition[0] === (this.rows-1)) {
            return false;
        } else {
            return true; 
        }
    }
    
    movePosition() {
        this.promptUser();
        if (this.move === 'd' && this.validMove()) {
            this.currentPosition[0]++;
            return true;
        } else if (this.move === 'r' && this.validMove()) {
            this.currentPosition[1]++;
            return true;
        } else if (this.move === 'l' && this.validMove()) {
            this.currentPosition[1]--;
            return true;
        } else if (this.move === 'u' && this.validMove()) {
            this.currentPosition[0]--;
            return true;
        } else {
            return false;
        }
    }

    print() {
        const arrToString = this.field.map(row => {
            return row.join('')
        }).join('\n');
        console.log(arrToString)
    }

    startInstructions() {
        const Instructions = '\nNavigate to the hat symbol "^" to win using they keys R(right), L(left), U(up) or D(down).\nAvoid falling down to hole or moving out of the playing field.\nYour position is marked by the "*".'
        console.log(Instructions)
        let answer = prompt('\nDo you want to play ? Type y or n ')
        if (answer === 'y') {
            return true
        } else if (answer === 'n') {
            console.log('Fine.')
            return false;
        } else { console.log('Type y or n')}
    }

    static generateField(height,width,percent) {
        const field = new Array(height).fill(0).map(element => new Array(width))
        for (let i=0; i < field.length; i++) {
            for (let j=0; j < field[i].length; j++) {
            field[i][j] = '░'
            }
        }
        const fieldSize = height*width;
        const numOfHoles = Math.floor(fieldSize*(percent/100));
        let countHoles = 0;
        while (countHoles <= numOfHoles) {
          const randomRow = Math.floor(Math.random()*height);
          const randomColumn = Math.floor(Math.random()*width);
          if (field[randomRow][randomColumn] === '░') {
            field[randomRow][randomColumn] = 'O';
            countHoles++;
          }
        }
        field[Math.floor(Math.random()*height)][Math.floor(Math.random()*width)] = '^';
        field[0][0] = '*';
        return field;
    }

    playGame() {
        this.print();
        if (this.startInstructions() === false) {
            this.inGame = false;
        }
        while (this.inGame === true) {
            console.log('\n\n');
            this.print();
            this.move = prompt('Which way ? ');
            if (this.movePosition()) {
                const fieldPosition = this.field[this.currentPosition[0]][this.currentPosition[1]];
                if (fieldPosition === 'O') {
                    console.log('Sorry you fell down a hole');
                    break;
                } else if (fieldPosition === '^') {
                    console.log(this.victoryMess);
                    break;
                } else {
                    this.field[this.currentPosition[0]][this.currentPosition[1]] = '*';
                    this.inGame = true;
                }
            } else {
                console.log('Out of bounds move. You lose');
                break
            }
        }
    }
  
}

const randomField = Field.generateField(10,10,30);
const newGame = new Field(randomField);
newGame.playGame();