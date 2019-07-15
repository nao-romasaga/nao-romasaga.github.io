var BASE_SKILL_LIST = [];
var USE_SKILL_LIST = [];
var NOW_CHAR = {};
var NOW_CHAR_ID = "";
var NOW_STYLE = {};
var CHAR_MASTER = {"ID835":{"Id":"ID835","Name":"アルベルト","FlavorText":"イスマス侯ルドルフの第二子。姉のディアナはローザリア王国皇太子ナイトハルトの妃に内定している。","Series":"RS1","Gender":"男","Hp":81,"DotId":"ID334b4","Holders":["ID334b5","ID334b6","ID334b7"],"STR":7,"VIT":7,"DEX":6,"AGI":5,"INT":4,"MND":4,"AI":5,"MI":6,"WeaponType":"剣","MAXSTR":5,"MAXVIT":6,"MAXDEX":2,"MAXAGI":2,"MAXINT":-1,"MAXMND":0,"MAXAI":0,"MAXMI":4},"ID836":{"Id":"ID836","Name":"ジャミル","FlavorText":"南エスタミルの盗賊。盗賊ギルドに所属しているが、ギルド上層部の老人達のやり方に満足していない。","Series":"RS1","Gender":"男","Hp":70,"DotId":"ID33518","Holders":["ID33519","ID3351a","ID3351b"],"STR":5,"VIT":5,"DEX":7,"AGI":7,"INT":7,"MND":5,"AI":3,"MI":5,"WeaponType":"小剣","MAXSTR":-2,"MAXVIT":2,"MAXDEX":8,"MAXAGI":5,"MAXINT":2,"MAXMND":1,"MAXAI":0,"MAXMI":1},"ID837":{"Id":"ID837","Name":"グレイ","FlavorText":"放浪の冒険者。リガウ島の出身という話もあるが、真偽は分からない。ガラハド、ミリアムとは馴染み。","Series":"RS1","Gender":"男","Hp":75,"DotId":"ID3357c","Holders":["ID3357d","ID3357e","ID3357f"],"STR":7,"VIT":5,"DEX":8,"AGI":4,"INT":6,"MND":6,"AI":3,"MI":5,"WeaponType":"大剣","MAXSTR":3,"MAXVIT":-1,"MAXDEX":5,"MAXAGI":2,"MAXINT":2,"MAXMND":1,"MAXAI":0,"MAXMI":1},"ID838":{"Id":"ID838","Name":"ホーク","FlavorText":"海賊。キャプテンホークと呼ばれているが、本名は不明。","Series":"RS1","Gender":"男","Hp":75,"DotId":"ID335e0","Holders":["ID335e1","ID335e2","ID335e4"],"STR":7,"VIT":6,"DEX":7,"AGI":7,"INT":4,"MND":4,"AI":4,"MI":4,"WeaponType":"斧","MAXSTR":5,"MAXVIT":7,"MAXDEX":6,"MAXAGI":3,"MAXINT":0,"MAXMND":0,"MAXAI":1,"MAXMI":0},"ID839":{"Id":"ID839","Name":"アイシャ","FlavorText":"ガレサステップの遊牧民タラール族。族長ニザムの孫娘。","Series":"RS1","Gender":"女","Hp":70,"DotId":"ID33644","Holders":["ID33645","ID33646","ID33647"],"STR":5,"VIT":5,"DEX":7,"AGI":6,"INT":4,"MND":5,"AI":7,"MI":6,"WeaponType":"斧","MAXSTR":6,"MAXVIT":3,"MAXDEX":2,"MAXAGI":8,"MAXINT":0,"MAXMND":0,"MAXAI":1,"MAXMI":0},"ID83a":{"Id":"ID83a","Name":"クローディア","FlavorText":"迷いの森の魔女オウルに育てられた孤児。その正体は、バファル帝国皇帝フェル七世の唯一人の娘で、皇位継承権第一位の皇女。","Series":"RS1","Gender":"女","Hp":63,"DotId":"ID336a8","Holders":["ID336a9","ID336aa","ID336ab"],"STR":7,"VIT":4,"DEX":7,"AGI":7,"INT":7,"MND":4,"AI":5,"MI":6,"WeaponType":"弓","MAXSTR":3,"MAXVIT":2,"MAXDEX":9,"MAXAGI":4,"MAXINT":0,"MAXMND":0,"MAXAI":1,"MAXMI":4},"ID83b":{"Id":"ID83b","Name":"バーバラ","FlavorText":"ニューロードを旅する芸人一座の踊り子。","Series":"RS1","Gender":"女","Hp":79,"DotId":"ID3370c","Holders":["ID3370d","ID3370e","ID3370f"],"STR":5,"VIT":6,"DEX":7,"AGI":4,"INT":4,"MND":6,"AI":7,"MI":7,"WeaponType":"槍","MAXSTR":6,"MAXVIT":9,"MAXDEX":4,"MAXAGI":0,"MAXINT":-1,"MAXMND":0,"MAXAI":1,"MAXMI":0},"ID83c":{"Id":"ID83c","Name":"シフ","FlavorText":"極寒のバルハラントで暮らすバルハル族の戦士。","Series":"RS1","Gender":"女","Hp":91,"DotId":"ID33770","Holders":["ID33771","ID33772","ID33774"],"STR":8,"VIT":8,"DEX":5,"AGI":3,"INT":4,"MND":5,"AI":5,"MI":6,"WeaponType":"斧","MAXSTR":10,"MAXVIT":10,"MAXDEX":2,"MAXAGI":1,"MAXINT":-2,"MAXMND":-1,"MAXAI":1,"MAXMI":1},"ID83f":{"Id":"ID83f","Name":"ディアナ","FlavorText":"イスマス侯ルドルフの第一子。アルベルトは実の弟。ローザリア王国の薔薇騎士団に所属する女騎士。皇太子ナイトハルトに求婚され、将来の王妃の地位が約束されている。アルベルトには厳しい。","Series":"RS1","Gender":"女","Hp":76,"DotId":"ID3389c","Holders":["ID3389d","ID3389e","ID3389f"],"STR":5,"VIT":6,"DEX":8,"AGI":7,"INT":5,"MND":5,"AI":4,"MI":6,"WeaponType":"小剣","MAXSTR":2,"MAXVIT":5,"MAXDEX":9,"MAXAGI":6,"MAXINT":1,"MAXMND":2,"MAXAI":0,"MAXMI":1},"ID842":{"Id":"ID842","Name":"ミリアム","FlavorText":"火術士。グレイ、ガラハドと共に冒険を続けてきた。","Series":"RS1","Gender":"女","Hp":59,"DotId":"ID339c8","Holders":["ID339c9","ID339ca"],"STR":3,"VIT":3,"DEX":6,"AGI":7,"INT":9,"MND":6,"AI":7,"MI":6,"WeaponType":"杖","MAXSTR":-5,"MAXVIT":-3,"MAXDEX":1,"MAXAGI":6,"MAXINT":8,"MAXMND":3,"MAXAI":2,"MAXMI":1},"ID843":{"Id":"ID843","Name":"ゲラ＝ハ","FlavorText":"ワロン島のゲッコ族。ホークの下で操舵手を務める。冷静。","Series":"RS1","Gender":"男","Hp":97,"DotId":"ID33a2c","Holders":["ID33a2e","ID33a2d"],"STR":8,"VIT":9,"DEX":6,"AGI":2,"INT":3,"MND":5,"AI":4,"MI":6,"WeaponType":"槍","MAXSTR":3,"MAXVIT":5,"MAXDEX":3,"MAXAGI":6,"MAXINT":-2,"MAXMND":-1,"MAXAI":-1,"MAXMI":3},"ID84c":{"Id":"ID84c","Name":"ナイトハルト","FlavorText":"ローザリア王国皇太子。病に臥せる父王の摂政を務める実質的な支配者。有能な統治者であり、巧みな政治家であり、不敗の指揮官であり、凄腕の戦士でもある。国民の人気、部下の信頼共に絶大。","Series":"RS1","Gender":"男","Hp":83,"DotId":"ID33db0","Holders":["ID33db1","ID33db2"],"STR":9,"VIT":7,"DEX":7,"AGI":3,"INT":4,"MND":4,"AI":4,"MI":5,"WeaponType":"槍","MAXSTR":9,"MAXVIT":8,"MAXDEX":3,"MAXAGI":1,"MAXINT":-2,"MAXMND":-1,"MAXAI":1,"MAXMI":0},"ID899":{"Id":"ID899","Name":"レオン","FlavorText":"伝承法でジェラールに力を授け、バレンヌ帝国再興の礎となった皇帝。最初、オアイーブの献言を受け入れなかったが、長子ヴィクトールがクジンシーに殺された後、伝承法を受け入れた。","Series":"RS2","Gender":"男","Hp":75,"DotId":"ID35bc4","Holders":["ID35bc5","ID35bc6"],"STR":7,"VIT":6,"DEX":6,"AGI":5,"INT":7,"MND":4,"AI":3,"MI":5,"WeaponType":"剣","MAXSTR":1,"MAXVIT":5,"MAXDEX":1,"MAXAGI":2,"MAXINT":3,"MAXMND":2,"MAXAI":-3,"MAXMI":2},"ID89a":{"Id":"ID89a","Name":"ジェラール","FlavorText":"バレンヌ帝国に新たな歴史を開いた初代伝承皇帝。父帝レオンから伝承法で帝位を受け継いだ。実の親子が伝承したのは、これが最初で最後であった。七英雄によって滅びかけていた帝国を再興。","Series":"RS2","Gender":"男","Hp":68,"DotId":"ID35c28","Holders":["ID35c29","ID35c2a","ID35c2b"],"STR":6,"VIT":5,"DEX":7,"AGI":8,"INT":6,"MND":4,"AI":3,"MI":4,"WeaponType":"剣","MAXSTR":3,"MAXVIT":5,"MAXDEX":3,"MAXAGI":3,"MAXINT":1,"MAXMND":0,"MAXAI":3,"MAXMI":-1},"ID89b":{"Id":"ID89b","Name":"最終皇帝(男)","FlavorText":"伝承法の限界によって定められた、最後のバレンヌ帝国皇帝。","Series":"RS2","Gender":"男","Hp":90,"DotId":"ID35c8c","Holders":["ID35c8d","ID35c8e"],"STR":7,"VIT":8,"DEX":7,"AGI":3,"INT":5,"MND":5,"AI":3,"MI":5,"WeaponType":"大剣","MAXSTR":5,"MAXVIT":3,"MAXDEX":3,"MAXAGI":2,"MAXINT":-1,"MAXMND":0,"MAXAI":0,"MAXMI":1},"ID89e":{"Id":"ID89e","Name":"ヴィクトール","FlavorText":"バレンヌ帝国皇帝レオンの長子で、皇太子。ジェラールは弟。大剣の使い手で、得意技は流し斬り。","Series":"RS2","Gender":"男","Hp":84,"DotId":"ID35db8","Holders":["ID35db9","ID35dba","ID35dbb"],"STR":7,"VIT":7,"DEX":7,"AGI":4,"INT":4,"MND":5,"AI":3,"MI":6,"WeaponType":"大剣","MAXSTR":7,"MAXVIT":2,"MAXDEX":2,"MAXAGI":6,"MAXINT":1,"MAXMND":0,"MAXAI":6,"MAXMI":-1},"ID8a3":{"Id":"ID8a3","Name":"帝国軽装歩兵(男)","FlavorText":"バレンヌ帝国正規軍の主力を担う。バランスのとれた戦力だが、男は大剣による破壊力のある攻撃を得意とする。","Series":"RS2","Gender":"男","Hp":76,"DotId":"ID35fac","Holders":["ID35fb7"],"STR":8,"VIT":6,"DEX":8,"AGI":5,"INT":5,"MND":4,"AI":3,"MI":4,"WeaponType":"大剣","MAXSTR":4,"MAXVIT":0,"MAXDEX":4,"MAXAGI":3,"MAXINT":1,"MAXMND":0,"MAXAI":5,"MAXMI":-7},"ID8a4":{"Id":"ID8a4","Name":"帝国軽装歩兵(女)","FlavorText":"バレンヌ帝国正規軍の主力を担う。バランスのとれた戦力だが、女は小剣による素早い攻撃を得意とする。","Series":"RS2","Gender":"女","Hp":73,"DotId":"ID36010","Holders":["ID3601b"],"STR":5,"VIT":6,"DEX":7,"AGI":8,"INT":6,"MND":4,"AI":4,"MI":6,"WeaponType":"小剣","MAXSTR":1,"MAXVIT":7,"MAXDEX":6,"MAXAGI":2,"MAXINT":-1,"MAXMND":-7,"MAXAI":0,"MAXMI":1},"ID8a6":{"Id":"ID8a6","Name":"帝国猟兵(女)","FlavorText":"バレンヌ帝国正規軍において、軽装備を利点として、機動力で敵をかく乱する任務を担う。弓を主要武器にしている。","Series":"RS2","Gender":"女","Hp":55,"DotId":"ID360d8","Holders":["ID360e3"],"STR":5,"VIT":3,"DEX":8,"AGI":5,"INT":8,"MND":4,"AI":7,"MI":7,"WeaponType":"弓","MAXSTR":-1,"MAXVIT":-7,"MAXDEX":3,"MAXAGI":8,"MAXINT":4,"MAXMND":0,"MAXAI":2,"MAXMI":1},"ID8a8":{"Id":"ID8a8","Name":"宮廷魔術師(女)","FlavorText":"バレンヌ帝国の宮廷に仕える魔術士。術法の手続きや品格にうるさく、自由気ままなフリーメイジとは折り合いが悪い。","Series":"RS2","Gender":"女","Hp":63,"DotId":"ID361a0","Holders":["ID361ab","ID361ac"],"STR":4,"VIT":3,"DEX":7,"AGI":6,"INT":8,"MND":7,"AI":6,"MI":6,"WeaponType":"杖","MAXSTR":-2,"MAXVIT":1,"MAXDEX":1,"MAXAGI":3,"MAXINT":8,"MAXMND":2,"MAXAI":2,"MAXMI":5},"ID8a9":{"Id":"ID8a9","Name":"フリーファイター(男)","FlavorText":"バレンヌ帝国皇帝に雇われた傭兵。金の為というよりは、皇帝への個人的な忠誠心で仕えている者たちだ。そのため、皇帝が代替わりすると辞めてしまう者も多い。男は大剣を振るう。","Series":"RS2","Gender":"男","Hp":84,"DotId":"ID36204","Holders":["ID3620f","ID36210","ID36219"],"STR":7,"VIT":7,"DEX":7,"AGI":5,"INT":5,"MND":5,"AI":3,"MI":5,"WeaponType":"大剣","MAXSTR":6,"MAXVIT":4,"MAXDEX":3,"MAXAGI":1,"MAXINT":-1,"MAXMND":0,"MAXAI":5,"MAXMI":1},"ID8aa":{"Id":"ID8aa","Name":"フリーファイター(女)","FlavorText":"バレンヌ帝国皇帝に雇われた傭兵。金の為というよりは、皇帝への個人的な忠誠心で仕えている者たちだ。そのため、皇帝が代替わりすると辞めてしまう者も多い。女は長剣を振るう。","Series":"RS2","Gender":"女","Hp":84,"DotId":"ID36268","Holders":["ID36273"],"STR":7,"VIT":7,"DEX":7,"AGI":4,"INT":5,"MND":5,"AI":5,"MI":5,"WeaponType":"槍","MAXSTR":6,"MAXVIT":6,"MAXDEX":3,"MAXAGI":-1,"MAXINT":-5,"MAXMND":1,"MAXAI":1,"MAXMI":-2},"ID8ad":{"Id":"ID8ad","Name":"インペリアルガード(男)","FlavorText":"拡張した帝国軍から選りすぐられた親衛隊。誇り高き武器、槍を操る。","Series":"RS2","Gender":"男","Hp":88,"DotId":"ID36394","Holders":["ID3639f"],"STR":8,"VIT":8,"DEX":7,"AGI":3,"INT":4,"MND":4,"AI":4,"MI":5,"WeaponType":"槍","MAXSTR":3,"MAXVIT":7,"MAXDEX":2,"MAXAGI":-1,"MAXINT":-2,"MAXMND":1,"MAXAI":4,"MAXMI":-5},"ID8ae":{"Id":"ID8ae","Name":"インペリアルガード(女)","FlavorText":"拡張した帝国軍から選りすぐられた親衛隊。誇り高き武器、槍を操る。","Series":"RS2","Gender":"女","Hp":76,"DotId":"ID363f8","Holders":["ID36403"],"STR":8,"VIT":6,"DEX":7,"AGI":4,"INT":5,"MND":4,"AI":5,"MI":6,"WeaponType":"槍","MAXSTR":4,"MAXVIT":-2,"MAXDEX":3,"MAXAGI":1,"MAXINT":-2,"MAXMND":5,"MAXAI":0,"MAXMI":0},"ID8af":{"Id":"ID8af","Name":"帝国重装歩兵","FlavorText":"かつてはバレンヌ帝国軍の主力であったが、現在は皇帝を護る壁の役割を期待される防御的な兵科となっている。だが、磨き抜かれた防御技術は何度も皇帝の危機を救ってきた。","Series":"RS2","Gender":"男","Hp":96,"DotId":"ID3645c","Holders":["ID36467"],"STR":7,"VIT":9,"DEX":5,"AGI":4,"INT":4,"MND":5,"AI":3,"MI":6,"WeaponType":"剣","MAXSTR":3,"MAXVIT":8,"MAXDEX":0,"MAXAGI":1,"MAXINT":-1,"MAXMND":0,"MAXAI":6,"MAXMI":-8},"ID8b0":{"Id":"ID8b0","Name":"軍師","FlavorText":"バレンヌ帝国の帝国大学に集まった秀才達の中でも、特に秀でた者が皇帝の軍師として採用された。型に嵌まらないスケールの大きい人物が多く、学生としては不真面目な者も多かったようだ。","Series":"RS2","Gender":"男","Hp":69,"DotId":"ID364c0","Holders":["ID364cb","ID36511"],"STR":4,"VIT":4,"DEX":6,"AGI":5,"INT":9,"MND":7,"AI":5,"MI":4,"WeaponType":"杖","MAXSTR":-3,"MAXVIT":-1,"MAXDEX":1,"MAXAGI":2,"MAXINT":8,"MAXMND":3,"MAXAI":2,"MAXMI":1},"ID8b1":{"Id":"ID8b1","Name":"イーストガード","FlavorText":"東方の武人によって編成されたバレンヌ皇帝の親衛隊の一つ。剣の道、心の道を究めるのに熱心なあまり、体を壊す者もいるようだ。","Series":"RS2","Gender":"男","Hp":82,"DotId":"ID36524","Holders":["ID3652f","ID36575"],"STR":8,"VIT":7,"DEX":7,"AGI":5,"INT":5,"MND":4,"AI":3,"MI":5,"WeaponType":"大剣","MAXSTR":7,"MAXVIT":2,"MAXDEX":2,"MAXAGI":7,"MAXINT":-1,"MAXMND":-2,"MAXAI":0,"MAXMI":3},"ID8b3":{"Id":"ID8b3","Name":"アマゾネス","FlavorText":"エイルネップの町の男が敵の誘惑の罠に陥った時、女達はジャングルの奥に逃れ、敵と戦い続けた。誘惑に弱い男を信用しない。","Series":"RS2","Gender":"女","Hp":67,"DotId":"ID365ec","Holders":["ID365f7"],"STR":8,"VIT":5,"DEX":8,"AGI":4,"INT":7,"MND":3,"AI":3,"MI":5,"WeaponType":"槍","MAXSTR":5,"MAXVIT":-2,"MAXDEX":2,"MAXAGI":5,"MAXINT":2,"MAXMND":-2,"MAXAI":-1,"MAXMI":0},"ID8b6":{"Id":"ID8b6","Name":"ノーマッド(女)","FlavorText":"ステップの遊牧民。弓矢による遠距離攻撃を得意とする。","Series":"RS2","Gender":"女","Hp":62,"DotId":"ID36718","Holders":["ID36723"],"STR":6,"VIT":4,"DEX":8,"AGI":5,"INT":9,"MND":4,"AI":5,"MI":5,"WeaponType":"弓","MAXSTR":-7,"MAXVIT":-1,"MAXDEX":9,"MAXAGI":5,"MAXINT":4,"MAXMND":0,"MAXAI":-1,"MAXMI":1},"ID8b7":{"Id":"ID8b7","Name":"ホーリーオーダー(男)","FlavorText":"旧カンバーランド王国の王族や貴族を中心に結成された聖騎士団。剣の技を得意とする。","Series":"RS2","Gender":"男","Hp":72,"DotId":"ID3677c","Holders":["ID36787"],"STR":7,"VIT":6,"DEX":6,"AGI":6,"INT":5,"MND":3,"AI":6,"MI":7,"WeaponType":"剣","MAXSTR":4,"MAXVIT":4,"MAXDEX":2,"MAXAGI":3,"MAXINT":-1,"MAXMND":-2,"MAXAI":-7,"MAXMI":6},"ID8b8":{"Id":"ID8b8","Name":"ホーリーオーダー(女)","FlavorText":"旧カンバーランド王国の王族や貴族を中心に結成された聖騎士団。治癒や防御の魔法を得意とする。","Series":"RS2","Gender":"女","Hp":73,"DotId":"ID367e0","Holders":["ID367eb","ID367ec","ID367f5"],"STR":5,"VIT":5,"DEX":6,"AGI":4,"INT":6,"MND":6,"AI":7,"MI":6,"WeaponType":"棍棒","MAXSTR":5,"MAXVIT":2,"MAXDEX":1,"MAXAGI":1,"MAXINT":2,"MAXMND":7,"MAXAI":0,"MAXMI":0},"ID8b9":{"Id":"ID8b9","Name":"海女","FlavorText":"トバの町に住む海女は、歩く前に泳ぎを覚え、言葉の前に潜水を覚えるという。そのため、海や天候に特別な感覚を備えるのだと言われている。","Series":"RS2","Gender":"女","Hp":82,"DotId":"ID36844","Holders":["ID36859","ID3685a"],"STR":5,"VIT":7,"DEX":3,"AGI":7,"INT":7,"MND":5,"AI":6,"MI":6,"WeaponType":"槍","MAXSTR":9,"MAXVIT":1,"MAXDEX":4,"MAXAGI":2,"MAXINT":2,"MAXMND":2,"MAXAI":4,"MAXMI":1},"ID8ba":{"Id":"ID8ba","Name":"武装商船団","FlavorText":"ロンギット海の航路と交易を支配している。海賊と呼ばれると激怒する。","Series":"RS2","Gender":"男","Hp":82,"DotId":"ID368a8","Holders":["ID368b3"],"STR":8,"VIT":7,"DEX":7,"AGI":5,"INT":4,"MND":4,"AI":4,"MI":3,"WeaponType":"斧","MAXSTR":7,"MAXVIT":0,"MAXDEX":2,"MAXAGI":5,"MAXINT":-6,"MAXMND":1,"MAXAI":1,"MAXMI":0},"ID8bb":{"Id":"ID8bb","Name":"サイゴ族","FlavorText":"ムーという寒冷地に棲む大型の獣と共に暮らす遊牧民。寒さに鍛えられた肉体が武器。","Series":"RS2","Gender":"男","Hp":105,"DotId":"ID3690c","Holders":["ID36917"],"STR":7,"VIT":10,"DEX":5,"AGI":2,"INT":3,"MND":6,"AI":4,"MI":5,"WeaponType":"棍棒","MAXSTR":4,"MAXVIT":8,"MAXDEX":2,"MAXAGI":0,"MAXINT":-2,"MAXMND":-3,"MAXAI":0,"MAXMI":0},"ID8bc":{"Id":"ID8bc","Name":"格闘家","FlavorText":"龍の穴と呼ばれる場所で、肉体と格闘の技術を究めるべく修行を続ける集団。","Series":"RS2","Gender":"男","Hp":79,"DotId":"ID36970","Holders":["ID3697b"],"STR":8,"VIT":7,"DEX":6,"AGI":7,"INT":4,"MND":3,"AI":4,"MI":5,"WeaponType":"体術","MAXSTR":5,"MAXVIT":-4,"MAXDEX":2,"MAXAGI":4,"MAXINT":-2,"MAXMND":4,"MAXAI":0,"MAXMI":0},"ID8be":{"Id":"ID8be","Name":"シティシーフ(女)","FlavorText":"都市の喧騒に紛れて、盗みやスリに詐欺などで生活する連中。身のこなしだけでなく、都会的な生き方までスマートだ。","Series":"RS2","Gender":"女","Hp":57,"DotId":"ID36a38","Holders":["ID36a43","ID36a44","ID36a45","ID36a46"],"STR":7,"VIT":3,"DEX":6,"AGI":9,"INT":6,"MND":4,"AI":5,"MI":6,"WeaponType":"体術","MAXSTR":4,"MAXVIT":0,"MAXDEX":4,"MAXAGI":10,"MAXINT":2,"MAXMND":-2,"MAXAI":-1,"MAXMI":1},"ID8c0":{"Id":"ID8c0","Name":"モール","FlavorText":"サバンナの地下にトンネルを張り巡らして住んでいるモグラ族。土の術が得意で、体力もある。","Series":"RS2","Gender":"男","Hp":81,"DotId":"ID36b00","Holders":["ID36b0b"],"STR":4,"VIT":7,"DEX":7,"AGI":7,"INT":5,"MND":5,"AI":4,"MI":5,"WeaponType":"小剣","MAXSTR":-5,"MAXVIT":5,"MAXDEX":9,"MAXAGI":2,"MAXINT":-1,"MAXMND":0,"MAXAI":0,"MAXMI":-1},"ID8c1":{"Id":"ID8c1","Name":"ネレイド","FlavorText":"ルドン高原の湖に棲む水の精。","Series":"RS2","Gender":"女","Hp":59,"DotId":"ID36b64","Holders":["ID36b6f","ID36b70"],"STR":3,"VIT":3,"DEX":7,"AGI":8,"INT":8,"MND":6,"AI":6,"MI":5,"WeaponType":"杖","MAXSTR":-2,"MAXVIT":-2,"MAXDEX":2,"MAXAGI":9,"MAXINT":3,"MAXMND":2,"MAXAI":5,"MAXMI":3},"ID8c2":{"Id":"ID8c2","Name":"イーリス","FlavorText":"チカパ山に住む有翼の種族。","Series":"RS2","Gender":"女","Hp":55,"DotId":"ID36bc8","Holders":["ID36bd3","ID36bd4"],"STR":5,"VIT":3,"DEX":8,"AGI":9,"INT":7,"MND":4,"AI":5,"MI":6,"WeaponType":"弓","MAXSTR":0,"MAXVIT":1,"MAXDEX":10,"MAXAGI":4,"MAXINT":2,"MAXMND":0,"MAXAI":4,"MAXMI":-2},"ID8c4":{"Id":"ID8c4","Name":"忍者","FlavorText":"その忍術をアバロンの地下で宝探しに費やしている勿体ない存在。彼女らが何故シーフまがいの行為に走ったのかは定かでない。","Series":"RS2","Gender":"女","Hp":59,"DotId":"ID36c90","Holders":["ID36c9b","ID36c9c","ID36c9d","ID36c9e"],"STR":6,"VIT":4,"DEX":7,"AGI":10,"INT":5,"MND":3,"AI":5,"MI":6,"WeaponType":"体術","MAXSTR":5,"MAXVIT":3,"MAXDEX":1,"MAXAGI":7,"MAXINT":2,"MAXMND":-1,"MAXAI":-1,"MAXMI":6},"ID8e2":{"Id":"ID8e2","Name":"トーマ","FlavorText":"カンバーランドのハロルド王の末子。長兄のゲオルグ、次姉のソフィアと仲の良い兄弟だが、王位を巡る陰謀に巻き込まれ、彼の運命は激変する。その命運はバレンヌ帝国皇帝の手に委ねられた。","Series":"RS2","Gender":"男","Hp":62,"DotId":"ID37848","Holders":["ID37849"],"STR":6,"VIT":4,"DEX":8,"AGI":8,"INT":6,"MND":4,"AI":4,"MI":5,"WeaponType":"弓","MAXSTR":-99,"MAXVIT":-2,"MAXDEX":7,"MAXAGI":7,"MAXINT":2,"MAXMND":2,"MAXAI":-99,"MAXMI":1},"ID8e9":{"Id":"ID8e9","Name":"ヴァンパイアレディ","FlavorText":"吸血鬼に性別があるのかどうか分からない。人間の女が吸血鬼化したものか、それとも最初から女性形吸血鬼として生成されたのか。いずれにしろ、その姿を最大限利用した捕食行動を行う。","Series":"RS2","Gender":"女","Hp":65,"DotId":"ID37b04","Holders":["ID37b05","ID37b06"],"STR":6,"VIT":4,"DEX":7,"AGI":7,"INT":7,"MND":5,"AI":4,"MI":6,"WeaponType":"剣","MAXSTR":4,"MAXVIT":0,"MAXDEX":1,"MAXAGI":4,"MAXINT":3,"MAXMND":0,"MAXAI":0,"MAXMI":7},"ID8ea":{"Id":"ID8ea","Name":"セフィラス","FlavorText":"風の精霊の最上位の存在。その姿から、聖なる使者と誤認されることも多い。自らの罪に恐れおののく者にとって、その姿を目にするだけで悔い改める効果があるようだ。","Series":"RS2","Gender":"女","Hp":74,"DotId":"ID37b68","Holders":["ID37b69","ID37b6a"],"STR":6,"VIT":6,"DEX":6,"AGI":8,"INT":6,"MND":4,"AI":4,"MI":6,"WeaponType":"剣","MAXSTR":5,"MAXVIT":9,"MAXDEX":2,"MAXAGI":2,"MAXINT":-1,"MAXMND":-5,"MAXAI":-1,"MAXMI":0},"ID8f4":{"Id":"ID8f4","Name":"ノエル","FlavorText":"七英雄一の実力者。リーダーワグナスの補佐役に徹している。吸収の法を産み出し、七英雄を産み出した存在。自分に厳しい男だが、その目的は分かっていない。","Series":"RS2","Gender":"男","Hp":83,"DotId":"ID37f50","Holders":["ID37f51","ID37f52"],"STR":9,"VIT":7,"DEX":7,"AGI":3,"INT":5,"MND":4,"AI":3,"MI":5,"WeaponType":"大剣","MAXSTR":8,"MAXVIT":5,"MAXDEX":2,"MAXAGI":1,"MAXINT":-1,"MAXMND":0,"MAXAI":0,"MAXMI":1},"ID8f5":{"Id":"ID8f5","Name":"ロックブーケ","FlavorText":"七英雄の一人。ノエルの実の妹だった。七英雄唯一の女性といわれるが、吸収を繰り返した七英雄において性別は意味を持たない。ワグナスに気に入られる美を求めて吸収を繰り返している。","Series":"RS2","Gender":"女","Hp":60,"DotId":"ID37fb4","Holders":["ID37fb5","ID37fb6","ID37fb7"],"STR":4,"VIT":3,"DEX":6,"AGI":7,"INT":9,"MND":6,"AI":6,"MI":6,"WeaponType":"杖","MAXSTR":-2,"MAXVIT":1,"MAXDEX":1,"MAXAGI":2,"MAXINT":8,"MAXMND":3,"MAXAI":2,"MAXMI":2},"ID8f6":{"Id":"ID8f6","Name":"スービエ","FlavorText":"七英雄の一人。ワグナスのいとこ。人間であった時も海を愛する男だったが、七英雄となり魔物と化しても、海への愛着は変わらなかった。","Series":"RS2","Gender":"男","Hp":93,"DotId":"ID38018","Holders":["ID38019"],"STR":7,"VIT":8,"DEX":6,"AGI":5,"INT":3,"MND":6,"AI":3,"MI":6,"WeaponType":"槍","MAXSTR":4,"MAXVIT":7,"MAXDEX":3,"MAXAGI":0,"MAXINT":-1,"MAXMND":-3,"MAXAI":0,"MAXMI":0},"ID8f7":{"Id":"ID8f7","Name":"ダンターグ","FlavorText":"七英雄の一人。人間の頃からパワー系の肉体派だった。吸収の法でパワー系の魔物や敵を吸収し続けたため、その姿は巨大な魔物そのものと化してしまった。","Series":"RS2","Gender":"男","Hp":89,"DotId":"ID3807c","Holders":["ID3807d","ID3807e"],"STR":9,"VIT":8,"DEX":5,"AGI":4,"INT":3,"MND":4,"AI":4,"MI":6,"WeaponType":"体術","MAXSTR":7,"MAXVIT":5,"MAXDEX":2,"MAXAGI":4,"MAXINT":-3,"MAXMND":-1,"MAXAI":1,"MAXMI":0},"ID8f8":{"Id":"ID8f8","Name":"ボクオーン","FlavorText":"七英雄の一人。人間の頃から策を以て戦うのを信条としていた。七英雄となってからは、敵を操ることを快感とするように変わっていった。","Series":"RS2","Gender":"男","Hp":75,"DotId":"ID380e0","Holders":["ID380e1","ID380e2"],"STR":7,"VIT":6,"DEX":7,"AGI":5,"INT":6,"MND":4,"AI":4,"MI":4,"WeaponType":"棍棒","MAXSTR":6,"MAXVIT":4,"MAXDEX":2,"MAXAGI":2,"MAXINT":1,"MAXMND":-1,"MAXAI":-1,"MAXMI":0},"ID8fd":{"Id":"ID8fd","Name":"ユリアン","FlavorText":"サラと少年を世界の再生へと導いた英雄達の一人。サラ、エレンの姉妹とはシノン村の幼馴染。破壊するものとの戦いの後、貴族に列し、モニカを伴侶にしたという話もある。","Series":"RS3","Gender":"男","Hp":69,"DotId":"ID382d4","Holders":["ID382d5","ID382d6","ID382d7","ID382d8"],"STR":7,"VIT":5,"DEX":6,"AGI":5,"INT":6,"MND":4,"AI":5,"MI":6,"WeaponType":"剣","MAXSTR":4,"MAXVIT":3,"MAXDEX":2,"MAXAGI":11,"MAXINT":3,"MAXMND":1,"MAXAI":5,"MAXMI":1},"ID8fe":{"Id":"ID8fe","Name":"トーマス","FlavorText":"サラと少年を世界の再生へと導いた英雄達の一人。サラ、エレンの姉妹とはシノン村の幼馴染。破壊するものとの戦いの後、東方との交易で成功し、見捨てられた地の開発に乗り出した。","Series":"RS3","Gender":"男","Hp":80,"DotId":"ID38338","Holders":["ID38339","ID3833a"],"STR":6,"VIT":6,"DEX":5,"AGI":4,"INT":7,"MND":6,"AI":4,"MI":5,"WeaponType":"槍","MAXSTR":7,"MAXVIT":3,"MAXDEX":1,"MAXAGI":1,"MAXINT":2,"MAXMND":1,"MAXAI":1,"MAXMI":0},"ID8ff":{"Id":"ID8ff","Name":"ミカエル","FlavorText":"サラと少年を世界の再生へと導いた英雄達の一人で、ロアーヌ侯。破壊するものとの戦いの後、カタリナを妻に迎え、ロアーヌ侯国を繁栄へと導いた。","Series":"RS3","Gender":"男","Hp":69,"DotId":"ID3839c","Holders":["ID3839d","ID3839e","ID383a1"],"STR":4,"VIT":5,"DEX":7,"AGI":7,"INT":7,"MND":5,"AI":4,"MI":5,"WeaponType":"小剣","MAXSTR":-3,"MAXVIT":0,"MAXDEX":8,"MAXAGI":4,"MAXINT":2,"MAXMND":3,"MAXAI":0,"MAXMI":7},"ID902":{"Id":"ID902","Name":"エレン","FlavorText":"サラと少年を世界の再生へと導いた英雄達の一人で、サラの実の姉。死食に運命を弄ばれた妹を、命を懸けて護り抜いた。ユリアン、トーマスとはシノン村の幼馴染。","Series":"RS3","Gender":"女","Hp":75,"DotId":"ID384c8","Holders":["ID384c9","ID384ca","ID384cb"],"STR":7,"VIT":6,"DEX":7,"AGI":6,"INT":5,"MND":4,"AI":5,"MI":4,"WeaponType":"斧","MAXSTR":6,"MAXVIT":4,"MAXDEX":3,"MAXAGI":6,"MAXINT":0,"MAXMND":0,"MAXAI":1,"MAXMI":0},"ID903":{"Id":"ID903","Name":"モニカ","FlavorText":"サラと少年を世界の再生へと導いた英雄達の一人で、ロアーヌ侯ミカエルの妹。破壊するものとの戦いの後の後半生に関しては、驚くほど記録が残っていない。","Series":"RS3","Gender":"女","Hp":62,"DotId":"ID3852c","Holders":["ID3852d","ID3852e","ID3852f"],"STR":3,"VIT":4,"DEX":8,"AGI":8,"INT":5,"MND":5,"AI":6,"MI":7,"WeaponType":"小剣","MAXSTR":0,"MAXVIT":3,"MAXDEX":7,"MAXAGI":7,"MAXINT":1,"MAXMND":1,"MAXAI":0,"MAXMI":0},"ID904":{"Id":"ID904","Name":"カタリナ","FlavorText":"サラと少年を世界の再生へと導いた英雄達の一人で、ロアーヌ侯ミカエルの家臣でモニカの護衛士。破壊するものとの戦い後、ミカエルと結婚し、ロアーヌ侯家を繁栄に導いた。","Series":"RS3","Gender":"女","Hp":70,"DotId":"ID38590","Holders":["ID38591","ID38592","ID38593"],"STR":8,"VIT":5,"DEX":7,"AGI":6,"INT":6,"MND":4,"AI":4,"MI":6,"WeaponType":"大剣","MAXSTR":7,"MAXVIT":2,"MAXDEX":3,"MAXAGI":1,"MAXINT":2,"MAXMND":-1,"MAXAI":0,"MAXMI":0},"ID907":{"Id":"ID907","Name":"タチアナ","FlavorText":"ラザイエフ家の令嬢は、世界中で培った人脈を生かして、世界一の財閥にのし上がった。齢１００歳を越えても、くまちゃんを大事に抱えていたらしい。","Series":"RS3","Gender":"女","Hp":79,"DotId":"ID386bc","Holders":["ID386bd","ID386be","ID386bf"],"STR":8,"VIT":6,"DEX":7,"AGI":5,"INT":4,"MND":5,"AI":5,"MI":5,"WeaponType":"棍棒","MAXSTR":14,"MAXVIT":5,"MAXDEX":2,"MAXAGI":2,"MAXINT":-2,"MAXMND":-1,"MAXAI":1,"MAXMI":1},"ID909":{"Id":"ID909","Name":"ミューズ","FlavorText":"気高い心を持つ娘は、銀の手との相剋に苦しむシャールを明るく励まし、支え続けた。","Series":"RS3","Gender":"女","Hp":60,"DotId":"ID38784","Holders":["ID38785"],"STR":4,"VIT":3,"DEX":6,"AGI":7,"INT":8,"MND":6,"AI":8,"MI":6,"WeaponType":"杖","MAXSTR":-2,"MAXVIT":-7,"MAXDEX":1,"MAXAGI":0,"MAXINT":4,"MAXMND":9,"MAXAI":4,"MAXMI":2},"ID90a":{"Id":"ID90a","Name":"シャール","FlavorText":"サラと少年を世界の再生へと導いた英雄達の一人。ミューズと結ばれ幸せに暮らしていたが、銀の手の勝手な行動に悩まされ続けた。","Series":"RS3","Gender":"男","Hp":84,"DotId":"ID387e8","Holders":["ID387e9","ID387ea"],"STR":7,"VIT":7,"DEX":6,"AGI":2,"INT":6,"MND":5,"AI":4,"MI":6,"WeaponType":"槍","MAXSTR":5,"MAXVIT":1,"MAXDEX":1,"MAXAGI":3,"MAXINT":5,"MAXMND":-2,"MAXAI":-1,"MAXMI":0},"ID90b":{"Id":"ID90b","Name":"ノーラ","FlavorText":"ピドナの武器工房は、世界再生の後、普通の鍛冶屋に姿を変え、人々の生活の為の日用品を作り続けた。","Series":"RS3","Gender":"女","Hp":71,"DotId":"ID3884c","Holders":["ID3884d","ID3884e"],"STR":6,"VIT":5,"DEX":8,"AGI":5,"INT":6,"MND":5,"AI":5,"MI":5,"WeaponType":"棍棒","MAXSTR":9,"MAXVIT":5,"MAXDEX":1,"MAXAGI":5,"MAXINT":2,"MAXMND":0,"MAXAI":0,"MAXMI":-2},"ID90d":{"Id":"ID90d","Name":"ロビン","FlavorText":"世界が再生を果たしても、ヤーマスの悪が消え去るわけではなかった。怪傑ロビンの活躍は今も続いている。","Series":"RS3","Gender":"男","Hp":74,"DotId":"ID38914","Holders":["ID38915","ID38916"],"STR":6,"VIT":6,"DEX":8,"AGI":7,"INT":5,"MND":4,"AI":3,"MI":4,"WeaponType":"小剣","MAXSTR":-1,"MAXVIT":3,"MAXDEX":10,"MAXAGI":7,"MAXINT":1,"MAXMND":1,"MAXAI":0,"MAXMI":0},"ID90e":{"Id":"ID90e","Name":"ロビン(偽)","FlavorText":"怪傑ロビンの活躍が続く限り、偽ロビンの活躍も続くのだった。","Series":"RS3","Gender":"男","Hp":81,"DotId":"ID38978","Holders":["ID38979"],"STR":4,"VIT":7,"DEX":7,"AGI":8,"INT":4,"MND":5,"AI":3,"MI":6,"WeaponType":"小剣","MAXSTR":1,"MAXVIT":-4,"MAXDEX":5,"MAXAGI":11,"MAXINT":-2,"MAXMND":-1,"MAXAI":-1,"MAXMI":-1},"ID90f":{"Id":"ID90f","Name":"ウォード","FlavorText":"破壊するものとの戦いの後、遠縁のミカエルを頼ってロアーヌへ移り、東方の開拓に身を投じたという。","Series":"RS3","Gender":"男","Hp":91,"DotId":"ID389dc","Holders":["ID389dd"],"STR":8,"VIT":8,"DEX":7,"AGI":3,"INT":5,"MND":5,"AI":3,"MI":4,"WeaponType":"大剣","MAXSTR":3,"MAXVIT":2,"MAXDEX":5,"MAXAGI":-1,"MAXINT":-1,"MAXMND":0,"MAXAI":6,"MAXMI":-5},"ID911":{"Id":"ID911","Name":"ブラック","FlavorText":"サラと少年を世界の再生へと導いた英雄達の一人。海賊稼業に戻り、世界の海を荒らしまわった。後に、ベント家・フルブライト家の連合艦隊に敗れ、行方不明になった。","Series":"RS3","Gender":"男","Hp":87,"DotId":"ID38aa4","Holders":["ID38aa5","ID38ad7"],"STR":7,"VIT":7,"DEX":7,"AGI":4,"INT":5,"MND":6,"AI":3,"MI":4,"WeaponType":"斧","MAXSTR":6,"MAXVIT":2,"MAXDEX":2,"MAXAGI":3,"MAXINT":1,"MAXMND":1,"MAXAI":4,"MAXMI":1},"ID913":{"Id":"ID913","Name":"ツィー・リン","FlavorText":"世界が再生しても、東方の混乱は収まらなかった。彼女は常に弱い者の味方として振る舞った。","Series":"RS3","Gender":"女","Hp":70,"DotId":"ID38b6c","Holders":["ID38b6d"],"STR":5,"VIT":5,"DEX":7,"AGI":7,"INT":7,"MND":5,"AI":5,"MI":6,"WeaponType":"弓","MAXSTR":-5,"MAXVIT":1,"MAXDEX":8,"MAXAGI":0,"MAXINT":1,"MAXMND":2,"MAXAI":2,"MAXMI":1},"ID918":{"Id":"ID918","Name":"ぞう","FlavorText":"世界が再生しても、ぞうはぞうのままだった。ラシュクータは東方とロアーヌを繋ぐ中継地点として栄えることとなった。","Series":"RS3","Gender":"男","Hp":89,"DotId":"ID38d60","Holders":["ID38d61"],"STR":6,"VIT":7,"DEX":7,"AGI":6,"INT":3,"MND":7,"AI":4,"MI":4,"WeaponType":"棍棒","MAXSTR":6,"MAXVIT":10,"MAXDEX":1,"MAXAGI":0,"MAXINT":-2,"MAXMND":-7,"MAXAI":1,"MAXMI":0},"ID919":{"Id":"ID919","Name":"ゆきだるま","FlavorText":"世界再生の後も、ゆきだるまの町は存在しているらしい。永久氷晶が再生しない限り、彼らが外の世界へ足を踏み出す日は訪れないのだが…。","Series":"RS3","Gender":"不明","Hp":93,"DotId":"ID38dc4","Holders":["ID38dc5","ID38dc6"],"STR":7,"VIT":8,"DEX":6,"AGI":5,"INT":4,"MND":6,"AI":4,"MI":3,"WeaponType":"棍棒","MAXSTR":4,"MAXVIT":6,"MAXDEX":2,"MAXAGI":0,"MAXINT":-2,"MAXMND":3,"MAXAI":1,"MAXMI":4},"ID91a":{"Id":"ID91a","Name":"ウンディーネ","FlavorText":"水術士の誇りに懸けてボルカノに敗れるわけにはいかなかった。だが、その勝利は彼女にとって虚しいものだったようだ。それ故、世界の再生は、彼女の生き方も変えることになった。","Series":"RS3","Gender":"女","Hp":59,"DotId":"ID38e28","Holders":["ID38e29","ID38e2a","ID38e2b"],"STR":3,"VIT":3,"DEX":6,"AGI":7,"INT":9,"MND":6,"AI":7,"MI":6,"WeaponType":"杖","MAXSTR":-3,"MAXVIT":0,"MAXDEX":2,"MAXAGI":2,"MAXINT":11,"MAXMND":5,"MAXAI":6,"MAXMI":2},"ID91c":{"Id":"ID91c","Name":"レオニード","FlavorText":"三度の死食を見届けた吸血鬼は、今もポドールイの伯爵として統治を続けている。四度死食を見ることになっても驚かないと話しているらしい。","Series":"RS3","Gender":"男","Hp":69,"DotId":"ID38ef0","Holders":["ID38ef1","ID38ef2","ID38ef4"],"STR":7,"VIT":5,"DEX":6,"AGI":7,"INT":6,"MND":4,"AI":4,"MI":5,"WeaponType":"体術","MAXSTR":2,"MAXVIT":0,"MAXDEX":4,"MAXAGI":4,"MAXINT":2,"MAXMND":0,"MAXAI":1,"MAXMI":7},"ID925":{"Id":"ID925","Name":"教授","FlavorText":"世界再生の余波で彼女の研究はうまくいかなくなってしまった。仕方なく、ピドナの大学で教鞭を執って余生を過ごした。","Series":"RS3","Gender":"女","Hp":73,"DotId":"ID39274","Holders":["ID39276","ID39275"],"STR":5,"VIT":6,"DEX":8,"AGI":5,"INT":7,"MND":4,"AI":3,"MI":5,"WeaponType":"銃","MAXSTR":-1,"MAXVIT":0,"MAXDEX":7,"MAXAGI":5,"MAXINT":3,"MAXMND":0,"MAXAI":-1,"MAXMI":1},"ID926":{"Id":"ID926","Name":"ボルカノ","FlavorText":"ウンディーネとの火術士の誇りを懸けた戦いは敗北に終わったが、世界再生と共に復活したと言われている。それは、ある水術士の強い願望によるものだったという話だ。","Series":"RS3","Gender":"男","Hp":82,"DotId":"ID392d8","Holders":["ID392d9","ID392da","ID392db"],"STR":5,"VIT":6,"DEX":5,"AGI":3,"INT":7,"MND":7,"AI":5,"MI":6,"WeaponType":"杖","MAXSTR":-6,"MAXVIT":1,"MAXDEX":1,"MAXAGI":4,"MAXINT":11,"MAXMND":3,"MAXAI":5,"MAXMI":1},"ID94b":{"Id":"ID94b","Name":"キドラントの町長","FlavorText":"ツヴァイクの遥か北にあるキドラントの町の町長。悪人だという人も多い。物覚えは悪いようだ。","Series":"RS3","Gender":"男","Hp":85,"DotId":"ID3a14c","Holders":["ID3a14d"],"STR":5,"VIT":6,"DEX":7,"AGI":6,"INT":6,"MND":8,"AI":1,"MI":1,"WeaponType":"棍棒","MAXSTR":0,"MAXVIT":-4,"MAXDEX":1,"MAXAGI":0,"MAXINT":0,"MAXMND":10,"MAXAI":-4,"MAXMI":-4},"ID94d":{"Id":"ID94d","Name":"アスラ","FlavorText":"アビスで道場を営んだりはしていない。何度も英雄たちに倒される運命が待ち受けているなどと、予想することは出来なかったであろう。","Series":"RS3","Gender":"男","Hp":96,"DotId":"ID3a214","Holders":["ID3a215"],"STR":7,"VIT":9,"DEX":5,"AGI":4,"INT":3,"MND":5,"AI":4,"MI":6,"WeaponType":"体術","MAXSTR":6,"MAXVIT":3,"MAXDEX":1,"MAXAGI":2,"MAXINT":-2,"MAXMND":-3,"MAXAI":-5,"MAXMI":7},"IDc1d":{"Id":"IDc1d","Name":"ブルー","FlavorText":"マジックキングダムの双子の魔術士。双子の片割れルージュを殺すという使命を与えられている。","Series":"SF1","Gender":"男","Hp":69,"DotId":"ID4bb54","Holders":["ID4bb55","ID4bb56"],"STR":4,"VIT":4,"DEX":6,"AGI":5,"INT":9,"MND":7,"AI":5,"MI":4,"WeaponType":"杖","MAXSTR":-3,"MAXVIT":-2,"MAXDEX":1,"MAXAGI":1,"MAXINT":6,"MAXMND":9,"MAXAI":5,"MAXMI":1},"IDc1e":{"Id":"IDc1e","Name":"クーン","FlavorText":"モンスターのリージョン・マーグメルの住人。死にゆく故郷を救うために願いを叶える指輪を集める旅に出る。","Series":"SF1","Gender":"不明","Hp":65,"DotId":"ID4bbb8","Holders":["ID4bbb9","ID4bbba"],"STR":6,"VIT":4,"DEX":8,"AGI":8,"INT":5,"MND":5,"AI":4,"MI":5,"WeaponType":"体術","MAXSTR":3,"MAXVIT":1,"MAXDEX":3,"MAXAGI":6,"MAXINT":2,"MAXMND":-1,"MAXAI":-4,"MAXMI":6},"IDc20":{"Id":"IDc20","Name":"レッド","FlavorText":"ロボット工学の権威小此木博士の息子。悪の組織ブラッククロスに殺されかけるが、正義のヒーロー「アルカイザー」として蘇った。","Series":"SF1","Gender":"男","Hp":75,"DotId":"ID4bc80","Holders":["ID4bc81","ID4bc82","ID4bc83"],"STR":7,"VIT":6,"DEX":6,"AGI":5,"INT":6,"MND":4,"AI":4,"MI":5,"WeaponType":"体術","MAXSTR":5,"MAXVIT":2,"MAXDEX":0,"MAXAGI":3,"MAXINT":2,"MAXMND":4,"MAXAI":1,"MAXMI":1},"IDc22":{"Id":"IDc22","Name":"アセルス","FlavorText":"普通の女の子だったのが、妖魔の王オルロワージュの青い血を与えられたことで、紫の血の半妖になってしまった。","Series":"SF1","Gender":"女","Hp":59,"DotId":"ID4bd48","Holders":["ID4bd4a","ID4bd49","ID4bd4b"],"STR":6,"VIT":4,"DEX":7,"AGI":8,"INT":8,"MND":3,"AI":4,"MI":6,"WeaponType":"剣","MAXSTR":8,"MAXVIT":7,"MAXDEX":3,"MAXAGI":6,"MAXINT":4,"MAXMND":0,"MAXAI":-1,"MAXMI":2},"IDc2e":{"Id":"IDc2e","Name":"アニー","FlavorText":"謎の組織グラディウスのメンバー。まだ幼い弟と妹の為に働いている。面倒見のいいお姉ちゃん。ライザと共にエミリアを永久監獄から脱獄させる。","Series":"SF1","Gender":"女","Hp":65,"DotId":"ID4c1f8","Holders":["ID4c1f9","ID4c1fa"],"STR":6,"VIT":4,"DEX":7,"AGI":7,"INT":6,"MND":5,"AI":6,"MI":6,"WeaponType":"剣","MAXSTR":6,"MAXVIT":3,"MAXDEX":1,"MAXAGI":4,"MAXINT":1,"MAXMND":0,"MAXAI":2,"MAXMI":-1},"IDc2f":{"Id":"IDc2f","Name":"ライザ","FlavorText":"謎の組織グラディウスのメンバー。グラディウスのリーダーであるルーファスの秘書役。アニーと共にエミリアを永久監獄から脱獄させる。","Series":"SF1","Gender":"女","Hp":66,"DotId":"ID4c25c","Holders":["ID4c25d","ID4c25e"],"STR":7,"VIT":5,"DEX":7,"AGI":8,"INT":5,"MND":3,"AI":5,"MI":5,"WeaponType":"体術","MAXSTR":8,"MAXVIT":2,"MAXDEX":2,"MAXAGI":7,"MAXINT":-2,"MAXMND":-1,"MAXAI":1,"MAXMI":-2},"IDc33":{"Id":"IDc33","Name":"ルージュ","FlavorText":"マジックキングダムの双子の魔術士。双子の片割れブルーを殺すという使命を与えられている。","Series":"SF1","Gender":"男","Hp":66,"DotId":"ID4c3ec","Holders":["ID4c3ed","ID4c3ee","ID4c3ef"],"STR":4,"VIT":4,"DEX":6,"AGI":6,"INT":8,"MND":6,"AI":6,"MI":5,"WeaponType":"杖","MAXSTR":-2,"MAXVIT":1,"MAXDEX":1,"MAXAGI":2,"MAXINT":9,"MAXMND":4,"MAXAI":2,"MAXMI":5},"IDc34":{"Id":"IDc34","Name":"ゲン","FlavorText":"侍のリージョン・ワカツ出身の剣豪。ワカツがトリニティの手により滅ぼされてから、リージョン・ボロで飲んだくれの生活を送っている。","Series":"SF1","Gender":"男","Hp":99,"DotId":"ID4c450","Holders":["ID4c451","ID4c452"],"STR":7,"VIT":9,"DEX":6,"AGI":2,"INT":4,"MND":6,"AI":3,"MI":6,"WeaponType":"大剣","MAXSTR":8,"MAXVIT":3,"MAXDEX":2,"MAXAGI":2,"MAXINT":-1,"MAXMND":1,"MAXAI":3,"MAXMI":1},"IDc3d":{"Id":"IDc3d","Name":"白薔薇姫","FlavorText":"アセルスの教育係として付けられた、妖魔の王オルロワージュの寵姫。アセルスの真の理解者として、心を重ねていく。","Series":"SF1","Gender":"女","Hp":62,"DotId":"ID4c7d4","Holders":["ID4c7d6","ID4c7d5"],"STR":3,"VIT":3,"DEX":6,"AGI":5,"INT":7,"MND":7,"AI":10,"MI":7,"WeaponType":"杖","MAXSTR":-2,"MAXVIT":-1,"MAXDEX":1,"MAXAGI":0,"MAXINT":8,"MAXMND":4,"MAXAI":5,"MAXMI":1},"IDc81":{"Id":"IDc81","Name":"ギュスターヴ","FlavorText":"史上最も有名なギュスターヴ。フィニー王としては１３世。鋼のギュスターヴとも。生まれながらに術が使えず、鋼を武器として使う時代を切り開いた。","Series":"SF2","Gender":"男","Hp":83,"DotId":"ID4e264","Holders":["ID4e265","ID4e266"],"STR":9,"VIT":7,"DEX":7,"AGI":3,"INT":5,"MND":4,"AI":3,"MI":5,"WeaponType":"大剣","MAXSTR":8,"MAXVIT":3,"MAXDEX":3,"MAXAGI":1,"MAXINT":-2,"MAXMND":-1,"MAXAI":1,"MAXMI":0},"IDc82":{"Id":"IDc82","Name":"ウィル","FlavorText":"魔法を媒介する道具クヴェルを探すディガー。大物のクヴェルを何度も掘り当て、タイクーン・ウィルとして知られる。謎のクヴェル「エッグ」を探している。","Series":"SF2","Gender":"男","Hp":74,"DotId":"ID4e2c9","Holders":["ID4e2c9","ID4e2ca"],"STR":6,"VIT":6,"DEX":7,"AGI":5,"INT":6,"MND":4,"AI":5,"MI":4,"WeaponType":"棍棒","MAXSTR":8,"MAXVIT":4,"MAXDEX":1,"MAXAGI":2,"MAXINT":2,"MAXMND":-1,"MAXAI":-1,"MAXMI":0},"IDc83":{"Id":"IDc83","Name":"リッチ","FlavorText":"リチャード・ナイツ。ウィル・ナイツの息子。偉大な父の名を嫌い、早々に家を飛び出した。金持ちになったことはなかったが、女性には妙にモテたらしい。","Series":"SF2","Gender":"男","Hp":65,"DotId":"ID4e32c","Holders":["ID4e32d","ID4e32e"],"STR":6,"VIT":5,"DEX":7,"AGI":7,"INT":7,"MND":3,"AI":4,"MI":5,"WeaponType":"剣","MAXSTR":3,"MAXVIT":3,"MAXDEX":1,"MAXAGI":4,"MAXINT":3,"MAXMND":-1,"MAXAI":4,"MAXMI":1},"IDc84":{"Id":"IDc84","Name":"ジニー","FlavorText":"ヴァージニア・ナイツ。ウィル・ナイツの孫娘。","Series":"SF2","Gender":"女","Hp":70,"DotId":"ID4e390","Holders":["ID4e391","ID4e392","ID4e393"],"STR":8,"VIT":5,"DEX":7,"AGI":5,"INT":7,"MND":4,"AI":5,"MI":5,"WeaponType":"棍棒","MAXSTR":8,"MAXVIT":1,"MAXDEX":1,"MAXAGI":1,"MAXINT":1,"MAXMND":-1,"MAXAI":1,"MAXMI":1},"IDc90":{"Id":"IDc90","Name":"ヨハン","FlavorText":"暗殺集団紅いサソリのメンバーだったが、脱走。ギュスターヴに拾われ身辺警護の任に就いた。","Series":"SF2","Gender":"男","Hp":66,"DotId":"ID4e840","Holders":["ID4e841","ID4e842"],"STR":7,"VIT":5,"DEX":7,"AGI":9,"INT":4,"MND":3,"AI":4,"MI":5,"WeaponType":"体術","MAXSTR":6,"MAXVIT":-1,"MAXDEX":3,"MAXAGI":9,"MAXINT":0,"MAXMND":0,"MAXAI":1,"MAXMI":3},"IDc95":{"Id":"IDc95","Name":"コーデリア","FlavorText":"ディガーを護るヴィジランツ。若くして命を落としたという話と、ウィル・ナイツの妻となり、リチャードを産んだという話が残っている。","Series":"SF2","Gender":"女","Hp":69,"DotId":"ID4ea34","Holders":["ID4ea35","ID4ea36","ID4ea37"],"STR":7,"VIT":5,"DEX":7,"AGI":6,"INT":5,"MND":4,"AI":6,"MI":6,"WeaponType":"槍","MAXSTR":6,"MAXVIT":6,"MAXDEX":3,"MAXAGI":4,"MAXINT":-2,"MAXMND":-1,"MAXAI":1,"MAXMI":0},"ID1005":{"Id":"ID1005","Name":"ローラ","FlavorText":"元海賊。今は子供たちに読み書きや計算を教えている。亡国の王子アンリに出会い、再び危険に身を晒す日々に戻っていく。","Series":"US","Gender":"女","Hp":75,"DotId":"ID641f4","Holders":["ID641f5","ID641f6"],"STR":7,"VIT":6,"DEX":7,"AGI":6,"INT":5,"MND":4,"AI":5,"MI":6,"WeaponType":"槍","MAXSTR":8,"MAXVIT":9,"MAXDEX":3,"MAXAGI":1,"MAXINT":-2,"MAXMND":-6,"MAXAI":1,"MAXMI":1},"ID100f":{"Id":"ID100f","Name":"アンリ","FlavorText":"エスカータ王国の王子。国が亡び、ただ一人脱出した。気弱な少年だが、ローラと出会い、国の為に強くなろうと日々努力している。","Series":"US","Gender":"男","Hp":70,"DotId":"ID645dc","Holders":["ID645dd","ID645de"],"STR":5,"VIT":5,"DEX":7,"AGI":7,"INT":7,"MND":5,"AI":3,"MI":5,"WeaponType":"小剣","MAXSTR":-3,"MAXVIT":-1,"MAXDEX":9,"MAXAGI":5,"MAXINT":3,"MAXMND":2,"MAXAI":3,"MAXMI":1},"ID17d5":{"Id":"ID17d5","Name":"ウルピナ","FlavorText":"四将軍家の一つ剣将軍ユラニウス家の娘。周りからは姫と呼ばれている。姫であるよりも、剣将軍家の一員として剣を振るうことを望んでいる。","Series":"SS","Gender":"女","Hp":66,"DotId":"ID94f34","Holders":["ID94f35","ID94f36"],"STR":7,"VIT":5,"DEX":8,"AGI":6,"INT":6,"MND":3,"AI":5,"MI":6,"WeaponType":"剣","MAXSTR":5,"MAXVIT":8,"MAXDEX":3,"MAXAGI":1,"MAXINT":1,"MAXMND":-2,"MAXAI":0,"MAXMI":0},"ID1bbd":{"Id":"ID1bbd","Name":"ポルカ・リン・ウッド","FlavorText":"元サーカスの曲芸師。妹のリズとパートナーを組み、空中ブランコで人気を博す。さらわれたリズを探すため塔士団に入る。","Series":"RSR","Gender":"男","Hp":69,"DotId":"IDad5d4","Holders":["IDad5d5","IDad5d7","IDad5d8"],"STR":7,"VIT":5,"DEX":8,"AGI":6,"INT":6,"MND":4,"AI":3,"MI":5,"WeaponType":"剣","MAXSTR":9,"MAXVIT":3,"MAXDEX":2,"MAXAGI":4,"MAXINT":3,"MAXMND":-2,"MAXAI":3,"MAXMI":1},"ID1bbe":{"Id":"ID1bbe","Name":"リズ・リン・ウッド","FlavorText":"元サーカスの曲芸師。兄のポルカとパートナーを組み、空中ブランコで人気を博す。だがある日、東の悪しき魔女にさらわれてしまう。後にポルカと異界の戦士らによって救出される。","Series":"RSR","Gender":"女","Hp":57,"DotId":"IDad638","Holders":["IDad639","IDad63a"],"STR":4,"VIT":3,"DEX":8,"AGI":8,"INT":7,"MND":5,"AI":6,"MI":6,"WeaponType":"弓","MAXSTR":-5,"MAXVIT":-1,"MAXDEX":5,"MAXAGI":1,"MAXINT":12,"MAXMND":4,"MAXAI":3,"MAXMI":2},"ID1bbf":{"Id":"ID1bbf","Name":"シン・ドゥ","FlavorText":"泥の国の天文寮に属す星読み。死食と失われた神話についてを知る師ジン・ダーハオの行方を追う。","Series":"RSR","Gender":"男","Hp":70,"DotId":"IDad69c","Holders":["IDad69d"],"STR":5,"VIT":4,"DEX":7,"AGI":5,"INT":7,"MND":7,"AI":5,"MI":5,"WeaponType":"杖","MAXSTR":-9,"MAXVIT":-2,"MAXDEX":0,"MAXAGI":1,"MAXINT":12,"MAXMND":4,"MAXAI":3,"MAXMI":1},"ID1bc0":{"Id":"ID1bc0","Name":"ヴァルドー","FlavorText":"絶滅危惧生物保護司官であり、塔士団の筆頭監督官。ロブスター族だが、体表の色は紫。","Series":"RSR","Gender":"男","Hp":96,"DotId":"IDad700","Holders":["IDad701","IDad702"],"STR":7,"VIT":9,"DEX":5,"AGI":4,"INT":3,"MND":5,"AI":4,"MI":6,"WeaponType":"体術","MAXSTR":9,"MAXVIT":12,"MAXDEX":1,"MAXAGI":2,"MAXINT":-2,"MAXMND":0,"MAXAI":2,"MAXMI":-2},"ID1bc1":{"Id":"ID1bc1","Name":"ようせい(ブラウニー)","FlavorText":"正式な塔士ではないが、ヴァルドーに命を救われて以来、彼の従者的存在に。ポルカにセンパイ風を吹かす。","Series":"RSR","Gender":"不明","Hp":71,"DotId":"IDad764","Holders":["IDad765","IDad767"],"STR":6,"VIT":4,"DEX":8,"AGI":6,"INT":5,"MND":7,"AI":4,"MI":5,"WeaponType":"槍","MAXSTR":3,"MAXVIT":3,"MAXDEX":2,"MAXAGI":7,"MAXINT":2,"MAXMND":0,"MAXAI":1,"MAXMI":0},"ID1bc3":{"Id":"ID1bc3","Name":"マドレーン","FlavorText":"ハリードが再興したゲッシア朝ナジュ王国の女剣士。真神王教団の襲撃により都を追われ、生き残った者たちを統率する。","Series":"RSR","Gender":"女","Hp":69,"DotId":"IDad82c","Holders":["IDad82d"],"STR":7,"VIT":5,"DEX":6,"AGI":9,"INT":5,"MND":4,"AI":4,"MI":5,"WeaponType":"剣","MAXSTR":7,"MAXVIT":-4,"MAXDEX":1,"MAXAGI":9,"MAXINT":-1,"MAXMND":-3,"MAXAI":0,"MAXMI":0},"IDc8d":{"Id":"IDc8d","Name":"フリン","FlavorText":"生まれつき術の力が弱く、いじめられていた。同じ境遇であるギュスターヴと出会い、最期まで彼に付き従うことになる。","Series":"SF2","Gender":"男","Hp":67,"DotId":"ID4e714","Holders":["ID4e715"],"STR":5,"VIT":5,"DEX":7,"AGI":9,"INT":5,"MND":4,"AI":4,"MI":5,"WeaponType":"小剣","MAXSTR":0,"MAXVIT":-3,"MAXDEX":5,"MAXAGI":10,"MAXINT":1,"MAXMND":0,"MAXAI":1,"MAXMI":-2},"ID8f9":{"Id":"ID8f9","Name":"クジンシー","FlavorText":"七英雄の一人。長く最弱の英雄と呼ばれていたが、ソウルスティールを身につけてからは、七英雄最強を自認している。","Series":"RS2","Gender":"男","Hp":76,"DotId":"ID38144","Holders":["ID38145","ID38146"],"STR":8,"VIT":6,"DEX":6,"AGI":6,"INT":6,"MND":4,"AI":3,"MI":4,"WeaponType":"剣","MAXSTR":8,"MAXVIT":3,"MAXDEX":2,"MAXAGI":3,"MAXINT":-1,"MAXMND":-1,"MAXAI":-1,"MAXMI":0},"ID84a":{"Id":"ID84a","Name":"ブッチャー","FlavorText":"海賊。ホークのライバル。汚い手も平気で使い、仲間を帝国に売るなど海賊の間でも受けは悪い。それでも海賊が続けられるのは、海の上での能力が圧倒的だからだ。","Series":"RS1","Gender":"男","Hp":90,"DotId":"ID33ce8","Holders":["ID33ce9"],"STR":7,"VIT":8,"DEX":6,"AGI":2,"INT":5,"MND":5,"AI":4,"MI":5,"WeaponType":"斧","MAXSTR":-99,"MAXVIT":-99,"MAXDEX":-99,"MAXAGI":-99,"MAXINT":-99,"MAXMND":-99,"MAXAI":-99,"MAXMI":-99},"ID13ee":{"Id":"ID13ee","Name":"セルマ","FlavorText":"白銀の皇帝の娘。育ての親は海賊ブッチャーとその手下たち。母親は謎。","Series":"ES","Gender":"女","Hp":63,"DotId":"ID7c8f8","Holders":["ID7c8f9","ID7c8fb"],"STR":4,"VIT":4,"DEX":9,"AGI":9,"INT":5,"MND":5,"AI":4,"MI":6,"WeaponType":"小剣","MAXSTR":-2,"MAXVIT":-1,"MAXDEX":6,"MAXAGI":7,"MAXINT":0,"MAXMND":1,"MAXAI":0,"MAXMI":0},"ID8b2":{"Id":"ID8b2","Name":"デザートガード","FlavorText":"砂漠の国メルー出身者によって結成された親衛隊。砂漠独特の長剣を使う。","Series":"RS2","Gender":"男","Hp":96,"DotId":"ID36588","Holders":["ID36593"],"STR":7,"VIT":9,"DEX":5,"AGI":4,"INT":4,"MND":5,"AI":3,"MI":6,"WeaponType":"剣","MAXSTR":4,"MAXVIT":10,"MAXDEX":2,"MAXAGI":1,"MAXINT":0,"MAXMND":-7,"MAXAI":-1,"MAXMI":0},"ID900":{"Id":"ID900","Name":"ハリード","FlavorText":"サラと少年を世界の再生へと導いた英雄達の一人。ゲッシア朝の王族の生き残り。再生した世界でファティーマ姫と結ばれたとも、真のカムシーンを振るって自分の王国を立てたとも言われている。","Series":"RS3","Gender":"男","Hp":83,"DotId":"ID38400","Holders":["ID38401","ID38402","ID38403"],"STR":9,"VIT":7,"DEX":6,"AGI":6,"INT":5,"MND":4,"AI":3,"MI":5,"WeaponType":"剣","MAXSTR":7,"MAXVIT":4,"MAXDEX":2,"MAXAGI":8,"MAXINT":0,"MAXMND":-1,"MAXAI":0,"MAXMI":1},"ID89f":{"Id":"ID89f","Name":"セキシュウサイ","FlavorText":"ヤウダのアト王に使える武人。真剣白刃取りが得意技。ジュウベイの祖父。","Series":"RS2","Gender":"男","Hp":75,"DotId":"ID35e1c","Holders":["ID35e1d"],"STR":7,"VIT":6,"DEX":8,"AGI":3,"INT":7,"MND":4,"AI":3,"MI":5,"WeaponType":"大剣","MAXSTR":4,"MAXVIT":-5,"MAXDEX":2,"MAXAGI":7,"MAXINT":3,"MAXMND":-2,"MAXAI":-3,"MAXMI":-1},"ID8bf":{"Id":"ID8bf","Name":"サラマンダー","FlavorText":"コムルーン火山の麓に住む火蜥蜴の一族。火に強く、力も強い。","Series":"RS2","Gender":"不明","Hp":98,"DotId":"ID36a9c","Holders":["ID36aa7"],"STR":9,"VIT":9,"DEX":5,"AGI":2,"INT":3,"MND":5,"AI":4,"MI":5,"WeaponType":"斧","MAXSTR":7,"MAXVIT":6,"MAXDEX":0,"MAXAGI":1,"MAXINT":-6,"MAXMND":0,"MAXAI":1,"MAXMI":-2},"ID8f3":{"Id":"ID8f3","Name":"ワグナス","FlavorText":"七英雄のリーダー。七英雄に最強であることを求め、自らも七英雄の中で最強であろうと努めている。信義に厚い男だが、華麗な立ち居振る舞いが好みである。","Series":"RS2","Gender":"男","Hp":75,"DotId":"ID37eec","Holders":["ID37eed","ID37eee"],"STR":7,"VIT":5,"DEX":6,"AGI":4,"INT":7,"MND":6,"AI":4,"MI":4,"WeaponType":"槍","MAXSTR":4,"MAXVIT":0,"MAXDEX":3,"MAXAGI":10,"MAXINT":5,"MAXMND":2,"MAXAI":1,"MAXMI":1},"ID927":{"Id":"ID927","Name":"ファティーマ","FlavorText":"ゲッシア朝ナジュ王国の王女。神王教団によってゲッシア朝が滅ぼされた時、行方不明になった。諸王の都でその姿を見たというものもいたが、真偽のほどは定かでない。","Series":"RS3","Gender":"女","Hp":67,"DotId":"ID3933c","Holders":["ID3933d","ID3933e"],"STR":5,"VIT":5,"DEX":8,"AGI":9,"INT":5,"MND":4,"AI":3,"MI":5,"WeaponType":"小剣","MAXSTR":-2,"MAXVIT":4,"MAXDEX":7,"MAXAGI":6,"MAXINT":1,"MAXMND":0,"MAXAI":0,"MAXMI":-1},"IDc1f":{"Id":"IDc1f","Name":"T260G","FlavorText":"リージョン・ボロで掘り出された旧式メカ。その正体はリージョン間大戦の時代に作られた対最終兵器用メカニズム。ハード・ソフトの不具合で任務の内容を思い出せないでいる。","Series":"SF1","Gender":"不明","Hp":76,"DotId":"ID4bc1c","Holders":["ID4bc1d","ID4bc1e"],"STR":5,"VIT":5,"DEX":8,"AGI":7,"INT":6,"MND":7,"AI":3,"MI":4,"WeaponType":"銃","MAXSTR":0,"MAXVIT":8,"MAXDEX":4,"MAXAGI":3,"MAXINT":2,"MAXMND":-1,"MAXAI":-2,"MAXMI":0},"IDc21":{"Id":"IDc21","Name":"エミリア","FlavorText":"元トップモデル。婚約を機に引退するが、結婚を間近に控え、婚約者が何者かに殺されてしまった。その上、犯人として逮捕され、終身刑で永久監獄に送られてしまう。","Series":"SF1","Gender":"女","Hp":75,"DotId":"ID4bce4","Holders":["ID4bce5"],"STR":7,"VIT":6,"DEX":7,"AGI":5,"INT":7,"MND":4,"AI":4,"MI":5,"WeaponType":"銃","MAXSTR":1,"MAXVIT":2,"MAXDEX":6,"MAXAGI":1,"MAXINT":-3,"MAXMND":0,"MAXAI":1,"MAXMI":2},"IDc28":{"Id":"IDc28","Name":"レン","FlavorText":"リージョンで発生する様々な犯罪に対応するパトロール組織IRPOの腕利きイケメン隊員。恋人はトップモデルのエミリア。","Series":"SF1","Gender":"男","Hp":65,"DotId":"ID4bfa0","Holders":["ID4bfa1"],"STR":6,"VIT":5,"DEX":7,"AGI":7,"INT":7,"MND":3,"AI":4,"MI":5,"WeaponType":"体術","MAXSTR":4,"MAXVIT":-1,"MAXDEX":2,"MAXAGI":7,"MAXINT":2,"MAXMND":-1,"MAXAI":-3,"MAXMI":0},"IDc4b":{"Id":"IDc4b","Name":"特殊工作車","FlavorText":"精密な動きが出来る工作メカ。メカの修理・解体が可能。だが、この世界でその実力が発揮できるかは、分からない。","Series":"SF1","Gender":"不明","Hp":79,"DotId":"ID4cd4c","Holders":["ID4cd4d"],"STR":5,"VIT":6,"DEX":7,"AGI":5,"INT":7,"MND":6,"AI":3,"MI":5,"WeaponType":"銃","MAXSTR":-1,"MAXVIT":-4,"MAXDEX":5,"MAXAGI":8,"MAXINT":1,"MAXMND":0,"MAXAI":-1,"MAXMI":1},"ID917":{"Id":"ID917","Name":"ようせい","FlavorText":"世界が再生しても、ようせいが優しくなったりはしなかった。温海のジャングルに、珍しい動植物を求める人間達が入り込んでくると必ず、ようせいとトラブルになるのだった。","Series":"RS3","Gender":"不明","Hp":65,"DotId":"ID38cfc","Holders":["ID38cfd"],"STR":9,"VIT":3,"DEX":8,"AGI":7,"INT":3,"MND":6,"AI":4,"MI":5,"WeaponType":"槍","MAXSTR":6,"MAXVIT":-2,"MAXDEX":3,"MAXAGI":5,"MAXINT":-1,"MAXMND":-4,"MAXAI":1,"MAXMI":1},"ID94f":{"Id":"ID94f","Name":"バーニィ","FlavorText":"教授のマスコットが、その後どうなったかは誰も知らない。","Series":"RS3","Gender":"不明","Hp":65,"DotId":"ID3a2dc","Holders":["ID3a2dd"],"STR":6,"VIT":4,"DEX":9,"AGI":9,"INT":3,"MND":5,"AI":4,"MI":5,"WeaponType":"銃","MAXSTR":1,"MAXVIT":2,"MAXDEX":6,"MAXAGI":2,"MAXINT":-2,"MAXMND":-2,"MAXAI":1,"MAXMI":1},"ID89d":{"Id":"ID89d","Name":"コッペリア","FlavorText":"天才発明家ヒラガによって作り出された自動人形。その疑似知能がどのように生み出されているのかは謎だ。","Series":"RS2","Gender":"女","Hp":76,"DotId":"ID35d54","Holders":["ID35d55","ID35d56"],"STR":5,"VIT":6,"DEX":6,"AGI":9,"INT":4,"MND":5,"AI":5,"MI":5,"WeaponType":"体術","MAXSTR":4,"MAXVIT":7,"MAXDEX":2,"MAXAGI":4,"MAXINT":-1,"MAXMND":0,"MAXAI":0,"MAXMI":-1},"ID8e1":{"Id":"ID8e1","Name":"ヒラガ","FlavorText":"天才発明家の一族で、代々天才発明家を職業にしている。だが、あまりに天才過ぎるためか、その発明品が世の人に受け入れられることはまれなようだ。","Series":"RS2","Gender":"男","Hp":69,"DotId":"ID377e4","Holders":["ID377e5"],"STR":4,"VIT":4,"DEX":6,"AGI":5,"INT":9,"MND":7,"AI":5,"MI":4,"WeaponType":"銃","MAXSTR":0,"MAXVIT":-8,"MAXDEX":5,"MAXAGI":9,"MAXINT":3,"MAXMND":1,"MAXAI":1,"MAXMI":-1}};
var STYLE_MASTER = [];

