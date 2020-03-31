const Alexa = require('ask-sdk-core');

const helpOutput = 'You can demonstrate entity resolution by providing varied answers to the questions asked.  Try saying lets play a game.';
const helpReprompt = 'Try saying "start over".';

const questions = [
  {
    answer: 'Katze',
    question: 'New word of german langauge is Katze' + "<break time=\"0.6s\"/>" +'katze'.split('').join("<break time=\"0.6s\"/>") +"<break time=\"0.6s\"/>" + "It means Cat as animal. Now repeat the same word or spelling",
    synonyms: ['k.a.t.z.e.', 'katze', 'k. a. t. z. e. '],
  },
  {
    answer: 'Hund',
    question: 'New word of german langauge is Hund ' + "<break time=\"0.6s\"/>" +'Hund'.split('').join("<break time=\"0.6s\"/>") +"<break time=\"0.6s\"/>" + "It means Dog as animal. Now repeat the same word or spelling",
    synonyms: ['h.u.n.d.', 'hund', 'H.U.N.D.', 'HUND', 'h. u. n. d. '],
  },
  {
    answer: 'Welpe',
    question: 'New word of german langauge is Welpe' + "<break time=\"0.6s\"/>" +'welpe'.split('').join("<break time=\"0.6s\"/>") +"<break time=\"0.6s\"/>" + "It means Puppy as animal. Now repeat the same word or spelling",
    synonyms: ['w.e.l.p.e', 'welpe', 'w. e. l. p. e.'],
  },
  {
    answer: 'Kaninchen',
    question: 'New word of german langauge is Kaninchen' + "<break time=\"0.6s\"/>" +'kaninchen'.split('').join("<break time=\"0.6s\"/>") +"<break time=\"0.6s\"/>" + "It means rabbit as animal. Now repeat the same word or spelling",
    synonyms: ['k.a.n.i.n.c.h.e.n.', 'kaninchen', 'KANINCHEN', 'k. a. n. i. n. c. h. e. n. '],
  },
];

// This is a list of positive speechcons that this skill will use when a user gets
// a correct answer.  For a full list of supported speechcons, go here:
// https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
const speechConsCorrect = ['Booya', 'All righty', 'Bam', 'Bazinga', 'Bingo', 'Boom', 'Bravo', 'Cha Ching', 'Cheers', 'Dynomite',
  'Hip hip hooray', 'Hurrah', 'Hurray', 'Huzzah', 'Oh dear.  Just kidding.  Hurray', 'Kaboom', 'Kaching', 'Oh snap', 'Phew',
  'Righto', 'Way to go', 'Well done', 'Whee', 'Woo hoo', 'Yay', 'Wowza', 'Yowsa'];

// This is a list of negative speechcons that this skill will use when a user gets
// an incorrect answer.  For a full list of supported speechcons, go here:
// https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
const speechConsWrong = ['Argh', 'Aw man', 'Blarg', 'Blast', 'Boo', 'Bummer', 'Darn', 'D\'oh', 'Dun dun dun', 'Eek', 'Honk', 'Le sigh',
  'Mamma mia', 'Oh boy', 'Oh dear', 'Oof', 'Ouch', 'Ruh roh', 'Shucks', 'Uh oh', 'Wah wah', 'Whoops a daisy', 'Yikes'];

// handlers

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest' ||
      (request.type === 'IntentRequest' && request.intent.name === 'NewGameIntent');
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    // attributes.state = states.QUIZ;
    attributes.counter = 0;
    attributes.quizScore = 0;
   
    return nextQuestion(handlerInput, 'Welcome to the Game of Languages.'+ '<audio src="https://dl3.pushbulletusercontent.com/jllHd3fTTAjNHtEQeqIj17aVLpasvRTA/new_file.mp3" />'+'In this course we will learn 2 Languages German and French. Now you can learn new languages and their words over the go. We have a large database of words, which shuffles everyday. We will ask 5 new words daily, by commanding previous words learned earlier as a revision. To stop the game, say stop. You can also track your progress on leaderboard in the link provided in description. Hope you enjoy our skill.' + "<break time=\"0.6s\"/>");
    
      
    },
};

const AnswerHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AnswerIntent';
  },
  handle(handlerInput) {
    // get the Answer
    const slotValues = getSlotValues(handlerInput.requestEnvelope.request.intent.slots);

    // check the Answer
    // where answer is my slot name
    // what synonym the person said - slotValues.answer.synonym
    // what that resolved to - slotValues.answer.resolved
    return checkAnswer(handlerInput, slotValues.answer.resolved);

    // report the results and ask a new quesiton
  },
};

const AmazonHelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    return responseBuilder
      .speak(helpOutput)
      .reprompt(helpReprompt)
      .getResponse();
  },
};

const AmazonCancelStopHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const speechOutput = 'Okay, talk to you later! We will continue from here next time. ';

    return responseBuilder
      .speak(speechOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const SessionEndedHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const request = handlerInput.requestEnvelope.request;

    console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);
    console.log(`Error handled: ${error}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can not understand the command.  Please say again.')
      .reprompt('Sorry, I can not understand the command.  Please say again.')
      .getResponse();
  },
};

// helpers

function nextQuestion(handlerInput, preface) {
  const responseBuilder = handlerInput.responseBuilder;
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();

  // get a question
  const data = getRandomQuestion(questions);
  sessionAttributes.currentQuestionIndex = data.index;
  // if(sessionAttributes.counter == 4){return 'That all for today';
  //     }
  sessionAttributes.counter +=1;
  // ask the question
  return responseBuilder
    .speak(preface + data.text.question)
    .reprompt(`Here's your question again ${data.text.question}`)
    .getResponse();
}

function checkAnswer(handlerInput, givenAnswer) {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  
  if (sessionAttributes.currentQuestionIndex) {
    const correctAnswer = questions[sessionAttributes.currentQuestionIndex].answer;
    if (correctAnswer.toUpperCase() === givenAnswer.toUpperCase()) {
      sessionAttributes.quizScore += 1;
      // correct
      
      const currScore = getCurrentScore(sessionAttributes.quizScore, sessionAttributes.counter);
      // if (currScore < 6){
      return nextQuestion(handlerInput, '<audio src="https://dl3.pushbulletusercontent.com/Y8t6ohYlySY3rYWHhtux9YKXH8fY3PN8/radi.mp3" />'+`${getSpeechCon(true)} you got it, ${givenAnswer} was right. And  ${currScore}. here's another, `);
    // }
      // else{
      //   return "Thats all for today";
      // }
    }
    // incorrect
    return nextQuestion(handlerInput, '<audio src="https://dl3.pushbulletusercontent.com/xARWRQiXgKyJvJixHRL5x0UAzD67KEiB/fail.mp3" />'+`${getSpeechCon(false)} the answer was ${correctAnswer}. let's try again, `);
  }
  const correctAnswer = questions[sessionAttributes.currentQuestionIndex].answer;
  // no current question
  // if (sessionAttributes.counter < 3)
   if (correctAnswer.toUpperCase() === givenAnswer.toUpperCase()) {
      sessionAttributes.quizScore += 1;
      return nextQuestion(handlerInput, 'Here\'s a new question ');}
  // return "Thats all for today";
}

function getSpeechCon(type) {
  if (type) {
    return `<say-as interpret-as='interjection'>${getRandomPhrase(speechConsCorrect)}! </say-as><break strength='strong'/>`;
  }
  return `<say-as interpret-as='interjection'>${getRandomPhrase(speechConsWrong)} </say-as><break strength='strong'/>`;
}

function getRandomPhrase(array) {
  // the argument is an array [] of words or phrases
  const i = Math.floor(Math.random() * array.length);
  return (array[i]);
}

function getSlotValues(filledSlots) {
  const slotValues = {};

  Object.keys(filledSlots).forEach((item) => {
    const name = filledSlots[item].name;
    slotValues[name] = {};

    // Extract the nested key 'code' from the ER resolutions in the request
    let erStatusCode;
    try {
      erStatusCode = ((((filledSlots[item] || {}).resolutions ||
        {}).resolutionsPerAuthority[0] || {}).status || {}).code;
    } catch (e) {
      // console.log('erStatusCode e:' + e)
    }

    switch (erStatusCode) {
      case 'ER_SUCCESS_MATCH':
        slotValues[name].synonym = filledSlots[item].value;
        slotValues[name].resolved = filledSlots[item].resolutions
          .resolutionsPerAuthority[0].values[0].value.name;
        slotValues[name].isValidated = filledSlots[item].value ===
          filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name;
        slotValues[name].statusCode = erStatusCode;
        break;

      default: // ER_SUCCESS_NO_MATCH, undefined
        slotValues[name].synonym = filledSlots[item].value;
        slotValues[name].resolved = filledSlots[item].value;
        slotValues[name].isValidated = false;
        slotValues[name].statusCode = erStatusCode === undefined ? 'undefined' : erStatusCode;
        break;
    }
  }, this);

  return slotValues;
}

function getRandomQuestion(array) {
  // the argument is an array [] of words or phrases
  const i = Math.floor(Math.random() * array.length);
  return ({
    text: array[i],
    index: i,
  });
}
function getCurrentScore(score, counter) {
  return `Your current score is ${score} out of ${counter}. `;
}
// exports

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    AmazonCancelStopHandler,
    AmazonHelpHandler,
    AnswerHandler,
    LaunchRequestHandler,
    SessionEndedHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
