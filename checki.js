var request = require("request");
var querystring = require('querystring');

var headers = {
  "Accept": "*/*",
  "Accept-Language": "r,en-US;q=0.9,en;q=0.8",
  "Content-Type": "application/x-www-form-urlencoded",
  "Origin": "https://www.instagram.com",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3)AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3Safari/7046A194A",
  };
var ct = "";
var cookie = "";

function Init() {
  return new Promise(resolve => {
    var url = "https://www.instagram.com/accounts/emailsignup/";
    var options = {
      url: url,
      headers: headers,
      method: "GET"
    }

    request(options, (err, resp, body) => {
      if (err) return console.log(err);
      var cookie_header = resp.headers["set-cookie"];
      for (var key=0; key<cookie_header.length; key++) {
        var c = cookie_header[key].split(";")[0];
        cookie += c + "; ";
      }
       
       ct = cookie.match(/csrftoken=(.*?);/)[1];
      resolve();
    });
    
  });
  
  }

  function Check(user) {
    return new Promise(resolve => {
      var newHeader = headers;
      newHeader["Cookie"] = cookie.trim();
      newHeader["X-CSRFToken"] = ct;
      newHeader["X-Requested-With"] = "XMLHttpRequest";
      newHeader["x-instagram-ajax"] = 1;
      newHeader["Referer"] = "https://www.instagram.com/accounts/emailsignup/";

      var url = "https://www.instagram.com/accounts/web_create_ajax/attempt/";
      var data = {
        email: "",
        password: "",
        username: user,
        first_name: "",
        opt_into_one_tap: false
      }
      var body = querystring.stringify(data);
      newHeader["content-length"] = body.length;
      var options = {
        uri: url,
        method: "POST",
        body: body,
        headers:newHeader
      }
     // console.log(options);
      // send data to url
      request(options, function (err, res, body) {
        //console.log(res.statusCode);
        if (res.statusCode == "200") {
          try {
            var json = JSON.parse(body);
            }  catch (e) {
              return resolve({err:2, data:body, s:res.statusCode});

          }
            var errors = json.errors;
            if (errors === undefined) {
              resolve({err:3, data:body});
              return;
            }
            
          resolve(!("username" in errors));
         
          
        } else {
          resolve({err:1, data:res.statusCode});
        }
      });
    });
  }
  
  module.exports = {
    Init: Init,
    Check: Check
  }