const sscanf = require("scanf")
const fs = require("fs")
const folder = "/Users/heikki.meriranta/bletmp/"
const whitelist = ["EC9A58D14F85.scan"];
fs.watch(folder, (eventType, fileName) => {
  console.log(eventType, fileName);
  if(whitelist.indexOf(fileName)>-1)
  {
      console.log(parseAndSaveRuuviData(fs.readFileSync(folder + fileName)));
  }
});

/*
Raw binary data: 0x03291A1ECE1EFC18F94202CA0B53

Field	Value
Data format	3
Temperature	26.3 C
Pressure	102766
Humidity	20.5 RH-%
Acceleration X	-1.000 G
Acceleration Y	-1.726 G
Acceleration Z	0.714 G
Voltage	2.899 V
 */
function parseAndSaveRuuviData(data) { 
 
    var raw = data.toString().split(' ');
    var len = raw.length;
    const startIndex = 1;
    if(len!=16)
    {
        console.log("should be 16 is ", len);
        ;
    }
    if (raw[1].toString() != "03") {
      console.log(
        raw,
        "not format 3. See https://github.com/ruuvi/ruuvi-sensor-protocols/blob/master/dataformat_03.md"
      );
      return;
    }
    /* temperature */
    var tem = parseInt(raw[3],16);
    var sign = 1;
    if ((tem & 0x80 )=== 0x80) {
      tem = tem&0b01111111;
      sign = -1;
    }
    var temp = (tem + (parseInt(raw[4], 16) / 100)) * sign;
    var sdata = {
      humidity: parseInt(raw[2], 16).toString(10) / 2,
      temperature: temp,
      pressure: parseInt(raw[5] + raw[6], 16) + 50000,
      accelerationX: Signed32(raw[7] + raw[8]),
      accelerationY: Signed32(raw[9] + raw[10]),
      accelerationZ: Signed32(raw[11] + raw[12]),
      battery: parseInt(raw[13] + raw[14], 16)
    };
    return sdata;
 }
 function Signed32(thebits)
 {
    let val = parseInt(thebits, 16);
    if (val>0xffff/2) {
      val = val - (0xffff+1); 
    }
    return val;
 }
