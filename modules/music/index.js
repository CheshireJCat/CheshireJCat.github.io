var Music = {
	player:$("audio")[0],
	lrc:"",
	option:{
		btn:{
			play:$(".play"),
			pause:$(".pause"),
			next:$(".next"),
			prev:$(".prev"),
			muted:$(".volumeOff"),
			unmuted:$(".volumeUp"),
			volume:$(".volume"),
			volumeUp:$(".volumeUp"),
			volumeDown:$(".volumeDown"),
			setVolume:$(".setVolume"),
			volumeValue:$(".volumeValue"),
			setSrc:$(".setSrc"),
			
		},
		playInfo:{
			song:$(".play-songName"),
			time:$(".play-time"),
			load:$(".play-load"),
			pro:$(".play-pro"),
			lrc:$(".lrc"),
			lrcBottom:$(".lrcBottom"),
			lrcMove:$(".lrcMove")
		},
		list:{
			className:"",
			count:0
		}
	},
	audioFunc:{
		play:function(){Music.player.play();},
		pause:function(){Music.player.pause();},
		muted:function(){Music.player.muted=true;Music.option.btn.volume.attr('data-volume',0);},
		unmuted:function(){Music.player.muted=false;Music.option.btn.volume.attr('data-volume',2);},
		volumeUp:function(){Music.player.volume=Music.player.volume+0.01>=1?1:Music.player.volume+0.01;},
		volumeDown:function(){Music.player.volume=Music.player.volume-0.01<=0?0:Music.player.volume-0.01;},
		setVolume:function(num){Music.player.volume = num;},
		setSrc:function(src){Music.player.src=src;},
		setInfo:function(playInfo){Music.option.playInfo.song.html(playInfo);}
	},
	playerFunc:{
		setVolumeRange:function(num){
			Music.option.btn.setVolume.val(num||Music.player.volume.toFixed(1));
		},
		setVolumeValue:function(num){
			Music.option.btn.volumeValue.val(num||Music.player.volume.toFixed(1));
		}
	},
	listFunc:{
		next:function(){},
		prev:function(){},
	},
	timeTrans:function(time){
		var s = parseInt(time);
		var m = parseInt(s/60);
		m=m<10?"0"+m:m;
		s = s&60;
		s=s<10?"0"+s:s;

		return m+":"+s;

	},
	resetPlay:function(){
		Music.option.playInfo.pro.width(0);
		Music.option.playInfo.time.text("00:00 / 00:00");
		Music.lrc = "";
		Music.option.playInfo.lrc.html("");
		Music.option.playInfo.lrcMove.css("top",Music.option.playInfo.lrcMove.parent().height()/2);
		Music.option.playInfo.lrcBottom.html("");
	},
	drawLrc:function(){
		var code = "";
		$.each(Music.lrc, function(i, v) {
			code += "<p>"+v[1]+"</p>";
		});
		Music.option.playInfo.lrcBottom.html(code);
		Music.option.playInfo.lrc.html(code);
		Music.option.playInfo.lrcMove.height(Music.option.playInfo.lrcBottom.height());
	},
	bind:function(){
		Music.player.onended = function(){
			Music.resetPlay();
		};
		Music.player.onerror = function(){
			Music.audioFunc.pause();
		};
		Music.player.onplay = function(){
			Music.option.btn.play.addClass('active');
		};
		Music.player.onpause = function(){
			Music.option.btn.play.removeClass('active');
		};
		Music.player.ontimeupdate = function(e){
			var now = Music.timeTrans(Music.player.currentTime);
			var duration = Music.timeTrans(Music.player.duration);
			var d = (Music.player.currentTime/Music.player.duration)*100+"%";
			Music.option.playInfo.pro.width(d);
			Music.option.playInfo.time.text(now+" / "+duration);
			if(Music.lrc){
				for (var i = 0, l = Music.lrc.length; i < l; i++) {
			        if (Music.player.currentTime > Music.lrc[i][0]) {
			            //显示到页面
			            if(Music.option.playInfo.lrc.find(".active").index()<=i&&!Music.option.playInfo.lrc.children().eq(i).hasClass('active')){
			            	Music.option.playInfo.lrc.children().eq(i).addClass('active').siblings().removeClass('active');
			            	Music.option.playInfo.lrcMove.css("top",parseInt(Music.option.playInfo.lrcMove.css("top"))-60+"px");
			            }
			        };
			    };
			}
		};
		Music.option.btn.play.click(function(event) {
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				Music.audioFunc.pause();
			}else{
				$(this).addClass('active');
				Music.audioFunc.play();
			}
		});
		Music.option.btn.pause.click(function(event) {
			Music.audioFunc.pause();
		});
		Music.option.btn.muted.click(function(event) {
			Music.audioFunc.unmuted();
		});
		Music.option.btn.unmuted.click(function(event) {
			Music.audioFunc.muted();
		});
		Music.option.btn.volumeUp.click(function(event) {
			Music.audioFunc.volumeUp();
			Music.playerFunc.setVolumeRange();
			Music.playerFunc.setVolumeValue();
		});
		Music.option.btn.volumeDown.click(function(event) {
			Music.audioFunc.volumeDown();
			Music.playerFunc.setVolumeRange();
			Music.playerFunc.setVolumeValue();
		});
		Music.option.btn.setVolume.change(function(event) {
			Music.playerFunc.setVolumeValue($(this).val());
			Music.audioFunc.setVolume($(this).val());
		});
		Music.option.btn.setSrc.change(function(event) {
			Music.audioFunc.setSrc($(this).val());
		});

	},
	init:function(option){
		if(option)this.option = $.extend({},this,option);
		this.bind();
	}
};
Music.init();
var localData = {};
var Search = {
	option:{
		list:$("#list"),
		searchText:$("#search"),
		searchBtn:$("#searchSub"),
		showSearch:$(".showSearch"),
		searchBox:$(".searchBox")
	},
	bind:function(){
		Search.option.showSearch.click(function(event) {
			Search.option.searchBox.toggleClass('active');
		});
		Search.option.searchBtn.click(function(event) {
			Search.searchMusic(Search.option.searchText.val());
			Search.option.searchBox.removeClass('active');
		});
		Search.option.list.on("click",".song",function(){
			if(!$(this).parent().hasClass("no")){
				var id = $(this).parent().attr("data-id");
				var data = localData[id];
				Music.resetPlay();
				Music.audioFunc.setSrc(data.url_list[data.url_list.length-1].url);
				Music.audioFunc.setInfo(data.song_name+"-"+data.singer_name);
				Search.getLrc(id,data.song_name,data.singer_name);
			}else{
				return
			}

		}).on("click",".sq",function(){
			var id = $(this).parent().attr("data-id");
			var data = localData[id];
			Music.audioFunc.setSrc(data.ll_list[0].url);
			Music.audioFunc.setInfo(data.song_name+"-"+data.singer_name);
		}).on("click",".mv",function(){
			var id = $(this).parent().attr("data-id");
		}).on("click","i",function(){
			var text = $(this).text();
			Search.searchMusic(text);
			Search.option.searchText.val(text);
		});
		Search.option.list.scroll(function(){
			if($(this).scrollTop()+$(this).height()>=this.scrollHeight){
				if(Search.data.page<Search.data.pages){
					Search.searchMusic(Search.data.keywords,Search.data.page+1,Search.data.size,true);
				}
			}
		});
		$("body").keyup(function(event) {
			if(event.keyCode == 13){/*enter*/
				if(!Search.option.searchBox.hasClass('active')){
					Search.option.searchBox.addClass('active');
					Search.option.searchText.select();
				}else{
					if(!Search.option.searchText.val()||Search.option.searchText.val()==Search.data.keywords){
						Search.option.searchBox.removeClass('active');
						return;
					}else{

						Search.option.searchBtn.click();
					}
				}
			}else if(event.keyCode == 32){/*space*/
				if(!Search.option.searchBox.hasClass('active')){
					Music.option.btn.play.click();
				}
			}
		});

	},
	getLrc:function(id,song,singer){
		$.ajax({
			url: 'http://lp.music.ttpod.com/lrc/down',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				song_id:id,
				title:song,
				artist:singer
			},
			success:function(data, textStatus) {
				if(data.code!==1){
					Music.option.playInfo.lrc.html("<p class='active'>没有找到对应的歌词！</p>");
				}else{
					Search.parseLyric(data.data.lrc);
				}
			}
		}).error(function() {
				Music.option.playInfo.lrc.html("<p class='active'>没有找到对应的歌词！</p>");
		});
		
	},
	parseLyric:function(text){
	    var lines = text.split('\n'),
	        pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
	        result = [];
		    while (!pattern.test(lines[0])) {
		        lines = lines.slice(1);
		    };
	    lines[lines.length - 1].length === 0 && lines.pop();
	    $.each(lines, function(i, v) {
	    	 var time = v.match(pattern),value = v.replace(pattern, '');
	    	 if(!time){
	    	 	Music.option.playInfo.lrc.html("<p class='active'>歌词解析出错!</p>");
	    	 	return false;
	    	 }else{
		         $.each(time, function(i1, v1) {
		         	 var t = v1.slice(1, -1).split(':');
		            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
		         });
	         }
	    });
	    result.sort(function(a, b) {
	        return a[0] - b[0];
	    });
	    Music.lrc = result;
	    Music.drawLrc();
	},
	data:{
		keywords:"",
		size:0,
		pages:0,
		rows:0,
		page:0,
		data:[]
	},
	searchMusic:function(keywords,page,size,addIf){
		List.tips("搜索："+keywords);
		var p = page||1,
			s = size||200,
			add = addIf||false;
		$.ajax({
			url: 'http://search.dongting.com/song/search/old',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				q:keywords,
				page:p,
				size:s,
				time:(new Date()).getTime()
			},
			cache:true,
			success:function(data, textStatus) {
				Search.data.pages = data.pages;
				Search.data.keywords = keywords;
				Search.data.size = s;
				Search.data.rows = data.rows;
				Search.data.page = p;
				Search.data.data = data.data;
				List.tips("loading...");
				Search.drawData(add);
			}
		}).error(function(res) {
				List.tips("搜索"+keywords+" 失败");
				Search.option.searchBox.toggleClass('active');
		});
	},
	jsonp: function(url, jsoncallback) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url + "&callback=" + jsoncallback;
		document.getElementsByTagName("head")[0].appendChild(script);
	},
	drawData:function(add){
		var code = "";
		if(!add){localData = {};}
		$.each(Search.data.data, function(i, v) {
			 localData[v.song_id] = v;
			 var no = !v.out_list?"":" no";
			 var hasSQ = !v.ll_list?"":" hasSQ";
			 var hasMV = !v.mv_list?"":" hasMV";
			 var singer_name = !v.singer_name?"":("<i>"+v.singer_name+"</i>");
			 var album_name = !v.album_name?"":("-<i>"+v.album_name+"</i>");
			 code += "<li data-id="+v.song_id+" class="+no+hasSQ+hasMV+">";
			 code += "<span class='song'>"+v.song_name+"</span>";
			 code += "<span class='info'>"+singer_name+album_name+"</span>";
			 code += "<span class='sq'>SQ</span>";
			 code += "<span class='mv'>MV</span>";
			 code += "</li>";
		});
		if(!add){
			Search.option.list.html(code);
		}else{
			Search.option.list.append(code);
		}
	},
	init:function(option){
		if(option)this.option = $.extend({},this,option);
		this.bind();
	}
}
Search.init();

