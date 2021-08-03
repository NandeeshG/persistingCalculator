const INV_INP = 'Invalid Input!'
const NO_EVAL = 'Cannot Evaluate Stack!'
const precedence = ['^', '/', '*', '+', '-']
const allowedActions = [
    '+',
    '-',
    '*',
    '/',
    '^',
    '(',
    ')',
    'C',
    'c',
    'd',
    'D',
    '=',
    '.',
    'A',
    'a',
]

var init = function (data_clear = 1, ansf_clear = 1) {
    if (data_clear) DATA.innerHTML = '0'
    if (ansf_clear) ANSF.innerHTML = '0'
}
init()

var precedenceOf = function (ch) {
    for (let i = 0; i < precedence.length; ++i)
        if (precedence[i] === ch) return i
    throw INV_INP
}

var append = function (num) {
    //append number
    DATA.innerHTML += num.toString(10)

    cleanData()
}

var action = function (ch) {
    if (ch === '=') {
        let AnsUsed = performCalc()
        if (!AnsUsed) animateAns()
    } else if (ch.toLocaleUpperCase() === 'D') {
        DATA.innerHTML = DATA.innerHTML.substr(0, DATA.innerHTML.length - 1)
        if (DATA.innerHTML.length === 0) init(1, 0)
    } else if (ch.toLocaleUpperCase() === 'C') init(1, 1)
    else DATA.innerHTML += ch
    cleanData()
}

ANSF.addEventListener('animationend', (e) => {
    e.target.classList.remove('active')
})
var animateAns = function () {
    ANSF.classList.add('active')
}

document.addEventListener('keydown', function (event) {
    if (ENV === 'DEV') console.log(event.keyCode, event.key)
    if (event.key >= '0' && event.key <= '9') {
        append(event.key - '0')
    } else if (event.keyCode === 13) {
        action('=')
    } else if (event.keyCode === 8) {
        action('D')
    } else if (allowedActions.includes(event.key)) {
        action(event.key.toLocaleUpperCase())
    }
})

var cleanData = function () {
    //remove leading zeroes
    let nonZer = -1
    for (let i = 0; i < DATA.innerHTML.length; ++i) {
        if (DATA.innerHTML[i] !== '0') {
            nonZer = i
            break
        }
    }
    if (nonZer === -1) {
        DATA.innerHTML = '0'
    } else {
        DATA.innerHTML = DATA.innerHTML.substr(nonZer)
    }

    //except for the case when now first char is not numeric
    if (
        DATA.innerHTML.length > 0 &&
        (DATA.innerHTML[0] < '0' || DATA.innerHTML[0] > '9') &&
        DATA.innerHTML[0] !== '(' &&
        DATA.innerHTML[0] !== 'A'
    )
        DATA.innerHTML = '0' + DATA.innerHTML
}

var ansVal = function () {
    //return parseFloat(ANSF.innerHTML);
    return parseFloat(
        ANSF.innerHTML.toLocaleString('fullwide', { useGrouping: false })
    )
}
var updateAns = function (val) {
    ANSF.innerHTML = val.toString(10)
}