var NOW_PARTY = 0;
var PARTY_LIST = [[]];
var BASE = LIMIT_BASE;
var UID;
var dotStyle = " margin-left:0px; position: relative;";
// PARTY_LIMIT = 5 Firebaseで設定

function _noLoginInitial() {
    var uiConfig = {
        // ログイン完了時のリダイレクト先
        signInSuccessUrl: 'https://nao-romasaga.github.io/party.html',
        // 利用する認証機能
        signInOptions: [
            firebase.auth.TwitterAuthProvider.PROVIDER_ID
        ],
    };
    var ui = new firebaseui.auth.AuthUI(firebase.auth(appUsers));
    ui.start('#firebaseui-auth-container', uiConfig);
}
async function _initial() {
    $(".noLogin").hide();
    $(".isLogin").removeClass("d-none");
    $("#loginInfo").hide();
    let icon = $("<img>").attr("src", USER.photoURL)
            .attr("style", "width:40px; heidht:40px;    border-radius: 50%;");
    let name = `${USER.displayName} さん:ログイン中`;
    $("#firebaseui-auth-container").addClass("bg-white kadomaru")
            .append(icon).append(name);
    await init();
}

async function init() {
    let partyFunc = readUserData("PARTY", async function (result) {
        if (result === null) {
            PARTY_LIST = [[]];
        } else {
            PARTY_LIST = result;
        }
    });
//    let charFunc = readFile('Char', async function (result) {
//        CHAR_MASTER = result;
        dispChar(CHAR_MASTER);
        $("#charData").show();
        $('[data-toggle="tooltip"]').tooltip();
//    });
    await Promise.all([partyFunc]);
    if (PARTY_LIST === null) {
        return;
    }
    await renderParty();
    $(".initialHide").removeClass("d-none");
    $(".initialShow").slideUp();

    setLimitData();
    //firebase.database().goOffline();
    //firebase.database(appUsers).goOffline();
}

