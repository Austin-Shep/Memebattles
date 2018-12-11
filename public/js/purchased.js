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


//// for profile survey from https://surveyjs.io/Examples/Builder/
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
         "value": "transport",
         "imageLink": "https://66.media.tumblr.com/038b85efe1c30030070609293572f5ab/tumblr_ov6n9gJvDb1tib7mso1_500.png"
        },
        {
         "value": "tradecart",
         "imageLink": "https://3.bp.blogspot.com/-_QqewU3bZ7I/UdhZCJukSxI/AAAAAAAAInU/itRgEPBYm_E/w530-h397-p/2_result.jpg"
        },
        {
         "value": "trash",
         "imageLink": "https://i.imgur.com/oURckuK.jpg"
        },
        {
         "value": "cav_boat",
         "imageLink": "https://i.imgur.com/dlWMtAh.jpg"
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
         "value": "cal_freeze",
         "imageLink": "https://www.homesnacks.net/images/2017/05/california-memes/1.jpg"
        },
        {
         "value": "cal_realEs",
         "imageLink": "http://www.memepile.com/thumbs.php?src=http://www.memepile.com/uploads/california_housing_meme_price_tent_affordable_california_memes_about_how_expensive__2305183880.jpg&w=600&q=100"
        },
        {
         "value": "cal_dry",
         "imageLink": "https://img.memecdn.com/oh-california-what-a-miss-you-have-become_o_6141697.jpg"
        },
        {
         "value": "cal_pod",
         "imageLink": "https://www.homesnacks.net/images/2017/05/california-memes/22.jpg"
        }
       ]
      }
     ]
    },
   ],
  completedHtml: "<h4>Gotcha!</h4>"
};

window.survey = new Survey.Model(json);

///uncommon this part to activate result shower
// survey
//   .onComplete
//   .add(function (result) {
//       document
//           .querySelector('#surveyResult')
//           .innerHTML = "result: " + JSON.stringify(result.data);
//   });

$("#surveyElement").Survey({model: survey});
///end of result shower


//// End of "for profile"