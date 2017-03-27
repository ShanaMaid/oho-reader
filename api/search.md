## 搜索图书
```
url: api.zhuishushenqi.com/book/fuzzy-search
method: GET
params:
  query:关键词
  start:结果开始位置
  limit:结果最大数量

example:
GET api.zhuishushenqi.com/book/fuzzy-search?query=一念&start=0&limit=2

reponse:
{
  "books": [
    {
      "_id": "57206c3539a913ad65d35c7b",
      "hasCp": true,
      "title": "一念永恒",
      "cat": "仙侠",
      "author": "耳根",
      "site": "zhuishuvip",
      "cover": "/agent/http://image.cmfu.com/books/1003354631/1003354631.jpg",
      "shortIntro": "一念成沧海，一念化桑田。一念斩千魔，一念诛万仙。唯我念……永恒",
      "lastChapter": "第681章 杀！",
      "retentionRatio": 75.68,
      "latelyFollower": 195114,
      "wordCount": 1987456
    },
    {
      "_id": "54d2e3e958ec2f3d7cffdf25",
      "hasCp": true,
      "title": "战神狂飙",
      "cat": "玄幻",
      "author": "一念汪洋",
      "site": "zhuishuvip",
      "cover": "/cover/148005119461175",
      "shortIntro": "世人敢问，何谓战神？ “便是以肉身霸世，拳爆星空，掌裂苍穹，一路摧枯拉朽，横推八荒六合！” “便是怀勇猛之心，掠过繁华，吞下寂寞，无畏无惧无敌，唯己永恒不动！”...",
      "lastChapter": "卷五：北斗道极 第1770章：你对我做了什么！（求恶魔果实）",
      "retentionRatio": 57.95,
      "latelyFollower": 4830,
      "wordCount": 5517891
    }
  ],
  "ok": true
}
```