async function renderParty() {
    // 初期表示のパーティは0固定かな？
    let idx = 0;
    PARTY_LIST[0] = PARTY_LIST[0].filter(data => CHAR_MASTER[data['char']] !== undefined);
    let data = PARTY_LIST[0][idx];
    let finish = 0;
    let funcList = [];

    while (data !== undefined) {
        let charId = data['char'];
        let styleId = data['style'];

        NOW_CHAR = CHAR_MASTER[charId];
        selectDotHensei(CHAR_MASTER[charId]);
        let func = readUserDataWithId("CHAR", charId, async function (r) {
            // キャラクター情報表示
            await displayCharInfo(CHAR_MASTER[charId], r);
            // スタイル初期表示
            await displayStyleInfo(charId, styleId);
            // 全部読み込んだらDB切断する
            if (finish === PARTY_LIST[0].length) {
                //firebase.database(appUsers).goOffline();
            }
            // 入力エリアは初期表示は消す
            closeInput(charId, false);
        });
        funcList.push(func);
        data = PARTY_LIST[0][++idx];
    }
    await Promise.all(funcList);
}
function closeInput(charId, saveFlg = false) {
    //$(".LIMIT").attr("style", "border:0px");
    $(".charTmpl" + charId).find(".fukidashiInput").slideUp(250);
    if (saveFlg) {
        saveCharData(charId);
}
//$(".charTmpl" + charId).find('.inputArea').addClass('d-none');
}

