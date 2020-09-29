//=============================================================================
// Luna_MapNamePlus.js
//=============================================================================
//=============================================================================
// Build Date: 2020-09-28 21:19:11
//=============================================================================
//=============================================================================
// Made with LunaTea -- Haxe
//=============================================================================

// Generated by Haxe 4.1.3
/*:
@author LunaTechs - Kino
@plugindesc This plugin augments the functionality of the map name window and adds additional effects <LunaMapNamePlus>.

@target MV MZ

@command showWindow
@text Show Window
@desc Shows the map name window.


@command hideWindow
@text Hide Window
@desc Hides the map name window.

@param x
@text Window X Position
@desc The x position of the window.
@type number
@default 0

@param y
@text Window Y Position
@desc The y position of the window.
@type number
@default 0

@param alignment
@text Alignment
@desc Alignment of the text within the window. Choices are 'left' or 'center'.
@default center

@param animation
@text Animation
@desc Whether the map name window stays visible, fades out, etc. Choices are 'persistent' or 'fade'
@default persistent

@param marquee
@text Marquee
@desc Whether the text should scroll across the window. True or False (T/F)
@default T

@param marqueeSpeed
@text Marquee Speed
@desc Speed of the Marquee
@default 1

@param persistent
@text Persistent
@desc Whether the window map name is persistent after battle or not
@default T

@help
This plugin augments the functionality of the map name window and adds additional effects <LunaMapNamePlus>.

==== Script Calls ====

Script calls
LunaMapNamePlus.hideWindow()
LunaMapNamePlus.showWindow()

MIT License
Copyright (c) 2020 LunaTechsDev
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE
*/





