'use strict';

var app = require('express')();
var https = require('https');
var qs = require('querystring');

var options = {
  org: "",
  token: "",
  port: 3000,
  invite_path: "/",
  cors_domain: "*",
  // msg_channel: false,  // set a channel name to message whenever a new user joins
}

var getopts = require("node-getopt").create([
	['t', 'token=', 'Slack admin api token'],
	['o', 'org=',   'Slack organization name (sub-domain)'],
	['p', 'port=',  'Set listen port'],
	['c', 'cors=',  'Set Access-Control-Allow-Origin header'],
	['h', 'help',   '']
]).bindHelp();
var opt = getopts.parseSystem();

if (opt.argv.length > 0) {
  console.error("ERROR: Unexpected argument(s): " + opt.argv.join(', '));
  console.error(getopts.getHelp());
  process.exit(1);
}

// Merge opts into options
for (var attrname in opt.options) { options[attrname] = opt.options[attrname]; }

if (!options.org || !options.token) {
  console.error("ERROR: must set org and token options...");
  console.error(getopts.getHelp());
  process.exit(1);
}

// Load middleware
app.use(require('body-parser').urlencoded({extended: false}));

app.post(options.invite_path, function(req, res) {
  if (!req.body.email) {
    res.writeHead(400);
    res.write("must pass email address");
    res.end();
    return;
  }

  var post_data = qs.stringify({
    email: req.body.email,
    token: options.token,
    set_active: true,
  });

  var post_opts = {
    method: 'POST',
    host: options.org + '.slack.com',
    path: '/api/users.admin.invite?'+post_data,
  }

  var post = https.request(post_opts, function(p_res) {
    if (p_res.statusCode !== 200) {
      res.writeHead(400);
      res.write("Got unexpected status: " + p_res.statusCode.toString());
      res.end();
      return;
    }
    var body = ''
    p_res.setEncoding('utf8');
    p_res.on('data', function (chunk) {
      body += chunk;
    });
    p_res.on('end', function() {
      var p_body = JSON.parse(body)
      res.setHeader('Access-Control-Allow-Origin', options.cors_domain);
      res.setHeader('Access-Control-Allow-Method', 'POST OPTIONS');
      if (p_body.ok || p_body.error === 'already_in_team' || p_body.error === 'already_invited') {
        res.writeHead(200);
        res.write('invite sent');
        res.end();
      } else {
        // console.log("ERROR:", p_body.error, p_body.warning)
        res.writeHead(400);
        res.write(body);
        res.end();
      }
    });
  });
  post.end();
});

app.listen(options.port, function() {
  console.log("listening on", options.port);
});
