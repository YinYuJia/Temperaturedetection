export function getDay() {
  let day = new Date();
  let yy = day.getFullYear().toString();
  let MM = day.getMonth() + 1 >= 10 ? (day.getMonth() + 1) : '0' + (day.getMonth() + 1);
  let DD = day.getDate() >= 10 ? day.getDate() : '0' + day.getDate();
  console.log("today:"+ yy+MM+DD);
  return yy+MM+DD
}

export function parseTime(time, cFormat) {
  if (time == null) {
    return null
  }
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function changeJedw(data,type){
  for(let i=0;i<data.length;i++){
    if(data[i].tzje!=null || data.tzje != undefined){
      let tzje = data[i].tzje.split("-");
      let jedw = "";
      if(tzje[1] == '1'){
        jedw = "元";
      }else if(tzje[1] == '2'){
        jedw = "万元";
      }else if(tzje[1] == '3'){
        jedw = "亿元";
      }
      data[i].tzje = tzje[0] + jedw;
    }
    if(type == 'ldk'){
      if(data[i].ytzje!=null || data.ytzje != undefined){
        let tzje = data[i].ytzje.split("-");
        let jedw = "";
        if(tzje[1] == '1'){
          jedw = "元";
        }else if(tzje[1] == '2'){
          jedw = "万元";
        }else if(tzje[1] == '3'){
          jedw = "亿元";
        }
        data[i].ytzje = tzje[0] + jedw;
      }
      if(data[i].jntzje!=null || data.jntzje != undefined){
        let tzje = data[i].jntzje.split("-");
        let jedw = "";
        if(tzje[1] == '1'){
          jedw = "元";
        }else if(tzje[1] == '2'){
          jedw = "万元";
        }else if(tzje[1] == '3'){
          jedw = "亿元";
        }
        data[i].jntzje = tzje[0] + jedw;
      }
    }
  }
  return data;
}