var performCalc = function () {
    try {
        let AnsUsed = 0
        let dataog = DATA.innerHTML.split('')
        let data = []

        //club numbers and points, cnvt A to ans
        let runningNum = ''
        for (let i = 0; i < dataog.length; ++i) {
            if (dataog[i] === '-' && i > 0 && dataog[i - 1] === '(') {
                runningNum += '-'
            } else if (
                (dataog[i] >= '0' && dataog[i] <= '9') ||
                dataog[i] === '.'
            ) {
                runningNum += dataog[i]
            } else {
                if (runningNum.length > 0) {
                    var countDecimal = 0
                    for (const ch of runningNum) countDecimal += ch === '.'
                    if (countDecimal <= 1) data.push(parseFloat(runningNum))
                    else throw INV_INP
                }
                runningNum = ''
                if (dataog[i] == 'A') {
                    data.push(ansVal())
                    AnsUsed = 1
                } else data.push(dataog[i])
            }
        }
        if (runningNum.length > 0) data.push(parseFloat(runningNum))
        if (ENV === 'DEV') console.log('Clubbing done to get ', data)

        //stack thing
        let numStack = []
        let actionStack = []
        for (let i = 0; i < data.length; ++i) {
            if (isNaN(data[i])) {
                if (data[i] == ')') {
                    while (
                        actionStack.length > 0 &&
                        actionStack[actionStack.length - 1] != '('
                    ) {
                        let op2 = numStack.pop()
                        if (op2 === undefined) throw NO_EVAL
                        let op1 = numStack.pop()
                        if (op1 === undefined) throw NO_EVAL
                        let oper = actionStack.pop()
                        if (ENV === 'DEV')
                            console.log('EVALUATING(resolver) ', op1, oper, op2)
                        switch (oper) {
                            case '+':
                                numStack.push(op1 + op2)
                                break
                            case '-':
                                numStack.push(op1 - op2)
                                break
                            case '*':
                                numStack.push(op1 * op2)
                                break
                            case '/':
                                numStack.push(op1 / op2)
                                break
                            case '^':
                                numStack.push(op1 ** op2)
                                break
                        }
                    }
                    if (actionStack.length == 0)
                        throw 'Unable to resolve parenthesis'
                    else actionStack.pop()
                } else if (data[i] == '(') {
                    actionStack.push(data[i])
                    if (ENV === 'DEV')
                        console.log(
                            'Pushed new action: ',
                            data[i],
                            ' actionStack: ',
                            actionStack
                        )
                } else {
                    let recentOpeningPar = -1
                    for (let i = actionStack.length - 1; i >= 0; --i) {
                        if (actionStack[i] == '(') {
                            recentOpeningPar = i
                            break
                        }
                    }
                    while (
                        actionStack.length - recentOpeningPar - 1 > 0 &&
                        precedenceOf(actionStack[actionStack.length - 1]) <
                            precedenceOf(data[i])
                    ) {
                        let op2 = numStack.pop()
                        if (op2 === undefined) throw NO_EVAL
                        let op1 = numStack.pop()
                        if (op1 === undefined) throw NO_EVAL
                        let oper = actionStack.pop()
                        if (ENV === 'DEV')
                            console.log('EVALUATING ', op1, oper, op2)
                        switch (oper) {
                            case '+':
                                numStack.push(op1 + op2)
                                break
                            case '-':
                                numStack.push(op1 - op2)
                                break
                            case '*':
                                numStack.push(op1 * op2)
                                break
                            case '/':
                                numStack.push(op1 / op2)
                                break
                            case '^':
                                numStack.push(op1 ** op2)
                                break
                        }
                    }
                    actionStack.push(data[i])
                    if (ENV === 'DEV')
                        console.log(
                            'Pushed new action: ',
                            data[i],
                            ' actionStack: ',
                            actionStack
                        )
                }
            } else {
                numStack.push(data[i])
            }

            if (ENV === 'DEV')
                console.log(
                    'End of ',
                    i,
                    '\n numStack ',
                    numStack,
                    '\n actionStack ',
                    actionStack
                )
        }

        while (actionStack.length > 0) {
            let op2 = numStack.pop()
            if (op2 === undefined) throw NO_EVAL
            let op1 = numStack.pop()
            if (op1 === undefined) throw NO_EVAL
            let oper = actionStack.pop()
            if (ENV === 'DEV') console.log('FINALISING ', op1, oper, op2)
            switch (oper) {
                case '+':
                    numStack.push(op1 + op2)
                    break
                case '-':
                    numStack.push(op1 - op2)
                    break
                case '*':
                    numStack.push(op1 * op2)
                    break
                case '/':
                    numStack.push(op1 / op2)
                    break
                case '^':
                    numStack.push(op1 ** op2)
                    break
            }
        }

        if (ENV === 'DEV')
            console.log(
                'Final run ',
                '\n numStack ',
                numStack,
                '\n actionStack ',
                actionStack
            )

        if (numStack.length !== 1 || actionStack.length > 0)
            throw 'Operations incomplete'
        else updateAns(numStack.pop())

        return AnsUsed
    } catch (err) {
        alert(err)
        init(1, 0)
    } finally {
        init(0, 0)
    }
}