$(document).ready(function ($) {
    $(".filterList").click(function () {
        $(".weaponList").addClass("d-none");
        let value = $(this).attr("href").substr(1);
        if ($(this).parent().hasClass("filterActive")) {
            // 解除
            $(".SeriesChoise").removeClass("d-none");
            $(".filterList").each(function () {
                $(this).parent().removeClass("filterActive");
            });
        } else {
            // 絞り込み
            $(".SeriesChoise").addClass("d-none");
            $("#_" + value).removeClass("d-none");
            $(".filterList").each(function () {
                $(this).parent().removeClass("filterActive");
            });
            $(this).parent().toggleClass("filterActive");
        }
    });
//    $(document).on('change', '.roleClass', function () {
//        //console.log($(this).val(), $(this).parent().attr("data-id"));
//        //console.log($(this).parentsUntil(".charTable"));
//        //console.log($(this).parentsUntil(".charTable").find(".role"));
//        $(this).parentsUntil(".charTable").find(".role").html(`<i class="fas fa-${$(this).val()}"></i>`);
//    });

//    $(".icon_jinkei").click(function () {
//        let jinkei = $(this).attr("data-id");
//        //console.log($("#JINKEI").attr("class"), jinkei);
//        $("#JINKEI").children().slideUp(300, function () {
//            $("#JINKEI").attr("class", jinkei);
//        });
//        $("#JINKEI").children().slideDown(300);
//    });
//    Sortable.create(JINKEI, {
//        animation: 500,
//        onChoose: function (evt) {
//            console.log(evt.item);
//            console.log($(evt.item).find(".char"));
//            console.log("onChoose", evt.oldIndex);
//            $(evt.item).find(".char").removeClass("char-winner").addClass("char-damage");
//        },
//        // Element dragging ended
//        onEnd: function (evt) {
//            $(evt.item).find(".char").removeClass("char-damage").addClass("char-winner");
//
//            let num = 1;
//            $("#JINKEI").find(".series-button").each(function () {
//                $(this).text(num++);
//            });
//            let newParty = [];
//            let nowParty = PARTY_LIST[NOW_PARTY];
//            $("#JINKEI").find(".char").each(function () {
//                let cId = $(this).attr('data-charId');
//                for (let i in nowParty) {
//                    if (nowParty[i]['char'] === cId) {
//                        newParty.push(Object.assign({}, nowParty[i]));
//                    }
//                }
//            });
//            PARTY_LIST[NOW_PARTY] = newParty;
//            console.log(PARTY_LIST[NOW_PARTY]);
//            updatePartyDB();
//            console.log("onEnd");
//        },
//        onSort: function (/**Event*/evt) {
//            console.log("onSort", evt);
//            // same properties as onEnd
//        },
//        // Called when dragging element changes position
//        onChange: function (/**Event*/evt) {
//            console.log("onChange", evt.newIndex) // most likely why this event is used is to get the dragging element's current index
//            // same properties as onEnd
//        },
//    });

    initialHide();

    $('.tab-content').on('click', function () {});
    // プラスマイナスボタン
    $(document).on('click', '.paramButton', function () {
        let input = $(this).parent().find(".charParam");
        let add = ($(this).attr("data-pm") === "plus") ? 1 : -1;
        let org = input.val();
        let val = Number(org) + add
        input.val(val);

        updateDisplayStatus($(this), val);
    });
    // プラスマイナスボタン
    $(document).on('click', '.CHAR_SAVE', function () {
        let charId = $(this).attr("data-id");
        $(this).removeClass("icon_btn_on").addClass("icon_btn_off");
        $(this).slideUp(200, function () {
            $(this).slideDown(200);
            $(this).removeClass("icon_btn_off").addClass("icon_btn_on");
            updateDB(charId);
            saveCharData(charId);
        });
    });

    // パラメータ修正時
    $(document).on('change', '.charParam', function () {
        updateDisplayStatus($(this), $(this).val());
    });
    function updateDisplayStatus(target, val) {
        let table = target.parents(".charTable");
        let charId = table.attr("data-charid");
        let param = target.attr("data-param");
        $(".char" + param + charId).each(function () {
            $(this).text(val);
        });
        $(".charInput" + param + charId).each(function () {
            $(this).val(val);
        });
        updateDB(charId);
    }

    $('[data-toggle="tooltip"]').tooltip();

    $(document).on('click', '.openMenu, .nowData > td', function () {

        setLimitData();
        let charId = ($(this).attr("data-id") !== undefined) ? $(this).attr("data-id") : $(this).parent().attr("data-id");

        NOW_CHAR = CHAR_MASTER[charId];
        let style = $(".charTmpl" + charId).find(".fukidashiInput").attr("style");
        if (style === "display: block;") {
            saveCharData(charId);
        }
        $(".charTmpl" + charId).find(".fukidashiInput").slideToggle(250);
//        let openFlg = ($(".charTmpl" + charId).find('.inputArea').first().hasClass('d-none'));
//        $('.inputArea').slideDown(500).addClass('d-none');
//        if (openFlg) {
//            $(".charTmpl" + charId).find('.inputArea').removeClass('d-none');
//        } else {
//            $(".charTmpl" + charId).find('.inputArea').addClass('d-none');
//        }
        //$(".LIMIT").attr("style", "border:0px");
    });


    $(document).on('click', '.btn_close', function () {
        closeInput($(this).attr("data-id"), true);
    });

    // キャラクターとじる時
    $(document).on('click', '.charUnset', function () {
        let charId = $(this).attr("data-id");
        charUnset(charId);
    });

    function charUnset(charId) {
        let charInfo = CHAR_MASTER[charId];
        $(".charTmpl" + charId).parents(".charTableParent").slideUp(500);
        selectDotReset(charInfo);
        $("#PARTY").find(".charTmpl" + charId).remove();
        $("#JINKEI" + charId).remove();
        let idx = getCharFromPartyList(charId);
        if (idx !== -1) {
            PARTY_LIST[NOW_PARTY].splice(idx, 1);
        }
        updatePartyDB();
        saveCharData(charId);
    }

    function getCharFromPartyList(charId) {
        for (let key in PARTY_LIST[NOW_PARTY]) {
            if (PARTY_LIST[NOW_PARTY][key]['char'] === charId) {
                return key;
            }
        }
        return -1;
    }


    // キャラクタークリック時
    $(document).on('click', '.tab-content .char, .weaponList  .char', async function () {
        firebase.database().goOnline();
        firebase.database(appUsers).goOnline();

        let charId = $(this).attr("data-id");
        let idx = getCharFromPartyList(charId);
        if (PARTY_LIST[NOW_PARTY].length >= PARTY_LIMIT || idx !== -1) {
            while (PARTY_LIST[NOW_PARTY].length > PARTY_LIMIT) {
                let size = PARTY_LIST[NOW_PARTY].length;
                let id = PARTY_LIST[NOW_PARTY][size - 1]['char'];
                charUnset(id);
                PARTY_LIST[NOW_PARTY].pop();
            }
            $(this).removeClass("char-aruku").addClass("char-loser");
            return;
        }

        // 初回でなければ開いている入力エリアは閉じる
        if (NOW_CHAR['Id'] !== undefined) {
            closeInput(NOW_CHAR['Id'], true);
        }

        NOW_CHAR = CHAR_MASTER[charId];
        let styleId = NOW_CHAR['Holders'][0];
        NOW_STYLE = await getStyleInfo(styleId);


        // パーティ登録
        PARTY_LIST[NOW_PARTY].push({
            "char": charId,
            "style": styleId
        });

        $(".styleInfoArea").show();
        selectDotHensei(NOW_CHAR);

        readUserDataWithId("CHAR", charId, async function (result) {
            // キャラクター情報表示
            await displayCharInfo(CHAR_MASTER[charId], result);
            // スタイル初期表示
            await displayStyleInfo(NOW_CHAR['Id'], styleId);
            $(".charTmpl" + charId).find('.inputArea').removeClass('d-none').slideDown(500);
            $("html,body").animate({scrollTop: $(".charTmpl" + charId).offset().top}, 500, 'swing');
            setLimitData();
            updatePartyDB();
            //firebase.database().goOffline();
            //firebase.database(appUsers).goOffline();
        });
        $('[data-toggle="tooltip"]').tooltip();
    });

    // スタイルクリック時
    $(document).on('click', '.style', async function () {
        let styleId = $(this).attr("data-id");
        NOW_STYLE = await getStyleInfo(styleId);
        await displayStyleInfo(NOW_CHAR['Id'], styleId);
        let idx = getCharFromPartyList(NOW_CHAR['Id']);
        PARTY_LIST[NOW_PARTY][idx]['style'] = styleId;
        updatePartyDB();
    });

    function updateDB(id) {
        let charId = (id === undefined) ? NOW_CHAR['Id'] : id;
        for (let key of PARAM_KEY_HP) {
            // Inputから取るのではなく表示値から取る。表示値はあらかじめ更新しておく必要ありよ
            let val = $(".char" + key + charId).first().text();
            CHAR_MASTER[charId]["NOW" + key] = Number(val);
        }

        // キャラ入れ替えた場合は、前のキャラを保存する
        if (NOW_CHAR_ID !== charId) {
            if (NOW_CHAR_ID !== "") {
                saveCharData(NOW_CHAR_ID);
            }
            NOW_CHAR_ID = charId;
        }
        setLimitData();
    }
    function updatePartyDB() {
        updateData("PARTY", PARTY_LIST);
    }
    // まとめて入力反映
    $(document).on('click', '.hanei', function () {
        showModal($(this).parent().find(".allparams"));
    });

    $(document).on('change', '.allparams', function () {
        showModal($(this));
    });
    function showModal(allparams) {
        gtag('event', "showModal", {'event_category': "party", 'event_label': 'show', 'value': 1});
        $("#allSubmit").attr("data-input", $(allparams).val());
        $("#allSubmit").attr("data-charId", $(allparams).attr("data-id"));

        let input = splitParam($(allparams).val(), "不明");
        let output = "";
        output += `HP: ${input[0]}<br>`;
        output += `腕力: ${input[1]} 体力:${input[2]}<br>`;
        output += `器用さ: ${input[3]} 素早さ:${input[4]}<br>`;
        output += `知力: ${input[5]} 精神:${input[6]}<br>`;
        output += `　愛: ${input[7]} 魅力:${input[8]}<br>`;
        output += "が入力されました<br>";
        output += "この内容を反映してもよろしいですか？";

        $("#allParamConfirm").html(output);
        $("#modal01").fadeIn();
        $("#allParamConfirmInner").css("animation", "modal 0.5s forwards");
        return false;
    }

    $(".modalClose").click(function () {
        if ($(this).attr("data-id") === "ok") {
            gtag('event', "showModal", {'event_category': "party", 'event_label': 'save', 'value': 1});
            let id = $(this).attr("data-charId");
            let input = splitParam($(this).attr("data-input"), 0);
            for (let i in input) {
                $(".charInput" + PARAM_KEY_HP[i] + id).each(function (idx, el) {
                    $(el).val(input[i]);
                });
                $(".char" + PARAM_KEY_HP[i] + id).each(function (idx, el) {
                    $(el).text(input[i]);
                });
            }
            updateDB(); // spanに入れる
        } else {
            gtag('event', "showModal", {'event_category': "party", 'event_label': 'cancel', 'value': 1});
        }
        $("#modal01").fadeOut();
        $("#allParamConfirmInner").css("animation", "modalClose 0.5s forwards");
        return false;
    });
    $(".baseValue").click(function () {
        $(".baseValue").each(function () {
            $(this).removeClass("icon_btn_off");
            $(this).addClass("icon_btn_on");
        });
        $(this).addClass("icon_btn_off");
        BASE = Number($(this).attr("data-id"));
        setLimitData();
    });



});
function setLimitData() {
    $(".LIMIT").each(async function () {
        let styleId = $(this).attr("data-styleId");
        let styleInfo = await getStyleInfo(styleId);
        let tr = $(".limit" + styleId);
        let charId = tr.attr("data-charId");
        let sum = 0;
        for (let key of PARAM_KEY) {
            let limit = styleInfo['Limit' + key];
            let val = (CHAR_MASTER[charId]["NOW" + key] !== undefined) ? CHAR_MASTER[charId]["NOW" + key] : CHAR_MASTER[charId][key];
            sum += val;
            let limitValue = (styleInfo['Limit' + key] !== 99)
                    ? BASE + Number(limit) - Number(val)
                    : "?";
            tr.find("." + key).each(function () {
                $(this).removeClass("status_plus").removeClass("status_minus");
                if (limitValue === "?") {
                } else if (limitValue > 0) {
                    $(this).addClass("status_plus");
                } else if (limitValue < 0) {
                    $(this).addClass("status_minus");
                }
                $(this).text(limitValue);
            });
        }
        let avg = (sum - 369) / 8;
        let dAvg = "+" + avg;
        if (sum === 369) {
            dAvg = 0;
        } else if (avg < 0) {
            dAvg = avg
        }
        let reco = "遠征";
        if (avg >= 12) {
            reco = "VH12(最大:+15)"; // 11~13
        } else if (avg > 8) {
            reco = "VH11(最大:+13)"; // 9~11
        } else if (avg > 5) {
            reco = "VH10(最大:+11)"; // 5~8
        } else if (avg > 0) {
            reco = "VH9(最大:+9)";
        } else if (avg > -3) {
            reco = "VH415(最大:+0)";
        } else if (avg > -6) {
            reco = "H712(最大:-2)";
        }
        //console.log($(".SUM" + charId), sum, ((sum - 369) / 8));
        $(".SUM" + charId).text(sum);
        $(".AVG" + charId).text(dAvg);
        $(".RECO" + charId).text(reco);
    });
}