(function ($hx_exports, $global) { "use strict"
class EReg {
	constructor(r,opt) {
		this.r = new RegExp(r,opt.split("u").join(""))
	}
	match(s) {
		if(this.r.global) {
			this.r.lastIndex = 0
		}
		this.r.m = this.r.exec(s)
		this.r.s = s
		return this.r.m != null;
	}
}
class LunaMapNamePlus {
	static main() {
		let _g = []
		let _g1 = 0
		let _g2 = $plugins
		while(_g1 < _g2.length) {
			let v = _g2[_g1]
			++_g1
			if(new EReg("<LunaMapNamePlus>","ig").match(v.description)) {
				_g.push(v)
			}
		}
		let plugin = _g[0]
		let params = plugin.parameters
		let tmp = parseInt(params["x"],10)
		let tmp1 = parseInt(params["y"],10)
		let tmp2 = params["marquee"].toUpperCase() == "T"
		let tmp3 = parseInt(params["marqueeSpeed"],10)
		let tmp4 = params["persistent"].toUpperCase() == "T"
		LunaMapNamePlus.LMParams = { x : tmp, y : tmp1, alignment : params["alignment"], animation : params["animation"], marquee : tmp2, marqueeSpeed : tmp3, persistent : tmp4}
		console.log("src/Main.hx:56:",LunaMapNamePlus.LMParams)
		
//=============================================================================
// Scene_Map
//=============================================================================
      
		let _SceneMapUpdate = Scene_Map.prototype.update
		Scene_Map.prototype.update = function() {
			let self = this
			_SceneMapUpdate.call(self)
			if(LunaMapNamePlus.LMParams.persistent && LunaMapNamePlus.showWindowMode) {
				if(self._mapNameWindow.contentsOpacity == 0) {
					self._mapNameWindow.show()
					self._mapNameWindow.open()
				}
			}
		}
		
//=============================================================================
// Window_MapName
//=============================================================================
      
		let _WindowmapName_intitialize = Window_MapName.prototype.initialize
		let WinMapName = "Window_MapName"
		Window_MapName.prototype.initialize = function(rect) {
			let self = this
			_WindowmapName_intitialize.call(self,rect)
			self._marqueeSlide = LunaMapNamePlus.LMParams.marqueeSpeed
			self._marqueePos = self.contentsWidth() - self.textWidth($gameMap.displayName()[0])
			self._marqueeComplete = false
			LunaMapNamePlus.mapNameWindow = self
			self.move(LunaMapNamePlus.LMParams.x,LunaMapNamePlus.LMParams.y,self.width,self.height)
		}
		Window_MapName.prototype.update = function() {
			Window_Base.prototype.update.call(this)
			let win = this
			if(win._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
				win.updateFadeIn()
				win._showCount--
			} else {
				if(LunaMapNamePlus.LMParams.marquee && $gameMap.displayName()) {
					win.updateMarquee()
				}
				win.updateFadeOut()
			}
		}
		Window_MapName.prototype.refresh = function() {
			let self = this
			self.contents.clear()
			if($gameMap.displayName() != null) {
				let width = self.contentsWidth()
				self.drawBackground(0,0,width,self.lineHeight())
				let center = width / 2 - self.textWidth($gameMap.displayName()) / 2
				let xPos = LunaMapNamePlus.LMParams.alignment.toLowerCase().indexOf("center") != -1 ? center : 0
				if(LunaMapNamePlus.LMParams.marquee) {
					self.drawTextEx($gameMap.displayName(),xPos,0,width)
				}
			}
		}
		Window_MapName.prototype.updateFadeOut = function() {
			let self = this
			if(LunaMapNamePlus.LMParams.animation.toLowerCase().indexOf("persistent") != -1) {
				if(LunaMapNamePlus.LMParams.marquee && self._marqueeComplete) {
					($_=Window_MapName.prototype,$bind($_,$_.updateFadeOut)).call(self)
				}
			}
		}
		Window_MapName.prototype["updateMarquee"]  = function() {
			let self = this
			self.contents.clear()
			let stopPoint = self.textWidth($gameMap.displayName()) * -1
			if(self._marqueePos > stopPoint) {
				self._marqueePos -= self._marqueeSlide
			} else {
				self._marqueePos = self.contentsWidth() - self.textWidth($gameMap.displayName()[0])
				self._marqueeComplete = true
			}
			self.drawTextEx($gameMap.displayName(),self._marqueePos,0,self.contentsWidth())
			self.drawBackground(0,0,self.contentsWidth(),self.lineHeight())
			return;
		}
		PluginManager.registerCommand(plugin.name,"showWindow",function(_) {
			LunaMapNamePlus.showWindow()
		})
		PluginManager.registerCommand(plugin.name,"hideWindow",function(_) {
			LunaMapNamePlus.hideWindow()
		})
	}
	static params() {
		return LunaMapNamePlus.LMParams;
	}
	static initializeWindow(win) {
		win._marqueeSlide = LunaMapNamePlus.LMParams.marqueeSpeed
		win._marqueePos = self.contentsWidth() - self.textWidth($gameMap.displayName()[0])
		win._marqueeComplete = false
		LunaMapNamePlus.mapNameWindow = win
		win.move(LunaMapNamePlus.LMParams.x,LunaMapNamePlus.LMParams.y,win.width,win.height)
	}
	static updateWindow(win) {
		if(win._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
			win.updateFadeIn()
			win._showCount--
		} else {
			if(LunaMapNamePlus.LMParams.marquee && $gameMap.displayName()) {
				win.updateMarquee()
			}
			win.updateFadeOut()
		}
	}
	static updateWindowFadeOut(win) {
		if(LunaMapNamePlus.LMParams.animation.toLowerCase().indexOf("persistent") != -1) {
			if(LunaMapNamePlus.LMParams.marquee && win._marqueeComplete) {
				($_=Window_MapName.prototype,$bind($_,$_.updateFadeOut)).call(win)
			}
		}
	}
	static refreshWindow(win) {
		win.contents.clear()
		if($gameMap.displayName() != null) {
			let width = win.contentsWidth()
			win.drawBackground(0,0,width,win.lineHeight())
			let center = width / 2 - win.textWidth($gameMap.displayName()) / 2
			let xPos = LunaMapNamePlus.LMParams.alignment.toLowerCase().indexOf("center") != -1 ? center : 0
			if(LunaMapNamePlus.LMParams.marquee) {
				win.drawTextEx($gameMap.displayName(),xPos,0,width)
			}
		}
	}
	static hideWindow() {
		LunaMapNamePlus.showWindowMode = false
		LunaMapNamePlus.mapNameWindow.hide()
	}
	static showWindow() {
		LunaMapNamePlus.showWindowMode = true
		LunaMapNamePlus.mapNameWindow.show()
	}
}
$hx_exports["LunaMapNamePlus"] = LunaMapNamePlus
class haxe_iterators_ArrayIterator {
	constructor(array) {
		this.current = 0
		this.array = array
	}
	hasNext() {
		return this.current < this.array.length;
	}
	next() {
		return this.array[this.current++];
	}
}
class _$LTGlobals_$ {
}
class utils_Fn {
	static proto(obj) {
		return obj.prototype;
	}
	static updateProto(obj,fn) {
		return (fn)(obj.prototype);
	}
	static updateEntity(obj,fn) {
		return (fn)(obj);
	}
}
var $_
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0
LunaMapNamePlus.listener = new PIXI.utils.EventEmitter()
LunaMapNamePlus.showWindowMode = true
LunaMapNamePlus.main()
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this)

//# sourceMappingURL=Luna_MapNamePlus.js.map