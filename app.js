
var {Init, Check} = require("./checki.js");
var fs = require('fs');
  
var Id = "insx-th1";

function getUsr(i) {
  try {
    var usrs = fs.readFileSync("./usrs.txt").toString().
    split("\n");
    if (i == "l") return usrs.length;
    return usrs[i];
  } catch(e) {
    //throw e;
    sendMail(Id, "حدث خطأ في قراءة ملف البيانات");
  }
    
}

async function Start(app) {
  var n = 0;
  var f = getUsr("l");
  app.get('/', (req, res) => {
    var sec = (f - n) * 2;
    res.write("comple: "+(n) + " From "+f);
    res.write("\n");
    res.write((f-n) + " Left");
    res.write("\n");
    res.end(`Time: ${sec / 60 / 60 } Hours`);
  })
  console.log("Init Cookies ...");
  await Init();
  console.log("Runing Length: " + f);
  sendMail(Id, `بدأ العملية مع ${f} احتمال\nالوقت المقدر ${Math.floor((f*2)/60/60/24)} ايام`);
  do {
    var usr = getUsr(n++);
    console.log("checking " + usr);
    var now = (new Date()).getTime();
    var ch = await Check(usr);
    var time = (new Date).getTime() - now;
    console.log("=> " + ch, "time " + time);
    if (typeof ch == "object") {
      console.log(ch);
      if (ch.err == 1) {
        sendMain(Id, "حدث خطأ رقم 1, تم ايقاف العملية لمدة خمس دقائق");
        await timer(5*60*1000);
        await Init();
        n--;
        continue;
      }
       
      if (ch.err == 2) {
         sendMail(Id, `حدث خطأ رقم 2, تم ايقاف العملية. \nالتفاصيل: \nbody: ${ch.data}\nn${n}\nf: ${f}`);
         break;
      }
      if (ch.err == 3) {
        sendMail(Id, `حدث خطأ رقم 2, تم ايقاف العملية. \nالتفاصيل: \nbody: ${ch.data}`);
         break;
      }
      
    }
    if (ch == true) {
      console.log("pass");
      save(usr);
    }
    
    await timer(1500);
} while (n < f);

console.log("Comple!");
sendMail("اكتمل التحقق");
}

function timer(ms) {
 return new Promise(res => setTimeout(res, ms));
}

function sendMail(subject, mess) {
  const mailgun = require("mailgun-js");
  const DOMAIN = 'sandboxef7e0bc0f5e34c98a51796d9ab62e933.mailgun.org';
  var api_key = "8b5ea5955a1de3ec1d0d3e72c7dabe00-afab6073-e38c0fa1";
  const mg = mailgun({apiKey: api_key, domain: DOMAIN});
  const data = {
	  from: `Samer <samer-server1@${Id}.com>`,
	  to: `samer69255@gmail.com`,
	  subject: subject,
	  text: mess
  };
  mg.messages().send(data, function (error, body) {
	  console.log(body);
  });
}

function save(u) {
  var file = "./success.txt";
  try {
    var uu = fs.readFileSync(file).toString();
     uu += `${u}\n`;
    fs.writeFileSync(file, uu);
    console.log("save!");
    sendMail(Id, `تم رصد مستخدم واحد \nUsername: ${u}`);
  } catch(e) {
    sendMail(Id, "حدث خطأ في قراءة ملف التخزين");
    //throw e;
  }
  
 
}

module.exports = Start