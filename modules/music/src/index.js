const $ = x =>{
	var selectors = [...document.querySelectorAll(x)];
	if(selectors.length>1){
		return selectors;
	}else if(selectors.length==1){
		return selectors[0];
	}else{
		return [];
	}
};
const getInnerText = (element) => {
    return (typeof element.textContent == 'string') ? element.textContent : element.innerText;
};
const setInnerText = (element, text) => {
    if (typeof element.textContent == 'string') {
        element.textContent = text;
    } else {
        element.innerText = text;
    }
};
function entries(obj) {
  let arr = [];
  for (let key of Object.keys(obj)) {
    arr.push([key, obj[key]]);
  }
  return arr;
}
const getIndex = (current, obj)=>{ 
	for (let i = 0, length = obj.length; i<length; i++) { 
		if (obj[i] == current) { return i;} 
	}
	return 0;
};

const jsonp = (url, option) => {
        let s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        let c = option?`?${entries(option).map(x=>x.join('=')).join('&')}`:'';
        s.src = `${url}${c}`;
        document.body.appendChild(s);
        setTimeout(function() {
            s.parentNode.removeChild(s);
        }, 2000);
};
class Audio {
	constructor() {
		this.audio = document.createElement('audio');
		this.audio.src = '';
		this.audio.autoplay = true;
		this.audio.loop = true;
		document.body.appendChild(this.audio);
	}
	play(){
		this.play();
	}
	pause(){
		this.pause();
	}
	muted(){
		this.audio.muted = true;
	}
	unmuted(){
		this.audio.muted = false;
	}
	volumeUp(){
		this.audio.volume = this.audio.volume+0.01>=1?1:this.audio.volume+0.01;
	}
	volumeDown(){
		this.audio.volume=this.audio.volume-0.01<=0?0:this.audio.volume-0.01;
	}
	setVolume(num){
		this.audio.volume = num;
	}
	setSrc(src){
		this.audio.src=src;
	}
}
class Player extends Audio {
	constructor(args) {
		super();
		this.btn = {
			play:$('#play'),
			next:$('#next'),
			prev:$('#prev'),
			volume:$('#volume'),
			setVolume:$('#setVolume'),
			volumeValue:$('#volumeValue'),
			setSrc:$('#setSrc'),
		};
		this.playInfo = {
			song:$('#play-songName'),
			time:$('#play-time'),
			load:$('#play-load'),
			pro:$('#play-pro'),
			lrc:$('#lrc'),
			lrcBottom:$('#lrcBottom'),
			lrcMove:$('#lrcMove'),
		};
		this.video = $('#video');
		this.list = {
			className:'',
			count:0,
		};
		this.init();
	}
	init(){
		this.audioSet();
		this.btnBind();
		this.lrc = '';
	}
	setInfo(playInfo){
		this.playInfo.song.innerHTML = playInfo;
	}
	setVolumeValue(num){
		this.btn.setVolume.value = num||this.audio.volume.toFixed(1);
		this.btn.volumeValue.value = num||this.audio.volume.toFixed(1);
	}
	timeTrans(time){
		let s = parseInt(time);
		let m = parseInt(s/60);
		m=m<10?`0${m}`:m;
		s = s&60;
		s=s<10?`0${s}`:s;
		return `${m}:${s}`;
	}
	resetPlay(){
		this.playInfo.pro.style.width = 0;
		this.playInfo.time.innerHTML = '00:00 / 00:00';
		this.lrc = '';
		this.audio.pause();
		this.video.pause();
		this.playInfo.lrc.innerHTML = '';
		this.playInfo.lrcMove.style.marginTop = 0;
		this.playInfo.lrcBottom.innerHTML = '';
	}
	drawLrc(){
		let code = `<p>${this.lrc.map(x=>x[1]).join('</p><p>')}</p>`;
		this.playInfo.lrcBottom.innerHTML = code;
		this.playInfo.lrc.innerHTML = code;
		this.playInfo.lrcMove.style.height = this.playInfo.lrcBottom.style.height;
	}
	audioSet(){
		this.audio.onended = this.resetPlay;
		this.audio.onplay = ()=>this.btn.play.classList.add('active');
		this.audio.onpause = ()=>this.btn.play.classList.remove('active');
		this.audio.ontimeupdate =  e =>{
			let now = this.timeTrans(this.audio.currentTime);
			let duration = this.timeTrans(this.audio.duration);
			let d = `${(this.audio.currentTime/this.audio.duration)*100}%`;
			this.playInfo.pro.style.width = d;
			this.playInfo.time.innerHTML = `${now} / ${duration}`;
			if(this.lrc){
				for (let i = 0, l = this.lrc.length; i < l; i++) {
			        if (this.audio.currentTime > this.lrc[i][0]) {
			        	let active = this.playInfo.lrc.querySelector('.active'),lrc = this.playInfo.lrc,now = lrc.childNodes[i];
			            if(getIndex(active,lrc.childNodes)<=i&&!now.classList.contains('active')){
			            	if(lrc.querySelector('.active')){lrc.querySelector('.active').classList.remove('active');}
			            	now.classList.add('active');
			            	this.playInfo.lrcMove.style.marginTop = `${-60*i}px`;
			            }
			        }
			    }
			}
		};
	}
	btnBind(){
		this.btn.play.onclick = ()=>this.btn.play.classList.contains('active')?this.audio.pause():this.audio.play();
		this.btn.volume.onclick = ()=>{
			if(this.audio.muted){
				this.unmuted();
				this.btn.volume.setAttribute('data-volume',2);
			}else{
				this.muted();
				this.btn.volume.setAttribute('data-volume',0);
			}
		};
		this.btn.setVolume.onchange = ()=>{
			let v = this.btn.setVolume.value;
			this.setVolumeValue(v);
			this.setVolume(v);
		};
		this.btn.setSrc.onchange = ()=>{
			this.setSrc(this.btn.setVolume.value);
		};
	}
}
const player = new Player();
let loadData = {};
class Search {
	constructor() {
		this.list = $('#list');
		this.searchText = $('#search');
		this.searchBtn = $('#searchSub');
		this.showSearch = $('#showSearch');
		this.searchBox = $('#searchBox');
		this.video = $('#video');
		this.bind();
		this.data = {
			keywords:"",
			size:0,
			pages:0,
			rows:0,
			page:0,
			data:[]
		};
	}
	bind(){
		this.showSearch.onclick = ()=>this.searchBox.classList.toggle('active');
		this.searchBtn.onclick = ()=>{
			this.searchBox.classList.remove('active');
			this.searchMusic(this.searchText.value);
		};
		this.list.onclick = (event)=>{
			let e = event||window.event;
			let target = e.target||e.srcElement;
			let nodeName = target.nodeName.toLowerCase();
			let className = target.classList;
			let tParent = target.parentNode;
			let id = tParent.getAttribute('data-id');
			if(nodeName=='i'){
				let t = getInnerText(target);
				this.searchMusic(t);
				this.searchText.value = t;
			}else{
				if(!tParent.classList.contains('no')){
					let data = loadData[id];
					player.resetPlay();
					player.setInfo(`${data.song_name}-${data.singer_name}`);
					if(!className.contains('mv')){
						player.setSrc(!className.contains('sq')?data.url_list[data.url_list.length-1].url:data.ll_list[0].url);
						this.searchLrc(id,data.song_name,data.singer_name);
						this.video.src = '';
						player.audio.play();
					}else{
						list.showBox('mv');
						player.audio.pause();
						this.video.src = data.mv_list[data.mv_list.length-1].url;
						this.video.play();
					}
				}
			}
		};
		this.list.onscroll = ()=>{
			if(this.list.scrollTop + this.list.offsetHeight>=this.list.scrollHeight&&this.data.page < this.data.pages){
				this.searchMusic(this.data.keywords,this.data.page+1,this.data.size,true);
			}
		};
		document.body.onkeyup = (event)=>{
			let e = event||window.event;
			let keyCode = e.keyCode||e.keyWhich;
			if(keyCode == 13){/*enter*/
				if(!this.searchBox.classList.contains('active')){
					this.searchBox.classList.add('active');
					this.searchText.select();
				}else{
					if(!this.searchText.value||this.searchText.value==this.data.keywords){
						this.searchBox.classList.remove('active');
						return;
					}else{
						this.searchBox.classList.remove('active');
						this.searchMusic(this.searchText.value);
					}
				}
			}else if(keyCode == 32){/*space*/
				if(!this.searchBox.classList.contains('active')){
					this.searchBox.classList.remove('active');
					this.searchMusic(this.searchText.value);
				}
			}
		};
	}
	searchMusic(keywords,page,size,addIf){
		list.tips("搜索："+keywords);
		var p = page||1,
			s = size||200,
			add = addIf||false;
		window.callbackSearchMusic = (data)=>{
			this.data.pages = data.pages;
			this.data.keywords = keywords;
			this.data.size = s;
			this.data.rows = data.rows;
			this.data.page = p;
			this.data.data = data.data;
			list.tips("loading...");
			this.drawData(add);
		};
		jsonp('http://search.dongting.com/song/search/old',{
			q:keywords,
			page:p,
			size:s,
			time:(new Date()).getTime(),
			callback:'callbackSearchMusic'
		});
	}
	drawData(add){
		if(!add){loadData = {};}
		let code = this.data.data.map(x=>{
			loadData[x.song_id] = x;
			let no = !x.out_list?'':' no',
				hasSQ = !x.ll_list?'':' hasSQ',
				hasMV = !x.mv_list?'':' hasMV',
				singer_name = !x.singer_name?'':`<i>${x.singer_name}</i>`,
				album_name = !x.album_name?'':`<i>${x.album_name}</i>`;
			let c = `<li data-id='${x.song_id}' class='${no}${hasSQ}${hasMV}'>
			<span class='song'>${x.song_name}</span>
			<span class='info'>${singer_name+album_name}</span>
			<span class='sq'>SQ</span>
			<span class='mv'>MV</span>
			</li>`.trim();
			return c;
		});
		if(!add){
			this.list.innerHTML = code;
		}else{
			this.list.innerHTML += code;
		}
	}
	searchLrc(id,song,singer){
		window.callbackSearchLrc = (data)=>{
			if(data.code!==1){
				player.playInfo.lrc.innerHTML = "<p class='active'>没有找到对应的歌词！</p>";
			}else{
				this.parseLyric(data.data.lrc);
			}
		};
		jsonp('http://lp.music.ttpod.com/lrc/down',{
			song_id:id,
			title:song,
			artist:singer,
			callback:'callbackSearchLrc'
		});
	}
	parseLyric(text){
	    let lines = text.split('\n'),
	        pattern = /\[\d{2}:\d{2}.\d{2,3}\]/g,
	        result = [];
	        lines.filter(x=>pattern.test(x));
	    if(lines[lines.length - 1].length === 0){lines.pop();}
	    lines.forEach(x=>{
	    	let time = x.match(pattern),value = x.replace(pattern, '');
	    	 if(!time){
	    	 	player.playInfo.lrc.innerHTML = "<p class='active'>歌词解析出错!</p>";
	    	 	return false;
	    	 }else{
	    	 	time.forEach(y=>{
	    	 		let t = y.slice(1, -1).split(':');
		            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
	    	 	});
	         }
	    });
	    player.lrc = result.sort((a, b)=>{return a[0] - b[0];});
	    player.drawLrc();
	}
}
class  List{
	constructor() {
		this.loadWord = 'loading...';
		this.loadEndsWord='loadingEnd';
		this.panelBtn = $('.panelBtn');
		this.tip = $("#tips");
		this.ajaxUrl = {
			pub:'http://www.dongting.com/ajax/v1.ard.tj.itlily.com/ttpod?id=281&page=1&size=100',
			class:'http://fm.api.ttpod.com/taglist?image_type=240_200',
			singer:'http://www.dongting.com/ajax/v1.ard.tj.itlily.com/ttpod?id=46'
		};
		this.listLoading = {
			singer:false,
			pub:false,
			class:false
		};
		this.bind();
	}
	tips(w){
		this.tip.innerHTML = w;
		this.tip.classList.add("active");
		setTimeout(()=>this.tip.classList.remove('active'),500);
	}
	loading(word){
		let w = word?`Loading Start：${word}`:List.loadWord;
		$("#loading span").innerHTML = w;
		$("#loading").classList.add("active");
		setTimeout(()=>$("#loading").classList.remove('active'),500);
	}
	loadingEnd(word){
		let w = word?`Loading Start：${word}`:this.loadWord;
		$("#loading span").innerHTML = w;
		setTimeout(()=>$("#loading").classList.remove('active'),1500);
	}
	bind(){
		this.panelBtn.forEach(x=>{
			x.onclick = ()=>{
				let type = x.getAttribute("data-type");
				this.showBox(type);
				if(type!=='lrc'){
					if($(`.${type}Box ul li`).length<=0){
						this.ajaxList(type);
					}else{
						$(`.${type}Box`).classList.remove('status2');
					}
				}
			};
		});
		$(".to-status1").forEach(x=>{x.onclick = ()=>{
			x.parentNode.classList.remove('status2');
		};});
		$(".box2").forEach(x=>{
			x.onclick = (event)=>{
				let e = event||window.event,
					t = e.target||e.srcElement,
					c = t.classList;
				if(c.contains('song')||c.contains('singer')||c.contains('album')){
					search.searchMusic(getInnerText(t));
				}else{
					return false;
				}
			};
		});
		$(".pubBox .box1").onclick = (event)=>{
			let e = event||window.event,
				t = e.target||e.srcElement,
				n = t.nodeName.toLowerCase();
			if(n=='li'){
				let url = `http://www.dongting.com/ajax/v1.ard.tj.itlily.com/ttpod?id=${t.getAttribute("data-id")}`,
					title = getInnerText(t.querySelector('h4'));
				this.loading(title);
				window.callbackPubBoxList = (data)=>{
					let box2 = $('.pubBox .box2');
					box2.innerHTML = data.data.map(v=>{
						return `<li data-id="${v.song_id}"><span class="song">${v.song_name}</span><span class="singer">${v.singer_name}</span><span class="album">${v.album_name}</span></li>`;
					}).join('');
					box2.parentNode.classList.remove('status3');
					box2.parentNode.classList.add('status2');
					this.loadingEnd();
				};
				jsonp(`${url}&callback=callbackPubBoxList`);
			}
		};
		$(".classBox .box1").onclick = (event)=>{
			let e = event||window.event,
				t = e.target||e.srcElement,
				n = t.nodeName.toLowerCase();
			if(n=='li'){
				let url = `http://fm.api.ttpod.com/songlist?tagid=${t.getAttribute("data-id")}&size=300`,
					title = getInnerText(t.querySelector('h4'));
				this.loading(title);
				window.callbackClassBoxList = (data)=>{
						let box2 = $('.classBox .box2');
						box2.innerHTML = data.data.map(v=>{
							if(v.songName){
							 	return `<li data-id="${v.neid}"><span class="song">${v.songName}</span><span class="singer">${v.singerName||''}</span><span class="album">${ v.albumName||''}</span></li>`;
							}
						}).join('');
						box2.parentNode.classList.remove('status3');
						box2.parentNode.classList.add('status2');
						this.loadingEnd();
				};
				jsonp(`${url}&callback=callbackClassBoxList`);
			}
		};
		$(".singerBox .box1").onclick = (event)=>{
			let e = event||window.event,
				t = e.target||e.srcElement,
				n = t.nodeName.toLowerCase();
			if(n=='li'){
				let url = `http://www.dongting.com/ajax/v1.ard.tj.itlily.com/ttpod?id=${t.getAttribute("data-id")}&size=400`,
					title = getInnerText(t.querySelector('h4'));
				this.loading(title);
				window.callbackClassBoxList = (data)=>{
						let box2 = $('.singerBox .box2');
						box2.innerHTML = data.data.map(v=>{
							if(v.songName){
							 	return `<li data-id="${v.singer_id}"><span class="singer">${v.singer_name}</span><img src="${v.pic_url}"></li>`;
							}
						}).join('');
						box2.parentNode.classList.remove('status3');
						box2.parentNode.classList.add('status2');
						this.loadingEnd();
				};
				jsonp(`${url}&callback=callbackClassBoxList`);
			}
		};
	}
	showBox(type){
		$('.panel').forEach(x=>{
			if(x.classList.contains('active')){
				x.classList.remove('active');
			}
		});
		$(`.${type}Box`).classList.add("active");
	}
	ajaxList(type){
		if(!this.listLoading[type]&&type!=='mv'){
			this.listLoading[type] = true;
			window[`callbackGetTypeOf${type}`] = (data)=>{
				this.drawList(data.data,type);
			};
			jsonp(`${this.ajaxUrl[type]}&callback=callbackGetTypeOf${type}`);
		}
	}
	drawList(data,type){
		switch(type){
			case 'pub':$(`.${type}Box .box1`).innerHTML = data.map((v)=>{return `<li data-id="${v.id}"><img src="${v.big_pic_url}"><h4>${v.title}</h4></li>`;}).join('');break;
			case 'class':$(`.${type}Box .box1`).innerHTML = data.map((v)=>{return `<li data-id="${v.id}"><img src="${v.pic_url_240_200}"><h4>${v.title}</h4></li>`;}).join('');break;
			case 'singer':$(`.${type}Box .box1`).innerHTML = data.map((v)=>{return `<li data-id="${v.id}"><img src="${v.pic_url}"><h4>${v.title}</h4></li>`;}).join('');break;
		}
	}
}
const search = new Search();
const list = new List();