var List = {
	loadWord:"loading...",
	loadEndsWord:"loadingEnd",
	tips:function(w){
		$("#tips").html(w).addClass("active");
		_.delay(function(){
			$("#tips").removeClass("active");
		}, 1500);
	},
	loading:function(word){
		var w = word?("Loading Start："+word):List.loadWord;
		$("#loading span").html(w);
		$("#loading").addClass("active");
	},
	loadingEnd:function(word){
			var w = word?("Loading End："+word):List.loadEndsWord;
			$("#loading span").html(w);
		_.delay(function(){
			$("#loading").removeClass("active");
		}, 1000);
	},
	option:{
		panelBtn:$(".panelBtn")
	},
	ajaxUrl:{
		pub:'http://www.dongting.com/ajax/v1.ard.tj.itlily.com/ttpod?id=281&page=1&size=100',
		class:'http://fm.api.ttpod.com/taglist?image_type=240_200',
		singer:'http://www.dongting.com/ajax/v1.ard.tj.itlily.com/ttpod?id=46'
	},
	bind:function(){
		List.option.panelBtn.click(function(){
			var type = $(this).attr("data-type");
			List.showBox(type);
			if(type!=='lrc'){
				if($("."+type+"Box ul li").length<=0){
					List.ajaxList(type);
				}else{
					$("."+type+"Box").removeClass('status2');
				}
			}
		});
		$(".to-status1").click(function(){
			$(this).parent().removeClass('status2');
		});
		$(".box2").on('click', '.song', function(event) {
			var keyword = $(this).text()+$(this).next().text();
			Search.searchMusic(keyword);
		});
		$(".box2").on('click', '.singer,.album', function(event) {
			Search.searchMusic($(this).text());
		});
		$(".pubBox .box1").on('click', 'li',function(){
			var url = 'http://www.dongting.com/ajax/v1.ard.tj.itlily.com/ttpod?id='+$(this).attr("data-id");
			var title = $(this).find("h4").text();
			List.loading(title);
			$.ajax({
				url: url,
				type: 'GET',
				dataType: 'jsonp',
				success:function(data){
					var d = data.data;
					var code = '';
					$.each(d, function(i, v) {
						 code += '<li data-id="'+v.song_id+'"><span class="song">'+v.song_name+'</span><span class="singer">'+v.singer_name+'</span><span class="album">'+v.album_name+'</span></li>';
					});
					$(".pubBox .box2").html(code).parent().removeClass('status3').addClass('status2');
					List.loadingEnd();
				}
			});
		});
		$(".classBox .box1").on('click', 'li',function(){
			var url = 'http://fm.api.ttpod.com/songlist?tagid='+$(this).attr("data-id")+'&size=300';
			var title = $(this).find("h4").text();
			List.loading(title);
			$.ajax({
				url: url,
				type: 'GET',
				dataType: 'jsonp',
				success:function(data){
					var d = data.data;
					var code = '';
					$.each(d, function(i, v) {
						if(v.songName){
							var singerName = v.singerName||'';
							var albumName = v.albumName||'';
						 code += '<li data-id="'+v.neid+'"><span class="song">'+v.songName+'</span><span class="singer">'+singerName+'</span><span class="album">'+albumName+'</span></li>';
						}
					});
					$(".classBox .box2").html(code).parent().removeClass('status3').addClass('status2');
					List.loadingEnd();
				}
			});
		});
		$(".singerBox .box1").on('click', 'li',function(){
			var url = 'http://www.dongting.com/ajax/v1.ard.tj.itlily.com/ttpod?id='+$(this).attr("data-id")+'&size=400';
			var title = $(this).find("h4").text();
			List.loading(title);
			$.ajax({
				url: url,
				type: 'GET',
				dataType: 'jsonp',
				success:function(data){
					var d = data.data;
					var code = '';
					$.each(d, function(i, v) {
						 code += '<li data-id="'+v.singer_id+'"><span class="singer">'+v.singer_name+'</span><img src="'+v.pic_url+'"></li>';
					});
					$(".singerBox .box2").html(code).parent().removeClass('status3').addClass('status2');
					List.loadingEnd();
				}
			});
		});
	},
	showBox:function(type){
		$("."+type+"Box").addClass("active").siblings().removeClass('active');
	},
	listLoading:{
		singer:false,
		pub:false,
		class:false
	},
	ajaxList:function(type){
		if(!List.listLoading[type]){
			List.listLoading[type] = true;
			var a = function(){
				$.ajax({
					url: List.ajaxUrl[type],
					type: 'GET',
					dataType: 'jsonp',
					cache:true,
					success:function(res, textStatus) {
						var data = res.data;
						List.drawList(data,type);
					}
				}).error(function(res) {
						_.delay(a, 50);
				});
			};
			 a();
		 }
	},
	drawList:function(data,type){
		switch(type){
			case 'pub':(function(){
				var code = '';
				$.each(data, function(i, v) {
					 code += '<li data-id="'+v.id+'"><img src="'+v.big_pic_url+'"><h4>'+v.title+'</h4></li>';
				});
				$("."+type+"Box .box1").html(code);
			})();break;
			case 'class':(function(){
				var code = '';
				$.each(data, function(i, v) {
					 code += '<li data-id="'+v.id+'"><img src="'+v.pic_url_240_200+'"><h4>'+v.title+'</h4></li>';
				});
				$("."+type+"Box .box1").html(code);
			})();break;
			case 'singer':(function(){
				var code = '';
				$.each(data, function(i, v) {
					 code += '<li data-id="'+v.id+'"><img src="'+v.pic_url+'"><h4>'+v.title+'</h4></li>';
				});
				$("."+type+"Box .box1").html(code);
			})();break;
		}
	},
	init:function(option){
		if(option)this.option = $.extend({},this,option);
		this.bind();
	}
};
List.init();
jQuery(document).ready(function($) {
	//Search.getLrc(1942694,"御龙吟","姚贝娜");
	//Search.searchMusic("御龙吟");
});
