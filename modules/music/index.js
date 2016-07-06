'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var $ = function $(x) {
	var selectors = [].concat(_toConsumableArray(document.querySelectorAll(x)));
	if (selectors.length > 1) {
		return selectors;
	} else if (selectors.length == 1) {
		return selectors[0];
	} else {
		return [];
	}
};
var getInnerText = function getInnerText(element) {
	return typeof element.textContent == 'string' ? element.textContent : element.innerText;
};
var setInnerText = function setInnerText(element, text) {
	if (typeof element.textContent == 'string') {
		element.textContent = text;
	} else {
		element.innerText = text;
	}
};
function entries(obj) {
	var arr = [];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(obj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var key = _step.value;

			arr.push([key, obj[key]]);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return arr;
}
var getIndex = function getIndex(current, obj) {
	for (var i = 0, length = obj.length; i < length; i++) {
		if (obj[i] == current) {
			return i;
		}
	}
	return 0;
};

var jsonp = function jsonp(url, option) {
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	var c = option ? '?' + entries(option).map(function (x) {
		return x.join('=');
	}).join('&') : '';
	s.src = '' + url + c;
	document.body.appendChild(s);
	setTimeout(function () {
		s.parentNode.removeChild(s);
	}, 2000);
};

var Audio = function () {
	function Audio() {
		_classCallCheck(this, Audio);

		this.audio = document.createElement('audio');
		this.audio.src = '1.mp3';
		this.audio.autoplay = true;
		this.audio.loop = true;
		document.body.appendChild(this.audio);
	}

	_createClass(Audio, [{
		key: 'play',
		value: function play() {
			this.play();
		}
	}, {
		key: 'pause',
		value: function pause() {
			this.pause();
		}
	}, {
		key: 'muted',
		value: function muted() {
			this.audio.muted = true;
		}
	}, {
		key: 'unmuted',
		value: function unmuted() {
			this.audio.muted = false;
		}
	}, {
		key: 'volumeUp',
		value: function volumeUp() {
			this.audio.volume = this.audio.volume + 0.01 >= 1 ? 1 : this.audio.volume + 0.01;
		}
	}, {
		key: 'volumeDown',
		value: function volumeDown() {
			this.audio.volume = this.audio.volume - 0.01 <= 0 ? 0 : this.audio.volume - 0.01;
		}
	}, {
		key: 'setVolume',
		value: function setVolume(num) {
			this.audio.volume = num;
		}
	}, {
		key: 'setSrc',
		value: function setSrc(src) {
			this.audio.src = src;
		}
	}]);

	return Audio;
}();

var Player = function (_Audio) {
	_inherits(Player, _Audio);

	function Player(args) {
		_classCallCheck(this, Player);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Player).call(this));

		_this.btn = {
			play: $('#play'),
			next: $('#next'),
			prev: $('#prev'),
			volume: $('#volume'),
			setVolume: $('#setVolume'),
			volumeValue: $('#volumeValue'),
			setSrc: $('#setSrc')
		};
		_this.playInfo = {
			song: $('#play-songName'),
			time: $('#play-time'),
			load: $('#play-load'),
			pro: $('#play-pro'),
			lrc: $('#lrc'),
			lrcBottom: $('#lrcBottom'),
			lrcMove: $('#lrcMove')
		};
		_this.video = $('#video');
		_this.list = {
			className: '',
			count: 0
		};
		_this.init();
		return _this;
	}

	_createClass(Player, [{
		key: 'init',
		value: function init() {
			this.audioSet();
			this.btnBind();
			this.lrc = '';
		}
	}, {
		key: 'setInfo',
		value: function setInfo(playInfo) {
			this.playInfo.song.innerHTML = playInfo;
		}
	}, {
		key: 'setVolumeValue',
		value: function setVolumeValue(num) {
			this.btn.setVolume.value = num || this.audio.volume.toFixed(1);
			this.btn.volumeValue.value = num || this.audio.volume.toFixed(1);
		}
	}, {
		key: 'timeTrans',
		value: function timeTrans(time) {
			var s = parseInt(time);
			var m = parseInt(s / 60);
			m = m < 10 ? '0' + m : m;
			s = s & 60;
			s = s < 10 ? '0' + s : s;
			return m + ':' + s;
		}
	}, {
		key: 'resetPlay',
		value: function resetPlay() {
			this.playInfo.pro.style.width = 0;
			this.playInfo.time.innerHTML = '00:00 / 00:00';
			this.lrc = '';
			this.audio.pause();
			this.video.pause();
			this.playInfo.lrc.innerHTML = '';
			this.playInfo.lrcMove.style.marginTop = 0;
			this.playInfo.lrcBottom.innerHTML = '';
		}
	}, {
		key: 'drawLrc',
		value: function drawLrc() {
			var code = '<p>' + this.lrc.map(function (x) {
				return x[1];
			}).join('</p><p>') + '</p>';
			this.playInfo.lrcBottom.innerHTML = code;
			this.playInfo.lrc.innerHTML = code;
			this.playInfo.lrcMove.style.height = this.playInfo.lrcBottom.style.height;
		}
	}, {
		key: 'audioSet',
		value: function audioSet() {
			var _this2 = this;

			this.audio.onended = this.resetPlay;
			this.audio.onplay = function () {
				return _this2.btn.play.classList.add('active');
			};
			this.audio.onpause = function () {
				return _this2.btn.play.classList.remove('active');
			};
			this.audio.ontimeupdate = function (e) {
				var now = _this2.timeTrans(_this2.audio.currentTime);
				var duration = _this2.timeTrans(_this2.audio.duration);
				var d = _this2.audio.currentTime / _this2.audio.duration * 100 + '%';
				_this2.playInfo.pro.style.width = d;
				_this2.playInfo.time.innerHTML = now + ' / ' + duration;
				if (_this2.lrc) {
					for (var i = 0, l = _this2.lrc.length; i < l; i++) {
						if (_this2.audio.currentTime > _this2.lrc[i][0]) {
							var active = _this2.playInfo.lrc.querySelector('.active'),
							    lrc = _this2.playInfo.lrc,
							    _now = lrc.childNodes[i];
							if (getIndex(active, lrc.childNodes) <= i && !_now.classList.contains('active')) {
								if (lrc.querySelector('.active')) {
									lrc.querySelector('.active').classList.remove('active');
								}
								_now.classList.add('active');
								_this2.playInfo.lrcMove.style.marginTop = -60 * i + 'px';
							}
						}
					}
				}
			};
		}
	}, {
		key: 'btnBind',
		value: function btnBind() {
			var _this3 = this;

			this.btn.play.onclick = function () {
				return _this3.btn.play.classList.contains('active') ? _this3.audio.pause() : _this3.audio.play();
			};
			this.btn.volume.onclick = function () {
				if (_this3.audio.muted) {
					_this3.unmuted();
					_this3.btn.volume.setAttribute('data-volume', 2);
				} else {
					_this3.muted();
					_this3.btn.volume.setAttribute('data-volume', 0);
				}
			};
			this.btn.setVolume.onchange = function () {
				var v = _this3.btn.setVolume.value;
				_this3.setVolumeValue(v);
				_this3.setVolume(v);
			};
			this.btn.setSrc.onchange = function () {
				_this3.setSrc(_this3.btn.setVolume.value);
			};
		}
	}]);

	return Player;
}(Audio);

