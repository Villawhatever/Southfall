require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const request = require('request');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var fs = require('fs');

var lookupRules = {};
var lookupExamples = {};

app.get('/rule/:rule', function(req, res) {

    ruleNum = handleKeywordActionsAndAbilities(req.params.rule);
    var ruleText = lookupRules[ruleNum];

    if (ruleText) {
      res.setHeader('Content-Type', 'application/json');
      res.send({ 'ruleNumber': ruleNum, 'ruleText': ruleText });
    } else {
        res.status(400);
    res.setHeader('Content-Type', 'application/json');
    res.send({ 'ruleNumber': ruleNum, 'ruleText': 'Rule not found'})
      }
  });

app.get('/example/:rule', function(req, res) {
  var ruleNum = req.params.rule;
  var exampleText = lookupExamples[ruleNum];

  if (exampleText) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ 'ruleNumber': ruleNum, 'exampleText': exampleText });
  } else {
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    res.send({ 'ruleNumber': ruleNum, 'exampleText': 'Example not found'})
  }
})

app.post('/post', function(req, res) {
  var rules = req.body.text.split(' ');
  var jsonObj = {
    'response_type': 'in_channel',
    'attachments': []
  }
  rules.forEach(function(rule) {
    var foundRule = findRule(rule)
    if (foundRule) {
      jsonObj.attachments.push(findRule(rule));
    }
  });

  if(jsonObj.attachments.length != 0) {
    sendDelayedResponse(req, jsonObj)
    res.status(200).send()
  } else {
    res.status(200).send({ 'response_type': 'ephemeral', 'text': 'None of the rules you requested exist; try again?'})
  }
});

app.get('/oauth', function(req, res) {
  res.sendFile('/static/add_to_slack.html', {'root': '../VensersJournal'});
});

app.get('/oauth/redirect', function(req, res) {
  var options = {
    uri: 'https://slack.com/api/oauth.access?code=' +
    req.query.code + 
    '&client_id=' + process.env.CLIENT_ID + 
    '&client_secret=' + process.env.CLIENT_SECRET +
    '&redurect_uri=' + process.env.REDIRECT_URI,
    method: 'GET'
  }
  request(options, function(err, response, body) {
    var JSONres = JSON.parse(body);
    if (!JSONres.ok) {
      console.log(JSONres);
      res.send('Error: ' + JSON.stringify(JSONres)).status(200).end();
    } else {
      console.log('Response OK: ' + JSONres);
      res.send('Success');
    }
  });
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  buildLookupTables();
});

function handleKeywordActionsAndAbilities(num) {
  if (/701.\d+\b/.test(num)) {
    return num + "a"
  }
  if (/702.\d+\b/.test(num)) {
    ruleText = lookupRules[num]

    switch (ruleText) {
      case "Banding":
      case "Landwalk":
        return num + "c"
      case "Forecast":
      case "Vigilance":
        return num + "b"
    }

    ruleText = lookupRules[num.concat("a")]

    if (ruleText.includes("means") && ruleText.endsWith(`'Step.")`)) {
      return num + "a"
    }
    if (ruleText.endsWith("ability.") || ruleText.endsWith(`Step."`)) {
      return num + "b"
    }
    return num + "a"
  }
  return num
}

function buildLookupTables() {
  fs.readFile(__dirname + '/rules.json', 'utf8', function (err, data) {
    var rules = JSON.parse(data);

    rules.forEach(function (el, i, arr) {
      lookupRules[el.ruleNumber] = el.ruleText;
      console.log(el.ruleText)
    });
  });

  fs.readFile(__dirname + '/examples.json', 'utf8', function (err, data) {
    var examples = JSON.parse(data);

    examples.forEach(function (el, i, arr) {
      lookupExamples[el.ruleNumber] = el.exampleText;
    });
  });
}

function findRule(num) {
  ruleText = lookupRules[num];
  strippedNum = num.replace('.','');
  if (ruleText) {
    return { 'text': '<https://yawgatog.com/resources/magic-rules/#R'+strippedNum + '|*'+num+'*>\n' + ruleText };
  return null;
  }
}

function sendDelayedResponse(req, rules) {
  var options = {
    uri: req.body.response_url,
    method: 'POST',
    json: rules
  };

  request(options, function(err, res, body) {
    if (err) {
      console.log(err);
    }
  });
}
