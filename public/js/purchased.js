$(document).ready(function() {
  console.log("test");

  //on page load, get the id so we can assign it to all the nav bars
  getId();

  function getId() {
    $.ajax("/api/user/id", {
      type: "GET"
    }).then(function(user) {
      console.log(user[0].id);

      $("#meme-points").text(user[0].points);
    });
  }
});


//// for profile survey
var json = {
  title: "what's your meme?",
  showProgressBar: "bottom",
  showTimerPanel: "top",
  maxTimeToFinishPage: 10,
  maxTimeToFinish: 25,
  firstPageIsStarted: true,
  startSurveyText: "Start Quiz",
  pages: [
    {
     "name": "page1"
    },
    {
     "name": "page2",
     "elements": [
      {
       "type": "imagepicker",
       "name": "question1",
       "choices": [
        {
         "value": "picard_provok",
         "imageLink": "https://i.imgflip.com/mon3d.jpg"
        },
        {
         "value": "picard_why",
         "imageLink": "https://i.kym-cdn.com/photos/images/original/000/606/862/a8f.jpg"
        },
        {
         "value": "picard_amazon",
         "imageLink": "https://mywoodlandgear.com/wp-content/uploads/2017/01/Piccard-Amazon-box.jpg"
        },
        {
         "value": "picard_facepalm",
         "imageLink": "https://i.imgflip.com/bbrjm.jpg"
        }
       ]
      }
     ]
    },
    {
     "name": "page3",
     "elements": [
      {
       "type": "imagepicker",
       "name": "question2",
       "choices": [
        {
         "value": "lion",
         "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
        },
        {
         "value": "giraffe",
         "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
        },
        {
         "value": "panda",
         "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
        },
        {
         "value": "camel",
         "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
        }
       ]
      }
     ]
    },
    {
     "name": "page4",
     "elements": [
      {
       "type": "imagepicker",
       "name": "question3",
       "choices": [
        {
         "value": "lion",
         "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
        },
        {
         "value": "giraffe",
         "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
        },
        {
         "value": "panda",
         "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
        },
        {
         "value": "camel",
         "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
        }
       ]
      }
     ]
    },
   ],
  completedHtml: "<h4>Gotcha!</h4>"
};

window.survey = new Survey.Model(json);

survey
  .onComplete
  .add(function (result) {
      document
          .querySelector('#surveyResult')
          .innerHTML = "result: " + JSON.stringify(result.data);
  });

$("#surveyElement").Survey({model: survey});

//// End of "for profile"