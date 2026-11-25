(function() {
  'use strict';
  const TR = () => window.Translator;
  const HANRE = /[一-鿿]/;
  const VNRE = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
  const CORE_SRC = `\n@PRON\ntôi|我|wǒ|p1\ntao|我|wǒ|p1\ntớ/mình|我|wǒ|p1\nta|我|wǒ|p1\nem|我|wǒ|p1 amb\nem|你|nǐ|p2\nmày/mi|你|nǐ|p2\nbạn|你|nǐ|p2\nbạn|朋友|péngyou|pos=N person mw=个\ncậu|你|nǐ|p2\nanh|你|nǐ|p2 amb\nanh|哥哥|gēge|pos=N kin person\nchị|你|nǐ|p2 amb\nchị|姐姐|jiějie|pos=N kin person\nông|您|nín|p2 amb\nông|爷爷|yéye|pos=N kin person\nbà|您|nín|p2 amb\nbà|奶奶|nǎinai|pos=N kin person\ncô|您|nín|p2 amb\ncô|老师|lǎoshī|pos=N person mw=位\nchúng tôi/chúng tớ/chúng mình/bọn tôi/bọn tao/bọn mình|我们|wǒmen|p1 pl\nchúng ta|我们|wǒmen|p1 pl\nchúng ta|咱们|zánmen|p1 pl\ncác bạn/các cậu/các anh/các chị/các em/chúng mày/bọn mày/tụi mày|你们|nǐmen|p2 pl\nanh ấy/ông ấy/cậu ấy/hắn/anh ta/ông ta|他|tā|p3\ncô ấy/chị ấy/bà ấy/cô ta/chị ta/bà ta|她|tā|p3\nem ấy|他|tā|p3\nnó|他|tā|p3 amb\nnó|它|tā|p3\nhọ/bọn họ/chúng nó/bọn nó|他们|tāmen|p3 pl\nmọi người|大家|dàjiā|pl\nngười ta|别人|biérén|p3\nai đó|有人|yǒurén|p3\nbản thân|自己|zìjǐ|\nđây|这|zhè|dem\ncái này/điều này|这个|zhège|dem\ncái kia/cái đó/cái ấy/điều đó/điều ấy|那个|nàge|dem\nviệc này/chuyện này|这件事|zhèjiànshì|dem\nviệc đó/chuyện đó/chuyện ấy|那件事|nàjiànshì|dem\n@DEM\nnày|这|zhè|\nkia/đó/ấy/đấy/nọ|那|nà|\n@PLACE\nbếp/nhà bếp|厨房|chúfáng|\nngoài trời/bên ngoài/ở ngoài|外面|wàimiàn|\ntrong nhà|屋里|wūli|\nở đây/chỗ này/đằng này|这儿|zhèr|\nở đó/chỗ đó/ở đấy/chỗ ấy/đằng đó|那儿|nàr|\nở kia/đằng kia/chỗ kia|那边|nàbiān|\n@Q\ngì/cái gì|什么|shénme|\nai|谁|shéi|\nđâu/chỗ nào/nơi nào|哪儿|nǎr|\nở đâu|在哪儿|zàinǎr|sem=WHERE\nnào|哪|nǎ|sem=WHICH\nbao nhiêu|多少|duōshao|sem=NUM\nmấy|几|jǐ|sem=NUM\nbao nhiêu tiền|多少钱|duōshaoqián|sem=PRED\nbao nhiêu tuổi|多大|duōdà|sem=PRED\nmấy tuổi|几岁|jǐsuì|sem=PRED\nmấy giờ|几点|jǐdiǎn|sem=TIME\nbao lâu|多长时间|duōcháng shíjiān|sem=DUR\nbao xa|多远|duōyuǎn|sem=PRED\n@QA\ntại sao/vì sao/sao lại/tại làm sao/vì cái gì|为什么|wèishénme|\nsao|为什么|wèishénme|\nlàm sao/làm thế nào/bằng cách nào|怎么|zěnme|sem=HOW\nbao giờ/khi nào/lúc nào/hồi nào|什么时候|shénmeshíhou|\nthế nào/như thế nào/ra sao/thế nào rồi|怎么样|zěnmeyàng|sem=HOWQ\n@NEG\nkhông|不|bù|\nchẳng/chả/đéo/méo/không hề/chẳng hề|不|bù|\nchưa|没|méi|sem=NOTYET\nvẫn chưa/còn chưa|还没|háiméi|sem=NOTYET\nđừng/chớ/không được|别|bié|sem=PROHIB\nchưa bao giờ/chưa từng/chưa hề|从来没|cóngláiméi|sem=NEVER\nkhông bao giờ|从来不|cóngláibù|sem=NEVERF\nkhông phải/chẳng phải|不是|búshì|sem=NOTCOP\n@ASP\nđang/đương|正在|zhèngzài|sem=PROG\nđã|已经|yǐjīng|sem=PAST\nsẽ|会|huì|sem=FUT\nsắp/sắp sửa|快要|kuàiyào|sem=SOON\nvừa/vừa mới/mới vừa|刚|gāng|sem=JUST\ntừng/đã từng|过|guo|sem=EXP\n@PERF\nrồi|了|le|\n@DEG\nrất|很|hěn|\nrất là/vô cùng/cực kỳ/cực kì/hết sức/vô cùng là|非常|fēicháng|\nkhá/khá là/hơi bị/cũng khá|挺|tǐng|sem=TING\nhơi/hơi hơi|有点儿|yǒudiǎnr|\nquá/quá là|太|tài|sem=TOO\nthật/thật là/thật sự/quả là|真|zhēn|\nsiêu|超|chāo|\nđặc biệt|特别|tèbié|\n@DEGP\nlắm|很|hěn|\nquá/quá đi/quá trời/quá xá/dã man|太|tài|sem=TOO\nthật/thế/vậy|真|zhēn|\nghê/ghê gớm|真|zhēn|\ncực kỳ/cực kì/vô cùng/cực/kinh khủng/khủng khiếp|极了|jíle|sem=POST\nvãi/vãi chưởng/vãi cả chưởng/chết đi được/muốn chết|死了|sǐle|sem=POST\n@AUX\nmuốn|想|xiǎng|\ncó thể/có khả năng|可以|kěyǐ|\ncó thể|能|néng|\nkhông thể/chẳng thể|不能|bùnéng|sem=NEGAUX\nphải/cần phải/buộc phải|得|děi|\nphải|必须|bìxū|\ncần|需要|xūyào|\nnên/cần nên|应该|yīnggāi|\nkhông nên|不应该|bùyīnggāi|sem=NEGAUX\ndám|敢|gǎn|\nđịnh/dự định/tính|打算|dǎsuàn|\nmong/hy vọng/hi vọng/mong là|希望|xīwàng|\nđược phép|可以|kěyǐ|\nhãy/xin hãy/xin mời/mời/vui lòng/làm ơn/xin vui lòng|请|qǐng|sem=IMP\n@ADV\nthứ nhất/trước hết/đầu tiên là|首先|shǒuxiān|\ncuối cùng là|最后|zuìhòu|\ncũng|也|yě|\nđều|都|dōu|\ncòn|还|hái|\nvẫn/vẫn còn/vẫn cứ|还|hái|\nlại|又|yòu|\nchỉ|只|zhǐ|\nthường/thường xuyên/hay/hay là thường|经常|jīngcháng|\nluôn/luôn luôn/lúc nào cũng|总是|zǒngshì|\ncùng nhau/với nhau/cùng|一起|yìqǐ|sem=TOGETHER\nngay/ngay lập tức/lập tức/liền|马上|mǎshàng|\nthật ra/thực ra/kỳ thực|其实|qíshí|\ntất nhiên/dĩ nhiên/đương nhiên|当然|dāngrán|\nhình như/dường như/có vẻ|好像|hǎoxiàng|\nđột nhiên/bỗng nhiên/tự nhiên|突然|tūrán|\ncuối cùng/rốt cục|终于|zhōngyú|\nrốt cuộc/rốt cuộc là|到底|dàodǐ|\nvốn/vốn dĩ|本来|běnlái|\ncứ/mãi/suốt|一直|yìzhí|\ncó lẽ/có khi/biết đâu|可能|kěnéng|\nchắc/chắc là/chắc hẳn|应该|yīnggāi|\nchắc chắn/nhất định|一定|yídìng|\nhoàn toàn|完全|wánquán|\nít khi/hiếm khi|很少|hěnshǎo|\nthỉnh thoảng/đôi khi/có lúc/có khi|有时候|yǒushíhou|\nmột mình|一个人|yígerén|\ntự/tự mình|自己|zìjǐ|\nnhau/lẫn nhau|互相|hùxiāng|\nquả thật/đúng là/quả thực|确实|quèshí|\ncố/cố gắng|努力|nǔlì|pos=V vp\nmới|才|cái|sem=CAI\ntrước|先|xiān|sem=FIRST\nnữa|再|zài|sem=MORE\nthôi|吧|ba|pos=PART\n@PREP\nở/tại|在|zài|\nvới/cùng với/cùng|跟|gēn|sem=WITH\ncho|给|gěi|sem=BEN\nbằng|用|yòng|sem=INSTR\ntừ|从|cóng|\nđến/tới|到|dào|sem=TO\nvề|回|huí|sem=BACK\ntheo|按照|ànzhào|\nđể/nhằm|为了|wèile|sem=PURP\nvì/cho|为|wèi|sem=FOR\nbị|被|bèi|sem=PASS\nđối với/với|对|duì|sem=TOWARD\nvề/về việc/liên quan đến|关于|guānyú|sem=ABOUT\nkhoảng/chừng/tầm/khoảng chừng|大约|dàyuē|sem=APPROX\ncách|离|lí|sem=FROM\nso với|跟|gēn|sem=COMPARE\ntrừ/ngoài/ngoài … ra/trừ … ra|除了|chúle|\n@CONJ\nvà/với/cùng|和|hé|sem=AND\nhoặc/hoặc là|或者|huòzhě|sem=OR\nhay/hay là|还是|háishì|sem=ORQ\nnhưng/nhưng mà/song/mà|但是|dànshì|sem=BUT\ntuy nhiên/có điều|不过|búguò|sem=BUT\nbởi vì/vì/tại vì/bởi/do/là vì|因为|yīnwèi|sem=BECAUSE\nnên/cho nên/vì vậy/vì thế/thế nên/nên là/do đó/vậy nên/bởi vậy|所以|suǒyǐ|sem=SO\nnếu/nếu như/giả sử/giả như/lỡ như/nhỡ|如果|rúguǒ|sem=IF\nthì|就|jiù|sem=THEN\ntuy/tuy rằng/mặc dù/mặc dầu/dù/dẫu/tuy là/mặc dù là/dù rằng|虽然|suīrán|sem=ALTHOUGH\ncho dù/dù cho/kể cả khi/ngay cả khi/dẫu cho|即使|jíshǐ|sem=EVENIF\nkhông những/không chỉ/chẳng những|不但|búdàn|sem=NOTONLY\nmà còn/còn/mà lại còn|而且|érqiě|sem=ALSO\nhơn nữa/ngoài ra|而且|érqiě|sem=MOREOVER\nkhi/lúc/khi mà/lúc mà/hồi/trong khi|的时候|deshíhou|sem=WHEN\ntrước khi|以前|yǐqián|sem=BEFORE\nsau khi|以后|yǐhòu|sem=AFTER\nsau đó/rồi sau đó/xong rồi|然后|ránhòu|sem=THEN2\nchỉ cần|只要|zhǐyào|sem=ONLYNEED\nchỉ có|只有|zhǐyǒu|sem=ONLYIF\nhễ/cứ hễ/mỗi khi|一|yī|sem=WHENEVER\nngay cả|连|lián|sem=EVEN\nthậm chí|甚至|shènzhì|sem=EVEN2\ncho đến khi|直到|zhídào|sem=UNTIL\ntừ khi/kể từ khi|自从|zìcóng|sem=SINCE\nnếu không/không thì|不然|bùrán|sem=ELSE\nvừa|又|yòu|sem=BOTH\ncàng|越|yuè|sem=MORE2\nrằng/là|—||sem=THAT\n@LOC\ntrên|上|shang|\ndưới|下|xia|\ntrong/bên trong|里|li|\nngoài/bên ngoài|外|wài|\ntrước/phía trước/đằng trước/trước mặt|前面|qiánmiàn|\nsau/phía sau/đằng sau|后面|hòumiàn|\nbên cạnh/cạnh|旁边|pángbiān|\ngiữa|中间|zhōngjiān|\nbên trái|左边|zuǒbian|\nbên phải|右边|yòubian|\nđối diện|对面|duìmiàn|\ngần|附近|fùjìn|\n@PART\nnhé/nha/nhá/nghe/đi nhé/nhé nhé|吧|ba|\nnhỉ|吧|ba|sem=TAG\nà/hả/ư/hử/hở|吗|ma|sem=Q\nchứ|吧|ba|\nạ|—||\nđấy/đó/cơ/kìa|呢|ne|\nmà|嘛|ma|\nluôn|了|le|\nvậy/thế|呢|ne|sem=QW\nphải không/có phải không/đúng không/có đúng không/phải không ạ/đúng không ạ|是吗|shìma|sem=TAGQ\nđược không/có được không/được chứ|可以吗|kěyǐma|sem=OKQ\n@INTJ\nơi|—||sem=VOC\nnày|喂|wèi|\nôi/ôi trời|哎呀|āiyā|\ntrời ơi/trời đất ơi/ối giời ơi/trời đất|天哪|tiānna|\nồ/ô/à|哦|ò|\nvâng/dạ/vâng ạ/dạ vâng/ừ/ừm/ok|好的|hǎode|\n@CMP\nnhư/giống như/như là/tựa như|像|xiàng|\nhơn|比|bǐ|\nnhất|最|zuì|\nkém|不如|bùrú|\n@COP\nlà|是|shì|\n@HAVE\ncó|有|yǒu|\nkhông có/chẳng có/đéo có/méo có|没有|méiyǒu|sem=NEGHAVE\nchưa có|还没有|háiméiyǒu|sem=NEGHAVE\n@CL\nloại/thứ/kiểu|种|zhǒng|own\ntấm|张|zhāng|\nthằng/gã|个|gè|sem=PERSONCL\ncái/chiếc|个|gè|\ncon|只|zhī|\nquyển/cuốn|本|běn|\ntờ|张|zhāng|\nbức|幅|fú|\nngôi/căn/toà/tòa|座|zuò|\nbộ|部|bù|\nđôi|双|shuāng|own\ncặp|对|duì|own\ncây|棵|kē|\nquả/trái|个|gè|\nbông/đoá/đóa|朵|duǒ|\nly/cốc/chén/tách|杯|bēi|own\nchai|瓶|píng|own\nbát/tô|碗|wǎn|own\nđĩa|盘|pán|own\nmiếng/mẩu|块|kuài|own\nvị|位|wèi|\nlần/lượt|次|cì|own\ncân|斤|jīn|own\nký/kí/cân ký|公斤|gōngjīn|own\nhộp|盒|hé|own\ngói|包|bāo|own\ntúi|袋|dài|own\ncâu|句|jù|\nbài|首|shǒu|\ntầng|层|céng|own\nviên/hạt|颗|kē|\nlon|罐|guàn|own\nthùng|箱|xiāng|own\nbữa|顿|dùn|own\nngười|个|gè|sem=PERSONCL\n@TIME\nmùa xuân|春天|chūntiān|season kind=point\nmùa hè/mùa hạ|夏天|xiàtiān|season kind=point\nmùa thu|秋天|qiūtiān|season kind=point\nmùa đông|冬天|dōngtiān|season kind=point\nhôm nay/ngày hôm nay/bữa nay|今天|jīntiān|\nngày mai/mai/bữa mai|明天|míngtiān|fut\nhôm qua/bữa qua|昨天|zuótiān|past\nngày kia|后天|hòutiān|fut\nhôm kia|前天|qiántiān|past\nbây giờ/giờ/hiện giờ/lúc này/giờ đây|现在|xiànzài|\nhiện nay/hiện tại/dạo này/gần đây|最近|zuìjìn|\nlúc nãy/vừa nãy/ban nãy/khi nãy|刚才|gāngcái|past\nsáng nay|今天早上|jīntiān zǎoshang|\ntrưa nay|今天中午|jīntiān zhōngwǔ|\nchiều nay|今天下午|jīntiān xiàwǔ|\ntối nay/đêm nay|今天晚上|jīntiān wǎnshang|\ntối qua/đêm qua/tối hôm qua|昨天晚上|zuótiān wǎnshang|past\nsáng qua/sáng hôm qua|昨天早上|zuótiān zǎoshang|past\nsáng mai|明天早上|míngtiān zǎoshang|fut\ntối mai|明天晚上|míngtiān wǎnshang|fut\ntuần này|这个星期|zhège xīngqī|\ntuần sau/tuần tới|下个星期|xiàge xīngqī|fut\ntuần trước|上个星期|shàngge xīngqī|past\ntháng này|这个月|zhège yuè|\ntháng sau/tháng tới|下个月|xiàge yuè|fut\ntháng trước|上个月|shàngge yuè|past\nnăm nay|今年|jīnnián|\nnăm sau/năm tới/sang năm/năm sau nữa|明年|míngnián|fut\nnăm ngoái/năm trước|去年|qùnián|past\nbuổi sáng/sáng/sáng sớm|早上|zǎoshang|\nbuổi trưa/trưa|中午|zhōngwǔ|\nbuổi chiều/chiều|下午|xiàwǔ|\nbuổi tối/tối|晚上|wǎnshang|\nban đêm/đêm/nửa đêm|夜里|yèli|\ncuối tuần|周末|zhōumò|\nmỗi ngày/hằng ngày/hàng ngày/ngày nào cũng|每天|měitiān|\nsau này/về sau/mai sau|以后|yǐhòu|fut\ntrước đây/trước kia/ngày xưa/hồi trước|以前|yǐqián|past\nlúc đó/khi đó/hồi đó/lúc ấy/khi ấy|那时候|nàshíhou|past\nđầu tiên/trước tiên/trước hết|首先|shǒuxiān|\ncuối cùng thì|最后|zuìhòu|\nchủ nhật|星期天|xīngqītiān|\nsớm muộn|早晚|zǎowǎn|\n@N\ntay/bàn tay|手|shǒu|\nchân/bàn chân|脚|jiǎo|\nbạn học/bạn cùng lớp|同学|tóngxué|person mw=个\ncặp sách/cặp|书包|shūbāo|mw=个\nđồ chơi|玩具|wánjù|mw=个\nô/dù/cái ô/cái dù|伞|sǎn|mw=把\nảnh/bức ảnh/tấm ảnh|照片|zhàopiàn|mw=张\nngôn ngữ|语言|yǔyán|mw=种\nđĩa/cái đĩa|盘子|pánzi|mw=个\ntúi/cái túi|包|bāo|mw=个\nbóng tối|黑暗|hēi'àn|\ntrải nghiệm|经历|jīnglì|mw=段\nkết quả|结果|jiéguǒ|mw=个\ntin tức|消息|xiāoxi|mw=个\nlần đầu tiên/lần đầu|第一次|dìyīcì|\nkilogram/ki lô gam/kí lô/kg|公斤|gōngjīn|unit\nthứ hai|星期一|xīngqīyī|\nthứ ba|星期二|xīngqī'èr|\nthứ tư|星期三|xīngqīsān|\nthứ năm|星期四|xīngqīsì|\nthứ sáu|星期五|xīngqīwǔ|\nthứ bảy|星期六|xīngqīliù|\nđồ/đồ đạc|东西|dōngxi|mw=个\nbài|题|tí|mw=道\nbài tập/bài tập về nhà|作业|zuòyè|\ngiám đốc|经理|jīnglǐ|person mw=位\ngiá/giá cả/giá tiền|价格|jiàgé|\nquê/quê nhà/quê hương|老家|lǎojiā|place\nca sĩ|歌手|gēshǒu|person mw=个\nnhà vệ sinh/toilet/wc|洗手间|xǐshǒujiān|place mw=个\nsinh nhật vui vẻ|生日快乐|shēngrì kuàilè|\nnăm mới vui vẻ|新年快乐|xīnnián kuàilè|\nthằng/gã/tên|家伙|jiāhuo|person mw=个\nthời tiết|天气|tiānqì|\nsài gòn/thành phố hồ chí minh|胡志明市|Húzhìmíng Shì|place\nngười|人|rén|person mw=个\ncon người|人|rén|person mw=个\nchó/con chó|狗|gǒu|anim mw=只\nmèo/con mèo|猫|māo|anim mw=只\nlợn/heo/con lợn/con heo|猪|zhū|anim mw=头\nbò/con bò|牛|niú|anim mw=头\ntrâu|水牛|shuǐniú|anim mw=头\ngà|鸡|jī|anim mw=只\nvịt|鸭子|yāzi|anim mw=只\nchim|鸟|niǎo|anim mw=只\ncá|鱼|yú|anim mw=条\nkhỉ|猴子|hóuzi|anim mw=只\nngựa|马|mǎ|anim mw=匹\nchuột|老鼠|lǎoshǔ|anim mw=只\nrắn|蛇|shé|anim mw=条\nvoi|大象|dàxiàng|anim mw=头\nhổ/cọp|老虎|lǎohǔ|anim mw=只\ngấu|熊|xióng|anim mw=只\nlừa|驴|lǘ|anim mw=头\ndê|羊|yáng|anim mw=只\nthỏ|兔子|tùzi|anim mw=只\nrùa|乌龟|wūguī|anim mw=只\ngió|风|fēng|\nbố/ba/cha|爸爸|bàba|kin person\nmẹ/má|妈妈|māma|kin person\nanh trai|哥哥|gēge|kin person\nchị gái|姐姐|jiějie|kin person\nem trai|弟弟|dìdi|kin person\nem gái|妹妹|mèimei|kin person\nvợ|妻子|qīzi|kin person\nvợ|老婆|lǎopo|kin person\nchồng|丈夫|zhàngfu|kin person\nchồng|老公|lǎogōng|kin person\ncon trai|儿子|érzi|kin person\ncon gái|女儿|nǚ'ér|kin person\ncon|孩子|háizi|kin person\ncon cái|孩子|háizi|kin person\nông bà|爷爷奶奶|yéye nǎinai|kin person\nbố mẹ/cha mẹ/ba mẹ|父母|fùmǔ|kin person\ngia đình|家人|jiārén|kin person\nbạn bè|朋友|péngyou|person mw=个\nbạn trai|男朋友|nánpéngyou|kin person mw=个\nbạn gái|女朋友|nǚpéngyou|kin person mw=个\nbạn thân|好朋友|hǎopéngyou|person mw=个\nthầy giáo/thầy|老师|lǎoshī|person mw=位\ncô giáo|老师|lǎoshī|person mw=位\ngiáo viên|老师|lǎoshī|person mw=位\nhọc sinh|学生|xuésheng|person mw=个\nsinh viên|大学生|dàxuéshēng|person mw=个\nbác sĩ|医生|yīshēng|person mw=位\nngười yêu|对象|duìxiàng|kin person mw=个\nđứa trẻ/trẻ con/trẻ em|孩子|háizi|person mw=个\nnhà|家|jiā|kin place\nnhà|房子|fángzi|mw=套\nngôi nhà/căn nhà|房子|fángzi|mw=套\ntrường/trường học|学校|xuéxiào|kin place mw=所\nlớp/lớp học|班|bān|kin place\ncông ty|公司|gōngsī|kin place mw=家\nbệnh viện|医院|yīyuàn|place mw=家\nsiêu thị|超市|chāoshì|place mw=家\nchợ|市场|shìchǎng|place mw=个\nnhà hàng|饭馆|fànguǎn|place mw=家\nquán cà phê|咖啡馆|kāfēiguǎn|place mw=家\nngân hàng|银行|yínháng|place mw=家\nsân bay|机场|jīchǎng|place mw=个\nnhà ga/ga|火车站|huǒchēzhàn|place mw=个\nkhách sạn|酒店|jiǔdiàn|place mw=家\nthư viện|图书馆|túshūguǎn|place mw=个\nphòng|房间|fángjiān|place mw=个\nnhà máy|工厂|gōngchǎng|place kin mw=家\nvăn phòng|办公室|bàngōngshì|place mw=个\nViệt Nam|越南|Yuènán|place\nTrung Quốc|中国|Zhōngguó|place\nHà Nội|河内|Hénèi|place\nBắc Kinh|北京|Běijīng|place\nThượng Hải|上海|Shànghǎi|place\nQuảng Châu|广州|Guǎngzhōu|place\nThâm Quyến|深圳|Shēnzhèn|place\nĐài Loan|台湾|Táiwān|place\nHồng Kông|香港|Xiānggǎng|place\nSài Gòn/thành phố Hồ Chí Minh|胡志明市|Húzhìmíng Shì|place\nMỹ|美国|Měiguó|place\nNhật Bản/Nhật|日本|Rìběn|place\nHàn Quốc|韩国|Hánguó|place\nnước Anh|英国|Yīngguó|place\nPháp|法国|Fǎguó|place\nNghệ An|义安|Yì'ān|place\ntiếng Việt|越南语|Yuènányǔ|lang\ntiếng Trung/tiếng Hoa/tiếng Trung Quốc/tiếng Hán|汉语|Hànyǔ|lang\ntiếng Trung|中文|Zhōngwén|lang\ntiếng Anh|英语|Yīngyǔ|lang\ntiếng Nhật|日语|Rìyǔ|lang\ntiếng Hàn|韩语|Hányǔ|lang\ntiếng Pháp|法语|Fǎyǔ|lang\nxe buýt/xe bus|公交车|gōngjiāochē|trans=坐 mw=辆\nxe máy|摩托车|mótuōchē|trans=骑 mw=辆\nxe đạp|自行车|zìxíngchē|trans=骑 mw=辆\nô tô/xe hơi|汽车|qìchē|trans=坐 mw=辆\ntaxi/tắc xi|出租车|chūzūchē|trans=坐 mw=辆\nmáy bay|飞机|fēijī|trans=坐 mw=架\ntàu hoả/tàu hỏa/tàu|火车|huǒchē|trans=坐 mw=列\ntàu điện ngầm|地铁|dìtiě|trans=坐\nxe|车|chē|trans=坐 mw=辆\nsách|书|shū|mw=本\nvở|本子|běnzi|mw=个\nbút|笔|bǐ|mw=支\nđiện thoại|手机|shǒujī|mw=部\nmáy tính|电脑|diànnǎo|mw=台\náo/quần áo|衣服|yīfu|mw=件\nquần|裤子|kùzi|mw=条\ngiày|鞋|xié|mw=双\nmũ|帽子|màozi|mw=顶\nbàn|桌子|zhuōzi|mw=张\nghế|椅子|yǐzi|mw=把\ngiường|床|chuáng|mw=张\ncửa|门|mén|mw=扇\ncơm|饭|fàn|mw=碗 food\ncơm|米饭|mǐfàn|mw=碗 food\nnước|水|shuǐ|mw=杯 food\nnước|国家|guójiā|mw=个\ntrà/chè|茶|chá|mw=杯 food\ncà phê|咖啡|kāfēi|mw=杯 food\nbia|啤酒|píjiǔ|mw=瓶 food\nrượu|酒|jiǔ|mw=杯 food\nsữa|牛奶|niúnǎi|mw=杯 food\ntáo|苹果|píngguǒ|mw=个 food\nmón ăn/đồ ăn/thức ăn/món|菜|cài|mw=道 food\nphở|河粉|héfěn|mw=碗 food\nmì|面条|miàntiáo|mw=碗 food\ntiền|钱|qián|\nthời gian|时间|shíjiān|\nviệc/công việc|工作|gōngzuò|mw=份\nchuyện/việc/sự việc|事|shì|mw=件\nvấn đề|问题|wèntí|mw=个\nphim/bộ phim/bộ film|电影|diànyǐng|mw=部\nbài hát/bài|歌|gē|mw=首\nbóng đá|足球|zúqiú|\nbóng rổ|篮球|lánqiú|\ncầu lông|羽毛球|yǔmáoqiú|\ngame/trò chơi|游戏|yóuxì|\nđàn piano/piano|钢琴|gāngqín|\nđàn ghi ta/ghi ta|吉他|jítā|\ntrời|天|tiān|\nthời tiết|天气|tiānqì|\ntên|名字|míngzi|\ntuổi|岁|suì|unit\nnăm|年|nián|unit\ntháng|月|yuè|\nngày|天|tiān|unit\ntuần|星期|xīngqī|unit\ntiếng/tiếng đồng hồ/giờ đồng hồ|小时|xiǎoshí|unit\nphút|分钟|fēnzhōng|unit\ngiây|秒|miǎo|unit\nlần|次|cì|unit\nđồng|块|kuài|unit\nmàu|颜色|yánsè|\nmàu đỏ|红色|hóngsè|color\nmàu xanh|蓝色|lánsè|color\nmàu vàng|黄色|huángsè|color\nmàu trắng|白色|báisè|color\nmàu đen|黑色|hēisè|color\nmàu hồng|粉色|fěnsè|color\n@V\nđể dành/tiết kiệm|存|cún|\nchào mừng/hoan nghênh|欢迎|huānyíng|vp\nrút tiền|取钱|qǔqián|vo=取,钱\nnghe điện thoại|接电话|jiē diànhuà|vo=接,电话\ngiới thiệu|介绍|jièshào|\nchú ý an toàn|注意安全|zhùyì ānquán|\nôn bài/ôn tập|复习|fùxí|\nhọc bài|学习|xuéxí|\nlàm bài tập|做作业|zuò zuòyè|vo=做,作业\nđi bộ|走路|zǒulù|motion\nkhen/khen ngợi|表扬|biǎoyáng|\nchê/phê bình|批评|pīpíng|\nmắng/chửi|骂|mà|\nđánh|打|dǎ|\nlừa|骗|piàn|\nđi muộn/đến muộn/đi trễ/đến trễ|迟到|chídào|\nvề nước|回国|huíguó|\nbảo/kêu|叫|jiào|caus\nbắt/ép|逼|bī|caus\nnhờ|请|qǐng|caus\nchúc|祝|zhù|give\ncộng|加|jiā|\ntrừ|减|jiǎn|\nnhân với|乘以|chéngyǐ|\nchia cho|除以|chúyǐ|\nlà|是|shì|pos=COP\năn|吃|chī|\năn cơm|吃饭|chīfàn|vo=吃,饭\năn sáng|吃早饭|chī zǎofàn|vo=吃,早饭\năn tối|吃晚饭|chī wǎnfàn|vo=吃,晚饭\năn trưa|吃午饭|chī wǔfàn|vo=吃,午饭\nuống|喝|hē|\nđi|去|qù|motion\nđi|走|zǒu|\nđến/tới|到|dào|motion\nđến/tới|来|lái|motion\nvề|回|huí|motion\nra|出|chū|\nvào|进|jìn|\nlên|上|shàng|\nxuống|下|xià|\nngủ|睡觉|shuìjiào|vo=睡,觉 wo=睡:shuì\nthức dậy/dậy/ngủ dậy|起床|qǐchuáng|vo=起,床\nlàm|做|zuò|\nlàm|干|gàn|\nlàm việc|工作|gōngzuò|\nhọc|学习|xuéxí|wo=学:xué\nhọc|学|xué|\nđọc|读|dú|\nđọc sách|看书|kànshū|vo=看,书\nviết|写|xiě|\nnghe|听|tīng|\nnói|说|shuō|\nnói chuyện|聊天|liáotiān|vo=聊,天\nnói về|谈|tán|\nxem/coi|看|kàn|\nnhìn|看|kàn|\nthấy/nhìn thấy/trông thấy|看见|kànjiàn|\nthấy/cảm thấy|觉得|juéde|cog\nnghĩ/nghĩ rằng|觉得|juéde|cog\ncho rằng/cho là|认为|rènwéi|cog\nnghĩ|想|xiǎng|cog\ntưởng|以为|yǐwéi|cog\nbiết|知道|zhīdào|cog\nbiết|会|huì|pos=AUX sem=SKILL\nbiết|认识|rènshi|sem=KNOWP\nquen/quen biết|认识|rènshi|\nhiểu|懂|dǒng|\nhiểu|明白|míngbai|\nthích|喜欢|xǐhuan|vp\nyêu|爱|ài|vp\nghét|讨厌|tǎoyàn|vp\nsợ|怕|pà|vp\nlo/lo lắng|担心|dānxīn|\nmua|买|mǎi|\nbán|卖|mài|\nchơi|玩|wán|\nchạy|跑|pǎo|\nđi bộ|走路|zǒulù|vo=走,路\nbơi|游泳|yóuyǒng|vo=游,泳\nhát|唱歌|chànggē|vo=唱,歌 wo=唱:chàng\nnhảy/múa|跳舞|tiàowǔ|vo=跳,舞\nnấu ăn/nấu cơm|做饭|zuòfàn|vo=做,饭\nnấu|煮|zhǔ|\ngiúp/giúp đỡ|帮|bāng|\ngọi|叫|jiào|\ngọi điện/gọi điện thoại|打电话|dǎ diànhuà|vo=打,电话\ngặp/gặp gỡ|见|jiàn|\ngặp mặt|见面|jiànmiàn|vo=见,面\nchờ/đợi/chờ đợi|等|děng|\nmở|打开|dǎkāi|\nđóng|关|guān|\nngồi|坐|zuò|loc\nđứng|站|zhàn|loc\nsống|住|zhù|loc\nsống|生活|shēnghuó|\nnằm|躺|tǎng|loc\nmặc|穿|chuān|\nđội/đeo|戴|dài|\ncười|笑|xiào|\nkhóc|哭|kū|\nchết|死|sǐ|\nsinh ra|出生|chūshēng|loc\ncho|给|gěi|give\ntặng|送|sòng|give\ngửi|寄|jì|give\ntrả|还|huán|give\ntrả tiền/thanh toán|付钱|fùqián|vo=付,钱\nđưa|给|gěi|give\nmượn|借|jiè|give\nlấy|拿|ná|\nmang|带|dài|\ncầm|拿|ná|\ndạy|教|jiāo|give\nhỏi|问|wèn|give\ntrả lời|回答|huídá|\nbắt đầu|开始|kāishǐ|vp\nkết thúc|结束|jiéshù|\ntiếp tục|继续|jìxù|vp\nquyết định|决定|juédìng|vp\nchuẩn bị|准备|zhǔnbèi|vp\nđánh|打|dǎ|\nđá|踢|tī|\nmất|丢|diū|\ntìm/tìm kiếm|找|zhǎo|\nquên|忘|wàng|vp\nnhớ|想|xiǎng|sem=MISS\nnhớ|记得|jìde|cog\ntin/tin tưởng|相信|xiāngxìn|cog\nrửa/giặt|洗|xǐ|\ntắm|洗澡|xǐzǎo|vo=洗,澡\nlái/lái xe|开车|kāichē|vo=开,车\nlái|开|kāi|\nchụp ảnh|拍照|pāizhào|vo=拍,照\ndu lịch|旅游|lǚyóu|\nnghỉ/nghỉ ngơi|休息|xiūxi|\nlàm bài tập|做作业|zuò zuòyè|vo=做,作业\nđi làm|上班|shàngbān|vo=上,班 wo=去:qù\ntan làm/tan ca|下班|xiàbān|vo=下,班\nđi học|上学|shàngxué|vo=上,学 wo=去学:qù xué\ntan học|放学|fàngxué|vo=放,学\nvề nhà|回家|huíjiā|vo=回,家\nra ngoài|出去|chūqu|\nđi chơi|去玩|qù wán|\nmắng/chửi|骂|mà|\ncãi nhau|吵架|chǎojià|vo=吵,架\nđánh nhau|打架|dǎjià|vo=打,架\nhút thuốc|抽烟|chōuyān|vo=抽,烟\nuống rượu|喝酒|hējiǔ|vo=喝,酒\nkết hôn/cưới|结婚|jiéhūn|vo=结,婚\ncảm ơn/cám ơn|谢谢|xièxie|\nxin lỗi|对不起|duìbuqǐ|\ngiận/tức/bực/nổi giận|生气|shēngqì|\nmưa/trời mưa|下雨|xiàyǔ|vo=下,雨 noagent\ntuyết rơi/có tuyết|下雪|xiàxuě|vo=下,雪 noagent\ntên là/tên|叫|jiào|\ngiống|像|xiàng|sem=RESEMBLE\ntrở thành/thành|成为|chéngwéi|\ncó mặt|在|zài|\nở|在|zài|sem=BEAT\nbị ốm/ốm/bị bệnh/đổ bệnh|生病|shēngbìng|vo=生,病\nchuyển nhà|搬家|bānjiā|vo=搬,家\n@RES\nxong|完|wán|\nhết|完|wán|\nđược|到|dào|\nthấy|见|jiàn|\nrõ|清楚|qīngchu|\nsạch|干净|gānjìng|\nđúng|对|duì|\nsai|错|cuò|\nhiểu|懂|dǒng|\nnổi|动|dòng|\n@ADJ\nsạch sẽ|干净|gānjìng|\nkhó quên|难忘|nánwàng|\nhài lòng|满意|mǎnyì|\nđau đầu/nhức đầu|头疼|tóuténg|nohen\nđau bụng|肚子疼|dùzi téng|nohen\nsốt|发烧|fāshāo|nohen\ncảm/cảm cúm/bị cảm|感冒|gǎnmào|chg\nđiên/khùng|疯|fēng|chg\nđiên rồi|疯了|fēng le|\ntốt|好|hǎo|\nxấu|坏|huài|amb\nxấu|丑|chǒu|\nđẹp|漂亮|piàoliang|\nđẹp|美|měi|\nxinh/xinh đẹp/xinh xắn|漂亮|piàoliang|\nđẹp trai|帅|shuài|\ncao|高|gāo|\nthấp|矮|ǎi|\nlùn|矮|ǎi|\nto/lớn|大|dà|\nnhỏ/bé|小|xiǎo|\ndài|长|cháng|\nngắn|短|duǎn|\nmới|新|xīn|\ncũ|旧|jiù|\nnóng|热|rè|\nlạnh/rét|冷|lěng|\nmát/mát mẻ|凉快|liángkuai|\nấm/ấm áp|暖和|nuǎnhuo|\nnhanh|快|kuài|\nchậm|慢|màn|\nnhiều|多|duō|\nít|少|shǎo|\nkhó|难|nán|\ndễ|容易|róngyì|\nvui/vui vẻ|高兴|gāoxìng|\nvui|开心|kāixīn|\nbuồn|难过|nánguò|\nmệt|累|lèi|\nđói|饿|è|\nno|饱|bǎo|\nkhát|渴|kě|\ngầy|瘦|shòu|\nbéo/mập|胖|pàng|\nkhoẻ/khỏe/khỏe mạnh|好|hǎo|\nbận/bận rộn|忙|máng|\nrảnh|有空|yǒukòng|\nngon|好吃|hǎochī|\nđắt|贵|guì|\nrẻ|便宜|piányi|\nxa|远|yuǎn|\ngần|近|jìn|\nbẩn|脏|zāng|\ngiỏi|好|hǎo|\ngiỏi|厉害|lìhai|\nhay|好|hǎo|\nhay|有意思|yǒuyìsi|\nthông minh|聪明|cōngming|\nngu/ngốc/đần/ngu ngốc/ngu đần/đần độn|傻|shǎ|\nngu/ngốc|笨|bèn|\nlười/lười biếng|懒|lǎn|\nchăm chỉ/chăm|努力|nǔlì|\nquan trọng|重要|zhòngyào|\nnguy hiểm|危险|wēixiǎn|\nan toàn|安全|ānquán|\nồn/ồn ào|吵|chǎo|\nyên tĩnh|安静|ānjìng|\ntrẻ|年轻|niánqīng|\ngià|老|lǎo|\ngiàu|有钱|yǒuqián|\nnghèo|穷|qióng|\nđau|疼|téng|\nhạnh phúc|幸福|xìngfú|\nmay mắn|幸运|xìngyùn|\nthú vị|有意思|yǒuyìsi|\nchán/nhàm chán|无聊|wúliáo|\nđáng yêu/dễ thương|可爱|kě'ài|\nnổi tiếng|有名|yǒumíng|\nmuộn/trễ|晚|wǎn|\nsớm|早|zǎo|\nnặng|重|zhòng|\nnhẹ|轻|qīng|\ncay|辣|là|\nngọt|甜|tián|\nmặn|咸|xián|\nchua|酸|suān|\nđắng|苦|kǔ|\nvất vả/khổ/cực|辛苦|xīnkǔ|\ntối|黑|hēi|\nsáng|亮|liàng|\nđỏ|红|hóng|\nxanh|蓝|lán|amb\nxanh|绿|lǜ|\nvàng|黄|huáng|\ntrắng|白|bái|\nđen|黑|hēi|\nhồng|粉|fěn|\ntím|紫|zǐ|\nđông/đông đúc|多|duō|\nđúng|对|duì|\nsai|错|cuò|\nláo/hỗn/hỗn láo|狂|kuáng|\nkhó chịu|难受|nánshòu|\nlạ|奇怪|qíguài|\nmạnh|强|qiáng|\nyếu|弱|ruò|\ncẩn thận|小心|xiǎoxīn|\nđầy đủ|齐全|qíquán|\nrõ ràng|清楚|qīngchu|\nđúng giờ|准时|zhǔnshí|\nquen|熟悉|shúxī|\nnghiêm túc|认真|rènzhēn|\nhài/buồn cười|好笑|hǎoxiào|\n@PHR\nchúc bạn sinh nhật vui vẻ|祝你生日快乐|zhù nǐ shēngrì kuàilè|whole\nrất vui được gặp bạn/rất vui được gặp anh/rất vui được gặp chị|很高兴见到你|hěn gāoxìng jiàndào nǐ|whole\ntôi rất vui được gặp bạn/tôi rất vui được gặp anh/tôi rất vui được gặp chị|我很高兴见到你|wǒ hěn gāoxìng jiàndào nǐ|whole\nxin chào/chào bạn/chào/chào anh/chào chị|你好|nǐhǎo|whole\nchào mọi người|大家好|dàjiā hǎo|whole\nchào buổi sáng|早上好|zǎoshang hǎo|whole\nchúc ngủ ngon/ngủ ngon nhé|晚安|wǎn'ān|whole\ntạm biệt/hẹn gặp lại/bai bai|再见|zàijiàn|whole\ncảm ơn bạn/cám ơn bạn|谢谢你|xièxie nǐ|whole\ncảm ơn nhiều/cảm ơn bạn nhiều/cám ơn bạn nhiều/cảm ơn rất nhiều/cảm ơn bạn rất nhiều|非常感谢你|fēicháng gǎnxiè nǐ|whole\nđồ ngốc/đồ ngu/thằng ngu/con ngu/đồ đần|笨蛋|bèndàn|whole\nđồ khốn/thằng khốn/đồ khốn nạn|混蛋|húndàn|whole\nđồ điên/thằng điên|疯子|fēngzi|whole\nđồ lười/đồ lười biếng|懒鬼|lǎnguǐ|whole\nđồ tồi|渣男|zhānán|whole\ncái quái gì/cái gì vậy trời|什么鬼|shénme guǐ|pos=Q\nlàm cái quái gì/làm cái gì vậy|搞什么鬼|gǎo shénme guǐ|pos=V q\nkhông có gì/không có chi|不客气|bú kèqi|whole\nkhông sao/không sao đâu/không vấn đề gì|没关系|méi guānxi|whole\nchúc mừng năm mới|新年快乐|xīnnián kuàilè|whole\nchúc mừng sinh nhật|生日快乐|shēngrì kuàilè|whole\ncố lên|加油|jiāyóu|whole\nđược rồi/thôi được/ok rồi|好了|hǎo le|whole\nđúng rồi/đúng vậy/đúng thế|对|duì|whole\nrất vui được gặp bạn/rất vui được làm quen|很高兴认识你|hěn gāoxìng rènshi nǐ|whole\nbạn tên là gì/tên bạn là gì/bạn tên gì|你叫什么名字|nǐ jiào shénme míngzi|whole q\nbạn khỏe không/bạn có khỏe không|你好吗|nǐ hǎo ma|whole q\năn cơm chưa/bạn ăn cơm chưa|你吃饭了吗|nǐ chīfàn le ma|whole q\nmột chút/một ít/chút/tí/một tí/chút xíu|一点儿|yìdiǎnr|sem=ABIT\nnhiều hơn|更多|gèngduō|\ncàng ngày càng|越来越|yuèláiyuè|pos=DEG sem=MOREMORE\nnhư vậy/như thế/thế này/như này|这样|zhèyàng|pos=ADV\nvì vậy mà|所以|suǒyǐ|pos=CONJ sem=SO\nít nhất|至少|zhìshǎo|pos=ADV\nnhất là/đặc biệt là|尤其是|yóuqí shì|pos=ADV\n@IDIOM\nnước đổ đầu vịt/đàn gảy tai trâu|对牛弹琴|duìniú-tánqín|idiom\nmột công đôi việc/một mũi tên trúng hai đích/một mũi tên trúng hai con chim|一举两得|yìjǔ-liǎngdé|idiom\ntai vách mạch rừng|隔墙有耳|géqiáng-yǒu'ěr|idiom\nmất bò mới lo làm chuồng|亡羊补牢|wángyáng-bǔláo|idiom\nếch ngồi đáy giếng|井底之蛙|jǐngdǐ zhī wā|idiom\nnước chảy đá mòn|水滴石穿|shuǐdī-shíchuān|idiom\nbiết người biết ta|知己知彼|zhījǐ-zhībǐ|idiom\nđồng cam cộng khổ|同甘共苦|tónggān-gòngkǔ|idiom\ntrăm nghe không bằng một thấy|百闻不如一见|bǎiwén bùrú yíjiàn|idiom\nthuận buồm xuôi gió|一帆风顺|yìfān-fēngshùn|idiom\nvạn sự như ý|万事如意|wànshì-rúyì|idiom\ndục tốc bất đạt/nhanh quá hoá chậm|欲速则不达|yù sù zé bù dá|idiom\nnhập gia tuỳ tục/nhập gia tùy tục|入乡随俗|rùxiāng-suísú|idiom\năn cháo đá bát/qua cầu rút ván|过河拆桥|guòhé-chāiqiáo|idiom\nnửa tin nửa ngờ|半信半疑|bànxìn-bànyí|idiom\nlo bò trắng răng|杞人忧天|qǐrén-yōutiān|idiom\nvẽ rắn thêm chân|画蛇添足|huàshé-tiānzú|idiom\nđầu voi đuôi chuột|虎头蛇尾|hǔtóu-shéwěi|idiom\ncó chí thì nên/có chí làm quan|有志者事竟成|yǒu zhì zhě shì jìng chéng|idiom\nuống nước nhớ nguồn|饮水思源|yǐnshuǐ-sīyuán|idiom\ngần mực thì đen gần đèn thì sáng/gần mực thì đen, gần đèn thì sáng|近朱者赤，近墨者黑|jìn zhū zhě chì, jìn mò zhě hēi|idiom\nnói dễ hơn làm|说起来容易做起来难|shuō qǐlai róngyì zuò qǐlai nán|idiom\nkhông có lửa làm sao có khói|无风不起浪|wú fēng bù qǐ làng|idiom\ncái khó ló cái khôn|急中生智|jízhōng-shēngzhì|idiom\nlực bất tòng tâm|力不从心|lìbùcóngxīn|idiom\ntiền nào của nấy|一分钱一分货|yì fēn qián yì fēn huò|idiom\ngiận cá chém thớt|拿别人撒气|ná biérén sāqì|idiom\nthời gian là vàng bạc/thời gian là tiền bạc|时间就是金钱|shíjiān jiù shì jīnqián|idiom\nhọc đi đôi với hành|学以致用|xuéyǐzhìyòng|idiom\nchậm mà chắc|稳扎稳打|wěnzhā-wěndǎ|idiom\ncó công mài sắt có ngày nên kim|只要功夫深，铁杵磨成针|zhǐyào gōngfu shēn, tiěchǔ mó chéng zhēn|idiom\nmỗi người một ý|众说纷纭|zhòngshuō-fēnyún|idiom\n`;
  const NMW = {
    "书": '本',
    "本子": '个',
    "狗": '只',
    "猫": '只',
    "鸟": '只',
    "鸡": '只',
    "鱼": '条',
    "蛇": '条',
    "猪": '头',
    "牛": '头',
    "马": '匹',
    "车": '辆',
    "汽车": '辆',
    "自行车": '辆',
    "摩托车": '辆',
    "出租车": '辆',
    "衣服": '件',
    "事": '件',
    "事情": '件',
    "纸": '张',
    "桌子": '张',
    "床": '张',
    "照片": '张',
    "票": '张',
    "地图": '张',
    "电影": '部',
    "手机": '部',
    "电脑": '台',
    "电视": '台',
    "房子": '套',
    "树": '棵',
    "花": '朵',
    "笔": '支',
    "铅笔": '支',
    "鞋": '双',
    "筷子": '双',
    "歌": '首',
    "信": '封',
    "话": '句',
    "课": '节',
    "门": '扇',
    "山": '座',
    "桥": '座',
    "城市": '座',
    "河": '条',
    "路": '条',
    "裤子": '条',
    "裙子": '条',
    "帽子": '顶',
    "眼镜": '副',
    "老师": '位',
    "医生": '位',
    "客人": '位',
    "先生": '位',
    "椅子": '把',
    "伞": '把',
    "刀": '把',
    "学校": '所',
    "公司": '家',
    "医院": '家',
    "饭馆": '家',
    "商店": '家',
    "银行": '家',
    "问题": '个',
    "工作": '份',
    "报纸": '份',
    "礼物": '份',
    "菜": '道',
    "饭": '碗',
    "米饭": '碗',
    "水": '杯',
    "茶": '杯',
    "咖啡": '杯',
    "酒": '杯',
    "啤酒": '瓶',
    "牛奶": '杯'
  };
  const NOMW = new Set([ '天', '年', '岁', '次', '分钟', '秒', '块', '元', '公斤', '斤', '米', '公里', '星期天', '点', '号', '月', '页', '遍', '周', '倍' ]);
  const ANIM_ZH = /(狗|猫|猪|牛|马|鸡|鸭|鸟|鱼|虫|蛇|狼|熊|虎|猴|鼠|羊|兔|龟|象|驴)$/;
  const FW = {
    "我": 'wǒ',
    "你": 'nǐ',
    "他": 'tā',
    "她": 'tā',
    "它": 'tā',
    "很": 'hěn',
    "不": 'bù',
    "没": 'méi',
    "没有": 'méiyǒu',
    "了": 'le',
    "的": 'de',
    "得": 'de',
    "地": 'de',
    "吗": 'ma',
    "呢": 'ne',
    "吧": 'ba',
    "啊": 'a',
    "跟": 'gēn',
    "和": 'hé',
    "一样": 'yíyàng',
    "比": 'bǐ',
    "最": 'zuì',
    "更": 'gèng',
    "正在": 'zhèngzài',
    "在": 'zài',
    "想": 'xiǎng',
    "因为": 'yīnwèi',
    "所以": 'suǒyǐ',
    "像": 'xiàng',
    "太": 'tài',
    "也": 'yě',
    "都": 'dōu',
    "还": 'hái',
    "就": 'jiù',
    "才": 'cái',
    "给": 'gěi',
    "用": 'yòng',
    "从": 'cóng',
    "到": 'dào',
    "被": 'bèi',
    "把": 'bǎ',
    "让": 'ràng',
    "过": 'guo',
    "着": 'zhe',
    "会": 'huì',
    "要": 'yào',
    "快要": 'kuàiyào',
    "刚": 'gāng',
    "已经": 'yǐjīng',
    "是": 'shì',
    "有": 'yǒu',
    "个": 'gè',
    "这": 'zhè',
    "那": 'nà',
    "哪": 'nǎ',
    "什么": 'shénme',
    "谁": 'shéi',
    "哪儿": 'nǎr',
    "几": 'jǐ',
    "多少": 'duōshao',
    "怎么": 'zěnme',
    "怎么样": 'zěnmeyàng',
    "为什么": 'wèishénme',
    "什么时候": 'shénme shíhou',
    "一点儿": 'yìdiǎnr',
    "得多": 'de duō',
    "极了": 'jíle',
    "还是": 'háishì',
    "或者": 'huòzhě',
    "的时候": 'de shíhou',
    "以前": 'yǐqián',
    "以后": 'yǐhòu',
    "如果": 'rúguǒ',
    "虽然": 'suīrán',
    "但是": 'dànshì',
    "不但": 'búdàn',
    "而且": 'érqiě',
    "越": 'yuè',
    "越来越": 'yuèláiyuè',
    "又": 'yòu',
    "一边": 'yìbiān',
    "即使": 'jíshǐ',
    "只要": 'zhǐyào',
    "只有": 'zhǐyǒu',
    "一": 'yī',
    "们": 'men',
    "上": 'shang',
    "下": 'xia',
    "里": 'li',
    "外": 'wài',
    "前面": 'qiánmiàn',
    "后面": 'hòumiàn',
    "旁边": 'pángbiān',
    "那么": 'nàme',
    "这么": 'zhème',
    "请": 'qǐng',
    "别": 'bié',
    "再": 'zài',
    "先": 'xiān',
    "起": 'qǐ',
    "对": 'duì',
    "为": 'wèi',
    "为了": 'wèile',
    "比起": 'bǐqǐ',
    "来": 'lái',
    "去": 'qù',
    "坐": 'zuò',
    "骑": 'qí',
    "死了": 'sǐle',
    "是吗": 'shì ma',
    "对吧": 'duì ba',
    "可以吗": 'kěyǐ ma',
    "行吗": 'xíng ma',
    "是不是": 'shì bu shì',
    "不是": 'búshì',
    "好": 'hǎo',
    "好的": 'hǎode',
    "点": 'diǎn',
    "分": 'fēn',
    "半": 'bàn',
    "号": 'hào',
    "月": 'yuè',
    "年": 'nián',
    "星期": 'xīngqī',
    "第": 'dì',
    "两": 'liǎng',
    "零": 'líng',
    "二": 'èr',
    "三": 'sān',
    "四": 'sì',
    "五": 'wǔ',
    "六": 'liù',
    "七": 'qī',
    "八": 'bā',
    "九": 'jiǔ',
    "十": 'shí',
    "百": 'bǎi',
    "千": 'qiān',
    "万": 'wàn',
    "亿": 'yì',
    "多": 'duō',
    "每": 'měi',
    "所有": 'suǒyǒu',
    "一些": 'yìxiē',
    "这些": 'zhèxiē',
    "那些": 'nàxiē',
    "以内": 'yǐnèi',
    "左右": 'zuǒyòu',
    "岁": 'suì',
    "天": 'tiān',
    "次": 'cì',
    "个月": 'ge yuè',
    "个星期": 'ge xīngqī',
    "个小时": 'ge xiǎoshí',
    "小时": 'xiǎoshí',
    "分钟": 'fēnzhōng',
    "块": 'kuài',
    "本": 'běn',
    "只": 'zhī',
    "张": 'zhāng',
    "件": 'jiàn',
    "条": 'tiáo',
    "位": 'wèi',
    "辆": 'liàng',
    "杯": 'bēi',
    "瓶": 'píng',
    "碗": 'wǎn',
    "双": 'shuāng',
    "套": 'tào',
    "所": 'suǒ',
    "家": 'jiā',
    "部": 'bù',
    "台": 'tái',
    "支": 'zhī',
    "首": 'shǒu',
    "把": 'bǎ',
    "头": 'tóu',
    "匹": 'pǐ',
    "棵": 'kē',
    "朵": 'duǒ',
    "份": 'fèn',
    "道": 'dào',
    "封": 'fēng',
    "句": 'jù',
    "节": 'jié',
    "扇": 'shàn',
    "座": 'zuò',
    "顶": 'dǐng',
    "副": 'fù',
    "盒": 'hé',
    "包": 'bāo',
    "袋": 'dài',
    "层": 'céng',
    "颗": 'kē',
    "罐": 'guàn',
    "箱": 'xiāng',
    "顿": 'dùn',
    "架": 'jià',
    "列": 'liè',
    "盘": 'pán',
    "幅": 'fú',
    "对象": 'duìxiàng',
    "互相": 'hùxiāng',
    "一起": 'yìqǐ',
    "比较": 'bǐjiào',
    "有点儿": 'yǒudiǎnr',
    "非常": 'fēicháng',
    "真": 'zhēn',
    "挺": 'tǐng',
    "超": 'chāo',
    "特别": 'tèbié',
    "以为": 'yǐwéi',
    "关于": 'guānyú',
    "除了": 'chúle',
    "以外": 'yǐwài',
    "下雨": 'xiàyǔ',
    "走": 'zǒu',
    "得很": 'de hěn',
    "连": 'lián',
    "甚至": 'shènzhì',
    "直到": 'zhídào',
    "自从": 'zìcóng',
    "不然": 'bùrán',
    "然后": 'ránhòu',
    "不过": 'búguò',
    "由于": 'yóuyú',
    "越南语": 'Yuènányǔ',
    "喂": 'wèi',
    "能": 'néng',
    "可以": 'kěyǐ',
    "应该": 'yīnggāi',
    "必须": 'bìxū',
    "需要": 'xūyào',
    "敢": 'gǎn',
    "打算": 'dǎsuàn',
    "希望": 'xīwàng',
    "当": 'dāng',
    "而": 'ér',
    "比不上": 'bǐ bu shàng',
    "不如": 'bùrú',
    "相比": 'xiāngbǐ',
    "一直": 'yìzhí',
    "从来没": 'cónglái méi',
    "从来不": 'cónglái bù',
    "还没": 'hái méi',
    "还没有": 'hái méiyǒu',
    "不能": 'bù néng',
    "不想": 'bù xiǎng',
    "不要": 'bú yào',
    "不用": 'bú yòng',
    "不应该": 'bù yīnggāi',
    "不会": 'bú huì',
    "不敢": 'bù gǎn',
    "不可以": 'bù kěyǐ',
    "不行": 'bù xíng',
    "行": 'xíng',
    "可以": 'kěyǐ'
  };
  const TM = /[\u0300\u0301\u0303\u0309\u0323]/;
  function canonSyl(w) {
    const d = w.normalize('NFD'), m = d.match(TM);
    if (!m) return w;
    const base = d.replace(TM, '').normalize('NFC'), mm = base.match(/^(.*?)(oa|oe|uy)$/);
    if (!mm || /q$/.test(mm[1])) return w;
    return (mm[1] + (mm[2][0] + m[0]).normalize('NFC') + mm[2][1]).normalize('NFC');
  }
  const canon = s => String(s || '').normalize('NFC').toLowerCase().split(/\s+/).filter(Boolean).map(canonSyl).join(' ');
  const sdFallback = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  const SD = s => (typeof stripDiacritics === 'function' ? stripDiacritics : sdFallback)(String(s || ''));
  const cleanPy = py => String(py || '').split(/[\/／]/)[0].replace(/[\[［(（].*?[\]］)）]/g, '').replace(/[!！?？。.,，~]/g, '').trim();
  const put = (m, k, v) => (m.get(k) || m.set(k, []).get(k)).push(v);
  let LX = null;
  function lex() {
    if (LX) return LX;
    const core = new Map, coreS = new Map, zhpy = new Map;
    let pos = 'N';
    CORE_SRC.split('\n').forEach(line => {
      line = line.trim();
      if (!line) return;
      if (line[0] === '@') {
        pos = line.slice(1).trim();
        return;
      }
      const [vis, zh, py, fl] = line.split('|');
      const f = {};
      String(fl || '').split(/\s+/).filter(Boolean).forEach(t => {
        const k = t.indexOf('=');
        if (k < 0) f[t] = true; else f[t.slice(0, k)] = t.slice(k + 1);
      });
      const p = f.pos || pos, z = zh === '—' ? '' : zh;
      if (z && py && !zhpy.has(z)) zhpy.set(z, py);
      vis.split('/').forEach(v => {
        const k = canon(v);
        if (!k) return;
        const e = {
          vi: k,
          zh: z,
          py: py || '',
          pos: p,
          f: f
        };
        put(core, k, e);
        put(coreS, SD(k), e);
      });
    });
    return LX = {
      core: core,
      coreS: coreS,
      zhpy: zhpy
    };
  }
  let DX = null;
  function dict() {
    const X = TR()._index();
    if (DX && DX.X === X) return DX;
    const m = new Map;
    X.g1.forEach((arr, k) => {
      const c = canon(k);
      if (c) arr.forEach(x => put(m, c, x));
    });
    DX = {
      X: X,
      m: m,
      sents: X.sl.map(s => String(s.text).replace(/[^一-鿿]/g, '')).filter(Boolean),
      post: new Map,
      posC: null
    };
    return DX;
  }
  function posStats() {
    const D = dict();
    if (D.posC) return D.posC;
    const zh = D.X.zh, st = new Map;
    const AP = new Set([ '很', '太', '非常', '最', '更', '比较', '真', '挺', '有点儿', '特别', '十分', '这么', '那么', '越来越', '多么' ]);
    const VN = new Set([ '了', '着', '过' ]), VP = new Set([ '想', '要', '会', '能', '可以', '正在', '别', '应该', '开始', '喜欢', '去', '来', '不要', '没', '打算', '愿意', '必须', '继续' ]);
    const NP = new Set([ '个', '本', '只', '张', '件', '条', '位', '辆', '家', '些', '的', '这', '那', '一个', '这个', '那个', '每', '几', '这些', '那些' ]);
    D.sents.forEach(s => {
      const tk = [];
      let i = 0;
      while (i < s.length) {
        let L = Math.min(4, s.length - i);
        for (;L > 1; L--) if (zh.has(s.substr(i, L))) break;
        tk.push(s.substr(i, L));
        i += L;
      }
      tk.forEach((t, k) => {
        const p = tk[k - 1], n = tk[k + 1];
        let a = 0, v = 0, nn = 0;
        if (p && AP.has(p)) a++;
        if (n === '极了') a++;
        if (n && VN.has(n)) v++;
        if (p && VP.has(p)) v++;
        if (p && NP.has(p)) nn++;
        if (n === '的' && p && NP.has(p)) nn++;
        if (a || v || nn) {
          const o = st.get(t) || st.set(t, {
            a: 0,
            v: 0,
            n: 0
          }).get(t);
          o.a += a;
          o.v += v;
          o.n += nn;
        }
      });
    });
    return D.posC = st;
  }
  const VI_N = /^(sự|việc|cuộc|nỗi|niềm|tính|độ|người|nhà|máy|cái|con|bệnh|phòng|tiếng|môn|ngành|chiếc|quyển|bộ|hội|ban|khu|vùng|thành phố|nước|đồ|món|bài|câu|lời|giấy|cây|hoa|quả|trái|xe|tàu|thuốc|chú|bác|anh|chị|cô|ông|bà|thằng|đứa)( |$)/;
  const VI_V = /^(làm|bị|được|đi|ra|vào|lên|xuống|đánh|nói|mua|bán|xem|nghe|học|đọc|viết|giúp|tìm|gửi|mở|đóng|đưa|lấy|mang|chơi|chạy|ăn|uống|ngủ|tham gia|tổ chức|thực hiện|tiến hành|giải quyết|bảo vệ|phát triển|xây dựng|chuẩn bị|kiểm tra|thay đổi|nâng cao|tăng|giảm|gây|tạo|giả vờ|cố tình)( |$)/;
  const VI_A = /^(rất|có tính|dễ|khó|đầy|hơi|khá|thật|vô|bất)( |$)/;
  const ZH_N = /(子|人|家|者|员|机|器|馆|店|院|场|室|法|品|物|性|度|费|师|厂|车|站|路|书|表|图|业|界|局|部|区|市|省|国|色|课|题|处|片|架)$/;
  const VO_O = new Set([ ...'觉歌舞泳步班学面饭话澡床课书车家婚架烟酒雨雪病' ]);
  const posCache = new Map;
  function inferPos(zh, vi) {
    const k = zh + '|' + vi;
    if (posCache.has(k)) return posCache.get(k);
    const s = posStats().get(zh) || {
      a: 0,
      v: 0,
      n: 0
    };
    let a = s.a, v = s.v, n = s.n;
    if (VI_N.test(vi)) n += 2;
    if (VI_V.test(vi)) v += 2;
    if (VI_A.test(vi)) a += 2;
    if (ZH_N.test(zh) && zh.length > 1) n += 1.5;
    const m = Math.max(a, v, n), r = m === 0 ? 'N' : m === n ? 'N' : m === v ? 'V' : 'ADJ';
    posCache.set(k, r);
    return r;
  }
  function dictFlags(zh, pos) {
    const f = {};
    if (NMW[zh]) f.mw = NMW[zh];
    if (ANIM_ZH.test(zh)) f.anim = true;
    if (/(语|文)$/.test(zh) && zh.length >= 2) f.lang = true;
    if (/(市|国|省|院|馆|店|场|站|校|司|厂|园)$/.test(zh) && zh.length >= 2) f.place = true;
    if (pos === 'V' && zh.length === 2 && VO_O.has(zh[1])) f.vo = zh[0] + ',' + zh[1];
    return f;
  }
  const FUNC = new Set([ 'CMP', 'NEG', 'ASP', 'PERF', 'DEG', 'DEGP', 'AUX', 'ADV', 'PREP', 'CONJ', 'LOC', 'PART', 'INTJ', 'COP', 'HAVE', 'CL', 'Q', 'QA', 'DEM', 'RES', 'POSS', 'QUANT' ]);
  function candsOf(ph, noDia) {
    const L = lex(), D = dict(), out = [], seen = new Map;
    const add = c => {
      const k = c.zh + '|' + c.pos;
      const o = seen.get(k);
      if (o) {
        if (c.cost < o.cost) Object.assign(o, c);
        return;
      }
      seen.set(k, c);
      out.push(c);
    };
    const cs = L.core.get(ph) || (noDia ? L.coreS.get(SD(ph)) : null) || [];
    cs.forEach((e, i) => add({
      zh: e.zh,
      py: e.py,
      pos: e.pos,
      f: e.f,
      src: e.f.idiom ? 'idiom' : 'core',
      cost: i * .05,
      vi: e.vi
    }));
    const funcOnly = cs.length && cs.every(e => FUNC.has(e.pos));
    if (!funcOnly) {
      const ds = D.m.get(ph) || (noDia ? D.X.g2.get(SD(ph)) : null) || [];
      const nw = ph.split(' ').length;
      ds.forEach(({e: e, pos: pos}) => {
        if (!e || !e.text || !HANRE.test(e.text)) return;
        if (e.level === 'Data' || e.level === 'Câu') {
          const full = canon(String(e.meaning || '').replace(/[.,!?;:"“”()（）…]/g, ' '));
          if (full !== ph && (e.text.length >= 4 || nw >= 2) && e.text.length > nw + 1) return;
        }
        const p = inferPos(e.text, ph);
        const cost = (cs.length ? .55 : .2) + .06 * (e.rank || 7) + .22 * (pos || 0) + (e.level === 'Câu' ? .35 : 0) + (e.level === 'Data' ? .08 : 0) + (e.text.length > 4 ? .25 : 0);
        add({
          zh: e.text,
          py: cleanPy(e.pinyin),
          pos: p,
          f: dictFlags(e.text, p),
          src: e.level === 'Data' ? 'data' : e.level === 'Câu' ? 'learn' : 'dict',
          cost: cost,
          meaning: e.meaning,
          level: e.level,
          vi: ph
        });
      });
    }
    out.sort((a, b) => a.cost - b.cost);
    return out;
  }
  const NUMW = {
    'một': 1,
    hai: 2,
    ba: 3,
    'bốn': 4,
    'năm': 5,
    'sáu': 6,
    'bảy': 7,
    'bẩy': 7,
    'tám': 8,
    'chín': 9
  };
  const NUMX = {
    'mốt': 1,
    'tư': 4,
    'lăm': 5,
    'nhăm': 5
  };
  function parseNum(w, i) {
    const a = w[i];
    if (/^\d+([.,]\d+)?$/.test(a)) {
      let v = parseFloat(a.replace(',', '.')), L = 1;
      const m = {
        'nghìn': 1e3,
        'ngàn': 1e3,
        'triệu': 1e6,
        'tỷ': 1e9,
        'tỉ': 1e9,
        'trăm': 100,
        'vạn': 1e4
      }[w[i + 1]];
      if (m) {
        v *= m;
        L = 2;
      }
      return {
        v: v,
        L: L,
        digits: L === 1
      };
    }
    if (!(a in NUMW) && a !== 'mười' && a !== 'nửa') return null;
    if (a === 'nửa') return {
      v: .5,
      L: 1,
      half: true
    };
    let total = 0, cur = 0, pend = null, k = i, prev = null;
    for (;k < w.length; k++) {
      const x = w[k];
      if (x in NUMW) {
        if (pend !== null) {
          break;
        }
        if (prev === 'mươi' || prev === 'mười' || prev === 'linh' || prev === 'lẻ') {
          cur += NUMW[x];
          prev = 'd2';
          continue;
        }
        if (prev === 'd2') break;
        pend = NUMW[x];
        prev = 'd';
        continue;
      }
      if (x in NUMX && (prev === 'mươi' || prev === 'mười' || prev === 'd' && pend)) {
        if (prev === 'd') {
          cur += pend * 10 + NUMX[x];
          pend = null;
        } else cur += NUMX[x];
        prev = 'd2';
        continue;
      }
      if (x === 'mười' && pend === null && prev !== 'mười' && prev !== 'mươi' && prev !== 'd2') {
        cur += 10;
        prev = 'mười';
        continue;
      }
      if (x === 'mươi' && pend !== null) {
        cur += pend * 10;
        pend = null;
        prev = 'mươi';
        continue;
      }
      if (x === 'trăm') {
        cur += (pend === null ? 1 : pend) * 100;
        pend = null;
        prev = 'trăm';
        continue;
      }
      if ((x === 'linh' || x === 'lẻ') && prev === 'trăm') {
        prev = 'linh';
        continue;
      }
      const mul = {
        'nghìn': 1e3,
        'ngàn': 1e3,
        'vạn': 1e4,
        'triệu': 1e6,
        'tỷ': 1e9,
        'tỉ': 1e9
      }[x];
      if (mul && (pend !== null || cur)) {
        total += (cur + (pend || 0)) * mul;
        cur = 0;
        pend = null;
        prev = 'mul';
        continue;
      }
      break;
    }
    if (prev === 'linh') k--;
    const v = total + cur + (pend || 0);
    return k > i && v > 0 ? {
      v: v,
      L: k - i
    } : null;
  }
  const ZD = '零一二三四五六七八九';
  function zhNum(n, top) {
    n = Math.floor(n);
    if (top === undefined) top = true;
    if (n === 0) return '零';
    if (n >= 1e8) {
      const r = n % 1e8;
      return zhNum(n / 1e8, top) + '亿' + (r ? (r < 1e7 ? '零' : '') + zhNum(r, false) : '');
    }
    if (n >= 1e4) {
      const r = n % 1e4;
      return zhNum(n / 1e4, top) + '万' + (r ? (r < 1e3 ? '零' : '') + zhNum(r, false) : '');
    }
    const U = [ '千', '百', '十', '' ], P = [ 1e3, 100, 10, 1 ];
    let s = '', z = false;
    for (let k = 0; k < 4; k++) {
      const d = Math.floor(n / P[k]) % 10;
      if (d) {
        if (z) s += '零';
        s += ZD[d] + U[k];
        z = false;
      } else if (s) z = true;
    }
    if (top && s.startsWith('一十')) s = s.slice(1);
    return s;
  }
  function numZh(nt, liang) {
    if (!nt) return '';
    if (nt.half) return '半';
    if (nt.digits) return String(nt.v);
    if (nt.v % 1) return zhNum(Math.floor(nt.v)) + '点' + String(nt.v).split('.')[1].split('').map(d => ZD[+d]).join('');
    if (nt.v === 2 && liang) return '两';
    if (liang && nt.v >= 2e3 && nt.v < 3e3 && nt.v % 1e3 === 0) return '两千';
    return zhNum(nt.v);
  }
  let CPY = null;
  function charPy() {
    if (CPY) return CPY;
    CPY = new Map;
    const tm = window.PracticeHub && window.PracticeHub.toMarks;
    if (!tm) return CPY;
    const cnt = new Map;
    dict().X.list.forEach(e => {
      const ch = [ ...e.text ];
      if (!e.syl || e.syl.length !== ch.length) return;
      ch.forEach((c, i) => {
        const y = tm(e.syl[i], e.tones[i]);
        const k = c + '|' + y;
        cnt.set(k, (cnt.get(k) || 0) + (e.rank <= 6 ? 7 - e.rank : 1));
      });
    });
    const best = new Map;
    cnt.forEach((n, k) => {
      const [c, y] = k.split('|');
      const b = best.get(c);
      if (!b || n > b[1]) best.set(c, [ y, n ]);
    });
    best.forEach((v, c) => CPY.set(c, v[0]));
    return CPY;
  }
  function pyOf(zh) {
    if (!zh) return '';
    if (/\d/.test(zh) && HANRE.test(zh)) return zh.match(/\d+|[^\d]+/g).map(x => /\d/.test(x) ? x : pyOf(x)).join(' ');
    if (FW[zh] != null) return FW[zh];
    const L = lex();
    if (L.zhpy.has(zh)) return L.zhpy.get(zh);
    const X = dict().X, e = X.zh.get(zh);
    if (e && e[0] && e[0].pinyin) return cleanPy(e[0].pinyin).replace(/\s+/g, '');
    if (/^\d+$/.test(zh)) return zh;
    const cp = charPy();
    return [ ...zh ].map(c => /\d/.test(c) ? c : FW[c] != null ? FW[c] : L.zhpy.has(c) ? L.zhpy.get(c) : X.zh.get(c) && X.zh.get(c)[0] ? cleanPy(X.zh.get(c)[0].pinyin) : cp.get(c) || '').join('');
  }
  const TONE_OF = {};
  [ 'āēīōūǖ', 'áéíóúǘ', 'ǎěǐǒǔǚ', 'àèìòùǜ' ].forEach((s, i) => [ ...s ].forEach(c => TONE_OF[c] = i + 1));
  const firstTone = s => {
    for (const c of String(s || '').normalize('NFC')) if (TONE_OF[c]) return TONE_OF[c];
    return 0;
  };
  const MARK = new Set([ 'hơn', 'nhất', 'như', 'đang', 'đã', 'sẽ', 'không', 'chưa', 'rất', 'lắm', 'quá', 'của', 'và', 'với', 'cho', 'ở', 'là', 'có', 'bằng', 'được', 'bị', 'thì', 'mà', 'nên', 'vì', 'nếu', 'cũng', 'đều', 'còn', 'rồi', 'nữa', 'này', 'kia', 'đó', 'ấy', 'gì', 'ai', 'đâu', 'nào', 'sao', 'muốn', 'phải', 'cần', 'đừng', 'hãy', 'thế', 'vậy', 'chứ', 'à', 'nhé', 'nhỉ', 'ạ', 'hả', 'lại', 'mới', 'vừa', 'từ', 'đến', 'tới', 'về', 'trong', 'trên', 'dưới', 'sau', 'trước', 'các', 'những', 'tôi', 'mày', 'tao', 'bạn', 'anh', 'chị', 'em', 'nó', 'họ', 'đi' ]);
  function splitSentences(raw) {
    const out = [];
    let buf = '';
    const s = String(raw || '').replace(/\r/g, '').replace(/[“”"]/g, '');
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      buf += c;
      if (/[.!?…。！？\n]/.test(c)) {
        while (i + 1 < s.length && /[.!?…。！？]/.test(s[i + 1])) buf += s[++i];
        if (buf.trim()) out.push(buf.trim());
        buf = '';
      }
    }
    if (buf.trim()) out.push(buf.trim());
    return out.map(t => {
      const end = (t.match(/[.!?…。！？]+$/) || [ '' ])[0];
      return {
        text: t,
        body: t.slice(0, t.length - end.length),
        q: /[?？]/.test(end),
        excl: /[!！]/.test(end)
      };
    });
  }
  function words(body) {
    const out = [];
    String(body).normalize('NFC').replace(/([,，;；:：()（）\-–—])/g, ' $1 ').split(/\s+/).filter(Boolean).forEach(w => {
      if (/^[,，;；:：]$/.test(w)) {
        out.push({
          w: ',',
          o: w,
          punct: true
        });
        return;
      }
      if (/^[()（）\-–—]$/.test(w)) return;
      const m = w.match(/^(\d+)(h|k|tr|kg|km|m|cm|%|đ)$/i);
      if (m) {
        out.push({
          w: m[1],
          o: m[1]
        });
        out.push({
          w: {
            h: 'giờ',
            k: 'nghìn',
            tr: 'triệu',
            kg: 'ký',
            km: 'km',
            m: 'mét',
            cm: 'cm',
            '%': '%',
            'đ': 'đồng'
          }[m[2].toLowerCase()],
          o: m[2]
        });
        return;
      }
      out.push({
        w: canon(w),
        o: w
      });
    });
    return out;
  }
  function segment(W, noDia) {
    const n = W.length, best = new Array(n + 1).fill(Infinity), back = new Array(n + 1).fill(null);
    best[0] = 0;
    const relax = (i, j, c, info) => {
      if (best[i] + c < best[j]) {
        best[j] = best[i] + c;
        back[j] = Object.assign({
          i: i,
          j: j
        }, info);
      }
    };
    for (let i = 0; i < n; i++) {
      if (best[i] === Infinity) continue;
      if (W[i].punct) {
        relax(i, i + 1, 0, {
          punct: true
        });
        continue;
      }
      const nm = parseNum(W.map(x => x.w), i);
      if (nm && !W.slice(i, i + nm.L).some(x => x.punct)) relax(i, i + nm.L, .55 - .3 * (nm.L - 1), {
        num: nm
      });
      for (let L = Math.min(10, n - i); L >= 1; L--) {
        const seg = W.slice(i, i + L);
        if (seg.some(x => x.punct)) continue;
        const ph = seg.map(x => x.w).join(' '), cs = candsOf(ph, noDia);
        if (!cs.length) continue;
        const top = cs[0], whole = i === 0 && L === n - (W[n - 1] && W[n - 1].punct ? 1 : 0);
        if (top.f && top.f.whole && !whole) {
          const alt = cs.filter(c => !(c.f && c.f.whole));
          if (!alt.length) continue;
        }
        let c;
        if (top.src === 'idiom') c = .3 - .9 * L; else if (top.src === 'core') c = .9 - .75 * (L - 1) - (top.f && top.f.whole && whole ? 1 : 0); else {
          c = 1.25 + .04 * (top.level === 'Data' ? 6 : 3) + .1 * (top.cost || 0) - .5 * (L - 1);
          if (L > 1 && (MARK.has(seg[0].w) || MARK.has(seg[L - 1].w)) && !whole) c += 1.4;
          if (top.src === 'data' && L >= 3) c -= .25 * (L - 2);
          if (top.src === 'learn') c += .4;
          const L0 = lex();
          if (L > 1 && seg.every(x => L0.core.has(x.w)) && !(top.level && /HSK[123]$/.test(top.level))) c += .95;
        }
        relax(i, i + L, c, {
          ph: ph,
          cs: cs
        });
      }
      const cap = /^[A-ZÀ-Ỹ]/.test(W[i].o) && i > 0 && !(W[i - 1] && W[i - 1].punct);
      relax(i, i + 1, cap ? 2.2 : 4, {
        unk: true,
        cap: cap
      });
    }
    const out = [];
    let p = n;
    while (p > 0) {
      const b = back[p];
      if (!b) {
        p--;
        continue;
      }
      out.unshift(b);
      p = b.i;
    }
    return out.map((b, k) => {
      const o = W.slice(b.i, b.j).map(x => x.o).join(' ');
      if (b.punct) return {
        vi: ',',
        o: o,
        pos: 'PUNCT',
        cands: [],
        sel: 0
      };
      if (b.num) {
        const t = {
          vi: W.slice(b.i, b.j).map(x => x.w).join(' '),
          o: o,
          pos: 'NUM',
          num: b.num,
          cands: [],
          sel: 0
        };
        if (b.num.L === 1) t.alt = candsOf(t.vi, noDia);
        return t;
      }
      if (b.unk) return {
        vi: W[b.i].w,
        o: o,
        pos: b.cap ? 'NAME' : 'UNK',
        cands: [],
        sel: 0,
        unk: true
      };
      let cs = b.cs;
      const whole = b.i === 0 && b.j >= n - (W[n - 1] && W[n - 1].punct ? 1 : 0);
      if (!whole) cs = cs.filter(c => !(c.f && c.f.whole));
      return {
        vi: b.ph,
        o: o,
        pos: cs[0].pos,
        cands: cs,
        sel: 0,
        f: cs[0].f || {}
      };
    });
  }
  const cur = t => t && t.cands && t.cands[t.sel] || null;
  const zhOf = t => {
    const c = cur(t);
    return c ? c.zh : '';
  };
  const has = (t, pos) => !!(t && t.cands && t.cands.some(c => c.pos === pos));
  function choose(t, pos, test) {
    if (!t || !t.cands) return false;
    const k = t.cands.findIndex(c => c.pos === pos && (!test || test(c)));
    if (k < 0) return false;
    t.sel = k;
    t.pos = pos;
    t.f = t.cands[k].f || {};
    return true;
  }
  const isW = (t, ...vs) => !!t && vs.includes(t.vi);
  const semOf = t => {
    const c = cur(t);
    return c && c.f ? c.f.sem : undefined;
  };
  function chunkNumbers(T) {
    const out = [];
    for (let k = 0; k < T.length; k++) {
      const t = T[k], n1 = T[k + 1], n2 = T[k + 2], n3 = T[k + 3];
      if (t.vi === 'thứ' && n1 && n1.pos === 'NUM' && n1.num.v >= 2 && n1.num.v <= 7) {
        out.push(mkTime('thứ ' + n1.vi, '星期' + '一二三四五六'[n1.num.v - 2], 'point'));
        k++;
        continue;
      }
      if (t.vi === 'thứ' && n1 && (n1.vi === 'nhất' || n1.pos === 'NUM')) {
        const v = n1.vi === 'nhất' ? 1 : n1.num.v;
        out.push(mkTok('thứ ' + n1.vi, '第' + zhNum(v), 'NUM', {
          ord: true
        }));
        k++;
        continue;
      }
      if (isW(t, 'ngày', 'mùng', 'mồng') && n1 && n1.pos === 'NUM' && n1.num.v <= 31) {
        let zh = numZh(n1.num) + '号', vi = t.vi + ' ' + n1.vi, j = k + 1;
        if (isW(T[j + 1], 'tháng') && T[j + 2] && T[j + 2].pos === 'NUM') {
          zh = numZh(T[j + 2].num) + '月' + zh;
          vi += ' tháng ' + T[j + 2].vi;
          j += 2;
        }
        if (isW(T[j + 1], 'năm') && T[j + 2] && T[j + 2].pos === 'NUM') {
          zh = (T[j + 2].num.digits ? T[j + 2].num.v : zhNum(T[j + 2].num.v).split('').join('')) + '年' + zh;
          vi += ' năm ' + T[j + 2].vi;
          j += 2;
        }
        out.push(mkTime(vi, zh, 'point'));
        k = j;
        continue;
      }
      if (isW(t, 'tháng') && n1 && n1.pos === 'NUM' && n1.num.v <= 12 && !(T[k - 1] && T[k - 1].pos === 'NUM')) {
        let zh = numZh(n1.num) + '月', vi = 'tháng ' + n1.vi, j = k + 1;
        if (isW(T[j + 1], 'năm') && T[j + 2] && T[j + 2].pos === 'NUM') {
          zh = T[j + 2].num.v + '年' + zh;
          vi += ' năm ' + T[j + 2].vi;
          j += 2;
        }
        out.push(mkTime(vi, zh, 'point'));
        k = j;
        continue;
      }
      if (isW(t, 'năm') && n1 && n1.pos === 'NUM' && (n1.num.digits || n1.num.v >= 1e3) && !(T[k - 1] && T[k - 1].pos === 'NUM')) {
        out.push(mkTime('năm ' + n1.vi, n1.num.v + '年', 'point'));
        k++;
        continue;
      }
      if (t.pos === 'NUM' && n1 && isW(n1, 'giờ') && !isW(T[k - 1], 'mất', 'trong', 'khoảng', 'hết')) {
        let h = t.num.v, zh, vi = t.vi + ' giờ', j = k + 1;
        if (isW(n2, 'rưỡi')) {
          zh = numZh(t.num, true) + '点半';
          vi += ' rưỡi';
          j++;
        } else if (isW(n2, 'kém') && n3 && n3.pos === 'NUM') {
          zh = numZh({
            v: h - 1,
            digits: t.num.digits
          }, true) + '点' + (60 - n3.num.v) + '分';
          vi += ' kém ' + n3.vi;
          j += 2;
          if (isW(T[j + 1], 'phút')) j++;
        } else if (n2 && n2.pos === 'NUM') {
          zh = numZh(t.num, true) + '点' + (n2.num.digits ? n2.num.v : zhNum(n2.num.v)) + '分';
          vi += ' ' + n2.vi;
          j++;
          if (isW(T[j + 1], 'phút')) {
            vi += ' phút';
            j++;
          }
        } else zh = numZh(t.num, true) + '点';
        if (isW(T[j + 1], 'sáng')) {
          zh = '早上' + zh;
          vi += ' sáng';
          j++;
        } else if (isW(T[j + 1], 'chiều')) {
          zh = '下午' + zh;
          vi += ' chiều';
          j++;
        } else if (isW(T[j + 1], 'tối')) {
          zh = '晚上' + zh;
          vi += ' tối';
          j++;
        }
        const pre = out[out.length - 1];
        if (pre && isW(pre, 'lúc', 'vào lúc', 'vào', 'khi', 'hồi')) {
          out.pop();
          vi = pre.vi + ' ' + vi;
        }
        out.push(mkTime(vi, zh, 'point'));
        k = j;
        continue;
      }
      if (t.pos === 'NUM' && !t.num.ord && n1) {
        const U = {
          'tiếng': [ '个小时', 'dur' ],
          'giờ': [ '个小时', 'dur' ],
          'tiếng đồng hồ': [ '个小时', 'dur' ],
          'giờ đồng hồ': [ '个小时', 'dur' ],
          'phút': [ '分钟', 'dur' ],
          'giây': [ '秒', 'dur' ],
          'ngày': [ '天', 'dur' ],
          'tuần': [ '个星期', 'dur' ],
          'tháng': [ '个月', 'dur' ],
          'năm': [ '年', 'dur' ],
          'tuổi': [ '岁', 'age' ],
          'lần': [ '次', 'freq' ],
          'đồng': [ '块', 'money' ],
          'nghìn đồng': [ '千块', 'money' ]
        }[n1.vi];
        if (U) {
          let zh = numZh(t.num, true), vi = t.vi + ' ' + n1.vi, j = k + 1;
          if (t.num.half) zh = '半' + U[0].replace('个', ''); else if (isW(n2, 'rưỡi')) {
            zh += U[0].startsWith('个') ? '个半' + U[0].slice(1) : U[0] + '半';
            vi += ' rưỡi';
            j++;
          } else zh += U[0];
          if (t.num.half) zh = '半' + (U[0] === '个小时' ? '个小时' : U[0] === '个月' ? '个月' : U[0]);
          out.push(mkTok(vi, zh, U[1] === 'age' || U[1] === 'money' ? 'QTY' : 'TIME', {
            kind: U[1]
          }));
          k = j;
          continue;
        }
      }
      out.push(t);
    }
    return out;
  }
  function mkTok(vi, zh, pos, f) {
    return {
      vi: vi,
      o: vi,
      pos: pos,
      cands: [ {
        zh: zh,
        py: pyOf(zh),
        pos: pos,
        f: f || {},
        src: 'rule'
      } ],
      sel: 0,
      f: f || {}
    };
  }
  function mkTime(vi, zh, kind) {
    return mkTok(vi, zh, 'TIME', {
      kind: kind
    });
  }
  const PRED_START = new Set([ 'V', 'ADJ', 'NEG', 'ASP', 'AUX', 'ADV', 'DEG', 'COP', 'HAVE', 'QA', 'PREP', 'TIME', 'QTY' ]);
  const isNomPos = p => [ 'N', 'PRON', 'NAME', 'PLACE', 'DEM', 'NUM', 'QTY' ].includes(p);
  const POT = {
    'hiểu': '懂',
    'thấy': '见',
    'hết': '完',
    xong: '完',
    'nổi': '动',
    'kịp': '及',
    ra: '出来',
    'rõ': '清楚',
    'tới': '到',
    'đến': '到',
    'được': '了'
  };
  const EMO = {
    'yêu': '很',
    'thích': '很',
    'nhớ': '很',
    'ghét': '很',
    'sợ': '很',
    'thương': '很',
    'quý': '很',
    'cảm ơn': '非常',
    'cám ơn': '非常',
    'xin lỗi': '非常'
  };
  function prepass(T) {
    const hasV = t => t && (t.pos === 'V' || t.cands && t.cands.some(c => c.pos === 'V'));
    const realLast = () => {
      let j = T.length - 1;
      while (j >= 0 && T[j].pos === 'PUNCT') j--;
      return j;
    };
    const PPY = {
      '不着': 'bù zháo',
      '不了': 'bù liǎo',
      '不懂': 'bù dǒng',
      '不完': 'bù wán',
      '不见': 'bú jiàn',
      '不动': 'bú dòng',
      '不及': 'bù jí',
      '不出来': 'bù chūlái',
      '不清楚': 'bù qīngchu',
      '不到': 'bú dào'
    };
    const setTok = (t, zh, pos, f) => {
      t.pos = pos;
      t.cands = [ {
        zh: zh,
        py: PPY[zh] || pyOf(zh),
        pos: pos,
        f: f || {},
        src: 'rule'
      } ];
      t.sel = 0;
      t.f = f || {};
    };
    for (let k = 0; k < realLast(); k++) if (T[k].pos === 'PART' && hasV(T[k]) && T[k + 1] && T[k + 1].pos !== 'PUNCT') choose(T[k], 'V');
    for (let k = 1; k < T.length; k++) {
      const t = T[k], p = T[k - 1], nx = T[k + 1];
      if (t.vi === 'không được' && p && hasV(p) && ![ 'PRON', 'N', 'NUM', 'NAME' ].includes(p.pos) && k === realLast()) {
        if (p.pos !== 'V') choose(p, 'V');
        setTok(t, p.vi === 'ngủ' ? '不着' : '不了', 'RES', {
          pot: true
        });
        continue;
      }
      if (t.vi === 'không' && p && hasV(p) && ![ 'PRON', 'N', 'NUM', 'NAME' ].includes(p.pos) && p.vi !== 'có' && nx && POT[nx.vi] && (nx.vi !== 'được' || k + 1 === realLast())) {
        if (p.pos !== 'V') choose(p, 'V');
        setTok(nx, p.vi === 'ngủ' && nx.vi === 'được' ? '不着' : '不' + POT[nx.vi], 'RES', {
          pot: true
        });
        T.splice(k, 1);
        k--;
        continue;
      }
      if ((t.vi === 'nhất' || t.vi === 'nhất là') && p && p.pos === 'V' && !(nx && nx.pos === 'ADJ')) {
        if (t.vi === 'nhất là') {
          T.splice(k, 1);
          T.splice(k - 1, 0, mkTok('nhất', '最', 'DEG', {
            sem: 'SUPV'
          }));
          k++;
          continue;
        }
        T.splice(k, 1);
        if (T[k] && T[k].vi === 'là') T.splice(k, 1);
        T.splice(k - 1, 0, mkTok('nhất', '最', 'DEG', {
          sem: 'SUPV'
        }));
        k++;
        continue;
      }
      if (t.vi === 'bằng' && p && p.pos === 'NUM' && nx && nx.pos === 'NUM') {
        setTok(t, '等于', 'V', {});
        continue;
      }
    }
    for (let k = 0; k < T.length; k++) {
      const t = T[k], p = T[k - 1], nx = T[k + 1];
      if (t.vi === 'được' && p && (p.pos === 'ADJ' || [ 'vui', 'hân hạnh', 'may mắn', 'buồn' ].includes(p.vi)) && nx && hasV(nx)) {
        T.splice(k, 1);
        if (nx.vi === 'gặp') setTok(nx, '见到', 'V', {});
        k--;
        continue;
      }
      if ([ 'ai', 'gì', 'cái gì', 'đâu', 'ở đâu' ].includes(t.vi) && nx && nx.vi === 'cũng') {
        const Z = {
          ai: '谁',
          'gì': '什么',
          'cái gì': '什么',
          'đâu': '哪儿',
          'ở đâu': '哪儿'
        }[t.vi];
        setTok(t, Z, t.vi === 'ai' ? 'PRON' : 'N', {
          indef: true
        });
        setTok(nx, '都', 'ADV', {});
      }
      if (k === 1 && p && p.pos === 'PRON' && t.pos === 'ADJ' && !has(t, 'V') && nx && (nx.pos === 'N' || has(nx, 'N')) && T[k + 2] && T[k + 2].vi === 'hơn') {
        if (nx.pos !== 'N') choose(nx, 'N');
        T.splice(0, 3, nx, mkTok('của', '的', 'POSS', {}), p, t);
        T._reorder = 'A + tính từ + lĩnh vực + hơn + B → A 的 + lĩnh vực + 比 B + tính từ (我的英语比他好)';
        break;
      }
    }
    for (let k = 0; k < T.length; k++) {
      const t = T[k], p = T[k - 1], nx = T[k + 1];
      if (t.pos === 'TIME' && nx && [ 'này', 'đó', 'ấy', 'kia' ].includes(nx.vi) && !/^[这那今明昨去上下]/.test(zhOf(t))) {
        const z = (nx.vi === 'này' ? '这个' : '那个') + zhOf(t), zpy = (nx.vi === 'này' ? 'zhège ' : 'nàge ') + (cur(t) && cur(t).py || pyOf(zhOf(t)));
        setTok(t, z, 'TIME', {
          kind: 'point'
        });
        t.cands[0].py = zpy;
        T.splice(k + 1, 1);
        continue;
      }
      if (t.vi === 'bị' && nx && (nx.pos === 'ADJ' || [ 'ốm', 'bệnh', 'sốt', 'cảm', 'đau' ].includes(nx.vi.split(' ')[0]))) {
        T.splice(k, 1);
        k--;
        continue;
      }
      if (t.vi === 'nhau' && p && p.pos === 'V') {
        T.splice(k, 1);
        if (![ 'quen', 'gặp', 'yêu', 'cưới', 'quen biết', 'chia tay', 'cãi', 'cãi nhau', 'nói chuyện' ].includes(p.vi)) T.splice(k - 1, 0, mkTok('nhau', '互相', 'ADV', {}));
        k--;
        continue;
      }
      if (t.vi === 'thêm' && p && p.pos === 'V') {
        T.splice(k, 1);
        T.splice(k - 1, 0, mkTok('thêm', '多', 'ADV', {}));
        continue;
      }
      if ([ 'như thế', 'như vậy', 'thế này', 'như này' ].includes(t.vi) && p && p.pos === 'ADJ') {
        setTok(t, '这么', 'DEGP', {
          sem: 'SO'
        });
        continue;
      }
    }
    for (let k = 0; k < T.length; k++) {
      const t = T[k], p = T[k - 1], nx = T[k + 1];
      const PUT = {
        'đặt': '放',
        'để': '放',
        'bỏ': '放',
        'cất': '放',
        'xếp': '放',
        treo: '挂',
        'dán': '贴',
        'cắm': '插'
      };
      if (PUT[t.vi] && k + 3 < T.length) {
        let m = k + 1;
        while (m < T.length && [ 'N', 'CL', 'DEM', 'NUM', 'QUANT', 'NAME', 'PRON', 'ADJ' ].includes(T[m].pos) && ![ 'lên', 'vào', 'trên', 'trong', 'xuống', 'dưới', 'ở' ].includes(T[m].vi)) m++;
        const D = T[m], DL = {
          'lên': '上',
          'trên': '上',
          'vào': '里',
          trong: '里',
          'xuống': '下',
          'dưới': '下'
        };
        if (m > k + 1 && D && (DL[D.vi] || D.vi === 'ở') && T[m + 1] && [ 'N', 'PLACE', 'NAME', 'LOC' ].includes(T[m + 1].pos)) {
          const objT = T.slice(k + 1, m);
          objT.forEach((x, xi) => {
            if (x.pos === 'CL' && has(x, 'N') && !(objT[xi + 1] && [ 'N', 'NAME' ].includes(objT[xi + 1].pos))) choose(x, 'N');
          });
          setTok(t, PUT[t.vi], 'V', {
            loc: true,
            ba: true
          });
          const ba = mkTok(t.o, '把', 'PREP', {
            sem: 'BA'
          });
          const zai = mkTok(D.o, '在', 'PREP', {
            sem: 'AT'
          });
          let after = [ zai ];
          if (T[m + 1].pos === 'LOC') {} else if (DL[D.vi]) after.push(mkTok(D.o, DL[D.vi] === '下' ? '下' : DL[D.vi], 'LOC', {}));
          T.splice(k, m - k + 1, ba, ...objT, t, ...after);
          k = k + objT.length + after.length + 1;
          continue;
        }
      }
      if (k === 0 && nx && nx.pos === 'PUNCT' && /^[,，]$/.test(nx.o) && [ '首先', '最后', '其实', '当然', '可能' ].includes((cur(t) || {}).zh)) {
        T.splice(1, 1);
        continue;
      }
      if (t.vi === 'ngoài' && nx && (nx.vi === 'trời' || nx.vi === 'trời mưa' || nx.vi === 'trời nắng')) {
        if (nx.vi === 'trời') {
          setTok(t, '外面', 'PLACE', {});
          T.splice(k + 1, 1);
          continue;
        }
        setTok(t, '外面', 'PLACE', {});
        continue;
      }
      if (t.vi === 'vào' && nx && nx.pos === 'TIME') {
        T.splice(k, 1);
        k--;
        continue;
      }
      if ((t.vi === 'sự' || t.vi === 'niềm' || t.vi === 'nỗi') && nx && (nx.pos === 'V' || nx.pos === 'ADJ' || has(nx, 'V'))) {
        const NZ = {
          'giúp đỡ': '帮助',
          'giúp': '帮助',
          'quan tâm': '关心',
          'cố gắng': '努力',
          'thành công': '成功',
          'thất bại': '失败',
          'ủng hộ': '支持',
          'hiểu biết': '了解',
          'thay đổi': '变化',
          'phát triển': '发展',
          'vui vẻ': '快乐',
          'hạnh phúc': '幸福',
          'buồn': '悲伤'
        };
        const z = NZ[nx.vi] || cur(nx) && cur(nx).zh || '';
        if (z) setTok(nx, z, 'N', {});
        T.splice(k, 1);
        k--;
        continue;
      }
      if (t.vi === 'có thể' && nx && nx.vi === 'sẽ') {
        setTok(t, '可能', 'ADV', {});
        continue;
      }
      if (t.vi === 'để' && nx && (nx.pos === 'PRON' || nx.cands && nx.cands.some(c => c.f && (c.f.person || c.f.kin))) && T[k + 2] && hasV(T[k + 2])) {
        setTok(t, '让', 'V', {
          caus: true
        });
        continue;
      }
      if (t.vi === 'muốn' && nx && [ 'NUM', 'N', 'CL', 'QUANT' ].includes(nx.pos) && !T.slice(k + 1).some(x => x.pos === 'V')) {
        setTok(t, '要', 'V', {});
        continue;
      }
      if (t.vi === 'biết' && nx && T[k + 2] && (T[k + 2].vi === 'là' || T[k + 2].vi === 'ở' || T[k + 2].pos === 'COP' || T[k + 2].pos === 'V' || T[k + 2].pos === 'ADJ' || T.slice(k + 2).some(x => x.pos === 'Q'))) {
        setTok(t, '知道', 'V', {
          cog: true
        });
        continue;
      }
      if (k === 0 && (t.vi === 'à' || t.vi === 'ồ' || t.vi === 'ô') && nx && nx.pos === 'PUNCT') {
        setTok(t, t.vi === 'à' ? '啊' : '哦', 'INTJ', {});
        continue;
      }
      if (k > 0 && t.vi === 'ô' && has(t, 'N')) {
        choose(t, 'N');
        continue;
      }
      if (t.vi === 'tin' && nx && [ 'này', 'đó', 'ấy' ].includes(nx.vi)) {
        setTok(t, '消息', 'N', {});
        continue;
      }
      if (t.pos === 'CL' && has(t, 'N') && p && p.pos === 'CL') {
        choose(t, 'N');
        continue;
      }
    }
    {
      const L1 = realLast();
      if (L1 > 1 && T[L1].vi === 'lắm') {
        const ni = T.findIndex((x, i) => i < L1 && x.vi === 'không' && T[i + 1] && T[i + 1].vi !== 'có');
        if (ni >= 0) {
          setTok(T[ni], '不太', 'NEG', {
            sem: 'NOTVERY'
          });
          T.splice(L1, 1);
        }
      }
    }
    {
      const L0 = realLast();
      if (L0 > 1 && T[L0].vi === 'đây' && T[L0 - 1].pos === 'V' && T.slice(0, L0 - 1).some(x => x.vi === 'đi')) setTok(T[L0], '了', 'PART', {
        sem: 'ANNOUNCE'
      });
    }
    const L = realLast();
    if (L > 1 && T[L].vi === 'được') {
      const a = T.findIndex((x, i) => i < L - 1 && (x.vi === 'không' || x.vi === 'chẳng') && hasV(T[i + 1]));
      if (a >= 0 && !T.slice(0, a).some(x => x.vi === 'có thể')) {
        if (T[a + 1].pos !== 'V') choose(T[a + 1], 'V');
        setTok(T[L], T[a + 1].vi === 'ngủ' ? '不着' : '不了', 'RES', {
          pot: true
        });
        T.splice(a, 1);
      }
    }
    const L2 = realLast();
    const MUCH = [ 'nhiều', 'rất nhiều', 'lắm', 'nhiều lắm', 'quá', 'vô cùng' ];
    if (L2 > 0 && MUCH.includes(T[L2].vi)) {
      const vi = T.findIndex((x, i) => i < L2 - 1 && EMO[x.vi]);
      if (vi >= 0) {
        let z = EMO[T[vi].vi], L3 = L2, words = [];
        while (L3 > vi + 1 && MUCH.includes(T[L3].vi)) {
          words.unshift(T[L3].vi);
          T.splice(L3, 1);
          L3--;
        }
        if (words.length > 1 || words.includes('lắm') && z === '很') z = z === '很' ? '非常' : z;
        const too = words.length === 1 && words[0] === 'quá';
        T.splice(vi, 0, mkTok(words.join(' '), too ? '太' : z, 'DEG', {
          sem: too ? 'TOO' : 'EMODEG',
          emo: true
        }));
      }
    }
    for (let k = 0; k < T.length; k++) {
      const t = T[k], nx = T[k + 1];
      if (t.vi === 'trời' && nx && (nx.pos === 'ADJ' || nx.pos === 'DEG' || nx.pos === 'TIME' || nx.cands && nx.cands.some(c => c.pos === 'ADJ'))) setTok(t, '天气', 'N', {});
      if ((t.vi === 'đẹp' || t.vi === 'xấu') && T.slice(0, k).some(x => x.vi === 'trời' || x.vi === 'thời tiết')) setTok(t, t.vi === 'đẹp' ? '好' : '不好', 'ADJ', {});
    }
    return T;
  }
  function disamb(T, q) {
    prepass(T);
    const n = T.length;
    const lastIdx = () => {
      let j = n - 1;
      while (j >= 0 && T[j].pos === 'PUNCT') j--;
      return j;
    };
    for (let k = 0; k < n; k++) {
      const t = T[k], p = T[k - 1], nx = T[k + 1], v = t.vi, last = k === lastIdx();
      if (t.pos === 'NUM' && t.alt && t.alt.length) {
        if ((v === 'ba' || v === 'má') && nx && (nx.pos === 'PRON' || isW(nx, 'của')) || v === 'ba' && (!nx || nx.pos === 'PUNCT') && p && p.pos !== 'V') {
          t.cands = t.alt;
          t.sel = 0;
          choose(t, 'N');
          delete t.num;
          continue;
        }
        if (v === 'năm' && (!nx || ![ 'N', 'CL', 'NUM' ].includes(nx.pos)) && !(nx && nx.unk)) {
          t.cands = t.alt;
          t.sel = 0;
          choose(t, 'N');
          delete t.num;
          continue;
        }
      }
      if (!t.cands || !t.cands.length) continue;
      if (t.f && (t.f.sem === 'NOTVERY' || t.f.caus && t.vi === 'để' || t.f.pot || t.f.sem === 'SUPV' || t.f.emo || t.f.sem === 'ANNOUNCE' || t.f.indef || t.pos === 'DEGP' && t.f.sem === 'SO')) continue;
      if (v === 'nào' && !q && T.slice(0, k).some(x => x.pos === 'NEG' || [ 'chưa', 'không', 'chẳng', 'chưa từng', 'chưa bao giờ' ].includes(x.vi))) {
        t.indefQ = true;
      }
      if ((v === 'anh' || v === 'chị') && t.pos === 'PRON' && k === T.findIndex(x => x.pos !== 'PUNCT') && T.slice(k + 2).some((x, i2) => x.vi === 'em' && T[k + 1 + i2] && T[k + 1 + i2].pos === 'V')) {
        t.cands = [ {
          zh: '我',
          py: 'wǒ',
          pos: 'PRON',
          f: {
            p1: true
          },
          src: 'rule'
        } ].concat(t.cands);
        t.sel = 0;
        t.f = {};
        t.pairSpeaker = true;
        continue;
      }
      const pv = p && p.pos, nv = nx && nx.pos;
      if (v === 'em' && k === 0 && T.slice(1).some(x => ([ 'đi', 'nhé', 'nha', 'nhá', 'nhe', 'đi nhé', 'đi nha', 'nhé' ].includes(x.vi) || x.pos === 'PART' && zhOf(x) === '吧') && T.indexOf(x) >= lastIdx() - 1)) {
        choose(t, 'PRON', c => c.zh === '你');
        continue;
      }
      if (v === 'em' && pv === 'V' && T.slice(0, k - 1).some(x => x.pos === 'PRON' && x.vi !== 'em') && !(nx && PRED_START.has(nv))) {
        choose(t, 'PRON', c => c.zh === '你');
        continue;
      }
      if ((v === 'người' || v === 'thằng' || v === 'gã' || v === 'bài') && t.pos === 'CL' && !((pv === 'NUM' || pv === 'QUANT' || isW(p, 'mấy', 'các', 'những', 'mỗi', 'một', 'vài') || v !== 'người') && nx && (nv === 'N' || nv === 'NAME' || has(nx, 'N')))) choose(t, 'N');
      if (v === 'đây' && p && (pv === 'V' || pv === 'PREP') && !(nx && nv === 'COP')) {
        t.cands = [ {
          zh: '这儿',
          py: 'zhèr',
          pos: 'PLACE',
          f: {}
        } ];
        t.sel = 0;
        t.pos = 'PLACE';
      }
      switch (v) {
       case 'không':
        if (last && k > 0 && pv !== 'PRON') {
          t.pos = 'QP';
          t.qp = 'yn';
        }
        break;

       case 'chưa':
        if (last && k > 0 && pv !== 'PRON') {
          t.pos = 'QP';
          t.qp = 'chua';
        }
        break;

       case 'đi':
        if (last && k > 0 && [ 'V', 'ADJ', 'N', 'PRON', 'NAME', 'PLACE', 'PERF', 'RES', 'DEGP' ].includes(pv) && T.slice(0, k).some(x => x.pos === 'V' || x.pos === 'ADJ')) {
          t.pos = 'PART';
          t.part = '吧';
        } else if (last && k > 0 && isW(p, 'đi')) {
          t.pos = 'PART';
          t.part = '吧';
        }
        break;

       case 'bạn':
       case 'anh':
       case 'chị':
       case 'ông':
       case 'bà':
       case 'em':
       case 'cô':
        if (nx && nv === 'PRON' && nx.vi !== t.vi && p && [ 'CMP', 'PREP', 'V', 'COP', 'POSS', 'HAVE' ].includes(pv) && !(cur(nx).f || {}).dem) choose(t, 'N'); else if (p && (pv === 'NUM' || pv === 'CL' || isW(p, 'người', 'những', 'các', 'mấy', 'vài', 'một')) || nx && (isW(nx, 'của') || nv === 'PRON' && nx.vi !== t.vi && !(nx.vi === 'mày' || nx.vi === 'tao') && (k > 0 || nx.pos === 'PRON') && T[k + 2] && PRED_START.has(T[k + 2].pos))) choose(t, 'N'); else if (nx && nx.pos === 'NAME') {
          t.title = true;
        }
        break;

       case 'hay':
        if (p && nx && q && (isNomPos(pv) || pv === 'V') && (isNomPos(nv) || nv === 'V')) choose(t, 'CONJ', c => c.f.sem === 'ORQ'); else if (p && nx && (isNomPos(pv) || pv === 'V') && (isNomPos(nv) || nv === 'V') && k > 1) {
          choose(t, 'CONJ', c => c.f.sem === 'ORQ');
          t.orStmt = true;
        } else if ((pv === 'V' || pv === 'N' || pv === 'DEG' || pv === 'PRON') && (!nx || [ 'DEGP', 'PART', 'PUNCT', 'QP', 'CMP', 'PERF' ].includes(nv) || isW(nx, 'lắm', 'quá', 'thật', 'hơn', 'nhất', 'không'))) choose(t, 'ADJ'); else if (nv === 'V' || nv === 'ADJ') choose(t, 'ADV');
        break;

       case 'nên':
        if (k === 0 || pv === 'PUNCT' || p && p.pos === 'CONJ') choose(t, 'CONJ'); else if (T.slice(0, k).some(x => semOf(x) === 'BECAUSE') && k > 2 && nv !== 'V') choose(t, 'CONJ'); else if (T.slice(0, k).some(x => semOf(x) === 'BECAUSE') && pv !== 'PRON' && pv !== 'N' && pv !== 'NAME') choose(t, 'CONJ'); else choose(t, 'AUX');
        break;

       case 'mới':
        if (nv === 'V' || nv === 'ADV' || nv === 'AUX') {
          if (p && (p.pos === 'TIME' || p.pos === 'QTY' || isW(p, 'thì'))) choose(t, 'ADV', c => c.f.sem === 'CAI'); else choose(t, 'ASP');
        } else choose(t, 'ADJ');
        break;

       case 'lại':
        if (nv === 'V' || nv === 'ADJ' || nv === 'AUX' || nv === 'NEG') choose(t, 'ADV'); else {
          t.pos = 'RES';
          t.cands = [ {
            zh: '回来',
            py: 'huílai',
            pos: 'RES',
            f: {}
          } ];
          t.sel = 0;
        }
        break;

       case 'còn':
        if ((k === 0 || pv === 'PUNCT') && nx && isNomPos(nv)) {
          t.pos = 'TOPIC';
        } else if (k > 0 && pv === 'PUNCT' || k > 0 && p && p.pos === 'CONJ') choose(t, 'CONJ'); else choose(t, 'ADV');
        break;

       case 'rồi':
        if (k === 0 || pv === 'PUNCT') {
          t.pos = 'CONJ';
          t.cands = [ {
            zh: '然后',
            py: 'ránhòu',
            pos: 'CONJ',
            f: {
              sem: 'THEN2'
            }
          } ];
          t.sel = 0;
        } else t.pos = 'PERF';
        break;

       case 'như':
       case 'giống như':
       case 'như là':
       case 'tựa như':
        t.pos = 'CMP';
        t.cmp = 'like';
        break;

       case 'hơn':
        t.pos = 'CMP';
        t.cmp = 'more';
        break;

       case 'kém':
        if (pv === 'ADJ' || isNomPos(nv)) {
          t.pos = 'CMP';
          t.cmp = 'less';
        }
        break;

       case 'nhất':
        t.pos = 'CMP';
        t.cmp = 'sup';
        break;

       case 'bằng':
        if (pv === 'ADJ' || p && p.pos === 'DEGP' || T[k - 2] && T[k - 2].pos === 'NEG' && pv === 'ADJ') {
          t.pos = 'CMP';
          t.cmp = 'eq';
        } else choose(t, 'PREP');
        break;

       case 'với':
        if (isNomPos(pv) && !T.slice(0, k).some(x => x.pos === 'V' || x.pos === 'ADJ')) choose(t, 'CONJ'); else choose(t, 'PREP', c => c.f.sem === 'WITH');
        break;

       case 'và':
       case 'cùng':
        if (v === 'cùng' && (nv === 'V' || !nx)) choose(t, 'ADV'); else if (v === 'cùng' && isNomPos(nv) && T.slice(k + 1).some(x => x.pos === 'V')) choose(t, 'PREP', c => c.f.sem === 'WITH'); else choose(t, 'CONJ');
        break;

       case 'cho':
        if (k === 0 || pv === 'PUNCT') {
          if (nx && (nv === 'PRON' || nv === 'N') && T[k + 2] && T[k + 2].pos === 'V') {
            t.pos = 'V';
            t.cands = [ {
              zh: '让',
              py: 'ràng',
              pos: 'V',
              f: {
                caus: true
              }
            } ];
            t.sel = 0;
          } else choose(t, 'V');
        } else if (nx && (nv === 'PRON' || nv === 'N' || nv === 'NAME') && T[k + 2] && T[k + 2].pos === 'V' && !(p && p.f && p.f.give)) {
          t.pos = 'V';
          t.cands = [ {
            zh: '让',
            py: 'ràng',
            pos: 'V',
            f: {
              caus: true
            }
          } ];
          t.sel = 0;
        } else if (pv === 'V' || isNomPos(pv) || pv === 'RES' || pv === 'PERF') choose(t, 'PREP', c => c.f.sem === 'BEN'); else if (!T.slice(0, k).some(x => x.pos === 'V')) choose(t, 'V'); else choose(t, 'PREP', c => c.f.sem === 'BEN');
        break;

       case 'được':
        if (nx && (nv === 'PRON' || nv === 'NAME' || nv === 'N' && has(nx, 'N')) && T.slice(k + 2).some(x => x.pos === 'V' || has(x, 'V')) && !T.slice(0, k).some(x => x.pos === 'V')) {
          t.pos = 'PASS';
          t.cands = [ {
            zh: '被',
            py: 'bèi',
            pos: 'PASS',
            f: {
              good: true
            }
          } ];
          t.sel = 0;
        } else if (nv === 'V') {
          t.pos = 'PASS';
          t.cands = [ {
            zh: '被',
            py: 'bèi',
            pos: 'PASS',
            f: {
              good: true
            }
          } ];
          t.sel = 0;
        } else if (k > 0 && (pv === 'V' || isNomPos(pv) || pv === 'RES') && T.slice(0, k).some(x => x.pos === 'V')) {
          t.pos = 'RES';
          t.cands = [ {
            zh: '到',
            py: 'dào',
            pos: 'RES',
            f: {
              abil: true
            }
          } ];
          t.sel = 0;
        } else if (!T.slice(0, k).some(x => x.pos === 'V' || x.pos === 'ADJ')) {
          t.pos = 'ADJ';
          t.cands = [ {
            zh: '可以',
            py: 'kěyǐ',
            pos: 'ADJ',
            f: {}
          }, {
            zh: '行',
            py: 'xíng',
            pos: 'ADJ',
            f: {}
          } ];
          t.sel = 0;
        }
        break;

       case 'ở':
       case 'tại':
        if (T.slice(k + 1).some(x => x.pos === 'V') || T.slice(0, k).some(x => x.pos === 'V' || x.pos === 'ADJ')) choose(t, 'PREP'); else if (v === 'ở') choose(t, 'V', c => c.zh === '在');
        break;

       case 'đến':
       case 'tới':
        if (p && (pv === 'V' && p.f && p.f.motion)) choose(t, 'PREP'); else if (T.slice(0, k).some(x => isW(x, 'từ'))) choose(t, 'PREP'); else if (nx && nv === 'TIME') choose(t, 'PREP'); else choose(t, 'V');
        break;

       case 'về':
        if (pv === 'V' && p.f && !p.f.motion && nx) choose(t, 'PREP', c => c.f.sem === 'ABOUT'); else if (pv === 'V' && p.f && p.f.motion) choose(t, 'V'); else choose(t, 'V');
        break;

       case 'vì':
       case 'bởi vì':
       case 'tại vì':
       case 'do':
        if (k === 0 || pv === 'PUNCT' || T.slice(k + 1).some(x => x.pos === 'V' || x.pos === 'ADJ' || x.pos === 'NEG')) choose(t, 'CONJ'); else choose(t, 'PREP', c => c.f.sem === 'FOR');
        break;

       case 'để':
        if (nv === 'V' || nv === 'NEG' || isNomPos(nv)) choose(t, 'PREP', c => c.f.sem === 'PURP');
        break;

       case 'là':
        if (p && (p.f && p.f.cog || isW(p, 'nói', 'nghĩ', 'biết', 'thấy', 'tưởng', 'cho', 'hy vọng', 'mong'))) {
          t.pos = 'COMP';
        } else if (T.slice(0, k).some(x => [ 'ONLYNEED', 'WHENEVER' ].includes(semOf(x)))) choose(t, 'CONJ'); else choose(t, 'COP');
        break;

       case 'rằng':
        t.pos = 'COMP';
        break;

       case 'thì':
        choose(t, 'CONJ');
        break;

       case 'có':
        if (nx && (nv === 'V' || nv === 'ADJ' || nv === 'DEG' || nv === 'AUX') && !(nx.f && nx.f.noagent)) {
          t.pos = 'EMPH';
        } else choose(t, 'HAVE');
        break;

       case 'trước':
       case 'sau':
        if (nx && (isNomPos(nv) || nv === 'TIME')) choose(t, 'LOC'); else if (v === 'trước' && (pv === 'V' || last)) {
          choose(t, 'ADV');
          t.post = true;
        } else if (v === 'sau' && (pv === 'V' || last)) {
          t.pos = 'TIME';
          t.cands = [ {
            zh: '以后',
            py: 'yǐhòu',
            pos: 'TIME',
            f: {
              kind: 'point',
              fut: true
            }
          } ];
          t.sel = 0;
        }
        break;

       case 'trong':
       case 'ngoài':
       case 'trên':
       case 'dưới':
       case 'gần':
       case 'giữa':
        if (v === 'gần' && (!nx || !isNomPos(nv))) choose(t, 'ADJ'); else if (v === 'ngoài' && !nx) {
          choose(t, 'LOC');
        }
        break;

       case 'tối':
       case 'sáng':
        if (p && (isW(p, 'trời', 'phòng', 'đèn') || pv === 'DEG' || pv === 'ASP' || pv === 'NEG') || nx && nx.pos === 'DEGP' || p && isNomPos(pv) && (!nx || nv === 'PERF' || nv === 'PUNCT' || nv === 'QP' || isW(nx, 'rồi', 'quá', 'lắm'))) choose(t, 'ADJ'); else choose(t, 'TIME');
        break;

       case 'đó':
       case 'đấy':
       case 'kia':
       case 'này':
       case 'ấy':
        if (k === 0 && nx && (nv === 'COP' || isW(nx, 'là'))) {
          t.pos = 'PRON';
          t.cands = [ {
            zh: v === 'này' ? '这' : '那',
            py: v === 'này' ? 'zhè' : 'nà',
            pos: 'PRON',
            f: {
              dem: true
            }
          } ];
          t.sel = 0;
        } else if (last && k > 0 && v !== 'này' && v !== 'ấy' && !isNomPos(pv) && pv !== 'CL') {
          choose(t, 'PART');
        } else if (k === 0 && v === 'này' && nx && nv === 'PUNCT') choose(t, 'INTJ'); else choose(t, 'DEM');
        break;

       case 'thôi':
        if (last) {
          t.pos = 'PART';
        }
        break;

       case 'sao':
        if (last && k > 0) {
          t.pos = 'QP';
          t.qp = 'sao';
        } else choose(t, 'QA');
        break;

       case 'vậy':
       case 'thế':
        if (last && pv === 'ADJ' && T.slice(0, k - 1).some(x => x.vi === 'sao' || x.vi === 'tại sao')) {
          t.pos = 'DEGP';
          t.cands = [ {
            zh: '这么',
            py: 'zhème',
            pos: 'DEGP',
            f: {
              sem: 'SO'
            }
          } ];
          t.sel = 0;
        } else if (last && k > 0 && (q || T.some(x => x.pos === 'Q' || x.pos === 'QA'))) {
          t.pos = 'PART';
          t.cands = [ {
            zh: '呢',
            py: 'ne',
            pos: 'PART',
            f: {
              sem: 'QW'
            }
          } ];
          t.sel = 0;
        } else if (pv === 'ADJ' || pv === 'V') {
          t.pos = 'DEGP';
          t.cands = [ {
            zh: '这么',
            py: 'zhème',
            pos: 'DEGP',
            f: {
              sem: 'SO'
            }
          } ];
          t.sel = 0;
        } else {
          t.pos = 'ADV';
          t.cands = [ {
            zh: '这样',
            py: 'zhèyàng',
            pos: 'ADV',
            f: {}
          } ];
          t.sel = 0;
        }
        break;

       case 'đâu':
        if (last && T.slice(0, k).some(x => x.pos === 'NEG' || x.pos === 'HAVE' && semOf(x) === 'NEGHAVE')) {
          t.pos = 'PART';
          t.cands = [ {
            zh: '',
            py: '',
            pos: 'PART',
            f: {}
          } ];
          t.sel = 0;
        }
        break;

       case 'quá':
       case 'thật':
       case 'cực kỳ':
       case 'cực kì':
       case 'vô cùng':
        if (nx && (nv === 'ADJ' || nv === 'V')) choose(t, 'DEG'); else choose(t, 'DEGP');
        break;

       case 'thấy':
       case 'hiểu':
       case 'đúng':
       case 'sai':
        if (pv === 'V' && !(p.f && p.f.cog)) choose(t, 'RES'); else if (v === 'thấy' && (nv === 'ADJ' || nv === 'DEG' || nv === 'PRON' && T[k + 2] && [ 'ADJ', 'V', 'DEG', 'NEG' ].includes(T[k + 2].pos))) choose(t, 'V', c => c.zh === '觉得'); else if (v === 'đúng' || v === 'sai') choose(t, 'ADJ'); else choose(t, 'V');
        break;

       case 'biết':
        if (nv === 'V' || nx && nx.f && nx.f.lang) choose(t, 'AUX', c => c.f.sem === 'SKILL'); else if (nx && (nv === 'PRON' || nx.f && nx.f.person || nv === 'NAME') && !(T[k + 2] && PRED_START.has(T[k + 2].pos))) choose(t, 'V', c => c.f.sem === 'KNOWP'); else choose(t, 'V', c => c.zh === '知道');
        break;

       case 'nhớ':
        if (nx && (nv === 'PRON' || nv === 'NAME' || nx.f && (nx.f.person || nx.f.kin || nx.f.place))) choose(t, 'V', c => c.f.sem === 'MISS'); else choose(t, 'V', c => c.zh === '记得');
        break;

       case 'nghĩ':
        if (nx && (isW(nx, 'về') || nv === 'PRON' && !(T[k + 2] && PRED_START.has(T[k + 2].pos)))) choose(t, 'V', c => c.zh === '想');
        break;

       case 'giỏi':
       case 'hay':
        break;

       case 'xấu':
        if (p && (p.f && (p.f.person || p.f.kin) || pv === 'PRON')) choose(t, 'ADJ', c => c.zh === '丑');
        break;

       case 'nhiều':
       case 'ít':
        if (nx && nv === 'N' && !(p && p.pos === 'CMP')) {
          t.pos = 'QUANT';
          t.cands = [ {
            zh: v === 'nhiều' ? '很多' : '一些',
            py: v === 'nhiều' ? 'hěnduō' : 'yìxiē',
            pos: 'QUANT',
            f: {}
          } ];
          t.sel = 0;
        }
        break;

       case 'mấy':
       case 'vài':
        if (nx && (nv === 'N' || nv === 'CL')) {
          t.pos = 'QUANT';
          t.cands = [ {
            zh: '几',
            py: 'jǐ',
            pos: 'QUANT',
            f: {
              mw: true,
              q: v === 'mấy'
            }
          } ];
          t.sel = 0;
        }
        break;

       case 'nước':
        if (nx && (nv === 'NAME' || nv === 'PLACE' || nx.f && nx.f.place)) choose(t, 'N', c => c.zh === '国家');
        break;

       case 'từng':
        if (nx && (nv === 'N' || nv === 'CL')) {
          t.pos = 'QUANT';
          t.cands = [ {
            zh: '每',
            py: 'měi',
            pos: 'QUANT',
            f: {
              mw: true
            }
          } ];
          t.sel = 0;
        }
        break;

       case 'tên là':
       case 'tên':
        if (v === 'tên' && (k === 0 || !(p && (p.pos === 'PRON' || p.pos === 'N')) || nx && nx.pos !== 'NAME' && !isW(nx, 'là'))) choose(t, 'N'); else choose(t, 'V');
        break;

       case 'giống':
        if (nx && isW(nx, 'nhau')) {
          t.pos = 'ADJ';
          t.cands = [ {
            zh: '一样',
            py: 'yíyàng',
            pos: 'ADJ',
            f: {}
          } ];
          t.sel = 0;
          nx.pos = 'SKIP';
        }
        break;

       case 'nhau':
        if (t.pos !== 'SKIP' && last) {
          t.pos = 'SKIP';
        }
        break;

       case 'tiếng':
        if (nx && (nx.pos === 'NAME' || nx.unk)) {
          t.pos = 'N';
          t.lang = true;
        }
        break;

       case 'quen':
        if (nx && (nv === 'PRON' || nv === 'NAME' || nx.f && nx.f.person)) choose(t, 'V'); else if (nx && isW(nx, 'với')) choose(t, 'ADJ');
        break;
      }
      if ([ 'các', 'những', 'mọi', 'mỗi', 'tất cả', 'tất cả các', 'tất cả những', 'một số', 'một vài', 'cả' ].includes(v) && nx) {
        const Z = {
          'các': '',
          'những': '',
          'mọi': '每',
          'mỗi': '每',
          'tất cả': '所有',
          'tất cả các': '所有',
          'tất cả những': '所有',
          'một số': '一些',
          'một vài': '一些',
          'cả': '全'
        }[v];
        t.pos = 'QUANT';
        t.cands = [ {
          zh: Z,
          py: pyOf(Z),
          pos: 'QUANT',
          f: {
            mw: Z === '每',
            pl: !Z
          }
        } ];
        t.sel = 0;
      }
      if (v === 'của') {
        t.pos = 'POSS';
      }
    }
    return T;
  }
  const NPHEAD = new Set([ 'N', 'PRON', 'NAME', 'PLACE', 'UNK' ]);
  function parseNP(T, k, end, opt) {
    opt = opt || {};
    const np = {
      start: k,
      quant: null,
      num: null,
      cl: null,
      head: null,
      nmods: [],
      adjs: [],
      poss: null,
      dem: null,
      q: null,
      loc: null,
      coord: null,
      rel: null
    };
    let i = k;
    if (i < end && T[i].pos === 'LOC' && i + 1 < end) {
      np.loc = T[i];
      i++;
    }
    if (i < end && T[i].pos === 'QUANT') {
      np.quant = T[i];
      i++;
    }
    if (i < end && T[i].pos === 'NUM' && !T[i].num?.ord) {
      np.num = T[i];
      i++;
    } else if (i < end && T[i].pos === 'Q' && T[i].vi === 'mấy') {
      np.num = T[i];
      i++;
    }
    if (i < end && T[i].pos === 'CL') {
      np.cl = T[i];
      i++;
    }
    if (i < end && (NPHEAD.has(T[i].pos) || T[i].pos === 'DEM' && cur(T[i]) && T[i].cands[T[i].sel].f.dem || T[i].pos === 'Q' && ![ 'QA' ].includes(T[i].pos) && !semOf(T[i]) || T[i].pos === 'QTY')) {
      if (T[i].pos === 'UNK' && !opt.allowUnk) {
        if (!np.num && !np.cl && !np.quant) return null;
      }
      np.head = T[i];
      i++;
    } else if (np.cl && i < end && (T[i].pos === 'DEM' || T[i].pos === 'ADJ' || T[i].pos === 'Q')) {
      np.head = null;
    } else if (np.num && !np.cl) {
      return {
        start: k,
        end: i,
        num: np.num,
        head: null,
        nmods: [],
        adjs: [],
        qty: true
      };
    } else if (np.cl) {
      np.head = null;
    } else if (np.loc) {
      return null;
    } else return null;
    const headIsPron = np.head && np.head.pos === 'PRON';
    while (i < end && !headIsPron) {
      const t = T[i];
      if (t.pos === 'N' && !(opt.subj && i + 1 < end && false)) {
        if (t.f && t.f.unit) break;
        if (opt.stopN) break;
        np.nmods.push(t);
        i++;
        continue;
      }
      if (t.pos === 'NAME' && np.head && (np.head.lang || np.head.f && np.head.f.place || np.head.vi === 'nước')) {
        np.nmods.push(t);
        i++;
        continue;
      }
      break;
    }
    if (opt.supOK && !headIsPron && np.head && T[i] && T[i].pos === 'ADJ' && T[i + 1] && T[i + 1].pos === 'CMP' && T[i + 1].cmp === 'sup') {
      np.adjs.push({
        adj: T[i],
        sup: T[i + 1]
      });
      i += 2;
      if (T[i] && (T[i].pos === 'N' || T[i].pos === 'PLACE' || T[i].pos === 'NAME' || T[i].pos === 'LOC' || T[i].pos === 'PREP')) {
        const st0 = T[i].pos === 'PREP' || T[i].pos === 'LOC' && T[i + 1] ? i + 1 : i;
        const sc = parseNP(T, st0, end, {
          adj: false
        });
        if (sc) {
          np.supScope = sc;
          i = sc.end;
        }
      }
    }
    if (opt.adj !== false && !headIsPron) {
      while (i < end) {
        if (T[i].pos === 'ADJ' && !(T[i + 1] && T[i + 1].pos === 'CMP') && !isW(T[i], 'được')) {
          np.adjs.push({
            adj: T[i]
          });
          i++;
          continue;
        }
        if (T[i].pos === 'DEG' && T[i + 1] && T[i + 1].pos === 'ADJ' && i + 1 < end) {
          np.adjs.push({
            adj: T[i + 1],
            deg: T[i]
          });
          i += 2;
          continue;
        }
        if (T[i].pos === 'N' && T[i].f && T[i].f.color) {
          np.adjs.push({
            adj: T[i],
            color: true
          });
          i++;
          continue;
        }
        break;
      }
    }
    if (!headIsPron && i < end && T[i].pos === 'POSS') {
      const p = parseNP(T, i + 1, end, {
        adj: false,
        stopN: true
      });
      if (p) {
        np.poss = p;
        i = p.end;
      }
    } else if (!headIsPron && np.head && i < end && (T[i].pos === 'PRON' && !(T[i].cands[T[i].sel].f || {}).dem) && !(opt.subj && T[i + 1] && !PRED_START.has(T[i + 1].pos) && T[i + 1].pos !== 'PUNCT' && T[i + 1].pos !== 'QP' && T[i + 1].pos !== 'PART' && T[i + 1].pos !== 'CMP' && T[i + 1].pos !== 'DEGP')) {
      np.poss = {
        start: i,
        end: i + 1,
        head: T[i],
        nmods: [],
        adjs: []
      };
      i++;
    }
    if (i < end && T[i].pos === 'DEM') {
      np.dem = T[i];
      i++;
    }
    if (i < end && T[i].pos === 'Q' && (T[i].vi === 'gì' || T[i].vi === 'nào' || T[i].vi === 'cái gì')) {
      np.q = T[i];
      i++;
    }
    if (np.poss && !np.dem && i < end && T[i].pos === 'DEM') {
      np.dem = T[i];
      i++;
    }
    if (opt.simOK && np.head && !headIsPron && T[i] && T[i].pos === 'ADJ' && T[i + 1] && T[i + 1].pos === 'CMP' && T[i + 1].cmp === 'like') {
      const n2 = parseNP(T, i + 2, end, {
        adj: false,
        coord: false
      });
      if (n2) {
        np.sim = {
          adj: T[i],
          cmp: T[i + 1],
          np: n2
        };
        i = n2.end;
      }
    }
    if (opt.coord !== false && i + 1 < end && T[i].pos === 'CONJ' && [ 'AND', 'ORQ', 'OR' ].includes(semOf(T[i]))) {
      const b = parseNP(T, i + 1, end, Object.assign({}, opt, {
        coord: true
      }));
      if (b && !(T[b.end] && (T[b.end].pos === 'V' || T[b.end].pos === 'ADJ') && semOf(T[i]) !== 'AND' && false)) {
        np.coord = {
          conj: T[i],
          np: b
        };
        i = b.end;
      }
    }
    np.end = i;
    return np;
  }
  const npText = (T, np) => np ? T.slice(np.start, np.end).map(t => t.o).join(' ') : '';
  const npIs = (np, flag) => !!(np && np.head && (np.head.f && np.head.f[flag] || cur(np.head) && cur(np.head).f && cur(np.head).f[flag]));
  function npPerson(np) {
    return !!np && !!np.head && (np.head.pos === 'PRON' || np.head.pos === 'NAME' || npIs(np, 'person') || npIs(np, 'kin'));
  }
  function parseClause(T, ctx) {
    const st = {
      T: T,
      time: [],
      subj: null,
      intj: [],
      voc: null,
      P: null,
      finals: [],
      rest: [],
      q: null,
      imp: false,
      topic: null,
      exist: false,
      notes: []
    };
    let i = 0, j = T.length;
    while (j > i && T[j - 1].pos === 'PUNCT') j--;
    while (i < j && T[i].pos === 'PUNCT') i++;
    while (i < j && T[i].pos === 'INTJ' && semOf(T[i]) !== 'VOC') {
      st.intj.push(T[i]);
      i++;
      while (i < j && T[i].pos === 'PUNCT') i++;
    }
    for (let k = i; k < Math.min(j, i + 4); k++) if (T[k].pos === 'INTJ' && semOf(T[k]) === 'VOC') {
      const np = parseNP(T, i, k, {
        adj: false
      });
      if (np) {
        st.voc = np;
        i = k + 1;
        while (i < j && T[i].pos === 'PUNCT') i++;
      }
      break;
    }
    while (j > i) {
      const t = T[j - 1];
      if (t.pos === 'QP' || t.pos === 'PART' || t.pos === 'SKIP' || t.pos === 'PUNCT') {
        if (t.pos !== 'PUNCT' && t.pos !== 'SKIP') st.finals.unshift(t);
        j--;
        continue;
      }
      break;
    }
    if (T[i] && T[i].pos === 'TOPIC') {
      st.topic = T[i];
      i++;
    }
    const keep = [];
    for (let k = i; k < j; k++) {
      const t = T[k], pv = T[k - 1];
      if (t.pos === 'TIME' && (cur(t).f || {}).season && pv && [ 'V', 'COP', 'HAVE', 'DEG', 'CMP', 'PREP' ].includes(pv.pos)) {
        t.pos = 'N';
        keep.push(t);
        continue;
      }
      if (t.pos === 'TIME' && pv && pv.pos === 'COP' && (!t.f || t.f.kind !== 'dur')) {
        t.pos = 'N';
        keep.push(t);
        continue;
      }
      if (t.pos === 'TIME' && (!t.f || t.f.kind !== 'dur' && t.f.kind !== 'freq') && !(pv && (pv.pos === 'PREP' || pv.pos === 'LOC' || pv.pos === 'CONJ' && [ 'BEFORE', 'AFTER', 'UNTIL' ].includes(semOf(pv))))) {
        st.time.push(t);
        continue;
      }
      keep.push(t);
    }
    const U = T.slice(0, i).concat(keep).concat(T.slice(j));
    const shift = T.length - U.length;
    j -= shift;
    T = U;
    st.T = T;
    if (T[i] && T[i].pos === 'HAVE' && i + 1 < j && semOf(T[i]) !== 'NEGHAVE' && !st.time.length && i === 0) {
      st.exist = true;
    }
    st.lead = [];
    while (i < j && (T[i].pos === 'QA' || T[i].pos === 'ADV' && [ '可能', '好像', '其实', '当然', '应该', '一定', '突然', '终于', '到底', '本来', '首先', '最后' ].includes(zhOf(T[i]))) && T[i + 1] && (T[i + 1].pos === 'PRON' || T[i + 1].pos === 'N' || T[i + 1].pos === 'NAME')) {
      st.lead.push(T[i]);
      i++;
    }
    let k = i;
    const canSubj = t => t && (NPHEAD.has(t.pos) && t.pos !== 'UNK' || t.pos === 'NUM' || t.pos === 'QUANT' || t.pos === 'CL' || t.pos === 'LOC' || t.pos === 'DEM' && cur(t).f.dem || t.pos === 'Q' && (t.vi === 'ai' || t.vi === 'cái gì'));
    if (!st.exist && canSubj(T[k])) {
      let np = parseNP(T, k, j, {
        subj: true
      });
      if (np && np.end < j && !predAhead(T, np.end, j)) {
        const np2 = parseNP(T, k, j, {
          subj: true,
          adj: false
        });
        if (np2 && predAhead(T, np2.end, j)) np = np2;
      }
      if (np && np.end === j && np.adjs.length) {
        const np2 = parseNP(T, k, j, {
          subj: true,
          adj: false
        });
        if (np2) np = np2;
      }
      if (np && (np.end < j || st.topic || st.finals.length || ctx.allowBareSubj)) {
        st.subj = np;
        k = np.end;
      } else if (np && np.end === j) {
        st.subj = np;
        k = np.end;
      }
    }
    if (!st.subj && T[k] && T[k].pos === 'V' && !ctx.noVPsubj) {
      for (let m = k + 1; m < j; m++) {
        const a = T[m], adjT = a.pos === 'DEG' && T[m + 1] && T[m + 1].pos === 'ADJ' ? T[m + 1] : a.pos === 'ADJ' ? a : null;
        if (!adjT) {
          if ([ 'V', 'N', 'NAME', 'PRON', 'LOC', 'PREP', 'NUM', 'CL', 'RES', 'PLACE', 'TIME' ].includes(a.pos)) continue;
          break;
        }
        if (EVAL.has(adjT.vi) && m > k + 1) {
          const sp = parsePred(T, k, m, st, ctx);
          if (sp.end === m && sp.P && sp.P.kind === 'v') {
            st.subjP = sp.P;
            k = m;
          }
        }
        break;
      }
    }
    if (st.subj && T[k] && T[k].pos === 'CONJ' && semOf(T[k]) === 'THEN') {
      st.thi = T[k];
      k++;
    }
    while (k < j && T[k].pos === 'TIME' && (!T[k].f || T[k].f.kind === 'point')) {
      st.time.push(T[k]);
      k++;
    }
    if (k < j) {
      const r = parsePred(T, k, j, st, ctx);
      st.P = r.P;
      k = r.end;
    }
    if (st.lead.length && st.P) {
      st.lead.slice().reverse().forEach(t => {
        if (t.pos === 'QA') st.P.qa.unshift(t); else st.P.advs.unshift(t);
      });
      if (st.lead.some(t => t.pos === 'QA')) st.leadMoved = true;
    }
    if (k < j) st.rest = T.slice(k, j);
    const qp = st.finals.find(t => t.pos === 'QP'), part = st.finals.find(t => t.pos === 'PART');
    const hasQW = T.some(t => t.pos === 'Q' && !t.indefQ || t.pos === 'QA' || cur(t) && cur(t).f && cur(t).f.q && !cur(t).f.whole) || st.P && st.P.howV;
    const EMB = [ '知道', '问', '告诉', '记得', '忘', '忘记', '明白', '懂', '清楚', '想知道', '猜' ];
    const embQ = hasQW && !ctx.q && st.P && st.P.vp && st.P.vp.clause && EMB.includes(tokZh(st.P.vp.v));
    const embC = hasQW && st.P && st.P.vp && st.P.vp.clause && EMB.includes(tokZh(st.P.vp.v));
    if (embQ) {
      st.q = null;
      st.embQ = true;
    } else if (embC && qp) {
      st.q = qp.qp || 'yn';
      st.embQ = true;
    } else if (hasQW) st.q = 'wh'; else if (qp) st.q = qp.qp || 'yn'; else if (part && semOf(part) === 'TAGQ') st.q = 'tag'; else if (part && semOf(part) === 'OKQ') st.q = 'ok'; else if (part && semOf(part) === 'Q') st.q = 'yn'; else if (part && semOf(part) === 'TAG' && ctx.q) st.q = 'nhi'; else if (ctx.q && !T.some(t => t.pos === 'CONJ' && semOf(t) === 'ORQ')) st.q = 'yn'; else if (T.some(t => t.pos === 'CONJ' && semOf(t) === 'ORQ') && (ctx.q || !T.some(t => t.orStmt))) st.q = 'choice';
    if (st.P && st.P.imp) st.imp = true;
    return st;
  }
  const EVAL = new Set([ 'thú vị', 'khó', 'dễ', 'quan trọng', 'nguy hiểm', 'có ích', 'cần thiết', 'vui', 'mệt', 'tuyệt', 'khó khăn', 'đơn giản', 'phức tạp', 'dễ dàng', 'nhàm chán', 'buồn chán', 'tốn tiền', 'tốn thời gian', 'thoải mái', 'có lợi', 'có hại', 'không dễ', 'vất vả' ]);
  function predAhead(T, k, j) {
    for (let x = k; x < j; x++) {
      const p = T[x].pos;
      if ([ 'V', 'ADJ', 'COP', 'HAVE', 'QTY', 'NEG', 'AUX', 'ASP' ].includes(p)) return true;
      if (p === 'Q' && T[x].f && T[x].f.sem === 'PRED') return true;
    }
    return false;
  }
  function parsePred(T, k, j, st, ctx) {
    const P = {
      advs: [],
      neg: [],
      asp: [],
      aux: [],
      deg: null,
      qa: [],
      pps: [],
      pass: null,
      emph: false,
      kind: null,
      head: null,
      vp: null,
      adj: null,
      nom: null,
      cmp: null,
      sup: null,
      degp: null,
      perf: false,
      more: false,
      imp: false,
      howV: false,
      extra: [],
      dur: null,
      freq: null
    };
    let i = k;
    const pre = () => {
      while (i < j) {
        const t = T[i], s = semOf(t);
        if (t.pos === 'ADV' && !t.post && !(s === 'MORE')) {
          if (s === 'TOGETHER' && T[i + 1] && T[i + 1].pos !== 'V' && T[i + 1].pos !== 'AUX') break;
          P.advs.push(t);
          i++;
          continue;
        }
        if (t.pos === 'NEG') {
          P.neg.push(t);
          i++;
          continue;
        }
        if (t.pos === 'ASP') {
          P.asp.push(t);
          i++;
          continue;
        }
        if (t.pos === 'AUX') {
          if (s === 'IMP') P.imp = true;
          P.aux.push(t);
          i++;
          continue;
        }
        if (t.pos === 'DEG' && T[i + 1] && T[i + 1].pos !== 'ADJ' && T[i + 1].pos !== 'V' && T[i + 1].pos !== 'DEG') break;
        if (t.pos === 'DEG') {
          P.deg = t;
          i++;
          continue;
        }
        if (t.pos === 'QA') {
          P.qa.push(t);
          i++;
          continue;
        }
        if (t.pos === 'EMPH') {
          P.emph = true;
          i++;
          continue;
        }
        if (t.pos === 'TIME' && (!t.f || t.f.kind === 'point')) {
          st.time.push(t);
          i++;
          continue;
        }
        if (t.pos === 'PASS' || t.pos === 'PREP' && s === 'PASS') {
          const np = T[i + 1] && T[i + 1].pos !== 'V' ? parseNP(T, i + 1, j, {
            adj: false
          }) : null;
          P.pass = {
            t: t,
            np: np
          };
          i = np ? np.end : i + 1;
          continue;
        }
        if (t.pos === 'PREP' && s !== 'PURP') {
          const np = parseNP(T, i + 1, j, {
            adj: true,
            allowUnk: true
          });
          if (np && np.end < j && [ 'V', 'ADJ', 'ADV', 'NEG', 'AUX', 'PREP', 'HAVE', 'COP', 'DEG' ].includes(T[np.end].pos)) {
            P.pps.push({
              prep: t,
              np: np,
              pre: true
            });
            i = np.end;
            continue;
          }
          if (np && isW(t, 'từ') && T[np.end] && T[np.end].pos === 'PREP') {
            P.pps.push({
              prep: t,
              np: np,
              pre: true
            });
            i = np.end;
            continue;
          }
        }
        break;
      }
    };
    pre();
    const t = T[i];
    if (!t) return {
      P: P,
      end: i
    };
    if (t.pos === 'COP') {
      P.kind = 'cop';
      P.head = t;
      i++;
      if (T[i] && T[i].pos === 'NEG' && isW(T[i], 'không phải')) {
        P.neg.push(T[i]);
        i++;
      }
      const np = T[i] && T[i].pos === 'POSS' ? null : parseNP(T, i, j, {
        allowUnk: true,
        supOK: true,
        simOK: true
      });
      if (T[i] && T[i].pos === 'POSS') {
        const pn = parseNP(T, i + 1, j, {
          allowUnk: true,
          adj: false
        }) || (T[i + 1] && T[i + 1].pos === 'Q' ? {
          start: i + 1,
          end: i + 2,
          head: T[i + 1],
          nmods: [],
          adjs: []
        } : null);
        if (pn) {
          P.nomPoss = pn;
          i = pn.end;
        }
      } else if (np) {
        P.nom = np;
        i = np.end;
      } else if (T[i] && T[i].pos === 'Q') {
        P.nom = {
          start: i,
          end: i + 1,
          head: T[i],
          nmods: [],
          adjs: []
        };
        i++;
      } else if (T[i] && T[i].pos === 'V') {
        const r = parseVP(T, i, j, P);
        P.vpAfterCop = r.vp;
        i = r.end;
      }
      i = post(T, i, j, P);
    } else if (t.pos === 'Q' && semOf(t) === 'WHERE') {
      P.kind = 'v';
      P.vp = {
        v: mkTok(t.o, '在', 'V', {}),
        obj: {
          start: i,
          end: i + 1,
          head: mkTok('đâu', '哪儿', 'Q', {}),
          nmods: [],
          adjs: []
        },
        comps: [],
        pps: [],
        start: i
      };
      i++;
      i = post(T, i, j, P);
    } else if (t.pos === 'POSS' && st.subj) {
      const pn = parseNP(T, i + 1, j, {
        allowUnk: true,
        adj: false
      }) || (T[i + 1] && T[i + 1].pos === 'Q' ? {
        start: i + 1,
        end: i + 2,
        head: T[i + 1],
        nmods: [],
        adjs: []
      } : null);
      if (pn) {
        P.kind = 'cop';
        P.head = mkTok('', '是', 'COP', {});
        P.nomPoss = pn;
        i = pn.end;
        i = post(T, i, j, P);
      }
    } else if (t.pos === 'HAVE') {
      P.kind = 'have';
      P.head = t;
      i++;
      const np = parseNP(T, i, j, {
        allowUnk: true
      });
      if (np) {
        P.nom = np;
        i = np.end;
      }
      if (T[i] && T[i].pos === 'V') {
        const r = parseVP(T, i, j, P);
        P.vpAfterHave = r.vp;
        i = r.end;
      }
      i = post(T, i, j, P);
    } else if (t.pos === 'V' || t.pos === 'RES' && !P.head) {
      P.kind = 'v';
      const r = parseVP(T, i, j, P);
      P.vp = r.vp;
      i = r.end;
      i = post(T, i, j, P);
    } else if (t.pos === 'ADJ') {
      P.kind = 'adj';
      P.adj = t;
      i++;
      if (T[i] && T[i].pos === 'ADJ' && T[i].vi !== t.vi) {
        P.adj2 = T[i];
        i++;
      }
      i = post(T, i, j, P);
    } else if (t.pos === 'QTY' || t.pos === 'Q' && t.f && t.f.sem === 'PRED' || t.pos === 'NUM' || t.pos === 'N' && !P.neg.length && !P.aux.length) {
      const np = t.pos === 'QTY' || t.pos === 'Q' ? {
        start: i,
        end: i + 1,
        head: t,
        nmods: [],
        adjs: []
      } : parseNP(T, i, j, {});
      if (np) {
        P.kind = 'nom';
        P.nom = np;
        i = np.end;
        i = post(T, i, j, P);
      }
    } else if (t.pos === 'PREP' && isW(t, 'ở', 'tại')) {
      const np = parseNP(T, i + 1, j, {
        allowUnk: true
      });
      if (np) {
        P.kind = 'v';
        P.vp = {
          v: mkTok(t.o, '在', 'V', {}),
          obj: np,
          comps: [],
          pps: [],
          start: i
        };
        i = np.end;
        i = post(T, i, j, P);
      }
    } else if (t.pos === 'PLACE' || t.pos === 'DEM') {
      const np = parseNP(T, i, j, {});
      if (np) {
        P.kind = 'nom';
        P.nom = np;
        i = np.end;
      }
    }
    return {
      P: P,
      end: i
    };
  }
  function parseVP(T, i, j, P) {
    const vp = {
      v: T[i],
      obj: null,
      comps: [],
      pps: [],
      dcomp: null,
      next: null,
      dest: null,
      iobj: null,
      start: i
    };
    if (vp.v.f && vp.v.f.caus) P.causCtx = true;
    i++;
    if (T[i] && T[i].pos === 'V' && T[i].f && T[i].f.motion && vp.v.f && vp.v.f.motion) {
      vp.v2 = T[i];
      i++;
    }
    let guard = 0;
    while (i < j && guard++ < 30) {
      const t = T[i], s = semOf(t);
      if (t.pos === 'RES') {
        vp.comps.push(t);
        i++;
        continue;
      }
      if (t.pos === 'PERF') {
        P.perf = true;
        i++;
        continue;
      }
      if (t.pos === 'ADV' && s === 'MORE') {
        P.more = true;
        i++;
        continue;
      }
      if (t.pos === 'ADV' && t.post) {
        P.advs.push(t);
        i++;
        continue;
      }
      if (t.pos === 'TIME' && t.f && (t.f.kind === 'dur' || t.f.kind === 'freq')) {
        if (t.f.kind === 'dur') P.dur = t; else P.freq = t;
        i++;
        continue;
      }
      if (t.pos === 'Q' && t.f && t.f.sem === 'DUR') {
        P.dur = t;
        i++;
        continue;
      }
      if (t.pos === 'QA' && semOf(t) === 'HOWQ' && !vp.obj && vp.v) {
        P.howV = true;
        i++;
        continue;
      }
      if (t.pos === 'QA' && semOf(t) === 'HOWQ') {
        P.howV = true;
        i++;
        continue;
      }
      if (t.pos === 'Q' && s === 'WHERE') {
        vp.pps.push({
          prep: mkTok('ở', '在', 'PREP', {}),
          np: {
            start: i,
            end: i + 1,
            head: mkTok('đâu', '哪儿', 'Q', {}),
            nmods: [],
            adjs: []
          },
          q: true
        });
        i++;
        continue;
      }
      if (t.pos === 'PREP') {
        const np = parseNP(T, i + 1, j, {
          allowUnk: true
        });
        if (s === 'PURP') break;
        if (np) {
          if ((s === 'TO' || s === 'BACK') && vp.v.f && vp.v.f.motion && !vp.obj) {
            vp.dest = {
              prep: t,
              np: np
            };
            i = np.end;
            continue;
          }
          if (s === 'BEN' && vp.v.f && vp.v.f.give) {
            vp.iobj = np;
            i = np.end;
            continue;
          }
          vp.pps.push({
            prep: t,
            np: np
          });
          i = np.end;
          continue;
        }
        if (s === 'BEN' && T[i + 1] && T[i + 1].pos === 'PRON') {
          vp.pps.push({
            prep: t,
            np: {
              start: i + 1,
              end: i + 2,
              head: T[i + 1],
              nmods: [],
              adjs: []
            }
          });
          i += 2;
          continue;
        }
        break;
      }
      if (t.pos === 'LOC' && !vp.obj && T[i + 1] && !(vp.v.f && vp.v.f.motion) && !vp.pps.length && tokZh(vp.v) !== '在') {
        const np = parseNP(T, i, j, {
          allowUnk: true
        });
        if (np && np.loc) {
          vp.pps.push({
            prep: mkTok(t.o, '在', 'PREP', {}),
            np: np,
            implicit: true
          });
          i = np.end;
          continue;
        }
      }
      if (t.pos === 'V' && t.f && t.f.caus) break;
      if (!vp.obj && !vp.clause && [ '知道', '问', '记得', '忘', '忘记', '明白' ].includes(tokZh(vp.v)) && [ 'PRON', 'N', 'NAME' ].includes(t.pos)) {
        const np = parseNP(T, i, j, {});
        if (np && np.end < j && (PRED_START.has(T[np.end].pos) || /^ở/.test(T[np.end].vi) || T[np.end].pos === 'Q') && T.slice(np.end, j).some(x => x.pos !== 'PUNCT')) {
          vp.clause = parseClause(T.slice(i, j), {
            allowBareSubj: true
          });
          i = j;
          break;
        }
      }
      if (t.pos === 'V' || t.pos === 'AUX' && vp.v.f && vp.v.f.vp) {
        const r = parseVP(T, i, j, P);
        vp.next = r.vp;
        i = r.end;
        if (vp.v.vi === 'đi' && r.vp.pre) {
          vp.pre = r.vp.pre;
          vp.preT = r.vp.preT;
          r.vp.pre = null;
        }
        break;
      }
      if ((t.pos === 'ADJ' || t.pos === 'DEG' && T[i + 1] && T[i + 1].pos === 'ADJ') && !vp.dcomp && !vp.obj && (vp.v.f && vp.v.f.cog || tokZh(vp.v) === '觉得')) {
        vp.clause = parseClause(T.slice(i, j), {
          allowBareSubj: true
        });
        i = j;
        break;
      }
      if (t.pos === 'ADJ' && !vp.obj && [ 'ăn', 'uống' ].includes(vp.v.vi) && [ 'cay', 'ngọt', 'mặn', 'chua', 'đắng', 'nóng', 'lạnh', 'nhạt', 'béo' ].includes(t.vi)) {
        const z = tokZh(t) + '的';
        t.pos = 'N';
        t.cands = [ {
          zh: z,
          py: pyOf(z),
          pos: 'N',
          f: {},
          src: 'rule'
        } ];
        t.sel = 0;
        t.f = {};
        continue;
      }
      if (t.pos === 'ADJ' && [ 'sớm', 'muộn' ].includes(t.vi) && (P.causCtx || P.imp || P.aux.length)) {
        vp.pre = t.vi === 'sớm' ? '早点儿' : '晚点儿';
        vp.preT = t;
        i++;
        continue;
      }
      if ((t.pos === 'ADJ' || t.pos === 'DEG' && T[i + 1] && T[i + 1].pos === 'ADJ') && !vp.dcomp) {
        const deg = t.pos === 'DEG' ? t : null, adj = deg ? T[i + 1] : t;
        if (!deg && [ 'sạch', 'rõ', 'đúng', 'sai', 'xong', 'hết', 'no', 'say', 'mệt', 'chết', 'hỏng', 'vỡ', 'đầy', 'nhầm' ].includes(adj.vi)) {
          const R = {
            'sạch': '干净',
            'rõ': '清楚',
            'đúng': '对',
            sai: '错',
            xong: '完',
            'hết': '完',
            no: '饱',
            say: '醉',
            'mệt': '累',
            'chết': '死',
            'hỏng': '坏',
            'vỡ': '破',
            'đầy': '满',
            'nhầm': '错'
          }[adj.vi];
          adj.cands = [ {
            zh: R,
            py: pyOf(R),
            pos: 'RES',
            f: {}
          } ];
          adj.sel = 0;
          adj.pos = 'RES';
          vp.comps.push(adj);
          i++;
          continue;
        }
        if (!deg && T[i + 1] && semOf(T[i + 1]) === 'ABIT') {
          adj.pos = 'RES';
          adj.f = Object.assign({}, adj.f, {
            bitc: true
          });
          vp.comps.push(adj);
          const b = T[i + 1];
          b.pos = 'RES';
          b.cands = [ {
            zh: '一点儿',
            py: 'yìdiǎnr',
            pos: 'RES',
            f: {
              bitc: true
            }
          } ];
          b.sel = 0;
          b.f = {
            bitc: true
          };
          vp.comps.push(b);
          i += 2;
          continue;
        }
        vp.dcomp = {
          adj: adj,
          deg: deg
        };
        i += deg ? 2 : 1;
        continue;
      }
      if (t.pos === 'DEGP' && vp.dcomp && !vp.dcomp.degp) {
        vp.dcomp.degp = t;
        i++;
        continue;
      }
      if (!vp.obj && !vp.dcomp && (NPHEAD.has(t.pos) || t.pos === 'NUM' || t.pos === 'QUANT' || t.pos === 'CL' || t.pos === 'LOC' || t.pos === 'Q' || t.pos === 'DEM' && cur(t).f.dem || t.pos === 'QTY')) {
        if (vp.v.f && vp.v.f.cog && predAhead(T, i + 1, j)) {
          const sub = parseClause(T.slice(i, j), {
            allowBareSubj: true
          });
          vp.clause = sub;
          i = j;
          break;
        }
        if (t.pos === 'Q' && ![ 'gì', 'cái gì', 'ai', 'đâu', 'mấy', 'bao nhiêu' ].includes(t.vi) && semOf(t) !== 'NUM') break;
        let np = parseNP(T, i, j, {
          allowUnk: true,
          adj: false,
          simOK: true
        });
        if (np && np.end < j) {
          const a = T[np.end], deg = a.pos === 'DEG' && T[np.end + 1] && T[np.end + 1].pos === 'ADJ', adjT = deg ? T[np.end + 1] : a;
          if (a.pos === 'ADJ' || deg) {
            const after = T[np.end + (deg ? 2 : 1)];
            const ACQ = new Set([ 'mua', 'bán', 'có', 'cần', 'thích', 'yêu', 'muốn', 'tìm', 'lấy', 'cầm', 'mang', 'mặc', 'đội', 'đeo', 'chọn', 'ăn', 'uống', 'gặp', 'thấy', 'nhìn', 'tặng', 'cho', 'đưa', 'gửi', 'là', 'nấu', 'làm', 'thuê', 'đặt', 'nuôi', 'ghét' ]);
            const comp = deg || after && after.pos === 'CMP' || DCOMP[adjT.vi] && !ACQ.has(vp.v.vi);
            if (!comp) np = parseNP(T, i, j, {
              allowUnk: true,
              simOK: true
            });
          }
        }
        if (np) {
          vp.obj = np;
          i = np.end;
          if (vp.v.f && vp.v.f.give || [ '给', '送', '告诉', '教', '问', '借' ].includes(tokZh(vp.v))) {
            if (np.head && (np.head.pos === 'PRON' || npPerson(np)) && i < j) {
              const np2 = parseNP(T, i, j, {
                allowUnk: true
              });
              if (np2) {
                vp.obj2 = np2;
                i = np2.end;
              }
            }
          }
          continue;
        }
        if (t.pos === 'Q') {
          vp.obj = {
            start: i,
            end: i + 1,
            head: t,
            nmods: [],
            adjs: []
          };
          i++;
          continue;
        }
        break;
      }
      if (t.pos === 'COMP') {
        i++;
        if (vp.v.f && vp.v.f.cog || true) {
          const sub = parseClause(T.slice(i, j), {
            allowBareSubj: true
          });
          vp.clause = sub;
          i = j;
        }
        break;
      }
      if (t.pos === 'CMP' || t.pos === 'DEGP') break;
      break;
    }
    return {
      vp: vp,
      end: i
    };
  }
  function post(T, i, j, P) {
    let guard = 0;
    while (i < j && guard++ < 20) {
      const t = T[i];
      if (t.pos === 'CMP') {
        if (t.cmp === 'sup') {
          P.sup = {
            t: t
          };
          i++;
          if (T[i] && (T[i].pos === 'PREP' || T[i].pos === 'LOC') && T[i + 1]) {
            const np = parseNP(T, i + 1, j, {});
            if (np) {
              P.sup.scope = np;
              P.sup.scopeT = T[i];
              i = np.end;
            }
          } else if (T[i] && (T[i].pos === 'N' || T[i].pos === 'PLACE' || T[i].pos === 'NAME')) {
            const np = parseNP(T, i, j, {
              adj: false
            });
            if (np) {
              P.sup.scope = np;
              i = np.end;
            }
          }
          continue;
        }
        const np = parseNP(T, i + 1, j, {
          allowUnk: true,
          adj: t.cmp === 'like' && !(T[i + 2] && isW(T[i + 2], 'nhiều', 'ít', 'hẳn'))
        });
        if (!np && t.cmp === 'more' && P.kind === 'adj') {
          P.bit = t;
          P.bitMore = true;
          i++;
          continue;
        }
        P.cmp = {
          type: t.cmp,
          t: t,
          np: np
        };
        i = np ? np.end : i + 1;
        if (t.cmp === 'like' && T[i] && T[i].pos === 'ADJ' && !P.adj) {
          P.cmp.adjAfter = T[i];
          i++;
        }
        if (T[i] && isW(T[i], 'nhiều', 'rất nhiều', 'hẳn', 'nhiều lắm')) {
          P.cmp.much = T[i];
          i++;
        } else if (T[i] && semOf(T[i]) === 'ABIT') {
          P.cmp.bit = T[i];
          i++;
        } else if (T[i] && (T[i].pos === 'QTY' || T[i].pos === 'TIME' && T[i].f.kind === 'dur' || T[i].pos === 'NUM')) {
          const np2 = parseNP(T, i, j, {});
          P.cmp.qty = np2 || {
            start: i,
            end: i + 1,
            head: T[i],
            nmods: [],
            adjs: []
          };
          i = P.cmp.qty.end;
        }
        continue;
      }
      if (semOf(t) === 'ABIT' && P.kind === 'adj') {
        P.bit = t;
        i++;
        continue;
      }
      if (t.pos === 'DEGP') {
        P.degp = t;
        i++;
        continue;
      }
      if (t.pos === 'PERF') {
        P.perf = true;
        i++;
        continue;
      }
      if (t.pos === 'ADV' && semOf(t) === 'MORE') {
        P.more = true;
        i++;
        continue;
      }
      if (t.pos === 'ADV' && t.post) {
        P.advs.push(t);
        i++;
        continue;
      }
      if (t.pos === 'QA' && semOf(t) === 'HOWQ') {
        P.howQ = true;
        i++;
        continue;
      }
      if (t.pos === 'TIME' && t.f && (t.f.kind === 'dur' || t.f.kind === 'freq')) {
        if (t.f.kind === 'dur') P.dur = t; else P.freq = t;
        i++;
        continue;
      }
      if (t.pos === 'PREP' && P.kind === 'adj') {
        const np = parseNP(T, i + 1, j, {});
        if (np) {
          P.pps.push({
            prep: t,
            np: np,
            postAdj: true
          });
          i = np.end;
          continue;
        }
      }
      if (t.pos === 'PREP' && P.kind === 'v' && P.vp) {
        const np = parseNP(T, i + 1, j, {
          allowUnk: true
        });
        if (np && semOf(t) !== 'PURP') {
          P.vp.pps.push({
            prep: t,
            np: np
          });
          i = np.end;
          continue;
        }
      }
      if (t.pos === 'RES' && P.vp) {
        P.vp.comps.push(t);
        i++;
        continue;
      }
      break;
    }
    return i;
  }
  const SPORT = {
    '足球': '踢',
    '篮球': '打',
    '羽毛球': '打',
    '网球': '打',
    '乒乓球': '打',
    '排球': '打',
    '钢琴': '弹',
    '吉他': '弹',
    '游戏': '玩'
  };
  function senseVerb(vp, P, V) {
    const v = vp.v, c = cur(v), obj = vp.obj, oh = obj && obj.head, ohz = oh ? zhOf(oh) : '';
    let zh = c ? c.zh : v.o, py = c ? c.py : '', note = null;
    const set = (z, n) => {
      zh = z;
      py = pyOf(z);
      if (n) note = n;
    };
    switch (v.vi) {
     case 'đi':
      if (oh && (oh.f && oh.f.trans || cur(oh) && cur(oh).f.trans)) {
        const tv = cur(oh).f.trans || oh.f.trans;
        set(tv === true ? '坐' : tv, '“đi + phương tiện” → 坐/骑 + phương tiện');
      } else if (obj || vp.dest || vp.next || vp.pps.some(p => p.q)) set('去'); else if (P && (P.perf || P.asp.length)) set('走'); else set(vp.v2 ? '去' : '去');
      break;

     case 'đến':
     case 'tới':
      if (vp.next && obj) set('去', '“đến + nơi chốn + V (mục đích)” → 去 + nơi chốn + V'); else if (vp.next && !obj) set('来'); else if (obj) set('到'); else set('来');
      break;

     case 'chơi':
      if (ohz && SPORT[ohz]) set(SPORT[ohz], `“chơi ${npTextSafe(obj)}” → ${SPORT[ohz]}${ohz}`);
      break;

     case 'làm':
      if (oh && oh.pos === 'Q') set('干', '“làm gì” → 干什么');
      break;

     case 'mở':
      if (ohz === '门' || ohz === '窗户') set('开');
      break;

     case 'mất':
      if (P && P.dur || oh && oh.pos === 'TIME') set('花', '“mất + thời gian” → 花');
      break;

     case 'nói':
      break;

     case 'học':
      if (!obj && !vp.dcomp) set('学习'); else set('学');
      break;

     case 'thấy':
      if (vp.clause || vp.dcomp) set('觉得');
      break;

     case 'nghĩ':
      if (vp.clause) set('觉得');
      break;

     case 'mặc':
      break;

     case 'mượn':
      break;
    }
    if (c && c.f && c.f.wo && (obj || vp.next)) {
      const [z, p] = c.f.wo.split(':');
      if (z === '去学' && !obj) {} else {
        zh = z;
        py = p || pyOf(z);
      }
    }
    return {
      zh: zh,
      py: py,
      note: note
    };
  }
  const npTextSafe = np => np && np.head ? np.head.o : '';
  function posting(w) {
    const D = dict();
    if (D.post.has(w)) return D.post.get(w);
    const s = new Set;
    if (w) D.sents.forEach((x, i) => {
      if (x.indexOf(w) >= 0) s.add(i);
    });
    D.post.set(w, s);
    return s;
  }
  function contextPick(T) {
    const content = T.filter(t => t.cands && t.cands.length && [ 'N', 'V', 'ADJ' ].includes(t.pos));
    content.forEach(t => {
      const alts = t.cands.map((c, idx) => ({
        c: c,
        idx: idx
      })).filter(x => x.c.pos === t.pos && x.c.src !== 'core' || x.idx === t.sel);
      if (alts.length < 2 || cur(t).src === 'core') return;
      const others = content.filter(o => o !== t).map(o => zhOf(o)).filter(Boolean);
      if (!others.length) return;
      let best = null;
      alts.slice(0, 6).forEach(x => {
        const P0 = posting(x.c.zh);
        let sc = -x.c.cost * 2;
        others.forEach(o => {
          const P1 = posting(o);
          let n = 0;
          if (P0.size && P1.size) {
            const [a, b] = P0.size < P1.size ? [ P0, P1 ] : [ P1, P0 ];
            a.forEach(v => {
              if (b.has(v)) n++;
            });
          }
          sc += Math.log(1 + n) * .6;
        });
        if (!best || sc > best.sc) best = {
          sc: sc,
          idx: x.idx
        };
      });
      if (best && best.idx !== t.sel) {
        t.ctxPicked = {
          from: zhOf(t)
        };
        t.sel = best.idx;
      }
    });
  }
  function G(V) {
    const pieces = [], analysis = [], rules = [], points = [], warn = [];
    const S = {
      pieces: pieces,
      analysis: analysis,
      rules: rules,
      points: points,
      warn: warn,
      V: V
    };
    S.out = (zh, role, vi, py) => {
      if (!zh) return;
      S.pieces.push({
        zh: zh,
        py: py != null ? py : pyOf(zh),
        role: role,
        vi: vi || ''
      });
    };
    S.mark = (role, vi, zh) => {
      if (vi || zh) analysis.push({
        role: role,
        vi: vi,
        zh: zh
      });
    };
    S.rule = r => {
      if (!rules.includes(r)) rules.push(r);
    };
    S.point = (key, n, label) => {
      if (!points.some(p => p.key === key)) points.push({
        key: key,
        n: n,
        label: label
      });
    };
    return S;
  }
  const tokZh = (t, S) => {
    const c = cur(t);
    return c ? c.zh : t && t.o || '';
  };
  const tokPy = t => {
    const c = cur(t);
    return c ? c.py || pyOf(c.zh) : '';
  };
  function genTok(S, t, role) {
    if (!t) return '';
    if (t.unk || t.pos === 'UNK' || t.pos === 'NAME') {
      const z = t.o;
      S.out('【' + z + '】', role, t.o, z);
      return z;
    }
    const k = S.V.sense && S.V.sense[t._id] != null ? S.V.sense[t._id] : null;
    const c = k != null && t.cands[k] ? t.cands[k] : cur(t);
    if (!c || !c.zh) return '';
    S.out(c.zh, role, t.o, c.py || pyOf(c.zh));
    return c.zh;
  }
  function npZh(S, T, np) {
    const s = G(S.V);
    s.V = S.V;
    genNP(s, T, np, 'O');
    return s.pieces.map(p => p.zh).join('');
  }
  function genNP(S, T, np, role) {
    if (!np) return;
    const start = S.pieces.length;
    if (np.qty && !np.head) {
      S.out(numZh(np.num.num, false), role, np.num.o);
      return;
    }
    const head = np.head, hz = head ? head.pos === 'NAME' || head.unk ? head.o : tokZh(head) : '';
    const hc = head && cur(head), hf = hc && hc.f || head && head.f || {};
    if (np.poss) {
      genNP(S, T, np.poss, role);
      const pron = np.poss.head && np.poss.head.pos === 'PRON';
      const noDe = pron && (hf.kin || head && head.f && head.f.kin) && !np.adjs.length && !np.num;
      if (!noDe) S.out('的', role, 'của'); else S.rule('Đại từ + người thân / nơi chốn thân thuộc → không cần 的 (我妈妈, 我家)');
    }
    let mw = '';
    const needMW = np.num || np.dem || np.q && np.q.vi === 'nào' && !np.q.indefQ || np.quant && cur(np.quant).f.mw;
    if (needMW && head && !NOMW.has(hz) && !(head.pos === 'PRON') && !(head.pos === 'TIME')) {
      const cl = np.cl && cur(np.cl);
      mw = cl && cl.f && cl.f.own ? cl.zh : hf.mw && hf.mw !== true ? hf.mw : NMW[hz] || (cl ? cl.zh : '个');
      if (np.cl && cl && cl.f.sem === 'PERSONCL') mw = hf.mw || '个';
    } else if (needMW && !head && np.cl) mw = cur(np.cl).zh;
    if (np.quant) {
      const z = cur(np.quant).zh;
      if (z) S.out(np.dem && z === '' ? '' : z, role, np.quant.o);
      if (np.quant.f && np.quant.f.pl && np.dem) {}
    }
    if (np.dem) {
      const dz = tokZh(np.dem);
      const pl = np.quant && cur(np.quant).f.pl;
      S.out(pl && !np.num ? dz + '些' : dz, role, np.dem.o);
      if (pl && !np.num) mw = '';
    }
    if (np.q && np.q.vi === 'nào' && !np.q.indefQ) S.out('哪', role, np.q.o);
    if (np.num) {
      if (np.num.pos === 'Q') S.out('几', role, np.num.o); else S.out(numZh(np.num.num, !!mw || NOMW.has(hz)), role, np.num.o);
    }
    if (mw) S.out(mw, role, np.cl ? np.cl.o : '', pyOf(mw));
    if (np.q && np.q.vi !== 'nào') S.out('什么', role, np.q.o);
    if (np.sim) {
      S.out('像', role, np.sim.cmp.o);
      genNP(S, T, np.sim.np, role);
      S.out('那么', role, '');
      genTok(S, np.sim.adj, role);
      S.out('的', role, '');
      S.rule('“N + tính từ + như + B” làm định ngữ → 像 + B + 那么 + tính từ + 的 + N');
    }
    np.adjs.forEach(a => {
      if (a.sup) {
        if (np.supScope) {
          genNP(S, T, np.supScope, role);
          const sh = np.supScope.head, shz = sh ? tokZh(sh) : '';
          if (/世界|地球/.test(shz)) S.out('上', role, ''); else if (!(sh && (sh.pos === 'NAME' || /国|市|省|河内|北京|上海|越南|中国|胡志明/.test(shz)))) S.out('里', role, '');
        }
        S.out('最', role, a.sup.o);
        genTok(S, a.adj, role);
        S.out('的', role, '');
        S.rule('“N + tính từ + nhất (+ phạm vi)” làm định ngữ → (phạm vi里) + 最 + tính từ + 的 + N (班里最高的人)');
        return;
      }
      if (a.deg) genTok(S, a.deg, role);
      const z = genTok(S, a.adj, role);
      if (a.deg || [ ...z ].length > 1 && !a.color) S.out('的', role, '');
      S.rule('Định ngữ tính từ: danh từ + tính từ (Việt) → tính từ (+的) + danh từ (Trung)');
    });
    for (let x = np.nmods.length - 1; x >= 0; x--) {
      genTok(S, np.nmods[x], role);
    }
    if (np.nmods.length) S.rule('Danh từ bổ nghĩa đứng sau (Việt) → đứng trước (Trung): sách tiếng Trung → 中文书');
    if (head) {
      if (head.title) {} else if (head.pos === 'NAME' || head.unk) S.out('【' + head.o + '】', role, head.o, head.o); else genTok(S, head, role);
      if (np.quant && cur(np.quant).f.pl && !np.dem && !np.num && npPerson(np) && head.pos !== 'PRON') S.out('们', role, np.quant.o);
    } else if (np.cl && !np.dem && !np.num && !np.q) {}
    if (np.loc) {
      let z = tokZh(np.loc);
      const proper = head && (hf.place && (head.pos === 'PLACE' || /国|市|省|河内|北京|上海|越南|中国/.test(hz))) || head && head.pos === 'NAME';
      if (proper && z === '里') z = '';
      if (z) {
        S.out(z, role, np.loc.o);
        S.rule('Giới từ phương vị đứng trước (Việt: trên bàn) → phương vị từ đứng sau (Trung: 桌子上)');
      }
    }
    if (np.coord) {
      const sem = semOf(np.coord.conj);
      S.out(sem === 'ORQ' ? np.coord.conj.orStmt ? '或者' : '还是' : sem === 'OR' ? '或者' : '和', role, np.coord.conj.o);
      genNP(S, T, np.coord.np, role);
    }
    return S.pieces.slice(start);
  }
  const zhJoin = arr => (arr || []).map(p => p.zh).join('');
  function genClause(S, st, ctx) {
    const T = st.T, P = st.P, V = S.V, lit = !!V.lit;
    ctx = ctx || {};
    const pastTime = st.time.some(t => cur(t) && cur(t).f && cur(t).f.past) || ctx.past;
    if (st.voc) {
      const ps = genNP(S, T, st.voc, 'VOC');
      S.mark('Hô ngữ', npText(T, st.voc), zhJoin(ps));
      S.out('，', 'PUNC');
    }
    st.intj.forEach(t => {
      const z = genTok(S, t, 'INTJ');
      if (z) {
        S.mark('Thán từ', t.o, z);
        S.out('，', 'PUNC');
      }
    });
    if (ctx.pre) ctx.pre.forEach(x => S.out(x.zh, x.role || 'CONJ', x.vi));
    if (st.topic && st.subj && !P) {
      const ps = genNP(S, T, st.subj, 'S');
      S.mark('Chủ đề', npText(T, st.subj), zhJoin(ps));
      S.out('呢', 'PART', st.topic.o);
      S.rule('“Còn + A?” → A + 呢？');
      st._q = 'ne';
      return;
    }
    if (P && P.cmp && P.cmp.type === 'more' && P.kind === 'v' && !(P.vp && P.vp.dcomp) && P.cmp.np) {
      S.out('比起', 'CMP', 'hơn');
      const ps = genNP(S, T, P.cmp.np, 'CMP');
      S.out('，', 'PUNC');
      S.mark('So sánh', 'hơn ' + npText(T, P.cmp.np), '比起' + zhJoin(ps) + '，更…');
      S.rule('V + A + hơn + B → 比起 B，(S) 更 V + A');
      P._cmpDone = true;
    }
    const timeFirst = !st.subj || st.exist || st.subj.head && tokZh(st.subj.head) === '天气';
    const putTime = () => st.time.forEach(t => {
      const z = genTok(S, t, 'T');
      S.mark('Thời gian', t.o, z);
    });
    if (timeFirst && st.time.length) {
      putTime();
      S.rule('Trạng ngữ thời gian đứng trước động từ (thường ngay sau chủ ngữ hoặc đầu câu)');
    }
    if (st.subj) {
      const ps = genNP(S, T, st.subj, 'S');
      S.mark('Chủ ngữ', npText(T, st.subj), zhJoin(ps));
      if (!timeFirst && st.time.length) {
        putTime();
        S.rule('Trạng ngữ thời gian: đặt sau chủ ngữ, trước động từ (Việt hay đặt cuối câu)');
      }
    }
    if (!st.subj && st.subjP) {
      const s0 = S.pieces.length;
      genPred(S, st, st.subjP, {
        q: null
      });
      const z = S.pieces.slice(s0).map(p => p.zh).join('');
      S.mark('Chủ ngữ (cụm động từ)', T.slice(st.subjP.vp ? st.subjP.vp.start : 0, st.subjP.vp ? st.subjP.vp.start + 1 : 0).map(t => t.o).join(' ') + ' …', z);
      S.rule('Cụm động từ làm chủ ngữ (Học tiếng Trung | rất thú vị) → giữ nguyên trật tự: 学汉语很有意思');
    }
    if (ctx.afterSubj) ctx.afterSubj.forEach(x => {
      const adz = P ? P.advs.map(a => tokZh(a)) : [];
      if (x.zh === '就' && adz.some(z => z === '也' || z === '都' || z === '还是' || z === '还')) return;
      if (adz.includes(x.zh)) return;
      S.out(x.zh, 'CONJ', x.vi);
    });
    if (!P) {
      if (st.rest.length) restOut(S, st.rest);
      return;
    }
    genPred(S, st, P, {
      pastTime: pastTime,
      q: st.q
    });
    if (st.rest.length) restOut(S, st.rest);
  }
  function restOut(S, rest) {
    const z = rest.map(t => genTok(S, t, 'REST')).join('');
    S.mark('Chưa xác định', rest.map(t => t.o).join(' '), z);
    S.unparsed = (S.unparsed || 0) + rest.length;
  }
  function negZh(P, o) {
    const sems = P.neg.map(semOf), asp = P.asp.map(semOf);
    if (!P.neg.length) return null;
    const n0 = P.neg[0], s = sems[0];
    if (s === 'PROHIB') return {
      zh: '别',
      vi: n0.o
    };
    if (s === 'NOTYET') return {
      zh: cur(n0).zh === '还没' ? '还没' : asp.includes('PAST') ? '还没' : '还没',
      vi: n0.o,
      notyet: true
    };
    if (s === 'NEVER') return {
      zh: '从来没',
      vi: n0.o,
      notyet: true,
      exp: true
    };
    if (s === 'NEVERF') return {
      zh: '从来不',
      vi: n0.o
    };
    if (s === 'NOTCOP') return {
      zh: '不是',
      vi: n0.o,
      cop: true
    };
    if (s === 'NOTVERY') return {
      zh: '不太',
      vi: n0.o + ' … lắm'
    };
    const past = asp.includes('PAST') || o.pastTime;
    if (o.kind === 'v' && past && !o.stative) return {
      zh: '没',
      vi: n0.o,
      past: true
    };
    if (asp.includes('PROG')) return {
      zh: '没在',
      vi: n0.o
    };
    return {
      zh: '不',
      vi: n0.o
    };
  }
  const STATIVE = new Set([ '是', '喜欢', '爱', '知道', '认识', '想', '觉得', '会', '能', '可以', '希望', '需要', '怕', '讨厌', '相信', '像', '懂', '明白', '在', '姓', '叫', '应该', '担心', '记得', '以为' ]);
  function genPred(S, st, P, o) {
    const T = st.T, V = S.V, lit = !!V.lit, q = o.q;
    const out = S.out;
    const asp = P.asp.map(semOf);
    let tail = [];
    P.qa.forEach(t => {
      const s = semOf(t);
      if (s === 'HOW') return;
      if (t.vi === 'sao') {
        out('怎么', 'Q', t.o);
        S.mark('Câu hỏi (ngạc nhiên)', t.o, '怎么');
        S.rule('“Sao + A + thế?” → 怎么这么 + A？');
        return;
      }
      const z = genTok(S, t, 'Q');
      S.mark('Câu hỏi', t.o, z);
      S.rule(`Từ để hỏi “${t.o}” → ${z} đặt sau chủ ngữ, trước động từ`);
    });
    const advPre = P.advs.filter(a => !a.post && semOf(a) !== 'TOGETHER' && semOf(a) !== 'FIRST');
    advPre.forEach(a => {
      const z = semOf(a) === 'CAI' ? '才' : genTok(S, a, 'ADV');
      if (semOf(a) === 'CAI') out('才', 'ADV', a.o);
      S.mark('Trạng ngữ', a.o, z || '才');
    });
    const vHead = P.kind === 'v' && P.vp ? P.vp : null;
    const vZh = vHead ? senseVerb(vHead, P, V).zh : '';
    const stative = STATIVE.has(vZh) || P.kind === 'adj' || P.kind === 'cop' || P.kind === 'nom';
    let neg = negZh(P, {
      kind: P.kind,
      pastTime: o.pastTime,
      stative: stative
    });
    const auxs = P.aux.slice();
    if (P.imp) {
      const imp = auxs.find(a => semOf(a) === 'IMP');
      if (imp && imp.vi !== 'hãy') {
        out('请', 'ADV', imp.o);
        S.mark('Cầu khiến', imp.o, '请');
      } else if (imp) {
        tail.push({
          zh: '吧',
          vi: imp.o
        });
        S.mark('Cầu khiến', imp.o, '…吧');
        S.rule('“Hãy + V” → V + 吧');
      }
    }
    const realAux = auxs.filter(a => semOf(a) !== 'IMP');
    if (neg && neg.zh === '不' && realAux.length) {
      const a = realAux[0], az = tokZh(a);
      const map = {
        '想': '不想',
        '可以': '不能',
        '能': '不能',
        '得': '不用',
        '必须': '不用',
        '需要': '不用',
        '应该': '不应该',
        '敢': '不敢',
        '会': '不会',
        '打算': '不打算',
        '希望': '不希望'
      };
      const z = map[az] || '不' + az;
      out(z, 'NEG', P.neg[0].o + ' ' + a.o);
      S.mark('Phủ định + trợ động từ', P.neg[0].o + ' ' + a.o, z);
      S.rule(`“${P.neg[0].o} ${a.o}” → ${z} + động từ`);
      realAux.shift();
      neg = null;
      realAux.forEach(x => {
        const zz = genTok(S, x, 'AUX');
        S.mark('Trợ động từ', x.o, zz);
      });
    } else if (neg && realAux.length && P.aux.indexOf(realAux[0]) >= 0 && P.neg.length && T.indexOf(P.neg[0]) > T.indexOf(realAux[0])) {
      realAux.forEach(x => {
        const zz = genTok(S, x, 'AUX');
        S.mark('Trợ động từ', x.o, zz);
      });
      realAux.length = 0;
    }
    const prog = asp.includes('PROG'), soon = asp.includes('SOON'), just = asp.includes('JUST'), fut = asp.includes('FUT'), exp = asp.includes('EXP'), past = asp.includes('PAST');
    if (fut && !neg) {
      const t = P.asp.find(a => semOf(a) === 'FUT');
      out(V.fut ? '要' : '会', 'ASP', t.o);
      S.mark('Thì tương lai', t.o, V.fut ? '要' : '会');
      S.point('fut', 2, 'sẽ → 会 / 要');
      S.rule('“sẽ + V” → 会/要 + V');
    }
    if (fut && neg && neg.zh === '不') {
      out('不会', 'NEG', P.neg[0].o);
      S.mark('Phủ định tương lai', 'sẽ ' + P.neg[0].o, '不会');
      neg = null;
    }
    if (neg) {
      if (P.kind === 'have') {} else if (P.kind === 'cop' && neg.zh === '不') {} else {
        out(neg.zh, 'NEG', neg.vi);
        S.mark('Phủ định', neg.vi, neg.zh);
        if (neg.zh === '没') S.rule('Phủ định hành động đã xảy ra (đã/hôm qua…) → 没 + V (không dùng 了)');
        if (neg.notyet) S.rule('“chưa + V” → 还没 + V');
        if (neg.zh === '别') S.rule('“đừng + V” → 别 + V');
      }
    }
    realAux.forEach(x => {
      const zz = genTok(S, x, 'AUX');
      S.mark('Trợ động từ', x.o, zz);
      S.rule(`Trợ động từ “${x.o}” → ${zz} + động từ`);
    });
    if (prog && !neg && vHead && tokZh(vHead.v) === '在') {
      S.rule('“đang ở + nơi chốn” → 在 + nơi chốn (không thêm 正在)');
    } else if (prog && !neg) {
      const t = P.asp.find(a => semOf(a) === 'PROG');
      out(V.prog ? '在' : '正在', 'ASP', t.o);
      S.mark('Thể tiếp diễn', t.o, V.prog ? '在' : '正在');
      S.point('prog', 2, 'đang → 正在 / 在');
      S.rule('“đang + V” → 正在 + V');
    }
    if (soon) {
      const t = P.asp.find(a => semOf(a) === 'SOON');
      out('快要', 'ASP', t.o);
      tail.push({
        zh: '了',
        vi: ''
      });
      S.mark('Sắp xảy ra', t.o, '快要…了');
      S.rule('“sắp + V” → 快要 + V + 了');
    }
    if (just) {
      const t = P.asp.find(a => semOf(a) === 'JUST');
      out('刚', 'ASP', t.o);
      S.mark('Vừa mới', t.o, '刚');
      S.rule('“vừa/mới + V” → 刚 + V');
    }
    if (past && lit && !neg && P.kind !== 'adj') {
      const t = P.asp.find(a => semOf(a) === 'PAST');
      out('已经', 'ASP', t.o);
    }
    if (past && P.perf && !neg && !lit) {
      out('已经', 'ASP', 'đã');
      S.rule('“đã … rồi” → 已经 … 了');
    }
    if (P.pass && !P.pass.np && vHead && vHead.obj) {
      S.mark('Bị (không có tác nhân)', P.pass.t.o, '—');
      S.rule('“bị + V + tân ngữ” (không có tác nhân: bị mất điện thoại) → không dùng 被: 丢了手机');
    } else if (P.pass) {
      out('被', 'PASS', P.pass.t.o);
      if (P.pass.np) genNP(S, T, P.pass.np, 'AG');
      S.mark('Bị động', P.pass.t.o + (P.pass.np ? ' ' + npText(T, P.pass.np) : ''), '被' + (P.pass.np ? npZh(S, T, P.pass.np) : ''));
      S.rule('“bị/được + (tác nhân) + V” → 被 + (tác nhân) + V');
      if (!P.neg.length && !P.aux.length && !(P.asp || []).some(x => [ 'FUT', 'PROG' ].includes(semOf(x))) && !P.perf && !(vHead && (vHead.comps.length || vHead.dcomp))) {
        tail.push({
          zh: '了',
          vi: ''
        });
        S.rule('Câu bị động 被 thường cần thành phần khác sau động từ → thêm 了 (她被老师表扬了)');
      }
    }
    const pps = (P.pps || []).concat(vHead ? vHead.pps.filter(p => !isLocVerb(vHead, p)) : []);
    const ORDER = {
      '从': 1,
      '在': 2,
      '跟': 3,
      '对': 4,
      '给': 5,
      '用': 6,
      '为': 7,
      '按照': 8,
      '离': 0,
      '关于': 9,
      '为了': 10,
      '到': 2.5,
      '大约': 11
    };
    const prepZh = pp => {
      const s = semOf(pp.prep);
      if (s === 'ABOUT') return '关于';
      return tokZh(pp.prep);
    };
    pps.filter(pp => !pp.postAdj).sort((a, b) => (ORDER[prepZh(a)] || 5) - (ORDER[prepZh(b)] || 5)).forEach(pp => {
      let pz = prepZh(pp);
      const tr = pp.np && pp.np.head && cur(pp.np.head) && cur(pp.np.head).f.trans;
      if (semOf(pp.prep) === 'INSTR' && tr) {
        pz = tr === true ? '坐' : tr;
        S.rule('“bằng + phương tiện” → 坐/骑 + phương tiện (đặt trước động từ)');
      } else if (pz === '在') S.rule('“V + ở + nơi chốn” → 在 + nơi chốn + V (giới từ đặt trước động từ)'); else if (pz === '跟') S.rule('“V + với + A” → 跟 + A + V'); else if (pz === '给') S.rule('“V + cho + A” → 给 + A + V'); else if (pz === '用') S.rule('“V + bằng + công cụ” → 用 + công cụ + V'); else if (pz === '从') S.rule('“từ + A” → 从 + A (trước động từ)');
      const lp = S.pieces[S.pieces.length - 1];
      if (pz === '在' && lp && lp.role === 'ASP' && /在$/.test(lp.zh)) S.rule('“đang + V + ở + nơi chốn” → 正在 + nơi chốn + V (gộp 在, không lặp 在在)'); else out(pz, 'PREP', pp.prep.o);
      const ps = genNP(S, T, pp.np, 'PP');
      if (pz === '在' && pp.np.head && !pp.np.loc && [ 'N' ].includes(pp.np.head.pos) && !(cur(pp.np.head).f.place || cur(pp.np.head).f.kin) && !NOMW.has(tokZh(pp.np.head))) {}
      if (pz === '离') out('', 'PREP');
      S.mark('Trạng ngữ (giới từ)', pp.prep.o + ' ' + npText(T, pp.np), pz + zhJoin(ps));
    });
    if (P.advs.some(a => semOf(a) === 'TOGETHER')) {
      out('一起', 'ADV', 'cùng nhau');
      S.mark('Trạng ngữ', 'cùng nhau', '一起');
    }
    if (P.advs.some(a => semOf(a) === 'FIRST')) {
      out('先', 'ADV', 'trước');
      S.mark('Trạng ngữ', 'trước', '先');
      S.rule('“V + trước” → 先 + V');
    }
    if (P.more && !(neg && neg.zh)) {
      out('再', 'ADV', 'nữa');
      S.mark('Trạng ngữ', 'nữa', '再');
      S.rule('“V + nữa” → 再 + V');
    }
    if (P.qa.some(t => semOf(t) === 'HOW') || P.howV) {
      out('怎么', 'Q', 'thế nào');
      S.mark('Câu hỏi', 'thế nào / làm sao', '怎么');
      S.rule('“V + thế nào / làm sao + V” → 怎么 + V');
    }
    const C = P._cmpDone ? null : P.cmp;
    let cmpSuffix = [], simile = false;
    const B = C && C.np;
    const bPerson = B && npPerson(B), bAnim = B && (npIs(B, 'anim') || B.head && B.head.pos === 'N' && !bPerson);
    const hasDcomp = vHead && vHead.dcomp;
    if (P.cmp && P.kind === 'v' && P.cmp.type === 'more' && !hasDcomp) {
      out('更', 'CMP', 'hơn');
      S.mark('So sánh hơn', 'hơn', '更');
    }
    if (C && P.kind === 'v' && C.type === 'like' && !hasDcomp) {
      if (lit || V.simile === 1) {
        out('像', 'CMP', C.t.o);
        const ps = genNP(S, T, B, 'CMP');
        out('一样', 'CMP', '');
        S.mark('So sánh ví von', C.t.o + ' ' + npText(T, B), '像' + zhJoin(ps) + '一样');
        S.rule('A + V + như + B → A + 像 + B + 一样 + V (sát cấu trúc)');
        P._likeDone = true;
      }
      S.point('simile', 2, 'ví von: V得跟B一样 / 像B一样V');
    } else if (C && P.kind !== 'v' || C && hasDcomp) {
      if (C.type === 'more') {
        if (!hasDcomp) {
          out('比', 'CMP', C.t.o);
          const ps = genNP(S, T, B, 'CMP');
          S.mark('So sánh hơn', C.t.o + ' ' + npText(T, B), '比' + zhJoin(ps));
          S.rule('A + tính từ + hơn + B → A + 比 + B + tính từ');
        }
        if (C.much) cmpSuffix.push({
          zh: '得多',
          vi: C.much.o
        }); else if (C.bit) cmpSuffix.push({
          zh: '一点儿',
          vi: C.bit.o
        }); else if (C.qty) cmpSuffix.push({
          np: C.qty
        });
      } else if (C.type === 'less') {
        out('没有', 'CMP', C.t.o);
        genNP(S, T, B, 'CMP');
        S.mark('So sánh kém', C.t.o + ' ' + npText(T, B), '没有' + npZh(S, T, B));
        S.rule('A + tính từ + kém + B → A + 没有 + B + tính từ');
      } else if ((C.type === 'eq' || C.type === 'like') && P.neg.length && P.kind === 'adj') {
        for (let x = S.pieces.length - 1; x >= 0; x--) if (S.pieces[x].role === 'NEG' && S.pieces[x].zh === '不') S.pieces.splice(x, 1);
        out('没有', 'CMP', P.neg[0].o + ' … ' + C.t.o);
        genNP(S, T, B, 'CMP');
        out('那么', 'CMP', '');
        S.mark('So sánh không bằng', 'không … ' + C.t.o + ' ' + npText(T, B), '没有' + npZh(S, T, B) + '那么…');
        S.rule('A + không + tính từ + bằng/như + B → A + 没有 + B + (那么) + tính từ');
        P._negDone = true;
      } else if (C.type === 'eq' || C.type === 'like' && (bPerson || lit || V.simile === 1) && !hasDcomp) {
        if (C.type === 'like' && !bPerson && (lit || V.simile === 1)) {
          out('像', 'CMP', C.t.o);
          genNP(S, T, B, 'CMP');
          out('一样', 'CMP', '');
          S.mark('So sánh ví von', C.t.o + ' ' + npText(T, B), '像' + npZh(S, T, B) + '一样');
          S.rule('A + tính từ + như + B → A + 像 + B + 一样 + tính từ (dịch sát cấu trúc)');
        } else {
          out('跟', 'CMP', C.t.o);
          genNP(S, T, B, 'CMP');
          out('一样', 'CMP', '');
          S.mark(C.type === 'eq' ? 'So sánh ngang bằng' : 'So sánh ngang bằng', C.t.o + ' ' + npText(T, B), '跟' + npZh(S, T, B) + '一样');
          S.rule(C.type === 'eq' ? 'A + tính từ + bằng + B → A + 跟 + B + 一样 + tính từ' : 'A + tính từ + như + B (người/vật cùng loại) → A + 跟 + B + 一样 + tính từ');
        }
        if (C.type === 'like' && !bPerson) S.point('simile', 2, 'ví von: 得跟B一样 / 像B一样');
      } else if (C.type === 'like') {
        simile = true;
        S.point('simile', 2, 'ví von: 得跟B一样 / 像B一样');
      }
    }
    const supT = P.sup;
    const supScope = supT && supT.scope;
    if (supScope && P.kind !== 'v') {
      out('是', 'COP', '');
    }
    if (supScope && P.kind === 'adj') {
      out('', '');
    }
    if (P.kind === 'adj') {
      if (supScope) {
        genNP(S, T, supScope, 'ADV');
        out(tokZh(supT.scopeT || {
          cands: [ {
            zh: '里'
          } ],
          sel: 0
        }) === '在' ? '' : '里', 'ADV', '');
        S.mark('Phạm vi so sánh', npText(T, supScope), npZh(S, T, supScope));
      }
      if (supT) {
        out('最', 'CMP', supT.t.o);
        S.mark('So sánh nhất', supT.t.o, '最');
        S.rule('A + tính từ + nhất → A + 最 + tính từ');
      }
      const degT = P.deg, degpT = P.degp;
      const degZ = degT ? tokZh(degT) : '';
      const pz = degpT ? tokZh(degpT) : '';
      if (!C || C.type === 'like' && simile || C.type === 'eq' || C.type === 'like') {
        if (degT && !(C && C.type === 'more')) {
          out(degZ, 'DEG', degT.o);
          S.mark('Phó từ mức độ', degT.o, degZ);
          if (semOf(degT) === 'MOREMORE') {
            tail.push({
              zh: '了',
              vi: ''
            });
            S.rule('“càng ngày càng + tính từ” → 越来越 + tính từ + 了');
          }
          if (semOf(degT) === 'TOO') tail.push({
            zh: '了',
            vi: ''
          });
          if (semOf(degT) === 'TOO') S.rule('“quá + tính từ” → 太 + tính từ + 了');
        } else if (degpT && semOf(degpT) !== 'POST' && !(C && (C.type === 'eq' || C.type === 'like')) && !simile) {
          const z = pz === '这么' ? '这么' : pz;
          out(z, 'DEG', degpT.o);
          S.mark('Phó từ mức độ (đặt sau trong tiếng Việt)', degpT.o, z);
          S.rule(`Tính từ + “${degpT.o}” → ${z} + tính từ (phó từ mức độ đứng trước tính từ trong tiếng Trung)`);
          if (semOf(degpT) === 'TOO') tail.push({
            zh: '了',
            vi: ''
          });
        } else if (!supT && !C && !P.neg.length && !q && !P.perf && !((cur(P.adj) || {}).f || {}).nohen && !asp.includes('PAST') && !asp.includes('SOON') && !P.bit && !P.adj2 && !lit && !simile && !st.noHen) {
          out('很', 'DEG', '');
          S.rule('Tính từ làm vị ngữ (câu trần thuật) → thêm 很 cho tự nhiên (她很漂亮)');
          S.hen = true;
        }
      }
      const pa = P.pps.filter(pp => pp.postAdj);
      if (pa.length) {
        const ATT = [ 'hài lòng', 'quan tâm', 'tốt', 'tử tế', 'nghiêm khắc', 'thân thiện', 'lịch sự', 'có hứng thú', 'hứng thú', 'nhiệt tình', 'thất vọng', 'tò mò', 'có lỗi', 'quen thuộc', 'xa lạ', 'công bằng' ];
        let at = S.pieces.length;
        while (at > 0 && [ 'DEG', 'CMP' ].includes(S.pieces[at - 1].role)) at--;
        const tmp = G(S.V);
        tmp.V = S.V;
        pa.forEach(pp => {
          const pz = semOf(pp.prep) === 'ABOUT' || isW(pp.prep, 'về') || ATT.includes(P.adj.vi) ? '对' : tokZh(pp.prep) === '给' ? '对' : '跟';
          tmp.out(pz, 'PREP', pp.prep.o);
          genNP(tmp, T, pp.np, 'PP');
          S.mark('Trạng ngữ (đối tượng)', pp.prep.o + ' ' + npText(T, pp.np), pz + npZh(S, T, pp.np));
          S.rule(`Tính từ + ${pp.prep.o} + N → ${pz} + N + tính từ (对结果很满意)`);
        });
        S.pieces.splice(at, 0, ...tmp.pieces);
      }
      const shide = !lit && [ '对', '错' ].includes(tokZh(P.adj)) && !degT && !degpT && !C && !supT && !P.neg.length;
      if (shide) {
        for (let x = S.pieces.length - 1; x >= 0; x--) if (S.pieces[x].zh === '很' && S.pieces[x].role === 'DEG') {
          S.pieces.splice(x, 1);
          break;
        }
        out('是', 'COP', '');
        S.rule('“đúng/sai” làm vị ngữ → 是对的 / 是错的');
      }
      const az = genTok(S, P.adj, 'A');
      S.mark('Tính từ (vị ngữ)', P.adj.o, az);
      if (shide) out('的', 'PART', '');
      if (cur(P.adj) && cur(P.adj).f && cur(P.adj).f.chg && !P.neg.length && !P.perf) {
        tail.push({
          zh: '了',
          vi: ''
        });
        S.rule('Tính từ chỉ trạng thái thay đổi (điên, say…) → thêm 了 (你疯了吗？)');
      }
      if (P.adj2) {
        const z2 = genTok(S, P.adj2, 'A');
        S.mark('Tính từ', P.adj2.o, z2);
      }
      if (simile) {
        out('得', 'C', '');
        out('跟', 'CMP', C.t.o);
        const ps = genNP(S, T, B, 'CMP');
        out('一样', 'CMP', '');
        S.mark('So sánh ví von (bổ ngữ)', C.t.o + ' ' + npText(T, B), '得跟' + zhJoin(ps) + '一样');
        S.rule('A + tính từ + như + B (ví von, nhấn mạnh) → A + tính từ + 得 + 跟 + B + 一样');
      }
      if (P.bit) {
        out('一点儿', 'C', P.bit.o);
        S.mark('Bổ ngữ', P.bit.o, '一点儿');
        if (P.bitMore) S.rule('“tính từ + hơn” (không có đối tượng so sánh) → tính từ + 一点儿 (便宜一点儿)');
      }
      cmpSuffix.forEach(x => {
        if (x.np) genNP(S, T, x.np, 'C'); else out(x.zh, 'C', x.vi);
        S.mark('Bổ ngữ so sánh', x.vi || '', x.zh || '');
        if (x.zh === '得多') S.rule('“hơn nhiều” → 比 B + tính từ + 得多');
      });
      if (degpT && semOf(degpT) === 'POST') {
        out(pz, 'DEG', degpT.o);
        S.mark('Bổ ngữ mức độ', degpT.o, pz);
        S.rule(`Tính từ + “${degpT.o}” → tính từ + ${pz}`);
      }
      if (degpT && C && (C.type === 'eq' || C.type === 'like') && semOf(degpT) !== 'POST') {}
      if (P.pps.some(pp => pp.postAdj)) P.pps.filter(pp => pp.postAdj).forEach(pp => {});
      if (P.perf || asp.includes('PAST') && !P._negDone && !P.neg.length) {
        tail.push({
          zh: '了',
          vi: P.perf ? 'rồi' : 'đã'
        });
        S.rule('Tính từ + rồi / đã + tính từ → tính từ + 了 (biểu thị thay đổi trạng thái)');
      }
    } else if (P.kind === 'cop') {
      if (neg && (neg.cop || neg.zh === '不')) {
        out('不是', 'NEG', neg.vi);
        S.mark('Phủ định', neg.vi, '不是');
      } else {
        out('是', 'V', P.head.o);
      }
      S.mark('Động từ “là”', P.head.o, '是');
      if (P.nom) {
        const ps = genNP(S, T, P.nom, 'O');
        S.mark('Bổ ngữ của “là” (tân ngữ)', npText(T, P.nom), zhJoin(ps));
      }
      if (P.nomPoss) {
        const ps = genNP(S, T, P.nomPoss, 'O');
        out('的', 'PART', 'của');
        S.mark('Sở hữu (vị ngữ)', 'của ' + npText(T, P.nomPoss), '是' + zhJoin(ps) + '的');
        S.rule('“A (là) của B” → A 是 B 的 (这本书是谁的)');
      }
      if (P.vpAfterCop) genVP(S, T, P, P.vpAfterCop, o, tail);
    } else if (P.kind === 'have') {
      const ng = P.neg.length || semOf(P.head) === 'NEGHAVE';
      const z = semOf(P.head) === 'NEGHAVE' ? tokZh(P.head) : ng ? P.neg.some(n => semOf(n) === 'NOTYET') ? '还没有' : '没有' : '有';
      out(z, 'V', P.head.o);
      S.mark(ng ? 'Phủ định sở hữu/tồn tại' : 'Động từ “có”', (P.neg.map(n => n.o).join(' ') + ' ' + P.head.o).trim(), z);
      if (ng) S.rule('“không có” → 没有 (không dùng 不有)');
      if (P.nom) {
        const ps = genNP(S, T, P.nom, 'O');
        S.mark('Tân ngữ', npText(T, P.nom), zhJoin(ps));
      }
      if (P.vpAfterHave) genVP(S, T, P, P.vpAfterHave, o, tail);
      if (P.perf) tail.push({
        zh: '了',
        vi: 'rồi'
      });
    } else if (P.kind === 'nom') {
      if (supT) out('最', 'CMP', supT.t.o);
      const ps = genNP(S, T, P.nom, 'P');
      S.mark('Vị ngữ danh từ', npText(T, P.nom), zhJoin(ps));
      if (P.neg.length) S.rule('Vị ngữ danh từ có phủ định → nên thêm 是 (不是…)');
      S.rule('Vị ngữ là số lượng/tuổi/giá tiền → đặt thẳng sau chủ ngữ (我二十岁)');
      if (P.perf) tail.push({
        zh: '了',
        vi: 'rồi'
      });
    } else if (P.kind === 'v' && vHead) {
      if (supT && !vHead.dcomp) {
        out('最', 'CMP', supT.t.o);
        S.mark('So sánh nhất', supT.t.o, '最');
        S.rule('V + tân ngữ + nhất → 最 + V + tân ngữ');
      }
      if (P.deg && !vHead.dcomp) {
        const z = genTok(S, P.deg, 'DEG');
        S.mark('Phó từ mức độ', P.deg.o, z);
        if (semOf(P.deg) === 'TOO') tail.push({
          zh: '了',
          vi: ''
        });
      } else if (P.degp && !vHead.dcomp) {
        const pz = tokZh(P.degp);
        if (semOf(P.degp) !== 'POST') {
          out(pz === '这么' ? '这么' : pz, 'DEG', P.degp.o);
          S.mark('Phó từ mức độ', P.degp.o, pz);
          if (semOf(P.degp) === 'TOO') tail.push({
            zh: '了',
            vi: ''
          });
          S.rule(`Động từ tâm lý + “${P.degp.o}” → ${pz} + động từ`);
        }
      }
      genVP(S, T, P, vHead, Object.assign({}, o, {
        neg: neg,
        simile: simile,
        C: P._cmpDone ? null : C,
        cmpSuffix: cmpSuffix
      }), tail);
      if (P.degp && !vHead.dcomp && semOf(P.degp) === 'POST') out(tokZh(P.degp), 'DEG', P.degp.o);
    }
    if (P.dur && P.kind !== 'v') {
      const z = genTok(S, P.dur, 'C');
      S.mark('Bổ ngữ thời lượng', P.dur.o, z);
    }
    if (P.howQ) {
      out('怎么样', 'Q', 'thế nào');
      S.mark('Câu hỏi', 'thế nào', '怎么样');
      S.rule('“A thế nào?” → A + 怎么样？');
    }
    if (P.neg.length && P.more && neg && !P.imp) tail.push({
      zh: '了',
      vi: 'nữa'
    });
    if (P.neg.length && semOf(P.neg[0]) === 'PROHIB' && P.more) tail.push({
      zh: '了',
      vi: 'nữa'
    });
    st._tail = (st._tail || []).concat(tail);
  }
  function isLocVerb(vp, pp) {
    const z = tokZh(vp.v);
    return pp && semOf(pp.prep) !== 'WITH' && tokZh(pp.prep) === '在' && (vp.v.f && vp.v.f.loc || [ '住', '坐', '站', '躺', '出生', '放', '生活' ].includes(z)) && !pp.pre;
  }
  function genVP(S, T, P, vp, o, tail) {
    const out = S.out, lit = !!S.V.lit;
    const sv = senseVerb(vp, P, S.V);
    let vz = sv.zh, vpy = sv.py;
    if (sv.note) S.rule(sv.note);
    const c = cur(vp.v), f = c && c.f || {};
    const vo = f.vo ? f.vo.split(',') : vz.length === 2 && VO_O.has(vz[1]) && (c && c.src !== 'core') ? [ vz[0], vz[1] ] : null;
    const past = (P.asp || []).some(a => semOf(a) === 'PAST') || P.perf;
    const exp = (P.asp || []).some(a => semOf(a) === 'EXP') || o.neg && o.neg.exp;
    const negPast = o.neg && (o.neg.zh === '没' || o.neg.notyet);
    const obj = vp.obj, objQuant = obj && (obj.num || obj.quant || obj.adjs.length || obj.poss || obj.dem);
    const dc = vp.dcomp;
    const vOnly = vo && (dc || o.C && o.C.type === 'like') ? vo[0] : null;
    const durWhole = vo && P.dur && !dc && P.perf, durSplit = vo && P.dur && !dc && !P.perf && !obj ? vo : null;
    const splitVO = !vOnly && vo && (vp.comps.length && !obj) ? vo : durSplit;
    const vRep = vOnly && !obj && dc && /\s/.test(vp.v.vi || '');
    const vMain = vRep ? vz : vOnly || (splitVO ? splitVO[0] : vz);
    if (f.caus) {
      const cz = vz && vz !== '给' ? vz : '让';
      out(cz, 'V', vp.v.o);
      S.mark('Động từ sai khiến', vp.v.o, cz);
      if (obj) {
        genNP(S, T, obj, 'O');
      }
      S.rule('“cho/để + A + V” (cầu khiến) → 让 + A + V');
      if (vp.next) genVP(S, T, P, vp.next, o, tail);
      return;
    }
    const locPP = vp.pps.find(pp => isLocVerb(vp, pp));
    if (vp.pre) {
      out(vp.pre, 'ADV', vp.preT.o, vp.pre === '早点儿' ? 'zǎo diǎnr' : 'wǎn diǎnr');
      S.mark('Trạng ngữ', vp.preT.o, vp.pre);
      S.rule(`“V + ${vp.preT.o}” (khuyên bảo/yêu cầu) → ${vp.pre} + V`);
    }
    out(vMain, 'V', vp.v.o, (vOnly || splitVO) && vMain !== vz ? pyOf(vMain) : vpy);
    if (vRep) {
      out(vOnly, 'V', '');
      S.rule(`Động từ ly hợp ${vz} + bổ ngữ trình độ → ${vz} + ${vOnly}(lặp) + 得 + bổ ngữ (看书看得很快)`);
    }
    S.mark('Động từ (vị ngữ)', vp.v.o, vz);
    if (vp.v2) {
      const z2 = tokZh(vp.v2);
      out(z2, 'V', vp.v2.o);
    }
    if (locPP) {
      out('在', 'C', locPP.prep.o);
      const ps = genNP(S, T, locPP.np, 'C');
      S.mark('Bổ ngữ nơi chốn', locPP.prep.o + ' ' + npText(T, locPP.np), '在' + zhJoin(ps));
      S.rule('Động từ tư thế/cư trú + ở + nơi chốn → V + 在 + nơi chốn (住在河内)');
    }
    vp.comps.forEach(r => {
      let z = tokZh(r);
      if (r.f && r.f.abil) {
        const ACQ = [ '买', '找', '拿', '收', '借', '见', '看', '听', '考', '得' ];
        if (!ACQ.includes(vz)) {
          S.pieces.splice(S.pieces.length - 1, 0, {
            zh: '能',
            py: 'néng',
            role: 'AUX',
            vi: r.o
          });
          S.mark('Khả năng', r.o, '能');
          S.rule('“V + được” (khả năng) → 能 + V');
          return;
        }
      }
      out(z, 'C', r.o, cur(r) && cur(r).py || pyOf(z));
      if (r.f && r.f.pot) {
        S.mark('Bổ ngữ khả năng (phủ định)', r.o, z);
        S.rule(z === '不了' ? '“không + V + được” → V + 不了 (bổ ngữ khả năng)' : `“V + không + ${r.o}” → V + ${z} (bổ ngữ khả năng: 听不懂/看不见)`);
      } else if (r.f && r.f.bitc) {
        S.mark('Bổ ngữ', r.o, z);
        if (z === '一点儿') S.rule('“V + tính từ + một chút” (đề nghị) → V + tính từ + 一点儿 (说慢一点儿)');
      } else {
        S.mark('Bổ ngữ kết quả', r.o, z);
        S.rule(`“V + ${r.o}” → V + ${z} (bổ ngữ kết quả)`);
      }
    });
    if (splitVO && vp.comps.length && !durSplit) {
      out(splitVO[1], 'O', '');
      S.rule(`Động từ ly hợp ${vz} + bổ ngữ → ${splitVO[0]} + bổ ngữ + ${splitVO[1]} (吃不了饭)`);
    }
    if (vp.iobj) {
      if (vz !== '给') out('给', 'C', 'cho');
      const ps = genNP(S, T, vp.iobj, 'O2');
      S.mark('Tân ngữ gián tiếp', 'cho ' + npText(T, vp.iobj), (vz !== '给' ? '给' : '') + zhJoin(ps));
      S.rule('“V + tân ngữ + cho + A” (cho/tặng/gửi) → V + 给 + A + tân ngữ');
    }
    let le = false;
    if (exp) {
      out('过', 'ASP', 'từng');
      S.mark('Thể kinh nghiệm', 'từng', '过');
      S.rule('“từng / đã từng / chưa bao giờ + V” → V + 过');
    } else if (!past && o.pastTime && !negPast && !o.neg && objQuant && obj && obj.num && !dc && !vp.next && !vp.clause && !(P.asp || []).length) {
      out('了', 'ASP', '');
      le = true;
      S.rule('Thời gian quá khứ + V + tân ngữ có số lượng → V + 了 + tân ngữ (昨天买了一辆自行车)');
    } else if (durWhole) {
      tail.push({
        zh: '了',
        vi: 'rồi'
      });
      le = true;
      S.rule('Động từ ly hợp + thời lượng + rồi → V O + thời lượng + 了 (结婚三年了)');
    } else if (past && !negPast && !dc && !vp.next && !vp.clause) {
      if (obj && (objQuant || P.dur) || P.dur || P.freq) {
        out('了', 'ASP', 'đã');
        le = true;
        S.rule('Hành động đã hoàn thành + tân ngữ có số lượng → V + 了 + tân ngữ');
      } else if (!obj && !vp.dest && !vo) {
        out('了', 'ASP', 'đã');
        le = true;
        S.rule('“đã + V / V + rồi” → V + 了');
      } else {
        tail.push({
          zh: '了',
          vi: P.perf ? 'rồi' : 'đã'
        });
        le = true;
        S.rule('“đã + V + tân ngữ” → V + tân ngữ + 了 (cuối câu)');
      }
    }
    const pronObj = obj && !vOnly && obj.head && obj.head.pos === 'PRON' && (P.dur || P.freq) && !dc;
    if (pronObj) {
      const ps = genNP(S, T, obj, 'O');
      S.mark('Tân ngữ', npText(T, obj), zhJoin(ps));
      S.rule('Tân ngữ là đại từ + thời lượng → V + 了 + đại từ + thời lượng (等了他两个小时)');
    }
    if (P.dur && !dc) {
      const z = genTok(S, P.dur, 'C');
      S.mark('Bổ ngữ thời lượng', P.dur.o, z);
      S.rule('Thời lượng (2 năm, 3 tiếng…) → đặt sau động từ: V + (了) + thời lượng + tân ngữ');
    }
    if (P.freq && !dc) {
      const z = genTok(S, P.freq, 'C');
      S.mark('Bổ ngữ động lượng', P.freq.o, z);
    }
    if (durSplit) {
      out(durSplit[1], 'O', '');
      S.rule(`Động từ ly hợp ${vz} + thời lượng → ${durSplit[0]} + (了) + thời lượng + ${durSplit[1]} (睡了八个小时觉)`);
    }
    if (vp.dest) {
      if (semOf(vp.dest.prep) === 'BACK' && vz !== '回') out('回', 'C', vp.dest.prep.o); else if (vz !== '去' && vz !== '到' && vz !== '来' && vz !== '回') out('到', 'C', vp.dest.prep.o);
      const ps = genNP(S, T, vp.dest.np, 'O');
      S.mark('Nơi đến', vp.dest.prep.o + ' ' + npText(T, vp.dest.np), zhJoin(ps));
      S.rule('“đi/đến/về + nơi chốn” → 去/到/回 + nơi chốn');
    }
    const tr = obj && obj.head && cur(obj.head) && cur(obj.head).f.trans;
    if (obj && !vOnly && !pronObj) {
      const ps = genNP(S, T, obj, 'O');
      S.mark(obj.head && obj.head.pos === 'Q' ? 'Tân ngữ (từ để hỏi)' : 'Tân ngữ', npText(T, obj), zhJoin(ps));
      if (tr && vz !== '坐' && vz !== '骑' && sv.zh !== vz) {}
    } else if (obj && vOnly) {
      const ps = genNP(S, T, obj, 'O');
      S.mark('Tân ngữ', npText(T, obj), zhJoin(ps));
    }
    if (vp.obj2) {
      const ps = genNP(S, T, vp.obj2, 'O');
      S.mark('Tân ngữ trực tiếp', npText(T, vp.obj2), zhJoin(ps));
      S.rule('Động từ cho/tặng/đưa + người + vật → V + người + vật (tân ngữ kép: 给我一杯水)');
    }
    if (vp.clause) {
      S.mark('Mệnh đề tân ngữ', '', '');
      const sub = vp.clause;
      genClause(S, sub, {
        past: false
      });
      S.rule('Động từ nhận thức (nghĩ/thấy/biết/nói…) + mệnh đề → giữ nguyên trật tự, bỏ “là/rằng”');
    }
    if (dc || o.C && o.C.type === 'like' && !dc && P.kind === 'v' && !P._likeDone) {
      if (obj && !vo) {
        out(vz, 'V', '');
        S.rule('V + tân ngữ + bổ ngữ trình độ → V + tân ngữ + V(lặp) + 得 + bổ ngữ (他说汉语说得很好)');
      } else if (obj && vo) {}
      out('得', 'C', '');
      const C = o.C;
      if (P.sup) {
        out('最', 'CMP', P.sup.t.o);
        S.mark('So sánh nhất', P.sup.t.o, '最');
        S.rule('V + tính từ + nhất → V + 得 + 最 + tính từ');
      }
      if (C && C.type === 'more') {
        out('比', 'CMP', C.t.o);
        const ps = genNP(S, T, C.np, 'CMP');
        S.mark('So sánh hơn', C.t.o + ' ' + npText(T, C.np), '比' + zhJoin(ps));
        S.rule('A + V + tính từ + hơn + B → A + V + 得 + 比 + B + tính từ');
      } else if (C && C.type === 'like') {
        out('跟', 'CMP', C.t.o);
        const ps = genNP(S, T, C.np, 'CMP');
        out('一样', 'CMP', '');
        S.mark('So sánh ví von', C.t.o + ' ' + npText(T, C.np), '跟' + zhJoin(ps) + '一样');
        S.rule('A + V + như + B → A + V + 得 + 跟 + B + 一样 (+ tính từ)');
      } else if (C && C.type === 'eq') {
        out('跟', 'CMP', C.t.o);
        genNP(S, T, C.np, 'CMP');
        out('一样', 'CMP', '');
      }
      if (dc) {
        const sense = DCOMP[dc.adj.vi] || null;
        if (dc.deg) {
          const z = genTok(S, dc.deg, 'DEG');
        } else if (!C && !P.sup && !dc.degp && !(o.q === 'yn')) out('很', 'DEG', '');
        if (dc.degp && semOf(dc.degp) !== 'POST') out(tokZh(dc.degp), 'DEG', dc.degp.o);
        const z = sense ? sense : tokZh(dc.adj);
        out(z, 'C', dc.adj.o, pyOf(z));
        S.mark('Bổ ngữ trình độ', (dc.deg ? dc.deg.o + ' ' : '') + dc.adj.o, '得' + z);
        if (dc.degp && semOf(dc.degp) === 'POST') out(tokZh(dc.degp), 'DEG', dc.degp.o);
        S.rule('V + tính từ (đánh giá cách làm) → V + 得 + (很) + tính từ (bổ ngữ trình độ)');
        if (C && C.type === 'more' && C.much) out('得多', 'C', C.much.o);
      } else if (C && C.type === 'like' && C.adjAfter) {
        out(tokZh(C.adjAfter), 'C', C.adjAfter.o);
      }
    } else if (o.C && o.C.type === 'more' && P.kind === 'v' && !S.V.lit) {}
    vp.pps.filter(pp => false).forEach(() => {});
    if (vp.next) {
      genVP(S, T, P, vp.next, Object.assign({}, o, {
        neg: null
      }), tail);
      S.rule('Chuỗi động từ liên tiếp (đi mua, đến xem…) → giữ nguyên thứ tự: 去买 / 来看');
    }
    vp._le = le;
  }
  const DCOMP = {
    'giỏi': '好',
    hay: '好',
    'tốt': '好',
    ngon: '好',
    'đẹp': '好',
    nhanh: '快',
    'chậm': '慢',
    'muộn': '晚',
    'trễ': '晚',
    'sớm': '早',
    'nhiều': '多',
    'ít': '少',
    'rõ': '清楚',
    to: '大声',
    'kém': '不好',
    'tệ': '不好',
    'lưu loát': '流利'
  };
  const PAIR = {
    BECAUSE: {
      b: [ 'SO' ],
      A: '因为',
      B: '所以',
      name: 'Bởi vì A nên B → 因为 A，所以 B'
    },
    IF: {
      b: [ 'THEN' ],
      A: '如果',
      Bs: '就',
      name: 'Nếu A thì B → 如果 A，(主语) 就 B'
    },
    ALTHOUGH: {
      b: [ 'BUT' ],
      A: '虽然',
      B: '但是',
      name: 'Tuy/Mặc dù A nhưng B → 虽然 A，但是 B'
    },
    EVENIF: {
      b: [],
      A: '即使',
      Bs: '也',
      name: 'Cho dù A thì B vẫn… → 即使 A，(主语) 也 B'
    },
    NOTONLY: {
      b: [ 'ALSO' ],
      A: '不但',
      B: '而且',
      name: 'Không những A mà còn B → 不但 A，而且 B'
    },
    ONLYNEED: {
      b: [ 'THEN' ],
      bw: [ 'là' ],
      A: '只要',
      Bs: '就',
      name: 'Chỉ cần A là/thì B → 只要 A，就 B'
    },
    ONLYIF: {
      b: [],
      bw: [ 'mới' ],
      A: '只有',
      Bs: '才',
      name: 'Chỉ có A mới B → 只有 A，才 B'
    },
    WHENEVER: {
      b: [ 'THEN' ],
      bw: [ 'là' ],
      A: '一',
      Bs: '就',
      name: 'Hễ A là B → 一 A 就 B'
    },
    WHEN: {
      b: [ 'THEN' ],
      As: '的时候',
      name: 'Khi A, B → A 的时候，B'
    },
    BEFORE: {
      b: [ 'THEN' ],
      As: '以前',
      name: 'Trước khi A, B → A 以前，B'
    },
    AFTER: {
      b: [ 'THEN' ],
      As: '以后',
      name: 'Sau khi A, B → A 以后，B'
    },
    SINCE: {
      b: [],
      A: '自从',
      As: '以后',
      name: 'Từ khi A, B → 自从 A 以后，B'
    },
    UNTIL: {
      b: [],
      A: '直到',
      name: 'Cho đến khi A → 直到 A'
    }
  };
  function splitFrame(T) {
    let i0 = 0;
    while (i0 < T.length && (T[i0].pos === 'INTJ' || T[i0].pos === 'PUNCT')) i0++;
    const s0 = T[i0] && T[i0].pos === 'CONJ' ? semOf(T[i0]) : null;
    const findB = (from, sems, ws) => {
      let comma = -1, hit = -1;
      for (let k = i0 + 1; k < T.length; k++) {
        if (T[k].pos === 'PUNCT' && comma < 0) comma = k;
        const s = semOf(T[k]);
        if (k >= from && T[k].pos === 'CONJ' && sems.includes(s) || ws && ws.includes(T[k].vi) && k > i0 + 1) {
          hit = k;
          break;
        }
      }
      return {
        comma: comma,
        hit: hit
      };
    };
    if (s0 && PAIR[s0] && T.length - i0 > 2) {
      const D = PAIR[s0];
      const {comma: comma, hit: hit} = findB(i0 + 2, D.b, D.bw);
      let aEnd, bStart, bTok = null;
      if (hit >= 0) {
        aEnd = comma >= 0 && comma < hit ? comma : hit;
        bStart = hit + 1;
        bTok = T[hit];
        if (T[hit].vi === 'là' || T[hit].vi === 'mới') bTok = T[hit];
      } else if (comma >= 0) {
        aEnd = comma;
        bStart = comma + 1;
      } else {
        const bd = T.findIndex((x, k) => k > i0 + 1 && x.pos === 'PRON' && T.slice(i0 + 1, k).some(y => [ 'V', 'ADJ', 'HAVE', 'COP' ].includes(y.pos)));
        if (bd < 0) return null;
        aEnd = bd;
        bStart = bd;
      }
      while (bStart < T.length && T[bStart].pos === 'PUNCT') bStart++;
      return {
        type: s0,
        conjA: T[i0],
        A: T.slice(i0 + 1, aEnd),
        B: T.slice(bStart),
        conjB: bTok,
        intj: T.slice(0, i0),
        D: D
      };
    }
    const both = T.map((t, k) => t.vi === 'vừa' || t.vi === 'càng' ? k : -1).filter(k => k >= 0);
    if (both.length === 2 && T[both[0]].vi === T[both[1]].vi && both[1] - both[0] >= 2) {
      const w = T[both[0]].vi, A = T.slice(both[0] + 1, both[1]), B = T.slice(both[1] + 1);
      return {
        type: w === 'vừa' ? 'BOTH' : 'MORE2',
        pre: T.slice(0, both[0]),
        A: A,
        B: B,
        conjA: T[both[0]],
        conjB: T[both[1]]
      };
    }
    for (let k = 1; k < T.length - 1; k++) {
      const t = T[k];
      if (t.pos !== 'CONJ') continue;
      const s = semOf(t);
      if ([ 'SO', 'BUT', 'BECAUSE', 'IF', 'ALTHOUGH', 'WHEN', 'BEFORE', 'AFTER', 'THEN2', 'ELSE', 'MOREOVER', 'EVENIF', 'UNTIL' ].includes(s) || s === 'OR' && T[k - 1].pos === 'PUNCT' || s === 'ALSO' && T[k - 1].pos === 'PUNCT' || s === 'AND' && T[k - 1].pos === 'PUNCT' || s === 'THEN' && T.slice(0, k).some(x => x.pos === 'V' || x.pos === 'ADJ')) {
        let a = k;
        while (a > 0 && T[a - 1].pos === 'PUNCT') a--;
        let b = k + 1;
        while (b < T.length && T[b].pos === 'PUNCT') b++;
        const A = T.slice(0, a), B = T.slice(b);
        if (!A.length || !B.length) continue;
        if (s === 'THEN' && !A.some(x => [ 'V', 'ADJ', 'HAVE', 'COP' ].includes(x.pos))) continue;
        return {
          type: 'MID_' + s,
          A: A,
          B: B,
          conj: t
        };
      }
      if (s === 'PURP') continue;
    }
    for (let k = 1; k < T.length - 1; k++) if (T[k].pos === 'PREP' && semOf(T[k]) === 'PURP' && T.slice(0, k).some(x => x.pos === 'V')) return {
      type: 'MID_PURP',
      A: T.slice(0, k),
      B: T.slice(k + 1),
      conj: T[k]
    };
    const cm = T.findIndex((t, k) => t.pos === 'PUNCT' && k > 0 && k < T.length - 1);
    if (cm > 0) {
      const A = T.slice(0, cm), B = T.slice(cm + 1);
      const okA = A.some(x => [ 'V', 'ADJ', 'HAVE', 'COP', 'QTY' ].includes(x.pos)), okB = B.some(x => [ 'V', 'ADJ', 'HAVE', 'COP', 'QTY' ].includes(x.pos));
      if (okA && okB) return {
        type: 'COMMA',
        A: A,
        B: B
      };
    }
    return null;
  }
  function translateSentence(sent, V, noDia) {
    const W = words(sent.body);
    if (!W.length) return null;
    let T = segment(W, noDia);
    T = chunkNumbers(T);
    T.forEach((t, k) => t._id = k);
    disamb(T, sent.q);
    contextPick(T);
    T.forEach(t => {
      if (t.cands && t.cands.length && ![ 'QP', 'PART', 'CMP', 'TOPIC', 'COMP', 'EMPH', 'POSS', 'QUANT', 'PASS', 'SKIP' ].includes(t.pos)) {
        const c = cur(t);
        if (c && c.pos !== t.pos && t.cands.some(x => x.pos === t.pos)) choose(t, t.pos);
      }
    });
    const S = G(V);
    if (T._reorder) S.rule(T._reorder);
    const real = T.filter(t => t.pos !== 'PUNCT');
    if (real.length === 1 && cur(real[0]) && (cur(real[0]).src === 'idiom' || cur(real[0]).src === 'data' && real[0].vi.split(' ').length >= 3 || cur(real[0]).f && cur(real[0]).f.whole || [ 'PHR', 'IDIOM' ].includes(real[0].pos))) {
      const c = cur(real[0]);
      S.out(c.zh, 'IDIOM', real[0].o, c.py);
      S.mark(c.src === 'idiom' ? 'Thành ngữ' : 'Cụm cố định', real[0].o, c.zh);
      S.rule(c.src === 'idiom' ? 'Thành ngữ tiếng Việt → thành ngữ tương đương tiếng Trung (không dịch từng chữ)' : 'Cụm giao tiếp cố định → dùng câu tương đương có sẵn');
      const qq = sent.q || c.f && c.f.q;
      return finish(S, T, sent, {
        q: qq ? 'fixed' : null,
        fixed: true
      });
    }
    const fr = splitFrame(T);
    let mainSt = null, frameOk = true;
    const clause = (toks, cx) => parseClause(toks, Object.assign({
      q: sent.q
    }, cx || {}));
    if (!fr) {
      mainSt = clause(T);
      genClause(S, mainSt, {});
    } else if (fr.type === 'BOTH' || fr.type === 'MORE2') {
      const pre = clause(fr.pre.length ? fr.pre : [], {});
      if (fr.pre.length) {
        if (pre.subj) {
          const ps = genNP(S, pre.T, pre.subj, 'S');
          S.mark('Chủ ngữ', npText(pre.T, pre.subj), zhJoin(ps));
        }
      }
      const a = clause(fr.A, {
        allowBareSubj: false
      }), b = clause(fr.B, {
        allowBareSubj: false
      });
      const verbal = x => x.P && x.P.kind === 'v';
      const w1 = fr.type === 'MORE2' ? '越' : verbal(a) && verbal(b) ? '一边' : '又', w2 = w1;
      S.out(w1, 'CONJ', fr.conjA.o);
      a.noHen = true;
      b.noHen = true;
      genClause(S, a, {});
      flushTail(S, a);
      S.out(w2, 'CONJ', fr.conjB.o);
      genClause(S, b, {});
      S.mark('Liên từ', fr.conjA.o + ' … ' + fr.conjB.o, w1 + ' … ' + w2);
      S.rule(fr.type === 'MORE2' ? 'Càng A càng B → 越 A 越 B' : w1 === '一边' ? 'Vừa V1 vừa V2 (hai hành động) → 一边 V1 一边 V2' : 'Vừa A vừa B (hai tính chất) → 又 A 又 B');
      mainSt = b;
    } else if (PAIR[fr.type]) {
      const D = fr.D, a = clause(fr.A), b = clause(fr.B);
      fr.intj.forEach(t => {
        const z = genTok(S, t, 'INTJ');
        if (z) S.out('，', 'PUNC');
      });
      if (D.A) S.out(D.A, 'CONJ', fr.conjA.o);
      a.noHen = false;
      genClause(S, a, {});
      flushTail(S, a);
      if (D.As) S.out(D.As, 'CONJ', fr.conjA.o);
      if (fr.type !== 'UNTIL') S.out('，', 'PUNC');
      if (D.B) S.out(D.B, 'CONJ', fr.conjB ? fr.conjB.o : '');
      genClause(S, b, {
        afterSubj: D.Bs ? [ {
          zh: D.Bs,
          vi: fr.conjB ? fr.conjB.o : ''
        } ] : null,
        past: a.time.some(t => cur(t).f.past)
      });
      S.mark('Liên từ (câu ghép)', fr.conjA.o + (fr.conjB ? ' … ' + fr.conjB.o : ''), (D.A || '') + (D.As ? ' …' + D.As : '') + ' ， ' + (D.B || '') + (D.Bs ? '… ' + D.Bs : ''));
      S.rule(D.name);
      mainSt = b;
    } else if (fr.type.startsWith('MID_') || fr.type === 'COMMA') {
      const s = fr.type.slice(4), a = clause(fr.A), b = clause(fr.B);
      const lit = !!V.lit, cz = fr.conj ? fr.conj.o : '';
      const both = (x, y, mid, name, after) => {
        genClause(S, x, {});
        flushTail(S, x);
        S.out('，', 'PUNC');
        if (mid) S.out(mid, 'CONJ', cz);
        genClause(S, y, {
          afterSubj: after ? [ {
            zh: after,
            vi: cz
          } ] : null
        });
        if (name) S.rule(name);
      };
      if (fr.type === 'COMMA') {
        both(a, b, '', '');
        mainSt = b;
      } else if (s === 'SO') {
        both(a, b, '所以', 'A nên/vì vậy B → A，所以 B');
        mainSt = b;
        S.mark('Liên từ', cz, '所以');
      } else if (s === 'BUT') {
        both(a, b, tokZh(fr.conj) || '但是', 'A nhưng B → A，但是 B');
        mainSt = b;
        S.mark('Liên từ', cz, tokZh(fr.conj) || '但是');
      } else if (s === 'BECAUSE') {
        if (lit || V.becauseOrder) {
          both(a, b, '因为', 'A vì B → A，因为 B');
          mainSt = a;
        } else {
          S.out('因为', 'CONJ', cz);
          genClause(S, b, {});
          flushTail(S, b);
          S.out('，', 'PUNC');
          S.out('所以', 'CONJ', '');
          genClause(S, a, {});
          S.rule('A vì B → 因为 B，所以 A (tiếng Trung thường nêu nguyên nhân trước)');
          mainSt = a;
        }
        S.point('becauseOrder', 2, 'thứ tự nguyên nhân – kết quả');
        S.mark('Liên từ', cz, '因为 … 所以');
      } else if (s === 'IF' || s === 'ALTHOUGH' || s === 'WHEN' || s === 'BEFORE' || s === 'AFTER' || s === 'EVENIF') {
        const M = {
          IF: [ '如果', '', '就', 'A nếu B → 如果 B，(主语) 就 A (mệnh đề điều kiện đứng trước)' ],
          ALTHOUGH: [ '虽然', '', '还是', 'A mặc dù B → 虽然 B，但是 (主语) 还是 A' ],
          WHEN: [ '', '的时候', '', 'A khi B → B 的时候，A' ],
          BEFORE: [ '', '以前', '', 'A trước khi B → B 以前，A' ],
          AFTER: [ '', '以后', '', 'A sau khi B → B 以后，A' ],
          EVENIF: [ '即使', '', '也', 'A cho dù B → 即使 B，(主语) 也 A' ]
        }[s];
        if (lit) {
          genClause(S, a, {});
          flushTail(S, a);
          S.out('，', 'PUNC');
          if (M[0]) S.out(M[0], 'CONJ', cz);
          genClause(S, b, {});
          if (M[1]) S.out(M[1], 'CONJ', cz);
          mainSt = a;
        } else {
          if (M[0]) S.out(M[0], 'CONJ', cz);
          genClause(S, b, {});
          flushTail(S, b);
          if (M[1]) S.out(M[1], 'CONJ', cz);
          S.out('，', 'PUNC');
          if (s === 'ALTHOUGH') S.out('但是', 'CONJ', '');
          genClause(S, a, {
            afterSubj: M[2] ? [ {
              zh: M[2],
              vi: ''
            } ] : null
          });
          S.rule(M[3]);
          mainSt = a;
        }
        S.mark('Liên từ', cz, (M[0] || '') + (M[1] ? '…' + M[1] : ''));
      } else if (s === 'THEN2') {
        both(a, b, '然后', 'A rồi/sau đó B → A，然后 B');
        mainSt = b;
      } else if (s === 'ELSE') {
        both(a, b, '不然', 'A, nếu không thì B → A，不然 B');
        mainSt = b;
      } else if (s === 'MOREOVER' || s === 'ALSO') {
        both(a, b, '而且', 'A, hơn nữa B → A，而且 B');
        mainSt = b;
      } else if (s === 'OR') {
        both(a, b, sent.q ? '还是' : '或者', 'A hoặc B → A，或者 B');
        mainSt = b;
      } else if (s === 'AND') {
        both(a, b, '', 'A và B (hai mệnh đề) → A，B');
        mainSt = b;
      } else if (s === 'THEN') {
        genClause(S, a, {});
        flushTail(S, a);
        S.out('，', 'PUNC');
        genClause(S, b, {
          afterSubj: [ {
            zh: '就',
            vi: cz
          } ]
        });
        S.rule('A thì B → A，(主语) 就 B');
        mainSt = b;
      } else if (s === 'UNTIL') {
        both(a, b, '直到', 'A cho đến khi B → A，直到 B');
        mainSt = a;
      } else if (s === 'PURP') {
        if (lit) {
          genClause(S, a, {});
          flushTail(S, a);
          S.out('，', 'PUNC');
          S.out('是为了', 'CONJ', cz);
          const bb = clause(fr.B, {
            allowBareSubj: true
          });
          genClause(S, bb, {});
          mainSt = bb;
          bb.q = a.q;
          S.rule('A để B → A，是为了 B');
        } else {
          S.out('为了', 'CONJ', cz);
          const bb = clause(fr.B, {
            allowBareSubj: true
          });
          genClause(S, bb, {});
          flushTail(S, bb);
          S.out('，', 'PUNC');
          genClause(S, a, {});
          mainSt = a;
          S.rule('A để B (mục đích) → 为了 B，A (mục đích đứng trước)');
        }
        S.mark('Liên từ', cz, '为了');
      } else {
        both(a, b, tokZh(fr.conj), '');
        mainSt = b;
      }
    }
    return finish(S, T, sent, {
      st: mainSt,
      frame: fr
    });
  }
  function flushTail(S, st) {
    if (!st || !st._tail || !st._tail.length) return;
    let seenLe = S.pieces.length && S.pieces[S.pieces.length - 1].zh === '了';
    st._tail.forEach(x => {
      if (x.zh === '了' && seenLe) return;
      if (x.zh === '了') seenLe = true;
      S.out(x.zh, 'ASP', x.vi);
    });
    st._tail = [];
  }
  function finish(S, T, sent, info) {
    const st = info.st, V = S.V;
    let q = info.q !== undefined ? info.q : st ? st.q : null;
    const tail = st && st._tail ? st._tail : [];
    let seenLe = S.pieces.length && S.pieces[S.pieces.length - 1].zh === '了';
    tail.forEach(x => {
      if (x.zh === '了' && seenLe) return;
      if (x.zh === '了') seenLe = true;
      S.out(x.zh, 'ASP', x.vi);
    });
    const finals = st ? st.finals : [];
    const part = finals.find(t => t.pos === 'PART');
    if (st && st._q === 'ne') q = 'ne';
    const lastP = S.pieces[S.pieces.length - 1];
    if (lastP && /[吗呢吧]$/.test(lastP.zh) && [ 'yn', 'chua', 'sao', 'ok' ].includes(q)) q = 'fixed';
    if (st && st.embQ) S.rule('Câu hỏi gián tiếp (biết/hỏi/nhớ + mệnh đề có ai/gì…) → từ để hỏi giữ trong mệnh đề; ' + (q ? 'cả câu hỏi có/không → thêm 吗 (你知道他是谁吗？)' : 'câu trần thuật, không dùng dấu hỏi (我知道他是谁。)'));
    let punct = q ? '？' : sent.excl ? '！' : '。';
    if (q === 'yn') {
      const qp = finals.find(t => t.pos === 'QP');
      if (V.qform && st && st.P && (st.P.kind === 'v' || st.P.kind === 'adj' || st.P.kind === 'cop' || st.P.kind === 'have') && !S.pieces.some(p => p.role === 'NEG')) {
        const hi = S.pieces.findIndex(p => p.role === 'V' || p.role === 'A' || p.role === 'DEG' && false);
        if (hi >= 0) {
          const h = S.pieces[hi];
          const hz = h.zh === '有' ? '没有' : '不' + h.zh;
          S.pieces.splice(hi + 1, 0, {
            zh: hz,
            py: pyOf(hz[0]) + ' ' + h.py,
            role: 'Q',
            vi: qp ? qp.o : ''
          });
          S.pieces = S.pieces.filter(p => !(p.role === 'DEG' && p.zh === '很'));
          S.rule('Câu hỏi có/không → dạng chính phản: V + 不 + V');
        }
      } else {
        S.out('吗', 'Q', qp ? qp.o : part ? part.o : '?');
        S.rule('Câu hỏi “(có) … không? / à? / hả?” → … 吗？');
        if (st && st.P && (st.P.kind === 'v' || st.P.kind === 'adj')) S.point('qform', 2, 'câu hỏi: 吗 / dạng V不V');
      }
      S.mark('Câu hỏi có/không', qp ? qp.o : part ? part.o : '?', '吗');
    } else if (q === 'chua') {
      const qp = finals.find(t => t.pos === 'QP');
      const last = S.pieces[S.pieces.length - 1];
      if (!(last && last.zh === '了')) S.out('了', 'ASP', '');
      S.out(V.qform ? '没有' : '吗', 'Q', qp ? qp.o : 'chưa');
      S.mark('Câu hỏi “… chưa?”', qp ? qp.o : 'chưa', V.qform ? '了没有' : '了吗');
      S.rule('“V + chưa?” → V + 了吗？ / V + 了没有？');
      S.point('qform', 2, 'câu hỏi: 了吗 / 了没有');
    } else if (q === 'tag') {
      S.out('，', 'PUNC');
      S.out(V.qform ? '对吧' : '是吗', 'Q', part.o);
      S.mark('Câu hỏi đuôi', part.o, V.qform ? '对吧' : '是吗');
      S.rule('“…, phải không?” → …，是吗？ / 对吧？');
      S.point('qform', 2, 'câu hỏi đuôi: 是吗 / 对吧');
    } else if (q === 'ok' && S.pieces.some(p => p.zh === '可以' || p.zh === '能')) {
      S.out('吗', 'Q', part.o);
      S.mark('Hỏi xin phép', part.o, '吗');
      S.rule('“Có thể … được không?” → 可以 … 吗？ (đã có 可以 nên chỉ cần 吗)');
    } else if (q === 'ok') {
      S.out('，', 'PUNC');
      S.out(V.qform ? '行吗' : '可以吗', 'Q', part.o);
      S.mark('Hỏi xin phép', part.o, '可以吗');
      S.rule('“…, được không?” → …，可以吗？/ 行吗？');
      S.point('qform', 2, 'xin phép: 可以吗 / 行吗');
    } else if (q === 'nhi') {
      S.out('吧', 'Q', part.o);
      S.mark('Hỏi xác nhận', part.o, '吧');
    } else if (q === 'sao') {
      S.out('吗', 'Q', 'sao');
      S.mark('Hỏi ngạc nhiên', 'sao', '吗');
    } else if (q === 'wh') {
      if (part && semOf(part) === 'QW') {
        S.out('呢', 'PART', part.o);
        S.mark('Trợ từ nghi vấn', part.o, '呢');
      }
      S.rule('Câu hỏi có từ để hỏi (gì/ai/đâu/nào/bao nhiêu…) → giữ vị trí từ để hỏi, không thêm 吗');
    } else if (q === 'choice') {
      S.rule('Câu hỏi lựa chọn “A hay B?” → A 还是 B？');
    } else if (part && !q) {
      const z = part.part || tokZh(part);
      if (z && z !== '—' && !(z === '了' && S.pieces.length && S.pieces[S.pieces.length - 1].zh === '了')) {
        S.out(z, 'PART', part.o);
        S.mark('Trợ từ cuối câu', part.o, z);
        if (z === '吧') S.rule('“V + đi / nhé” (đề nghị, cầu khiến) → V + 吧');
      }
    }
    S.out(punct, 'PUNC', '');
    return {
      S: S,
      T: T,
      st: st,
      frame: info.frame,
      fixed: info.fixed
    };
  }
  function render(pieces) {
    const ps = pieces.filter(p => p.zh);
    let han = '', py = [];
    ps.forEach((p, k) => {
      han += p.zh;
      if (p.role === 'PUNC') {
        const m = {
          '。': '.',
          '？': '?',
          '！': '!',
          '，': ','
        }[p.zh] || p.zh;
        if (py.length) py[py.length - 1] += m; else py.push(m);
        return;
      }
      let y = String(p.py || '').trim();
      if (/^【/.test(p.zh)) y = p.zh.replace(/[【】]/g, '');
      const nx = ps[k + 1];
      const nextPy = nx ? String(nx.py || '') : '';
      if (p.zh[0] === '不' && /^bù/.test(y)) {
        const rest = p.zh.length > 1 ? y.slice(2) : nextPy;
        if (firstTone(rest) === 4) y = 'bú' + y.slice(2);
      }
      if (p.zh[0] === '一' && /^y[īi]/.test(y) && !/^[一二三四五六七八九十百千万零两\d]/.test(p.zh.slice(1)) && !(ps[k - 1] && /^(第|[一二三四五六七八九十])$/.test(ps[k - 1].zh)) && !/^[月号日]/.test(p.zh.slice(1) || nx && nx.zh || '')) {
        const rest = p.zh.length > 1 ? y.replace(/^y[īi]/, '') : nextPy;
        const t = firstTone(rest);
        if (t === 4 || t === 0 && /^(个|ge)/.test(rest)) y = y.replace(/^y[īi]/, 'yí'); else if (t) y = y.replace(/^y[īi]/, 'yì');
      }
      if (y) py.push(y.replace(/\s+/g, p.role === 'IDIOM' ? ' ' : ' '));
    });
    let s = py.join(' ').replace(/\s+([,.?!])/g, '$1').replace(/\s+/g, ' ').trim();
    s = s.replace(/(^|[.?!]\s+)([a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ])/g, (m, a, b) => a + b.toUpperCase());
    return {
      han: han,
      py: s
    };
  }
  function assess(R, sent, noDia) {
    const {S: S, T: T, st: st} = R, warn = [];
    let score = 1;
    const unk = T.filter(t => t.pos === 'UNK'), names = T.filter(t => t.pos === 'NAME');
    if (unk.length) {
      score -= Math.min(.6, .28 * unk.length);
      warn.push({
        lv: 'bad',
        t: `Không tìm thấy trong từ điển: “${unk.map(t => t.o).join('”, “')}” — giữ nguyên trong 【】, không tự đoán nghĩa.`
      });
    }
    if (names.length) {
      score -= .08 * names.length;
      warn.push({
        lv: 'info',
        t: `“${names.map(t => t.o).join('”, “')}” được coi là tên riêng (viết hoa) — giữ nguyên, cần tự chuyển sang chữ Hán nếu có.`
      });
    }
    const amb = T.filter(t => t.cands && t.cands.length > 1 && cur(t) && cur(t).f && cur(t).f.amb && !t.resolved);
    amb.forEach(t => {
      const alts = [ ...new Set(t.cands.filter(c => c.zh && c.zh !== cur(t).zh).map(c => c.zh)) ].slice(0, 3).map(z => z + ' (' + pyOf(z) + ')');
      if (alts.length) {
        score -= .07;
        warn.push({
          lv: 'amb',
          t: `“${t.o}” có nhiều cách hiểu: đã chọn ${cur(t).zh}; cũng có thể là ${alts.join(', ')}.`
        });
      }
    });
    const dictAmb = T.filter(t => t.cands && [ 'N', 'V', 'ADJ' ].includes(t.pos) && cur(t) && cur(t).src !== 'core' && cur(t).src !== 'idiom' && t.cands.filter(c => c.pos === t.pos && c.src !== 'core').length >= 2);
    dictAmb.forEach(t => {
      const cs = t.cands.filter(c => c.pos === t.pos).slice(0, 3);
      if (cs.length > 1 && Math.abs(cs[0].cost - cs[1].cost) < .15) warn.push({
        lv: 'info',
        t: `“${t.o}”: chọn ${cur(t).zh}${t.ctxPicked ? ' (theo ngữ cảnh câu)' : ''}; từ gần nghĩa: ${cs.filter(c => c.zh !== cur(t).zh).map(c => c.zh).join(', ')}.`
      });
    });
    if (S.unparsed) {
      score -= .3;
      warn.push({
        lv: 'bad',
        t: 'Không nhận diện được đầy đủ cấu trúc ngữ pháp — phần “Chưa xác định” được giữ theo thứ tự tiếng Việt, bản dịch có thể chưa chính xác.'
      });
    }
    if (st && !R.fixed && !st.P && !st.subj) {
      score -= .35;
      warn.push({
        lv: 'bad',
        t: 'Không xác định được vị ngữ (động từ/tính từ) của câu — bản dịch có thể chưa chính xác.'
      });
    }
    if (st && st.P && st.P.kind === null && !R.fixed) {
      score -= .3;
      warn.push({
        lv: 'bad',
        t: 'Không xác định được thành phần chính của vị ngữ — bản dịch có thể chưa chính xác.'
      });
    }
    if (noDia) {
      score -= .15;
      warn.push({
        lv: 'info',
        t: 'Câu gõ không dấu → nhiều từ có thể bị hiểu nhầm (vd: “toi” = tôi / tối / tới). Nên gõ có dấu để chính xác hơn.'
      });
    }
    const learn = T.filter(t => cur(t) && cur(t).src === 'learn');
    if (learn.length) {
      score -= .05 * learn.length;
      warn.push({
        lv: 'info',
        t: `Từ tự học từ câu ví dụ (độ tin cậy thấp hơn): ${learn.map(t => t.o + ' = ' + zhOf(t)).join(', ')}.`
      });
    }
    if (S.points.some(p => p.key === 'past')) warn.push({
      lv: 'amb',
      t: 'Tiếng Việt không chia thì: câu có thể nói về hiện tại hoặc quá khứ — xem phương án khác.'
    });
    return {
      score: Math.max(0, Math.min(1, score)),
      warn: warn
    };
  }
  function analyze(raw, opts) {
    raw = String(raw || '').trim();
    if (!raw) return null;
    opts = opts || {};
    const noDia = !VNRE.test(raw) && !opts.forceDia;
    const sents = splitSentences(raw);
    const results = sents.map(s => {
      try {
        return one(s);
      } catch (e) {
        if (typeof console !== 'undefined') console.warn('ViZhEngine:', s.text, e);
        let han = '', py = '';
        try {
          const v = TR() && TR().viOptions(s.body || s.text);
          if (v && v.opt) {
            const c = TR().compose(v.opt);
            han = c.han;
            py = c.py || '';
          }
        } catch (x) {}
        if (!han) return null;
        return {
          src: s.text,
          han: han,
          py: py,
          lit: {
            han: han,
            py: py
          },
          alts: [],
          analysis: [],
          rules: [],
          warn: [ {
            lv: 'bad',
            t: 'Không phân tích được cấu trúc câu này — chỉ hiển thị bản ghép từng từ (sát nghĩa), cần kiểm tra lại.'
          } ],
          score: .3,
          fixed: false,
          tokens: [ {
            vi: s.text,
            zh: han,
            pos: 'UNK',
            src: 'unk'
          } ]
        };
      }
    }).filter(Boolean);
    function one(s) {
      const nat = translateSentence(s, {}, noDia);
      if (!nat) return null;
      const lit = translateSentence(s, {
        lit: true
      }, noDia);
      const rn = render(nat.S.pieces), rl = render(lit.S.pieces);
      const alts = [], seen = new Set([ rn.han, rl.han ]);
      const tryV = (V, label) => {
        if (alts.length >= 4) return;
        const r = translateSentence(s, V, noDia);
        if (!r) return;
        const x = render(r.S.pieces);
        if (seen.has(x.han)) return;
        seen.add(x.han);
        alts.push({
          han: x.han,
          py: x.py,
          label: label
        });
      };
      nat.S.points.forEach(p => {
        for (let v = 1; v < p.n; v++) tryV({
          [p.key]: v
        }, p.label);
      });
      nat.T.filter(t => t.cands && t.cands.length > 1 && cur(t) && cur(t).f && cur(t).f.amb).slice(0, 2).forEach(t => {
        const k = t.cands.findIndex(c => c.zh && c.zh !== cur(t).zh && c.pos === cur(t).pos);
        if (k >= 0) tryV({
          sense: {
            [t._id]: k
          }
        }, `“${t.o}” = ${t.cands[k].zh}`);
      });
      const st = nat.st;
      if (st && st.P && st.P.kind === 'v' && st.P.neg.length && ![ 'PROHIB', 'NOTYET', 'NEVER', 'NEVERF', 'NOTCOP' ].includes(semOf(st.P.neg[0])) && !st.P.aux.length && !st.P.asp.length && !st.time.length && !st.q && st.P.vp && !STATIVE.has(tokZh(st.P.vp.v))) tryV({
        pastNeg: true
      }, 'nếu nói về việc đã qua (没)');
      const as = assess(nat, s, noDia);
      return {
        src: s.text,
        han: rn.han,
        py: rn.py,
        lit: rl,
        alts: alts,
        analysis: nat.S.analysis,
        rules: nat.S.rules,
        warn: as.warn,
        score: as.score,
        fixed: !!nat.fixed,
        tokens: nat.T.filter(t => t.pos !== 'PUNCT').map(t => ({
          vi: t.o,
          zh: t.unk ? '' : zhOf(t),
          pos: t.pos,
          src: cur(t) ? cur(t).src : t.unk ? 'unk' : 'rule'
        }))
      };
    }
    if (!results.length) return null;
    const score = Math.min(...results.map(r => r.score));
    const known = results.reduce((a, r) => a + r.tokens.filter(t => t.src !== 'unk').length, 0), all = results.reduce((a, r) => a + r.tokens.length, 0);
    return {
      raw: raw,
      sentences: results,
      han: results.map(r => r.han).join(''),
      py: results.map(r => r.py).join(' '),
      litHan: results.map(r => r.lit.han).join(''),
      litPy: results.map(r => r.lit.py).join(' '),
      score: score,
      level: score >= .8 ? 'high' : score >= .55 ? 'mid' : 'low',
      cover: all ? known / all : 0,
      noDia: noDia
    };
  }
  const _genClause = genClause;
  genClause = function(S, st, ctx) {
    if (S.V && S.V.pastNeg) ctx = Object.assign({}, ctx, {
      past: true
    });
    return _genClause(S, st, ctx);
  };
  window.ViZhEngine = {
    analyze: analyze,
    _lex: lex,
    _segment: s => segment(words(s), !VNRE.test(s)),
    version: '2.0'
  };
})();

const safeStorage = {
  get(k) {
    try {
      return JSON.parse(localStorage.getItem(k));
    } catch (e) {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
      return true;
    } catch (e) {
      return false;
    }
  },
  remove(k) {
    try {
      localStorage.removeItem(k);
    } catch (e) {}
  }
};

function stripDiacritics(s) {
  if (!s) return '';
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ü/g, 'u').replace(/đ/g, 'd');
}

function smartMatch(query, field) {
  if (!query || !field) return false;
  return stripDiacritics(field).includes(stripDiacritics(query));
}

function getMeaningLetter(meaning) {
  if (!meaning) return '#';
  const stripped = stripDiacritics(String(meaning)).trim();
  if (!stripped) return '#';
  const ch = stripped[0].toUpperCase();
  return /[A-Z]/.test(ch) ? ch : '#';
}

function parseDictLine(line) {
  const m = line.match(/^(.+?)\s*\(([^)]+)\)\s*[:：]\s*(.+)$/);
  if (!m) return null;
  const text = m[1].trim();
  const pinyin = m[2].trim();
  const meaning = m[3].trim();
  if (!text || !meaning) return null;
  return {
    text: text,
    pinyin: pinyin,
    meaning: meaning
  };
}

function isSentence(text) {
  return /[。！？，；：]/.test(text) || text.length > 20;
}

function parseDictData(raw) {
  if (!raw || typeof raw !== 'string') return [];
  const lines = raw.split('\n');
  const seen = new Set;
  const out = [];
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('//')) continue;
    const item = parseDictLine(line);
    if (!item) continue;
    if (seen.has(item.text)) continue;
    seen.add(item.text);
    item.type = isSentence(item.text) ? 'sentence' : 'word';
    out.push(item);
  }
  return out;
}

window.dictIndex = [];

window.dictWords = [];

window.dictSentences = [];

function buildDictFromRaw() {
  const raw = window.DICT_DATA_1 || '';
  const parsed = parseDictData(raw);
  const extra = safeStorage.get('cn_quiz_extra_dict') || [];
  const seen = new Set(parsed.map(p => p.text));
  const extraClean = extra.filter(e => e && e.text && !seen.has(e.text));
  window.dictIndex = [ ...parsed, ...extraClean ];
  window.dictWords = window.dictIndex.filter(p => p.type === 'word');
  window.dictSentences = window.dictIndex.filter(p => p.type === 'sentence');
  console.log(`📚 Loaded ${window.dictIndex.length} entries (${window.dictWords.length} words, ${window.dictSentences.length} sentences)`);
}

buildDictFromRaw();

let hskAll = [];

function parseHSKData(rawText, levelName) {
  if (!rawText || typeof rawText !== 'string') return [];
  const lines = rawText.split('\n');
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    let cols = line.split('\t');
    if (cols.length < 4) cols = line.split(/\s{2,}/);
    if (cols.length >= 4) {
      const item = {
        level: levelName,
        text: cols[1] ? cols[1].trim() : '',
        pinyin: cols[2] ? cols[2].trim() : '',
        meaning: cols[3] ? cols[3].trim() : '',
        example: cols[4] ? cols[4].trim() : '',
        examplePinyin: cols[5] ? cols[5].trim() : '',
        exampleMeaning: cols[6] ? cols[6].trim() : ''
      };
      if (item.text && item.meaning) result.push(item);
    }
  }
  return result;
}

function loadHSKData() {
  const sources = [ [ 'HSK1', typeof HSK1_RAW !== 'undefined' ? HSK1_RAW : window.HSK1_RAW ], [ 'HSK2', typeof HSK2_RAW !== 'undefined' ? HSK2_RAW : window.HSK2_RAW ], [ 'HSK3', typeof HSK3_RAW !== 'undefined' ? HSK3_RAW : window.HSK3_RAW ], [ 'HSK4', typeof HSK4_RAW !== 'undefined' ? HSK4_RAW : window.HSK4_RAW ], [ 'HSK5', typeof HSK5_RAW !== 'undefined' ? HSK5_RAW : window.HSK5_RAW ], [ 'HSK6', typeof HSK6_RAW !== 'undefined' ? HSK6_RAW : window.HSK6_RAW ] ];
  hskAll = [];
  sources.forEach(([lv, raw]) => hskAll.push(...parseHSKData(raw, lv)));
  console.log(`🎓 Loaded ${hskAll.length} HSK words`);
}

loadHSKData();

function searchAllDict(raw, limit) {
  const q = stripDiacritics(raw);
  const out = [];
  const pools = [ window.dictIndex || [], hskAll ];
  for (const pool of pools) {
    for (const i of pool) {
      if (!i._k) i._k = [ stripDiacritics(i.text), stripDiacritics(i.pinyin), stripDiacritics(i.meaning) ];
      if (i._k[0].includes(q) || i._k[1].includes(q) || i._k[2].includes(q)) {
        out.push(i);
        if (out.length >= limit) return out;
      }
    }
  }
  return out;
}

function showResetModal() {
  document.getElementById('reset-modal').classList.add('active');
}

function closeResetModal() {
  document.getElementById('reset-modal').classList.remove('active');
}

function confirmReset() {
  safeStorage.remove('cn_quiz_daily_stats');
  safeStorage.remove('cn_quiz_srs_words');
  safeStorage.remove('cn_quiz_extra_dict');
  [ 'cn_quiz_hsk_seen', 'cn_quiz_level_stats', 'cn_quiz_xp', 'cn_quiz_hsk_ever', 'cn_quiz_goal_done' ].forEach(k => safeStorage.remove(k));
  location.reload();
}

function exportData() {
  const data = {
    dailyStats: safeStorage.get('cn_quiz_daily_stats') || {},
    srsWords: safeStorage.get('cn_quiz_srs_words') || [],
    extraDict: safeStorage.get('cn_quiz_extra_dict') || [],
    levelStats: safeStorage.get('cn_quiz_level_stats') || {},
    xp: safeStorage.get('cn_quiz_xp') || 0,
    hskEver: safeStorage.get('cn_quiz_hsk_ever') || {},
    hskSeen: safeStorage.get('cn_quiz_hsk_seen') || {}
  };
  const blob = new Blob([ JSON.stringify(data, null, 2) ], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quiz_data.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader;
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.dailyStats) safeStorage.set('cn_quiz_daily_stats', data.dailyStats);
      if (Array.isArray(data.srsWords)) safeStorage.set('cn_quiz_srs_words', data.srsWords);
      if (Array.isArray(data.extraDict)) safeStorage.set('cn_quiz_extra_dict', data.extraDict);
      if (data.levelStats) safeStorage.set('cn_quiz_level_stats', data.levelStats);
      if (typeof data.xp === 'number') safeStorage.set('cn_quiz_xp', data.xp);
      if (data.hskEver) safeStorage.set('cn_quiz_hsk_ever', data.hskEver);
      if (data.hskSeen) safeStorage.set('cn_quiz_hsk_seen', data.hskSeen);
      alert('✅ Nhập dữ liệu thành công! Trang sẽ tải lại.');
      location.reload();
    } catch (err) {
      alert('❌ File không hợp lệ!');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

async function handleTxtUpload(e) {
  const files = e.target.files;
  if (!files || !files.length) return;
  const parsePromises = Array.from(files).map(file => new Promise(resolve => {
    const reader = new FileReader;
    reader.onload = ev => resolve(ev.target.result);
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  }));
  const contents = await Promise.all(parsePromises);
  const allNew = [];
  for (const content of contents) {
    allNew.push(...parseDictData(content));
  }
  const existingTexts = new Set((window.dictIndex || []).map(x => x.text));
  const added = allNew.filter(x => !existingTexts.has(x.text));
  if (added.length === 0) {
    showToast('📂 Không có từ mới nào để thêm');
    e.target.value = '';
    return;
  }
  window.dictIndex = [ ...window.dictIndex || [], ...added ];
  window.dictWords = window.dictIndex.filter(p => p.type === 'word');
  window.dictSentences = window.dictIndex.filter(p => p.type === 'sentence');
  UNIFIED_POOL = null;
  SENTENCE_POOL = null;
  const existingExtra = safeStorage.get('cn_quiz_extra_dict') || [];
  safeStorage.set('cn_quiz_extra_dict', [ ...existingExtra, ...added ]);
  showToast(`✅ Đã thêm ${added.length} mục mới`);
  e.target.value = '';
  if (document.getElementById('vocab-screen').style.display === 'block') {
    openVocab();
  }
}

function hskLookup(text) {
  if (!_hskMap) {
    _hskMap = new Map;
    hskAll.forEach(i => {
      if (!_hskMap.has(i.text)) _hskMap.set(i.text, i);
    });
  }
  return _hskMap.get(text) || null;
}

function enrich(item) {
  if (!item || item.example) return item;
  const h = hskLookup(item.text);
  if (!h) return item;
  return {
    ...item,
    level: item.level || h.level,
    example: h.example,
    examplePinyin: h.examplePinyin,
    exampleMeaning: h.exampleMeaning
  };
}

let voiceEnabled = safeStorage.get('cn_quiz_voice');

if (voiceEnabled === null) voiceEnabled = true;

let soundEnabled = safeStorage.get('cn_quiz_sound');

if (soundEnabled === null) soundEnabled = true;

let musicEnabled = safeStorage.get('cn_quiz_music');

if (musicEnabled === null) musicEnabled = true;

let musicVolume = safeStorage.get('cn_quiz_music_vol');

if (typeof musicVolume !== 'number') musicVolume = .15;

function updateSetting(key, value) {
  if (key === 'voice') {
    voiceEnabled = value;
    safeStorage.set('cn_quiz_voice', value);
    if (!value && window.speechSynthesis) window.speechSynthesis.cancel();
  } else if (key === 'sound') {
    soundEnabled = value;
    safeStorage.set('cn_quiz_sound', value);
  } else if (key === 'music') {
    musicEnabled = value;
    safeStorage.set('cn_quiz_music', value);
    updateMusicState();
  } else if (key === 'autoplay') {
    autoPlayListen = value;
    safeStorage.set('cn_quiz_autoplay', value);
  } else if (key === 'autospeak') {
    autoSpeakQ = value;
    safeStorage.set('cn_quiz_autospeak', value);
  }
  showToast('✅ Đã lưu cài đặt');
}

function updateVolume(value) {
  musicVolume = Math.max(0, Math.min(1, parseInt(value) / 100));
  safeStorage.set('cn_quiz_music_vol', musicVolume);
  document.getElementById('volume-label').textContent = Math.round(musicVolume * 100) + '%';
  const m = document.getElementById('bg-music');
  if (m && !musicDucked) {
    clearInterval(musicFadeTimer);
    m.volume = musicVolume;
  }
}

function openSettings() {
  const ov = document.getElementById('settings-modal');
  ov.classList.add('active');
  document.getElementById('setting-voice').checked = voiceEnabled;
  document.getElementById('setting-sound').checked = soundEnabled;
  document.getElementById('setting-music').checked = musicEnabled;
  document.getElementById('setting-autoplay').checked = autoPlayListen;
  document.getElementById('setting-autospeak').checked = autoSpeakQ;
  syncSegs();
  document.getElementById('setting-volume').value = Math.round(musicVolume * 100);
  document.getElementById('volume-label').textContent = Math.round(musicVolume * 100) + '%';
}

function closeSettings() {
  document.getElementById('settings-modal').classList.remove('active');
}

let musicDucked = false;

let savedVolume = musicVolume;

function updateMusicState() {
  const m = document.getElementById('bg-music');
  if (!m) return;
  m.volume = musicVolume;
  if (musicEnabled) {
    const playPromise = m.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {});
    }
  } else {
    m.pause();
  }
}

let musicFadeTimer = null;

function fadeMusicTo(target, ms) {
  const m = document.getElementById('bg-music');
  if (!m) return;
  clearInterval(musicFadeTimer);
  const from = m.volume;
  const steps = Math.max(1, Math.round(ms / 30));
  let i = 0;
  musicFadeTimer = setInterval(() => {
    i++;
    const t = Math.min(1, i / steps);
    const eased = t * t * (3 - 2 * t);
    m.volume = Math.max(0, Math.min(1, from + (target - from) * eased));
    if (i >= steps) {
      clearInterval(musicFadeTimer);
      musicFadeTimer = null;
    }
  }, 30);
}

function duckMusic() {
  const m = document.getElementById('bg-music');
  if (!m || m.paused || musicDucked) return;
  musicDucked = true;
  savedVolume = musicVolume;
  fadeMusicTo(Math.min(.03, musicVolume * .15), 450);
}

function unduckMusic() {
  const m = document.getElementById('bg-music');
  if (!m || !musicDucked) return;
  musicDucked = false;
  fadeMusicTo(musicVolume, 1400);
}

function initMusicAutoplay() {
  const tryPlay = () => {
    if (!musicEnabled) return;
    const m = document.getElementById('bg-music');
    if (m && m.paused) {
      m.volume = musicVolume;
      const p = m.play();
      if (p && p.then) p.then(() => {
        document.removeEventListener('click', tryPlay);
        document.removeEventListener('keydown', tryPlay);
        document.removeEventListener('touchstart', tryPlay);
      }).catch(() => {});
    }
  };
  document.addEventListener('click', tryPlay);
  document.addEventListener('keydown', tryPlay);
  document.addEventListener('touchstart', tryPlay);
  const m = document.getElementById('bg-music');
  if (m && musicEnabled) {
    m.volume = musicVolume;
    m.play().then(() => {}).catch(() => {});
  }
}

const MUSIC_DIR = 'Music';

let musicTrack = safeStorage.get('cn_quiz_music_track');

if (!(typeof musicTrack === 'number' && musicTrack >= 0 && musicTrack <= 12)) musicTrack = 1;

let musicChanging = false;

function updateMusicLabel() {
  const lb = document.getElementById('music-track-label');
  if (lb) lb.textContent = musicTrack === 0 ? 'music.mp3' : 'music' + musicTrack + '.mp3';
}

function probeSrc(src, cb) {
  const a = new Audio;
  let settled = false;
  const done = ok => {
    if (settled) return;
    settled = true;
    cb(ok);
  };
  a.addEventListener('loadeddata', () => done(true));
  a.addEventListener('canplay', () => done(true));
  a.addEventListener('error', () => done(false));
  setTimeout(() => done(false), 2500);
  a.src = src;
  if (a.load) a.load();
}

function applyMusicSrc(src, label) {
  const m = document.getElementById('bg-music');
  if (m) {
    m.src = src;
    if (musicEnabled) {
      m.volume = musicVolume;
      m.play().catch(() => {});
    }
  }
  const lb = document.getElementById('music-track-label');
  if (lb) lb.textContent = label;
}

function setMusicTrack(n) {
  musicTrack = n;
  safeStorage.set('cn_quiz_music_track', n);
  applyMusicSrc(MUSIC_DIR + '/music' + n + '.mp3', 'music' + n + '.mp3');
  showToast('🎵 Đang phát: music' + n + '.mp3');
}

function changeMusicTrack() {
  if (musicChanging) return;
  musicChanging = true;
  const start = musicTrack;
  let tried = 0, n = start;
  const step = () => {
    tried++;
    n = n % 12 + 1;
    if (tried > 12) {
      probeSrc('music.mp3', ok => {
        musicChanging = false;
        if (ok) {
          musicTrack = 0;
          safeStorage.set('cn_quiz_music_track', 0);
          applyMusicSrc('music.mp3', 'music.mp3');
          showToast('🎵 Đang phát: music.mp3');
        } else showToast('⚠️ Không tìm thấy nhạc trong Music/ (music1.mp3, music2.mp3…)');
      });
      return;
    }
    probeSrc(MUSIC_DIR + '/music' + n + '.mp3', ok => {
      if (ok) {
        musicChanging = false;
        setMusicTrack(n);
      } else step();
    });
  };
  step();
}

let audioCtx = null;

function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext);
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    if (navigator.vibrate) navigator.vibrate(type === 'wrong' ? [ 30, 40, 30 ] : 15);
  } catch (e) {}
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
    osc.connect(g);
    g.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + .1);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(.2, now + .02);
      g.gain.exponentialRampToValueAtTime(.01, now + .3);
      osc.start(now);
      osc.stop(now + .3);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + .2);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(.15, now + .02);
      g.gain.exponentialRampToValueAtTime(.01, now + .3);
      osc.start(now);
      osc.stop(now + .3);
    }
  } catch (e) {}
}

let zhVoice = null;

let speakToken = 0;

const TTS_RATES = [ .6, .85, 1 ];

let ttsRate = function() {
  const v = Number(safeStorage.get('cn_quiz_tts_rate'));
  return TTS_RATES.includes(v) ? v : .85;
}();

function ttsRateLabel() {
  return (ttsRate === .6 ? '🐢 ' : ttsRate === 1 ? '🐇 ' : '🚶 ') + ttsRate + 'x';
}

function refreshTTSBtns() {
  document.querySelectorAll('.tts-rate-btn:not(.tts-replay)').forEach(b => b.textContent = ttsRateLabel());
}

function cycleTTSRate(replay) {
  ttsRate = TTS_RATES[(TTS_RATES.indexOf(ttsRate) + 1) % TTS_RATES.length];
  safeStorage.set('cn_quiz_tts_rate', ttsRate);
  refreshTTSBtns();
  if (typeof replay === 'function') {
    try {
      replay();
    } catch (e) {}
  }
}

refreshTTSBtns();

function setSlowTTS() {
  if (ttsRate !== .6) {
    ttsRate = .6;
    safeStorage.set('cn_quiz_tts_rate', ttsRate);
    refreshTTSBtns();
  }
}

let ttsSupported = 'speechSynthesis' in window;

function loadVoices() {
  if (!ttsSupported || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  const zhVoices = voices.filter(v => v.lang.startsWith('zh'));
  if (zhVoices.length === 0) {
    zhVoice = null;
    return;
  }
  const priority = [ 'Xiaoxiao', 'Xiaoyi', 'Xiaomo', 'Xiaoxuan', 'Huihui', 'Yaoyao', 'Ting-Ting', 'Google 普通话' ];
  for (let n of priority) {
    let f = zhVoices.find(v => v.name.includes(n) && v.localService);
    if (f) {
      zhVoice = f;
      return;
    }
  }
  zhVoice = zhVoices.find(v => v.localService) || zhVoices[0];
}

function speakChinese(text, btn) {
  if (!voiceEnabled || !ttsSupported || !window.speechSynthesis) return;
  const clean = String(text).replace(/\(.*?\)/g, '');
  const hanzi = (clean.match(/[\u4e00-\u9fa5]+/g) || []).join(' ');
  if (!hanzi) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(hanzi);
  u.lang = 'zh-CN';
  u.rate = ttsRate;
  if (zhVoice) u.voice = zhVoice;
  const target = btn || document.getElementById('btn-speak');
  if (target) target.classList.add('speaking');
  const myToken = ++speakToken;
  duckMusic();
  u.onend = u.onerror = () => {
    if (target) target.classList.remove('speaking');
    if (myToken === speakToken) unduckMusic();
  };
  window.speechSynthesis.speak(u);
}

function cycleTheme() {
  const themes = [ 'neon', 'sakura', 'light' ];
  const cur = document.documentElement.getAttribute('data-skin') || 'neon';
  const next = themes[(themes.indexOf(cur) + 1) % themes.length];
  document.documentElement.setAttribute('data-skin', next);
  safeStorage.set('cn_quiz_theme', next);
}

let autoPlayListen = (v => v === null ? true : !!v)(safeStorage.get('cn_quiz_autoplay'));

let autoSpeakQ = !!safeStorage.get('cn_quiz_autospeak');

let timerSec = Number(safeStorage.get('cn_quiz_timer')) || 0;

let dailyGoal = Number(safeStorage.get('cn_quiz_goal')) || 20;

function setTimerSec(n) {
  timerSec = n;
  safeStorage.set('cn_quiz_timer', n);
  syncSegs();
  showToast(n ? `⏱️ Đếm ngược ${n}s mỗi câu` : '⏱️ Đã tắt đếm ngược');
}

function setDailyGoal(n) {
  dailyGoal = n;
  safeStorage.set('cn_quiz_goal', n);
  syncSegs();
  updateHomeCard();
  showToast(`🎯 Mục tiêu ${n} câu/ngày`);
}

function syncSegs() {
  document.querySelectorAll('#timer-seg button').forEach(b => b.classList.toggle('active', Number(b.dataset.v) === timerSec));
  document.querySelectorAll('#goal-seg button').forEach(b => b.classList.toggle('active', Number(b.dataset.v) === dailyGoal));
  const tl = document.getElementById('timer-label');
  if (tl) tl.textContent = timerSec ? timerSec + ' giây' : 'Tắt';
  const gl = document.getElementById('goal-label');
  if (gl) gl.textContent = dailyGoal + ' câu';
  document.body.classList.toggle('has-timer', timerSec > 0);
}

let qTimer = null, qRemain = 0, qTotal = 0;

function startQTimer(onTimeout) {
  stopQTimer();
  if (!timerSec) return;
  qTotal = qRemain = timerSec * 1e3;
  setTimerFill(1);
  qTimer = setInterval(() => {
    if (isPaused) return;
    qRemain -= 100;
    setTimerFill(Math.max(0, qRemain / qTotal));
    if (qRemain <= 0) {
      stopQTimer();
      onTimeout();
    }
  }, 100);
}

function stopQTimer() {
  clearInterval(qTimer);
  qTimer = null;
}

function setTimerFill(f) {
  document.querySelectorAll('.timer-fill').forEach(el => {
    el.style.width = f * 100 + '%';
    el.style.background = f > .5 ? 'var(--correct)' : f > .25 ? '#facc15' : 'var(--wrong)';
  });
}

let selectedQuestions = [];

let currentIndex = 0;

let score = 0;

let answered = false;

let currentMode = 'dict';

let isPaused = false;

let currentGameStarter = null;

let matchRounds = 0;

let matchSelectedLeft = null;

let matchSelectedRight = null;

let matchScore = 0;

let matchPairs = [];

let dailyStats = safeStorage.get('cn_quiz_daily_stats') || {};

let srsWords = safeStorage.get('cn_quiz_srs_words') || [];

if (!Array.isArray(srsWords)) srsWords = [];

srsWords = srsWords.map(w => {
  if (!w.nextReview) w.nextReview = Date.now();
  if (!w.box) w.box = 1;
  if (!w.correctStreak) w.correctStreak = 0;
  return w;
}).filter(w => w.text && w.meaning && w.meaning.trim() !== '' && w.meaning !== 'Không rõ');

function getLocalDateStr(d = new Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function splitPinyin(text) {
  if (!text) return {
    pinyin: null,
    text: ""
  };
  const regex = /\(([a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹ][a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹ\s\.\-']*)\)/;
  const m = text.match(regex);
  if (m) {
    return {
      pinyin: m[1].trim(),
      text: text.replace(m[0], '').replace(/\s+/g, ' ').trim()
    };
  }
  return {
    pinyin: null,
    text: text
  };
}

function shuffle(a) {
  const b = [ ...a ];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [ b[j], b[i] ];
  }
  return b;
}

function escapeHTML(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function show(id) {
  [ 'welcome-screen', 'game-screen', 'tr-screen', 'stats-screen', 'srs-screen', 'vocab-screen', 'hsk-screen', 'flash-screen', 'quiz-screen', 'listen-screen', 'match-screen', 'result-screen', 'order-screen', 'write-screen', 'pinyin-screen', 'hub-screen', 'px-screen' ].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.style.display = 'none';
  });
  document.getElementById(id).style.display = 'block';
  if (id !== 'quiz-screen' && id !== 'listen-screen') stopQTimer();
  const cd = document.getElementById('corner-data');
  if (cd) cd.style.display = id === 'welcome-screen' ? 'flex' : 'none';
}

let menuCtx = null, vocabTabMem = null;

function goHome() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  isPaused = false;
  document.getElementById('pause-overlay').classList.remove('active');
  show(menuCtx === 'games' && document.getElementById('game-screen') ? 'game-screen' : 'welcome-screen');
  updateDueBanner();
  updateHomeCard();
}

function goMain() {
  menuCtx = null;
  goHome();
}

function openGames() {
  menuCtx = 'games';
  goHome();
}

function openTranslate() {
  menuCtx = null;
  show('tr-screen');
  const root = document.getElementById('tr-root');
  if (root && window.Translator && !document.getElementById('tr-in')) window.Translator.mount(root);
  const inp = document.getElementById('tr-in');
  if (inp && !('ontouchstart' in window)) setTimeout(() => {
    try {
      inp.focus();
    } catch (e) {}
  }, 60);
}

function openVocabHub(tab) {
  menuCtx = null;
  if (tab !== 'hsk' && tab !== 'data') tab = (vocabTabMem || safeStorage.get('cn_vocab_tab')) === 'data' ? 'data' : 'hsk';
  vocabTabMem = tab;
  safeStorage.set('cn_vocab_tab', tab);
  if (tab === 'data') openVocab(); else openHSK();
  document.querySelectorAll('.vs-tab').forEach(b => b.classList.toggle('active', b.dataset.vs === tab));
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 1800);
}

let UNIFIED_POOL = null;

let SENTENCE_POOL = null;

let activeOptDrag = null;

function optModel(btn) {
  const root = btn.querySelector('.option-text');
  if (!root) return null;
  const nodes = [];
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let t;
  while (t = tw.nextNode()) nodes.push(t);
  if (!nodes.length) return null;
  let total = 0;
  for (const n of nodes) total += n.nodeValue.length;
  return {
    root: root,
    nodes: nodes,
    total: total
  };
}

function optPosAtOffset(model, offset) {
  let rem = Math.max(0, Math.min(offset, model.total));
  for (const t of model.nodes) {
    if (rem <= t.nodeValue.length) return [ t, rem ];
    rem -= t.nodeValue.length;
  }
  const last = model.nodes[model.nodes.length - 1];
  return [ last, last.nodeValue.length ];
}

function optOffsetAtPoint(model, x, y) {
  let node = null, off = 0, ok = false;
  if (document.caretPositionFromPoint) {
    const p = document.caretPositionFromPoint(x, y);
    if (p && p.offsetNode && model.root.contains(p.offsetNode)) {
      if (p.offsetNode.nodeType === 3) {
        node = p.offsetNode;
        off = p.offset;
        ok = true;
      } else {
        const kids = p.offsetNode.childNodes;
        for (let k = p.offset - 1; k >= 0; k--) {
          if (kids[k] && kids[k].nodeType === 3) {
            node = kids[k];
            off = kids[k].nodeValue.length;
            ok = true;
            break;
          }
        }
      }
    }
  } else if (document.caretRangeFromPoint) {
    const r = document.caretRangeFromPoint(x, y);
    if (r && r.startContainer.nodeType === 3 && model.root.contains(r.startContainer)) {
      node = r.startContainer;
      off = r.startOffset;
      ok = true;
    }
  }
  if (!ok) return null;
  let total = 0;
  for (const t of model.nodes) {
    if (t === node) return total + Math.max(0, Math.min(off, t.nodeValue.length));
    total += t.nodeValue.length;
  }
  return null;
}

function setOptHighlight(model, a, b) {
  const lo = Math.min(a, b), hi = Math.max(a, b);
  if (hi - lo < 1) return;
  const p1 = optPosAtOffset(model, lo), p2 = optPosAtOffset(model, hi);
  const sel = window.getSelection();
  const r = document.createRange();
  r.setStart(p1[0], p1[1]);
  r.setEnd(p2[0], p2[1]);
  sel.removeAllRanges();
  sel.addRange(r);
}

function clearOptHighlight() {
  try {
    const sel = window.getSelection();
    if (sel && sel.rangeCount) sel.removeAllRanges();
  } catch (e) {}
}

function optBeginDrag(btn, x, y) {
  const model = optModel(btn);
  activeOptDrag = {
    btn: btn,
    down: true,
    moved: false,
    startX: x,
    startY: y,
    model: model,
    startOff: model ? optOffsetAtPoint(model, x, y) : null
  };
}

function optHandleMove(x, y) {
  const d = activeOptDrag;
  if (!d || !d.down || !d.btn || d.btn.disabled) return;
  if (!d.moved) {
    const dx = x - d.startX, dy = y - d.startY;
    if (dx * dx + dy * dy < 36) return;
    d.moved = true;
    if (d.startOff == null) d.startOff = 0;
  }
  if (!d.model) return;
  const off = optOffsetAtPoint(d.model, x, y);
  if (off != null) setOptHighlight(d.model, d.startOff, off);
}

window.addEventListener('mousemove', e => {
  optHandleMove(e.clientX, e.clientY);
});

window.addEventListener('mouseup', () => {
  const d = activeOptDrag;
  if (!d || !d.down) return;
  d.down = false;
  if (!d.moved) clearOptHighlight();
});

function wireOptButtons(btn, selectFn) {
  btn.addEventListener('mousedown', function(e) {
    if (e.button !== 0 || btn.disabled) return;
    optBeginDrag(btn, e.clientX, e.clientY);
    e.preventDefault();
  });
  btn.addEventListener('click', function() {
    const d = activeOptDrag;
    if (d && d.moved && d.btn === btn) {
      d.moved = false;
      return;
    }
    selectFn();
  });
  let touchLive = false;
  btn.addEventListener('touchstart', function(e) {
    if (btn.disabled || e.touches.length !== 1) return;
    const t = e.touches[0];
    touchLive = true;
    optBeginDrag(btn, t.clientX, t.clientY);
  });
  btn.addEventListener('touchmove', function(e) {
    if (!touchLive) return;
    const d = activeOptDrag;
    if (!d || d.btn !== btn) return;
    const t = e.touches[0];
    if (!t) return;
    if (!d.moved) {
      const dx = t.clientX - d.startX, dy = t.clientY - d.startY;
      if (dx * dx + dy * dy < 144) return;
    }
    e.preventDefault();
    optHandleMove(t.clientX, t.clientY);
  }, {
    passive: false
  });
  btn.addEventListener('touchend', function(e) {
    if (!touchLive) return;
    const d = activeOptDrag;
    const isOurs = d && d.btn === btn;
    touchLive = false;
    if (!isOurs) return;
    e.preventDefault();
    if (d.moved) return;
    if (!e.touches.length && !btn.disabled) selectFn();
  }, {
    passive: false
  });
  btn.addEventListener('touchcancel', function() {
    touchLive = false;
    const d = activeOptDrag;
    if (d && d.btn === btn) {
      d.down = false;
      if (!d.moved) clearOptHighlight();
    }
  });
}

function renderQuiz() {
  const q = selectedQuestions[currentIndex];
  if (!q) {
    showResult();
    return;
  }
  document.getElementById('q-counter').textContent = `CÂU ${currentIndex + 1} / ${selectedQuestions.length}`;
  document.getElementById('score-display').textContent = `⭐ ${score}`;
  document.getElementById('progress-bar').style.width = `${currentIndex / selectedQuestions.length * 100}%`;
  const isLast = currentIndex === selectedQuestions.length - 1;
  let qNumText = `Câu hỏi ${currentIndex + 1}`;
  if (isLast && q.isSentence) qNumText = `🎯 Câu hỏi ${currentIndex + 1} — Mẫu câu`;
  document.getElementById('q-num').textContent = qNumText;
  const qText = document.getElementById('q-text');
  const qPinyin = document.getElementById('q-pinyin');
  const speakBtn = document.getElementById('btn-speak');
  qText.classList.remove('is-hanzi', 'is-sentence', 'is-meaning');
  if (q.view) {
    document.getElementById('q-num').textContent = `Câu hỏi ${currentIndex + 1} — ${q.view.label}`;
    qText.textContent = q.view.text;
    if (q.view.cls) qText.classList.add(q.view.cls);
    if (q.view.pinyin) {
      qPinyin.textContent = q.view.pinyin;
      qPinyin.style.display = 'inline-block';
    } else qPinyin.style.display = 'none';
    speakBtn.classList.toggle('hidden', !q.view.speak);
  } else if (q.isSentence) {
    qText.textContent = q.hanzi;
    qText.classList.add('is-sentence');
    if (q.pinyin) {
      qPinyin.textContent = q.pinyin;
      qPinyin.style.display = 'inline-block';
    } else qPinyin.style.display = 'none';
    speakBtn.classList.remove('hidden');
  } else if (q.hanzi && q.hanzi.length > 0) {
    qText.textContent = q.hanzi;
    qText.classList.add('is-hanzi');
    if (q.pinyin) {
      qPinyin.textContent = q.pinyin;
      qPinyin.style.display = 'inline-block';
    } else qPinyin.style.display = 'none';
    speakBtn.classList.remove('hidden');
  } else {
    qText.textContent = q.q;
    qPinyin.style.display = 'none';
    speakBtn.classList.add('hidden');
  }
  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  q.a.forEach((ans, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'option-wrap';
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.idx = i;
    let optHTML;
    if (q.optHanzi) {
      const parts = String(ans).split('\n');
      optHTML = `<span class="option-text hanzi-opt"><span class="opt-han">${escapeHTML(parts[0])}</span>${parts[1] ? `<span class="opt-py">${escapeHTML(parts[1])}</span>` : ''}</span>`;
    } else {
      optHTML = `<span class="option-text">${escapeHTML(ans)}</span>`;
    }
    btn.innerHTML = `\n      <span class="option-label">${String.fromCharCode(65 + i)}</span>\n      ${optHTML}\n    `;
    wireOptButtons(btn, () => selectAnswer(i, btn));
    wrap.appendChild(btn);
    grid.appendChild(wrap);
  });
  document.getElementById('feedback').className = 'feedback-msg';
  document.getElementById('feedback').textContent = '';
  const nextBtn = document.getElementById('btn-next');
  nextBtn.classList.remove('visible');
  nextBtn.textContent = currentIndex === selectedQuestions.length - 1 ? 'Xem Kết Quả 🏆' : 'Câu Tiếp Theo →';
  answered = false;
  renderReveal('reveal', null);
  updateComboChip();
  startQTimer(quizTimeout);
  if (autoSpeakQ && voiceEnabled && !speakBtn.classList.contains('hidden')) setTimeout(() => {
    if (!answered) speakCurrentQuestion();
  }, 300);
}

function nextQuestion() {
  if (!answered) return;
  currentIndex++;
  if (currentIndex >= selectedQuestions.length) {
    showResult();
    return;
  }
  renderQuiz();
}

function speakCurrentQuestion() {
  if (!voiceEnabled) {
    showToast('🔇 Giọng đọc đang tắt trong cài đặt');
    return;
  }
  if (!zhVoice) loadVoices();
  const q = selectedQuestions[currentIndex];
  if (q) speakChinese(q.speakText || q.hanzi || q.q);
}

function restartCurrentGame() {
  document.getElementById('pause-overlay').classList.remove('active');
  if (currentGameStarter) currentGameStarter();
}

function updateDueBanner() {
  const due = srsWords.filter(w => w.nextReview <= Date.now()).length;
  const banner = document.getElementById('due-review-banner');
  if (due > 0) {
    banner.classList.add('show');
    document.getElementById('due-count').textContent = due;
  } else {
    banner.classList.remove('show');
  }
}

function closeSrsWarning() {
  document.getElementById('srs-warning-modal').classList.remove('active');
}

function startDueReview() {
  startSRSGame(true);
}

function calculateStreak() {
  let streak = 0;
  let d = new Date;
  while (true) {
    const ds = getLocalDateStr(d);
    const day = dailyStats[ds];
    if (day && (day.correct > 0 || day.wrong > 0)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      if (streak === 0 && ds === getLocalDateStr()) {
        d.setDate(d.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return streak;
}

let vocabAll = [];

let vocabFiltered = [];

let vocabType = 'all';

function openVocab() {
  show('vocab-screen');
  vocabAll = [ ...window.dictIndex || [] ].filter(i => i.text && i.meaning);
  vocabType = 'all';
  document.querySelectorAll('.vocab-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.filter === 'all');
  });
  document.getElementById('vocab-search').value = '';
  filterVocabList('');
}

function closeVocab() {
  goHome();
}

function filterVocabType(type, btn) {
  vocabType = type;
  document.querySelectorAll('.vocab-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  filterVocabList(document.getElementById('vocab-search').value);
}

function filterVocabList(q) {
  const raw = (q || '').trim();
  let base = vocabAll;
  if (vocabType === 'word') base = vocabAll.filter(i => i.type === 'word'); else if (vocabType === 'sentence') base = vocabAll.filter(i => i.type === 'sentence');
  const byMeaning = (a, b) => (a.meaning || '').localeCompare(b.meaning || '', 'vi', {
    sensitivity: 'base'
  });
  if (!raw) {
    vocabFiltered = [ ...base ].sort(byMeaning);
  } else {
    vocabFiltered = base.filter(i => smartMatch(raw, i.text) || smartMatch(raw, i.pinyin) || smartMatch(raw, i.meaning)).sort(byMeaning);
  }
  renderVocabList();
}

function renderVocabList() {
  const list = document.getElementById('vocab-list');
  list.innerHTML = '';
  resetScroll(list);
  document.getElementById('vocab-count').textContent = `${vocabFiltered.length} mục`;
  if (vocabFiltered.length === 0) {
    list.innerHTML = `<div class="dict-empty">Không tìm thấy từ nào.</div>`;
    document.getElementById('alphabet-sidebar').innerHTML = '';
    return;
  }
  const groups = {};
  vocabFiltered.forEach(item => {
    const letter = getMeaningLetter(item.meaning);
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(item);
  });
  const letters = Object.keys(groups).sort((a, b) => {
    if (a === '#' && b !== '#') return 1;
    if (b === '#' && a !== '#') return -1;
    return a.localeCompare(b);
  });
  letters.forEach(letter => {
    const grp = document.createElement('div');
    grp.id = 'vocab-letter-' + letter;
    const header = document.createElement('div');
    header.className = 'vocab-letter-header';
    header.textContent = letter;
    grp.appendChild(header);
    list.appendChild(grp);
    groups[letter].forEach(item => {
      const row = document.createElement('div');
      row.className = 'vocab-row';
      const badge = item.type === 'sentence' ? '<span class="v-badge">💬 câu</span>' : '<span class="v-badge word">🔤 từ</span>';
      let hanziClass = 'v-hanzi';
      if (item.text.length > 15) hanziClass += ' text-xxs'; else if (item.text.length > 8) hanziClass += ' text-xs'; else if (item.text.length > 5) hanziClass += ' text-sm';
      let meaningClass = 'v-meaning';
      if (item.meaning.length > 30) meaningClass += ' text-xs'; else if (item.meaning.length > 15) meaningClass += ' text-sm';
      row.innerHTML = `\n        <div class="vocab-info">\n          <div class="vocab-text">\n            ${badge}\n            <span class="${hanziClass}">${escapeHTML(item.text)}</span>\n          </div>\n          <div class="${meaningClass}">${escapeHTML(item.meaning)}</div>\n          <div class="v-pinyin">${escapeHTML(item.pinyin || '')}</div>\n        </div>\n        <div class="vocab-actions">\n          <button class="v-speak" data-text="${escapeHTML(item.text)}">🔊</button>\n        </div>\n      `;
      row.querySelector('.v-speak').addEventListener('click', function(e) {
        e.stopPropagation();
        if (!zhVoice) loadVoices();
        speakChinese(item.text, this);
      });
      grp.appendChild(row);
    });
  });
  renderAlphabetSidebar(letters);
}

function renderAlphabetSidebar(letters) {
  const bar = document.getElementById('alphabet-sidebar');
  bar.innerHTML = '';
  const all = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
  all.forEach(l => {
    const el = document.createElement('div');
    el.className = 'alphabet-letter' + (letters.includes(l) ? '' : ' disabled');
    el.textContent = l;
    el.addEventListener('click', () => {
      const target = document.getElementById('vocab-letter-' + l);
      if (target) {
        const list = document.getElementById('vocab-list');
        list.scrollTo({
          top: target.offsetTop - 10,
          behavior: 'smooth'
        });
      }
    });
    bar.appendChild(el);
  });
  enableDragScroll(bar);
}

function enableDragScroll(el) {
  if (!el || el.dataset.dragscroll === '1') return;
  el.dataset.dragscroll = '1';
  let isDown = false, dragged = false, startY = 0, scrollTop = 0;
  el.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    if (e.target.closest('button')) return;
    isDown = true;
    dragged = false;
    startY = e.pageY;
    scrollTop = el.scrollTop;
  });
  el.addEventListener('mouseleave', () => {
    isDown = false;
    el.classList.remove('dragging');
  });
  el.addEventListener('mouseup', () => {
    isDown = false;
    el.classList.remove('dragging');
    if (dragged) setTimeout(() => {
      dragged = false;
    }, 50);
  });
  el.addEventListener('mousemove', e => {
    if (!isDown) return;
    const delta = e.pageY - startY;
    if (!dragged && Math.abs(delta) > 5) {
      dragged = true;
      el.classList.add('dragging');
    }
    if (dragged) {
      e.preventDefault();
      el.scrollTop = scrollTop - delta;
    }
  });
  el.addEventListener('click', e => {
    if (dragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

let hskFiltered = [];

let hskLevel = 'HSK1';

function openHSK() {
  show('hsk-screen');
  hskLevel = 'HSK1';
  document.querySelectorAll('#hsk-level-tabs .hsk-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.level === 'HSK1');
  });
  document.getElementById('hsk-search').value = '';
  filterHSKList('');
}

function closeHSK() {
  goHome();
}

function filterHSKLevel(level, btn) {
  hskLevel = level;
  document.querySelectorAll('#hsk-level-tabs .hsk-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  filterHSKList(document.getElementById('hsk-search').value);
}

function filterHSKList(q) {
  const raw = (q || '').trim();
  let base = hskLevel === 'all' ? hskAll : hskAll.filter(i => i.level === hskLevel);
  if (raw) {
    base = base.filter(i => smartMatch(raw, i.text) || smartMatch(raw, i.pinyin) || smartMatch(raw, i.meaning));
  }
  hskFiltered = [ ...base ].sort((a, b) => (a.meaning || '').localeCompare(b.meaning || '', 'vi', {
    sensitivity: 'base'
  }));
  renderHSKList();
}

function renderHSKList() {
  const list = document.getElementById('hsk-list');
  const sidebar = document.getElementById('hsk-sidebar');
  document.getElementById('hsk-count').textContent = hskAll.length ? `${hskFiltered.length} / ${hskAll.length} từ vựng` : '';
  if (hskAll.length === 0) {
    list.innerHTML = `<div class="dict-empty" style="color:var(--wrong)">❌ Không tìm thấy dữ liệu HSK!\nKiểm tra lại xem file HSK1.js ... HSK6.js đã có dữ liệu và nằm trong thư mục Model chưa.</div>`;
    sidebar.innerHTML = '';
    return;
  }
  if (hskFiltered.length === 0) {
    list.innerHTML = `<div class="dict-empty">Không tìm thấy từ nào.</div>`;
    sidebar.innerHTML = '';
    return;
  }
  const groups = {};
  hskFiltered.forEach((item, idx) => {
    const letter = getMeaningLetter(item.meaning);
    (groups[letter] = groups[letter] || []).push([ item, idx ]);
  });
  const letters = Object.keys(groups).sort((a, b) => {
    if (a === '#' && b !== '#') return 1;
    if (b === '#' && a !== '#') return -1;
    return a.localeCompare(b);
  });
  let html = '';
  letters.forEach(letter => {
    html += `<div id="hsk-letter-${letter === '#' ? 'hash' : letter}"><div class="vocab-letter-header">${letter}</div>`;
    groups[letter].forEach(([item, idx]) => {
      let hanziClass = 'v-hanzi';
      if (item.text.length > 15) hanziClass += ' text-xxs'; else if (item.text.length > 8) hanziClass += ' text-xs'; else if (item.text.length > 5) hanziClass += ' text-sm';
      html += `\n        <div class="vocab-row hsk-row">\n          <div class="vocab-info">\n            <div class="vocab-text">\n              <span class="v-badge hsk-lv">${escapeHTML(item.level)}</span>\n              <span class="${hanziClass}">${escapeHTML(item.text)}</span>\n            </div>\n            <div class="v-meaning">${escapeHTML(item.meaning)}</div>\n            <div class="v-pinyin">${escapeHTML(item.pinyin)}</div>\n          </div>\n          <div class="vocab-actions">\n            <button class="v-speak" data-idx="${idx}">🔊</button>\n          </div>\n          ${item.example ? `\n          <div class="hsk-example">\n            <div class="ex-body">\n              <div class="ex-hanzi">${escapeHTML(item.example)}</div>\n              ${item.examplePinyin ? `<div class="ex-pinyin">${escapeHTML(item.examplePinyin)}</div>` : ''}\n              ${item.exampleMeaning ? `<div class="ex-meaning">${escapeHTML(item.exampleMeaning)}</div>` : ''}\n            </div>\n            <button class="v-speak ex-speak" data-idx="${idx}" data-ex="1" title="Đọc câu ví dụ">🔊</button>\n          </div>` : ''}\n        </div>`;
    });
    html += '</div>';
  });
  list.innerHTML = html;
  resetScroll(list);
  renderHSKSidebar(letters);
}

function renderHSKSidebar(letters) {
  const bar = document.getElementById('hsk-sidebar');
  bar.innerHTML = '';
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('').forEach(l => {
    const el = document.createElement('div');
    el.className = 'alphabet-letter' + (letters.includes(l) ? '' : ' disabled');
    el.textContent = l;
    el.addEventListener('click', () => {
      const target = document.getElementById('hsk-letter-' + (l === '#' ? 'hash' : l));
      if (target) document.getElementById('hsk-list').scrollTo({
        top: target.offsetTop - 10,
        behavior: 'smooth'
      });
    });
    bar.appendChild(el);
  });
  enableDragScroll(bar);
}

function resetScroll(el) {
  if (!el) return;
  el.style.scrollBehavior = 'auto';
  el.scrollTop = 0;
  el.style.scrollBehavior = '';
}

let hskQuizMode = 'quiz';

let quizResultLabel = 'Chế độ Đấu trí';

const hskRange = l => {
  const m = /^range:(\d)-(\d)$/.exec(String(l));
  return m ? [ +m[1], +m[2] ] : null;
};

const hskLabel = l => {
  const r = hskRange(l);
  return r ? r[0] === r[1] ? 'HSK ' + r[0] : 'HSK ' + r[0] + '-' + r[1] : l === 'all' ? 'HSK 1-6' : String(l).replace('HSK', 'HSK ');
};

function normKey(s) {
  return stripDiacritics(String(s || '')).replace(/\s+/g, ' ').trim();
}

function rawKey(s) {
  return String(s || '').normalize('NFC').toLowerCase().replace(/\s+/g, '').trim();
}

function synTokens(item) {
  if (item._syn) return item._syn;
  item._syn = String(item.meaning || '').split(/[,;\/()（）、]|\s-\s/).map(normKey).filter(t => t.length >= 2);
  return item._syn;
}

function meaningConflict(a, b) {
  const A = synTokens(a), B = synTokens(b);
  for (const x of A) for (const y of B) {
    if (x === y) return true;
    if ((' ' + x + ' ').includes(' ' + y + ' ') || (' ' + y + ' ').includes(' ' + x + ' ')) return true;
  }
  return false;
}

function hskPool(level) {
  const r = hskRange(level);
  const base = r ? hskAll.filter(i => {
    const n = +String(i.level).replace('HSK', '');
    return n >= r[0] && n <= r[1];
  }) : level === 'all' ? hskAll : hskAll.filter(i => i.level === level);
  return base.filter(i => i.text && i.meaning);
}

function distractorPool(level) {
  const p = hskPool(level);
  return p.length >= 40 ? p : hskAll.filter(i => i.text && i.meaning);
}

function pickDistractors(t, cands, valFn, n, scoreFn, o) {
  o = o || {};
  const keyFn = o.keyFn || normKey;
  const taken = new Set((o.exclude || []).map(keyFn));
  taken.add(keyFn(valFn(t)));
  const ranked = [];
  for (const c of cands) {
    if (c === t || c.text === t.text) continue;
    if (!o.noConflict && meaningConflict(t, c)) continue;
    if (o.filter && !o.filter(c)) continue;
    const v = valFn(c);
    if (!v) continue;
    const k = keyFn(v);
    if (taken.has(k)) continue;
    ranked.push([ scoreFn(t, c), v, k ]);
  }
  ranked.sort((a, b) => a[0] - b[0]);
  const top = shuffle(ranked.slice(0, Math.max(n * 5, 12)));
  const out = [];
  for (const [, v, k] of top) {
    if (taken.has(k)) continue;
    taken.add(k);
    out.push(v);
    if (out.length >= n) break;
  }
  return out;
}

const lenRatio = (a, b) => Math.abs(a - b) / Math.max(a, b, 1) * 10;

const simMeaning = (t, c) => lenRatio(t.meaning.length, c.meaning.length) + (c.text.length === t.text.length ? 0 : 3) + Math.random() * 2;

const simHanzi = (t, c) => (c.text.length === t.text.length ? 0 : 6) + ([ ...t.text ].some(ch => c.text.includes(ch)) ? -2 : 0) + Math.random() * 3;

const simCloze = (t, c) => (c.text.length === t.text.length ? 0 : 6) + Math.random() * 3;

const simSentence = (t, c) => lenRatio(t.exampleMeaning.length, c.exampleMeaning.length) + Math.random() * 3;

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({
    length: m + 1
  }, (_, i) => [ i, ...Array(n).fill(0) ]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

const hanOpt = c => c.pinyin ? `${c.text}\n${String(c.pinyin).normalize('NFC')}` : c.text;

const TONE_MAP = {
  a: 'aāáǎà',
  e: 'eēéěè',
  o: 'oōóǒò',
  i: 'iīíǐì',
  u: 'uūúǔù',
  'ü': 'üǖǘǚǜ'
};

function toneVariants(py, n) {
  py = String(py).normalize('NFC');
  const chars = [ ...py ];
  const low = chars.map(c => c.toLowerCase());
  const marked = [];
  low.forEach((ch, i) => {
    for (const b in TONE_MAP) {
      const idx = TONE_MAP[b].indexOf(ch);
      if (idx > 0) {
        marked.push([ i, b, idx ]);
        break;
      }
    }
  });
  let spots = marked;
  if (!spots.length) {
    let at = -1, base = '';
    for (const v of [ 'a', 'e', 'o' ]) {
      at = low.indexOf(v);
      if (at >= 0) {
        base = v;
        break;
      }
    }
    if (at < 0) for (let i = low.length - 1; i >= 0; i--) if ('iuü'.includes(low[i])) {
      at = i;
      base = low[i];
      break;
    }
    if (at >= 0) spots = [ [ at, base, 0 ] ];
  }
  const make = list => {
    const c = [ ...chars ];
    list.forEach(([i, b, t]) => {
      const r = TONE_MAP[b][t];
      c[i] = chars[i] !== low[i] ? r.toUpperCase() : r;
    });
    return c.join('');
  };
  const out = new Set;
  const singles = [];
  spots.forEach(([i, b, idx]) => {
    for (let t = 1; t <= 4; t++) if (t !== idx) singles.push([ i, b, t ]);
  });
  shuffle(singles).forEach(x => {
    if (out.size < n) out.add(make([ x ]));
  });
  let guard = 0;
  while (out.size < n && spots.length > 1 && guard++ < 30) {
    const two = shuffle(spots).slice(0, 2).map(([i, b, idx]) => [ i, b, [ 1, 2, 3, 4 ].filter(t => t !== idx)[Math.floor(Math.random() * 3)] ]);
    out.add(make(two));
  }
  out.delete(py);
  return [ ...out ].slice(0, n);
}

function mkQ(t, opts, correctVal, view, optHanzi) {
  const idx = opts.indexOf(correctVal);
  const kf = view.pinyinOpts ? rawKey : normKey;
  if (idx < 0 || new Set(opts.map(kf)).size !== opts.length) return null;
  return {
    q: view.text,
    a: opts,
    correct: idx,
    rawTarget: t,
    view: view,
    speakText: view.speakText || null,
    optHanzi: !!optHanzi,
    pinyin: null,
    hanzi: '',
    isSentence: false
  };
}

function qH2M(t, cands) {
  const d = pickDistractors(t, cands, c => c.meaning, 3, simMeaning);
  if (d.length < 3) return null;
  return mkQ(t, shuffle([ t.meaning, ...d ]), t.meaning, {
    label: 'Chữ Hán này nghĩa là gì?',
    text: t.text,
    cls: 'is-hanzi',
    pinyin: t.pinyin,
    speak: true,
    speakText: t.text
  });
}

function qM2H(t, cands) {
  const d = pickDistractors(t, cands, hanOpt, 3, simHanzi);
  if (d.length < 3) return null;
  return mkQ(t, shuffle([ hanOpt(t), ...d ]), hanOpt(t), {
    label: 'Chọn chữ Hán đúng với nghĩa:',
    text: t.meaning,
    cls: 'is-meaning',
    pinyin: null,
    speak: false
  }, true);
}

function qH2P(t, cands) {
  if (!t.pinyin) return null;
  const correct = String(t.pinyin).normalize('NFC');
  let d = toneVariants(correct, 3);
  if (d.length < 3) {
    const more = pickDistractors(t, cands, c => c.pinyin ? String(c.pinyin).normalize('NFC') : '', 3 - d.length, (a, c) => levenshtein(stripDiacritics(a.pinyin).replace(/\s/g, ''), stripDiacritics(c.pinyin).replace(/\s/g, '')) + Math.random(), {
      keyFn: rawKey,
      noConflict: true,
      exclude: [ correct, ...d ]
    });
    d = d.concat(more);
  }
  if (d.length < 3) return null;
  return mkQ(t, shuffle([ correct, ...d.slice(0, 3) ]), correct, {
    label: 'Pinyin đúng của chữ này là gì?',
    text: t.text,
    cls: 'is-hanzi',
    pinyin: null,
    speak: true,
    speakText: t.text,
    pinyinOpts: true
  });
}

function qCloze(t, cands) {
  if (!t.example || !t.exampleMeaning || !/[一-龥]/.test(t.text)) return null;
  const cnt = t.example.split(t.text).length - 1;
  if (cnt < 1 || cnt > 2) return null;
  const blank = t.example.split(t.text).join('＿＿');
  const d = pickDistractors(t, cands, hanOpt, 3, simCloze, {
    filter: c => !t.example.includes(c.text) && !c.text.includes(t.text) && !t.text.includes(c.text)
  });
  if (d.length < 3) return null;
  return mkQ(t, shuffle([ hanOpt(t), ...d ]), hanOpt(t), {
    label: 'Điền từ còn thiếu vào chỗ trống:',
    text: blank,
    cls: 'is-sentence',
    pinyin: '💡 ' + t.exampleMeaning,
    speak: false
  }, true);
}

function qSent(t, cands) {
  if (!t.example || !t.exampleMeaning) return null;
  const d = pickDistractors(t, cands, c => c.exampleMeaning || '', 3, simSentence, {
    noConflict: true,
    filter: c => c.example && c.example !== t.example
  });
  if (d.length < 3) return null;
  return mkQ(t, shuffle([ t.exampleMeaning, ...d ]), t.exampleMeaning, {
    label: 'Câu này nghĩa là gì?',
    text: t.example,
    cls: 'is-sentence',
    pinyin: t.examplePinyin || null,
    speak: true,
    speakText: t.example
  });
}

function runHSKQuiz(level, n) {
  n = n || 10;
  const qs = buildHSKQuestions(level, n);
  if (!qs.length) {
    showToast('❌ Chưa đủ dữ liệu để tạo đề');
    return;
  }
  currentGameStarter = () => runHSKQuiz(level, n);
  resetSession();
  selectedQuestions = qs;
  currentIndex = 0;
  score = 0;
  answered = false;
  quizResultLabel = `Kiểm tra ${hskLabel(level)}`;
  show('quiz-screen');
  const badge = document.getElementById('mode-badge');
  badge.textContent = `📝 ${hskLabel(level)}`;
  badge.className = 'mode-badge hsk-mode';
  renderQuiz();
}

function runHSKListen(level, n) {
  n = n || 10;
  const targets = pickHSKTargets(level, n);
  const cands = distractorPool(level);
  listenQuestions = targets.map(t => {
    const d = pickDistractors(t, cands, c => c.meaning, 3, simMeaning, {
      filter: c => rawKey(c.pinyin) !== rawKey(t.pinyin)
    });
    if (d.length < 3) return null;
    const arr = shuffle([ t.meaning, ...d ]);
    return {
      target: t,
      options: {
        arr: arr,
        correct: arr.indexOf(t.meaning)
      }
    };
  }).filter(Boolean);
  if (!listenQuestions.length) {
    showToast('❌ Chưa đủ dữ liệu để tạo đề');
    return;
  }
  currentGameStarter = () => runHSKListen(level, n);
  resetSession();
  listenLabel = `Nghe đoán ${hskLabel(level)}`;
  listenIndex = 0;
  listenScore = 0;
  listenAnswered = false;
  show('listen-screen');
  renderListen();
}

function startHSKQuiz(level, n) {
  closeHSKQuizModal();
  if (hskPool(level).length < 4) {
    showToast('❌ Chưa đủ dữ liệu HSK');
    return;
  }
  if (hskQuizMode === 'listen') runHSKListen(level, n); else runHSKQuiz(level, n);
}

function startHSKRange() {
  let a = +document.getElementById('hskq-from').value, b = +document.getElementById('hskq-to').value;
  if (a > b) [a, b] = [ b, a ];
  const n = +document.getElementById('hskq-count').value || 20;
  safeStorage.set('cn_quiz_hsk_range', {
    a: a,
    b: b,
    n: n
  });
  startHSKQuiz('range:' + a + '-' + b, n);
}

function openHSKQuiz() {
  const grid = document.getElementById('hsk-level-grid');
  if (!hskAll.length) {
    grid.innerHTML = `<div class="dict-empty" style="grid-column:1/-1;color:var(--wrong)">❌ Chưa có dữ liệu HSK1.js … HSK6.js (trong thư mục Model)</div>`;
  } else {
    let html = '';
    for (let i = 1; i <= 6; i++) {
      const lv = 'HSK' + i, c = hskPool(lv).length;
      html += `<button class="time-btn" ${c < 4 ? 'disabled' : ''} onclick="startHSKQuiz('${lv}')">HSK ${i}<small>${c} từ</small></button>`;
    }
    html += `<button class="time-btn wide" onclick="startHSKQuiz('all')">🎯 Tổng hợp HSK 1-6<small>${hskPool('all').length} từ · trộn đều các cấp</small></button>`;
    const saved = safeStorage.get('cn_quiz_hsk_range') || {
      a: 1,
      b: 2,
      n: 20
    };
    const opt = (v, cur) => `<option value="${v}" ${v === cur ? 'selected' : ''}>${v}</option>`;
    const selCss = 'padding:8px 6px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);font:700 14px var(--font-body);';
    html += `<div style="grid-column:1/-1;border:1px solid var(--border);border-radius:var(--radius-md);padding:10px;display:flex;flex-direction:column;gap:8px;text-align:left">\n      <div style="font-weight:800;font-size:13px">📐 Chọn phạm vi HSK</div>\n      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:13px">\n        Từ <select id="hskq-from" style="${selCss}">${[ 1, 2, 3, 4, 5, 6 ].map(v => opt(v, saved.a)).join('')}</select>\n        đến <select id="hskq-to" style="${selCss}">${[ 1, 2, 3, 4, 5, 6 ].map(v => opt(v, saved.b)).join('')}</select>\n        <select id="hskq-count" style="${selCss}">${[ 10, 20, 30, 40 ].map(v => `<option value="${v}" ${v === saved.n ? 'selected' : ''}>${v} câu</option>`).join('')}</select>\n      </div>\n      <button class="time-btn" style="border-color:#f472b6" onclick="startHSKRange()">▶ Bắt đầu</button></div>`;
    grid.innerHTML = html;
  }
  document.getElementById('hsk-quiz-modal').classList.add('active');
}

function closeHSKQuizModal() {
  document.getElementById('hsk-quiz-modal').classList.remove('active');
}

function setHSKQuizMode(m, btn) {
  hskQuizMode = m;
  document.querySelectorAll('.hsk-mode-btn').forEach(b => b.classList.toggle('active', b === btn));
}

document.getElementById('hsk-list').addEventListener('click', function(e) {
  const btn = e.target.closest('.v-speak');
  if (!btn) return;
  e.stopPropagation();
  const item = hskFiltered[parseInt(btn.dataset.idx, 10)];
  if (!item) return;
  if (!zhVoice) loadVoices();
  speakChinese(btn.dataset.ex ? item.example : item.text, btn);
});

function renderDictResultItem(item) {
  const div = document.createElement('div');
  div.className = 'dict-item';
  const badge = item.level ? `<span class="v-badge hsk-lv">${escapeHTML(item.level)}</span>` : item.type === 'sentence' ? '<span class="v-badge">💬 câu</span>' : '';
  let hanziClass = 'dict-item-text';
  if (item.text.length > 15) hanziClass += ' text-xs'; else if (item.text.length > 8) hanziClass += ' text-sm';
  div.innerHTML = `\n    <div class="dict-item-info">\n      <div class="${hanziClass}">\n        ${badge}\n        <span>${escapeHTML(item.text)}</span>\n        <span class="dict-item-pinyin">${escapeHTML(item.pinyin || '')}</span>\n      </div>\n      <div style="font-size:14px;color:var(--text);">${escapeHTML(item.meaning || '')}</div>\n      ${item.example ? `\n      <div class="dict-example">\n        <div class="ex-hanzi">${escapeHTML(item.example)}<button class="dict-ex-speak" title="Đọc câu ví dụ">🔊</button></div>\n        ${item.examplePinyin ? `<div class="ex-pinyin">${escapeHTML(item.examplePinyin)}</div>` : ''}\n        ${item.exampleMeaning ? `<div class="ex-meaning">${escapeHTML(item.exampleMeaning)}</div>` : ''}\n      </div>` : ''}\n    </div>\n    <button class="dict-speak" data-text="${escapeHTML(item.text)}">🔊</button>\n  `;
  div.querySelector('.dict-speak').addEventListener('click', function() {
    if (!zhVoice) loadVoices();
    speakChinese(item.text, this);
  });
  const exBtn = div.querySelector('.dict-ex-speak');
  if (exBtn) exBtn.addEventListener('click', function() {
    if (!zhVoice) loadVoices();
    speakChinese(item.example, this);
  });
  return div;
}

function handleDictSearch(q) {
  const raw = (q || '').trim();
  const results = document.getElementById('dict-results');
  const clear = document.getElementById('dict-clear');
  if (clear) clear.classList.toggle('visible', !!raw);
  if (!raw) {
    results.classList.remove('active');
    results.innerHTML = '';
    return;
  }
  resetScroll(results);
  const matches = searchAllDict(raw, 50);
  results.classList.add('active');
  if (matches.length === 0) {
    results.innerHTML = `<div class="dict-empty">Không tìm thấy "${escapeHTML(q)}".</div>`;
    return;
  }
  results.innerHTML = '';
  matches.forEach(item => results.appendChild(renderDictResultItem(item)));
}

function clearDictSearch() {
  document.getElementById('dict-search').value = '';
  document.getElementById('dict-results').classList.remove('active');
  document.getElementById('dict-results').innerHTML = '';
  document.getElementById('dict-clear').classList.remove('visible');
}

function handleQuizSearch(q) {
  const raw = (q || '').trim();
  const results = document.getElementById('quiz-dict-results');
  if (!raw) {
    results.innerHTML = '';
    return;
  }
  resetScroll(results);
  const matches = searchAllDict(raw, 40);
  if (matches.length === 0) {
    results.innerHTML = `<div class="dict-empty">Không tìm thấy "${escapeHTML(q)}".</div>`;
    return;
  }
  results.innerHTML = '';
  matches.forEach(item => results.appendChild(renderDictResultItem(item)));
}

function togglePause(show) {
  isPaused = show;
  const ov = document.getElementById('pause-overlay');
  if (show) ov.classList.add('active'); else ov.classList.remove('active');
}

function toggleQuizDict(show) {
  isPaused = !!show;
  document.getElementById('quiz-dict-overlay').classList.toggle('active', show);
  if (show) setTimeout(() => document.getElementById('quiz-dict-search').focus(), 100);
}

(function() {
  const c = document.getElementById('stars');
  if (!c) return;
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.setProperty('--dur', Math.random() * 4 + 2 + 's');
    s.style.setProperty('--delay', Math.random() * 5 + 's');
    s.style.setProperty('--max-opacity', (Math.random() * .5 + .1).toFixed(2));
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    c.appendChild(s);
  }
})();

function attachSpotlight(el, {tilt: tilt = false} = {}) {
  if (!el || el.dataset.spotlight === '1') return;
  el.dataset.spotlight = '1';
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    if (tilt) {
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      el.style.setProperty('--rx', `${-dy * 6}deg`);
      el.style.setProperty('--ry', `${dx * 6}deg`);
    }
  });
  el.addEventListener('pointerleave', () => {
    if (tilt) {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    }
  });
}

let sessionLog = [];

let comboCount = 0, bestCombo = 0, sessionXP = 0;

let xp = Number(safeStorage.get('cn_quiz_xp')) || 0;

let levelStats = safeStorage.get('cn_quiz_level_stats') || {};

let _hskMap = null;

function resetSession() {
  sessionLog = [];
  comboCount = 0;
  bestCombo = 0;
  sessionXP = 0;
  updateComboChip();
}

const xpForLevel = l => 60 * (l - 1) * (l - 1);

const levelFromXP = x => Math.floor(Math.sqrt(x / 60)) + 1;

function gainXP(n) {
  const before = levelFromXP(xp);
  xp += n;
  sessionXP += n;
  safeStorage.set('cn_quiz_xp', xp);
  const after = levelFromXP(xp);
  if (after > before) {
    showToast(`🎉 Lên cấp ${after}!`);
    burstConfetti();
  }
}

function todayTotal() {
  const d = dailyStats[getLocalDateStr()];
  return d ? (d.correct || 0) + (d.wrong || 0) : 0;
}

function checkDailyGoal() {
  if (todayTotal() >= dailyGoal && safeStorage.get('cn_quiz_goal_done') !== getLocalDateStr()) {
    safeStorage.set('cn_quiz_goal_done', getLocalDateStr());
    showToast(`🎯 Hoàn thành mục tiêu ${dailyGoal} câu hôm nay!`);
    burstConfetti();
  }
}

function updateHomeCard() {
  const t = todayTotal(), pct = Math.min(100, Math.round(t / dailyGoal * 100));
  const ring = document.getElementById('goal-ring');
  if (!ring) return;
  ring.style.setProperty('--p', pct);
  ring.classList.toggle('done', pct >= 100);
  document.getElementById('goal-ring-text').textContent = pct >= 100 ? '✓' : pct + '%';
  document.getElementById('hp-sub').textContent = pct >= 100 ? `Xong rồi! ${t} câu hôm nay 🎉` : `${t} / ${dailyGoal} câu`;
  document.getElementById('chip-streak').textContent = `🔥 ${calculateStreak()} ngày`;
  document.getElementById('chip-level').textContent = `⚡ Lv ${levelFromXP(xp)}`;
}

function burstConfetti() {
  const cv = document.getElementById('confetti');
  if (!cv || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  cv.width = innerWidth;
  cv.height = innerHeight;
  const ctx = cv.getContext('2d');
  const colors = [ '#7c6aff', '#c084fc', '#38bdf8', '#22c55e', '#facc15', '#f472b6', '#ff6b35' ];
  const ps = Array.from({
    length: 110
  }, () => ({
    x: innerWidth / 2 + (Math.random() - .5) * 120,
    y: innerHeight * .45,
    vx: (Math.random() - .5) * 14,
    vy: -Math.random() * 14 - 4,
    g: .35 + Math.random() * .2,
    s: 5 + Math.random() * 6,
    r: Math.random() * 6,
    vr: (Math.random() - .5) * .4,
    c: colors[Math.floor(Math.random() * colors.length)]
  }));
  let frames = 0;
  (function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.g;
      p.r += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .6);
      ctx.restore();
    });
    if (++frames < 130) requestAnimationFrame(tick); else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}

function countUp(el, to) {
  const t0 = performance.now(), dur = 700;
  (function step(now) {
    const k = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}

function updateComboChip() {
  document.querySelectorAll('.combo-chip').forEach(c => {
    c.classList.toggle('show', comboCount >= 2);
    c.textContent = `🔥 x${comboCount}`;
  });
}

function renderReveal(id, item) {
  const box = document.getElementById(id);
  if (!box) return;
  if (!item) {
    box.innerHTML = '';
    box.classList.remove('show');
    return;
  }
  const it = enrich(item);
  box.innerHTML = `\n    <div class="rv-top">\n      <span class="rv-han${it.text.length > 8 ? ' long' : ''}">${escapeHTML(it.text)}</span>\n      <span class="rv-py">${escapeHTML(it.pinyin || '')}</span>\n      ${it.level ? `<span class="v-badge hsk-lv">${escapeHTML(it.level)}</span>` : ''}\n      <button class="v-speak" data-s="w" title="Nghe từ">🔊</button>\n    </div>\n    <div class="rv-mean">${escapeHTML(it.meaning || '')}</div>\n    ${it.example ? `\n    <div class="rv-ex">\n      <div class="ex-hanzi">${escapeHTML(it.example)}<button class="dict-ex-speak" data-s="e" title="Đọc câu ví dụ">🔊</button></div>\n      ${it.examplePinyin ? `<div class="ex-pinyin">${escapeHTML(it.examplePinyin)}</div>` : ''}\n      ${it.exampleMeaning ? `<div class="ex-meaning">${escapeHTML(it.exampleMeaning)}</div>` : ''}\n    </div>` : ''}`;
  box.classList.add('show');
  box.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', function() {
    if (!zhVoice) loadVoices();
    speakChinese(this.dataset.s === 'e' ? it.example : it.text, this);
  }));
}

function recordAnswer(isCorrect, targetWord, opts) {
  opts = opts || {};
  const today = getLocalDateStr();
  if (!dailyStats[today]) dailyStats[today] = {
    correct: 0,
    wrong: 0
  };
  if (isCorrect) dailyStats[today].correct++; else dailyStats[today].wrong++;
  safeStorage.set('cn_quiz_daily_stats', dailyStats);
  if (isCorrect) {
    comboCount++;
    bestCombo = Math.max(bestCombo, comboCount);
    if (!opts.noXP) gainXP(10 + Math.min(comboCount - 1, 5) * 2);
  } else {
    comboCount = 0;
    if (!opts.noXP) gainXP(2);
  }
  updateComboChip();
  if (targetWord && typeof targetWord === 'object') {
    const lv = targetWord.level || 'Khác';
    const ls = levelStats[lv] || (levelStats[lv] = {
      c: 0,
      w: 0
    });
    if (isCorrect) ls.c++; else ls.w++;
    safeStorage.set('cn_quiz_level_stats', levelStats);
    sessionLog.push({
      text: targetWord.text,
      pinyin: targetWord.pinyin || '',
      meaning: targetWord.meaning || '',
      ok: isCorrect
    });
  }
  if (targetWord && !opts.noSRS) {
    let wordObj = typeof targetWord === 'object' ? {
      ...targetWord
    } : null;
    if (wordObj) {
      if (!wordObj.meaning || !wordObj.meaning.trim() || wordObj.meaning === 'Không rõ') {
        const found = (window.dictIndex || []).find(i => i.text === wordObj.text);
        if (found && found.meaning) wordObj.meaning = found.meaning;
      }
      if (wordObj.text && wordObj.meaning && wordObj.meaning.trim()) {
        const existing = srsWords.find(w => w.text === wordObj.text);
        if (existing) {
          if (isCorrect) {
            existing.correctStreak = (existing.correctStreak || 0) + 1;
            existing.wrongCount = 0;
            existing.box = Math.min(5, (existing.box || 1) + 1);
            const intervals = {
              1: 1,
              2: 3,
              3: 7,
              4: 14,
              5: 30
            };
            existing.nextReview = Date.now() + (intervals[existing.box] || 30) * 864e5;
          } else {
            existing.correctStreak = 0;
            existing.wrongCount = (existing.wrongCount || 0) + 1;
            existing.box = 1;
            existing.nextReview = Date.now();
          }
          if (wordObj.level && !existing.level) existing.level = wordObj.level;
        } else if (!isCorrect) {
          srsWords.push({
            text: wordObj.text,
            pinyin: wordObj.pinyin || '',
            meaning: wordObj.meaning,
            level: wordObj.level || '',
            wrongCount: 1,
            correctStreak: 0,
            box: 1,
            nextReview: Date.now()
          });
        }
        safeStorage.set('cn_quiz_srs_words', srsWords);
      }
    }
  }
  updateDueBanner();
  updateHomeCard();
  checkDailyGoal();
}

function pickTargets(pool, key, n) {
  pool = pool.filter(i => i.text && i.meaning);
  const store = safeStorage.get('cn_quiz_hsk_seen') || {};
  let seen = new Set(store[key] || []);
  const now = Date.now();
  const dueSet = new Set(srsWords.filter(w => w.nextReview <= now).map(w => w.text));
  const wrongSet = new Set(srsWords.map(w => w.text));
  const chosen = [], used = new Set;
  const add = it => {
    if (chosen.length >= n || used.has(it.text)) return;
    used.add(it.text);
    chosen.push(it);
  };
  const takeFrom = list => {
    const groups = {};
    shuffle(list).forEach(i => (groups[i.level || '-'] = groups[i.level || '-'] || []).push(i));
    const keys = shuffle(Object.keys(groups));
    let progressed = true;
    while (chosen.length < n && progressed) {
      progressed = false;
      for (const k of keys) {
        const it = groups[k].shift();
        if (it) {
          progressed = true;
          add(it);
        }
        if (chosen.length >= n) break;
      }
    }
  };
  shuffle(pool.filter(i => dueSet.has(i.text))).slice(0, 2).forEach(add);
  shuffle(pool.filter(i => wrongSet.has(i.text) && !dueSet.has(i.text))).slice(0, 1).forEach(add);
  takeFrom(pool.filter(i => !seen.has(i.text) && !used.has(i.text)));
  if (chosen.length < n) {
    seen = new Set;
    takeFrom(pool.filter(i => !used.has(i.text)));
  }
  chosen.forEach(i => seen.add(i.text));
  store[key] = [ ...seen ];
  safeStorage.set('cn_quiz_hsk_seen', store);
  const ever = safeStorage.get('cn_quiz_hsk_ever') || {};
  let dirty = false;
  chosen.forEach(i => {
    if (i.level) {
      const a = ever[i.level] || (ever[i.level] = []);
      if (!a.includes(i.text)) {
        a.push(i.text);
        dirty = true;
      }
    }
  });
  if (dirty) safeStorage.set('cn_quiz_hsk_ever', ever);
  return shuffle(chosen);
}

const pickHSKTargets = (level, n) => pickTargets(hskPool(level), level, n);

function allWordsPool() {
  return [ ...(window.dictWords || []).filter(w => w.meaning && w.meaning.trim()), ...hskAll.filter(i => i.text && i.meaning) ];
}

function buildFromTargets(targets, cands, quota) {
  const builders = {
    h2m: qH2M,
    m2h: qM2H,
    h2p: qH2P,
    cloze: qCloze,
    sent: qSent
  };
  quota = {
    ...quota
  };
  const out = [];
  targets.forEach(t0 => {
    const t = enrich(t0);
    let q = null, kind = null;
    for (const k of shuffle(Object.keys(quota).filter(k => quota[k] > 0))) {
      q = builders[k](t, cands);
      if (q) {
        kind = k;
        break;
      }
    }
    if (!q) for (const k of shuffle([ 'h2m', 'm2h' ])) {
      q = builders[k](t, cands);
      if (q) {
        kind = k;
        break;
      }
    }
    if (q) {
      if (quota[kind] > 0) quota[kind]--;
      out.push(q);
    }
  });
  return out;
}

function scaledQuota(n) {
  const k = (n || 10) / 10, q = {
    h2m: 3,
    m2h: 2,
    h2p: 2,
    cloze: 2,
    sent: 1
  };
  Object.keys(q).forEach(x => q[x] = Math.max(1, Math.round(q[x] * k)));
  return q;
}

function buildHSKQuestions(level, n) {
  return buildFromTargets(pickHSKTargets(level, n || 10), distractorPool(level), scaledQuota(n));
}

function runPoolQuiz(pool, label, n) {
  pool = (pool || []).filter(i => i.text && i.meaning);
  if (pool.length < 4) {
    showToast('❌ Chưa đủ dữ liệu để tạo đề');
    return;
  }
  n = n || 10;
  const qs = buildFromTargets(pickTargets(pool, 'pool:' + label, n), pool.length >= 40 ? pool : allWordsPool(), scaledQuota(n));
  if (!qs.length) {
    showToast('❌ Chưa đủ dữ liệu để tạo đề');
    return;
  }
  currentGameStarter = () => runPoolQuiz(pool, label, n);
  resetSession();
  selectedQuestions = qs;
  currentIndex = 0;
  score = 0;
  answered = false;
  quizResultLabel = 'Trắc nghiệm ' + label;
  show('quiz-screen');
  const badge = document.getElementById('mode-badge');
  badge.textContent = '🚀 ' + label;
  badge.className = 'mode-badge hsk-mode';
  renderQuiz();
}

function qSentenceItem(item, sents, label) {
  const d = pickDistractors(item, sents, c => c.meaning, 3, (a, c) => lenRatio(a.meaning.length, c.meaning.length) + Math.random() * 3, {
    noConflict: true
  });
  if (d.length < 3) return null;
  return mkQ(item, shuffle([ item.meaning, ...d ]), item.meaning, {
    label: label,
    text: item.text,
    cls: 'is-sentence',
    pinyin: item.pinyin || null,
    speak: true,
    speakText: item.text
  });
}

const validWords = () => (window.dictWords || []).filter(w => w.meaning && w.meaning.trim());

const validSents = () => (window.dictSentences || []).filter(s => s.meaning && s.meaning.trim());

function startGame(mode) {
  currentMode = mode || 'dict';
  quizResultLabel = 'Chế độ Đấu trí';
  currentGameStarter = () => startGame(mode);
  const words = validWords(), sents = validSents();
  if (!words.length && !sents.length) {
    alert('Chưa có dữ liệu quiz! Kiểm tra Data.js trong thư mục Model.');
    return;
  }
  resetSession();
  const useSent = sents.length >= 4;
  let qs = words.length >= 4 ? buildFromTargets(pickTargets(words, 'dict', useSent ? 9 : 10), words, {
    h2m: 4,
    m2h: 3,
    h2p: 2,
    cloze: 1
  }) : [];
  if (useSent) {
    const it = pickTargets(sents, 'dictsent', 1)[0];
    const q = it && qSentenceItem(it, sents, '🎯 Câu hỏi cuối — Mẫu câu');
    if (q) qs.push(q);
  }
  if (qs.length < 10 && sents.length >= 4 && words.length < 4) {
    qs = qs.concat(pickTargets(sents, 'dictsent', 10 - qs.length).map(i => qSentenceItem(i, sents, 'Mẫu câu')).filter(Boolean));
  }
  if (!qs.length) {
    alert('Chưa đủ dữ liệu để tạo đề (cần ít nhất 4 từ).');
    return;
  }
  selectedQuestions = qs;
  currentIndex = 0;
  score = 0;
  answered = false;
  show('quiz-screen');
  document.getElementById('mode-badge').textContent = '🚀 Đấu trí';
  document.getElementById('mode-badge').className = 'mode-badge dict-mode';
  renderQuiz();
}

function finishAnswerUI(prefix) {
  const nb = document.getElementById(prefix === 'l' ? 'l-next' : 'btn-next');
  setTimeout(() => nb && nb.scrollIntoView({
    block: 'nearest',
    behavior: 'smooth'
  }), 120);
}

function selectAnswer(idx, btn) {
  if (answered) return;
  answered = true;
  stopQTimer();
  clearOptHighlight();
  const q = selectedQuestions[currentIndex];
  const isCorrect = idx === q.correct;
  document.querySelectorAll('#options-grid .option-btn').forEach(b => b.disabled = true);
  if (isCorrect) {
    btn.classList.add('correct');
    score++;
    playSound('correct');
    document.getElementById('feedback').textContent = comboCount >= 2 ? `✅ Chính xác! Combo x${comboCount + 1} 🔥` : '✅ Chính xác!';
    document.getElementById('feedback').className = 'feedback-msg show correct-msg';
    recordAnswer(true, q.rawTarget);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('#options-grid .option-btn')[q.correct].classList.add('correct');
    playSound('wrong');
    document.getElementById('feedback').textContent = `❌ Sai rồi! Đáp án đúng: ${String(q.a[q.correct]).replace('\n', ' ')}`;
    document.getElementById('feedback').className = 'feedback-msg show wrong-msg';
    recordAnswer(false, q.rawTarget);
  }
  document.getElementById('score-display').textContent = `⭐ ${score}`;
  renderReveal('reveal', q.rawTarget);
  document.getElementById('btn-next').classList.add('visible');
  finishAnswerUI('q');
}

function quizTimeout() {
  if (answered) return;
  answered = true;
  const q = selectedQuestions[currentIndex];
  document.querySelectorAll('#options-grid .option-btn').forEach(b => b.disabled = true);
  document.querySelectorAll('#options-grid .option-btn')[q.correct].classList.add('correct');
  playSound('wrong');
  document.getElementById('feedback').textContent = `⏰ Hết giờ! Đáp án đúng: ${String(q.a[q.correct]).replace('\n', ' ')}`;
  document.getElementById('feedback').className = 'feedback-msg show wrong-msg';
  recordAnswer(false, q.rawTarget);
  renderReveal('reveal', q.rawTarget);
  document.getElementById('btn-next').classList.add('visible');
  finishAnswerUI('q');
}

let matchRoundsData = [], matchTotalRounds = 5, matchWrongSet = new Set;

function startMatchGame() {
  currentGameStarter = startMatchGame;
  const words = validWords();
  if (words.length < 8) {
    alert('Cần ít nhất 8 từ để chơi Nối từ!');
    return;
  }
  resetSession();
  matchTotalRounds = Math.min(5, Math.floor(words.length / 4));
  let rest = pickTargets(words, 'dict', matchTotalRounds * 4);
  matchRoundsData = [];
  for (let r = 0; r < matchTotalRounds; r++) {
    const round = [];
    for (const w of rest) {
      if (round.length >= 4) break;
      if (!round.some(x => x.text === w.text || rawKey(x.pinyin) === rawKey(w.pinyin) || meaningConflict(x, w))) round.push(w);
    }
    for (const w of rest) {
      if (round.length >= 4) break;
      if (!round.includes(w)) round.push(w);
    }
    rest = rest.filter(w => !round.includes(w));
    matchRoundsData.push(round);
  }
  matchRounds = 0;
  matchScore = 0;
  show('match-screen');
  setupMatchRound();
}

function setupMatchRound() {
  matchRounds++;
  matchSelectedLeft = null;
  matchSelectedRight = null;
  matchWrongSet = new Set;
  document.getElementById('m-counter').textContent = `MÀN ${matchRounds} / ${matchTotalRounds}`;
  document.getElementById('m-score').textContent = `⭐ ${matchScore}`;
  document.getElementById('m-feedback').className = 'feedback-msg';
  document.getElementById('m-next').classList.remove('visible');
  matchPairs = matchRoundsData[matchRounds - 1].map(w => ({
    text: w.text,
    meaning: w.meaning,
    pinyin: w.pinyin || ''
  }));
  const left = document.getElementById('m-left'), right = document.getElementById('m-right');
  left.innerHTML = '';
  right.innerHTML = '';
  shuffle([ ...matchPairs ]).forEach(p => {
    const el = document.createElement('div');
    el.className = 'match-item';
    el.textContent = p.text;
    el.dataset.text = p.text;
    el.addEventListener('click', () => selectMatchItem('left', el));
    left.appendChild(el);
  });
  shuffle([ ...matchPairs ]).forEach(p => {
    const el = document.createElement('div');
    el.className = 'match-item';
    el.textContent = p.meaning;
    el.dataset.text = p.text;
    el.addEventListener('click', () => selectMatchItem('right', el));
    right.appendChild(el);
  });
}

function selectMatchItem(side, el) {
  if (el.classList.contains('matched')) return;
  if (side === 'left') {
    if (matchSelectedLeft) matchSelectedLeft.classList.remove('selected');
    matchSelectedLeft = el;
  } else {
    if (matchSelectedRight) matchSelectedRight.classList.remove('selected');
    matchSelectedRight = el;
  }
  el.classList.add('selected');
  if (side === 'left' && voiceEnabled) {
    if (!zhVoice) loadVoices();
    speakChinese(el.dataset.text);
  }
  if (matchSelectedLeft && matchSelectedRight) {
    const target = matchPairs.find(p => p.text === matchSelectedLeft.dataset.text);
    const ok = matchSelectedLeft.dataset.text === matchSelectedRight.dataset.text;
    if (ok) {
      matchSelectedLeft.classList.add('matched');
      matchSelectedRight.classList.add('matched');
      matchScore += matchWrongSet.has(target.text) ? 2 : 5;
      document.getElementById('m-score').textContent = `⭐ ${matchScore}`;
      playSound('correct');
      document.getElementById('m-feedback').textContent = matchWrongSet.has(target.text) ? '✅ Đúng rồi! +2' : '✅ Ghép đúng! +5';
      document.getElementById('m-feedback').className = 'feedback-msg show correct-msg';
      if (target && !matchWrongSet.has(target.text)) recordAnswer(true, {
        text: target.text,
        pinyin: target.pinyin,
        meaning: target.meaning
      });
    } else {
      const l = matchSelectedLeft, r = matchSelectedRight;
      l.classList.add('error');
      r.classList.add('error');
      playSound('wrong');
      document.getElementById('m-feedback').textContent = '❌ Sai cặp!';
      document.getElementById('m-feedback').className = 'feedback-msg show wrong-msg';
      if (target && !matchWrongSet.has(target.text)) {
        matchWrongSet.add(target.text);
        recordAnswer(false, {
          text: target.text,
          pinyin: target.pinyin,
          meaning: target.meaning
        });
      }
      setTimeout(() => {
        l.classList.remove('error', 'selected');
        r.classList.remove('error', 'selected');
      }, 600);
    }
    matchSelectedLeft = null;
    matchSelectedRight = null;
    if (document.querySelectorAll('#m-left .match-item:not(.matched)').length === 0) {
      const nb = document.getElementById('m-next');
      nb.classList.add('visible');
      nb.textContent = matchRounds >= matchTotalRounds ? 'Xem Kết Quả 🏆' : 'Màn Tiếp Theo →';
    }
  }
}

function nextMatchRound() {
  if (matchRounds >= matchTotalRounds) {
    finishMatch();
    return;
  }
  setupMatchRound();
}

function finishMatch() {
  showFinal({
    score: matchScore,
    totalText: 'điểm',
    pct: matchScore / (matchTotalRounds * 4 * 5) * 100,
    sub: `Nối từ · ${matchTotalRounds} màn`,
    emoji: '🧩',
    title: 'Hoàn thành Nối từ!'
  });
}

function showResult() {
  showFinal({
    score: score,
    totalText: `trên ${selectedQuestions.length} câu`,
    pct: score / selectedQuestions.length * 100,
    sub: quizResultLabel
  });
}

function showFinal(o) {
  stopQTimer();
  show('result-screen');
  const pct = Math.max(0, Math.min(100, Math.round(o.pct)));
  countUp(document.getElementById('score-big'), o.score);
  document.getElementById('score-total').textContent = o.totalText;
  document.getElementById('score-pct').textContent = pct + '%';
  const bar = document.getElementById('score-bar');
  bar.style.transition = 'none';
  bar.style.width = '0';
  void bar.offsetWidth;
  bar.style.transition = '';
  setTimeout(() => {
    bar.style.width = pct + '%';
  }, 100);
  document.getElementById('result-emoji').textContent = o.emoji || (pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪');
  document.getElementById('result-title').textContent = o.title || (pct >= 80 ? 'Xuất Sắc!' : pct >= 50 ? 'Cố lên!' : 'Luyện thêm nhé!');
  document.getElementById('result-sub').textContent = o.sub || '';
  const ok = sessionLog.filter(x => x.ok).length, bad = sessionLog.length - ok;
  document.getElementById('result-chips').innerHTML = `<span class="chip">✅ ${ok} đúng</span><span class="chip">❌ ${bad} sai</span>` + `<span class="chip">🔥 Combo cao nhất x${bestCombo}</span><span class="chip">⚡ +${sessionXP} XP</span>`;
  const wrongMap = new Map;
  sessionLog.filter(x => !x.ok).forEach(x => wrongMap.set(x.text, x));
  const wrong = [ ...wrongMap.values() ];
  const rb = document.getElementById('review-box');
  rb.classList.toggle('show', wrong.length > 0);
  rb.innerHTML = wrong.length ? `<h4>Cần xem lại (${wrong.length})</h4>` + wrong.slice(0, 15).map((w, i) => `\n    <div class="review-row">\n      <span class="rr-han">${escapeHTML(w.text)}</span>\n      <div class="rr-info"><div class="rr-py">${escapeHTML(w.pinyin)}</div><div class="rr-mean">${escapeHTML(w.meaning)}</div></div>\n      <button class="v-speak" data-i="${i}">🔊</button>\n    </div>`).join('') : '';
  rb.querySelectorAll('.v-speak').forEach(b => b.addEventListener('click', function() {
    if (!zhVoice) loadVoices();
    speakChinese(wrong[Number(this.dataset.i)].text, this);
  }));
  window._lastWrongTexts = wrong.map(w => w.text);
  const pb = document.getElementById('btn-practice-wrong');
  pb.classList.toggle('show', wrong.length > 0);
  pb.textContent = `🧠 Luyện ${wrong.length} từ sai`;
  if (pct >= 80) burstConfetti();
}

function practiceSessionWrong() {
  startSRSGame(false, window._lastWrongTexts || []);
}

let srsTab = 'due';

function setSRSTab(t, btn) {
  srsTab = t;
  document.querySelectorAll('#srs-tabs .hsk-tab').forEach(b => b.classList.toggle('active', b === btn));
  renderSRSList();
}

function openSRS() {
  show('srs-screen');
  renderSRSList();
}

function removeSRS(text) {
  srsWords = srsWords.filter(w => w.text !== text);
  safeStorage.set('cn_quiz_srs_words', srsWords);
  updateDueBanner();
  renderSRSList();
}

function renderSRSList() {
  const now = Date.now();
  const due = srsWords.filter(w => w.nextReview <= now), done = srsWords.filter(w => (w.box || 1) >= 5);
  document.getElementById('srs-tab-due').textContent = `🔴 Cần ôn (${due.length})`;
  document.getElementById('srs-tab-all').textContent = `📚 Tất cả (${srsWords.length})`;
  document.getElementById('srs-tab-done').textContent = `✅ Đã thuộc (${done.length})`;
  const list = document.getElementById('srs-list');
  const has = srsWords.length > 0;
  document.getElementById('srs-actions').style.display = has ? 'grid' : 'none';
  document.getElementById('srs-tabs').style.display = has ? 'flex' : 'none';
  if (!has) {
    list.innerHTML = `<div class="srs-empty">🎉 Tuyệt vời! Chưa có từ nào bị sai.\nHãy chơi quiz — từ nào sai sẽ được ghi vào đây và ôn lại đúng lúc.</div>`;
    return;
  }
  let items = srsTab === 'due' ? due : srsTab === 'done' ? done : srsWords;
  items = [ ...items ].sort((a, b) => a.nextReview - b.nextReview);
  if (!items.length) {
    list.innerHTML = `<div class="srs-empty">${srsTab === 'due' ? '✅ Không có từ nào đến hạn ôn hôm nay.' : 'Chưa có từ nào ở mục này.'}</div>`;
    return;
  }
  list.innerHTML = '';
  items.forEach(word => {
    const row = document.createElement('div');
    row.className = 'vocab-row srs-row';
    const isDue = word.nextReview <= now;
    const days = Math.ceil((word.nextReview - now) / 864e5);
    const box = Math.max(1, Math.min(5, word.box || 1));
    let hc = 'v-hanzi';
    if (word.text.length > 15) hc += ' text-xxs'; else if (word.text.length > 8) hc += ' text-xs'; else if (word.text.length > 5) hc += ' text-sm';
    let mc = 'v-meaning';
    if (word.meaning.length > 30) mc += ' text-xs'; else if (word.meaning.length > 15) mc += ' text-sm';
    row.innerHTML = `\n      <div class="vocab-info">\n        <div class="vocab-text">\n          ${word.level ? `<span class="v-badge hsk-lv">${escapeHTML(word.level)}</span>` : ''}\n          <span class="${hc}">${escapeHTML(word.text)}</span>\n        </div>\n        <div class="${mc}">${escapeHTML(word.meaning)}</div>\n        <div class="v-pinyin">${escapeHTML(word.pinyin || '')}</div>\n        <div class="srs-meta">\n          <span class="srs-pips" title="Mức nhớ ${box}/5">${'●'.repeat(box)}${'○'.repeat(5 - box)}</span>\n          <span>${isDue ? '🔴 Cần ôn' : `⏳ ${days} ngày`}</span>\n          ${word.wrongCount ? `<span>❌ sai ${word.wrongCount} lần liên tiếp</span>` : ''}\n        </div>\n      </div>\n      <div class="vocab-actions">\n        <button class="v-speak" title="Nghe">🔊</button>\n        <button class="btn-del" title="Xoá khỏi sổ tay">✕</button>\n      </div>`;
    row.querySelector('.v-speak').addEventListener('click', function() {
      if (!zhVoice) loadVoices();
      speakChinese(word.text, this);
    });
    row.querySelector('.btn-del').addEventListener('click', () => removeSRS(word.text));
    list.appendChild(row);
  });
}

function startSRSGame(onlyDue, onlyTexts) {
  onlyDue = onlyDue === true;
  const now = Date.now();
  let pool = srsWords.filter(w => w.meaning && w.meaning.trim());
  if (onlyTexts) pool = pool.filter(w => onlyTexts.includes(w.text)); else if (onlyDue) pool = pool.filter(w => w.nextReview <= now);
  if (!pool.length) {
    document.getElementById('srs-warning-modal').classList.add('active');
    return;
  }
  currentGameStarter = () => startSRSGame(onlyDue, onlyTexts);
  resetSession();
  const picked = [ ...pool ].sort((a, b) => (a.nextReview <= now ? 0 : 1) - (b.nextReview <= now ? 0 : 1) || (a.box || 1) - (b.box || 1) || (b.wrongCount || 0) - (a.wrongCount || 0) || Math.random() - .5).slice(0, 10);
  selectedQuestions = buildFromTargets(shuffle(picked), allWordsPool(), {
    h2m: 3,
    m2h: 3,
    h2p: 2,
    cloze: 2
  });
  if (!selectedQuestions.length) {
    showToast('❌ Chưa đủ dữ liệu để tạo đề');
    return;
  }
  currentIndex = 0;
  score = 0;
  answered = false;
  show('quiz-screen');
  quizResultLabel = 'Chế độ Ôn lỗi';
  document.getElementById('mode-badge').textContent = '🧠 Ôn lỗi';
  document.getElementById('mode-badge').className = 'mode-badge srs-mode';
  renderQuiz();
}

let flashItems = [], flashIdx = 0, flashFlipped = false, flashEasy = 0, flashTitle = '';

function srsTouch(item, grade) {
  if (grade === 0) {
    recordAnswer(false, item);
    return;
  }
  if (grade === 2) {
    recordAnswer(true, item);
    return;
  }
  const w = srsWords.find(x => x.text === item.text);
  if (!w) srsWords.push({
    text: item.text,
    pinyin: item.pinyin || '',
    meaning: item.meaning,
    level: item.level || '',
    wrongCount: 0,
    correctStreak: 0,
    box: 1,
    nextReview: Date.now() + 864e5
  }); else {
    w.nextReview = Date.now() + 864e5;
    w.correctStreak = 0;
  }
  safeStorage.set('cn_quiz_srs_words', srsWords);
  gainXP(3);
  updateDueBanner();
  updateHomeCard();
}

function startFlashcards(items, title) {
  if (!items.length) {
    showToast('Không có thẻ nào để ôn');
    return;
  }
  resetSession();
  flashItems = items.map(enrich);
  flashTitle = title;
  flashIdx = 0;
  flashEasy = 0;
  currentGameStarter = () => startFlashcards(items, title);
  show('flash-screen');
  renderFlash();
}

function renderFlash() {
  const it = flashItems[flashIdx];
  flashFlipped = false;
  document.getElementById('f-counter').textContent = `${flashIdx + 1} / ${flashItems.length}`;
  document.getElementById('f-progress').style.width = `${flashIdx / flashItems.length * 100}%`;
  const han = document.getElementById('fc-han');
  han.textContent = it.text;
  han.classList.toggle('long', it.text.length > 6);
  const back = document.getElementById('fc-back');
  back.classList.remove('show');
  back.innerHTML = `\n    <div class="fc-py">${escapeHTML(it.pinyin || '')}</div>\n    <div class="fc-mean">${escapeHTML(it.meaning)}</div>\n    ${it.level ? `<span class="v-badge hsk-lv">${escapeHTML(it.level)}</span>` : ''}\n    ${it.example ? `<div class="fc-ex"><div class="ex-hanzi" style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap">${escapeHTML(it.example)}<button class="v-speak fc-ex-speak" title="Đọc câu ví dụ" onclick="event.stopPropagation(); speakFlashExample()">🔊</button></div>\n      ${it.examplePinyin ? `<div class="ex-pinyin">${escapeHTML(it.examplePinyin)}</div>` : ''}\n      ${it.exampleMeaning ? `<div class="ex-meaning">${escapeHTML(it.exampleMeaning)}</div>` : ''}</div>` : ''}`;
  document.getElementById('flash-actions').classList.remove('show');
  document.getElementById('flash-hint').style.display = '';
  if (autoSpeakQ && voiceEnabled) setTimeout(speakFlash, 250);
}

function speakFlash() {
  if (!voiceEnabled) {
    showToast('🔇 Giọng đọc đang tắt trong cài đặt');
    return;
  }
  if (!zhVoice) loadVoices();
  const it = flashItems[flashIdx];
  if (it) speakChinese(it.text, document.getElementById('fc-speak'));
}

function speakFlashExample() {
  const it = flashItems[flashIdx];
  if (!it || !it.example) {
    showToast('Thẻ này không có câu ví dụ');
    return;
  }
  if (!voiceEnabled) {
    showToast('🔇 Giọng đọc đang tắt trong cài đặt');
    return;
  }
  if (!zhVoice) loadVoices();
  speakChinese(it.example, document.querySelector('#fc-back .fc-ex-speak'));
}

function flipFlash() {
  if (flashFlipped) return;
  flashFlipped = true;
  document.getElementById('fc-back').classList.add('show');
  document.getElementById('flash-actions').classList.add('show');
  document.getElementById('flash-hint').style.display = 'none';
}

function rateFlash(g) {
  if (!flashFlipped) {
    flipFlash();
    return;
  }
  srsTouch(flashItems[flashIdx], g);
  if (g === 2) flashEasy++;
  flashIdx++;
  if (flashIdx >= flashItems.length) {
    showFinal({
      score: flashEasy,
      totalText: `thẻ nhớ trên ${flashItems.length}`,
      pct: flashEasy / flashItems.length * 100,
      sub: flashTitle,
      emoji: flashEasy / flashItems.length >= .8 ? '🏆' : '🃏',
      title: 'Xong bộ thẻ!'
    });
  } else renderFlash();
}

function startSRSFlash() {
  const now = Date.now();
  const all = srsWords.filter(w => w.meaning);
  const due = all.filter(w => w.nextReview <= now);
  const src = due.length ? due : all;
  if (!src.length) {
    document.getElementById('srs-warning-modal').classList.add('active');
    return;
  }
  startFlashcards(shuffle(src).slice(0, 20).map(w => ({
    ...w
  })), due.length ? 'Ôn thẻ · từ đến hạn' : 'Ôn thẻ · sổ tay lỗi');
}

function startHSKFlash() {
  if (!hskFiltered.length) {
    showToast('Không có từ nào để học');
    return;
  }
  startFlashcards(shuffle(hskFiltered).slice(0, 20).map(w => ({
    ...w
  })), `Học thẻ ${hskLevel === 'all' ? 'HSK 1-6' : hskLabel(hskLevel)}`);
}

function calcLongestStreak() {
  const days = Object.keys(dailyStats).filter(k => dailyStats[k] && (dailyStats[k].correct || 0) + (dailyStats[k].wrong || 0) > 0).sort();
  let best = 0, cur = 0, prev = null;
  days.forEach(ds => {
    const d = new Date(ds + 'T00:00:00');
    if (prev && Math.round((d - prev) / 864e5) === 1) cur++; else cur = 1;
    best = Math.max(best, cur);
    prev = d;
  });
  return best;
}

function openStats(range, btn) {
  range = typeof range === 'number' ? range : 7;
  show('stats-screen');
  if (btn) document.querySelectorAll('#range-seg button').forEach(b => b.classList.toggle('active', b === btn));
  let tot = 0, ok = 0;
  Object.values(dailyStats).forEach(d => {
    if (d) {
      tot += (d.correct || 0) + (d.wrong || 0);
      ok += d.correct || 0;
    }
  });
  document.getElementById('stat-streak').textContent = calculateStreak();
  document.getElementById('stat-best').textContent = Math.max(calcLongestStreak(), calculateStreak());
  document.getElementById('stat-total').textContent = tot;
  document.getElementById('stat-acc').textContent = tot ? Math.round(ok / tot * 100) + '%' : '—';
  const lv = levelFromXP(xp), base = xpForLevel(lv), next = xpForLevel(lv + 1);
  document.getElementById('xp-level').textContent = `⚡ Cấp ${lv}`;
  document.getElementById('xp-text').textContent = `${xp} XP`;
  document.getElementById('xp-sub').textContent = `Còn ${next - xp} XP nữa để lên cấp ${lv + 1} · +10 XP mỗi câu đúng, combo thêm điểm`;
  const fill = document.getElementById('xp-fill');
  fill.style.width = '0';
  setTimeout(() => {
    fill.style.width = (xp - base) / (next - base) * 100 + '%';
  }, 60);
  const chart = document.getElementById('chart-container');
  chart.innerHTML = '';
  const days = [];
  let maxVal = 10;
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date;
    d.setDate(d.getDate() - i);
    const data = dailyStats[getLocalDateStr(d)] || {
      correct: 0,
      wrong: 0
    };
    days.push({
      ...data,
      label: `${d.getDate()}/${d.getMonth() + 1}`
    });
    maxVal = Math.max(maxVal, data.correct || 0, data.wrong || 0);
  }
  days.forEach((day, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'chart-bar-wrap';
    const group = document.createElement('div');
    group.style.cssText = 'display:flex;align-items:flex-end;gap:2px;width:100%;height:100%;justify-content:center;';
    const b1 = document.createElement('div');
    b1.className = 'chart-bar correct';
    b1.style.height = `${(day.correct || 0) / maxVal * 100}%`;
    b1.title = `${day.label}: ${day.correct || 0} đúng`;
    const b2 = document.createElement('div');
    b2.className = 'chart-bar wrong';
    b2.style.height = `${(day.wrong || 0) / maxVal * 100}%`;
    b2.title = `${day.label}: ${day.wrong || 0} sai`;
    group.appendChild(b1);
    group.appendChild(b2);
    const lbl = document.createElement('div');
    lbl.className = 'chart-label';
    lbl.textContent = range <= 7 || i % 5 === 0 || i === days.length - 1 ? day.label : '';
    lbl.style.fontSize = range > 7 ? '10px' : '';
    wrap.appendChild(group);
    wrap.appendChild(lbl);
    chart.appendChild(wrap);
  });
  chart.style.gap = range > 7 ? '3px' : '';
  const hm = document.getElementById('heatmap');
  hm.innerHTML = '';
  const today = new Date;
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 83);
  const pad = (start.getDay() + 6) % 7;
  const cols = Math.ceil((pad + 84) / 7);
  hm.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  for (let i = 0; i < pad; i++) {
    const c = document.createElement('div');
    c.className = 'hm-cell blank';
    hm.appendChild(c);
  }
  for (let i = 0; i < 84; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const rec = dailyStats[getLocalDateStr(d)];
    const n = rec ? (rec.correct || 0) + (rec.wrong || 0) : 0;
    const c = document.createElement('div');
    c.className = 'hm-cell' + (n === 0 ? '' : n < dailyGoal * .5 ? ' l1' : n < dailyGoal ? ' l2' : n < dailyGoal * 2 ? ' l3' : ' l4');
    c.title = `${d.getDate()}/${d.getMonth() + 1}: ${n} câu`;
    hm.appendChild(c);
  }
  const ever = safeStorage.get('cn_quiz_hsk_ever') || {};
  let html = '';
  if (!hskAll.length) html = '<div class="dict-empty">Chưa có dữ liệu HSK1.js … HSK6.js (trong thư mục Model)</div>'; else for (let i = 1; i <= 6; i++) {
    const L = 'HSK' + i, total = hskPool(L).length, seen = Math.min((ever[L] || []).length, total), st = levelStats[L];
    const acc = st && st.c + st.w ? Math.round(st.c / (st.c + st.w) * 100) + '% đúng' : 'chưa làm';
    html += `<div class="prog-row"><div class="prog-top"><span>HSK ${i}</span><span>${seen}/${total} từ đã gặp · ${acc}</span></div>\n      <div class="prog-track"><div class="prog-fill" style="width:${total ? seen / total * 100 : 0}%"></div></div></div>`;
  }
  document.getElementById('hsk-progress').innerHTML = html;
  const counts = [ 0, 0, 0, 0, 0 ];
  srsWords.forEach(w => counts[Math.max(1, Math.min(5, w.box || 1)) - 1]++);
  const mx = Math.max(1, ...counts), names = [ 'Mới sai', 'Đang học', 'Khá nhớ', 'Nhớ tốt', 'Đã thuộc' ];
  document.getElementById('srs-dist').innerHTML = srsWords.length ? counts.map((c, i) => `<div class="prog-row"><div class="prog-top"><span>${'●'.repeat(i + 1)} ${names[i]}</span><span>${c} từ</span></div>\n        <div class="prog-track"><div class="prog-fill box${i + 1}" style="width:${c / mx * 100}%"></div></div></div>`).join('') : '<div class="dict-empty">Chưa có từ nào trong sổ tay lỗi 🎉</div>';
  const weak = [ ...srsWords ].filter(w => (w.wrongCount || 0) > 0).sort((a, b) => (b.wrongCount || 0) - (a.wrongCount || 0)).slice(0, 5);
  const wl = document.getElementById('weak-list');
  wl.innerHTML = '';
  if (!weak.length) wl.innerHTML = '<div class="dict-empty">Chưa có từ nào hay sai.</div>';
  weak.forEach(w => {
    const r = document.createElement('div');
    r.className = 'review-row';
    r.innerHTML = `<span class="rr-han">${escapeHTML(w.text)}</span><div class="rr-info"><div class="rr-py">${escapeHTML(w.pinyin || '')}</div><div class="rr-mean">${escapeHTML(w.meaning)}</div></div><span class="chip">❌ ${w.wrongCount}</span><button class="v-speak">🔊</button>`;
    r.querySelector('.v-speak').addEventListener('click', function() {
      if (!zhVoice) loadVoices();
      speakChinese(w.text, this);
    });
    wl.appendChild(r);
  });
}

function handleGameKeys(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;
  if (document.querySelector('.modal-time-overlay.active')) return;
  const vis = id => document.getElementById(id).style.display === 'block';
  const k = e.key;
  const idx = '1234'.includes(k) && k.length === 1 ? Number(k) - 1 : 'abcd'.includes(k.toLowerCase()) && k.length === 1 ? k.toLowerCase().charCodeAt(0) - 97 : -1;
  if (vis('quiz-screen')) {
    if (idx >= 0) {
      const b = document.querySelectorAll('#options-grid .option-btn')[idx];
      if (b && !b.disabled) {
        e.preventDefault();
        b.click();
      }
    } else if ((k === 'Enter' || k === ' ' || k === 'ArrowRight') && answered) {
      e.preventDefault();
      nextQuestion();
    } else if (k.toLowerCase() === 'r' || k.toLowerCase() === 'l') speakCurrentQuestion();
  } else if (vis('match-screen')) {
    if ((k === 'Enter' || k === ' ') && document.getElementById('m-next').classList.contains('visible')) {
      e.preventDefault();
      nextMatchRound();
    }
  } else if (vis('flash-screen')) {
    if (k === ' ' || k === 'Enter') {
      e.preventDefault();
      flashFlipped ? null : flipFlash();
    } else if (flashFlipped && '123'.includes(k) && k.length === 1) rateFlash(Number(k) - 1); else if (k.toLowerCase() === 'r') speakFlash();
  } else if (vis('result-screen')) {
    if (k === 'Enter' && tag !== 'button') restartCurrentGame();
  }
}

window.addEventListener('load', () => {
  if (ttsSupported) {
    loadVoices();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = loadVoices;
    setTimeout(loadVoices, 200);
  }
  updateDueBanner();
  updateHomeCard();
  syncSegs();
  const savedTheme = safeStorage.get('cn_quiz_theme');
  if ([ 'neon', 'sakura', 'light' ].includes(savedTheme)) document.documentElement.setAttribute('data-skin', savedTheme);
  document.querySelectorAll('.mode-card').forEach(el => attachSpotlight(el, {
    tilt: true
  }));
  document.querySelectorAll('.btn-feature, .btn-vocab').forEach(el => attachSpotlight(el));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const open = document.querySelectorAll('.modal-time-overlay.active');
      if (open.length) {
        open.forEach(m => m.classList.remove('active'));
        isPaused = false;
        return;
      }
      if ([ 'quiz-screen', 'listen-screen', 'match-screen' ].some(id => document.getElementById(id).style.display === 'block')) togglePause(true);
    }
  });
  document.addEventListener('keydown', handleGameKeys);
  const music = document.getElementById('bg-music');
  if (music) {
    music.volume = musicVolume;
    if (musicTrack > 1) music.src = MUSIC_DIR + '/music' + musicTrack + '.mp3'; else if (musicTrack === 0) music.src = 'music.mp3';
    music.addEventListener('error', () => {
      console.warn('⚠️ Không tải được ' + (music.getAttribute('src') || 'nhạc nền') + ' (bỏ qua)');
    });
  }
  updateMusicLabel();
  initMusicAutoplay();
});

let listenQuestions = [];

let listenIndex = 0;

let listenScore = 0;

let listenAnswered = false;

function renderListen() {
  const q = listenQuestions[listenIndex];
  if (!q) {
    finishListen();
    return;
  }
  document.getElementById('l-counter').textContent = `CÂU ${listenIndex + 1} / ${listenQuestions.length}`;
  document.getElementById('l-score').textContent = `⭐ ${listenScore}`;
  document.getElementById('l-progress').style.width = `${listenIndex / listenQuestions.length * 100}%`;
  const grid = document.getElementById('l-options');
  grid.innerHTML = '';
  q.options.arr.forEach((ans, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'option-wrap';
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `\n      <span class="option-label">${String.fromCharCode(65 + i)}</span>\n      <span class="option-text">${escapeHTML(ans)}</span>\n    `;
    wireOptButtons(btn, () => selectListenAnswer(i, btn));
    wrap.appendChild(btn);
    grid.appendChild(wrap);
  });
  document.getElementById('l-feedback').className = 'feedback-msg';
  document.getElementById('l-feedback').textContent = '';
  document.getElementById('l-next').classList.remove('visible');
  listenAnswered = false;
  document.getElementById('l-num').textContent = q.isSentence ? 'Nghe cả câu — chọn nghĩa đúng' : 'Bấm để nghe âm thanh';
  renderReveal('l-reveal', null);
  updateComboChip();
  startQTimer(listenTimeout);
  if (autoPlayListen && voiceEnabled) setTimeout(() => {
    if (!listenAnswered) playListenAudio();
  }, 350);
}

function playListenAudio() {
  if (!voiceEnabled) {
    showToast('🔇 Giọng đọc đang tắt trong cài đặt');
    return;
  }
  if (!zhVoice) loadVoices();
  const q = listenQuestions[listenIndex];
  if (!q) return;
  speakChinese(q.target.text, document.getElementById('l-speak-btn'));
}

function nextListenQuestion() {
  if (!listenAnswered) return;
  listenIndex++;
  if (listenIndex >= listenQuestions.length) {
    finishListen();
    return;
  }
  renderListen();
}

let listenLabel = 'Chế độ Nghe đoán';

function makeListenQ(t, pool, isSent) {
  const d = pickDistractors(t, pool, c => c.meaning, 3, isSent ? (a, c) => lenRatio(a.meaning.length, c.meaning.length) + Math.random() * 3 : simMeaning, {
    noConflict: isSent,
    filter: c => rawKey(c.pinyin) !== rawKey(t.pinyin)
  });
  if (d.length < 3) return null;
  const arr = shuffle([ t.meaning, ...d ]);
  return {
    target: t,
    isSentence: isSent,
    options: {
      arr: arr,
      correct: arr.indexOf(t.meaning)
    }
  };
}

function startListenGame() {
  currentGameStarter = startListenGame;
  listenLabel = 'Chế độ Nghe đoán';
  const words = validWords(), sents = validSents();
  if (!words.length && !sents.length) {
    alert('Cần dữ liệu có chữ Hán!');
    return;
  }
  resetSession();
  const nS = sents.length >= 4 ? 2 : 0;
  let list = words.length >= 4 ? pickTargets(words, 'dict', 10 - nS).map(t => makeListenQ(t, words, false)).filter(Boolean) : [];
  if (nS) list = list.concat(pickTargets(sents, 'dictsent', nS).map(t => makeListenQ(t, sents, true)).filter(Boolean));
  if (!list.length && sents.length >= 4) list = pickTargets(sents, 'dictsent', 10).map(t => makeListenQ(t, sents, true)).filter(Boolean);
  if (!list.length) {
    alert('Chưa đủ dữ liệu để tạo đề (cần ít nhất 4 từ).');
    return;
  }
  listenQuestions = shuffle(list);
  listenIndex = 0;
  listenScore = 0;
  listenAnswered = false;
  show('listen-screen');
  renderListen();
}

function selectListenAnswer(idx, btn) {
  if (listenAnswered) return;
  listenAnswered = true;
  stopQTimer();
  clearOptHighlight();
  const q = listenQuestions[listenIndex];
  const isCorrect = idx === q.options.correct;
  document.querySelectorAll('#l-options .option-btn').forEach(b => b.disabled = true);
  if (isCorrect) {
    btn.classList.add('correct');
    listenScore++;
    playSound('correct');
    document.getElementById('l-feedback').textContent = comboCount >= 2 ? `✅ Chính xác! Combo x${comboCount + 1} 🔥` : '✅ Chính xác!';
    document.getElementById('l-feedback').className = 'feedback-msg show correct-msg';
    recordAnswer(true, q.target);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('#l-options .option-btn')[q.options.correct].classList.add('correct');
    playSound('wrong');
    document.getElementById('l-feedback').textContent = `❌ Sai! Đáp án: ${q.options.arr[q.options.correct]}`;
    document.getElementById('l-feedback').className = 'feedback-msg show wrong-msg';
    recordAnswer(false, q.target);
  }
  document.getElementById('l-score').textContent = `⭐ ${listenScore}`;
  renderReveal('l-reveal', q.target);
  document.getElementById('l-next').classList.add('visible');
  finishAnswerUI('l');
}

function listenTimeout() {
  if (listenAnswered) return;
  listenAnswered = true;
  const q = listenQuestions[listenIndex];
  document.querySelectorAll('#l-options .option-btn').forEach(b => b.disabled = true);
  document.querySelectorAll('#l-options .option-btn')[q.options.correct].classList.add('correct');
  playSound('wrong');
  document.getElementById('l-feedback').textContent = `⏰ Hết giờ! Đáp án: ${q.options.arr[q.options.correct]}`;
  document.getElementById('l-feedback').className = 'feedback-msg show wrong-msg';
  recordAnswer(false, q.target);
  renderReveal('l-reveal', q.target);
  document.getElementById('l-next').classList.add('visible');
  finishAnswerUI('l');
}

function finishListen() {
  showFinal({
    score: listenScore,
    totalText: `trên ${listenQuestions.length} câu`,
    pct: listenScore / listenQuestions.length * 100,
    sub: listenLabel
  });
}

function handleListenKeys(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;
  if (document.querySelector('.modal-time-overlay.active')) return;
  const vis = id => document.getElementById(id).style.display === 'block';
  if (!vis('listen-screen')) return;
  const k = e.key;
  const idx = '1234'.includes(k) && k.length === 1 ? Number(k) - 1 : 'abcd'.includes(k.toLowerCase()) && k.length === 1 ? k.toLowerCase().charCodeAt(0) - 97 : -1;
  if (idx >= 0) {
    const b = document.querySelectorAll('#l-options .option-btn')[idx];
    if (b && !b.disabled) {
      e.preventDefault();
      b.click();
    }
  } else if ((k === 'Enter' || k === ' ' || k === 'ArrowRight') && listenAnswered) {
    e.preventDefault();
    nextListenQuestion();
  } else if (k.toLowerCase() === 'r' || k.toLowerCase() === 'l' || k === ' ' && !listenAnswered) {
    e.preventDefault();
    playListenAudio();
  }
}

window.addEventListener('load', () => {
  document.addEventListener('keydown', handleListenKeys);
});

(function() {
  const root = document.documentElement;
  const FitScale = {
    s: 1,
    W: 390,
    H: 700
  };
  let lastW = 0, lastH = 0;
  function typing() {
    const a = document.activeElement;
    return !!a && /^(INPUT|TEXTAREA)$/.test(a.tagName);
  }
  function apply() {
    const vw = window.innerWidth, vh = window.innerHeight;
    if (lastW && typing() && vw === lastW && vh < lastH) return;
    lastW = vw;
    lastH = vh;
    const s = Math.max(.5, Math.min(vw / 390, vh / 700, 2.4));
    const W = Math.min(vw / s, 560), H = vh / s;
    Object.assign(FitScale, {
      s: s,
      W: W,
      H: H
    });
    root.style.setProperty('--s', s.toFixed(4));
    root.style.setProperty('--W', W.toFixed(2) + 'px');
    root.style.setProperty('--H', H.toFixed(2) + 'px');
    root.style.setProperty('--hu', (H / 100).toFixed(4) + 'px');
    root.classList.toggle('fit-short', H <= 680);
  }
  function mount() {
    const c = document.querySelector('.container');
    if (c) document.querySelectorAll('.top-bar,.corner-data').forEach(e => {
      if (e.parentNode !== c) c.appendChild(e);
    });
  }
  apply();
  window.FitScale = FitScale;
  window.addEventListener('resize', apply);
  window.addEventListener('orientationchange', () => setTimeout(apply, 120));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();

(function() {
  'use strict';
  const N = 64, BOX = 54, PAD = (N - BOX) / 2;
  const CFG = {
    fonts: [ '"KaiTi","STKaiti","Kaiti SC","AR PL UKai CN","BiauKai"', '"PingFang SC","Microsoft YaHei","Noto Sans CJK SC","Noto Sans SC","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif', '"SimSun","Songti SC","Noto Serif CJK SC","Noto Serif SC","STSong",serif' ],
    dataUrl: 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/',
    useStrokeData: true,
    m0: 2.2,
    tol: 1.3,
    pass: 80,
    rivalMin: 88,
    rivalGap: 15,
    noteMin: 72,
    noteGap: 12,
    maxCandidates: 40
  };
  const LS_PREFIX = 'cn_hw_';
  const cache = {
    font: new Map,
    data: new Map,
    dt: new Map
  };
  function mkCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h || w;
    return c;
  }
  function distTransform(grid) {
    const INF = 1e9, d = new Float32Array(N * N);
    for (let i = 0; i < N * N; i++) d[i] = grid[i] ? 0 : INF;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const i = y * N + x;
      let v = d[i];
      if (x > 0) v = Math.min(v, d[i - 1] + 3);
      if (y > 0) {
        v = Math.min(v, d[i - N] + 3);
        if (x > 0) v = Math.min(v, d[i - N - 1] + 4);
        if (x < N - 1) v = Math.min(v, d[i - N + 1] + 4);
      }
      d[i] = v;
    }
    for (let y = N - 1; y >= 0; y--) for (let x = N - 1; x >= 0; x--) {
      const i = y * N + x;
      let v = d[i];
      if (x < N - 1) v = Math.min(v, d[i + 1] + 3);
      if (y < N - 1) {
        v = Math.min(v, d[i + N] + 3);
        if (x < N - 1) v = Math.min(v, d[i + N + 1] + 4);
        if (x > 0) v = Math.min(v, d[i + N - 1] + 4);
      }
      d[i] = v;
    }
    for (let i = 0; i < N * N; i++) d[i] /= 3;
    return d;
  }
  function gridOf(pts) {
    const g = new Uint8Array(N * N);
    pts.forEach(p => {
      const x = Math.round(p[0]), y = Math.round(p[1]);
      if (x >= 0 && y >= 0 && x < N && y < N) g[y * N + x] = 1;
    });
    return g;
  }
  function normalize(pts) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach(p => {
      x0 = Math.min(x0, p[0]);
      y0 = Math.min(y0, p[1]);
      x1 = Math.max(x1, p[0]);
      y1 = Math.max(y1, p[1]);
    });
    const w = x1 - x0, h = y1 - y0, s = BOX / Math.max(w, h, 1e-6);
    const ox = PAD + (BOX - w * s) / 2, oy = PAD + (BOX - h * s) / 2;
    return pts.map(p => [ (p[0] - x0) * s + ox, (p[1] - y0) * s + oy ]);
  }
  function densify(strokes, step) {
    const out = [];
    strokes.forEach(st => {
      const P = st.map(p => Array.isArray(p) ? p : [ p.x, p.y ]);
      if (P.length === 1) out.push(P[0]);
      for (let i = 1; i < P.length; i++) {
        const a = P[i - 1], b = P[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / step));
        for (let j = 0; j <= k; j++) out.push([ a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k ]);
      }
    });
    return out;
  }
  function thin(img, W, H) {
    let changed = true, guard = 0;
    const get = (x, y) => x < 0 || y < 0 || x >= W || y >= H ? 0 : img[y * W + x];
    while (changed && guard++ < 40) {
      changed = false;
      for (let pass = 0; pass < 2; pass++) {
        const del = [];
        for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
          if (!img[y * W + x]) continue;
          const p2 = get(x, y - 1), p3 = get(x + 1, y - 1), p4 = get(x + 1, y), p5 = get(x + 1, y + 1), p6 = get(x, y + 1), p7 = get(x - 1, y + 1), p8 = get(x - 1, y), p9 = get(x - 1, y - 1);
          const B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
          if (B < 2 || B > 6) continue;
          const seq = [ p2, p3, p4, p5, p6, p7, p8, p9, p2 ];
          let A = 0;
          for (let i = 0; i < 8; i++) if (!seq[i] && seq[i + 1]) A++;
          if (A !== 1) continue;
          if (pass === 0) {
            if (p2 * p4 * p6 || p4 * p6 * p8) continue;
          } else {
            if (p2 * p4 * p8 || p2 * p6 * p8) continue;
          }
          del.push(y * W + x);
        }
        if (del.length) {
          changed = true;
          del.forEach(i => img[i] = 0);
        }
      }
    }
    return img;
  }
  function fontInk(ch, fam) {
    const S = 160, c = mkCanvas(S), g = c.getContext('2d', {
      willReadFrequently: true
    });
    g.fillStyle = '#fff';
    g.fillRect(0, 0, S, S);
    g.fillStyle = '#000';
    g.font = '120px ' + fam;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(ch, S / 2, S / 2 + 6);
    const d = g.getImageData(0, 0, S, S).data, img = new Uint8Array(S * S);
    let n = 0;
    for (let i = 0; i < S * S; i++) if (d[i * 4] < 128) {
      img[i] = 1;
      n++;
    }
    return {
      img: img,
      n: n,
      S: S
    };
  }
  function fontVariant(ch, fam) {
    const f = fontInk(ch, fam);
    if (f.n < 40) return null;
    const ref = fontInk('', fam);
    if (ref.n > 0 && Math.abs(ref.n - f.n) < 4) {
      let same = 0;
      for (let i = 0; i < f.img.length; i++) if (f.img[i] === ref.img[i]) same++;
      if (same > f.img.length * .999) return null;
    }
    thin(f.img, f.S, f.S);
    const pts = [];
    for (let y = 0; y < f.S; y++) for (let x = 0; x < f.S; x++) if (f.img[y * f.S + x]) pts.push([ x, y ]);
    if (pts.length < 5) return null;
    return {
      pts: normalize(pts),
      source: 'font'
    };
  }
  function fontTargets(ch) {
    if (cache.font.has(ch)) return cache.font.get(ch);
    const out = [], seen = new Set;
    (CFG.fonts || []).forEach(fam => {
      let v = null;
      try {
        v = fontVariant(ch, fam);
      } catch (e) {}
      if (!v) return;
      let sx = 0, sy = 0;
      v.pts.forEach(p => {
        sx += p[0];
        sy += p[1];
      });
      const key = v.pts.length + ':' + Math.round(sx) + ':' + Math.round(sy);
      if (!seen.has(key)) {
        seen.add(key);
        out.push(v);
      }
    });
    if (!out.length) {
      const e = new Error('Thiết bị chưa có font tiếng Trung để chấm chữ "' + ch + '".');
      e.code = 'no-font';
      throw e;
    }
    cache.font.set(ch, out);
    return out;
  }
  function fontTarget(ch) {
    return fontTargets(ch)[0];
  }
  async function getStrokeData(ch) {
    if (!CFG.useStrokeData) return null;
    if (cache.data.has(ch)) return cache.data.get(ch);
    let res = null;
    try {
      const raw = localStorage.getItem(LS_PREFIX + ch);
      if (raw) {
        const j = JSON.parse(raw);
        if (j && j.strokes && j.medians) {
          cache.data.set(ch, j);
          return j;
        }
      }
    } catch (e) {}
    try {
      const ctl = typeof AbortController !== 'undefined' ? new AbortController : null;
      const to = setTimeout(() => ctl && ctl.abort(), 4e3);
      const r = await fetch(CFG.dataUrl + encodeURIComponent(ch) + '.json', ctl ? {
        signal: ctl.signal
      } : undefined);
      clearTimeout(to);
      if (r.ok) {
        const j = await r.json();
        if (j && j.strokes && j.medians && j.strokes.length === j.medians.length) {
          res = j;
          try {
            localStorage.setItem(LS_PREFIX + ch, JSON.stringify({
              strokes: j.strokes,
              medians: j.medians
            }));
          } catch (e) {}
        }
      }
    } catch (e) {
      res = null;
    }
    if (res) cache.data.set(ch, res);
    return res;
  }
  function prefetch(chars) {
    [ ...new Set([ ...chars || '' ].filter(c => /[一-鿿]/.test(c))) ].slice(0, 40).forEach(c => {
      getStrokeData(c).catch(() => {});
    });
  }
  function medianTarget(j) {
    const strokes = j.medians.map(m => m.map(p => [ p[0], 900 - p[1] ]));
    return {
      pts: normalize(densify(strokes, 12)),
      source: 'strokes',
      strokeCount: strokes.length,
      medians: j.medians
    };
  }
  async function getTargets(ch) {
    const j = await getStrokeData(ch);
    const v = [];
    if (j) v.push(medianTarget(j));
    try {
      fontTargets(ch).forEach(t => v.push(t));
    } catch (e) {
      if (!v.length) throw e;
    }
    return v;
  }
  async function getTarget(ch) {
    return (await getTargets(ch))[0];
  }
  function dtOf(ch, t, i) {
    const k = ch + '|' + t.source + '|' + i;
    if (!cache.dt.has(k)) cache.dt.set(k, distTransform(gridOf(t.pts)));
    return cache.dt.get(k);
  }
  function meanTo(pts, dt) {
    let s = 0, n = 0;
    for (const p of pts) {
      const x = Math.min(N - 1, Math.max(0, Math.round(p[0]))), y = Math.min(N - 1, Math.max(0, Math.round(p[1])));
      s += Math.max(0, Math.min(dt[y * N + x], 14) - CFG.tol);
      n++;
    }
    return n ? s / n : 14;
  }
  function bbox(pts) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach(p => {
      x0 = Math.min(x0, p[0]);
      y0 = Math.min(y0, p[1]);
      x1 = Math.max(x1, p[0]);
      y1 = Math.max(y1, p[1]);
    });
    return [ x0, y0, x1, y1 ];
  }
  function fitTo(dense, tb) {
    const ub = bbox(dense), uw = ub[2] - ub[0], uh = ub[3] - ub[1], tw = tb[2] - tb[0], th = tb[3] - tb[1];
    if (uw < 1 || uh < 1 || tw < 3 || th < 3) return null;
    const ra = uw / uh / (tw / th);
    if (ra < .55 || ra > 1.8) return null;
    return dense.map(p => [ (p[0] - ub[0]) * tw / uw + tb[0], (p[1] - ub[1]) * th / uh + tb[1] ]);
  }
  function alignScore(U, tgt, tdt, full) {
    const sc = full ? [ .92, 1, 1.08 ] : [ 1 ], sh = full ? [ -2.5, 0, 2.5 ] : [ 0 ];
    let best = 1e9;
    for (const sx of sc) for (const sy of sc) for (const dx of sh) for (const dy of sh) {
      const P = sx === 1 && sy === 1 && !dx && !dy ? U : U.map(p => [ (p[0] - 32) * sx + 32 + dx, (p[1] - 32) * sy + 32 + dy ]);
      const d1 = meanTo(P, tdt), d2 = meanTo(tgt.pts, distTransform(gridOf(P)));
      const m = (d1 + d2) / 2 + .3 * Math.abs(d1 - d2) + .15 * (Math.abs(Math.log(sx)) + Math.abs(Math.log(sy))) * 10 + .08 * (Math.abs(dx) + Math.abs(dy));
      if (m < best) best = m;
    }
    return best;
  }
  const toPct = m => Math.round(100 / (1 + Math.pow(m / CFG.m0, 2.4)));
  function scoreChar(dense, ch, variants, full) {
    const A = normalize(dense);
    let best = 1e9;
    variants.forEach((t, i) => {
      const tdt = dtOf(ch, t, i), B = fitTo(dense, bbox(t.pts));
      best = Math.min(best, alignScore(A, t, tdt, full));
      if (B) best = Math.min(best, alignScore(B, t, tdt, full));
    });
    return toPct(best);
  }
  function resample(P, k) {
    const d = [ 0 ];
    for (let i = 1; i < P.length; i++) d.push(d[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const L = d[d.length - 1], out = [];
    if (L < 1e-6) {
      for (let i = 0; i < k; i++) out.push(P[0]);
      return {
        pts: out,
        len: 0
      };
    }
    for (let i = 0; i < k; i++) {
      const t = L * i / (k - 1);
      let j = 1;
      while (j < d.length - 1 && d[j] < t) j++;
      const u = (t - d[j - 1]) / (d[j] - d[j - 1] || 1);
      out.push([ P[j - 1][0] + (P[j][0] - P[j - 1][0]) * u, P[j - 1][1] + (P[j][1] - P[j - 1][1]) * u ]);
    }
    return {
      pts: out,
      len: L
    };
  }
  const meanD = (A, B) => {
    let t = 0;
    for (let i = 0; i < A.length; i++) t += Math.hypot(A[i][0] - B[i][0], A[i][1] - B[i][1]);
    return t / A.length;
  };
  function strokeName(pts, short) {
    if (short) return 'chấm (丶)';
    const a = pts[0], b = pts[pts.length - 1], ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    if (Math.abs(ang) <= 25) return 'ngang (一)';
    if (ang > 25 && ang <= 65) return 'mác (㇏, xuống phải)';
    if (ang > 65 && ang <= 115) return 'sổ (丨)';
    if (ang > 115 && ang <= 170) return 'phẩy (丿, xuống trái)';
    if (ang < -25 && ang >= -65) return 'hất (㇀, lên phải)';
    if (ang < -65 && ang >= -115) return 'sổ ngược (lên)';
    return 'ngang ngược (sang trái)';
  }
  function dirWords(pts) {
    const a = pts[0], b = pts[pts.length - 1], dx = b[0] - a[0], dy = b[1] - a[1];
    const h = Math.abs(dx) > Math.abs(dy) * .4 ? dx > 0 ? 'trái sang phải' : 'phải sang trái' : '';
    const v = Math.abs(dy) > Math.abs(dx) * .4 ? dy > 0 ? 'trên xuống dưới' : 'dưới lên trên' : '';
    return [ v, h ].filter(Boolean).join(' và ') || 'đúng chiều chuẩn';
  }
  function analyzeStrokes(real, medians) {
    const n = medians.length, m = real.length;
    if (!n || n !== m) return {
      checked: false,
      reason: 'count',
      issues: []
    };
    const M = medians.map(s => s.map(p => [ p[0], 900 - p[1] ]));
    const U0 = real.map(s => s.map(p => [ p.x, p.y ]));
    const mb = bbox(M.flat()), ub = bbox(U0.flat());
    const mw = mb[2] - mb[0], mh = mb[3] - mb[1], uw = ub[2] - ub[0], uh = ub[3] - ub[1], S = Math.max(mw, mh, 1);
    const sc = S / Math.max(uw, uh, 1e-6);
    const ox = (mb[0] + mb[2]) / 2 - (ub[0] + ub[2]) / 2 * sc, oy = (mb[1] + mb[3]) / 2 - (ub[1] + ub[3]) / 2 * sc;
    const U = U0.map(s => s.map(p => [ p[0] * sc + ox, p[1] * sc + oy ]));
    const K = 12, ur = U.map(s => resample(s, K)), mr = M.map(s => resample(s, K));
    const fwd = [], rev = [];
    for (let i = 0; i < n; i++) {
      fwd.push([]);
      rev.push([]);
      for (let j = 0; j < n; j++) {
        fwd[i].push(meanD(ur[i].pts, mr[j].pts) / S);
        rev[i].push(meanD(ur[i].pts.slice().reverse(), mr[j].pts) / S);
      }
    }
    const cost = (i, j) => Math.min(fwd[i][j], rev[i][j]);
    const pairs = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) pairs.push([ cost(i, j), i, j ]);
    pairs.sort((a, b) => a[0] - b[0]);
    const match = new Array(n).fill(-1), used = new Array(n).fill(false);
    pairs.forEach(([c, i, j]) => {
      if (match[i] < 0 && !used[j]) {
        match[i] = j;
        used[j] = true;
      }
    });
    const issues = [], isShort = j => mr[j].len < S * .12;
    const bad = [];
    for (let i = 0; i < n; i++) {
      const j = match[i];
      if (j !== i && cost(i, j) < .2 && cost(i, i) - cost(i, j) > .05) bad.push([ i, j ]);
    }
    for (let k = bad.length - 1; k >= 0; k--) if (match[bad[k][1]] === bad[k][0] && bad[k][1] < bad[k][0]) bad.splice(k, 1);
    if (bad.length) {
      const [i, j] = bad[0];
      issues.push({
        type: 'order',
        stroke: i + 1,
        msg: `Thứ tự nét: nét thứ ${i + 1} phải là nét ${strokeName(mr[i].pts, isShort(i))}, nhưng bạn viết nét ${strokeName(mr[j].pts, isShort(j))} (đúng ra là nét thứ ${j + 1}).` + (bad.length > 1 ? ' Còn vài nét khác cũng sai thứ tự — xem “Thứ tự nét”.' : '')
      });
    }
    if (!bad.length) for (let i = 0; i < n; i++) {
      if (isShort(i) || cost(i, i) > .2) continue;
      if (rev[i][i] < fwd[i][i] * .7 && fwd[i][i] - rev[i][i] > .04) issues.push({
        type: 'dir',
        stroke: i + 1,
        msg: `Hướng nét: nét thứ ${i + 1} (${strokeName(mr[i].pts, false)}) bạn viết ngược chiều — phải viết từ ${dirWords(mr[i].pts)}.`
      });
    }
    return {
      checked: true,
      issues: issues.slice(0, 3),
      match: match
    };
  }
  async function recognize(strokes, ch, candidates) {
    const real = (strokes || []).filter(s => s && s.length);
    if (!real.length) return {
      ok: false,
      error: 'empty',
      message: 'Chưa có nét nào.'
    };
    const dense = densify(real, 1);
    const ext = bbox(dense);
    if (Math.max(ext[2] - ext[0], ext[3] - ext[1]) < 12) return {
      ok: false,
      error: 'tiny',
      message: 'Nét quá nhỏ — hãy viết to hơn.'
    };
    let tv;
    try {
      tv = await getTargets(ch);
    } catch (e) {
      return {
        ok: false,
        error: e.code || 'target',
        message: e.message
      };
    }
    const pct = scoreChar(dense, ch, tv, true), meCoarse = scoreChar(dense, ch, tv, false);
    let best = {
      ch: ch,
      pct: meCoarse
    }, rank = 1, cands = 0;
    const list = (candidates || []).filter(c => c && c !== ch).slice(0, CFG.maxCandidates);
    for (const c of list) {
      let v2;
      try {
        v2 = fontTargets(c);
      } catch (e) {
        continue;
      }
      const sc = scoreChar(dense, c, v2, false);
      cands++;
      if (sc > meCoarse) rank++;
      if (sc > best.pct) best = {
        ch: c,
        pct: sc
      };
    }
    const rivalStrong = best.ch !== ch && best.pct >= CFG.rivalMin && best.pct - meCoarse >= CFG.rivalGap;
    const pass = pct >= CFG.pass && !rivalStrong;
    let note = '';
    if (best.ch !== ch && best.pct >= CFG.noteMin && best.pct - meCoarse >= CFG.noteGap) note = 'Nét của bạn khớp với chữ "' + best.ch + '" hơn (' + best.pct + '%).';
    const first = tv[0], strokeInfo = first.source === 'strokes' ? {
      expected: first.strokeCount,
      got: real.length
    } : null;
    let strokeCheck = null;
    if (first.source === 'strokes' && first.medians) {
      try {
        strokeCheck = analyzeStrokes(real, first.medians);
      } catch (e) {
        strokeCheck = null;
      }
    }
    return {
      ok: true,
      percent: pct,
      pass: pass,
      rank: rank,
      candidates: cands,
      best: best,
      source: first.source,
      strokeInfo: strokeInfo,
      strokeCheck: strokeCheck,
      note: note
    };
  }
  window.HanziRecognizer = {
    name: 'chamfer-shape-v2',
    recognize: recognize,
    getStrokeData: getStrokeData,
    prefetch: prefetch,
    analyzeStrokes: analyzeStrokes,
    getTarget: getTarget,
    config: CFG,
    _internals: {
      normalize: normalize,
      densify: densify,
      fontTarget: fontTarget,
      fontTargets: fontTargets,
      N: N,
      cache: cache
    }
  };
})();

(function() {
  'use strict';
  const K = {
    mode: 'cn_quiz_mode_stats',
    time: 'cn_quiz_mode_time',
    claims: 'cn_quiz_xp_claims',
    mist: 'cn_quiz_mistakes'
  };
  const today = () => getLocalDateStr();
  const SC = window.StudyCore = {};
  const load = (k, d) => {
    const v = safeStorage.get(k);
    return v == null ? d : v;
  };
  let modeStats = load(K.mode, {});
  let timeStats = load(K.time, {});
  let claims = load(K.claims, {
    date: today(),
    keys: []
  });
  let mist = load(K.mist, []);
  if (!Array.isArray(mist)) mist = [];
  if (!claims || claims.date !== today()) claims = {
    date: today(),
    keys: []
  };
  SC.bump = function(mode, field, n) {
    const m = modeStats[mode] || (modeStats[mode] = {});
    m[field] = (m[field] || 0) + (n || 1);
    safeStorage.set(K.mode, modeStats);
  };
  SC.getModeStats = () => modeStats;
  SC.awardOnce = function(key) {
    if (claims.date !== today()) claims = {
      date: today(),
      keys: []
    };
    if (claims.keys.includes(key)) return false;
    claims.keys.push(key);
    if (claims.keys.length > 3e3) claims.keys = claims.keys.slice(-3e3);
    safeStorage.set(K.claims, claims);
    return true;
  };
  SC.record = function(mode, key, ok, item, statFields) {
    const first = SC.awardOnce(mode + ':' + key);
    if (!first) return {
      counted: false
    };
    recordAnswer(ok, item, {
      noSRS: true,
      tag: mode
    });
    (statFields || []).forEach(f => SC.bump(mode, f));
    return {
      counted: true
    };
  };
  const INTERVALS = {
    1: 1,
    2: 3,
    3: 7,
    4: 14,
    5: 30
  };
  SC.mistakes = kind => mist.filter(m => !kind || m.kind === kind);
  SC.mistakeWrong = function(kind, id, data) {
    let m = mist.find(x => x.id === kind + ':' + id);
    if (!m) {
      m = Object.assign({
        id: kind + ':' + id,
        kind: kind,
        wrongCount: 0,
        box: 1,
        correctStreak: 0,
        added: Date.now()
      }, data);
      mist.push(m);
    } else Object.assign(m, data);
    m.wrongCount = (m.wrongCount || 0) + 1;
    m.correctStreak = 0;
    m.box = 1;
    m.nextReview = Date.now();
    m.lastWrong = Date.now();
    safeStorage.set(K.mist, mist);
  };
  SC.mistakeRight = function(kind, id) {
    const m = mist.find(x => x.id === kind + ':' + id);
    if (!m) return;
    m.correctStreak = (m.correctStreak || 0) + 1;
    m.box = Math.min(5, (m.box || 1) + 1);
    m.nextReview = Date.now() + INTERVALS[m.box] * 864e5;
    safeStorage.set(K.mist, mist);
  };
  SC.mistakeRemove = function(id) {
    mist = mist.filter(m => m.id !== id);
    safeStorage.set(K.mist, mist);
  };
  const SCREEN_MODE = {
    'quiz-screen': 'quiz',
    'listen-screen': 'quiz',
    'match-screen': 'quiz',
    'order-screen': 'order',
    'write-screen': 'write',
    'pinyin-screen': 'pinyin',
    'hub-screen': 'practice',
    'px-screen': 'practice'
  };
  let curMode = null, since = Date.now();
  function flushTime() {
    const now = Date.now();
    if (curMode) {
      const s = Math.min(1800, Math.max(0, (now - since) / 1e3));
      timeStats[curMode] = Math.round(((timeStats[curMode] || 0) + s) * 10) / 10;
      safeStorage.set(K.time, timeStats);
    }
    since = now;
  }
  const _show = window.show;
  window.show = function(id) {
    flushTime();
    curMode = SCREEN_MODE[id] || null;
    return _show.apply(this, arguments);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      flushTime();
      curMode = null;
    } else {
      since = Date.now();
      const vis = Object.keys(SCREEN_MODE).find(id => document.getElementById(id) && document.getElementById(id).style.display === 'block');
      curMode = vis ? SCREEN_MODE[vis] : null;
    }
  });
  window.addEventListener('pagehide', flushTime);
  const css = document.createElement('style');
  css.textContent = `\n  .mode-grid.new-modes{grid-template-columns:repeat(3,1fr)!important}\n  .mode-grid.hub-row{grid-template-columns:1fr!important}\n  .mode-card.hub-mode:hover{border-color:#34d399;box-shadow:0 15px 35px rgba(52,211,153,.2),var(--shadow-3)}\n  .mode-card.hub-mode .mode-title{color:#34d399}\n  .mode-card.pinyin-mode:hover{border-color:#60a5fa;box-shadow:0 15px 35px rgba(96,165,250,.2),var(--shadow-3)}\n  .mode-card.pinyin-mode .mode-title{color:#60a5fa}\n  .mode-card.order-mode:hover{border-color:#fbbf24;box-shadow:0 15px 35px rgba(251,191,36,.2),var(--shadow-3)}\n  .mode-card.order-mode .mode-title{color:#fbbf24}\n  .mode-card.write-mode:hover{border-color:#34d399;box-shadow:0 15px 35px rgba(52,211,153,.2),var(--shadow-3)}\n  .mode-card.write-mode .mode-title{color:#34d399}\n  .mstat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px}\n  .mstat{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px 8px;text-align:center}\n  .mstat b{display:block;font-family:var(--font-heading);font-size:22px;color:var(--text)}\n  .mstat span{font-size:11px;color:var(--muted);font-weight:700}\n  .mstat-title{font-weight:800;margin:14px 0 8px;font-size:14px}\n  .mist-actions{display:none;gap:10px;margin-bottom:14px}\n  .mist-actions .btn-start-srs{flex:1}\n  .mist-sub{font-size:13px;color:var(--muted);margin-top:4px;line-height:1.5}\n  .mist-sub .han{font-family:var(--font-hanzi);color:var(--text)}\n  @media(max-width:420px){.mstat-grid{grid-template-columns:1fr 1fr}}`;
  document.head.appendChild(css);
  function injectHome() {
    const grid = document.querySelector('#game-screen .mode-grid') || document.querySelector('#welcome-screen .mode-grid');
    if (!grid || document.getElementById('btn-order-mode')) return;
    const row = document.createElement('div');
    row.className = 'mode-grid new-modes';
    row.innerHTML = `\n      <button class="mode-card order-mode" id="btn-order-mode" onclick="OrderMode.open()"><span class="mode-icon">🔤</span><div class="mode-title">Xếp câu</div><div class="mode-desc">Sắp xếp từ thành câu</div></button>\n      <button class="mode-card write-mode" id="btn-write-mode" onclick="WriteMode.open()"><span class="mode-icon">✍️</span><div class="mode-title">Luyện viết</div><div class="mode-desc">Viết chữ Hán</div></button>\n      <button class="mode-card pinyin-mode" id="btn-pinyin-mode" onclick="PinyinMode.open()"><span class="mode-icon">⌨️</span><div class="mode-title">Gõ pinyin</div><div class="mode-desc">Nghe/nghĩa → gõ</div></button>`;
    grid.parentNode.insertBefore(row, grid.nextSibling);
    const row2 = document.createElement('div');
    row2.className = 'mode-grid new-modes hub-row';
    row2.innerHTML = `<button class="mode-card hub-mode" id="btn-hub-mode" onclick="PracticeHub.open()"><span class="mode-icon">🎯</span><div class="mode-title">Luyện thêm</div><div class="mode-desc">Lộ trình hằng ngày · chính tả · điền từ · thi thử</div></button>`;
    row.parentNode.insertBefore(row2, row.nextSibling);
    row2.querySelectorAll('.mode-card').forEach(el => {
      try {
        attachSpotlight(el, {
          tilt: true
        });
      } catch (e) {}
    });
    row.querySelectorAll('.mode-card').forEach(el => {
      try {
        attachSpotlight(el, {
          tilt: true
        });
      } catch (e) {}
    });
  }
  function injectSRS() {
    const tabs = document.getElementById('srs-tabs');
    if (!tabs || document.getElementById('srs-tab-sent')) return;
    tabs.insertAdjacentHTML('beforeend', `<button class="hsk-tab" id="srs-tab-sent" onclick="setSRSTab('sent', this)">🧩 Câu sai</button>\n       <button class="hsk-tab" id="srs-tab-char" onclick="setSRSTab('char', this)">✍️ Chữ viết lại</button>`);
    const act = document.getElementById('srs-actions');
    act.insertAdjacentHTML('afterend', `<div class="mist-actions" id="mist-actions"><button class="btn-start-srs" id="mist-practice" onclick="StudyCore.practiceMistakes()">🚀 Luyện lại</button></div>`);
  }
  SC.practiceMistakes = function() {
    const kind = srsTab === 'char' ? 'char' : 'sent';
    if (kind === 'char') WriteMode.openMistakes(); else OrderMode.openMistakes();
  };
  const _render = window.renderSRSList;
  window.renderSRSList = function() {
    injectSRS();
    const sCount = SC.mistakes('sent').length, cCount = SC.mistakes('char').length;
    const isM = srsTab === 'sent' || srsTab === 'char';
    if (!isM) _render.apply(this, arguments); else {
      const now = Date.now();
      document.getElementById('srs-tab-due').textContent = `🔴 Cần ôn (${srsWords.filter(w => w.nextReview <= now).length})`;
      document.getElementById('srs-tab-all').textContent = `📚 Tất cả (${srsWords.length})`;
      document.getElementById('srs-tab-done').textContent = `✅ Đã thuộc (${srsWords.filter(w => (w.box || 1) >= 5).length})`;
    }
    document.getElementById('srs-tab-sent').textContent = `🧩 Câu sai (${sCount})`;
    document.getElementById('srs-tab-char').textContent = `✍️ Chữ viết lại (${cCount})`;
    [ 'srs-tab-due', 'srs-tab-all', 'srs-tab-done', 'srs-tab-sent', 'srs-tab-char' ].forEach(id => {
      const b = document.getElementById(id);
      b.classList.toggle('active', id === 'srs-tab-' + srsTab);
    });
    if (sCount + cCount > 0) document.getElementById('srs-tabs').style.display = 'flex';
    const ma = document.getElementById('mist-actions');
    ma.style.display = isM ? 'flex' : 'none';
    if (isM) {
      document.getElementById('srs-actions').style.display = 'none';
      const list = document.getElementById('srs-list'), items = SC.mistakes(srsTab === 'char' ? 'char' : 'sent').sort((a, b) => a.nextReview - b.nextReview);
      document.getElementById('mist-practice').style.display = items.length ? '' : 'none';
      document.getElementById('mist-practice').textContent = srsTab === 'char' ? '✍️ Viết lại các chữ này' : '🧩 Xếp lại các câu này';
      if (!items.length) {
        list.innerHTML = `<div class="srs-empty">${srsTab === 'char' ? '✍️ Chưa có chữ nào cần viết lại.' : '🧩 Chưa có câu nào bị sai.'}</div>`;
        return;
      }
      list.innerHTML = '';
      const now = Date.now();
      items.forEach(m => {
        const row = document.createElement('div');
        row.className = 'vocab-row srs-row';
        const isDue = m.nextReview <= now, days = Math.ceil((m.nextReview - now) / 864e5), box = Math.max(1, Math.min(5, m.box || 1));
        const big = m.kind === 'char';
        row.innerHTML = `<div class="vocab-info"><div class="vocab-text">${m.level ? `<span class="v-badge hsk-lv">${escapeHTML(m.level)}</span>` : ''}<span class="v-hanzi ${!big && m.text.length > 12 ? 'text-sm' : ''}" style="${big ? 'font-size:34px' : ''}">${escapeHTML(m.text)}</span></div>\n          ${m.pinyin ? `<div class="v-pinyin">${escapeHTML(m.pinyin)}</div>` : ''}<div class="v-meaning">${escapeHTML(m.meaning || '')}</div>\n          ${m.note ? `<div class="mist-sub">${escapeHTML(m.note)}</div>` : ''}\n          <div class="srs-meta"><span class="srs-pips">${'●'.repeat(box)}${'○'.repeat(5 - box)}</span><span>${isDue ? '🔴 Cần ôn' : '⏳ ' + days + ' ngày'}</span><span>❌ sai ${m.wrongCount || 1} lần</span></div></div>\n          <div class="vocab-actions"><button class="v-speak" title="Nghe">🔊</button><button class="btn-del" title="Xoá khỏi sổ tay">✕</button></div>`;
        row.querySelector('.v-speak').addEventListener('click', function() {
          if (!zhVoice) loadVoices();
          speakChinese(m.text, this);
        });
        row.querySelector('.btn-del').addEventListener('click', () => {
          SC.mistakeRemove(m.id);
          renderSRSList();
        });
        list.appendChild(row);
      });
    }
  };
  const _stats = window.openStats;
  window.openStats = function() {
    const r = _stats.apply(this, arguments);
    try {
      renderModePanel();
    } catch (e) {
      console.warn('mode stats', e);
    }
    return r;
  };
  function mins(s) {
    s = s || 0;
    return s < 90 ? Math.round(s) + ' giây' : Math.round(s / 60) + ' phút';
  }
  function renderModePanel() {
    let box = document.getElementById('mode-stats');
    if (!box) {
      box = document.createElement('div');
      box.id = 'mode-stats';
      const hp = document.getElementById('hsk-progress');
      hp.previousElementSibling.parentNode.insertBefore(box, hp.previousElementSibling);
    }
    const o = modeStats.order || {}, w = modeStats.write || {}, pn = modeStats.pinyin || {};
    const oa = o.asked || 0, oc = o.correct || 0, wa = w.asked || 0, wp = w.pass || 0, wr = w.retry || 0;
    const bk = SC.backups();
    box.innerHTML = `\n      <div class="mist-sub" style="margin:0 0 10px">💾 ${bk.length ? 'Sao lưu tự động gần nhất: ' + new Date(bk[0].t).toLocaleString('vi-VN') + ' (' + bk[0].why + ') · <a href="#" id="bk-restore" style="color:var(--accent3)">↩ Khôi phục</a>' : 'Chưa có bản sao lưu tự động.'}</div>\n      <h3 class="stat-h3">🧩 Xếp câu</h3>\n      <div class="mstat-grid"><div class="mstat"><b>${oa}</b><span>Câu đã xếp</span></div><div class="mstat"><b>${oc}</b><span>Xếp đúng</span></div><div class="mstat"><b>${oa ? Math.round(oc / oa * 100) + '%' : '—'}</b><span>Chính xác</span></div></div>\n      <h3 class="stat-h3">✍️ Luyện viết</h3>\n      <div class="mstat-grid"><div class="mstat"><b>${wa}</b><span>Chữ đã luyện</span></div><div class="mstat"><b>${wp}</b><span>Đạt ≥80%</span></div><div class="mstat"><b>${wr}</b><span>Cần viết lại</span></div></div>\n      <h3 class="stat-h3">⌨️ Gõ pinyin</h3>\n      <div class="mstat-grid"><div class="mstat"><b>${pn.asked || 0}</b><span>Từ đã gõ</span></div><div class="mstat"><b>${pn.correct || 0}</b><span>Gõ đúng</span></div><div class="mstat"><b>${pn.asked ? Math.round((pn.correct || 0) / pn.asked * 100) + '%' : '—'}</b><span>Chính xác</span></div></div>\n      <h3 class="stat-h3">⏱ Thời gian học theo chế độ</h3>\n      <div class="mstat-grid"><div class="mstat"><b style="font-size:16px">${mins(timeStats.quiz)}</b><span>Trắc nghiệm</span></div><div class="mstat"><b style="font-size:16px">${mins(timeStats.order)}</b><span>Xếp câu</span></div><div class="mstat"><b style="font-size:16px">${mins(timeStats.write)}</b><span>Luyện viết</span></div><div class="mstat"><b style="font-size:16px">${mins(timeStats.pinyin)}</b><span>Gõ pinyin</span></div><div class="mstat"><b style="font-size:16px">${mins(timeStats.practice)}</b><span>Luyện thêm</span></div></div>`;
    const rb = document.getElementById('bk-restore');
    if (rb) rb.onclick = ev => {
      ev.preventDefault();
      SC.restoreBackup(0);
    };
  }
  const EXTRA = [ [ 'modeStats', K.mode ], [ 'modeTime', K.time ], [ 'mistakes', K.mist ] ];
  const CORE = [ [ 'dailyStats', 'cn_quiz_daily_stats', {} ], [ 'srsWords', 'cn_quiz_srs_words', [] ], [ 'extraDict', 'cn_quiz_extra_dict', [] ], [ 'levelStats', 'cn_quiz_level_stats', {} ], [ 'xp', 'cn_quiz_xp', 0 ], [ 'hskEver', 'cn_quiz_hsk_ever', {} ], [ 'hskSeen', 'cn_quiz_hsk_seen', {} ] ];
  const BK = 'cn_quiz_backups';
  function collect() {
    const data = {
      _app: 'quiz-tieng-trung',
      _version: 2,
      _savedAt: (new Date).toISOString()
    };
    CORE.forEach(([n, k, d]) => {
      const v = safeStorage.get(k);
      data[n] = v == null ? d : v;
    });
    EXTRA.forEach(([n, k]) => {
      const v = safeStorage.get(k);
      if (v != null) data[n] = v;
    });
    return data;
  }
  function apply(d) {
    CORE.forEach(([n, k]) => {
      if (d[n] != null) safeStorage.set(k, d[n]);
    });
    EXTRA.forEach(([n, k]) => {
      if (d[n] != null) safeStorage.set(k, d[n]);
    });
  }
  function merge(a, b) {
    if (a == null) return b;
    if (b == null) return a;
    if (typeof a === 'number' && typeof b === 'number') return Math.max(a, b);
    if (Array.isArray(a) && Array.isArray(b)) {
      const keyOf = x => x && typeof x === 'object' ? x.id != null ? 'id:' + x.id : x.text != null ? 't:' + x.text : null : 'v:' + JSON.stringify(x);
      const out = a.slice(), pos = new Map;
      out.forEach((x, i) => {
        const k = keyOf(x);
        if (k != null) pos.set(k, i);
      });
      b.forEach(x => {
        const k = keyOf(x);
        if (k != null && pos.has(k)) out[pos.get(k)] = merge(out[pos.get(k)], x); else {
          out.push(x);
          if (k != null) pos.set(k, out.length - 1);
        }
      });
      return out;
    }
    if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
      const out = Object.assign({}, a);
      Object.keys(b).forEach(k => {
        out[k] = k in a ? merge(a[k], b[k]) : b[k];
      });
      return out;
    }
    return a;
  }
  function snapshot(why) {
    try {
      const list = safeStorage.get(BK) || [];
      list.push({
        t: Date.now(),
        why: why || 'auto',
        day: today(),
        data: collect()
      });
      while (list.length > 3) list.shift();
      safeStorage.set(BK, list);
    } catch (e) {}
  }
  SC.snapshot = snapshot;
  SC.backups = () => (safeStorage.get(BK) || []).slice().reverse();
  SC.restoreBackup = function(n) {
    const b = SC.backups()[n || 0];
    if (!b) {
      alert('Chưa có bản sao lưu nào.');
      return;
    }
    if (!confirm('Khôi phục dữ liệu về bản ' + new Date(b.t).toLocaleString('vi-VN') + ' (' + b.why + ')? Dữ liệu hiện tại sẽ bị thay thế (vẫn được sao lưu lại trước).')) return;
    snapshot('trước khi khôi phục');
    apply(b.data);
    location.reload();
  };
  try {
    const l = safeStorage.get(BK) || [];
    if (!l.length || l[l.length - 1].day !== today()) snapshot('tự động hằng ngày');
  } catch (e) {}
  window.exportData = function() {
    const blob = new Blob([ JSON.stringify(collect(), null, 2) ], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url;
    a.download = 'quiz_data_' + today() + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  window.importData = function(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const rd = new FileReader;
    rd.onload = ev => {
      let d;
      try {
        d = JSON.parse(ev.target.result);
        if (!d || typeof d !== 'object') throw 0;
      } catch (x) {
        alert('❌ File không hợp lệ!');
        return;
      }
      const mergeIt = confirm('Nhập dữ liệu:\n\nOK = GỘP với dữ liệu hiện tại (giữ số liệu cao hơn, không mất tiến trình ở cả 2 máy)\nHuỷ = GHI ĐÈ hoàn toàn bằng file này');
      snapshot('trước khi nhập file');
      if (mergeIt) {
        const cur = collect(), out = {};
        CORE.concat(EXTRA.map(([n, k]) => [ n, k, null ])).forEach(([n]) => {
          if (cur[n] != null || d[n] != null) out[n] = merge(cur[n], d[n]);
        });
        apply(out);
      } else apply(d);
      alert('✅ Nhập dữ liệu thành công (' + (mergeIt ? 'đã gộp' : 'đã ghi đè') + ')! Trang sẽ tải lại.');
      location.reload();
    };
    rd.readAsText(file);
    e.target.value = '';
  };
  SC._merge = merge;
  const _reset = window.confirmReset;
  window.confirmReset = function() {
    snapshot('trước khi reset');
    [ K.mode, K.time, K.claims, K.mist, 'cn_quiz_write_cache' ].forEach(k => safeStorage.remove(k));
    return _reset.apply(this, arguments);
  };
  window.addEventListener('load', injectHome);
  if (document.readyState === 'complete') injectHome();
})();

(function() {
  'use strict';
  const LS_LEVEL = 'cn_quiz_order_level', LS_SEEN = 'cn_quiz_order_seen';
  const LEVELS = [ 'HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'Tất cả' ];
  const PUNCT = /[，。！？、；：,.!?;:“”"'‘’（）()《》…—~～·\s]/;
  const HAN = /[一-鿿]/;
  const SC = () => window.StudyCore;
  const FS = () => window.FitScale && window.FitScale.s || 1;
  const $ = id => document.getElementById(id);
  let showHz = safeStorage.get('cn_quiz_order_hz') !== false;
  let level = 'HSK1', rounds = [], idx = 0, st = null, locked = false, active = false, lexCache = null, lexSig = '';
  function lexicon() {
    const sig = (typeof hskAll !== 'undefined' ? hskAll.length : 0) + ':' + (window.dictWords ? window.dictWords.length : 0);
    if (lexCache && sig === lexSig) return lexCache;
    const L = new Set, add = t => {
      t = String(t || '').split(/[\/／,，;；(（]/)[0].replace(/[~～…\s]/g, '');
      if (t && t.length <= 5 && /^[一-鿿]+$/.test(t)) L.add(t);
    };
    if (typeof hskAll !== 'undefined') hskAll.forEach(w => add(w.text));
    (window.dictWords || []).forEach(w => add(w.text));
    [ '我们', '你们', '他们', '她们', '什么', '怎么', '为什么', '不是', '没有', '可以', '一起', '知道', '喜欢', '今天', '明天', '昨天', '现在', '朋友', '老师', '学生', '谢谢' ].forEach(w => L.add(w));
    lexCache = L;
    lexSig = sig;
    return L;
  }
  function segment(text) {
    const L = lexicon(), chars = [ ...text ], n = chars.length;
    const best = new Array(n + 1).fill(Infinity), prev = new Array(n + 1).fill(0), len = new Array(n + 1).fill(1);
    best[0] = 0;
    for (let i = 0; i < n; i++) {
      if (best[i] === Infinity) continue;
      if (!HAN.test(chars[i])) {
        if (best[i] < best[i + 1]) {
          best[i + 1] = best[i];
          prev[i + 1] = i;
          len[i + 1] = 1;
        }
        continue;
      }
      for (let l = 1; l <= 5 && i + l <= n; l++) {
        const w = chars.slice(i, i + l).join('');
        const c = l === 1 ? L.has(w) ? 1 : 1.7 : L.has(w) ? 1 - .05 * l + 0 : Infinity;
        if (best[i] + c < best[i + l]) {
          best[i + l] = best[i] + c;
          prev[i + l] = i;
          len[i + l] = l;
        }
      }
    }
    const out = [];
    let p = n;
    while (p > 0) {
      out.unshift(chars.slice(prev[p], p).join(''));
      p = prev[p];
    }
    const toks = [];
    let lead = '';
    out.forEach(t => {
      if (!HAN.test(t) && PUNCT.test(t)) {
        if (toks.length) toks[toks.length - 1] += t; else lead += t;
      } else {
        toks.push(lead + t);
        lead = '';
      }
    });
    return toks.filter(t => HAN.test(t) || /\d|[a-zA-Z]/.test(t));
  }
  const core = s => String(s).replace(/[，。！？、；：,.!?;:“”"'‘’（）()《》…—~～·\s]/g, '');
  const FIN = new Set('a o e ai ei ao ou an en ang eng ong er i ia ie iao iu ian in iang ing iong u ua uo uai ui uan un uang ueng ue v ve van vn'.split(' '));
  const INI = [ '', 'zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w' ];
  const baseCh = c => {
    if ('üǖǘǚǜÜ'.includes(c)) return 'v';
    const d = c.normalize('NFD')[0];
    return d.toLowerCase();
  };
  const validSyl = t => INI.some(i => t.startsWith(i) && t.length > i.length && FIN.has(t.slice(i.length)));
  function splitChunk(orig) {
    const plain = [ ...orig ].map(baseCh).join(''), n = plain.length, best = new Array(n + 1).fill(Infinity), prev = new Array(n + 1).fill(-1);
    best[0] = 0;
    for (let i = 0; i < n; i++) {
      if (best[i] === Infinity) continue;
      for (let l = 1; l <= 6 && i + l <= n; l++) if (validSyl(plain.slice(i, i + l)) && best[i] + 1 < best[i + l]) {
        best[i + l] = best[i] + 1;
        prev[i + l] = i;
      }
    }
    if (best[n] === Infinity) return null;
    const out = [];
    let p = n;
    const chars = [ ...orig ];
    while (p > 0) {
      out.unshift(chars.slice(prev[p], p).join(''));
      p = prev[p];
    }
    return out;
  }
  function syllables(pinyin, K) {
    const chunks = String(pinyin || '').replace(/[^\p{L}'’\s]/gu, ' ').split(/[\s'’]+/).filter(Boolean), all = [];
    for (const ch of chunks) {
      const r = splitChunk(ch);
      if (!r) return null;
      all.push(...r);
    }
    return all.length === K ? all : null;
  }
  function dictPinyin(t) {
    const clean = x => String(x || '').split(/[\/／,，;；(（]/)[0].replace(/[~～…\s]/g, '');
    if (typeof hskAll !== 'undefined') {
      const w = hskAll.find(x => clean(x.text) === t && x.pinyin);
      if (w) return String(w.pinyin).split(/[\/／,，;；]/)[0].trim();
    }
    const d = (window.dictWords || []).find(x => clean(x.text) === t && x.pinyin);
    return d ? String(d.pinyin).trim() : null;
  }
  const hanLen = t => (t.match(/[\u4e00-\u9fff]/g) || []).length;
  function tokensPinyin(item) {
    const K = hanLen(item.text), sy = syllables(item.pinyin, K);
    let pos = 0;
    return item.tokens.map(t => {
      const k = hanLen(t);
      if (!k) return null;
      if (sy) {
        const out = sy.slice(pos, pos + k).join('').toLowerCase();
        pos += k;
        return out;
      }
      pos += k;
      const d = dictPinyin(t.replace(/[^\u4e00-\u9fff]/g, ''));
      return d ? d.toLowerCase() : null;
    });
  }
  function gather(lv) {
    const arr = [];
    const push = (text, pinyin, meaning, level) => {
      text = String(text || '').trim();
      meaning = String(meaning || '').trim();
      if (!text || !meaning || !HAN.test(text)) return;
      const c = core(text);
      if (c.length < 4 || c.length > 26) return;
      arr.push({
        text: text,
        pinyin: pinyin || '',
        meaning: meaning,
        level: level
      });
    };
    if (typeof hskAll !== 'undefined') hskAll.forEach(w => {
      if (w.example && (lv === 'Tất cả' || w.level === lv)) push(w.example, w.examplePinyin, w.exampleMeaning, w.level);
    });
    if (lv === 'Tất cả') (window.dictSentences || []).forEach(s => push(s.text, s.pinyin, s.meaning, 'Data'));
    const seen = new Set, out = [];
    arr.forEach(s => {
      if (seen.has(s.text)) return;
      seen.add(s.text);
      const t = segment(s.text);
      if (t.length >= 3 && t.length <= 9) {
        s.tokens = t;
        out.push(s);
      }
    });
    return out;
  }
  const RULES = [ [ /把/, 'Cấu trúc 把: Chủ ngữ + 把 + Tân ngữ + Động từ + thành phần khác (了/结果/地点).' ], [ /被/, 'Câu bị động: Tân ngữ + 被 + (Người làm) + Động từ + thành phần khác.' ], [ /是.*的/, 'Mẫu 是…的 nhấn mạnh thời gian/nơi chốn/cách thức của hành động đã xảy ra.' ], [ /吗[？?]?$/, '吗 đặt cuối câu trần thuật để tạo câu hỏi có/không.' ], [ /呢[？?。]?$/, '呢 đặt cuối câu để hỏi tiếp ("thế còn…?") hoặc nhấn mạnh trạng thái.' ], [ /(什么|谁|哪|几|怎么|为什么|多少)/, 'Từ để hỏi giữ nguyên vị trí của thành phần được hỏi (không đảo lên đầu như tiếng Việt).' ], [ /(今天|明天|昨天|现在|早上|晚上|每天|去年|明年|上午|下午)/, 'Từ chỉ thời gian đứng sau chủ ngữ (hoặc đầu câu), trước động từ.' ], [ /不|没/, '不/没 đứng ngay trước động từ hoặc tính từ được phủ định.' ], [ /(很|非常|太|最|比较)/, 'Phó từ mức độ 很/非常/太… đứng trước tính từ.' ], [ /在/, '在 + nơi chốn thường đứng trước động từ: 我在家学习.' ], [ /得/, '得 nối động từ với bổ ngữ trạng thái/mức độ: động từ + 得 + tính từ.' ], [ /了/, '了 sau động từ báo hoàn thành; cuối câu báo thay đổi/tình huống mới.' ], [ /的/, '的 nối định ngữ với danh từ: định ngữ + 的 + danh từ.' ], [ /(想|要|会|能|可以)/, 'Động từ năng nguyện (想/要/会/能/可以) đứng trước động từ chính.' ] ];
  function grammarNotes(text) {
    const o = [];
    RULES.forEach(([re, t]) => {
      if (re.test(text) && o.length < 2) o.push(t);
    });
    return o;
  }
  function build() {
    if ($('order-screen')) return;
    const css = document.createElement('style');
    css.textContent = `\n    #order-screen{display:none;width:100%}\n    .ord-top{display:flex;align-items:center;gap:10px;margin-bottom:12px}\n    .ord-lv{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:12px}\n    .ord-prompt{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;text-align:center;margin-bottom:14px}\n    .ord-prompt .lbl{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);font-weight:800}\n    .ord-prompt .vi{font-size:19px;font-weight:700;line-height:1.45;margin-top:6px}\n    .ord-zone{min-height:74px;border:2px dashed var(--border);border-radius:var(--radius-lg);padding:10px;display:flex;flex-wrap:wrap;gap:8px;align-content:flex-start;margin-bottom:12px;background:color-mix(in oklab,var(--surface) 70%,transparent);transition:border-color .2s}\n    .ord-zone.over{border-color:var(--accent)}\n    .ord-zone.empty::before{content:attr(data-ph);color:var(--muted);font-size:13px;margin:auto}\n    .ord-chip{touch-action:none;user-select:none;-webkit-user-select:none;cursor:grab;padding:10px 16px;border-radius:var(--radius-md);background:var(--surface2);border:1px solid var(--border);font-family:var(--font-hanzi);font-size:24px;font-weight:600;color:var(--text);box-shadow:var(--shadow-1);transition:transform .15s,border-color .15s,background .15s}\n    .ord-chip:hover{border-color:var(--accent);transform:translateY(-2px)}\n    .ord-chip.py{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 14px}\n    .ord-chip .cp{font-family:var(--font-body);font-size:19px;font-weight:700;color:var(--accent3);letter-spacing:.01em}\n    .ord-chip .ch{font-family:var(--font-hanzi);font-size:13px;font-weight:500;color:var(--muted);line-height:1}\n    .ord-chip.ghosted{opacity:.25}\n    .ord-chip.before{box-shadow:-5px 0 0 0 var(--accent)}\n    .ord-chip.ok{border-color:var(--correct);background:color-mix(in oklab,var(--correct) 18%,var(--surface2))}\n    .ord-chip.bad{border-color:var(--wrong);background:color-mix(in oklab,var(--wrong) 18%,var(--surface2))}\n    .ord-zone.endmark{box-shadow:inset -5px 0 0 0 var(--accent)}\n    .ord-float{position:fixed;z-index:9999;pointer-events:none;opacity:.92;transform:scale(1.08);box-shadow:var(--shadow-3)}\n    .ord-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}\n    .ord-actions button{flex:1;min-width:110px;padding:13px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);color:var(--text);font-weight:800;cursor:pointer;font-family:var(--font-heading)}\n    .ord-actions button.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border:0;color:#fff}\n    .ord-actions button:disabled{opacity:.45;cursor:default}\n    .ord-fb{display:none;margin-top:14px;padding:14px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);line-height:1.55}\n    .ord-fb.show{display:block}\n    .ord-fb.good{border-color:var(--correct)} .ord-fb.bad{border-color:var(--wrong)}\n    .ord-fb .han{font-family:var(--font-hanzi);font-size:22px;font-weight:700}\n    .ord-fb .py{color:var(--accent3);font-size:14px}\n    .ord-fb .note{font-size:13px;color:var(--muted);margin-top:8px}\n    .ord-empty{padding:30px 16px;text-align:center;color:var(--muted);line-height:1.6}\n    @media all{\n      #ord-body>.btn-next{flex:0 0 auto}\n      #order-screen[style*="block"]{gap:clamp(5px,calc(1.1 * var(--hu)),10px)}\n      #order-screen .screen-header{margin:0}\n      .ord-top{margin:0}.ord-lv{margin:0!important;padding:0!important;gap:6px!important;flex-wrap:nowrap}\n      .ord-lv .hsk-tab{padding:6px 11px;font-size:12px;flex:0 0 auto}\n      .ord-prompt{padding:9px 12px;margin:0!important}.ord-prompt .vi{font-size:clamp(15px,calc(2.6 * var(--hu)),19px);margin-top:3px;line-height:1.35}\n      .ord-prompt .lbl{font-size:9.5px}\n      #ord-body{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;gap:clamp(5px,calc(1.1 * var(--hu)),10px)}\n      #ord-body>*{margin:0!important;flex-shrink:0}\n      .ord-zone{min-height:0;flex:1 1 0;padding:7px;gap:6px;margin:0!important;overflow-y:auto;scrollbar-width:none}\n      .ord-chip{padding:6px 11px;font-size:20px}\n      .ord-chip.py{padding:5px 10px}.ord-chip .cp{font-size:16px}.ord-chip .ch{font-size:11px}\n      .ord-actions{margin:0;gap:6px}.ord-actions button{padding:9px 4px;min-width:0;font-size:12px}\n      .ord-fb{margin:0;padding:8px 10px;font-size:12px;max-height:calc(24 * var(--hu));overflow-y:auto}.ord-fb .han{font-size:17px}\n      #ord-body #ord-bank{min-height:0!important}\n    }`;
    document.head.appendChild(css);
    const d = document.createElement('div');
    d.id = 'order-screen';
    d.innerHTML = `\n      <div class="screen-header"><button class="btn-back" onclick="goHome()">⬅️ Quay lại</button><h2 class="screen-title">🧩 Xếp câu</h2></div>\n      <div class="ord-lv" id="ord-lv"></div>\n      <div id="ord-body">\n        <div class="quiz-header"><span class="mode-badge" id="ord-badge">🧩 Xếp câu</span><span class="question-counter" id="ord-counter">1 / 10</span><div class="header-actions"><button class="btn-icon" id="ord-speak" title="Nghe câu (hiện đáp án)">🔊</button></div></div>\n        <div class="progress-track"><div class="progress-fill" id="ord-progress" style="width:0%"></div></div>\n        <div class="ord-prompt"><div class="lbl">Xếp các từ thành câu có nghĩa</div><div class="vi" id="ord-vi"></div></div>\n        <div class="ord-zone empty" id="ord-answer" data-ph="Bấm hoặc kéo các từ vào đây"></div>\n        <div class="ord-zone" id="ord-bank" style="border-style:solid"></div>\n        <div class="ord-actions"><button id="ord-hint">💡 Gợi ý</button><button id="ord-hz">Hán phụ: Bật</button><button id="ord-clear">🗑 Xoá</button><button class="primary" id="ord-check">✔ Kiểm tra</button></div>\n        <div class="ord-fb" id="ord-fb"></div>\n        <button class="btn-next" id="ord-next" style="margin-top:14px">Câu tiếp →</button>\n      </div>`;
    $('result-screen').parentNode.appendChild(d);
    $('ord-hint').onclick = hint;
    $('ord-hz').onclick = toggleHz;
    labelHz();
    $('ord-clear').onclick = clearAll;
    $('ord-check').onclick = check;
    $('ord-next').onclick = next;
    $('ord-speak').onclick = function() {
      if (st) {
        if (!zhVoice) loadVoices();
        speakChinese(st.item.text, this);
      }
    };
    [ 'pointerdown' ].forEach(ev => $('order-screen').addEventListener(ev, down));
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }
  function drawLevels() {
    $('ord-lv').innerHTML = LEVELS.map(l => `<button class="hsk-tab ${l === level ? 'active' : ''}" data-l="${l}">${l}</button>`).join('');
    $('ord-lv').querySelectorAll('button').forEach(b => b.onclick = () => {
      level = b.dataset.l;
      safeStorage.set(LS_LEVEL, level);
      start(level);
    });
  }
  function pick(pool, n) {
    const store = safeStorage.get(LS_SEEN) || {}, seen = new Set(store[level] || []);
    const due = SC().mistakes('sent').filter(m => m.nextReview <= Date.now()).map(m => pool.find(p => p.text === m.text)).filter(Boolean);
    const chosen = [], used = new Set, add = s => {
      if (s && !used.has(s.text) && chosen.length < n) {
        used.add(s.text);
        chosen.push(s);
      }
    };
    shuffle(due).slice(0, 3).forEach(add);
    let fresh = pool.filter(p => !seen.has(p.text));
    if (fresh.length < n - chosen.length) {
      seen.clear();
      fresh = pool;
    }
    shuffle(fresh).forEach(add);
    store[level] = [ ...seen, ...chosen.map(c => c.text) ];
    safeStorage.set(LS_SEEN, store);
    return chosen;
  }
  function open() {
    build();
    level = safeStorage.get(LS_LEVEL) || 'HSK1';
    if (!LEVELS.includes(level)) level = 'HSK1';
    show('order-screen');
    drawLevels();
    start(level);
  }
  function start(lv) {
    build();
    show('order-screen');
    active = true;
    level = lv;
    drawLevels();
    resetSession();
    const pool = gather(lv);
    currentGameStarter = () => start(level);
    if (pool.length < 3) {
      empty('Chưa đủ câu ví dụ cho ' + lv + '. Hãy chắc chắn file HSK' + (lv.replace('HSK', '') || 'x') + '.js đã được tải (cần ít nhất 3 câu có nghĩa tiếng Việt).');
      return;
    }
    begin(pick(pool, 10));
  }
  function openMistakes() {
    build();
    show('order-screen');
    level = 'Sổ tay';
    drawLevels();
    const lst = SC().mistakes('sent').sort((a, b) => a.nextReview - b.nextReview).slice(0, 10);
    const items = lst.map(m => ({
      text: m.text,
      pinyin: m.pinyin,
      meaning: m.meaning,
      level: m.level,
      tokens: segment(m.text)
    })).filter(i => i.tokens.length >= 2 && i.tokens.length <= 10);
    if (!items.length) {
      empty('Sổ tay chưa có câu nào để luyện lại.');
      return;
    }
    currentGameStarter = () => openMistakes();
    resetSession();
    begin(items);
  }
  function empty(msg) {
    $('ord-body').innerHTML = `<div class="ord-empty">🧩<br>${escapeHTML(msg)}</div>`;
    rounds = [];
  }
  function begin(items) {
    if (!$('ord-vi')) {
      document.getElementById('order-screen').remove();
      build();
      show('order-screen');
      drawLevels();
    }
    items.forEach(it => {
      it.tokPy = tokensPinyin(it);
    });
    rounds = items;
    idx = 0;
    setRound();
  }
  function setRound() {
    const it = rounds[idx];
    let order;
    do {
      order = shuffle(it.tokens.map((t, i) => i));
    } while (order.length > 1 && order.every((v, i) => v === i) && it.tokens.length > 1);
    st = {
      item: it,
      bank: order,
      answer: [],
      hinted: false,
      recorded: false,
      done: false,
      tries: 0
    };
    locked = false;
    $('ord-vi').textContent = it.meaning;
    $('ord-counter').textContent = `${idx + 1} / ${rounds.length}`;
    $('ord-progress').style.width = idx / rounds.length * 100 + '%';
    $('ord-fb').className = 'ord-fb';
    $('ord-fb').innerHTML = '';
    $('ord-next').classList.remove('visible');
    $('ord-check').disabled = false;
    $('ord-hint').disabled = false;
    $('ord-clear').disabled = false;
    render();
  }
  function chip(i, cls) {
    const t = st.item.tokens[i], py = st.item.tokPy && st.item.tokPy[i];
    return py ? `<div class="ord-chip py ${cls || ''}" data-id="${i}"><span class="cp">${escapeHTML(py)}</span>${showHz ? `<span class="ch">${escapeHTML(t.replace(/[^\u4e00-\u9fff0-9a-zA-Z]/g, ''))}</span>` : ''}</div>` : `<div class="ord-chip ${cls || ''}" data-id="${i}">${escapeHTML(t)}</div>`;
  }
  function render(marks, beforeId, endMark) {
    const a = $('ord-answer'), b = $('ord-bank');
    a.innerHTML = st.answer.map((i, pos) => chip(i, (marks ? marks[pos] : '') + (beforeId === i ? ' before' : ''))).join('');
    b.innerHTML = st.bank.map(i => chip(i)).join('');
    a.classList.toggle('empty', !st.answer.length);
    a.classList.toggle('endmark', !!endMark);
    b.style.minHeight = '74px';
    $('ord-check').disabled = locked || !st.answer.length;
  }
  function labelHz() {
    const b = $('ord-hz');
    if (b) b.textContent = 'Hán phụ: ' + (showHz ? 'Bật' : 'Tắt');
  }
  function toggleHz() {
    showHz = !showHz;
    safeStorage.set('cn_quiz_order_hz', showHz);
    labelHz();
    if (st) render();
  }
  function clearAll() {
    if (locked) return;
    st.bank = st.bank.concat(st.answer);
    st.answer = [];
    render();
  }
  let press = null, drag = null;
  function down(e) {
    const c = e.target.closest && e.target.closest('.ord-chip');
    if (!c || locked || e.button != null && e.button > 0) return;
    press = {
      id: +c.dataset.id,
      x: e.clientX,
      y: e.clientY,
      from: c.parentElement.id === 'ord-answer' ? 'a' : 'b',
      el: c
    };
  }
  function insertIndex(x, y) {
    const chips = [ ...$('ord-answer').querySelectorAll('.ord-chip:not(.ghosted)') ];
    for (let k = 0; k < chips.length; k++) {
      const r = chips[k].getBoundingClientRect();
      if (y < r.top || y <= r.bottom && x < r.left + r.width / 2) return {
        pos: k,
        before: +chips[k].dataset.id
      };
    }
    return {
      pos: chips.length,
      before: null
    };
  }
  function zoneAt(x, y) {
    const el = document.elementFromPoint(x, y);
    const z = el && el.closest && el.closest('#ord-answer,#ord-bank');
    return z ? z.id : null;
  }
  function move(e) {
    if (!press) return;
    const dx = e.clientX - press.x, dy = e.clientY - press.y;
    if (!drag && Math.hypot(dx, dy) > 7) {
      const r = press.el.getBoundingClientRect();
      const g = press.el.cloneNode(true);
      g.className = 'ord-chip ord-float';
      g.style.width = r.width / FS() + 'px';
      g.style.zoom = FS();
      document.body.appendChild(g);
      drag = {
        g: g,
        offx: press.x - r.left,
        offy: press.y - r.top
      };
      press.el.classList.add('ghosted');
    }
    if (drag) {
      drag.g.style.left = (e.clientX - drag.offx) / FS() + 'px';
      drag.g.style.top = (e.clientY - drag.offy) / FS() + 'px';
      const z = zoneAt(e.clientX, e.clientY);
      $('ord-answer').classList.toggle('over', z === 'ord-answer');
      $('ord-bank').classList.toggle('over', z === 'ord-bank');
      document.querySelectorAll('.ord-chip.before').forEach(c => c.classList.remove('before'));
      $('ord-answer').classList.remove('endmark');
      if (z === 'ord-answer') {
        const ix = insertIndex(e.clientX, e.clientY);
        if (ix.before != null) {
          const t = $('ord-answer').querySelector(`.ord-chip[data-id="${ix.before}"]`);
          if (t) t.classList.add('before');
        } else $('ord-answer').classList.add('endmark');
      }
    }
  }
  function up(e) {
    if (!press) return;
    const p = press;
    press = null;
    if (!drag) {
      if (locked) return;
      if (p.from === 'b') {
        st.bank = st.bank.filter(i => i !== p.id);
        st.answer.push(p.id);
      } else {
        st.answer = st.answer.filter(i => i !== p.id);
        st.bank.push(p.id);
      }
      render();
      return;
    }
    const z = zoneAt(e.clientX, e.clientY), ix = insertIndex(e.clientX, e.clientY);
    drag.g.remove();
    drag = null;
    $('ord-answer').classList.remove('over', 'endmark');
    $('ord-bank').classList.remove('over');
    st.bank = st.bank.filter(i => i !== p.id);
    st.answer = st.answer.filter(i => i !== p.id);
    if (z === 'ord-answer') {
      const at = ix.before == null ? st.answer.length : Math.max(0, st.answer.indexOf(ix.before));
      st.answer.splice(at, 0, p.id);
    } else st.bank.push(p.id);
    render();
  }
  function hint() {
    if (locked) return;
    let k = 0;
    while (k < st.answer.length && st.answer[k] === k) k++;
    const back = st.answer.slice(k);
    st.answer = st.answer.slice(0, k);
    st.bank = st.bank.concat(back);
    if (k < st.item.tokens.length) {
      st.bank = st.bank.filter(i => i !== k);
      st.answer.push(k);
    }
    st.hinted = true;
    render();
    showToast('💡 Dùng gợi ý: câu này không tính điểm');
  }
  function check() {
    if (locked || !st.answer.length) return;
    const toks = st.item.tokens, built = core(st.answer.map(i => toks[i]).join('')), want = core(toks.join(''));
    const full = st.answer.length === toks.length;
    const ok = full && built === want;
    st.tries++;
    if (!ok) {
      const marks = st.answer.map((id, pos) => toks[id] === toks[pos] ? 'ok' : 'bad');
      if (!full) showToast('Còn ' + (toks.length - st.answer.length) + ' từ chưa xếp');
      if (!st.recorded && full && !st.hinted) {
        settle(false);
      }
      if (full) {
        render(marks);
        feedback(false);
      }
      return;
    }
    if (!st.recorded && !st.hinted) settle(true);
    render(st.answer.map(() => 'ok'));
    feedback(true);
  }
  function settle(ok) {
    st.recorded = true;
    const it = st.item, key = it.text;
    const item = {
      text: it.text,
      pinyin: it.pinyin,
      meaning: it.meaning,
      level: it.level === 'Data' ? 'Khác' : it.level
    };
    const r = SC().record('order', key, ok, item, [ 'asked' ].concat(ok ? [ 'correct' ] : []));
    const note = grammarNotes(it.text)[0] || '';
    if (ok) SC().mistakeRight('sent', key); else SC().mistakeWrong('sent', key, {
      text: it.text,
      pinyin: it.pinyin,
      meaning: it.meaning,
      level: it.level === 'Data' ? '' : it.level,
      note: note
    });
    if (ok && !st.hinted) score++;
    st.counted = r.counted;
  }
  function feedback(ok) {
    const it = st.item, fb = $('ord-fb'), notes = grammarNotes(it.text);
    locked = ok || false;
    fb.className = 'ord-fb show ' + (ok ? 'good' : 'bad');
    fb.innerHTML = `<b>${ok ? '✅ Chính xác!' : '❌ Chưa đúng — nhìn các từ đỏ, xếp lại hoặc xem đáp án.'}</b>` + (st.hinted ? '<div class="note">Đã dùng gợi ý nên câu này không tính điểm.</div>' : '') + (ok ? answerBlock(it, notes) : `<div class="ord-actions" style="margin-top:10px"><button id="ord-retry">↩ Thử lại</button><button id="ord-show">👁 Xem đáp án</button></div>`);
    if (ok) finishRound(); else {
      $('ord-retry').onclick = () => {
        fb.className = 'ord-fb';
        render();
      };
      $('ord-show').onclick = () => {
        locked = true;
        st.answer = st.item.tokens.map((t, i) => i);
        st.bank = [];
        render(st.answer.map(() => 'ok'));
        fb.className = 'ord-fb show bad';
        fb.innerHTML = `<b>Đáp án</b>${answerBlock(it, notes)}`;
        finishRound();
      };
    }
  }
  function answerBlock(it, notes) {
    return `<div class="han">${escapeHTML(it.text)}</div>${it.pinyin ? `<div class="py">${escapeHTML(it.pinyin)}</div>` : ''}<div>${escapeHTML(it.meaning)}</div>` + (notes.length ? `<div class="note">📌 ${notes.map(escapeHTML).join('<br>📌 ')}</div>` : '');
  }
  function finishRound() {
    locked = true;
    $('ord-check').disabled = true;
    $('ord-hint').disabled = true;
    $('ord-clear').disabled = true;
    const nx = $('ord-next');
    nx.classList.add('visible');
    nx.textContent = idx + 1 >= rounds.length ? 'Xem kết quả →' : 'Câu tiếp →';
    if (typeof autoSpeakQ !== 'undefined' && autoSpeakQ) {
      try {
        speakChinese(st.item.text);
      } catch (e) {}
    }
  }
  function next() {
    if (!locked) return;
    idx++;
    if (idx >= rounds.length) return finish();
    setRound();
  }
  function finish() {
    const ok = sessionLog.filter(x => x.ok).length, tot = sessionLog.length;
    showFinal({
      score: ok,
      totalText: '/ ' + (tot || rounds.length),
      pct: tot ? ok / tot * 100 : 0,
      title: 'Hoàn thành Xếp câu',
      sub: 'Câu dùng gợi ý hoặc đã làm hôm nay không cộng thêm điểm'
    });
    document.getElementById('btn-practice-wrong').classList.remove('show');
    window._lastWrongTexts = [];
  }
  document.addEventListener('keydown', e => {
    const sc = $('order-screen');
    if (!sc || sc.style.display !== 'block' || !rounds.length) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      locked ? next() : check();
    }
  });
  window.OrderMode = {
    tokensPinyin: tokensPinyin,
    open: open,
    start: start,
    openMistakes: openMistakes,
    segment: segment,
    gather: gather,
    _state: () => ({
      st: st,
      rounds: rounds,
      idx: idx
    })
  };
})();

(function() {
  'use strict';
  const LS_LEVEL = 'cn_quiz_write_level', LEVELS = [ 'HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'Tất cả' ];
  const FS = () => window.FitScale && window.FitScale.s || 1;
  const $ = id => document.getElementById(id), SC = () => window.StudyCore;
  const ONLYHAN = /^[一-鿿]+$/;
  let level = 'HSK1', rounds = [], idx = 0, cells = [], locked = false, pool = [], seq = 0;
  const SLOW = [ {
    k: .3,
    t: 'Vừa'
  }, {
    k: .15,
    t: 'Mạnh'
  }, {
    k: 0,
    t: 'Tắt'
  } ];
  let slowIdx = Math.min(2, Math.max(0, +(safeStorage.get('cn_quiz_write_slow') || 0)));
  function labelSlow() {
    const b = $('wr-slow');
    if (b) b.textContent = '🐢 Chuột chậm: ' + SLOW[slowIdx].t;
    document.querySelectorAll('.wr-box').forEach(x => x.classList.toggle('slow', SLOW[slowIdx].k > 0));
  }
  function cycleSlow() {
    slowIdx = (slowIdx + 1) % SLOW.length;
    safeStorage.set('cn_quiz_write_slow', slowIdx);
    labelSlow();
    showToast('Chuột chậm: ' + SLOW[slowIdx].t);
  }
  function swapWord() {
    if (!rounds.length) return;
    const used = new Set(rounds.map(r => r.text));
    let cand;
    if (level === 'Sổ tay') cand = SC().mistakes('char').filter(m => !used.has(m.text)).map(m => ({
      text: m.text,
      pinyin: m.pinyin || '',
      meaning: m.meaning || '',
      level: m.level || ''
    })); else cand = pool.filter(p => !used.has(p.text));
    if (!cand.length) {
      showToast('Không còn chữ khác để đổi');
      return;
    }
    const w = shuffle(cand)[0];
    rounds[idx] = w;
    if (level !== 'Sổ tay') {
      const store = safeStorage.get('cn_quiz_write_seen') || {};
      (store[level] = store[level] || []).push(w.text);
      safeStorage.set('cn_quiz_write_seen', store);
    }
    setRound();
    showToast('🔄 Đã đổi sang chữ khác (không tính điểm chữ cũ)');
  }
  function gather(lv) {
    const out = [], seen = new Set;
    if (typeof hskAll === 'undefined') return out;
    hskAll.forEach(w => {
      if (lv !== 'Tất cả' && w.level !== lv) return;
      const t = String(w.text || '').split(/[\/／,，;；(（]/)[0].trim();
      if (!ONLYHAN.test(t) || t.length > 3 || seen.has(t)) return;
      seen.add(t);
      out.push({
        text: t,
        pinyin: w.pinyin || '',
        meaning: w.meaning || '',
        level: w.level
      });
    });
    return out;
  }
  function build() {
    if ($('write-screen')) return;
    const css = document.createElement('style');
    css.textContent = `\n    #write-screen{display:none;width:100%}\n    .wr-prompt{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px;text-align:center;margin-bottom:14px}\n    .wr-prompt .py{font-size:26px;font-weight:800;color:var(--accent3)} .wr-prompt .mn{margin-top:4px;color:var(--text);line-height:1.45}\n    .wr-cells{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:12px}\n    .wr-cell{width:min(190px,calc((var(--W,100vw) - 64px - 12px*(var(--n,1) - 1))/var(--n,1)));flex:0 0 auto}\n    .wr-box{position:relative;aspect-ratio:1;border:2px solid var(--border);border-radius:var(--radius-md);background:color-mix(in oklab,var(--surface2) 85%,transparent);overflow:hidden}\n    .wr-box.pass{border-color:var(--correct)} .wr-box.fail{border-color:var(--wrong)} .wr-box.err{border-color:var(--fire)}\n    .wr-box canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:crosshair}\n    .wr-grid{position:absolute;inset:0;pointer-events:none;background:\n      linear-gradient(to right,transparent calc(50% - .5px),var(--border) calc(50% - .5px),var(--border) calc(50% + .5px),transparent calc(50% + .5px)),\n      linear-gradient(to bottom,transparent calc(50% - .5px),var(--border) calc(50% - .5px),var(--border) calc(50% + .5px),transparent calc(50% + .5px))}\n    .wr-ghost{position:absolute;inset:0;display:none;align-items:center;justify-content:center;font-family:var(--font-hanzi);font-size:min(130px,calc(var(--W,100vw) * .3));opacity:.18;pointer-events:none}\n    .wr-ghost.on{display:flex}\n    .wr-res{min-height:38px;margin-top:6px;font-size:13px;line-height:1.4;text-align:center;color:var(--muted)}\n    .wr-res b{font-size:18px}\n    .wr-res.pass b{color:var(--correct)} .wr-res.fail b{color:var(--wrong)} .wr-res.err{color:var(--fire)}\n    .wr-tools{display:flex;gap:8px;justify-content:center;margin-top:4px}\n    .wr-tools button{padding:5px 9px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface2);color:var(--text);cursor:pointer;font-size:12px;font-weight:700}\n    .wr-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}\n    .wr-actions button{flex:1;min-width:110px;padding:13px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);color:var(--text);font-weight:800;cursor:pointer;font-family:var(--font-heading)}\n    .wr-actions button.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border:0;color:#fff}\n    .wr-actions button:disabled{opacity:.45;cursor:default}\n    .wr-guide{display:none;margin-top:14px;padding:14px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--surface2);text-align:center}\n    .wr-guide.show{display:block}\n    .wr-guide svg{width:170px;height:170px;background:color-mix(in oklab,var(--surface) 80%,transparent);border-radius:var(--radius-md);border:1px solid var(--border)}\n    .wr-guide .gn{font-size:13px;color:var(--muted);margin-top:8px;line-height:1.5}\n    .wr-guide .gchars{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}\n    .wr-vc{position:absolute;width:14px;height:14px;border-radius:50%;border:2px solid var(--accent);background:color-mix(in oklab,var(--accent) 25%,transparent);pointer-events:none;transform:translate(-50%,-50%);display:none;z-index:3}\n    .wr-box.slow canvas{cursor:none}\n    .wr-note{font-size:12px;color:var(--muted);text-align:center;margin-top:10px;line-height:1.5}\n    @media all{\n      #wr-body>.btn-next{flex:0 0 auto}\n      #write-screen[style*="block"]{gap:clamp(5px,calc(1.1 * var(--hu)),10px)}\n      #wr-lv{margin:0!important;padding:0!important;gap:6px!important;flex-wrap:nowrap}\n      #wr-lv .hsk-tab{padding:6px 11px;font-size:12px;flex:0 0 auto}\n      #wr-body{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;gap:clamp(5px,calc(1.1 * var(--hu)),10px)}\n      #wr-body>*{margin:0!important;flex-shrink:0}\n      .wr-prompt{padding:7px 12px}.wr-prompt .py{font-size:clamp(18px,calc(3.2 * var(--hu)),24px)}.wr-prompt .mn{font-size:13px;margin-top:1px}\n      .wr-cells{flex:1 1 0;min-height:0;align-items:center;gap:8px;container-type:size}\n      .wr-cell{width:min(calc((var(--W,100vw) - 40px - 8px*(var(--n,1) - 1))/var(--n,1)),calc(31 * var(--hu)),calc(100cqh - 40px))}\n      .wr-res{min-height:0;font-size:12px;margin-top:3px}.wr-res b{font-size:15px}\n      .wr-tools{margin-top:2px}.wr-tools button{padding:3px 8px;font-size:11px}\n      .wr-actions{gap:6px}.wr-actions button{min-width:0;flex:1 1 30%;padding:8px 2px;font-size:11.5px}\n      .wr-actions button.primary{flex:1 1 40%}\n      .wr-note{display:none}\n      .wr-guide{margin:0;padding:8px;max-height:calc(30 * var(--hu));overflow:auto}.wr-guide svg{width:110px;height:110px}\n    }`;
    document.head.appendChild(css);
    const d = document.createElement('div');
    d.id = 'write-screen';
    d.innerHTML = `\n      <div class="screen-header"><button class="btn-back" onclick="goHome()">⬅️ Quay lại</button><h2 class="screen-title">✍️ Luyện viết chữ Hán</h2></div>\n      <div class="ord-lv" id="wr-lv" style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:12px"></div>\n      <div id="wr-body">\n        <div class="quiz-header"><span class="mode-badge" id="wr-badge">✍️ Viết chữ</span><span class="question-counter" id="wr-counter">1 / 8</span><div class="header-actions"><button class="btn-icon" id="wr-speak" title="Nghe">🔊</button></div></div>\n        <div class="progress-track"><div class="progress-fill" id="wr-progress" style="width:0%"></div></div>\n        <div class="wr-prompt"><div class="py" id="wr-py"></div><div class="mn" id="wr-mn"></div></div>\n        <div class="wr-cells" id="wr-cells"></div>\n        <div class="wr-actions"><button id="wr-guide-btn">🖌 Thứ tự nét</button><button id="wr-ghost-btn">👁 Chữ mẫu mờ</button><button id="wr-swap">🔄 Đổi chữ</button><button id="wr-slow">🐢 Chuột chậm: Vừa</button><button class="primary" id="wr-check">✔ Kiểm tra</button></div>\n        <div class="wr-guide" id="wr-guide"></div>\n        <button class="btn-next" id="wr-next" style="margin-top:14px">Từ tiếp →</button>\n        <div class="wr-note">Điểm = độ khớp hình dạng với chữ chuẩn (≥80% là đạt, có dung sai cho nét tay). Đây là so khớp hình dạng, không phải AI nhận dạng chữ viết tay. Chuột chậm = làm mượt/chậm nét khi dùng chuột để dễ viết; cảm ứng và bút không bị chậm.</div>\n      </div>`;
    $('result-screen').parentNode.appendChild(d);
    $('wr-check').onclick = checkAll;
    $('wr-next').onclick = next;
    $('wr-guide-btn').onclick = toggleGuide;
    $('wr-swap').onclick = swapWord;
    $('wr-slow').onclick = cycleSlow;
    labelSlow();
    $('wr-ghost-btn').onclick = () => cells.forEach(c => c.ghost.classList.toggle('on'));
    $('wr-speak').onclick = function() {
      if (rounds[idx]) {
        if (!zhVoice) loadVoices();
        speakChinese(rounds[idx].text, this);
      }
    };
  }
  function drawLevels() {
    $('wr-lv').innerHTML = LEVELS.map(l => `<button class="hsk-tab ${l === level ? 'active' : ''}" data-l="${l}">${l}</button>`).join('');
    $('wr-lv').querySelectorAll('button').forEach(b => b.onclick = () => {
      level = b.dataset.l;
      safeStorage.set(LS_LEVEL, level);
      start(level);
    });
  }
  function ensureBody() {
    if (!$('wr-cells')) {
      $('write-screen').remove();
      build();
      show('write-screen');
      drawLevels();
    }
  }
  function open() {
    build();
    level = safeStorage.get(LS_LEVEL) || 'HSK1';
    if (!LEVELS.includes(level)) level = 'HSK1';
    show('write-screen');
    start(level);
  }
  function start(lv) {
    build();
    show('write-screen');
    level = lv;
    drawLevels();
    resetSession();
    currentGameStarter = () => start(level);
    pool = gather(lv);
    if (pool.length < 1) return empty('Chưa có từ vựng ' + lv + ' để luyện viết. Hãy kiểm tra file HSK đã được tải chưa.');
    ensureBody();
    const store = safeStorage.get('cn_quiz_write_seen') || {}, seen = new Set(store[lv] || []);
    const due = SC().mistakes('char').filter(m => m.nextReview <= Date.now()).map(m => pool.find(p => p.text === m.text)).filter(Boolean);
    let fresh = pool.filter(p => !seen.has(p.text));
    if (fresh.length < 8) {
      seen.clear();
      fresh = pool;
    }
    const picked = [];
    const used = new Set;
    const add = w => {
      if (w && !used.has(w.text) && picked.length < 8) {
        used.add(w.text);
        picked.push(w);
      }
    };
    shuffle(due).slice(0, 2).forEach(add);
    shuffle(fresh).forEach(add);
    store[lv] = [ ...seen, ...picked.map(p => p.text) ];
    safeStorage.set('cn_quiz_write_seen', store);
    rounds = picked;
    idx = 0;
    setRound();
  }
  function openMistakes() {
    build();
    show('write-screen');
    level = 'Sổ tay';
    drawLevels();
    const lst = SC().mistakes('char').sort((a, b) => a.nextReview - b.nextReview).slice(0, 8);
    if (!lst.length) return empty('Sổ tay chưa có chữ nào cần viết lại.');
    ensureBody();
    currentGameStarter = () => openMistakes();
    resetSession();
    rounds = lst.map(m => ({
      text: m.text,
      pinyin: m.pinyin || '',
      meaning: m.meaning || '',
      level: m.level || ''
    }));
    idx = 0;
    setRound();
  }
  function empty(msg) {
    $('wr-body').innerHTML = `<div class="ord-empty" style="padding:30px;text-align:center;color:var(--muted)">✍️<br>${escapeHTML(msg)}</div>`;
    rounds = [];
  }
  function setRound() {
    const w = rounds[idx];
    locked = false;
    seq++;
    $('wr-py').textContent = w.pinyin || '';
    $('wr-mn').textContent = w.meaning || '';
    $('wr-counter').textContent = `${idx + 1} / ${rounds.length}`;
    $('wr-progress').style.width = idx / rounds.length * 100 + '%';
    $('wr-next').classList.remove('visible');
    $('wr-guide').className = 'wr-guide';
    $('wr-guide').innerHTML = '';
    $('wr-check').disabled = false;
    try {
      if (window.HanziRecognizer && HanziRecognizer.prefetch) HanziRecognizer.prefetch(w.text);
    } catch (e) {}
    const host = $('wr-cells');
    host.innerHTML = '';
    cells = [];
    host.style.setProperty('--n', [ ...w.text ].length);
    [ ...w.text ].forEach(ch => cells.push(makeCell(host, ch, w)));
  }
  function makeCell(host, ch, word) {
    const el = document.createElement('div');
    el.className = 'wr-cell';
    el.innerHTML = `<div class="wr-box"><div class="wr-grid"></div><div class="wr-ghost">${escapeHTML(ch)}</div><canvas></canvas></div>\n      <div class="wr-tools"><button data-a="undo">↩ Nét</button><button data-a="clear">🗑 Xoá</button></div><div class="wr-res"></div>`;
    host.appendChild(el);
    const cv = el.querySelector('canvas'), box = el.querySelector('.wr-box');
    const c = {
      ch: ch,
      word: word,
      strokes: [],
      cur: null,
      pid: null,
      cv: cv,
      box: box,
      res: el.querySelector('.wr-res'),
      ghost: el.querySelector('.wr-ghost'),
      recorded: false,
      result: null,
      w: 0
    };
    const fit = () => {
      const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      c.w = r.width / FS();
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      redraw(c);
    };
    c.fit = fit;
    setTimeout(fit, 0);
    if (window.ResizeObserver) new ResizeObserver(fit).observe(cv);
    const pt = e => {
      const r = cv.getBoundingClientRect();
      const f = FS();
      return {
        x: (e.clientX - r.left) / f,
        y: (e.clientY - r.top) / f
      };
    };
    const vc = document.createElement('div');
    vc.className = 'wr-vc';
    box.appendChild(vc);
    box.classList.toggle('slow', SLOW[slowIdx].k > 0);
    let tgt = null, vir = null, raf = 0, hover = false;
    const useSlow = e => SLOW[slowIdx].k > 0 && (!e || e.pointerType === 'mouse');
    const showVC = () => {
      if (vir && hover && SLOW[slowIdx].k > 0) {
        vc.style.display = 'block';
        vc.style.left = vir.x + 'px';
        vc.style.top = vir.y + 'px';
      } else vc.style.display = 'none';
    };
    function tick() {
      raf = 0;
      if (!tgt || !vir) return;
      const k = SLOW[slowIdx].k || 1;
      vir.x += (tgt.x - vir.x) * k;
      vir.y += (tgt.y - vir.y) * k;
      if (c.cur) {
        const l = c.cur[c.cur.length - 1];
        if (Math.hypot(vir.x - l.x, vir.y - l.y) > .5) {
          c.cur.push({
            x: vir.x,
            y: vir.y
          });
          redraw(c);
        }
      }
      showVC();
      if (Math.hypot(tgt.x - vir.x, tgt.y - vir.y) > .4) raf = requestAnimationFrame(tick);
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    cv.addEventListener('pointerenter', e => {
      if (e.pointerType !== 'mouse') return;
      hover = true;
      tgt = pt(e);
      vir = {
        x: tgt.x,
        y: tgt.y
      };
      showVC();
    });
    cv.addEventListener('pointerleave', e => {
      if (c.pid !== null) return;
      hover = false;
      vc.style.display = 'none';
    });
    cv.addEventListener('pointerdown', e => {
      if (locked || c.pid !== null || e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      c.pid = e.pointerId;
      try {
        cv.setPointerCapture(e.pointerId);
      } catch (x) {}
      const p0 = pt(e);
      tgt = p0;
      vir = {
        x: p0.x,
        y: p0.y
      };
      hover = e.pointerType === 'mouse';
      c.cur = [ p0 ];
      c.strokes.push(c.cur);
      clearResult(c);
      redraw(c);
      showVC();
    });
    cv.addEventListener('pointermove', e => {
      if (e.pointerType === 'mouse' && !hover) {
        hover = true;
        vir = pt(e);
      }
      if (useSlow(e)) {
        tgt = pt(e);
        if (!vir) vir = {
          x: tgt.x,
          y: tgt.y
        };
        kick();
        return;
      }
      if (e.pointerId !== c.pid || !c.cur) return;
      e.preventDefault();
      const ev = e.getCoalescedEvents ? e.getCoalescedEvents() : [ e ];
      (ev.length ? ev : [ e ]).forEach(x => c.cur.push(pt(x)));
      redraw(c);
    });
    const end = e => {
      if (e.pointerId !== c.pid) return;
      if (c.cur && useSlow(e) && vir) {
        const t = pt(e);
        for (let i = 1; i <= 5; i++) c.cur.push({
          x: vir.x + (t.x - vir.x) * i / 5,
          y: vir.y + (t.y - vir.y) * i / 5
        });
        vir = {
          x: t.x,
          y: t.y
        };
        redraw(c);
      }
      c.pid = null;
      c.cur = null;
    };
    cv.addEventListener('pointerup', end);
    cv.addEventListener('pointercancel', end);
    cv.addEventListener('lostpointercapture', end);
    el.querySelector('[data-a=undo]').onclick = () => {
      if (locked) return;
      c.strokes.pop();
      clearResult(c);
      redraw(c);
    };
    el.querySelector('[data-a=clear]').onclick = () => {
      if (locked) return;
      c.strokes = [];
      clearResult(c);
      redraw(c);
    };
    return c;
  }
  function clearResult(c) {
    c.result = null;
    c.box.className = 'wr-box';
    c.res.className = 'wr-res';
    c.res.textContent = '';
  }
  function redraw(c) {
    const g = c.cv.getContext('2d'), dpr = c.cv.width / (c.w || 1);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, c.cv.width, c.cv.height);
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.lineWidth = Math.max(5, c.w * .045);
    g.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#fff';
    c.strokes.forEach(s => {
      g.beginPath();
      if (s.length === 1) {
        g.arc(s[0].x, s[0].y, g.lineWidth / 2, 0, 7);
        g.fillStyle = g.strokeStyle;
        g.fill();
        return;
      }
      g.moveTo(s[0].x, s[0].y);
      for (let i = 1; i < s.length - 1; i++) {
        const mx = (s[i].x + s[i + 1].x) / 2, my = (s[i].y + s[i + 1].y) / 2;
        g.quadraticCurveTo(s[i].x, s[i].y, mx, my);
      }
      g.lineTo(s[s.length - 1].x, s[s.length - 1].y);
      g.stroke();
    });
  }
  async function checkAll() {
    if (locked) return;
    if (!window.HanziRecognizer || typeof HanziRecognizer.recognize !== 'function') {
      cells.forEach(c => fail(c, 'err', 'Không tải được module nhận diện chữ viết — chưa thể chấm. (Không tự cho đạt.)'));
      return;
    }
    if (cells.some(c => !c.strokes.length)) {
      showToast('Hãy viết đủ tất cả các chữ trước khi kiểm tra');
      return;
    }
    const mine = seq;
    $('wr-check').disabled = true;
    $('wr-check').textContent = '⏳ Đang chấm…';
    const cands = [ ...new Set(pool.flatMap(p => [ ...p.text ])) ];
    let results = [];
    for (const c of cells) {
      const others = shuffle(cands.filter(x => x !== c.ch)).slice(0, 36);
      try {
        results.push(await HanziRecognizer.recognize(c.strokes, c.ch, others));
      } catch (e) {
        results.push({
          ok: false,
          error: 'exception',
          message: 'Lỗi nhận diện: ' + (e && e.message || e)
        });
      }
    }
    if (mine !== seq) return;
    $('wr-check').textContent = '✔ Kiểm tra';
    let allDone = true;
    cells.forEach((c, i) => {
      const r = results[i];
      c.result = r;
      if (!r.ok) {
        fail(c, 'err', r.message || 'Không nhận diện được.');
        allDone = false;
        return;
      }
      const parts = [ `<b>${r.percent}%</b> · ${r.pass ? 'Đạt ✅' : 'Cần viết lại ❌'}` ];
      if (r.note) parts.push(escapeHTML(r.note));
      if (r.strokeInfo && r.strokeInfo.expected !== r.strokeInfo.got) parts.push(`Chữ có ${r.strokeInfo.expected} nét, bạn viết ${r.strokeInfo.got}`);
      if (r.strokeCheck && r.strokeCheck.issues && r.strokeCheck.issues.length) r.strokeCheck.issues.forEach(x => parts.push('⚠️ ' + escapeHTML(x.msg))); else if (r.strokeCheck && r.strokeCheck.checked) parts.push('✔ Thứ tự & hướng nét đúng');
      c.box.className = 'wr-box ' + (r.pass ? 'pass' : 'fail');
      c.res.className = 'wr-res ' + (r.pass ? 'pass' : 'fail');
      c.res.innerHTML = parts.join('<br>');
      settle(c, r);
    });
    $('wr-check').disabled = false;
    if (allDone) {
      $('wr-next').classList.add('visible');
      $('wr-next').textContent = idx + 1 >= rounds.length ? 'Xem kết quả →' : 'Từ tiếp →';
      locked = cells.every(c => c.result && c.result.ok && c.result.pass) ? true : false;
      if (locked) {
        $('wr-check').disabled = true;
      }
    }
  }
  function fail(c, cls, msg) {
    c.box.className = 'wr-box ' + cls;
    c.res.className = 'wr-res ' + cls;
    c.res.textContent = '⚠️ ' + msg;
  }
  function settle(c, r) {
    if (c.recorded) {
      if (r.pass) SC().mistakeRight('char', c.ch);
      return;
    }
    c.recorded = true;
    const w = c.word, item = {
      text: c.ch,
      pinyin: w.pinyin || '',
      meaning: w.meaning ? `trong từ ${w.text}: ${w.meaning}` : '',
      level: w.level || ''
    };
    const rec = SC().record('write', c.ch, r.pass, item, [ 'asked' ].concat(r.pass ? [ 'pass' ] : [ 'retry' ]));
    if (r.pass) {
      SC().mistakeRight('char', c.ch);
      score++;
    } else SC().mistakeWrong('char', c.ch, {
      text: c.ch,
      pinyin: w.pinyin || '',
      meaning: item.meaning || 'chữ trong ' + w.text,
      level: w.level || '',
      note: `Điểm lần gần nhất ${r.percent}%`
    });
  }
  function next() {
    if (!$('wr-next').classList.contains('visible')) return;
    idx++;
    if (idx >= rounds.length) {
      const ok = sessionLog.filter(x => x.ok).length, tot = sessionLog.length;
      showFinal({
        score: ok,
        totalText: '/ ' + tot,
        pct: tot ? ok / tot * 100 : 0,
        title: 'Hoàn thành Luyện viết',
        sub: 'Chữ đã luyện hôm nay không cộng XP lần nữa'
      });
      document.getElementById('btn-practice-wrong').classList.remove('show');
      window._lastWrongTexts = [];
      return;
    }
    setRound();
  }
  async function toggleGuide() {
    const g = $('wr-guide');
    if (g.classList.contains('show')) {
      g.classList.remove('show');
      return;
    }
    const w = rounds[idx];
    g.className = 'wr-guide show';
    g.innerHTML = '<div class="gn">⏳ Đang tải dữ liệu nét…</div>';
    const parts = [];
    let missing = false;
    for (const ch of w.text) {
      let data = null;
      try {
        data = window.HanziRecognizer && await HanziRecognizer.getStrokeData(ch);
      } catch (e) {}
      if (!data) {
        missing = true;
        parts.push(`<div><div style="font-family:var(--font-hanzi);font-size:110px;line-height:1.1;opacity:.6">${escapeHTML(ch)}</div></div>`);
        continue;
      }
      const paths = data.strokes.map((d, i) => `<path d="${d}" fill="var(--accent)" opacity="0" data-i="${i}"/>`).join('');
      parts.push(`<svg viewBox="0 0 1024 1024" data-ch="${escapeHTML(ch)}"><g transform="scale(1,-1) translate(0,-900)">${paths}</g></svg>`);
    }
    g.innerHTML = `<div class="gchars">${parts.join('')}</div><div class="gn">${missing ? 'Chưa tải được dữ liệu thứ tự nét (cần mạng tới CDN hanzi-writer-data; module đã sẵn sàng nhận dữ liệu này). Đang hiện chữ mẫu thay thế.' : 'Các nét hiện lần lượt theo đúng thứ tự viết. Bấm lại để xem lần nữa.'}</div>`;
    g.querySelectorAll('svg').forEach(svg => {
      const ps = [ ...svg.querySelectorAll('path') ];
      ps.forEach((p, i) => setTimeout(() => {
        p.style.transition = 'opacity .3s';
        p.setAttribute('opacity', '1');
      }, 350 + i * 600));
    });
  }
  window.WriteMode = {
    open: open,
    start: start,
    openMistakes: openMistakes,
    gather: gather,
    _cells: () => cells,
    _state: () => ({
      rounds: rounds,
      idx: idx
    })
  };
})();

(function() {
  'use strict';
  const LS_LEVEL = 'cn_quiz_pinyin_level', LS_SEEN = 'cn_quiz_pinyin_seen', LS_KIND = 'cn_quiz_pinyin_kind';
  const LEVELS = [ 'HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'Tất cả' ];
  const KINDS = [ [ 'mix', '🎲 Trộn' ], [ 'listen', '🎧 Nghe' ], [ 'meaning', '📖 Nghĩa' ] ];
  const SC = () => window.StudyCore;
  const $ = id => document.getElementById(id);
  const V = 'aeiouv', isV = c => !!c && V.includes(c);
  const TONE = {};
  [ [ 'a', 'āáǎà' ], [ 'e', 'ēéěè' ], [ 'i', 'īíǐì' ], [ 'o', 'ōóǒò' ], [ 'u', 'ūúǔù' ], [ 'v', 'ǖǘǚǜ' ] ].forEach(([b, s]) => [ ...s ].forEach((c, i) => TONE[c] = [ b, i + 1 ]));
  function fold(str) {
    let base = '', tone = [];
    for (const c0 of String(str).toLowerCase()) {
      const c = c0 === 'ü' ? 'v' : c0;
      if (TONE[c]) {
        base += TONE[c][0];
        tone.push(TONE[c][1]);
      } else {
        base += c;
        tone.push(0);
      }
    }
    return {
      base: base,
      tone: tone
    };
  }
  function splitSyl(s) {
    const out = [];
    let i = 0;
    while (i < s.length) {
      const st = i;
      if (/^(zh|ch|sh)/.test(s.slice(i, i + 2))) i += 2; else if (!isV(s[i])) i += 1;
      while (i < s.length && isV(s[i])) i++;
      if (i < s.length) {
        if (s.startsWith('ng', i) && !isV(s[i + 2])) i += 2; else if (s[i] === 'n' && !isV(s[i + 1])) i += 1; else if (s[i] === 'r' && !isV(s[i + 1]) && i > st) i += 1;
      }
      out.push([ st, i ]);
    }
    return out;
  }
  function parseTarget(py) {
    const first = String(py || '').replace(/[\[［].*?[\]］]/g, '').replace(/[（(].*?[）)]/g, '').split(/[\/／]/)[0];
    const syl = [], tones = [];
    first.split(/[\s'’\-·,，]+/).forEach(chunk => {
      chunk = chunk.replace(/[^a-zA-ZāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüÜ]/g, '');
      if (!chunk) return;
      const f = fold(chunk);
      splitSyl(f.base).forEach(([a, b]) => {
        syl.push(f.base.slice(a, b));
        tones.push(f.tone.slice(a, b).find(t => t) || 0);
      });
    });
    return {
      syl: syl,
      tones: tones,
      key: syl.join('')
    };
  }
  function parseInput(raw) {
    const syl = [], tones = [];
    let buf = '';
    const flush = d => {
      if (!buf) return;
      const f = fold(buf);
      buf = '';
      const parts = splitSyl(f.base);
      parts.forEach(([a, b], k) => {
        syl.push(f.base.slice(a, b));
        const mark = f.tone.slice(a, b).find(t => t);
        tones.push(mark ? mark : k === parts.length - 1 && d != null ? d : null);
      });
    };
    const s = String(raw || '').toLowerCase().replace(/u:/g, 'v');
    for (const c of s) {
      if (/[0-5]/.test(c)) flush(Number(c)); else if (/[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüv]/.test(c)) buf += c; else flush(null);
    }
    flush(null);
    return {
      syl: syl,
      tones: tones,
      key: syl.join(''),
      hasTone: tones.some(t => t !== null)
    };
  }
  const numbered = t => t.syl.map((s, i) => s.replace(/v/g, 'ü') + (t.tones[i] || '')).join(' ');
  let idx = null, idxSig = '';
  const LV = {
    HSK1: 1,
    HSK2: 2,
    HSK3: 3,
    HSK4: 4,
    HSK5: 5,
    HSK6: 6
  };
  function lexicon() {
    const sig = (typeof hskAll !== 'undefined' ? hskAll.length : 0) + ':' + (window.dictWords ? window.dictWords.length : 0);
    if (idx && sig === idxSig) return idx;
    const map = new Map, seen = new Set, list = [];
    const add = (text, pinyin, meaning, level) => {
      text = String(text || '').split(/[\/／,，;；(（]/)[0].replace(/[~～…\s]/g, '');
      if (!text || !/^[一-鿿]{1,6}$/.test(text)) return;
      const t = parseTarget(pinyin);
      if (!t.syl.length || t.syl.length !== [ ...text ].length && Math.abs(t.syl.length - [ ...text ].length) > 1) return;
      if (seen.has(text + '|' + t.key)) return;
      seen.add(text + '|' + t.key);
      const e = {
        text: text,
        pinyin: String(pinyin || ''),
        meaning: String(meaning || '').trim(),
        level: level || 'Data',
        key: t.key,
        syl: t.syl,
        tones: t.tones,
        rank: LV[level] || 7
      };
      (map.get(e.key) || map.set(e.key, []).get(e.key)).push(e);
      list.push(e);
    };
    if (typeof hskAll !== 'undefined') hskAll.forEach(w => add(w.text, w.pinyin, w.meaning, w.level));
    (window.dictWords || []).forEach(w => add(w.text, w.pinyin, w.meaning, 'Data'));
    map.forEach(a => a.sort((x, y) => x.rank - y.rank || x.text.length - y.text.length));
    idx = {
      map: map,
      list: list
    };
    idxSig = sig;
    return idx;
  }
  function candidates(inp) {
    if (!inp.key) return {
      list: [],
      loose: false
    };
    const all = lexicon().map.get(inp.key) || [];
    if (!inp.hasTone) return {
      list: all,
      loose: false
    };
    const ok = all.filter(e => e.syl.length === inp.syl.length && inp.tones.every((t, i) => t === null || (t === 5 ? 0 : t) === e.tones[i]));
    return ok.length ? {
      list: ok,
      loose: false
    } : {
      list: all,
      loose: true
    };
  }
  let level = 'HSK1', kind = safeStorage.get(LS_KIND) || 'mix', rounds = [], i = 0, st = null, locked = false, cur = {
    list: [],
    loose: false
  }, parsed = null;
  if (!KINDS.some(k => k[0] === kind)) kind = 'mix';
  function gather(lv) {
    const out = [];
    lexicon().list.forEach(e => {
      if ((lv === 'Tất cả' || e.level === lv) && e.meaning && e.syl.length >= 1 && e.syl.length <= 4 && [ ...e.text ].length === e.syl.length) out.push(e);
    });
    return out;
  }
  function pick(pool, n) {
    const store = safeStorage.get(LS_SEEN) || {}, seen = new Set(store[level] || []);
    let fresh = pool.filter(p => !seen.has(p.text));
    if (fresh.length < n) {
      seen.clear();
      fresh = pool;
    }
    const chosen = shuffle(fresh).slice(0, n);
    store[level] = [ ...seen, ...chosen.map(c => c.text) ];
    safeStorage.set(LS_SEEN, store);
    return chosen;
  }
  function build() {
    if ($('pinyin-screen')) return;
    const css = document.createElement('style');
    css.textContent = `\n    #pinyin-screen{display:none;width:100%}\n    .pn-lv{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:12px}\n    .pn-prompt{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px;text-align:center}\n    .pn-prompt .lbl{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);font-weight:800}\n    .pn-prompt .vi{font-size:22px;font-weight:700;line-height:1.4;margin-top:6px}\n    .pn-prompt .pn-speak{margin-top:6px}\n    .pn-in{width:100%;box-sizing:border-box;padding:14px 16px;border-radius:var(--radius-md);border:2px solid var(--border);background:var(--surface);color:var(--text);font:700 22px var(--font-body);letter-spacing:.02em;outline:none}\n    .pn-in:focus{border-color:var(--accent)}\n    .pn-in.good{border-color:var(--correct)} .pn-in.bad{border-color:var(--wrong)}\n    .pn-tip{font-size:12px;color:var(--muted);line-height:1.5}\n    .pn-cands{display:flex;flex-wrap:wrap;gap:8px;align-content:flex-start;min-height:60px}\n    .pn-cand{display:flex;flex-direction:column;align-items:center;gap:1px;padding:8px 14px;border-radius:var(--radius-md);background:var(--surface2);border:1px solid var(--border);color:var(--text);cursor:pointer;min-width:64px;max-width:48%}\n    .pn-cand:hover,.pn-cand.first{border-color:var(--accent)}\n    .pn-cand .h{font-family:var(--font-hanzi);font-size:26px;font-weight:700;line-height:1.1}\n    .pn-cand .p{font-size:11px;color:var(--accent3);font-weight:700}\n    .pn-cand .m{font-size:10.5px;color:var(--muted);max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n    .pn-cand.loose{opacity:.6}\n    .pn-cand.ok{border-color:var(--correct);background:color-mix(in oklab,var(--correct) 18%,var(--surface2))}\n    .pn-cand.bad{border-color:var(--wrong);background:color-mix(in oklab,var(--wrong) 18%,var(--surface2))}\n    .pn-msg{font-size:13px;color:var(--muted);padding:6px 2px}\n    .pn-actions{display:flex;gap:8px;flex-wrap:wrap}\n    .pn-actions button{flex:1;min-width:90px;padding:11px 6px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);color:var(--text);font-weight:800;cursor:pointer;font-family:var(--font-heading);font-size:13px}\n    .pn-actions button:disabled{opacity:.45;cursor:default}\n    .pn-fb{display:none;padding:12px 14px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);line-height:1.55}\n    .pn-fb.show{display:block} .pn-fb.good{border-color:var(--correct)} .pn-fb.bad{border-color:var(--wrong)}\n    .pn-fb .han{font-family:var(--font-hanzi);font-size:24px;font-weight:700}\n    .pn-fb .py{color:var(--accent3);font-size:14px}\n    .pn-fb .note{font-size:12.5px;color:var(--muted);margin-top:6px}\n    @media all{\n      #pinyin-screen[style*="block"]{gap:clamp(5px,calc(1.1 * var(--hu)),10px)}\n      #pinyin-screen .screen-header{margin:0}\n      .pn-lv{margin:0!important;padding:0!important;gap:6px!important;flex-wrap:nowrap}\n      .pn-lv .hsk-tab{padding:6px 11px;font-size:12px;flex:0 0 auto}\n      #pn-body{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;gap:clamp(5px,calc(1.1 * var(--hu)),10px)}\n      #pn-body>*{margin:0!important;flex-shrink:0}\n      .pn-prompt{padding:9px 12px}.pn-prompt .vi{font-size:clamp(16px,calc(2.8 * var(--hu)),22px);margin-top:3px}\n      .pn-in{padding:10px 12px;font-size:20px}\n      .pn-cands{flex:1 1 0;min-height:0;overflow-y:auto;scrollbar-width:none;gap:6px}\n      .pn-cand{padding:5px 10px}.pn-cand .h{font-size:22px}\n      .pn-actions{gap:6px}.pn-actions button{padding:9px 4px;min-width:0;font-size:12px}\n      .pn-fb{padding:8px 10px;font-size:12px;max-height:calc(24 * var(--hu));overflow-y:auto}.pn-fb .han{font-size:19px}\n      #pn-body>.btn-next{flex:0 0 auto}\n    }`;
    document.head.appendChild(css);
    const d = document.createElement('div');
    d.id = 'pinyin-screen';
    d.innerHTML = `\n      <div class="screen-header"><button class="btn-back" onclick="goHome()">⬅️ Quay lại</button><h2 class="screen-title">⌨️ Gõ pinyin</h2></div>\n      <div class="pn-lv" id="pn-lv"></div>\n      <div id="pn-body">\n        <div class="quiz-header"><span class="mode-badge" id="pn-badge">⌨️ Gõ pinyin</span><span class="question-counter" id="pn-counter">1 / 10</span><div class="header-actions"></div></div>\n        <div class="progress-track"><div class="progress-fill" id="pn-progress" style="width:0%"></div></div>\n        <div class="pn-prompt"><div class="lbl" id="pn-lbl"></div><div class="vi" id="pn-vi"></div><div class="pn-speak" id="pn-speakrow"><button class="btn-speak" id="pn-speak" type="button">🔊</button> <button class="tts-rate-btn" id="pn-rate" type="button">🚶 0.85x</button><button class="tts-rate-btn tts-replay" id="pn-replay" type="button">🔊 Nghe lại</button></div></div>\n        <input class="pn-in" id="pn-in" type="text" inputmode="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="gõ pinyin: ni3 hao3 hoặc nihao">\n        <div class="pn-tip">Thanh điệu gõ số 1-5 sau mỗi âm (ni3 hao3) hoặc bỏ qua (nihao) · ü gõ v (nv) · Enter chọn chữ đầu · chọn đúng chữ Hán.</div>\n        <div class="pn-cands" id="pn-cands"></div>\n        <div class="pn-actions"><button id="pn-hint">💡 Gợi ý</button><button id="pn-kind">🎲 Trộn</button><button id="pn-show">👁 Đáp án</button></div>\n        <div class="pn-fb" id="pn-fb"></div>\n        <button class="btn-next" id="pn-next">Câu tiếp →</button>\n      </div>`;
    $('result-screen').parentNode.appendChild(d);
    $('pn-in').addEventListener('input', onInput);
    $('pn-in').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (locked) next(); else if (cur.list.length) choose(cur.list[0]);
      } else if (e.key === 'Escape') {
        $('pn-in').value = '';
        onInput();
      }
    });
    $('pn-hint').onclick = hint;
    $('pn-show').onclick = showAnswer;
    $('pn-next').onclick = next;
    $('pn-kind').onclick = () => {
      kind = KINDS[(KINDS.findIndex(k => k[0] === kind) + 1) % KINDS.length][0];
      safeStorage.set(LS_KIND, kind);
      start(level);
    };
    $('pn-speak').onclick = speak;
    $('pn-rate').onclick = () => cycleTTSRate(speak);
    $('pn-replay').onclick = speak;
  }
  function drawLevels() {
    $('pn-lv').innerHTML = custom ? `<span class="pn-msg">${escapeHTML(custom.title || 'Luyện tập')}</span>` : LEVELS.map(l => `<button class="hsk-tab ${l === level ? 'active' : ''}" data-l="${l}">${l}</button>`).join('');
    $('pn-lv').querySelectorAll('button').forEach(b => b.onclick = () => {
      level = b.dataset.l;
      safeStorage.set(LS_LEVEL, level);
      start(level);
    });
    const k = KINDS.find(x => x[0] === kind);
    $('pn-kind').textContent = k[1];
  }
  function open() {
    build();
    level = safeStorage.get(LS_LEVEL) || 'HSK1';
    if (!LEVELS.includes(level)) level = 'HSK1';
    start(level);
  }
  let custom = null;
  function start(lv, opts) {
    custom = opts && opts.pool ? opts : null;
    build();
    show('pinyin-screen');
    level = lv;
    drawLevels();
    resetSession();
    currentGameStarter = () => start(level, custom);
    const pool = custom ? custom.pool : gather(lv);
    if (pool.length < 3) {
      $('pn-body').innerHTML = `<div class="pn-msg" style="text-align:center;padding:30px 10px">Chưa đủ từ cho ${escapeHTML(lv)}. Hãy chắc chắn file HSK tương ứng đã được tải.</div>`;
      return;
    }
    if (!$('pn-in')) {
      $('pinyin-screen').remove();
      build();
      show('pinyin-screen');
      drawLevels();
    }
    rounds = custom ? shuffle(pool.slice()).slice(0, custom.n || 10) : pick(pool, 10);
    i = 0;
    setRound();
  }
  const canSpeak = () => typeof ttsSupported !== 'undefined' && ttsSupported && typeof voiceEnabled !== 'undefined' && voiceEnabled;
  function setRound() {
    const it = rounds[i];
    const k = kind === 'mix' ? Math.random() < .5 ? 'listen' : 'meaning' : kind;
    st = {
      item: it,
      kind: canSpeak() || k === 'meaning' ? k : 'meaning',
      hinted: false,
      recorded: false,
      tries: 0
    };
    locked = false;
    parsed = null;
    cur = {
      list: [],
      loose: false
    };
    $('pn-counter').textContent = `${i + 1} / ${rounds.length}`;
    $('pn-progress').style.width = i / rounds.length * 100 + '%';
    $('pn-fb').className = 'pn-fb';
    $('pn-fb').innerHTML = '';
    $('pn-next').classList.remove('visible');
    const inp = $('pn-in');
    inp.value = '';
    inp.disabled = false;
    inp.className = 'pn-in';
    $('pn-hint').disabled = false;
    $('pn-show').disabled = false;
    drawPrompt();
    renderCands();
    setTimeout(() => {
      try {
        inp.focus({
          preventScroll: true
        });
      } catch (e) {
        inp.focus();
      }
    }, 50);
    if (st.kind === 'listen') setTimeout(() => {
      if (st && st.item === it && !locked) speak();
    }, 350);
  }
  function drawPrompt() {
    const lis = st.kind === 'listen';
    $('pn-lbl').textContent = lis ? 'Nghe rồi gõ pinyin, chọn chữ Hán' : 'Gõ pinyin của từ có nghĩa:';
    $('pn-vi').textContent = lis && !st.showMeaning ? '❓' : st.item.meaning;
    $('pn-speakrow').style.display = lis ? '' : 'none';
    $('pn-badge').textContent = lis ? '🎧 Nghe · gõ' : '📖 Nghĩa · gõ';
    refreshTTSBtns();
  }
  function speak() {
    if (!st) return;
    if (!zhVoice) loadVoices();
    speakChinese(st.item.text, $('pn-speak'));
  }
  function onInput() {
    if (locked) return;
    parsed = parseInput($('pn-in').value);
    cur = candidates(parsed);
    $('pn-in').className = 'pn-in';
    $('pn-fb').className = 'pn-fb';
    renderCands();
  }
  function renderCands() {
    const box = $('pn-cands');
    if (!parsed || !parsed.key) {
      box.innerHTML = '<div class="pn-msg">Chữ Hán ứng viên sẽ hiện ở đây khi bạn gõ pinyin…</div>';
      return;
    }
    if (!cur.list.length) {
      box.innerHTML = `<div class="pn-msg">Không có từ nào đọc là “${escapeHTML(parsed.syl.join(' '))}”. Kiểm tra lại chính tả pinyin.</div>`;
      return;
    }
    const note = cur.loose ? '<div class="pn-msg" style="width:100%">Không có từ nào khớp thanh điệu bạn gõ — đang hiện các từ cùng âm:</div>' : '';
    box.innerHTML = note + cur.list.slice(0, 12).map((e, n) => `<button type="button" class="pn-cand ${n === 0 ? 'first' : ''} ${cur.loose ? 'loose' : ''}" data-n="${n}"><span class="h">${escapeHTML(e.text)}</span><span class="p">${escapeHTML(numbered(e))}</span><span class="m">${escapeHTML(e.meaning)}</span></button>`).join('');
    box.querySelectorAll('.pn-cand').forEach(b => b.onclick = () => choose(cur.list[Number(b.dataset.n)], b));
  }
  function hint() {
    if (locked || !st) return;
    st.hinted = true;
    st.showMeaning = true;
    drawPrompt();
    const t = parseTarget(st.item.pinyin);
    const fb = $('pn-fb');
    fb.className = 'pn-fb show';
    fb.innerHTML = `<b>💡 Gợi ý</b><div class="note">${t.syl.length} âm tiết · bắt đầu bằng “${escapeHTML(t.key[0] || '')}” · thanh điệu: ${t.tones.map(x => x || 'nhẹ').join('-')}. Câu có dùng gợi ý không tính điểm.</div>`;
  }
  function settle(ok) {
    st.recorded = true;
    const it = st.item, item = {
      text: it.text,
      pinyin: it.pinyin,
      meaning: it.meaning,
      level: it.level === 'Data' ? 'Khác' : it.level
    };
    SC().record('pinyin', it.text, ok, item, [ 'asked' ].concat(ok ? [ 'correct' ] : []));
    if (ok) SC().mistakeRight('pinyin', it.text); else SC().mistakeWrong('pinyin', it.text, {
      text: it.text,
      pinyin: it.pinyin,
      meaning: it.meaning,
      level: it.level === 'Data' ? '' : it.level
    });
  }
  function same(e) {
    const it = st.item, k = parseTarget(it.pinyin).key;
    return e.key === k && (e.text === it.text || e.meaning === it.meaning);
  }
  function choose(e, btn) {
    if (locked || !e) return;
    const it = st.item, t = parseTarget(it.pinyin), fb = $('pn-fb');
    st.tries++;
    if (same(e)) {
      const toneBad = parsed && parsed.hasTone && parsed.syl.length === t.syl.length && parsed.tones.some((x, n) => x !== null && (x === 5 ? 0 : x) !== t.tones[n]);
      if (toneBad) {
        if (!st.recorded && !st.hinted) settle(false);
        $('pn-in').className = 'pn-in bad';
        fb.className = 'pn-fb show bad';
        fb.innerHTML = `<b>⚠️ Đúng chữ nhưng sai thanh điệu</b><div class="note">Bạn gõ ${escapeHTML(parsed.syl.map((s, n) => s + (parsed.tones[n] || '')).join(' '))}, đúng là <b>${escapeHTML(numbered(t))}</b>. Gõ lại với thanh đúng.</div>`;
        return;
      }
      if (!st.recorded && !st.hinted) settle(true);
      locked = true;
      $('pn-in').className = 'pn-in good';
      if (btn) btn.classList.add('ok');
      success(true);
    } else {
      if (!st.recorded && !st.hinted) settle(false);
      if (btn) btn.classList.add('bad');
      $('pn-in').className = 'pn-in bad';
      fb.className = 'pn-fb show bad';
      const homo = e.key === t.key;
      fb.innerHTML = `<b>❌ ${homo ? 'Đúng cách đọc nhưng sai chữ Hán' : 'Chưa đúng'}</b><div class="note">${homo ? `Đề cần từ có nghĩa “${escapeHTML(it.meaning)}”. Thử chữ khác trong danh sách.` : 'Hãy nghe/đọc lại nghĩa, sửa pinyin rồi chọn lại, hoặc bấm “Đáp án”.'}</div>`;
    }
  }
  function success(ok) {
    const it = st.item, t = parseTarget(it.pinyin), fb = $('pn-fb');
    fb.className = 'pn-fb show ' + (ok ? 'good' : 'bad');
    fb.innerHTML = `<b>${ok ? '✅ Chính xác!' : 'Đáp án'}</b><div class="han">${escapeHTML(it.text)}</div><div class="py">${escapeHTML(it.pinyin)} · gõ: <b>${escapeHTML(numbered(t))}</b> hoặc <b>${escapeHTML(t.key.replace(/v/g, 'v'))}</b></div><div>${escapeHTML(it.meaning)}</div>` + (st.hinted ? '<div class="note">Đã dùng gợi ý nên không tính điểm.</div>' : '');
    $('pn-in').disabled = true;
    $('pn-hint').disabled = true;
    $('pn-show').disabled = true;
    locked = true;
    st.showMeaning = true;
    drawPrompt();
    const nx = $('pn-next');
    nx.classList.add('visible');
    nx.textContent = i + 1 >= rounds.length ? 'Xem kết quả →' : 'Câu tiếp →';
    if (typeof autoSpeakQ !== 'undefined' && autoSpeakQ) {
      try {
        speakChinese(it.text);
      } catch (e) {}
    }
  }
  function showAnswer() {
    if (locked || !st) return;
    if (!st.recorded && !st.hinted) settle(false);
    st.hinted = true;
    success(false);
  }
  function next() {
    if (!locked) return;
    i++;
    if (i >= rounds.length) {
      const ok = sessionLog.filter(x => x.ok).length, tot = sessionLog.length;
      if (PM.onFinish) {
        const f = PM.onFinish;
        PM.onFinish = null;
        f({
          ok: ok,
          total: tot
        });
        return;
      }
      showFinal({
        score: ok,
        totalText: '/ ' + (tot || rounds.length),
        pct: tot ? ok / tot * 100 : 0,
        title: 'Hoàn thành Gõ pinyin',
        sub: 'Từ đã làm hôm nay không cộng thêm điểm'
      });
      const b = document.getElementById('btn-practice-wrong');
      if (b) b.classList.remove('show');
      window._lastWrongTexts = [];
      return;
    }
    setRound();
  }
  document.addEventListener('keydown', e => {
    const sc = $('pinyin-screen');
    if (!sc || sc.style.display !== 'block' || !st) return;
    if (e.key === 'Enter' && locked && document.activeElement !== $('pn-in')) {
      e.preventDefault();
      next();
    }
  });
  function openMistakes() {
    build();
    const L = lexicon().list;
    const due = SC().mistakes('pinyin').sort((a, b) => a.nextReview - b.nextReview).slice(0, 10).map(m => L.find(e => e.text === m.text) || (m.pinyin ? Object.assign({
      key: parseTarget(m.pinyin).key,
      level: m.level || 'Data'
    }, m, {
      syl: parseTarget(m.pinyin).syl,
      tones: parseTarget(m.pinyin).tones
    }) : null)).filter(e => e && e.key);
    if (due.length < 1) {
      show('pinyin-screen');
      drawLevels();
      $('pn-body').innerHTML = '<div class="pn-msg" style="text-align:center;padding:30px 10px">Chưa có từ gõ sai nào để ôn. 🎉</div>';
      return;
    }
    start('Sổ tay', {
      pool: due,
      n: due.length,
      title: '📒 Ôn từ gõ sai'
    });
  }
  const PM = window.PinyinMode = {
    open: open,
    start: start,
    openMistakes: openMistakes,
    build: build,
    lexicon: lexicon,
    numbered: numbered,
    fold: fold,
    splitSyl: splitSyl,
    parseInput: parseInput,
    parseTarget: parseTarget,
    candidates: candidates,
    _state: () => ({
      st: st,
      rounds: rounds,
      i: i,
      parsed: parsed,
      cur: cur
    })
  };
  PM.onFinish = null;
})();

(function() {
  'use strict';
  const PM = () => window.PinyinMode, $ = id => document.getElementById(id);
  const esc = s => escapeHTML(String(s == null ? '' : s));
  const HANRE = /[一-鿿]/;
  const PYRE = /^[a-zA-Z0-9üÜ:'’\s\-āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+$/;
  const norm = s => String(s || '').normalize('NFC').toLowerCase().replace(/[.,!?;:"“”'‘’()（）。，！？、；：…\-–—]/g, ' ').replace(/\s+/g, ' ').trim();
  const clean = py => String(py || '').split(/[\/／]/)[0].replace(/[\[［(（].*?[\]］)）]/g, '').trim();
  const sKey = t => String(t || '').replace(/[^一-鿿a-zA-Z0-9]/g, '');
  const vKey = t => stripDiacritics(norm(t)).replace(/[^a-z0-9]/g, '');
  function glossesOf(e) {
    if (e._gl) return e._gl;
    const g = String(e.meaning || '').replace(/\([^)]*\)|（[^）]*）/g, ' ').split(/[;,\/、；，]/).map(x => x.trim()).filter(x => x && x.length <= 40);
    return e._gl = g.length ? g : [ String(e.meaning || '').trim() ];
  }
  function lev(a, b) {
    const m = a.length, n = b.length, d = Array.from({
      length: m + 1
    }, (_, i) => [ i ]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  let X = null, sig = '';
  function index() {
    const L = PM().lexicon(), s = L.list.length + ':' + (window.dictIndex || []).length;
    if (X && s === sig) return X;
    const zh = new Map, g1 = new Map, g2 = new Map, syls = new Map;
    const put = (m, k, v) => (m.get(k) || m.set(k, []).get(k)).push(v);
    const have = new Set(L.list.map(e => e.text + '|' + e.key)), phr = [];
    (window.dictIndex || []).forEach(d => {
      const han = String(d.text || '').replace(/[^一-鿿]/g, '');
      if (han.length < 2 || han.length > 14 || !d.meaning || !String(d.meaning).trim()) return;
      const t = PM().parseTarget(d.pinyin), er = (han.match(/儿/g) || []).length;
      if (!t.syl.length || t.syl.length !== han.length && t.syl.length !== han.length - er) return;
      if (have.has(han + '|' + t.key)) return;
      have.add(han + '|' + t.key);
      phr.push({
        text: han,
        pinyin: String(d.pinyin),
        meaning: String(d.meaning).trim(),
        level: 'Data',
        key: t.key,
        syl: t.syl,
        tones: t.tones,
        rank: 7
      });
    });
    const map = new Map;
    L.map.forEach((a, k) => map.set(k, a.slice()));
    phr.forEach(e => put(map, e.key, e));
    const ALL = L.list.concat(phr);
    ALL.forEach(e => {
      put(zh, e.text, e);
      glossesOf(e).forEach((g, pos) => {
        const a = norm(g);
        if (!a) return;
        put(g1, a, {
          e: e,
          pos: pos
        });
        put(g2, stripDiacritics(a), {
          e: e,
          pos: pos
        });
      });
      e.syl.forEach(y => syls.set(y, (syls.get(y) || 0) + 1));
    });
    zh.forEach(a => a.sort((x, y) => x.rank - y.rank));
    const rk = m => m.forEach(a => a.sort((x, y) => x.pos - y.pos || x.e.rank - y.e.rank || x.e.text.length - y.e.text.length));
    rk(g1);
    rk(g2);
    const sz = new Map, sv = new Map, sl = [];
    const addS = (text, pinyin, meaning, level) => {
      text = String(text || '').trim();
      meaning = String(meaning || '').trim();
      if (!text || !meaning || !HANRE.test(text)) return;
      const k = sKey(text);
      if (sz.has(k)) return;
      const it = {
        text: text,
        pinyin: String(pinyin || ''),
        meaning: meaning,
        level: level || '',
        vk: vKey(meaning)
      };
      sz.set(k, it);
      sv.set(it.vk, it);
      sl.push(it);
    };
    if (typeof hskAll !== 'undefined') hskAll.forEach(w => {
      if (w.example) addS(w.example, w.examplePinyin, w.exampleMeaning, w.level);
    });
    (window.dictIndex || []).forEach(x => addS(x.text, x.pinyin, x.meaning, 'Data'));
    try {
      const PART_H = new Set([ ...'啊吧呢吗了啦呀哦嘛哇' ]), PART_V = new Set([ 'nhỉ', 'nhé', 'à', 'ạ', 'hả', 'hử', 'nhá', 'nha', 'nè' ]);
      const segL = text => {
        const ch = [ ...text ].filter(c => HANRE.test(c)), n = ch.length, best = new Array(n + 1).fill(Infinity), prv = new Array(n + 1).fill(0);
        best[0] = 0;
        for (let i = 0; i < n; i++) {
          if (best[i] === Infinity) continue;
          for (let l = 1; l <= 3 && i + l <= n; l++) {
            const c = zh.get(ch.slice(i, i + l).join(''));
            const cost = c ? 1 - .12 * (l - 1) : l === 1 ? 2.5 : Infinity;
            if (best[i] + cost < best[i + l]) {
              best[i + l] = best[i] + cost;
              prv[i + l] = i;
            }
          }
        }
        const out = [];
        let q, p = n;
        while (p > 0) {
          q = prv[p];
          const t = ch.slice(q, p).join('');
          out.unshift({
            t: t,
            s: q,
            e: zh.get(t) || null
          });
          p = q;
        }
        return {
          toks: out,
          n: n
        };
      };
      const sd = sl.map(x => {
        const g = segL(x.text);
        return {
          s: x,
          toks: g.toks,
          nh: g.n,
          words: norm(x.meaning).split(' ').filter(Boolean)
        };
      });
      const mk = (han, vi, d, st) => {
        const t = PM().parseTarget(d.s.pinyin);
        let py = '', syl = [], tones = [];
        if (t.syl.length === d.nh) {
          syl = t.syl.slice(st, st + han.length);
          tones = t.tones.slice(st, st + han.length);
          const tm = window.PracticeHub && window.PracticeHub.toMarks;
          py = syl.map((y, i) => tm ? tm(y, tones[i]) : y).join(' ');
        }
        return {
          text: han,
          pinyin: py,
          meaning: vi,
          level: 'Câu',
          key: syl.join(''),
          syl: syl,
          tones: tones,
          rank: 6,
          learned: d.s.text + ' = ' + d.s.meaning
        };
      };
      const addE = e => {
        ALL.push(e);
        put(zh, e.text, e);
        put(g1, norm(e.meaning), {
          e: e,
          pos: 0
        });
        put(g2, stripDiacritics(norm(e.meaning)), {
          e: e,
          pos: 0
        });
        if (e.syl.length) {
          put(map, e.key, e);
          e.syl.forEach(y => syls.set(y, (syls.get(y) || 0) + 1));
        }
      };
      const alias = (e, v, pos) => {
        e._al = e._al || [];
        if (!e._al.includes(v)) e._al.push(v);
        put(g1, v, {
          e: e,
          pos: pos
        });
        put(g2, stripDiacritics(v), {
          e: e,
          pos: pos
        });
      };
      const cv = new Map, ch1 = new Map, cvh = new Map, inc = (m, k) => m.set(k, (m.get(k) || 0) + 1);
      sd.forEach(d => {
        if (d.s.level !== 'Data') return;
        d.hs = d.toks.map(t => t.t).join('');
        d.H = new Set(d.toks.map(t => t.t));
        for (let i = 0; i + 2 <= d.hs.length; i++) d.H.add(d.hs.slice(i, i + 2));
        d.V = new Set(d.words.filter(w => !g1.has(w) && w.length >= 2));
        d.H.forEach(h => inc(ch1, h));
        d.V.forEach(v => {
          inc(cv, v);
          d.H.forEach(h => inc(cvh, v + '\t' + h));
        });
      });
      const byV = new Map;
      cvh.forEach((c, k) => {
        if (c < 2) return;
        const [v, h] = k.split('\t');
        (byV.get(v) || byV.set(v, []).get(v)).push([ h, c ]);
      });
      byV.forEach((arr, v) => {
        const n = cv.get(v);
        if (n < 2 || g1.has(v)) return;
        let best = null, bd = 0;
        arr.forEach(([h, c]) => {
          const dice = 2 * c / (n + ch1.get(h));
          if (c / n >= .5 && dice > bd) {
            bd = dice;
            best = [ h, c ];
          }
        });
        if (!best || bd < .25) return;
        const h = best[0], ents = zh.get(h);
        if (ents) alias(ents[0], v, .5); else {
          const d = sd.find(x => x.V && x.V.has(v) && x.H.has(h));
          if (d) addE(mk(h, v, d, d.hs.indexOf(h)));
        }
      });
      const found = new Map;
      const runs = fl => {
        const r = [];
        let st = -1;
        fl.forEach((f, i) => {
          if (!f && st < 0) st = i;
          if (f && st >= 0) {
            r.push([ st, i ]);
            st = -1;
          }
        });
        if (st >= 0) r.push([ st, fl.length ]);
        return r;
      };
      sd.forEach(d => {
        if (d.s.level !== 'Data') return;
        const vm = new Array(d.words.length).fill(false), hm = new Array(d.toks.length).fill(false);
        d.toks.forEach((tk, ti) => {
          if (!tk.e) return;
          const gl = new Set;
          tk.e.forEach(e => {
            glossesOf(e).forEach(g => gl.add(norm(g)));
            (e._al || []).forEach(a => gl.add(a));
          });
          let hit = null;
          for (let l = 3; l >= 1 && !hit; l--) for (let i = 0; i + l <= d.words.length; i++) {
            if (vm.slice(i, i + l).some(Boolean)) continue;
            if (gl.has(d.words.slice(i, i + l).join(' '))) {
              hit = [ i, l ];
              break;
            }
          }
          if (hit) {
            for (let k = hit[0]; k < hit[0] + hit[1]; k++) vm[k] = true;
            hm[ti] = true;
          }
        });
        let vr = runs(vm).map(([a, b]) => {
          while (b > a && PART_V.has(d.words[b - 1])) b--;
          while (a < b && PART_V.has(d.words[a])) a++;
          return [ a, b ];
        }).filter(([a, b]) => b > a);
        let hr = runs(hm).map(([a, b]) => {
          while (b > a && PART_H.has(d.toks[b - 1].t)) b--;
          return [ a, b ];
        }).filter(([a, b]) => b > a);
        if (vr.length !== 1 || hr.length !== 1) return;
        const [va, vb] = vr[0], [ha, hb] = hr[0];
        if (vb - va > 3 || hb - ha > 4) return;
        const vi = d.words.slice(va, vb).join(' '), tk = d.toks.slice(ha, hb), han = tk.map(t => t.t).join('');
        if (!vi || g1.has(vi) || han.length > 5) return;
        const m = found.get(vi) || found.set(vi, new Map).get(vi), o = m.get(han) || m.set(han, {
          n: 0,
          d: d,
          s: tk[0].s
        }).get(han);
        o.n++;
      });
      found.forEach((m, vi) => {
        [ ...m.entries() ].sort((a, b) => b[1].n - a[1].n || a[0].length - b[0].length).slice(0, 4).forEach(([han, o]) => addE(mk(han, vi, o.d, o.s)));
      });
      rk(g1);
      rk(g2);
      zh.forEach(a => a.sort((x, y) => x.rank - y.rank));
    } catch (err) {
      console.warn('learn', err);
    }
    X = {
      zh: zh,
      g1: g1,
      g2: g2,
      syls: syls,
      sz: sz,
      sv: sv,
      sl: sl,
      list: ALL,
      map: map
    };
    sig = s;
    return X;
  }
  const pyOf = e => clean(e.pinyin);
  function glossOf(sg) {
    const e = sg.cands[sg.sel];
    if (sg.vi && (e._al && e._al.includes(sg.vi) || glossesOf(e).some(g => norm(g) === sg.vi || stripDiacritics(norm(g)) === stripDiacritics(sg.vi)))) return sg.vi;
    return glossesOf(e)[0];
  }
  function compose(o) {
    let han = '', py = [], vi = [];
    o.segs.forEach(sg => {
      if (sg.lit != null) {
        han += sg.lit;
        if (sg.lit.trim()) vi.push(sg.lit.trim());
        return;
      }
      if (sg.unk != null) {
        han += '[' + sg.unk + ']';
        vi.push(sg.unk);
        return;
      }
      const e = sg.cands[sg.sel];
      han += e.text;
      py.push(pyOf(e));
      vi.push(glossOf(sg));
    });
    return {
      han: han,
      py: py.join(' '),
      vi: vi.join(' ')
    };
  }
  function segZh(text) {
    const Z = index(), ch = [ ...text ], n = ch.length, best = new Array(n + 1).fill(Infinity), prv = new Array(n + 1).fill(0);
    best[0] = 0;
    for (let i = 0; i < n; i++) {
      if (best[i] === Infinity) continue;
      if (!HANRE.test(ch[i])) {
        let j = i;
        while (j < n && !HANRE.test(ch[j])) j++;
        if (best[i] + .2 < best[j]) {
          best[j] = best[i] + .2;
          prv[j] = i;
        }
        continue;
      }
      for (let l = 1; l <= 14 && i + l <= n; l++) {
        const c = Z.zh.get(ch.slice(i, i + l).join(''));
        const cost = c ? 1 + .06 * c[0].rank - .12 * (l - 1) : l === 1 ? 2.5 : Infinity;
        if (best[i] + cost < best[i + l]) {
          best[i + l] = best[i] + cost;
          prv[i + l] = i;
        }
      }
    }
    const out = [];
    let p = n;
    while (p > 0) {
      const q = prv[p];
      out.unshift(ch.slice(q, p).join(''));
      p = q;
    }
    return out.map(t => {
      const c = HANRE.test(t) ? Z.zh.get(t) : null;
      return c ? {
        cands: c,
        sel: 0
      } : HANRE.test(t) ? {
        unk: t
      } : {
        lit: t
      };
    });
  }
  function fuzzySyl(s) {
    const Z = index(), out = [];
    Z.syls.forEach((f, k) => {
      let d = Infinity;
      if (k.startsWith(s) && k.length - s.length <= 2) d = .8; else if (Math.abs(k.length - s.length) <= 1) {
        const l = lev(s, k);
        if (l <= 1) d = 1;
      }
      if (d < Infinity) out.push({
        s: k,
        d: d,
        f: f
      });
    });
    return out.sort((a, b) => a.d - b.d || b.f - a.f).slice(0, 4);
  }
  function beam(syl, tones) {
    const Z = index(), n = syl.length, K = 4, best = Array.from({
      length: n + 1
    }, () => []);
    best[0] = [ {
      c: 0,
      segs: []
    } ];
    for (let i = 0; i < n; i++) {
      if (!best[i].length) continue;
      for (let l = 1; l <= 8 && i + l <= n; l++) {
        const all = Z.map.get(syl.slice(i, i + l).join('')) || [];
        const cs = all.filter(e => e.syl.length === l && e.syl.every((y, k) => y === syl[i + k]) && tones.slice(i, i + l).every((t, k) => t === null || t === undefined || (t === 5 ? 0 : t) === e.tones[k]));
        if (!cs.length) continue;
        best[i].forEach(st => best[i + l].push({
          c: st.c + 1 + .07 * cs[0].rank,
          segs: st.segs.concat([ {
            cands: cs,
            sel: 0
          } ])
        }));
        best[i + l].sort((a, b) => a.c - b.c);
        best[i + l].length = Math.min(best[i + l].length, K);
      }
    }
    return best[n];
  }
  function pinyinOptions(raw) {
    if (!PYRE.test(raw)) return null;
    const inp = PM().parseInput(raw);
    if (!inp.syl.length) return null;
    const Z = index();
    const alts = inp.syl.map(s => Z.syls.has(s) ? [ {
      s: s,
      d: 0
    } ] : fuzzySyl(s));
    if (alts.some(a => !a.length)) return {
      opts: [],
      fuzzy: false,
      inp: inp
    };
    let vars = [ {
      syl: [],
      d: 0
    } ];
    alts.forEach(a => {
      const nv = [];
      vars.forEach(v => a.forEach(x => nv.push({
        syl: v.syl.concat(x.s),
        d: v.d + x.d
      })));
      vars = nv.sort((p, q) => p.d - q.d).slice(0, 24);
    });
    const seen = new Set, opts = [];
    vars.forEach(v => beam(v.syl, inp.tones).forEach(r => {
      const o = {
        segs: r.segs,
        cost: r.c + 2 * v.d,
        fuzzy: v.d > 0,
        said: v.syl.join(' ')
      };
      const k = compose(o).han;
      if (seen.has(k)) return;
      seen.add(k);
      opts.push(o);
    }));
    opts.sort((a, b) => a.cost - b.cost);
    return {
      opts: opts.slice(0, 6),
      fuzzy: alts.some(a => a[0].d > 0),
      inp: inp
    };
  }
  function viOptions(raw) {
    const Z = index(), words = norm(raw).split(' ').filter(Boolean);
    if (!words.length) return null;
    const n = words.length, best = new Array(n + 1).fill(Infinity), prv = new Array(n + 1).fill(null);
    best[0] = 0;
    const look = p => Z.g1.get(p) || (p === stripDiacritics(p) ? Z.g2.get(p) : null) || null;
    for (let i = 0; i < n; i++) {
      if (best[i] === Infinity) continue;
      for (let l = 1; l <= 10 && i + l <= n; l++) {
        const p = words.slice(i, i + l).join(' '), m = look(p);
        if (!m) continue;
        const c = best[i] + 1 + .07 * m[0].e.rank + .12 * m[0].pos - .3 * (l - 1);
        if (c < best[i + l]) {
          best[i + l] = c;
          prv[i + l] = {
            from: i,
            p: p,
            m: m
          };
        }
      }
      const c = best[i] + 3;
      if (c < best[i + 1]) {
        best[i + 1] = c;
        prv[i + 1] = {
          from: i,
          unk: words[i]
        };
      }
    }
    const segs = [];
    let p = n, hit = 0;
    while (p > 0) {
      const st = prv[p];
      if (!st) break;
      if (st.unk) segs.unshift({
        unk: st.unk
      }); else {
        const seen = new Set, cands = [];
        st.m.forEach(x => {
          if (!seen.has(x.e.text)) {
            seen.add(x.e.text);
            cands.push(x.e);
          }
        });
        segs.unshift({
          cands: cands.slice(0, 8),
          sel: 0,
          vi: st.p
        });
        hit += p - st.from;
      }
      p = st.from;
    }
    const qk = stripDiacritics(words.join(' '));
    const related = n <= 4 && qk.length >= 2 ? Z.list.filter(e => (' ' + stripDiacritics(norm(e.meaning)) + ' ').includes(' ' + qk + ' ')).sort((a, b) => a.rank - b.rank).slice(0, 8) : [];
    return {
      opt: {
        segs: segs
      },
      cover: hit / n,
      related: related
    };
  }
  function sentenceHits(raw, hasHan) {
    const Z = index(), hits = [];
    if (hasHan) {
      const k = sKey(raw), ex = Z.sz.get(k);
      if (ex) hits.push(ex);
      if (k.length >= 3) Z.sl.forEach(x => {
        if (hits.length < 4 && x !== ex && (sKey(x.text).includes(k) || k.includes(sKey(x.text)) && sKey(x.text).length >= 4)) hits.push(x);
      });
    } else {
      const k = vKey(raw), ex = Z.sv.get(k);
      if (ex) hits.push(ex);
      if (k.length >= 6) Z.sl.forEach(x => {
        if (hits.length < 4 && x !== ex && (x.vk.includes(k) || x.vk.length >= 8 && k.includes(x.vk))) hits.push(x);
      });
    }
    return hits;
  }
  const VNRE_TR = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
  function translate(raw, mode) {
    raw = String(raw || '').trim();
    mode = mode || 'auto';
    const out = {
      raw: raw,
      sections: [],
      sentences: []
    };
    if (!raw) return out;
    const hasHan = HANRE.test(raw);
    out.sentences = sentenceHits(raw, hasHan);
    if (hasHan) {
      out.sections.push({
        title: '🇨🇳 → 🇻🇳 Trung → Việt (ghép từng từ)',
        cards: [ {
          segs: segZh(raw)
        } ],
        score: 1
      });
      return out;
    }
    const secs = [], exact = out.sentences.length && vKey(out.sentences[0].meaning) === vKey(raw) && sKey(out.sentences[0].text).length >= 4;
    if (mode !== 'zh' && window.ViZhEngine) {
      try {
        const nat = window.ViZhEngine.analyze(raw);
        const looksVi = VNRE_TR.test(raw) || nat.cover >= .75;
        if (nat && nat.han && nat.cover > 0 && (mode === 'vi' || looksVi)) out.natural = nat;
      } catch (e) {
        console.warn('ViZhEngine', e);
      }
    }
    if (exact && mode !== 'zh') return out;
    const v = mode !== 'zh' ? viOptions(raw) : null;
    const viFull = !!v && v.cover === 1 && norm(raw).split(' ').length >= 3;
    if (mode !== 'vi' && !(mode === 'auto' && viFull)) {
      const r = pinyinOptions(raw);
      if (r && r.opts.length) secs.push({
        title: '🇨🇳 → 🇻🇳 Đọc là pinyin' + (r.fuzzy ? ' (gợi ý gần đúng)' : ''),
        cards: r.opts,
        score: r.fuzzy ? .5 : 1,
        note: r.fuzzy ? 'Một số âm tiết không có trong từ điển nên app đoán âm gần nhất.' : ''
      });
    }
    if (v && v.cover > 0 && (mode === 'vi' || v.cover >= (secs.length ? 1 : .6))) secs.push({
      title: '🇻🇳 → 🇨🇳 Ghép từng từ tiếng Việt',
      cards: [ v.opt ],
      related: v.related,
      score: v.cover + .01
    });
    out.sections = secs.sort((a, b) => b.score - a.score);
    return out;
  }
  let cssDone = false, cur = null, reg = [], mode = 'auto', timer = 0;
  function addCss() {
    if (cssDone) return;
    cssDone = true;
    const s = document.createElement('style');
    s.textContent = `\n    .tr-in{width:100%;box-sizing:border-box;min-height:64px;resize:none;padding:10px 12px;border-radius:var(--radius-md);border:2px solid var(--border);background:var(--surface);color:var(--text);font:600 17px var(--font-body);outline:none}\n    .tr-in:focus{border-color:var(--accent)}\n    .tr-dir{display:flex;gap:6px;flex-wrap:wrap}\n    .tr-dir button{padding:6px 10px;border-radius:999px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font:700 12px var(--font-body);cursor:pointer}\n    .tr-dir button.on{background:var(--accent);border-color:var(--accent);color:#fff}\n    .tr-sec{font:800 12px var(--font-heading);color:var(--accent3);margin:6px 0 2px}\n    .tr-note{font-size:11.5px;color:var(--muted);line-height:1.45}\n    .tr-card{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:10px 12px;margin:6px 0;display:flex;flex-direction:column;gap:6px}\n    .tr-main{display:flex;align-items:center;gap:8px;flex-wrap:wrap}\n    .tr-han{font:700 26px var(--font-hanzi);line-height:1.3;word-break:break-all}\n    .tr-py{font-size:13px;color:var(--accent3);font-weight:700}\n    .tr-vi{font-size:15px;font-weight:700;line-height:1.45}\n    .tr-tools{margin-left:auto;display:flex;gap:6px}\n    .tr-tools button{padding:4px 9px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;font-size:13px}\n    .tr-segs{display:flex;flex-wrap:wrap;gap:6px}\n    .tr-chip{display:flex;flex-direction:column;align-items:center;gap:0;padding:5px 9px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;max-width:46%;position:relative}\n    .tr-chip b{font:700 20px var(--font-hanzi);line-height:1.2}\n    .tr-chip i{font-style:normal;font-size:10.5px;color:var(--accent3);font-weight:700}\n    .tr-chip span{font-size:11px;color:var(--muted);max-width:130px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n    .tr-chip u{position:absolute;top:-6px;right:-4px;text-decoration:none;font-size:9px;font-weight:800;background:var(--accent);color:#fff;border-radius:99px;padding:1px 5px}\n    .tr-lit{font:700 20px var(--font-hanzi);padding:5px 2px}\n    .tr-unk{border-style:dashed;opacity:.75}\n    .tr-alts{display:flex;flex-direction:column;gap:4px;border-top:1px dashed var(--border);padding-top:6px}\n    .tr-alt{display:flex;gap:8px;align-items:baseline;padding:4px 6px;border-radius:8px;cursor:pointer;font-size:13px;text-align:left;background:transparent;border:0;color:var(--text)}\n    .tr-alt.on,.tr-alt:hover{background:var(--surface)}\n    .tr-alt b{font:700 18px var(--font-hanzi)} .tr-alt i{font-style:normal;color:var(--accent3);font-size:11.5px;font-weight:700} .tr-alt span{color:var(--muted);font-size:12px}\n    .tr-empty{text-align:center;color:var(--muted);padding:18px 8px;font-size:13px;line-height:1.55}\n    .tr-nat{border-color:var(--accent);border-width:2px}\n    .tr-badge{display:inline-block;font:800 10.5px var(--font-body);padding:2px 8px;border-radius:99px;color:#fff;vertical-align:middle}\n    .tr-badge.high{background:#2e9d5b}.tr-badge.mid{background:#d89b18}.tr-badge.low{background:#d24b4b}\n    .tr-lbl{font:800 11px var(--font-body);color:var(--muted);text-transform:uppercase;letter-spacing:.3px}\n    .tr-litrow{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;border-top:1px dashed var(--border);padding-top:6px}\n    .tr-litrow b{font:700 18px var(--font-hanzi)} .tr-litrow i{font-style:normal;color:var(--accent3);font-size:12px;font-weight:700}\n    .tr-warn{font-size:12px;line-height:1.45;padding:5px 8px;border-radius:8px;background:var(--surface)}\n    .tr-warn.bad{border-left:3px solid #d24b4b}.tr-warn.amb{border-left:3px solid #d89b18}.tr-warn.info{border-left:3px solid var(--accent3)}\n    .tr-det{border-top:1px dashed var(--border);padding-top:6px;font-size:12.5px}\n    .tr-det summary{cursor:pointer;font-weight:800;color:var(--accent3)}\n    .tr-ana{display:grid;grid-template-columns:auto 1fr auto;gap:3px 10px;margin:6px 0;align-items:baseline}\n    .tr-ana .r{color:var(--muted);font-size:11.5px}.tr-ana .z{font:700 15px var(--font-hanzi)}\n    .tr-rule{font-size:12px;color:var(--text);line-height:1.45;margin:2px 0}`;
    document.head.appendChild(s);
  }
  const chipHtml = (sg, oi, si) => {
    if (sg.lit != null) return `<span class="tr-lit">${esc(sg.lit)}</span>`;
    if (sg.unk != null) return `<span class="tr-chip tr-unk"><b style="font-family:var(--font-body);font-size:15px">${esc(sg.unk)}</b><span>chưa có trong từ điển</span></span>`;
    const e = sg.cands[sg.sel];
    return `<button type="button" class="tr-chip" data-a="chip" data-o="${oi}" data-s="${si}"><b>${esc(e.text)}</b><i>${esc(pyOf(e))}</i><span>${esc(glossOf(sg))}</span>${sg.cands.length > 1 ? `<u>⇅${sg.cands.length}</u>` : ''}</button>`;
  };
  function cardHtml(o, oi) {
    const c = compose(o), real = o.segs.filter(s => s.cands);
    let h = `<div class="tr-card" data-o="${oi}"><div class="tr-main"><span class="tr-han">${esc(c.han)}</span><span class="tr-py">${esc(c.py)}</span><span class="tr-tools"><button type="button" data-a="say" data-o="${oi}" title="Nghe">🔊</button><button type="button" data-a="copy" data-o="${oi}" title="Sao chép chữ Hán">📋</button></span></div>`;
    h += `<div class="tr-vi">${esc(c.vi)}</div>`;
    if (o.said && o.fuzzy) h += `<div class="tr-note">Đoán âm: ${esc(o.said)}</div>`;
    h += `<div class="tr-segs">${o.segs.map((s, si) => chipHtml(s, oi, si)).join('')}</div>`;
    o.segs.forEach(sg => {
      if (sg.cands) {
        const e = sg.cands[sg.sel];
        if (e.learned) h += `<div class="tr-note">🧠 Tự học “${esc(e.meaning)}” = ${esc(e.text)} từ câu: ${esc(e.learned)}</div>`;
      }
    });
    if (real.length === 1 && real[0].cands.length > 1) {
      const si = o.segs.indexOf(real[0]);
      h += `<div class="tr-alts">${real[0].cands.slice(0, 8).map((e, k) => `<button type="button" class="tr-alt ${k === real[0].sel ? 'on' : ''}" data-a="alt" data-o="${oi}" data-s="${si}" data-k="${k}"><b>${esc(e.text)}</b><i>${esc(pyOf(e))}</i><span>${esc(e.meaning)}${e.level && e.level !== 'Data' ? ' · ' + esc(e.level) : ''}</span></button>`).join('')}</div>`;
    }
    return h + '</div>';
  }
  const LVL = {
    high: 'Độ tin cậy: cao',
    mid: 'Độ tin cậy: trung bình',
    low: 'Độ tin cậy: thấp'
  };
  function natHtml(n) {
    const tools = t => `<span class="tr-tools"><button type="button" data-a="say1" data-t="${esc(t)}" title="Nghe">🔊</button><button type="button" data-a="copy1" data-t="${esc(t)}" title="Sao chép chữ Hán">📋</button></span>`;
    const clean = t => String(t || '').replace(/[【】]/g, '');
    let h = `<div class="tr-sec">🧠 Dịch tự nhiên (theo ngữ pháp) <span class="tr-badge ${n.level}">${LVL[n.level]}</span></div>`;
    h += `<div class="tr-card tr-nat"><div class="tr-main"><span class="tr-han">${esc(n.han)}</span>${tools(clean(n.han))}</div><div class="tr-py">${esc(n.py)}</div>`;
    if (n.litHan && n.litHan !== n.han) h += `<div class="tr-litrow"><span class="tr-lbl">Dịch sát nghĩa</span><b>${esc(n.litHan)}</b><i>${esc(n.litPy)}</i></div>`;
    const multi = n.sentences.length > 1;
    const alts = [], warns = [];
    n.sentences.forEach((s, k) => {
      s.alts.forEach(a => alts.push({
        a: a,
        k: k
      }));
      s.warn.forEach(w => warns.push({
        w: w,
        k: k
      }));
    });
    if (alts.length) h += `<div class="tr-alts"><span class="tr-lbl">Cách nói khác</span>${alts.map(({a: a, k: k}) => `<button type="button" class="tr-alt" data-a="say1" data-t="${esc(clean(a.han))}"><b>${esc(a.han)}</b><i>${esc(a.py)}</i><span>${multi ? 'Câu ' + (k + 1) + ' · ' : ''}${esc(a.label)}</span></button>`).join('')}</div>`;
    if (n.noDia) warns.unshift({
      w: {
        lv: 'amb',
        t: 'Câu gõ không dấu — app đoán dấu theo từ điển, nên gõ có dấu để chính xác hơn.'
      },
      k: -1
    });
    warns.forEach(({w: w, k: k}) => {
      h += `<div class="tr-warn ${w.lv}">${w.lv === 'bad' ? '⚠️' : w.lv === 'amb' ? '❓' : 'ℹ️'} ${multi && k >= 0 ? 'Câu ' + (k + 1) + ': ' : ''}${esc(w.t)}</div>`;
    });
    let d = '';
    n.sentences.forEach((s, k) => {
      if (multi) d += `<div class="tr-lbl" style="margin-top:6px">Câu ${k + 1}: ${esc(s.src)} → ${esc(s.han)}</div>`;
      if (s.analysis.length) d += `<div class="tr-ana">${s.analysis.map(a => `<span class="r">${esc(a.role)}</span><span>${esc(a.vi)}</span><span class="z">${esc(a.zh)}</span>`).join('')}</div>`;
      s.rules.forEach(r => {
        d += `<div class="tr-rule">⚙️ ${esc(r)}</div>`;
      });
    });
    if (d) h += `<details class="tr-det"><summary>🔍 Phân tích ngữ pháp & quy tắc đã áp dụng</summary>${d}</details>`;
    return h + '</div>';
  }
  function render() {
    const box = $('tr-out');
    if (!box) return;
    reg = [];
    if (!cur || !cur.raw) {
      box.innerHTML = '<div class="tr-empty">Gõ <b>tiếng Việt</b> (“cảm ơn”), <b>chữ Hán</b> (你好吗) hoặc <b>pinyin</b> (nihao · ni3 hao3 · wo ai ni).<br>App ghép các từ trong toàn bộ từ điển (HSK 1–6 + Data) thành từ / cụm có nghĩa. Câu tiếng Việt được 🧠 dịch tự nhiên theo ngữ pháp (vd: “Mày ngu như chó” → 你傻得跟狗一样). Chạm vào một ô từ để đổi nghĩa khác.</div>';
      return;
    }
    let h = '', hs = '';
    if (cur.sentences.length) hs = `<div class="tr-sec">📖 Câu có sẵn trong dữ liệu (Data.js / HSK)</div>` + cur.sentences.map(s => `<div class="tr-card"><div class="tr-main"><span class="tr-han" style="font-size:20px">${esc(s.text)}</span><span class="tr-tools"><button type="button" data-a="say1" data-t="${esc(s.text)}">🔊</button></span></div><div class="tr-py">${esc(s.pinyin)}</div><div class="tr-vi" style="font-size:14px">${esc(s.meaning)}</div></div>`).join('');
    h = hs + (cur.natural ? natHtml(cur.natural) : '');
    cur.sections.forEach(sec => {
      h += `<div class="tr-sec">${esc(sec.title)}</div>`;
      if (sec.note) h += `<div class="tr-note">${esc(sec.note)}</div>`;
      sec.cards.forEach(o => {
        reg.push(o);
        h += cardHtml(o, reg.length - 1);
      });
      if (sec.related && sec.related.length) h += `<div class="tr-sec">📚 Từ liên quan</div><div class="tr-card">${sec.related.map(e => `<button type="button" class="tr-alt" data-a="say1" data-t="${esc(e.text)}"><b>${esc(e.text)}</b><i>${esc(pyOf(e))}</i><span>${esc(e.meaning)}</span></button>`).join('')}</div>`;
    });
    if (!cur.sections.length && !cur.sentences.length && !cur.natural) h = `<div class="tr-empty">Không tìm thấy kết quả cho “${esc(cur.raw)}”.<br>Thử gõ pinyin đúng chính tả (ni3 hao3), tiếng Việt có dấu, hoặc chọn hướng dịch ở trên.</div>`;
    box.innerHTML = h + '<div class="tr-note" style="margin-top:6px">⚠️ 🧠 “Dịch tự nhiên” dùng bộ quy tắc ngữ pháp Việt → Trung + từ điển trong máy (offline, không dùng AI/Internet): ưu tiên thành ngữ / cụm cố định, phân tích chủ ngữ – vị ngữ – tân ngữ… rồi đổi trật tự câu. Hãy xem độ tin cậy & cảnh báo — câu quá phức tạp hoặc có từ ngoài từ điển có thể chưa đúng. Các thẻ “ghép từng từ” bên dưới là tra nghĩa từng từ để đối chiếu.</div>';
  }
  function run() {
    const v = $('tr-in') ? $('tr-in').value : '';
    try {
      cur = translate(v, mode);
    } catch (e) {
      cur = {
        raw: v,
        sections: [],
        sentences: []
      };
      console.warn('translate', e);
    }
    render();
  }
  function say(t) {
    if (typeof speakChinese !== 'function') return;
    if (typeof zhVoice !== 'undefined' && !zhVoice && typeof loadVoices === 'function') loadVoices();
    speakChinese(t);
  }
  function mount(root) {
    addCss();
    mode = 'auto';
    root.innerHTML = `<textarea class="tr-in" id="tr-in" rows="2" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Gõ tiếng Việt, chữ Hán hoặc pinyin… (vd: hao do · xin chào · 你好吗)"></textarea>\n      <div class="tr-dir" id="tr-dir"><button type="button" data-m="auto" class="on">🔄 Tự nhận</button><button type="button" data-m="vi">🇻🇳 → 🇨🇳 Việt → Trung</button><button type="button" data-m="zh">🇨🇳 → 🇻🇳 Trung / pinyin → Việt</button><button type="button" data-m="clear">✕ Xoá</button></div>\n      <div id="tr-out"></div>`;
    $('tr-in').addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(run, 140);
    });
    $('tr-dir').addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.m === 'clear') {
        $('tr-in').value = '';
        cur = null;
        render();
        $('tr-in').focus();
        return;
      }
      mode = b.dataset.m;
      $('tr-dir').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      run();
    });
    $('tr-out').addEventListener('click', e => {
      const b = e.target.closest('[data-a]');
      if (!b) return;
      const a = b.dataset.a, o = reg[Number(b.dataset.o)];
      if (a === 'say1') {
        say(b.dataset.t);
        return;
      }
      if (a === 'copy1') {
        try {
          navigator.clipboard.writeText(b.dataset.t);
          if (typeof showToast === 'function') showToast('📋 Đã sao chép');
        } catch (x) {}
        return;
      }
      if (!o) return;
      if (a === 'chip') {
        const sg = o.segs[Number(b.dataset.s)];
        sg.sel = (sg.sel + 1) % sg.cands.length;
      } else if (a === 'alt') {
        o.segs[Number(b.dataset.s)].sel = Number(b.dataset.k);
      } else if (a === 'say') {
        say(compose(o).han.replace(/[\[\]]/g, ''));
        return;
      } else if (a === 'copy') {
        try {
          navigator.clipboard.writeText(compose(o).han);
          if (typeof showToast === 'function') showToast('📋 Đã sao chép');
        } catch (x) {}
        return;
      }
      const keep = $('tr-out').scrollTop;
      const html = cardHtml(o, Number(b.dataset.o)), card = $('tr-out').querySelector(`.tr-card[data-o="${b.dataset.o}"]`);
      if (card) {
        const t = document.createElement('div');
        t.innerHTML = html;
        card.replaceWith(t.firstChild);
      }
      $('tr-out').scrollTop = keep;
    });
    render();
    setTimeout(() => {
      try {
        $('tr-in').focus({
          preventScroll: true
        });
      } catch (e) {}
    }, 60);
  }
  window.Translator = {
    mount: mount,
    translate: translate,
    compose: compose,
    segZh: segZh,
    pinyinOptions: pinyinOptions,
    viOptions: viOptions,
    _index: index,
    natural: s => window.ViZhEngine ? window.ViZhEngine.analyze(s) : null
  };
})();

(function() {
  'use strict';
  const PM = () => window.PinyinMode, SC = () => window.StudyCore, $ = id => document.getElementById(id);
  const esc = s => escapeHTML(String(s == null ? '' : s));
  const LS_SCOPE = 'cn_quiz_px_scope', LS_PLAN = 'cn_quiz_plan', LS_EXAM = 'cn_quiz_exams';
  const todayStr = () => getLocalDateStr();
  const MARK = {
    a: 'āáǎà',
    e: 'ēéěè',
    i: 'īíǐì',
    o: 'ōóǒò',
    u: 'ūúǔù',
    v: 'ǖǘǚǜ'
  };
  function toMarks(syl, tone) {
    let s = syl;
    if (!tone) return s.replace(/v/g, 'ü');
    let k = s.search(/[ae]/);
    if (k < 0) {
      k = s.indexOf('ou') >= 0 ? s.indexOf('o') : -1;
    }
    if (k < 0) {
      for (let j = s.length - 1; j >= 0; j--) if ('iouv'.includes(s[j])) {
        k = j;
        break;
      }
    }
    if (k < 0) return s;
    return (s.slice(0, k) + MARK[s[k]][tone - 1] + s.slice(k + 1)).replace(/v/g, 'ü');
  }
  const readingOf = t => t.syl.map((s, i) => toMarks(s, t.tones[i])).join(' ');
  function toneVariants(t) {
    const out = [];
    for (let i = 0; i < t.syl.length; i++) for (let tn = 0; tn <= 4; tn++) if (tn !== t.tones[i] && !(tn === 0 && !t.tones[i])) {
      const tt = t.tones.slice();
      tt[i] = tn;
      out.push(readingOf({
        syl: t.syl,
        tones: tt
      }));
    }
    return shuffle(out);
  }
  const HAN = /[一-鿿]/g;
  const coreOf = txt => String(txt || '').split(/[\/／,，;；(（]/)[0].replace(/[~～…\s]/g, '');
  let cacheSig = '', S = null;
  function data() {
    const sig = (typeof hskAll !== 'undefined' ? hskAll.length : 0) + ':' + (window.dictIndex ? window.dictIndex.length : 0);
    if (S && sig === cacheSig) return S;
    const sents = [], seen = new Set, words = [];
    const addSent = (text, pinyin, meaning, level, word) => {
      text = String(text || '').trim();
      if (!text || seen.has(text)) return;
      const t = PM().parseTarget(pinyin), han = (text.match(HAN) || []).length, er = (text.match(/儿/g) || []).length;
      if (han < 2 || t.syl.length < 2 || !(t.syl.length === han || t.syl.length === han - er || t.syl.length === han - er + 0)) return;
      if (!meaning || !String(meaning).trim()) return;
      seen.add(text);
      sents.push({
        text: text,
        pinyin: String(pinyin),
        meaning: String(meaning).trim(),
        level: level,
        word: word,
        t: t,
        n: t.syl.length
      });
    };
    if (typeof hskAll !== 'undefined') hskAll.forEach(w => {
      const core = coreOf(w.text), t = PM().parseTarget(w.pinyin);
      const wd = {
        text: core,
        rawText: w.text,
        pinyin: w.pinyin,
        meaning: w.meaning,
        level: w.level,
        t: t,
        example: w.example,
        examplePinyin: w.examplePinyin,
        exampleMeaning: w.exampleMeaning
      };
      words.push(wd);
      if (w.example) addSent(w.example, w.examplePinyin, w.exampleMeaning, w.level, wd);
    });
    (window.dictSentences || []).forEach(s => addSent(s.text, s.pinyin, s.meaning, 'Data', null));
    S = {
      sents: sents,
      words: words
    };
    cacheSig = sig;
    return S;
  }
  const TOPICS = [ [ 'num', '🔢 Số & lượng', 'số|một|hai|ba|bốn|sáu|bảy|tám|chín|mười|trăm|nghìn|ngàn|vạn|nửa|bao nhiêu|mấy|lần|đôi|cặp|tổng cộng|nhiều|ít' ], [ 'time', '🕐 Thời gian', 'giờ|phút|ngày|tháng|tuần|năm ngoái|hôm|sáng|chiều|tối|trưa|đêm|mùa|xuân|hạ|thu|đông|lúc|khi|trước|sau|bây giờ|thường|luôn|sắp|đã|đang|mãi|lâu' ], [ 'family', '👨‍👩‍👧 Gia đình & con người', 'bố|mẹ|ba|anh|chị|em|con trai|con gái|ông|bà|chú|dì|cô|vợ|chồng|bạn|gia đình|người|trẻ|hàng xóm|đồng nghiệp|khách|thầy|giáo viên|học sinh' ], [ 'food', '🍜 Ăn uống', 'ăn|uống|cơm|nước|trà|cà phê|trái cây|táo|chuối|nho|dưa|món|rau|thịt|cá|trứng|sữa|bánh|mì|kẹo|đường|bia|rượu|ngon|đói|no|bát|đũa|đĩa|cốc|nhà hàng|thực đơn|đồ ăn' ], [ 'weather', '🌦 Thời tiết & thiên nhiên', 'mưa|nắng|tuyết|gió|mây|lạnh|nóng|trời|thời tiết|trăng|mặt trời|sông|núi|cây|hoa|cỏ|chim|động vật|chó|mèo|ngựa|gấu' ], [ 'move', '🚌 Đi lại & nơi chốn', 'xe|tàu|máy bay|sân bay|ga|đường|phố|đi|đến|về|vào|ra|lên|xuống|trường|bệnh viện|công ty|công viên|thư viện|cửa hàng|siêu thị|khách sạn|ngân hàng|nhà|phòng|thành phố|quốc gia|trái|phải|trước|sau|gần|xa|bản đồ|vé|du lịch' ], [ 'body', '🩺 Cơ thể & sức khỏe', 'đầu|mắt|tai|mũi|miệng|tay|chân|mặt|tóc|cơ thể|sức khỏe|bệnh|ốm|thuốc|đau|sốt|cảm|bác sĩ|mệt|tắm|đánh răng|ngủ|dậy' ], [ 'feel', '😊 Cảm xúc & tính cách', 'vui|buồn|giận|sợ|lo|yêu|thích|ghét|hài lòng|thông minh|chăm chỉ|nhiệt tình|đáng yêu|xinh|đẹp|tốt|xấu|hy vọng|nhớ|quên|ngạc nhiên|tức|nghiêm túc|cẩn thận' ], [ 'study', '🏫 Học tập & công việc', 'học|dạy|thi|bài|sách|viết|đọc|chữ|từ|câu|lớp|điểm|thành tích|công việc|làm việc|họp|văn phòng|kế hoạch|dự án|kinh nghiệm|kỹ năng|luyện|ôn|trình độ|văn hóa|lịch sử|toán' ], [ 'shop', '🛍 Mua sắm & đồ vật', 'mua|bán|tiền|giá|đắt|rẻ|đồng|quần|áo|giày|mũ|váy|túi|ví|đồng hồ|điện thoại|máy tính|ti vi|điều hòa|tủ lạnh|đèn|ghế|bàn|quà|kính|ô|dù|vali|máy ảnh' ] ].map(([id, label, kw]) => ({
    id: id,
    label: label,
    re: new RegExp('(^|[^\\p{L}])(' + kw + ')(?=$|[^\\p{L}])', 'iu')
  }));
  const topicOf = id => TOPICS.find(t => t.id === id);
  let scope = safeStorage.get(LS_SCOPE) || 'HSK1';
  const scopeLabel = sc => sc === 'ALL' ? 'Tất cả HSK' : sc === 'SLANG' ? 'Khẩu ngữ (Data.js)' : sc.startsWith('topic:') ? (topicOf(sc.slice(6)) || {}).label : sc;
  function inScope(it, isSent) {
    const lv = it.level, w = isSent ? it.word : it;
    if (scope === 'SLANG') return lv === 'Data';
    if (lv === 'Data') return false;
    if (scope === 'ALL') return true;
    if (scope.startsWith('topic:')) {
      const tp = topicOf(scope.slice(6));
      return !!(tp && w && w.meaning && tp.re.test(w.meaning));
    }
    return lv === scope;
  }
  const sentPool = () => data().sents.filter(s => inScope(s, true));
  const wordPool = () => data().words.filter(w => inScope(w, false) && w.t.key);
  const fillPool = () => data().sents.filter(s => s.word && inScope(s, true) && s.word.text && s.text.includes(s.word.text) && [ ...s.word.text ].length <= 4 && PM().lexicon().map.has(s.word.t.key));
  const pickN = (arr, n) => shuffle(arr.slice()).slice(0, n);
  function mkFill(s) {
    return {
      type: 'fill',
      key: 'fill:' + s.text,
      sent: s
    };
  }
  function mkSent(type) {
    return s => ({
      type: type,
      key: type + ':' + s.text,
      sent: s
    });
  }
  function polyQuestions() {
    const by = new Map;
    data().words.forEach(w => {
      if (w.text && w.t.key && w.example && w.example.includes(w.text) && w.level !== 'Data') (by.get(w.text) || by.set(w.text, []).get(w.text)).push(w);
    });
    const out = [];
    by.forEach(list => {
      const keys = new Set(list.map(w => w.t.key));
      if (keys.size < 2) return;
      const readings = [];
      list.forEach(w => {
        const r = readingOf(w.t);
        if (!readings.includes(r)) readings.push(r);
      });
      list.forEach(w => {
        if (!inScope(w, false)) return;
        const ans = readingOf(w.t), opts = readings.slice();
        toneVariants(w.t).forEach(v => {
          if (opts.length < 4 && !opts.includes(v)) opts.push(v);
        });
        out.push({
          type: 'choice',
          key: 'poly:' + w.text + ':' + w.t.key,
          kind: 'poly',
          title: `Trong câu này, 「${w.text}」 đọc là gì?`,
          sentence: w.example,
          mark: w.text,
          meaning: w.exampleMeaning,
          options: shuffle(opts.slice(0, 4)),
          answer: ans,
          explain: `${w.text} (${ans}) = ${w.meaning}`,
          level: w.level,
          text: w.text,
          pinyin: w.pinyin
        });
      });
    });
    return out;
  }
  function homoQuestions() {
    const out = [], map = PM().lexicon().map, L = PM().lexicon().list;
    map.forEach(g => {
      const grp = g.filter(e => e.level !== 'Data');
      if (new Set(grp.map(e => e.text)).size < 2) return;
      grp.forEach(e => {
        if (!inScope(e, false) || !e.meaning || /^(thán từ|trợ từ|từ )/i.test(e.meaning)) return;
        const mn = x => String(x.meaning || '').trim().toLowerCase();
        let opts = shuffle(grp.filter(x => x.text !== e.text && mn(x) !== mn(e))).slice(0, 3);
        if (opts.length < 3) {
          const same = L.filter(x => x.syl.length === e.syl.length && x.syl[0] === e.syl[0] && x.text !== e.text && mn(x) !== mn(e) && !opts.includes(x) && x.level !== 'Data');
          opts = opts.concat(pickN(same, 3 - opts.length));
        }
        const all = shuffle([ e ].concat(opts).filter((v, i, a) => a.findIndex(y => y.text === v.text) === i)).slice(0, 4);
        if (!all.some(x => x.text === e.text) || all.length < 3) return;
        out.push({
          type: 'choice',
          key: 'homo:' + e.text,
          kind: 'homo',
          title: `Chữ Hán nào có nghĩa “${e.meaning}”?`,
          sentence: '',
          hint: `Cách đọc: ${PM().numbered(e)}`,
          options: all.map(x => x.text),
          answer: e.text,
          explain: `${e.text} (${e.pinyin}) = ${e.meaning}`,
          level: e.level,
          text: e.text,
          pinyin: e.pinyin,
          meaning: e.meaning
        });
      });
    });
    return out;
  }
  const choicePool = () => {
    const p = polyQuestions(), h = homoQuestions();
    return shuffle(p).slice(0, 6).concat(shuffle(h));
  };
  function build(type, n) {
    n = n || 10;
    if (type === 'fill') return pickN(fillPool(), n).map(mkFill);
    if (type === 'dict') return pickN(sentPool().filter(s => s.n <= 14), n).map(mkSent('dict'));
    if (type === 'vi2zh') return pickN(sentPool().filter(s => s.n <= 14), n).map(mkSent('vi2zh'));
    if (type === 'shadow') return pickN(sentPool().filter(s => s.n <= 16), n).map(mkSent('shadow'));
    if (type === 'choice') return choicePool().slice(0, n);
    return [];
  }
  let run = null, cur = null, inp = null, cands = {
    list: []
  }, locked = false;
  const TITLES = {
    fill: '✏️ Điền chỗ trống',
    dict: '🎧 Chép chính tả',
    vi2zh: '🔁 Dịch Việt → Trung',
    choice: '🧠 Đồng âm / đa âm',
    shadow: '🗣 Đọc theo'
  };
  const canSpeak = () => typeof ttsSupported !== 'undefined' && ttsSupported && typeof voiceEnabled !== 'undefined' && voiceEnabled;
  function speakAt(text, rate) {
    const old = ttsRate;
    ttsRate = rate;
    try {
      if (!zhVoice) loadVoices();
      speakChinese(text, $('px-speak'));
    } finally {
      ttsRate = old;
    }
  }
  function buildScreens() {
    if ($('hub-screen')) return;
    PM().build();
    const css = document.createElement('style');
    css.textContent = `\n    #hub-screen,#px-screen{display:none;width:100%}\n    .hub-scope{display:flex;gap:8px;align-items:center}\n    .hub-scope select{flex:1;padding:9px 10px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);color:var(--text);font:700 13px var(--font-body)}\n    .hub-card{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:12px}\n    .hub-card h3{margin:0 0 8px;font-size:13px;font-family:var(--font-heading)}\n    .hub-steps{display:flex;flex-direction:column;gap:6px}\n    .hub-step{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface);color:var(--text);font:700 13px var(--font-body);cursor:pointer;text-align:left}\n    .hub-step.done{opacity:.55;border-color:var(--correct)} .hub-step .ck{margin-left:auto}\n    .hub-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}\n    .hub-btn{padding:11px 8px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);color:var(--text);font:800 13px var(--font-heading);cursor:pointer;line-height:1.3}\n    .hub-btn small{display:block;font:500 10.5px var(--font-body);color:var(--muted);margin-top:2px}\n    .hub-btn:hover{border-color:var(--accent)}\n    .hub-bar{height:6px;border-radius:99px;background:var(--surface);overflow:hidden;margin:2px 0 8px}.hub-bar i{display:block;height:100%;background:var(--correct)}\n    .hub-sub-body{font-size:12.5px;line-height:1.55}\n    .hub-sub-body .iss{padding:5px 8px;border-radius:8px;background:var(--surface);margin:3px 0;border-left:3px solid var(--wrong)}\n    .hub-sub-body .iss.w{border-left-color:#f5a623}\n    .hub-sub-body b.k{color:var(--accent3)}\n    .px-blank{display:inline-block;min-width:2.2em;border-bottom:3px solid var(--accent);color:transparent;margin:0 2px}\n    .px-sent{font-family:var(--font-hanzi);font-size:26px;line-height:1.5;font-weight:700}\n    .px-sent mark{background:color-mix(in oklab,var(--accent) 35%,transparent);color:inherit;border-radius:6px;padding:0 3px}\n    .px-diff span{display:inline-block;margin:2px 3px;padding:2px 7px;border-radius:8px;background:var(--surface);font-weight:800}\n    .px-diff .m{color:var(--correct)} .px-diff .x{color:var(--wrong);text-decoration:underline wavy}\n    .px-rate{display:flex;gap:8px}.px-rate button{flex:1;padding:10px 4px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);color:var(--text);font:800 13px var(--font-heading);cursor:pointer}\n    @media all{\n      #hub-screen[style*="block"],#px-screen[style*="block"]{gap:clamp(5px,calc(1.1 * var(--hu)),10px)}\n      #hub-screen .screen-header,#px-screen .screen-header{margin:0}\n      #hub-body{display:flex;flex-direction:column;gap:clamp(6px,calc(1.2 * var(--hu)),10px);flex:1 1 auto;min-height:0;overflow-y:auto;scrollbar-width:none}\n      #hub-body::-webkit-scrollbar{display:none}\n      #hub-body>*{flex-shrink:0;margin:0!important}\n      .hub-btn{padding:clamp(7px,calc(1.2 * var(--hu)),11px) 6px;font-size:12px}\n      #px-body{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;gap:clamp(5px,calc(1.1 * var(--hu)),10px)}\n      #px-body>*{margin:0!important;flex-shrink:0}\n      #px-body .px-sent{font-size:clamp(18px,calc(3.2 * var(--hu)),26px)}\n      #px-body .pn-cands{flex:1 1 0;min-height:0;overflow-y:auto;scrollbar-width:none}\n      #px-body>.btn-next{flex:0 0 auto}\n    }`;
    document.head.appendChild(css);
    const host = $('result-screen').parentNode;
    const hub = document.createElement('div');
    hub.id = 'hub-screen';
    hub.innerHTML = `\n      <div class="screen-header"><button class="btn-back" id="hub-back">⬅️ Quay lại</button><h2 class="screen-title">🎯 Luyện thêm</h2></div>\n      <div id="hub-body"></div>`;
    host.appendChild(hub);
    const px = document.createElement('div');
    px.id = 'px-screen';
    px.innerHTML = `\n      <div class="screen-header"><button class="btn-back" id="px-back">⬅️ Thoát</button><h2 class="screen-title" id="px-title"></h2></div>\n      <div id="px-body">\n        <div class="quiz-header"><span class="mode-badge" id="px-badge"></span><span class="question-counter" id="px-counter"></span><div class="header-actions"></div></div>\n        <div class="progress-track"><div class="progress-fill" id="px-progress" style="width:0%"></div></div>\n        <div class="pn-prompt" id="px-prompt"></div>\n        <input class="pn-in" id="px-in" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="gõ pinyin: ni3 hao3 hoặc nihao">\n        <div class="pn-tip" id="px-tip"></div>\n        <div class="pn-cands" id="px-opts"></div>\n        <div class="pn-actions" id="px-actions"></div>\n        <div class="pn-fb" id="px-fb"></div>\n        <button class="btn-next" id="px-next">Câu tiếp →</button>\n      </div>`;
    host.appendChild(px);
    $('hub-back').onclick = () => {
      if (subOpen) openHub(); else goHome();
    };
    $('px-back').onclick = () => {
      if (run && run.onQuit) run.onQuit(); else openHub();
    };
    $('px-in').addEventListener('input', onInput);
    $('px-in').addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (locked) {
        next();
        return;
      }
      if (!cur) return;
      if (cur.type === 'fill') {
        if (cands.list.length) pickCand(cands.list[0]);
      } else if (cur.type === 'dict' || cur.type === 'vi2zh') check();
    });
    $('px-next').onclick = next;
    document.addEventListener('keydown', e => {
      const sc = $('px-screen');
      if (e.key === 'Enter' && sc && sc.style.display === 'block' && locked && document.activeElement !== $('px-in')) {
        e.preventDefault();
        next();
      }
    });
  }
  function startRun(type, items, opts) {
    opts = opts || {};
    buildScreens();
    if (!items.length) {
      toastMsg('Không đủ dữ liệu cho bài này ở “' + scopeLabel(scope) + '”. Thử đổi cấp / chủ đề.');
      return false;
    }
    run = {
      type: type,
      items: items,
      i: 0,
      results: [],
      onDone: opts.onDone || null,
      onQuit: opts.onQuit || null,
      title: opts.title || TITLES[type] || 'Luyện thêm',
      replay: opts.replay || (() => startRun(type, build(type, items.length), opts))
    };
    show('px-screen');
    resetSession();
    currentGameStarter = () => run.replay();
    $('px-title').textContent = run.title;
    setItem();
    return true;
  }
  function toastMsg(m) {
    if (typeof showToast === 'function') showToast(m); else alert(m);
  }
  const itemSent = it => it.sent;
  function setItem() {
    cur = run.items[run.i];
    locked = false;
    cands = {
      list: []
    };
    inp = null;
    cur.hinted = false;
    cur.recorded = false;
    $('px-counter').textContent = `${run.i + 1} / ${run.items.length}`;
    $('px-progress').style.width = run.i / run.items.length * 100 + '%';
    $('px-fb').className = 'pn-fb';
    $('px-fb').innerHTML = '';
    $('px-next').classList.remove('visible');
    const input = $('px-in'), opts = $('px-opts'), act = $('px-actions'), tip = $('px-tip'), pr = $('px-prompt');
    input.value = '';
    input.disabled = false;
    input.className = 'pn-in';
    opts.innerHTML = '';
    act.innerHTML = '';
    const typing = [ 'fill', 'dict', 'vi2zh' ].includes(cur.type);
    input.style.display = typing ? '' : 'none';
    tip.style.display = typing ? '' : 'none';
    const sp = '<div class="pn-speak"><button class="btn-speak" id="px-speak" type="button">🔊</button> <button class="tts-rate-btn" id="px-rate" type="button">🚶 0.85x</button><button class="tts-rate-btn tts-replay" id="px-replay" type="button">🔊 Nghe lại</button></div>';
    const bindSp = txt => {
      $('px-speak').onclick = $('px-replay').onclick = () => speakAt(txt, ttsRate);
      $('px-rate').onclick = () => cycleTTSRate(() => speakAt(txt, ttsRate));
      refreshTTSBtns();
    };
    const hintBtn = fn => {
      const b = document.createElement('button');
      b.textContent = '💡 Gợi ý';
      b.onclick = fn;
      act.appendChild(b);
      return b;
    };
    const showBtn = () => {
      const b = document.createElement('button');
      b.textContent = '👁 Đáp án';
      b.onclick = reveal;
      act.appendChild(b);
    };
    const s = cur.sent;
    if (cur.type === 'fill') {
      $('px-badge').textContent = '✏️ Điền từ';
      const idx = s.text.indexOf(s.word.text), blank = `<span class="px-blank">${'＿'.repeat(Math.max(2, [ ...s.word.text ].length))}</span>`;
      pr.innerHTML = `<div class="lbl">Từ nào còn thiếu? Gõ pinyin rồi chọn chữ Hán</div><div class="px-sent">${esc(s.text.slice(0, idx))}${blank}${esc(s.text.slice(idx + s.word.text.length))}</div><div class="vi" style="font-size:15px">${esc(s.meaning)}</div>`;
      tip.textContent = 'Gõ pinyin của từ còn thiếu (ni3 hoặc ni) · Enter chọn chữ đầu · chọn đúng chữ Hán.';
      hintBtn(() => {
        cur.hinted = true;
        const t = s.word.t;
        fb(`💡 Từ này nghĩa “${esc(s.word.meaning)}” · ${t.syl.length} âm tiết, bắt đầu bằng “${esc(t.key[0])}”. (Dùng gợi ý nên không tính điểm.)`, '');
      });
      showBtn();
    } else if (cur.type === 'dict') {
      $('px-badge').textContent = '🎧 Chép chính tả';
      const aud = canSpeak();
      pr.innerHTML = `<div class="lbl">${aud ? 'Nghe câu rồi gõ pinyin cả câu' : 'Gõ pinyin của câu sau'}</div>` + (aud ? sp : `<div class="px-sent">${esc(s.text)}</div>`) + '<div class="vi" id="px-vi" style="font-size:15px">❓</div>';
      tip.textContent = 'Gõ cả câu: wo3 ai4 ni3 hoặc woaini · có thể bỏ dấu cách · Enter để kiểm tra.';
      if (aud) {
        bindSp(s.text);
        setTimeout(() => {
          if (cur && cur.sent === s && !locked) speakAt(s.text, ttsRate);
        }, 350);
      }
      hintBtn(() => {
        cur.hinted = true;
        $('px-vi').textContent = s.meaning;
        if (aud) {
          const f = $('px-fb');
        }
        fb(`💡 Câu có ${s.n} âm tiết: ${esc(s.text)}. (Dùng gợi ý nên không tính điểm.)`, '');
      });
      const ck = document.createElement('button');
      ck.textContent = '✔ Kiểm tra';
      ck.onclick = check;
      act.appendChild(ck);
      showBtn();
    } else if (cur.type === 'vi2zh') {
      $('px-badge').textContent = '🔁 Việt → Trung';
      pr.innerHTML = `<div class="lbl">Dịch sang tiếng Trung rồi gõ pinyin cả câu</div><div class="vi">${esc(s.meaning)}</div>`;
      tip.textContent = 'Gõ pinyin cả câu: ni3 hao3 hoặc nihao · Enter để kiểm tra.';
      hintBtn(() => {
        cur.hinted = true;
        fb(`💡 Chữ Hán: <span class="han">${esc(s.text)}</span> (${s.n} âm tiết). Dùng gợi ý nên không tính điểm.`, '');
      });
      const ck = document.createElement('button');
      ck.textContent = '✔ Kiểm tra';
      ck.onclick = check;
      act.appendChild(ck);
      showBtn();
    } else if (cur.type === 'choice') {
      $('px-badge').textContent = cur.kind === 'poly' ? '🧠 Đa âm' : '🧠 Đồng âm';
      pr.innerHTML = `<div class="lbl">${esc(cur.title)}</div>` + (cur.sentence ? `<div class="px-sent">${esc(cur.sentence).replace(esc(cur.mark), `<mark>${esc(cur.mark)}</mark>`)}</div><div class="vi" style="font-size:14px">${esc(cur.meaning || '')}</div>` : `<div class="vi" style="font-size:15px">${esc(cur.hint || '')}</div>`);
      opts.innerHTML = cur.options.map((o, n) => `<button type="button" class="pn-cand" data-n="${n}" style="max-width:none;flex:1 1 44%"><span class="${cur.kind === 'poly' ? 'p' : 'h'}" style="${cur.kind === 'poly' ? 'font-size:15px' : ''}">${esc(o)}</span></button>`).join('');
      opts.querySelectorAll('.pn-cand').forEach(b => b.onclick = () => pickChoice(cur.options[Number(b.dataset.n)], b));
    } else if (cur.type === 'shadow') {
      $('px-badge').textContent = '🗣 Đọc theo';
      const showPy = safeStorage.get('cn_quiz_px_showpy') !== false;
      pr.innerHTML = `<div class="lbl">Nghe chậm, đọc theo thành tiếng, rồi tự chấm</div><div class="px-sent">${esc(s.text)}</div><div class="vi" id="px-py" style="font-size:15px;color:var(--accent3)">${showPy ? esc(s.pinyin) : '• • •'}</div><div class="vi" style="font-size:14px">${esc(s.meaning)}</div>` + (canSpeak() ? sp : '<div class="pn-tip">Thiết bị chưa hỗ trợ giọng đọc — hãy đọc theo pinyin.</div>');
      if (canSpeak()) {
        bindSp(s.text);
      }
      const play = (r, b) => {
        const x = document.createElement('button');
        x.textContent = b;
        x.onclick = () => {
          if (!canSpeak()) return;
          if (r === 'both') {
            speakAt(s.text, .6);
            setTimeout(() => speakAt(s.text, 1), Math.min(9e3, 900 + s.n * 650));
          } else speakAt(s.text, r);
        };
        act.appendChild(x);
      };
      play(.6, '🐢 Chậm');
      play(1, '🔊 Thường');
      play('both', '▶ Chậm → thường');
      const tg = document.createElement('button');
      tg.textContent = '👁 Pinyin';
      tg.onclick = () => {
        const v = $('px-py').textContent.includes('•');
        safeStorage.set('cn_quiz_px_showpy', v);
        $('px-py').textContent = v ? s.pinyin : '• • •';
      };
      act.appendChild(tg);
      opts.innerHTML = '<div class="px-rate" style="width:100%"><button data-r="0">😅 Còn khó</button><button data-r="1">🙂 Được</button><button data-r="2">😎 Dễ</button></div>';
      opts.querySelectorAll('button').forEach(b => b.onclick = () => rateShadow(Number(b.dataset.r)));
      if (canSpeak()) setTimeout(() => {
        if (cur && cur.sent === s && !locked) speakAt(s.text, .6);
      }, 400);
    }
    if (typing) setTimeout(() => {
      try {
        input.focus({
          preventScroll: true
        });
      } catch (e) {
        input.focus();
      }
    }, 60);
  }
  function fb(html, cls) {
    const f = $('px-fb');
    f.className = 'pn-fb show ' + (cls || '');
    f.innerHTML = html;
  }
  function recordItem(ok) {
    if (cur.recorded) return;
    cur.recorded = true;
    const s = cur.sent || cur, item = {
      text: cur.sent ? cur.sent.text : cur.text,
      pinyin: cur.sent ? cur.sent.pinyin : cur.pinyin,
      meaning: cur.sent ? cur.sent.meaning : cur.meaning || cur.explain || '',
      level: cur.sent ? cur.sent.level === 'Data' ? '' : cur.sent.level : cur.level === 'Data' ? '' : cur.level
    };
    SC().record('practice', cur.key, ok, {
      text: item.text,
      pinyin: item.pinyin,
      meaning: item.meaning,
      level: item.level || 'Khác'
    }, [ 'asked' ].concat(ok ? [ 'correct' ] : []));
    if (ok) SC().mistakeRight('drill', cur.key); else SC().mistakeWrong('drill', cur.key, Object.assign({}, item, {
      drill: cur.type,
      item: JSON.parse(JSON.stringify(cur, (k, v) => k === 'recorded' || k === 'hinted' ? undefined : v))
    }));
    run.results.push({
      ok: ok,
      type: cur.type
    });
  }
  function onInput() {
    if (locked || !cur) return;
    const v = PM().parseInput($('px-in').value);
    $('px-in').className = 'pn-in';
    $('px-fb').className = 'pn-fb';
    if (cur.type !== 'fill') return;
    inp = v;
    cands = PM().candidates(v);
    const box = $('px-opts');
    if (!v.key) {
      box.innerHTML = '<div class="pn-msg">Chữ Hán ứng viên sẽ hiện ở đây khi bạn gõ…</div>';
      return;
    }
    if (!cands.list.length) {
      box.innerHTML = `<div class="pn-msg">Không có từ nào đọc là “${esc(v.syl.join(' '))}”.</div>`;
      return;
    }
    box.innerHTML = (cands.loose ? '<div class="pn-msg" style="width:100%">Không khớp thanh điệu — hiện các từ cùng âm:</div>' : '') + cands.list.slice(0, 12).map((e, n) => `<button type="button" class="pn-cand ${n === 0 ? 'first' : ''}" data-n="${n}"><span class="h">${esc(e.text)}</span><span class="p">${esc(PM().numbered(e))}</span><span class="m">${esc(e.meaning)}</span></button>`).join('');
    box.querySelectorAll('.pn-cand').forEach(b => b.onclick = () => pickCand(cands.list[Number(b.dataset.n)], b));
  }
  function pickCand(e, btn) {
    if (locked || !e) return;
    const w = cur.sent.word, ok = e.text === w.text && e.key === w.t.key;
    const toneBad = ok && inp && inp.hasTone && inp.syl.length === w.t.syl.length && inp.tones.some((x, n) => x !== null && (x === 5 ? 0 : x) !== w.t.tones[n]);
    if (toneBad) {
      if (!cur.hinted) recordItem(false);
      $('px-in').className = 'pn-in bad';
      fb(`<b>⚠️ Đúng chữ nhưng sai thanh điệu</b><div class="note">Đúng là <b>${esc(PM().numbered(w.t))}</b>. Gõ lại với thanh đúng.</div>`, 'bad');
      return;
    }
    if (ok) {
      if (!cur.hinted) recordItem(true);
      finish(true);
      if (btn) btn.classList.add('ok');
    } else {
      if (!cur.hinted) recordItem(false);
      if (btn) btn.classList.add('bad');
      $('px-in').className = 'pn-in bad';
      fb(`<b>❌ Chưa đúng</b><div class="note">${e.key === w.t.key ? 'Đúng cách đọc nhưng sai chữ Hán — xem lại nghĩa câu.' : 'Hãy đọc kỹ câu, sửa pinyin rồi chọn lại, hoặc bấm “Đáp án”.'}</div>`, 'bad');
    }
  }
  function lcs(a, b) {
    const m = a.length, n = b.length, d = Array.from({
      length: m + 1
    }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]);
    const hit = new Array(m).fill(false);
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) {
        hit[i - 1] = true;
        i--;
        j--;
      } else if (d[i - 1][j] >= d[i][j - 1]) i--; else j--;
    }
    return {
      n: d[m][n],
      hit: hit
    };
  }
  function check() {
    if (locked || !cur) return;
    const s = cur.sent, v = PM().parseInput($('px-in').value);
    if (!v.key) {
      fb('<b>Hãy gõ pinyin trước.</b>', '');
      return;
    }
    if (v.key === s.t.key) {
      const sameSplit = v.syl.length === s.t.syl.length;
      const bad = v.hasTone && sameSplit ? v.tones.map((x, n) => x !== null && (x === 5 ? 0 : x) !== s.t.tones[n] ? n : -1).filter(n => n >= 0) : [];
      if (bad.length) {
        if (!cur.hinted) recordItem(false);
        $('px-in').className = 'pn-in bad';
        fb(`<b>⚠️ Đúng âm nhưng sai thanh điệu</b><div class="px-diff">${s.t.syl.map((y, n) => `<span class="${bad.includes(n) ? 'x' : 'm'}">${esc(y.replace(/v/g, 'ü') + (s.t.tones[n] || ''))}</span>`).join('')}</div><div class="note">Các âm gạch chân đã gõ sai thanh.</div>`, 'bad');
        return;
      }
      if (!cur.hinted) recordItem(true);
      finish(true);
      return;
    }
    const L = lcs(s.t.syl, v.syl), pct = Math.round(L.n / Math.max(s.t.syl.length, v.syl.length) * 100);
    if (!cur.hinted) recordItem(false);
    $('px-in').className = 'pn-in bad';
    fb(`<b>❌ Khớp ${pct}%</b><div class="px-diff">${s.t.syl.map((y, n) => `<span class="${L.hit[n] ? 'm' : 'x'}">${esc(y.replace(/v/g, 'ü'))}</span>`).join('')}</div><div class="note">Âm xanh là đúng, đỏ là thiếu/sai. Sửa lại rồi kiểm tra tiếp, hoặc bấm “Đáp án”.</div>`, 'bad');
  }
  function pickChoice(o, btn) {
    if (locked) return;
    const ok = o === cur.answer;
    recordItem(ok);
    if (btn) btn.classList.add(ok ? 'ok' : 'bad');
    $('px-opts').querySelectorAll('.pn-cand').forEach(b => {
      if (cur.options[Number(b.dataset.n)] === cur.answer) b.classList.add('ok');
    });
    finish(ok, cur.explain);
  }
  function rateShadow(r) {
    if (locked) return;
    recordItem(r > 0);
    finish(r > 0, r === 0 ? 'Đã lưu vào sổ lỗi — sẽ gặp lại sớm.' : '');
  }
  function reveal() {
    if (locked || !cur) return;
    if (!cur.hinted) recordItem(false);
    cur.hinted = true;
    finish(false);
  }
  function finish(ok, extra) {
    locked = true;
    $('px-in').disabled = true;
    const s = cur.sent;
    let body = '';
    if (s) body = `<div class="han">${esc(s.text)}</div><div class="py">${esc(s.pinyin)}</div><div>${esc(s.meaning)}</div>`;
    if (extra) body += `<div class="note">${esc(extra)}</div>`;
    if (cur.hinted && ok) body += '<div class="note">Đã dùng gợi ý nên không tính điểm.</div>';
    fb(`<b>${ok ? '✅ Chính xác!' : 'Đáp án'}</b>${body}`, ok ? 'good' : 'bad');
    $('px-in').className = 'pn-in ' + (ok ? 'good' : '');
    $('px-opts').querySelectorAll('button').forEach(b => {
      if (cur.type === 'shadow') b.disabled = true;
    });
    const vi = $('px-vi');
    if (vi && s) vi.textContent = s.meaning;
    const nx = $('px-next');
    nx.classList.add('visible');
    nx.textContent = run.i + 1 >= run.items.length ? 'Xem kết quả →' : 'Câu tiếp →';
    if (s && typeof autoSpeakQ !== 'undefined' && autoSpeakQ && cur.type !== 'shadow') {
      try {
        speakAt(s.text, ttsRate);
      } catch (e) {}
    }
  }
  function next() {
    if (!locked) return;
    run.i++;
    if (run.i >= run.items.length) {
      const ok = run.results.filter(r => r.ok).length, tot = run.results.length;
      if (run.onDone) {
        const f = run.onDone;
        run.onDone = null;
        f({
          ok: ok,
          total: tot,
          results: run.results
        });
        return;
      }
      showFinal({
        score: ok,
        totalText: '/ ' + (tot || run.items.length),
        pct: tot ? ok / tot * 100 : 0,
        title: run.title + ' — hoàn thành',
        sub: 'Câu sai đã vào sổ lỗi để ôn lại'
      });
      const b = document.getElementById('btn-practice-wrong');
      if (b) b.classList.remove('show');
      window._lastWrongTexts = [];
      return;
    }
    setItem();
  }
  function planState() {
    const p = safeStorage.get(LS_PLAN);
    return p && p.date === todayStr() ? p : {
      date: todayStr(),
      done: {},
      rewarded: false
    };
  }
  const planSave = p => safeStorage.set(LS_PLAN, p);
  const notTrans = m => m.drill !== 'vi2zh' && !(m.item && m.item.type === 'vi2zh');
  function dueMistakes() {
    return {
      drill: SC().mistakes('drill').filter(notTrans).filter(m => (m.nextReview || 0) <= Date.now()),
      pin: SC().mistakes('pinyin').filter(m => (m.nextReview || 0) <= Date.now())
    };
  }
  function planSteps() {
    const d = dueMistakes(), steps = [];
    if (d.drill.length + d.pin.length) steps.push({
      id: 'review',
      icon: '📒',
      label: `Ôn lỗi cũ (${d.drill.length + d.pin.length} mục đến hạn)`
    });
    steps.push({
      id: 'pinyin',
      icon: '⌨️',
      label: 'Gõ pinyin 8 từ'
    }, {
      id: 'fill',
      icon: '✏️',
      label: 'Điền chỗ trống 5 câu'
    }, {
      id: 'dict',
      icon: '🎧',
      label: 'Chép chính tả 3 câu'
    }, {
      id: 'shadow',
      icon: '🗣',
      label: 'Đọc theo 3 câu'
    });
    return steps;
  }
  function stepDone(id) {
    const p = planState();
    p.done[id] = true;
    planSave(p);
    const steps = planSteps();
    if (!p.rewarded && steps.every(s => p.done[s.id])) {
      p.rewarded = true;
      planSave(p);
      try {
        gainXP(30);
      } catch (e) {}
      toastMsg('🎉 Hoàn thành lộ trình hôm nay! +30 XP');
    }
  }
  function runStep(id) {
    const back = () => openHub();
    const fin = () => r => {
      stepDone(id);
      toastMsg(`✅ Xong bước (${r.ok}/${r.total})`);
      back();
    };
    if (id === 'review') {
      const d = dueMistakes();
      if (d.drill.length) {
        reviewDrill(fin());
        return;
      }
      PM().onFinish = fin();
      PM().openMistakes();
      return;
    }
    if (id === 'pinyin') {
      const pool = wordPool().map(w => PM().lexicon().list.find(e => e.text === w.text && e.key === w.t.key)).filter(Boolean);
      if (pool.length < 3) {
        toastMsg('Không đủ từ ở phạm vi này.');
        return;
      }
      PM().onFinish = fin();
      PM().start(scope.startsWith('HSK') ? scope : 'Tất cả', {
        pool: pool,
        n: 8,
        title: '📅 ' + scopeLabel(scope)
      });
      return;
    }
    const n = {
      fill: 5,
      dict: 3,
      shadow: 3
    }[id];
    startRun(id, build(id, n), {
      onDone: fin(),
      onQuit: back,
      replay: () => runStep(id)
    });
  }
  function reviewDrill(onDone) {
    const due = SC().mistakes('drill').filter(m => m.item && notTrans(m)).sort((a, b) => a.nextReview - b.nextReview).slice(0, 8).map(m => m.item);
    if (!due.length) {
      toastMsg('Chưa có câu luyện thêm nào cần ôn. 🎉');
      return;
    }
    startRun('mix', due, {
      title: '📒 Ôn lỗi luyện thêm',
      onDone: onDone,
      replay: () => reviewDrill(onDone)
    });
  }
  function startExam() {
    const parts = [ [ 'choice', 7 ], [ 'fill', 7 ], [ 'dict', 6 ] ];
    let items = [];
    parts.forEach(([t, n]) => {
      items = items.concat(build(t, n));
    });
    if (items.length < 6) {
      toastMsg('Không đủ dữ liệu để thi thử ở “' + scopeLabel(scope) + '”.');
      return;
    }
    const t0 = Date.now();
    startRun('exam', items, {
      title: '📝 Thi thử ' + scopeLabel(scope),
      replay: startExam,
      onQuit: openHub,
      onDone: r => {
        const pct = r.total ? Math.round(r.ok / r.total * 100) : 0, mins = Math.max(1, Math.round((Date.now() - t0) / 6e4));
        const by = {};
        r.results.forEach(x => {
          (by[x.type] = by[x.type] || {
            ok: 0,
            n: 0
          }).n++;
          if (x.ok) by[x.type].ok++;
        });
        const names = {
          choice: 'Đồng/đa âm',
          fill: 'Điền từ',
          dict: 'Chính tả',
          vi2zh: 'Việt→Trung'
        };
        const detail = Object.keys(by).map(k => `${names[k] || k}: ${by[k].ok}/${by[k].n}`).join(' · ');
        const hist = safeStorage.get(LS_EXAM) || [];
        hist.push({
          d: todayStr(),
          scope: scope,
          pct: pct,
          ok: r.ok,
          n: r.total
        });
        safeStorage.set(LS_EXAM, hist.slice(-10));
        const grade = pct >= 90 ? 'Xuất sắc 🏆' : pct >= 75 ? 'Tốt 👍' : pct >= 60 ? 'Đạt — cần ôn thêm phần sai' : 'Chưa đạt — nên ôn lỗi rồi thi lại';
        showFinal({
          score: r.ok,
          totalText: '/ ' + r.total,
          pct: pct,
          title: 'Thi thử ' + scopeLabel(scope) + ' · ' + grade,
          sub: `${detail} · ${mins} phút`
        });
        const b = document.getElementById('btn-practice-wrong');
        if (b) b.classList.remove('show');
        window._lastWrongTexts = [];
      }
    });
  }
  function validate() {
    const issues = {
      fmt: [],
      cnt: [],
      ex: [],
      dup: [],
      empty: []
    }, P = PM().parseTarget;
    const lv = {}, seenKey = new Map;
    (typeof hskAll !== 'undefined' ? hskAll : []).forEach(w => {
      lv[w.level] = (lv[w.level] || 0) + 1;
      const tag = `${w.level} · ${w.text}`;
      [ w.meaning, w.example, w.examplePinyin, w.exampleMeaning ].forEach(f => {
        if (f && /^["“”]|["“”]$|\\|\n/.test(String(f).trim())) issues.fmt.push(`${tag}: ký tự thừa (" hoặc \\) ở “${String(f).slice(0, 30)}…”`);
      });
      if (!w.meaning || !w.example || !w.examplePinyin || !w.exampleMeaning) issues.empty.push(`${tag}: thiếu ${[ !w.meaning && 'nghĩa', !w.example && 'ví dụ', !w.examplePinyin && 'pinyin ví dụ', !w.exampleMeaning && 'dịch ví dụ' ].filter(Boolean).join(', ')}`);
      const hanN = (coreOf(w.text).match(HAN) || []).length, t = P(w.pinyin);
      if (hanN && t.syl.length && Math.abs(t.syl.length - hanN) > 0 && !/儿/.test(w.text)) issues.cnt.push(`${tag}: ${hanN} chữ nhưng pinyin “${w.pinyin}” có ${t.syl.length} âm`);
      if (w.example && w.examplePinyin) {
        const eh = (w.example.match(HAN) || []).length, er = (w.example.match(/儿/g) || []).length, et = P(w.examplePinyin);
        if (!/[a-zA-Zāáǎà]/.test(w.examplePinyin)) issues.ex.push(`${tag}: pinyin ví dụ không có chữ Latin (“${w.examplePinyin.slice(0, 20)}”)`); else if (et.syl.length !== eh && et.syl.length !== eh - er) issues.ex.push(`${tag}: ví dụ ${eh} chữ nhưng pinyin ${et.syl.length} âm — “${w.example}”`);
      }
      const k = w.text + '|' + t.key;
      if (seenKey.has(k)) issues.dup.push(`${tag}: trùng với ${seenKey.get(k)} (cùng chữ, cùng cách đọc)`); else seenKey.set(k, w.level);
    });
    return {
      issues: issues,
      lv: lv
    };
  }
  function openValidator() {
    const {issues: issues, lv: lv} = validate();
    const sec = (title, arr, w) => `<div class="hub-card"><h3>${title} (${arr.length})</h3>${arr.length ? arr.slice(0, 25).map(x => `<div class="iss ${w ? 'w' : ''}">${esc(x)}</div>`).join('') + (arr.length > 25 ? `<div class="pn-msg">…và ${arr.length - 25} mục nữa (xem bằng “Sao chép báo cáo”).</div>` : '') : '<div class="pn-msg">Không có vấn đề. ✅</div>'}</div>`;
    const miss = [ 'HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6' ].filter(l => !lv[l]);
    const total = issues.fmt.length + issues.cnt.length + issues.ex.length + issues.dup.length + issues.empty.length;
    subPanel('🧪 Kiểm tra dữ liệu', `<div class="hub-card"><h3>Tổng quan</h3><div class="hub-sub-body">${Object.keys(lv).sort().map(l => `<b class="k">${l}</b>: ${lv[l]}`).join(' · ')}<br>Dữ liệu khẩu ngữ: ${(window.dictWords || []).length} từ, ${(window.dictSentences || []).length} câu.<br>${miss.length ? '⚠️ Chưa có dữ liệu: ' + miss.join(', ') : '✅ Đủ HSK1–6.'}<br>Tổng số vấn đề: <b>${total}</b></div></div>` + sec('Ký tự thừa / dòng bị vỡ', issues.fmt) + sec('Pinyin ví dụ lệch số chữ', issues.ex, true) + sec('Pinyin từ lệch số chữ', issues.cnt, true) + sec('Trùng lặp', issues.dup, true) + sec('Thiếu dữ liệu', issues.empty) + `<button class="hub-btn" id="val-copy">📋 Sao chép báo cáo</button>`);
    $('val-copy').onclick = () => {
      const txt = [ 'BÁO CÁO DỮ LIỆU', ...Object.entries({
        'Ký tự thừa': issues.fmt,
        'Ví dụ lệch': issues.ex,
        'Từ lệch': issues.cnt,
        'Trùng': issues.dup,
        'Thiếu': issues.empty
      }).flatMap(([k, a]) => [ '## ' + k + ' (' + a.length + ')', ...a ]) ].join('\n');
      try {
        navigator.clipboard.writeText(txt);
        toastMsg('Đã sao chép báo cáo');
      } catch (e) {
        toastMsg('Không sao chép được');
      }
    };
  }
  function openPreload() {
    subPanel('📥 Tải sẵn dữ liệu nét (offline)', `<div class="hub-card hub-sub-body">Tải thứ tự/hướng nét của các chữ trong từ HSK về trình duyệt để <b>Luyện viết</b> báo lỗi thứ tự nét ngay cả khi không có mạng. Cần mạng khi tải (nguồn hanzi-writer-data). Mỗi chữ ~3 KB.<br><br>\n      <select id="pl-lv" class="hub-scope" style="width:100%;padding:9px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text)"><option value="1">HSK1</option><option value="2" selected>HSK1–2</option><option value="3">HSK1–3</option></select>\n      <div class="hub-bar" style="margin-top:10px"><i id="pl-bar" style="width:0"></i></div><div id="pl-txt" class="pn-msg">Chưa bắt đầu.</div>\n      <button class="hub-btn" id="pl-go" style="width:100%">⬇️ Bắt đầu tải</button></div>`);
    $('pl-go').onclick = async () => {
      const max = Number($('pl-lv').value), chars = [ ...new Set(data().words.filter(w => w.level !== 'Data' && Number(w.level.slice(3)) <= max).flatMap(w => [ ...w.text ].filter(c => /[一-鿿]/.test(c)))) ];
      let done = 0, fail = 0, streak = 0, stop = false;
      $('pl-go').disabled = true;
      const lsHas = c => {
        try {
          return !!localStorage.getItem('cn_hw_' + c);
        } catch (e) {
          return false;
        }
      };
      const todo = chars.filter(c => !lsHas(c)), total = todo.length, had = chars.length - total;
      const upd = () => {
        $('pl-bar').style.width = done / Math.max(1, total) * 100 + '%';
        $('pl-txt').textContent = `${done}/${total} chữ mới · đã có sẵn ${had} · lỗi ${fail}`;
      };
      const worker = async () => {
        while (todo.length && !stop) {
          const c = todo.shift();
          const j = await HanziRecognizer.getStrokeData(c).catch(() => null);
          done++;
          if (j) streak = 0; else {
            fail++;
            if (++streak >= 8) stop = true;
          }
          upd();
        }
      };
      upd();
      await Promise.all([ worker(), worker(), worker(), worker() ]);
      $('pl-txt').textContent = (stop ? '⚠️ Không tải được (có thể đang offline) — hãy bật mạng rồi thử lại. ' : '✅ Xong. ') + `Đã lưu ${chars.filter(lsHas).length}/${chars.length} chữ trong máy.`;
      $('pl-go').disabled = false;
    };
  }
  function quizPool(sc) {
    const all = typeof hskAll !== 'undefined' ? hskAll : [];
    if (sc === 'SLANG') return (window.dictWords || []).filter(w => w.meaning && w.meaning.trim());
    if (sc === 'ALL') return all;
    if (sc.startsWith('topic:')) {
      const tp = topicOf(sc.slice(6));
      return tp ? all.filter(w => w.meaning && tp.re.test(w.meaning)) : [];
    }
    return all.filter(w => w.level === sc);
  }
  function openQuizPanel() {
    const cs = 'padding:9px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);font:700 13px var(--font-body)';
    const sv = safeStorage.get('cn_quiz_hsk_range') || {
      a: 1,
      b: 2,
      n: 20
    };
    const num = (v, c) => `<option value="${v}" ${v === c ? 'selected' : ''}>${v}</option>`;
    const cnt = `<select id="qz-n" style="${cs}">${[ 10, 20, 30, 40 ].map(v => `<option value="${v}" ${v === sv.n ? 'selected' : ''}>${v} câu</option>`).join('')}</select>`;
    subPanel('🚀 Trắc nghiệm (như Đấu trí)', `\n      <div class="hub-card hub-sub-body">Cùng kiểu câu hỏi như Đấu trí: Hán → nghĩa, nghĩa → Hán, pinyin, điền từ, nghĩa cả câu; đáp án nhiễu cùng cấp, không trùng nghĩa.</div>\n      <div class="hub-card hub-sub-body"><b class="k">📐 Theo khoảng HSK</b><br>\n        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0">Từ <select id="qz-a" style="${cs}">${[ 1, 2, 3, 4, 5, 6 ].map(v => num(v, sv.a)).join('')}</select> đến <select id="qz-b" style="${cs}">${[ 1, 2, 3, 4, 5, 6 ].map(v => num(v, sv.b)).join('')}</select> ${cnt}</div>\n        <button class="hub-btn" id="qz-range" style="width:100%">▶ Bắt đầu theo khoảng HSK</button></div>\n      <div class="hub-card hub-sub-body"><b class="k">🎯 Theo phạm vi đang chọn</b><br>${esc(scopeLabel(scope))} · ${quizPool(scope).length} từ\n        <button class="hub-btn" id="qz-scope" style="width:100%;margin-top:8px">▶ Bắt đầu</button></div>`);
    const n = () => Number($('qz-n').value) || 20;
    $('qz-range').onclick = () => {
      let a = Number($('qz-a').value), b = Number($('qz-b').value);
      if (a > b) [a, b] = [ b, a ];
      safeStorage.set('cn_quiz_hsk_range', {
        a: a,
        b: b,
        n: n()
      });
      if (hskPoolSafe('range:' + a + '-' + b) < 4) {
        toastMsg('Chưa đủ dữ liệu HSK ' + a + '-' + b);
        return;
      }
      runHSKQuiz('range:' + a + '-' + b, n());
    };
    $('qz-scope').onclick = () => runPoolQuiz(quizPool(scope), scopeLabel(scope), n());
  }
  const hskPoolSafe = lv => {
    try {
      return hskPool(lv).length;
    } catch (e) {
      return 0;
    }
  };
  let subOpen = false;
  function subPanel(title, html) {
    subOpen = true;
    $('hub-body').innerHTML = `<div class="hub-card"><h3>${title}</h3></div><div class="hub-sub-body" style="display:flex;flex-direction:column;gap:8px">${html}</div>`;
  }
  function scopeSelect() {
    const o = (v, l) => `<option value="${v}" ${v === scope ? 'selected' : ''}>${l}</option>`;
    return `<div class="hub-scope"><span style="font-size:12px;color:var(--muted);font-weight:800">Phạm vi</span><select id="hub-scope"><optgroup label="Cấp độ">${[ 'HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6' ].map(l => o(l, l)).join('')}${o('ALL', 'Tất cả HSK')}</optgroup><optgroup label="Khẩu ngữ">${o('SLANG', 'Khẩu ngữ (Data.js)')}</optgroup><optgroup label="Chủ đề">${TOPICS.map(t => o('topic:' + t.id, t.label)).join('')}</optgroup></select></div>`;
  }
  function openHub() {
    buildScreens();
    subOpen = false;
    show('hub-screen');
    currentGameStarter = null;
    const p = planState(), steps = planSteps(), doneN = steps.filter(s => p.done[s.id]).length;
    const d = dueMistakes(), mistakeN = SC().mistakes('drill').filter(notTrans).length + SC().mistakes('pinyin').length;
    const hist = (safeStorage.get(LS_EXAM) || []).slice(-1)[0];
    $('hub-body').innerHTML = scopeSelect() + `\n      <div class="hub-card"><h3>📅 Lộ trình hôm nay · ${doneN}/${steps.length}</h3><div class="hub-bar"><i style="width:${doneN / steps.length * 100}%"></i></div>\n        <div class="hub-steps">${steps.map(s => `<button class="hub-step ${p.done[s.id] ? 'done' : ''}" data-s="${s.id}"><span>${s.icon}</span>${esc(s.label)}<span class="ck">${p.done[s.id] ? '✅' : '▶'}</span></button>`).join('')}</div></div>\n      <div class="hub-grid">\n        <button class="hub-btn" data-d="fill">✏️ Điền chỗ trống<small>gõ từ còn thiếu</small></button>\n        <button class="hub-btn" data-d="dict">🎧 Chép chính tả<small>nghe câu → gõ pinyin</small></button>\n        <button class="hub-btn" data-d="choice">🧠 Đồng âm / đa âm<small>chọn đúng theo ngữ cảnh</small></button>\n        <button class="hub-btn" data-d="shadow">🗣 Đọc theo<small>nghe chậm → nhại lại</small></button>\n        <button class="hub-btn" data-d="pinyin">⌨️ Gõ pinyin từ<small>nghe / nghĩa → gõ</small></button>\n        <button class="hub-btn" data-d="exam">📝 Thi thử<small>${hist ? 'gần nhất ' + hist.pct + '% · ' + esc(scopeLabel(hist.scope)) : '20 câu hỗn hợp'}</small></button>\n        <button class="hub-btn" data-d="review">📒 Ôn lỗi<small>${mistakeN} mục (${d.drill.length + d.pin.length} đến hạn)</small></button>\n        <button class="hub-btn" data-d="quiz">🚀 Trắc nghiệm<small>như Đấu trí · chọn phạm vi</small></button>\n        <button class="hub-btn" data-d="validate">🧪 Kiểm tra dữ liệu<small>tìm dòng lỗi, trùng</small></button>\n        <button class="hub-btn" data-d="preload">📥 Tải sẵn nét<small>dùng offline</small></button>\n      </div>`;
    $('hub-scope').onchange = e => {
      scope = e.target.value;
      safeStorage.set(LS_SCOPE, scope);
      openHub();
    };
    $('hub-body').querySelectorAll('.hub-step').forEach(b => b.onclick = () => runStep(b.dataset.s));
    $('hub-body').querySelectorAll('[data-d]').forEach(b => b.onclick = () => {
      const k = b.dataset.d, back = openHub;
      if ([ 'fill', 'dict', 'choice', 'shadow' ].includes(k)) startRun(k, build(k, 10), {
        onQuit: back
      }); else if (k === 'pinyin') {
        const pool = wordPool().map(w => PM().lexicon().list.find(e => e.text === w.text && e.key === w.t.key)).filter(Boolean);
        if (pool.length < 3) {
          toastMsg('Không đủ từ ở phạm vi này.');
          return;
        }
        PM().start(scope.startsWith('HSK') ? scope : 'Tất cả', {
          pool: pool,
          n: 10,
          title: scopeLabel(scope)
        });
      } else if (k === 'exam') startExam(); else if (k === 'review') {
        if (SC().mistakes('drill').filter(notTrans).length) reviewDrill(null); else if (SC().mistakes('pinyin').length) PM().openMistakes(); else toastMsg('Chưa có lỗi nào để ôn. 🎉');
      } else if (k === 'quiz') openQuizPanel(); else if (k === 'validate') openValidator(); else if (k === 'preload') openPreload();
    });
  }
  window.PracticeHub = {
    open: openHub,
    build: build,
    _data: data,
    _run: () => run,
    _polyQ: polyQuestions,
    _homoQ: homoQuestions,
    _validate: validate,
    toMarks: toMarks,
    TOPICS: TOPICS,
    setScope: s => {
      scope = s;
    }
  };
})();

(function() {
  function resolve(tok, el, ev) {
    if (tok === '@this') return el;
    if (tok === '@value') return el.value;
    if (tok === '@checked') return el.checked;
    if (tok === '@event') return ev;
    if (tok.indexOf('@fn:') === 0) return window[tok.slice(4)];
    if (tok === 'true') return true;
    if (tok === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(tok)) return Number(tok);
    return tok;
  }
  function dispatch(type, ev) {
    const el = ev.target.closest && ev.target.closest('[data-' + type + ']');
    if (!el) return;
    const name = el.getAttribute('data-' + type);
    if (name.indexOf('@click:') === 0) {
      const t = document.getElementById(name.slice(7));
      if (t) t.click();
      return;
    }
    const fn = window[name];
    if (typeof fn !== 'function') {
      console.warn('Chưa có hàm', name);
      return;
    }
    const raw = el.getAttribute('data-args');
    fn.apply(null, raw ? raw.split('|').map(t => resolve(t, el, ev)) : []);
  }
  [ 'click', 'input', 'change' ].forEach(type => document.addEventListener(type, ev => dispatch(type, ev)));
})();