function saveCharData(charId) {
    update = {};
    let sum = 0;
    for (let key of PARAM_KEY) {
        let v = Number(CHAR_MASTER[charId]["NOW" + key]);
        v = isNaN(v) || (v > LIMIT_BASE + 16) ? 0 : v;
        sum += v;
        update[key] = v;
    }
    let v = Number(CHAR_MASTER[charId]["NOWHP"]);
    update["HP"] = isNaN(v) || (v > 930) ? 0 : v;

    if (sum > 0) {
        updateData(`CHAR/${charId}`, update);
        gtag('event', "saveChar", {'event_category': "party", 'event_label': CHAR_MASTER[charId]['Name'], 'value': 1});
    } else {
        console.log("合計値が0のため保存をスキップしました。", update);
    }
}
function initialHide() {
    $("#charData").hide();
    $(".tabArea").hide();
    $(".styleInfoArea").hide();
}

// キャラクタークリック時
async function displayCharInfo(charInfo, myData) {
    let charId = charInfo['Id'];
    let charBaseTmpl = $("#CHAR_TEMPLATE").clone().removeClass("d-none").removeAttr("id").addClass("charTmpl" + charId)
            .attr("data-charId", charId);
    charBaseTmpl.find(".charName").html(charInfo['Name']);
    charBaseTmpl.find(".icon_btn_on").attr("data-id", charId);
    charBaseTmpl.find(".charUnset").attr("data-id", charId);
    charBaseTmpl.find(".openMenu").attr("data-id", charId);
    charBaseTmpl.find(".char").parent().attr("data-id", charId);
    charBaseTmpl.find(".allparams").attr("data-id", charId);
    charBaseTmpl.find(".CHAR_SAVE").attr("data-id", charId);
    charBaseTmpl.find(".SUM").attr("data-id", charId).addClass("SUM" + charId);
    charBaseTmpl.find(".AVG").attr("data-id", charId).addClass("AVG" + charId);
    charBaseTmpl.find(".RECO").attr("data-id", charId).addClass("RECO" + charId);
    charBaseTmpl.find("#insotsu").parent().attr("data-id", charId);
    charBaseTmpl.find("#insotsu").attr("id", "insotsu" + charId).attr("name", "roleType" + charId);
    charBaseTmpl.find("#baby").attr("id", "baby" + charId).attr("name", "roleType" + charId);
    charBaseTmpl.find(".insotsuLabel").attr("for", "insotsu" + charId);
    charBaseTmpl.find(".babyLabel").attr("for", "baby" + charId);


    let dotId = charInfo['DotId'];
    let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    let dotSrc = getImgUrl('dot/' + pngName + ".png") + dotStyle;
    charBaseTmpl.find(".dot_mid").attr('style', dotSrc);
    // ステータス反映。初回はデフォルト値(+35)を入れる
    if (myData !== null) {
        for (let key of PARAM_KEY_HP) {
            charInfo["NOW" + key] = Number(myData[key]);
        }
    } else if (myData === null) {
        for (let key of PARAM_KEY) {
            charInfo["NOW" + key] = 0;
        }
    }

    let nowInput = charBaseTmpl.find(".nowData");
    nowInput.attr("data-id", charId);
    for (let key of PARAM_KEY_HP) {
        charBaseTmpl.find(".char" + key).removeClass("char" + key).addClass("charInput" + key + charId).val(charInfo["NOW" + key]);
        nowInput.find("." + key).removeClass("char" + key).addClass("char" + key + charId).text(charInfo["NOW" + key]);
    }

    // 所持スタイルの表示。選択部分とリミット部分
    for (let styleId of charInfo['Holders']) {
        let styleInfo = await getStyleInfo(styleId);
        // スタイルアイコンの追加
        let icon = $("<button>").addClass("style")
                .addClass(getStyleIconClass(styleInfo['Rarity']))
                .attr("style", getImgUrl('style_icon/' + styleId + ".png"))
                .attr("data-id", styleId);
        let background = $("<span>")
                .addClass(getStyleIconBgClass(styleInfo['Rarity']))
                .append(icon);
        charBaseTmpl.find(".STYLE_ICON").append(background);

        let tr = $("#LIMIT_TEMPLATE").clone().removeClass("d-none").removeAttr("id").addClass("LIMIT limit" + styleId)
                .attr("data-styleId", styleId).attr("data-charId", charId)
                ;
        tr.find(".rare").attr("src", "./img/icon/icon_" + styleInfo['Rarity'] + ".png");
        tr.find(".icn").attr("src", "./img/style_icon/" + styleId + ".png");
        tr.find(".cin").attr("src", "./img/style_cutin/" + styleId + ".png");
        for (let key of PARAM_KEY) {
            let limit = styleInfo['Limit' + key];
            if (limit === 99) {
                tr.find("." + key).text("?");
            } else {
                let limitValue = BASE + Number(limit) - Number(charInfo["NOW" + key]);
                tr.find("." + key).text(limitValue);
                if (limitValue > 0) {
                    tr.find("." + key).addClass("status_plus");
                } else if (limitValue < 0) {
                    tr.find("." + key).addClass("status_minus");
                }
            }
        }
        charBaseTmpl.append(tr);
    }
    let num = $("#JINKEI").children().length + 1;
    let label = `<p class="series-button text-center" style="width:30px; margin-bottom:0px;">${num}</p>`;
    let dot = `<span class="char-winner char dot_mid dot" style="${getImgUrl('dot/' + pngName + ".png")}" data-charId='${charId}' data-styleId=''></span>`;
    $("#JINKEI").append($("<div>").addClass("JINKEI" + charId).append(label + dot));
    let div = $("<div class='charTableParent'>").append(charBaseTmpl);
    $("#PARTY").append(div);
}
// スタイルクリック時
async function displayStyleInfo(charId, styleId) {
    let styleInfo = await getStyleInfo(styleId);
    if (styleInfo === null) {
        return;
    }

    $(".charTmpl" + charId).attr("data-styleId", styleId);
    // TODO 複数パーティの場合はここを直す必要がある
    $(".charTmpl" + charId).find(".style").each(function () {
        let subStyleId = $(this).attr("data-id");
        $(this).parent().addClass("opacity_nocheck");
        if (styleId === subStyleId) {
            $(this).parent().removeClass("opacity_nocheck");
            return;
        }
    });
    $(".charTmpl" + charId).find(".LIMIT").each(function () {
        if ($(this).hasClass("limit" + styleId)) {
            $(this).removeClass("inputArea").attr("style", "border: 1px solid #faf0b4");
        } else {
            $(this).addClass("inputArea d-lg-table-row").attr("style", "border: 0px");
        }
    });

    let dotId = styleInfo['DotId'];
    let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    let dot = $(".charTmpl" + charId).find(".char");
    dot.attr('style', getImgUrl('dot/' + pngName + ".png") + dotStyle);
    if (dot.length > 0) {
        animeReset(dot, "char-winner");
    }
}