var player = new Player();
var loadData = {};

var Search = function () {
	function Search() {
		_classCallCheck(this, Search);

		this.list = $('#list');
		this.searchText = $('#search');
		this.searchBtn = $('#searchSub');
		this.showSearch = $('#showSearch');
		this.searchBox = $('#searchBox');
		this.video = $('#video');
		this.bind();
		this.data = {
			keywords: "",
			size: 0,
			pages: 0,
			rows: 0,
			page: 0,
			data: []
		};
	}

	_createClass(Search, [{
		key: 'bind',
		value: function bind() {
			var _this4 = this;

			this.showSearch.onclick = function () {
				return _this4.searchBox.classList.toggle('active');
			};
			this.searchBtn.onclick = function () {
				_this4.searchBox.classList.remove('active');
				_this4.searchMusic(_this4.searchText.value);
			};
			this.list.onclick = function (event) {
				var e = event || window.event;
				var target = e.target || e.srcElement;
				var nodeName = target.nodeName.toLowerCase();
				var className = target.classList;
				var tParent = target.parentNode;
				var id = tParent.getAttribute('data-id');
				if (nodeName == 'i') {
					var t = getInnerText(target);
					_this4.searchMusic(t);
					_this4.searchText.value = t;
				} else {
					if (!tParent.classList.contains('no')) {
						var data = loadData[id];
						player.resetPlay();
						player.setInfo(data.song_name + '-' + data.singer_name);
						if (!className.contains('mv')) {
							player.setSrc(!className.contains('sq') ? data.url_list[data.url_list.length - 1].url : data.ll_list[0].url);
							_this4.searchLrc(id, data.song_name, data.singer_name);
							_this4.video.src = '';
							player.audio.play();
						} else {
							list.showBox('mv');
							player.audio.pause();
							_this4.video.src = data.mv_list[data.mv_list.length - 1].url;
							_this4.video.play();
						}
					}
				}
			};
			this.list.onscroll = function () {
				if (_this4.list.scrollTop + _this4.list.offsetHeight >= _this4.list.scrollHeight && _this4.data.page < _this4.data.pages) {
					_this4.searchMusic(_this4.data.keywords, _this4.data.page + 1, _this4.data.size, true);
				}
			};
			document.body.onkeyup = function (event) {
				var e = event || window.event;
				var keyCode = e.keyCode || e.keyWhich;
				if (keyCode == 13) {
					/*enter*/
					if (!_this4.searchBox.classList.contains('active')) {
						_this4.searchBox.classList.add('active');
						_this4.searchText.select();
					} else {
						if (!_this4.searchText.value || _this4.searchText.value == _this4.data.keywords) {
							_this4.searchBox.classList.remove('active');
							return;
						} else {
							_this4.searchBox.classList.remove('active');
							_this4.searchMusic(_this4.searchText.value);
						}
					}
				} else if (keyCode == 32) {
					/*space*/
					if (!_this4.searchBox.classList.contains('active')) {
						_this4.searchBox.classList.remove('active');
						_this4.searchMusic(_this4.searchText.value);
					}
				}
			};
		}
	}, {
		key: 'searchMusic',
		value: function searchMusic(keywords, page, size, addIf) {
			var _this5 = this;

			list.tips("搜索：" + keywords);
			var p = page || 1,
			    s = size || 200,
			    add = addIf || false;
			window.callbackSearchMusic = function (data) {
				_this5.data.pages = data.pages;
				_this5.data.keywords = keywords;
				_this5.data.size = s;
				_this5.data.rows = data.rows;
				_this5.data.page = p;
				_this5.data.data = data.data;
				list.tips("loading...");
				_this5.drawData(add);
			};
			jsonp('http://search.dongting.com/song/search/old', {
				q: keywords,
				page: p,
				size: s,
				time: new Date().getTime(),
				callback: 'callbackSearchMusic'
			});
		}
	}, {
		key: 'drawData',
		value: function drawData(add) {
			if (!add) {
				loadData = {};
			}
			var code = this.data.data.map(function (x) {
				loadData[x.song_id] = x;
				var no = !x.out_list ? '' : ' no',
				    hasSQ = !x.ll_list ? '' : ' hasSQ',
				    hasMV = !x.mv_list ? '' : ' hasMV',
				    singer_name = !x.singer_name ? '' : '<i>' + x.singer_name + '</i>',
				    album_name = !x.album_name ? '' : '<i>' + x.album_name + '</i>';
				var c = ('<li data-id=\'' + x.song_id + '\' class=\'' + no + hasSQ + hasMV + '\'>\n\t\t\t<span class=\'song\'>' + x.song_name + '</span>\n\t\t\t<span class=\'info\'>' + (singer_name + album_name) + '</span>\n\t\t\t<span class=\'sq\'>SQ</span>\n\t\t\t<span class=\'mv\'>MV</span>\n\t\t\t</li>').trim();
				return c;
			});
			if (!add) {
				this.list.innerHTML = code;
			} else {
				this.list.innerHTML += code;
			}
		}
	}, {
		key: 'searchLrc',
		value: function searchLrc(id, song, singer) {
			var _this6 = this;

			window.callbackSearchLrc = function (data) {
				if (data.code !== 1) {
					player.playInfo.lrc.innerHTML = "<p class='active'>没有找到对应的歌词！</p>";
				} else {
					_this6.parseLyric(data.data.lrc);
				}
			};
			jsonp('http://lp.music.ttpod.com/lrc/down', {
				song_id: id,
				title: song,
				artist: singer,
				callback: 'callbackSearchLrc'
			});
		}
	}, {
		key: 'parseLyric',
		value: function parseLyric(text) {
			var lines = text.split('\n'),
			    pattern = /\[\d{2}:\d{2}.\d{2,3}\]/g,
			    result = [];
			lines.filter(function (x) {
				return pattern.test(x);
			});
			if (lines[lines.length - 1].length === 0) {
				lines.pop();
			}
			lines.forEach(function (x) {
				var time = x.match(pattern),
				    value = x.replace(pattern, '');
				if (!time) {
					player.playInfo.lrc.innerHTML = "<p class='active'>歌词解析出错!</p>";
					return false;
				} else {
					time.forEach(function (y) {
						var t = y.slice(1, -1).split(':');
						result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
					});
				}
			});
			player.lrc = result.sort(function (a, b) {
				return a[0] - b[0];
			});
			player.drawLrc();
		}
	}]);

	return Search;
}();

