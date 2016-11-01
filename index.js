/*-----------------------------------------------------
  REQUIRE
-------------------------------------------------------*/
var yo       = require('yo-yo')
var csjs     = require('csjs-inject')
var minixhr  = require('minixhr')
var chart    = require('chart.js')
/*-----------------------------------------------------
  THEME
-------------------------------------------------------*/
var font       = 'Crafty Girls, cursive'
var yellow     = "#F7D002"
var black      = "#333333"
var violet     = "#F00699"
var light = "#454E9E"
var dark  = "#454E9E"
/*-----------------------------------------------------------------------------
  LOADING FONT
-----------------------------------------------------------------------------*/
var links = ['https://fonts.googleapis.com/css?family=Crafty+Girls']
var font = yo`<link href=${links[0]} rel='stylesheet' type='text/css'>`
document.head.appendChild(font)
/*-----------------------------------------------------------------------------
LOADING DATA
-----------------------------------------------------------------------------*/
var questions = [
`
Tvrdnja #1:
Svidja mi se web programiranje!
`,
`
Tvrdnja #2:
Javascript je veoma zanimljiv programski jezik!
`,
`
Tvrdnja #3:
Zainteresovan/a sam za dalji rad u javascript-u.
`,
`
Tvrdnja #4:
CodeCombat je korisna igrica za ucenje programiranja.
`,
`
Tvrdnja #5:
  Dosta su mi pomogli drugari na esova chatu :)
`,
`
Tvrdnja #6:
Zadovoljan/na sam stecenim znanjem, nastavicu da ucim javascript programiranje.
`
]
var i               = 0
var question        = questions[i]
var results         = []
var answerOptions   = [1,2,3,4,5,6]
/*-----------------------------------------------------------------------------
  QUIZ
-----------------------------------------------------------------------------*/
function quizComponent () {
  var css = csjs`
    .quiz {
      background-color: ${yellow};
      text-align: center;
      font-family: 'Kaushan Script', cursive;
      padding-bottom: 200px;
    }
    .welcome {
      font-size: 4em;
      padding: 50px;
      color: ${dark}
    }
    .question {
      font-size: 2em;
      color: ${black};
      padding: 40px;
      margin: 0 5%;
    }
    .answers {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin: 0 5%;
    }
    .answer {
      background-color: ${violet};
      padding: 15px;
      margin: 5px;
      border: 2px solid ${black};
      border-radius: 30%;
    }
    .answer:hover {
      background-color: ${light};
      cursor: pointer;
    }
    .instruction {
      color: ${violet};
      font-size: 1em;
      margin: 0 15%;
      padding: 20px;
    }
    .results {
      background-color: ${yellow};
      text-align: center;
      font-family: 'Kaushan Script', cursive;
      padding-bottom: 200px;
    }
    .resultTitle{
      font-size: 4em;
      padding: 50px;
      color: ${dark}
    }
    .back {
      display: flex;
      justify-content: center;

    }
    .backImg {
      height: 30px;
      padding: 5px;


    }
    .backText {
      color: ${black};
      font-size: 25px;
    }
    .showChart {
      font-size: 2em;
      color: ${violet};
      margin: 35px;
    }
    .showChart:hover {
      color: ${dark};
      cursor: pointer;
    }
    .myChart {
      width: 300px;
      height: 300px;
    }
  `

  function template () {
    return yo`
      <div class="${css.quiz}">
        <div class="${css.welcome}">
          Pozdrav!
        </div>
        <div class="${css.question}">
          ${question}
        </div>
        <div class="${css.answers}">
          ${answerOptions.map(x=>yo`<div class="${css.answer}" onclick=${nextQuestion(x)}>${x}</div>`)}
        </div>
        <div class="${css.instruction}">
          Na skali od 1 do 6 popunite koliko se slazete sa mojim tvrdnjama!<br>
          (1 - ne slazem se uopste, 6 - slazem se potpuno)
        </div>
           <div class="${css.back}" onclick=${back}>
           <img src="http://www.iconsdb.com/icons/preview/black/arrow-left-xxl.png" class="${css.backImg}">
           <div class="${css.backText}">Back</div>
        </div>
      </div>
    `
  }
  var element = template()
  document.body.appendChild(element)

  return element

  function nextQuestion(id) {
    return function () {
      if (i < (questions.length-1)) {
        results[i] = id
        i = i+1
        question = questions[i]
        yo.update(element, template())
      } else {
        results[i] = id
        sendData(results)
        yo.update(element, seeResults(results))
      }
    }
	}

  function seeResults(data) {
  var ctx = yo`<canvas class="${css.myChart}"></canvas>`
  return yo`
    <div class="${css.results}">
      <div class="${css.resultTitle}">
        Pogledaj rezultat:
      </div>
        <div class="${css.showChart}" onclick=${function(){createChart(ctx, data)}}>
        Klikni ovde da pogledas grafikon
      </div>
      ${ctx}
    </div>
  `
	}

  function back() {
    if (i > 0) {
      i = i-1
      question = questions[i]
      yo.update(element, template())
    }
  }

  function sendData(results) {
    var request  = {
      url          : 'https://quiz-81040.firebaseio.com/results.json',
      method       : 'POST',
      data         : JSON.stringify(results)
    }
    minixhr(request)
  }

  function createChart(ctx, myData) {
    minixhr('https://quiz-81040.firebaseio.com/results.json', responseHandler)
    function responseHandler (data, response, xhr, header) {
      var data = JSON.parse(data)
      var keys = Object.keys(data)
      var arrayOfAnswers = keys.map(x=>data[x])
      var stats = arrayOfAnswers.reduce(function(currentResult,answer,i) {
        var newResult=currentResult.map((x,count)=>(x*(i+1)+answer[count])/(i+2))
        return newResult
      }, myData)
      var data = {
        labels: [
          "Tvrdnja #1", "Tvrdnja #2", "Tvrdnja #3",
          "Tvrdnja #4", "Tvrdnja #5", "Tvrdnja #6"
        ],
        datasets: [
          {
            label: "Moji odgovori",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: myData
          },
          {
            label: "Ostali odgovori",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: stats
          }
        ]
      }
      var myChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
          scale: {
            scale: [1,2,3,4,5,6],
            ticks: {
              beginAtZero: true
            }
          }
        }
      })
    }
  }

}
quizComponent()