function getSmallIcon(styleInfo) {
    // スタイルアイコンの追加
    let icon = $("<button>")
            .addClass(getStyleIconClass(styleInfo['Rarity']) + "_small")
            .attr("style", getImgUrl('style_icon/' + styleInfo['Id'] + ".png"))
    let background = $("<span>").addClass(getStyleIconBgClass(styleInfo['Rarity']))
            .attr("style", "height: 30px;")
            .append(icon);
    return background;
}

function splitParam(input, initial) {
    k = (/,|\.|\s|\t/g);
    let tmp = input.split(k);

    if (tmp.length === 1) {
        tmp[0] = input.substr(0, 3);
        tmp[1] = input.substr(3, 2);
        tmp[2] = input.substr(5, 2);
        tmp[3] = input.substr(7, 2);
        tmp[4] = input.substr(9, 2);
        tmp[5] = input.substr(11, 2);
        tmp[6] = input.substr(13, 2);
        tmp[7] = input.substr(15, 2);
        tmp[8] = input.substr(17, 2);
    }
    for (let i = 0; i < 8; i++) {
        if (tmp[i] === undefined || tmp[i] === "") {
            tmp[i] = initial;
        }
    }
    return tmp;
}
function selectDotReset(charInfo) {
    $(".dot" + charInfo['DotId'])
            .removeClass('char-winner')
            .addClass('char-aruku')
            .find(".series-button").text(charInfo['Series']);
}
function selectDotHensei(charInfo) {
    $(".dot" + charInfo['DotId'])
            .removeClass('char-aruku')
            .removeClass('char-loser')
            .addClass('char-winner')
            .find(".series-button").text('編成中');
}