//将时间转化为  xx分钟 xx小时 ………………
export const time2Str = (stamp) => {
	let time = new Date(new Date() - new Date(stamp)).getTime();
    let min = time / (1000 * 60);
    let hour = min / 60;
    let day = hour / 24;
    let month = day / 30;
    let year = month / 12;
    if (min < 60) {
      return Math.floor(min) + '分钟';
    }
    else if (hour < 24) {
      return Math.floor(hour) + '小时';
    }
    else if (day < 30) {
      return Math.floor(day) + '天';
    }
    else if (month < 12) {
      return Math.floor(month) + '月';
    }
    else {
      return Math.floor(year) + '年';
    }
}

//转化封面url为实际url
export const url2Real = (url) => {
	if (url.search(/agent/i) === -1) {
      return 'http://api.zhuishushenqi.com' + url;
    }
    else{
      return decodeURIComponent(url.replace(/\/agent\//, ''));
    }
}

//将字数带上单位 如12345 转化为1.2万字
export const wordCount2Str = (wordCount) => {
	if (Array.from(String(wordCount)).length > 4) {
      let arr = Array.from(String(wordCount));
      arr.length -= 4;
      wordCount = arr.join('') + '万';
    }
    return wordCount + '字';
}