var List = function () {
	function List() {
		_classCallCheck(this, List);

		this.loadWord = 'loading...';
		this.loadEndsWord = 'loadingEnd';
		this.panelBtn = $('.panelBtn');
		this.tip = $("#tips");
		this.ajaxUrl = {
			pub: 'http://www.dongting.com/ajax/v1.ard.tj.itlily.com/ttpod?id=281&page=1&size=100',
			class: 'http://fm.api.ttpod.com/taglist?image_type=240_200',
			singer: 'http://www.dongting.com/ajax/v1.ard.tj.itlily.com/ttpod?id=46'
		};
		this.listLoading = {
			singer: false,
			pub: false,
			class: false
		};
		this.bind();
	}

	_createClass(List, [{
		key: 'tips',
		value: function tips(w) {
			var _this7 = this;

			this.tip.innerHTML = w;
			this.tip.classList.add("active");
			setTimeout(function () {
				return _this7.tip.classList.remove('active');
			}, 500);
		}
	}, {
		key: 'loading',
		value: function loading(word) {
			var w = word ? 'Loading Start：' + word : List.loadWord;
			$("#loading span").innerHTML = w;
			$("#loading").classList.add("active");
			setTimeout(function () {
				return $("#loading").classList.remove('active');
			}, 500);
		}
	}, {
		key: 'loadingEnd',
		value: function loadingEnd(word) {
			var w = word ? 'Loading Start：' + word : this.loadWord;
			$("#loading span").innerHTML = w;
			setTimeout(function () {
				return $("#loading").classList.remove('active');
			}, 1500);
		}
	}, {
		key: 'bind',
		value: function bind() {
			var _this8 = this;

			this.panelBtn.forEach(function (x) {
				x.onclick = function () {
					var type = x.getAttribute("data-type");
					_this8.showBox(type);
					if (type !== 'lrc') {
						if ($('.' + type + 'Box ul li').length <= 0) {
							_this8.ajaxList(type);
						} else {
							$('.' + type + 'Box').classList.remove('status2');
						}
					}
				};
			});
			$(".to-status1").forEach(function (x) {
				x.onclick = function () {
					x.parentNode.classList.remove('status2');
				};
			});
			$(".box2").forEach(function (x) {
				x.onclick = function (event) {
					var e = event || window.event,
					    t = e.target || e.srcElement,
					    c = t.classList;
					if (c.contains('song') || c.contains('singer') || c.contains('album')) {
						search.searchMusic(getInnerText(t));
					} else {
						return false;
					}
				};
			});
			$(".pubBox .box1").onclick = function (event) {
				var e = event || window.event,
				    t = e.target || e.srcElement,
				    n = t.nodeName.toLowerCase();
				if (n == 'li') {
					var url = 'http://www.dongting.com/ajax/v1.ard.tj.itlily.com/ttpod?id=' + t.getAttribute("data-id"),
					    title = getInnerText(t.querySelector('h4'));
					_this8.loading(title);
					window.callbackPubBoxList = function (data) {
						var box2 = $('.pubBox .box2');
						box2.innerHTML = data.data.map(function (v) {
							return '<li data-id="' + v.song_id + '"><span class="song">' + v.song_name + '</span><span class="singer">' + v.singer_name + '</span><span class="album">' + v.album_name + '</span></li>';
						}).join('');
						box2.parentNode.classList.remove('status3');
						box2.parentNode.classList.add('status2');
						_this8.loadingEnd();
					};
					jsonp(url + '&callback=callbackPubBoxList');
				}
			};
			$(".classBox .box1").onclick = function (event) {
				var e = event || window.event,
				    t = e.target || e.srcElement,
				    n = t.nodeName.toLowerCase();
				if (n == 'li') {
					var url = 'http://fm.api.ttpod.com/songlist?tagid=' + t.getAttribute("data-id") + '&size=300',
					    title = getInnerText(t.querySelector('h4'));
					_this8.loading(title);
					window.callbackClassBoxList = function (data) {
						var box2 = $('.classBox .box2');
						box2.innerHTML = data.data.map(function (v) {
							if (v.songName) {
								return '<li data-id="' + v.neid + '"><span class="song">' + v.songName + '</span><span class="singer">' + (v.singerName || '') + '</span><span class="album">' + (v.albumName || '') + '</span></li>';
							}
						}).join('');
						box2.parentNode.classList.remove('status3');
						box2.parentNode.classList.add('status2');
						_this8.loadingEnd();
					};
					jsonp(url + '&callback=callbackClassBoxList');
				}
			};
			$(".singerBox .box1").onclick = function (event) {
				var e = event || window.event,
				    t = e.target || e.srcElement,
				    n = t.nodeName.toLowerCase();
				if (n == 'li') {
					var url = 'http://www.dongting.com/ajax/v1.ard.tj.itlily.com/ttpod?id=' + t.getAttribute("data-id") + '&size=400',
					    title = getInnerText(t.querySelector('h4'));
					_this8.loading(title);
					window.callbackClassBoxList = function (data) {
						var box2 = $('.singerBox .box2');
						box2.innerHTML = data.data.map(function (v) {
							if (v.songName) {
								return '<li data-id="' + v.singer_id + '"><span class="singer">' + v.singer_name + '</span><img src="' + v.pic_url + '"></li>';
							}
						}).join('');
						box2.parentNode.classList.remove('status3');
						box2.parentNode.classList.add('status2');
						_this8.loadingEnd();
					};
					jsonp(url + '&callback=callbackClassBoxList');
				}
			};
		}
	}, {
		key: 'showBox',
		value: function showBox(type) {
			$('.panel').forEach(function (x) {
				if (x.classList.contains('active')) {
					x.classList.remove('active');
				}
			});
			$('.' + type + 'Box').classList.add("active");
		}
	}, {
		key: 'ajaxList',
		value: function ajaxList(type) {
			var _this9 = this;

			if (!this.listLoading[type] && type !== 'mv') {
				this.listLoading[type] = true;
				window['callbackGetTypeOf' + type] = function (data) {
					_this9.drawList(data.data, type);
				};
				jsonp(this.ajaxUrl[type] + '&callback=callbackGetTypeOf' + type);
			}
		}
	}, {
		key: 'drawList',
		value: function drawList(data, type) {
			switch (type) {
				case 'pub':
					$('.' + type + 'Box .box1').innerHTML = data.map(function (v) {
						return '<li data-id="' + v.id + '"><img src="' + v.big_pic_url + '"><h4>' + v.title + '</h4></li>';
					}).join('');break;
				case 'class':
					$('.' + type + 'Box .box1').innerHTML = data.map(function (v) {
						return '<li data-id="' + v.id + '"><img src="' + v.pic_url_240_200 + '"><h4>' + v.title + '</h4></li>';
					}).join('');break;
				case 'singer':
					$('.' + type + 'Box .box1').innerHTML = data.map(function (v) {
						return '<li data-id="' + v.id + '"><img src="' + v.pic_url + '"><h4>' + v.title + '</h4></li>';
					}).join('');break;
			}
		}
	}]);

	return List;
}();

var search = new Search();
var list = new List();