/* global rebornScreenReaderText */
(function( $ ) {

	// Variables and DOM Caching.
	var $body = $( 'body' ),
		$customHeader = $body.find( '.custom-header' ),
		$branding = $customHeader.find( '.site-branding' ),
		$navigation = $body.find( '.navigation-top' ),
		$navWrap = $navigation.find( '.wrap' ),
		$navMenuItem = $navigation.find( '.menu-item' ),
		$menuToggle = $navigation.find( '.menu-toggle' ),
		$menuScrollDown = $body.find( '.menu-scroll-down' ),
		$sidebar = $body.find( '#secondary' ),
		$entryContent = $body.find( '.entry-content' ),
		$formatQuote = $body.find( '.format-quote blockquote' ),
		isFrontPage = $body.hasClass( 'reborn-front-page' ) || $body.hasClass( 'home blog' ),
		navigationFixedClass = 'site-navigation-fixed',
		navigationHeight,
		navigationOuterHeight,
		navPadding,
		navMenuItemHeight,
		idealNavHeight,
		navIsNotTooTall,
		headerOffset,
		menuTop = 0,
		resizeTimer;

	// Ensure the sticky navigation doesn't cover current focused links.
	$( 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]', '.site-content-contain' ).filter( ':visible' ).focus( function() {
		if ( $navigation.hasClass( 'site-navigation-fixed' ) ) {
			var windowScrollTop = $( window ).scrollTop(),
				fixedNavHeight = $navigation.height(),
				itemScrollTop = $( this ).offset().top,
				offsetDiff = itemScrollTop - windowScrollTop;

			// Account for Admin bar.
			if ( $( '#wpadminbar' ).length ) {
				offsetDiff -= $( '#wpadminbar' ).height();
			}

			if ( offsetDiff < fixedNavHeight ) {
				$( window ).scrollTo( itemScrollTop - ( fixedNavHeight + 50 ), 0 );
			}
		}
	});

	// Set properties of navigation.
	function setNavProps() {
		navigationHeight      = $navigation.height();
		navigationOuterHeight = $navigation.outerHeight();
		navPadding            = parseFloat( $navWrap.css( 'padding-top' ) ) * 2;
		navMenuItemHeight     = $navMenuItem.outerHeight() * 2;
		idealNavHeight        = navPadding + navMenuItemHeight;
		navIsNotTooTall       = navigationHeight <= idealNavHeight;
	}

	// Make navigation 'stick'.
	function adjustScrollClass() {

		// Make sure we're not on a mobile screen.
		if ( 'none' === $menuToggle.css( 'display' ) ) {

			// Make sure the nav isn't taller than two rows.
			if ( navIsNotTooTall ) {

				// When there's a custom header image or video, the header offset includes the height of the navigation.
				if ( isFrontPage && ( $body.hasClass( 'has-header-image' ) || $body.hasClass( 'has-header-video' ) ) ) {
					headerOffset = $customHeader.innerHeight() - navigationOuterHeight;
				} else {
					headerOffset = $customHeader.innerHeight();
				}

				// If the scroll is more than the custom header, set the fixed class.
				if ( $( window ).scrollTop() >= headerOffset ) {
					$navigation.addClass( navigationFixedClass );
				} else {
					$navigation.removeClass( navigationFixedClass );
				}

			} else {

				// Remove 'fixed' class if nav is taller than two rows.
				$navigation.removeClass( navigationFixedClass );
			}
		}
	}

	// Set margins of branding in header.
	function adjustHeaderHeight() {
		if ( 'none' === $menuToggle.css( 'display' ) ) {

			// The margin should be applied to different elements on front-page or home vs interior pages.
			if ( isFrontPage ) {
				$branding.css( 'margin-bottom', navigationOuterHeight );
			} else {
				$customHeader.css( 'margin-bottom', navigationOuterHeight );
			}

		} else {
			$customHeader.css( 'margin-bottom', '0' );
			$branding.css( 'margin-bottom', '0' );
		}
	}

	// Set icon for quotes.
	function setQuotesIcon() {
		$( rebornScreenReaderText.quote ).prependTo( $formatQuote );
	}

	// Add 'below-entry-meta' class to elements.
	function belowEntryMetaClass( param ) {
		var sidebarPos, sidebarPosBottom;

		if ( ! $body.hasClass( 'has-sidebar' ) || (
			$body.hasClass( 'search' ) ||
			$body.hasClass( 'single-attachment' ) ||
			$body.hasClass( 'error404' ) ||
			$body.hasClass( 'reborn-front-page' )
		) ) {
			return;
		}

		sidebarPos       = $sidebar.offset();
		sidebarPosBottom = sidebarPos.top + ( $sidebar.height() + 28 );

		$entryContent.find( param ).each( function() {
			var $element = $( this ),
				elementPos = $element.offset(),
				elementPosTop = elementPos.top;

			// Add 'below-entry-meta' to elements below the entry meta.
			if ( elementPosTop > sidebarPosBottom ) {
				$element.addClass( 'below-entry-meta' );
			} else {
				$element.removeClass( 'below-entry-meta' );
			}
		});
	}

	/*
	 * Test if inline SVGs are supported.
	 * @link https://github.com/Modernizr/Modernizr/
	 */
	function supportsInlineSVG() {
		var div = document.createElement( 'div' );
		div.innerHTML = '<svg/>';
		return 'http://www.w3.org/2000/svg' === ( 'undefined' !== typeof SVGRect && div.firstChild && div.firstChild.namespaceURI );
	}

	/**
	 * Test if an iOS device.
	*/
	function checkiOS() {
		return /iPad|iPhone|iPod/.test(navigator.userAgent) && ! window.MSStream;
	}

	/*
	 * Test if background-attachment: fixed is supported.
	 * @link http://stackoverflow.com/questions/14115080/detect-support-for-background-attachment-fixed
	 */
	function supportsFixedBackground() {
		var el = document.createElement('div'),
			isSupported;

		try {
			if ( ! ( 'backgroundAttachment' in el.style ) || checkiOS() ) {
				return false;
			}
			el.style.backgroundAttachment = 'fixed';
			isSupported = ( 'fixed' === el.style.backgroundAttachment );
			return isSupported;
		}
		catch (e) {
			return false;
		}
	}

	// Fire on document ready.
	$( document ).ready( function() {

		// If navigation menu is present on page, setNavProps and adjustScrollClass.
		if ( $navigation.length ) {
			setNavProps();
			adjustScrollClass();
		}

		// If 'Scroll Down' arrow in present on page, calculate scroll offset and bind an event handler to the click event.
		if ( $menuScrollDown.length ) {

			if ( $( 'body' ).hasClass( 'admin-bar' ) ) {
				menuTop -= 32;
			}
			if ( $( 'body' ).hasClass( 'blog' ) ) {
				menuTop -= 30; // The div for latest posts has no space above content, add some to account for this.
			}
			if ( ! $navigation.length ) {
				navigationOuterHeight = 0;
			}

			$menuScrollDown.click( function( e ) {
				e.preventDefault();
				$( window ).scrollTo( '#primary', {
					duration: 600,
					offset: { top: menuTop - navigationOuterHeight }
				});
			});
		}

		adjustHeaderHeight();
		setQuotesIcon();
		if ( true === supportsInlineSVG() ) {
			document.documentElement.className = document.documentElement.className.replace( /(\s*)no-svg(\s*)/, '$1svg$2' );
		}

		if ( true === supportsFixedBackground() ) {
			document.documentElement.className += ' background-fixed';
		}
	});

	// If navigation menu is present on page, adjust it on scroll and screen resize.
	if ( $navigation.length ) {

		// On scroll, we want to stick/unstick the navigation.
		$( window ).on( 'scroll', function() {
			adjustScrollClass();
			adjustHeaderHeight();
		});

		// Also want to make sure the navigation is where it should be on resize.
		$( window ).resize( function() {
			setNavProps();
			setTimeout( adjustScrollClass, 500 );
		});
	}

	$( window ).resize( function() {
		clearTimeout( resizeTimer );
		resizeTimer = setTimeout( function() {
			belowEntryMetaClass( 'blockquote.alignleft, blockquote.alignright' );
		}, 300 );
		setTimeout( adjustHeaderHeight, 1000 );
	});

	// Add header video class after the video is loaded.
	$( document ).on( 'wp-custom-header-video-loaded', function() {
		$body.addClass( 'has-header-video' );
	});

})( jQuery );


function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.Popper=e()}(this,function(){"use strict";function t(t){var e=!1,n=0,i=document.createElement("span");return new MutationObserver(function(){t(),e=!1}).observe(i,{attributes:!0}),function(){e||(e=!0,i.setAttribute("x-index",n),n+=1)}}function e(t){var e=!1;return function(){e||(e=!0,setTimeout(function(){e=!1,t()},at))}}function n(t){return""!==t&&!isNaN(parseFloat(t))&&isFinite(t)}function i(t,e){Object.keys(e).forEach(function(i){var o="";-1!==["width","height","top","right","bottom","left"].indexOf(i)&&n(e[i])&&(o="px"),t.style[i]=e[i]+o})}function o(t){var e={};return t&&"[object Function]"===e.toString.call(t)}function r(t,e){if(1!==t.nodeType)return[];var n=window.getComputedStyle(t,null);return e?n[e]:n}function s(t){return"HTML"===t.nodeName?t:t.parentNode||t.host}function a(t){if(!t||-1!==["HTML","BODY","#document"].indexOf(t.nodeName))return window.document.body;var e=r(t),n=e.overflow,i=e.overflowX,o=e.overflowY;return/(auto|scroll)/.test(n+o+i)?t:a(s(t))}function l(t){var e=t.nodeName;return"BODY"!==e&&("HTML"===e||t.firstElementChild.offsetParent===t)}function f(t){return null!==t.parentNode?f(t.parentNode):t}function c(t){var e=t&&t.offsetParent,n=e&&e.nodeName;return n&&"BODY"!==n&&"HTML"!==n?e:window.document.documentElement}function h(t,e){if(!(t&&t.nodeType&&e&&e.nodeType))return window.document.documentElement;var n=t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING,i=n?t:e,o=n?e:t,r=document.createRange();r.setStart(i,0),r.setEnd(o,0);var s=r.commonAncestorContainer;if(t!==s&&e!==s||i.contains(o))return l(s)?s:c(s);var a=f(t);return a.host?h(a.host,e):h(t,f(e).host)}function u(t){var e="top"===(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"top")?"scrollTop":"scrollLeft",n=t.nodeName;if("BODY"===n||"HTML"===n){var i=window.document.documentElement;return(window.document.scrollingElement||i)[e]}return t[e]}function p(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=u(e,"top"),o=u(e,"left"),r=n?-1:1;return t.top+=i*r,t.bottom+=i*r,t.left+=o*r,t.right+=o*r,t}function d(t,e){var n="x"===e?"Left":"Top",i="Left"===n?"Right":"Bottom";return+t["border"+n+"Width"].split("px")[0]+ +t["border"+i+"Width"].split("px")[0]}function m(t,e,n,i){return Math.max(e["offset"+t],n["client"+t],n["offset"+t],ht()?n["offset"+t]+i["margin"+("Height"===t?"Top":"Left")]+i["margin"+("Height"===t?"Bottom":"Right")]:0)}function g(){var t=window.document.body,e=window.document.documentElement,n=ht()&&window.getComputedStyle(e);return{height:m("Height",t,e,n),width:m("Width",t,e,n)}}function v(t){return mt({},t,{right:t.left+t.width,bottom:t.top+t.height})}function b(t){var e={};if(ht())try{e=t.getBoundingClientRect();var n=u(t,"top"),i=u(t,"left");e.top+=n,e.left+=i,e.bottom+=n,e.right+=i}catch(t){}else e=t.getBoundingClientRect();var o={left:e.left,top:e.top,width:e.right-e.left,height:e.bottom-e.top},s="HTML"===t.nodeName?g():{},a=s.width||t.clientWidth||o.right-o.left,l=s.height||t.clientHeight||o.bottom-o.top,f=t.offsetWidth-a,c=t.offsetHeight-l;if(f||c){var h=r(t);f-=d(h,"x"),c-=d(h,"y"),o.width-=f,o.height-=c}return v(o)}function y(t,e){var n=ht(),i="HTML"===e.nodeName,o=b(t),s=b(e),l=a(t),f=v({top:o.top-s.top,left:o.left-s.left,width:o.width,height:o.height});if(i||"BODY"===e.nodeName){var c=r(e),h=n&&i?0:+c.borderTopWidth.split("px")[0],u=n&&i?0:+c.borderLeftWidth.split("px")[0],d=n&&i?0:+c.marginTop.split("px")[0],m=n&&i?0:+c.marginLeft.split("px")[0];f.top-=h-d,f.bottom-=h-d,f.left-=u-m,f.right-=u-m,f.marginTop=d,f.marginLeft=m}return(n?e.contains(l):e===l&&"BODY"!==l.nodeName)&&(f=p(f,e)),f}function w(t){var e=window.document.documentElement,n=y(t,e),i=Math.max(e.clientWidth,window.innerWidth||0),o=Math.max(e.clientHeight,window.innerHeight||0),r=u(e),s=u(e,"left");return v({top:r-n.top+n.marginTop,left:s-n.left+n.marginLeft,width:i,height:o})}function _(t){var e=t.nodeName;return"BODY"!==e&&"HTML"!==e&&("fixed"===r(t,"position")||_(s(t)))}function E(t,e,n,i){var o={top:0,left:0},r=h(t,e);if("viewport"===i)o=w(r);else{var l=void 0;"scrollParent"===i?"BODY"===(l=a(s(t))).nodeName&&(l=window.document.documentElement):l="window"===i?window.document.documentElement:i;var f=y(l,r);if("HTML"!==l.nodeName||_(r))o=f;else{var c=g(),u=c.height,p=c.width;o.top+=f.top-f.marginTop,o.bottom=u+f.top,o.left+=f.left-f.marginLeft,o.right=p+f.left}}return o.left+=n,o.top+=n,o.right-=n,o.bottom-=n,o}function T(t){return t.width*t.height}function O(t,e,n,i,o){var r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0;if(-1===t.indexOf("auto"))return t;var s=E(n,i,r,o),a={top:{width:s.width,height:e.top-s.top},right:{width:s.right-e.right,height:s.height},bottom:{width:s.width,height:s.bottom-e.bottom},left:{width:e.left-s.left,height:s.height}},l=Object.keys(a).map(function(t){return mt({key:t},a[t],{area:T(a[t])})}).sort(function(t,e){return e.area-t.area}),f=l.filter(function(t){var e=t.width,i=t.height;return e>=n.clientWidth&&i>=n.clientHeight}),c=f.length>0?f[0].key:l[0].key,h=t.split("-")[1];return c+(h?"-"+h:"")}function C(t,e,n){return y(n,h(e,n))}function A(t){var e=window.getComputedStyle(t),n=parseFloat(e.marginTop)+parseFloat(e.marginBottom),i=parseFloat(e.marginLeft)+parseFloat(e.marginRight);return{width:t.offsetWidth+i,height:t.offsetHeight+n}}function L(t){var e={left:"right",right:"left",bottom:"top",top:"bottom"};return t.replace(/left|right|bottom|top/g,function(t){return e[t]})}function S(t,e,n){n=n.split("-")[0];var i=A(t),o={width:i.width,height:i.height},r=-1!==["right","left"].indexOf(n),s=r?"top":"left",a=r?"left":"top",l=r?"height":"width",f=r?"width":"height";return o[s]=e[s]+e[l]/2-i[l]/2,o[a]=n===a?e[a]-i[f]:e[L(a)],o}function D(t,e){return Array.prototype.find?t.find(e):t.filter(e)[0]}function H(t,e,n){if(Array.prototype.findIndex)return t.findIndex(function(t){return t[e]===n});var i=D(t,function(t){return t[e]===n});return t.indexOf(i)}function N(t,e,n){return(void 0===n?t:t.slice(0,H(t,"name",n))).forEach(function(t){t.function;var n=t.function||t.fn;t.enabled&&o(n)&&(e.offsets.popper=v(e.offsets.popper),e.offsets.reference=v(e.offsets.reference),e=n(e,t))}),e}function P(){if(!this.state.isDestroyed){var t={instance:this,styles:{},attributes:{},flipped:!1,offsets:{}};t.offsets.reference=C(this.state,this.popper,this.reference),t.placement=O(this.options.placement,t.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),t.originalPlacement=t.placement,t.offsets.popper=S(this.popper,t.offsets.reference,t.placement),t.offsets.popper.position="absolute",t=N(this.modifiers,t),this.state.isCreated?this.options.onUpdate(t):(this.state.isCreated=!0,this.options.onCreate(t))}}function I(t,e){return t.some(function(t){var n=t.name;return t.enabled&&n===e})}function x(t){for(var e=[!1,"ms","webkit","moz","o"],n=t.charAt(0).toUpperCase()+t.slice(1),i=0;i<e.length-1;i++){var o=e[i],r=o?""+o+n:t;if(void 0!==window.document.body.style[r])return r}return null}function k(){return this.state.isDestroyed=!0,I(this.modifiers,"applyStyle")&&(this.popper.removeAttribute("x-placement"),this.popper.style.left="",this.popper.style.position="",this.popper.style.top="",this.popper.style[x("transform")]=""),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}function M(t,e,n,i){var o="BODY"===t.nodeName,r=o?window:t;r.addEventListener(e,n,{passive:!0}),o||M(a(r.parentNode),e,n,i),i.push(r)}function B(t,e,n,i){n.updateBound=i,window.addEventListener("resize",n.updateBound,{passive:!0});var o=a(t);return M(o,"scroll",n.updateBound,n.scrollParents),n.scrollElement=o,n.eventsEnabled=!0,n}function W(){this.state.eventsEnabled||(this.state=B(this.reference,this.options,this.state,this.scheduleUpdate))}function U(t,e){return window.removeEventListener("resize",e.updateBound),e.scrollParents.forEach(function(t){t.removeEventListener("scroll",e.updateBound)}),e.updateBound=null,e.scrollParents=[],e.scrollElement=null,e.eventsEnabled=!1,e}function F(){this.state.eventsEnabled&&(window.cancelAnimationFrame(this.scheduleUpdate),this.state=U(this.reference,this.state))}function j(t,e){Object.keys(e).forEach(function(n){!1!==e[n]?t.setAttribute(n,e[n]):t.removeAttribute(n)})}function R(t){return i(t.instance.popper,t.styles),j(t.instance.popper,t.attributes),t.offsets.arrow&&i(t.arrowElement,t.offsets.arrow),t}function G(t,e,n,i,o){var r=C(o,e,t),s=O(n.placement,r,e,t,n.modifiers.flip.boundariesElement,n.modifiers.flip.padding);return e.setAttribute("x-placement",s),n}function K(t,e){var n=e.x,i=e.y,o=t.offsets.popper,r=D(t.instance.modifiers,function(t){return"applyStyle"===t.name}).gpuAcceleration,s=void 0!==r?r:e.gpuAcceleration,a=b(c(t.instance.popper)),l={position:o.position},f={left:Math.round(o.left),top:Math.round(o.top),bottom:Math.round(o.bottom),right:Math.round(o.right)},h="bottom"===n?"top":"bottom",u="right"===i?"left":"right",p=x("transform"),d=void 0,m=void 0;if(m="bottom"===h?-a.height+f.bottom:f.top,d="right"===u?-a.width+f.right:f.left,s&&p)l[p]="translate3d("+d+"px, "+m+"px, 0)",l[h]=0,l[u]=0,l.willChange="transform";else{var g="bottom"===h?-1:1,v="right"===u?-1:1;l[h]=m*g,l[u]=d*v,l.willChange=h+", "+u}var y={"x-placement":t.placement};return t.attributes=y,t.styles=mt({},l,t.styles),t}function Y(t,e,n){var i=D(t,function(t){return t.name===e}),o=!!i&&t.some(function(t){return t.name===n&&t.enabled&&t.order<i.order});if(!o);return o}function q(t,e){if(!Y(t.instance.modifiers,"arrow","keepTogether"))return t;var n=e.element;if("string"==typeof n){if(!(n=t.instance.popper.querySelector(n)))return t}else if(!t.instance.popper.contains(n))return t;var i=t.placement.split("-")[0],o=t.offsets,r=o.popper,s=o.reference,a=-1!==["left","right"].indexOf(i),l=a?"height":"width",f=a?"top":"left",c=a?"left":"top",h=a?"bottom":"right",u=A(n)[l];s[h]-u<r[f]&&(t.offsets.popper[f]-=r[f]-(s[h]-u)),s[f]+u>r[h]&&(t.offsets.popper[f]+=s[f]+u-r[h]);var p=s[f]+s[l]/2-u/2-v(t.offsets.popper)[f];return p=Math.max(Math.min(r[l]-u,p),0),t.arrowElement=n,t.offsets.arrow={},t.offsets.arrow[f]=Math.floor(p),t.offsets.arrow[c]="",t}function V(t){return"end"===t?"start":"start"===t?"end":t}function Q(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=vt.indexOf(t),i=vt.slice(n+1).concat(vt.slice(0,n));return e?i.reverse():i}function z(t,e){if(I(t.instance.modifiers,"inner"))return t;if(t.flipped&&t.placement===t.originalPlacement)return t;var n=E(t.instance.popper,t.instance.reference,e.padding,e.boundariesElement),i=t.placement.split("-")[0],o=L(i),r=t.placement.split("-")[1]||"",s=[];switch(e.behavior){case bt.FLIP:s=[i,o];break;case bt.CLOCKWISE:s=Q(i);break;case bt.COUNTERCLOCKWISE:s=Q(i,!0);break;default:s=e.behavior}return s.forEach(function(a,l){if(i!==a||s.length===l+1)return t;i=t.placement.split("-")[0],o=L(i);var f=t.offsets.popper,c=t.offsets.reference,h=Math.floor,u="left"===i&&h(f.right)>h(c.left)||"right"===i&&h(f.left)<h(c.right)||"top"===i&&h(f.bottom)>h(c.top)||"bottom"===i&&h(f.top)<h(c.bottom),p=h(f.left)<h(n.left),d=h(f.right)>h(n.right),m=h(f.top)<h(n.top),g=h(f.bottom)>h(n.bottom),v="left"===i&&p||"right"===i&&d||"top"===i&&m||"bottom"===i&&g,b=-1!==["top","bottom"].indexOf(i),y=!!e.flipVariations&&(b&&"start"===r&&p||b&&"end"===r&&d||!b&&"start"===r&&m||!b&&"end"===r&&g);(u||v||y)&&(t.flipped=!0,(u||v)&&(i=s[l+1]),y&&(r=V(r)),t.placement=i+(r?"-"+r:""),t.offsets.popper=mt({},t.offsets.popper,S(t.instance.popper,t.offsets.reference,t.placement)),t=N(t.instance.modifiers,t,"flip"))}),t}function X(t){var e=t.offsets,n=e.popper,i=e.reference,o=t.placement.split("-")[0],r=Math.floor,s=-1!==["top","bottom"].indexOf(o),a=s?"right":"bottom",l=s?"left":"top",f=s?"width":"height";return n[a]<r(i[l])&&(t.offsets.popper[l]=r(i[l])-n[f]),n[l]>r(i[a])&&(t.offsets.popper[l]=r(i[a])),t}function Z(t,e,n,i){var o=t.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),r=+o[1],s=o[2];if(!r)return t;if(0===s.indexOf("%")){var a=void 0;switch(s){case"%p":a=n;break;case"%":case"%r":default:a=i}return v(a)[e]/100*r}if("vh"===s||"vw"===s){return("vh"===s?Math.max(document.documentElement.clientHeight,window.innerHeight||0):Math.max(document.documentElement.clientWidth,window.innerWidth||0))/100*r}return r}function J(t,e,i,o){var r=[0,0],s=-1!==["right","left"].indexOf(o),a=t.split(/(\+|\-)/).map(function(t){return t.trim()}),l=a.indexOf(D(a,function(t){return-1!==t.search(/,|\s/)}));a[l]&&a[l].indexOf(",");var f=/\s*,\s*|\s+/,c=-1!==l?[a.slice(0,l).concat([a[l].split(f)[0]]),[a[l].split(f)[1]].concat(a.slice(l+1))]:[a];return(c=c.map(function(t,n){var o=(1===n?!s:s)?"height":"width",r=!1;return t.reduce(function(t,e){return""===t[t.length-1]&&-1!==["+","-"].indexOf(e)?(t[t.length-1]=e,r=!0,t):r?(t[t.length-1]+=e,r=!1,t):t.concat(e)},[]).map(function(t){return Z(t,o,e,i)})})).forEach(function(t,e){t.forEach(function(i,o){n(i)&&(r[e]+=i*("-"===t[o-1]?-1:1))})}),r}function $(t,e){var i=e.offset,o=t.placement,r=t.offsets,s=r.popper,a=r.reference,l=o.split("-")[0],f=void 0;return f=n(+i)?[+i,0]:J(i,s,a,l),"left"===l?(s.top+=f[0],s.left-=f[1]):"right"===l?(s.top+=f[0],s.left+=f[1]):"top"===l?(s.left+=f[0],s.top-=f[1]):"bottom"===l&&(s.left+=f[0],s.top+=f[1]),t.popper=s,t}function tt(t,e){var n=e.boundariesElement||c(t.instance.popper),i=E(t.instance.popper,t.instance.reference,e.padding,n);e.boundaries=i;var o=e.priority,r=t.offsets.popper,s={primary:function(t){var n=r[t];return r[t]<i[t]&&!e.escapeWithReference&&(n=Math.max(r[t],i[t])),dt({},t,n)},secondary:function(t){var n="right"===t?"left":"top",o=r[n];return r[t]>i[t]&&!e.escapeWithReference&&(o=Math.min(r[n],i[t]-("right"===t?r.width:r.height))),dt({},n,o)}};return o.forEach(function(t){var e=-1!==["left","top"].indexOf(t)?"primary":"secondary";r=mt({},r,s[e](t))}),t.offsets.popper=r,t}function et(t){var e=t.placement,n=e.split("-")[0],i=e.split("-")[1];if(i){var o=t.offsets,r=o.reference,s=o.popper,a=-1!==["bottom","top"].indexOf(n),l=a?"left":"top",f=a?"width":"height",c={start:dt({},l,r[l]),end:dt({},l,r[l]+r[f]-s[f])};t.offsets.popper=mt({},s,c[i])}return t}function nt(t){if(!Y(t.instance.modifiers,"hide","preventOverflow"))return t;var e=t.offsets.reference,n=D(t.instance.modifiers,function(t){return"preventOverflow"===t.name}).boundaries;if(e.bottom<n.top||e.left>n.right||e.top>n.bottom||e.right<n.left){if(!0===t.hide)return t;t.hide=!0,t.attributes["x-out-of-boundaries"]=""}else{if(!1===t.hide)return t;t.hide=!1,t.attributes["x-out-of-boundaries"]=!1}return t}function it(t){var e=t.placement,n=e.split("-")[0],i=t.offsets,o=i.popper,r=i.reference,s=-1!==["left","right"].indexOf(n),a=-1===["top","left"].indexOf(n);return o[s?"left":"top"]=r[e]-(a?o[s?"width":"height"]:0),t.placement=L(e),t.offsets.popper=v(o),t}for(var ot=["native code","[object MutationObserverConstructor]"],rt="undefined"!=typeof window,st=["Edge","Trident","Firefox"],at=0,lt=0;lt<st.length;lt+=1)if(rt&&navigator.userAgent.indexOf(st[lt])>=0){at=1;break}var ft=rt&&function(t){return ot.some(function(e){return(t||"").toString().indexOf(e)>-1})}(window.MutationObserver)?t:e,ct=void 0,ht=function(){return void 0===ct&&(ct=-1!==navigator.appVersion.indexOf("MSIE 10")),ct},ut=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},pt=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),dt=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t},mt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},gt=["auto-start","auto","auto-end","top-start","top","top-end","right-start","right","right-end","bottom-end","bottom","bottom-start","left-end","left","left-start"],vt=gt.slice(3),bt={FLIP:"flip",CLOCKWISE:"clockwise",COUNTERCLOCKWISE:"counterclockwise"},yt={placement:"bottom",eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:{shift:{order:100,enabled:!0,fn:et},offset:{order:200,enabled:!0,fn:$,offset:0},preventOverflow:{order:300,enabled:!0,fn:tt,priority:["left","right","top","bottom"],padding:5,boundariesElement:"scrollParent"},keepTogether:{order:400,enabled:!0,fn:X},arrow:{order:500,enabled:!0,fn:q,element:"[x-arrow]"},flip:{order:600,enabled:!0,fn:z,behavior:"flip",padding:5,boundariesElement:"viewport"},inner:{order:700,enabled:!1,fn:it},hide:{order:800,enabled:!0,fn:nt},computeStyle:{order:850,enabled:!0,fn:K,gpuAcceleration:!0,x:"bottom",y:"right"},applyStyle:{order:900,enabled:!0,fn:R,onLoad:G,gpuAcceleration:void 0}}},wt=function(){function t(e,n){var r=this,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};ut(this,t),this.scheduleUpdate=function(){return requestAnimationFrame(r.update)},this.update=ft(this.update.bind(this)),this.options=mt({},t.Defaults,s),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=e.jquery?e[0]:e,this.popper=n.jquery?n[0]:n,i(this.popper,{position:"absolute"}),this.options.modifiers={},Object.keys(mt({},t.Defaults.modifiers,s.modifiers)).forEach(function(e){r.options.modifiers[e]=mt({},t.Defaults.modifiers[e]||{},s.modifiers?s.modifiers[e]:{})}),this.modifiers=Object.keys(this.options.modifiers).map(function(t){return mt({name:t},r.options.modifiers[t])}).sort(function(t,e){return t.order-e.order}),this.modifiers.forEach(function(t){t.enabled&&o(t.onLoad)&&t.onLoad(r.reference,r.popper,r.options,t,r.state)}),this.update();var a=this.options.eventsEnabled;a&&this.enableEventListeners(),this.state.eventsEnabled=a}return pt(t,[{key:"update",value:function(){return P.call(this)}},{key:"destroy",value:function(){return k.call(this)}},{key:"enableEventListeners",value:function(){return W.call(this)}},{key:"disableEventListeners",value:function(){return F.call(this)}}]),t}();return wt.Utils=("undefined"!=typeof window?window:global).PopperUtils,wt.placements=gt,wt.Defaults=yt,wt});var Util=function(t){function e(t){return{}.toString.call(t).match(/\s([a-zA-Z]+)/)[1].toLowerCase()}function n(t){return(t[0]||t).nodeType}function i(){return{bindType:s.end,delegateType:s.end,handle:function(e){if(t(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}}function o(){if(window.QUnit)return!1;var t=document.createElement("bootstrap");for(var e in a)if(void 0!==t.style[e])return{end:a[e]};return!1}function r(e){var n=this,i=!1;return t(this).one(l.TRANSITION_END,function(){i=!0}),setTimeout(function(){i||l.triggerTransitionEnd(n)},e),this}var s=!1,a={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},l={TRANSITION_END:"bsTransitionEnd",getUID:function(t){do{t+=~~(1e6*Math.random())}while(document.getElementById(t));return t},getSelectorFromElement:function(e){var n=e.getAttribute("data-target");n&&"#"!==n||(n=e.getAttribute("href")||"");try{return t(n).length>0?n:null}catch(t){return null}},reflow:function(t){return t.offsetHeight},triggerTransitionEnd:function(e){t(e).trigger(s.end)},supportsTransitionEnd:function(){return Boolean(s)},typeCheckConfig:function(t,i,o){for(var r in o)if(o.hasOwnProperty(r)){var s=o[r],a=i[r],l=a&&n(a)?"element":e(a);if(!new RegExp(s).test(l))throw new Error(t.toUpperCase()+': Option "'+r+'" provided type "'+l+'" but expected type "'+s+'".')}}};return function(){s=o(),t.fn.emulateTransitionEnd=r,l.supportsTransitionEnd()&&(t.event.special[l.TRANSITION_END]=i())}(),l}(jQuery),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),Collapse=function(t){var e="collapse",n="bs.collapse",i=t.fn[e],o={toggle:!0,parent:""},r={toggle:"boolean",parent:"string"},s={SHOW:"show.bs.collapse",SHOWN:"shown.bs.collapse",HIDE:"hide.bs.collapse",HIDDEN:"hidden.bs.collapse",CLICK_DATA_API:"click.bs.collapse.data-api"},a={SHOW:"show",COLLAPSE:"collapse",COLLAPSING:"collapsing",COLLAPSED:"collapsed"},l={WIDTH:"width",HEIGHT:"height"},f={ACTIVES:".show, .collapsing",DATA_TOGGLE:'[data-toggle="collapse"]'},c=function(){function i(e,n){_classCallCheck(this,i),this._isTransitioning=!1,this._element=e,this._config=this._getConfig(n),this._triggerArray=t.makeArray(t('[data-toggle="collapse"][href="#'+e.id+'"],[data-toggle="collapse"][data-target="#'+e.id+'"]'));for(var o=t(f.DATA_TOGGLE),r=0;r<o.length;r++){var s=o[r],a=Util.getSelectorFromElement(s);null!==a&&t(a).filter(e).length>0&&this._triggerArray.push(s)}this._parent=this._config.parent?this._getParent():null,this._config.parent||this._addAriaAndCollapsedClass(this._element,this._triggerArray),this._config.toggle&&this.toggle()}return i.prototype.toggle=function(){t(this._element).hasClass(a.SHOW)?this.hide():this.show()},i.prototype.show=function(){var e=this;if(!this._isTransitioning&&!t(this._element).hasClass(a.SHOW)){var o=void 0,r=void 0;if(this._parent&&((o=t.makeArray(t(this._parent).children().children(f.ACTIVES))).length||(o=null)),!(o&&(r=t(o).data(n))&&r._isTransitioning)){var l=t.Event(s.SHOW);if(t(this._element).trigger(l),!l.isDefaultPrevented()){o&&(i._jQueryInterface.call(t(o),"hide"),r||t(o).data(n,null));var c=this._getDimension();t(this._element).removeClass(a.COLLAPSE).addClass(a.COLLAPSING),this._element.style[c]=0,this._triggerArray.length&&t(this._triggerArray).removeClass(a.COLLAPSED).attr("aria-expanded",!0),this.setTransitioning(!0);var h=function(){t(e._element).removeClass(a.COLLAPSING).addClass(a.COLLAPSE).addClass(a.SHOW),e._element.style[c]="",e.setTransitioning(!1),t(e._element).trigger(s.SHOWN)};if(Util.supportsTransitionEnd()){var u="scroll"+(c[0].toUpperCase()+c.slice(1));t(this._element).one(Util.TRANSITION_END,h).emulateTransitionEnd(600),this._element.style[c]=this._element[u]+"px"}else h()}}}},i.prototype.hide=function(){var e=this;if(!this._isTransitioning&&t(this._element).hasClass(a.SHOW)){var n=t.Event(s.HIDE);if(t(this._element).trigger(n),!n.isDefaultPrevented()){var i=this._getDimension();if(this._element.style[i]=this._element.getBoundingClientRect()[i]+"px",Util.reflow(this._element),t(this._element).addClass(a.COLLAPSING).removeClass(a.COLLAPSE).removeClass(a.SHOW),this._triggerArray.length)for(var o=0;o<this._triggerArray.length;o++){var r=this._triggerArray[o],l=Util.getSelectorFromElement(r);null!==l&&(t(l).hasClass(a.SHOW)||t(r).addClass(a.COLLAPSED).attr("aria-expanded",!1))}this.setTransitioning(!0);var f=function(){e.setTransitioning(!1),t(e._element).removeClass(a.COLLAPSING).addClass(a.COLLAPSE).trigger(s.HIDDEN)};this._element.style[i]="",Util.supportsTransitionEnd()?t(this._element).one(Util.TRANSITION_END,f).emulateTransitionEnd(600):f()}}},i.prototype.setTransitioning=function(t){this._isTransitioning=t},i.prototype.dispose=function(){t.removeData(this._element,n),this._config=null,this._parent=null,this._element=null,this._triggerArray=null,this._isTransitioning=null},i.prototype._getConfig=function(n){return n=t.extend({},o,n),n.toggle=Boolean(n.toggle),Util.typeCheckConfig(e,n,r),n},i.prototype._getDimension=function(){return t(this._element).hasClass(l.WIDTH)?l.WIDTH:l.HEIGHT},i.prototype._getParent=function(){var e=this,n=t(this._config.parent)[0],o='[data-toggle="collapse"][data-parent="'+this._config.parent+'"]';return t(n).find(o).each(function(t,n){e._addAriaAndCollapsedClass(i._getTargetFromElement(n),[n])}),n},i.prototype._addAriaAndCollapsedClass=function(e,n){if(e){var i=t(e).hasClass(a.SHOW);n.length&&t(n).toggleClass(a.COLLAPSED,!i).attr("aria-expanded",i)}},i._getTargetFromElement=function(e){var n=Util.getSelectorFromElement(e);return n?t(n)[0]:null},i._jQueryInterface=function(e){return this.each(function(){var r=t(this),s=r.data(n),a=t.extend({},o,r.data(),"object"===(void 0===e?"undefined":_typeof(e))&&e);if(!s&&a.toggle&&/show|hide/.test(e)&&(a.toggle=!1),s||(s=new i(this,a),r.data(n,s)),"string"==typeof e){if(void 0===s[e])throw new Error('No method named "'+e+'"');s[e]()}})},_createClass(i,null,[{key:"VERSION",get:function(){return"4.0.0-alpha.6"}},{key:"Default",get:function(){return o}}]),i}();return t(document).on(s.CLICK_DATA_API,f.DATA_TOGGLE,function(e){/input|textarea/i.test(e.target.tagName)||e.preventDefault();var i=t(this),o=Util.getSelectorFromElement(this);t(o).each(function(){var e=t(this),o=e.data(n)?"toggle":i.data();c._jQueryInterface.call(e,o)})}),t.fn[e]=c._jQueryInterface,t.fn[e].Constructor=c,t.fn[e].noConflict=function(){return t.fn[e]=i,c._jQueryInterface},c}(jQuery),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),Dropdown=function(t){if("undefined"==typeof Popper)throw new Error("Bootstrap dropdown require Popper.js (https://popper.js.org)");var e="dropdown",n="bs.dropdown",i="."+n,o=t.fn[e],r=new RegExp("38|40|27"),s={HIDE:"hide"+i,HIDDEN:"hidden"+i,SHOW:"show"+i,SHOWN:"shown"+i,CLICK:"click"+i,CLICK_DATA_API:"click.bs.dropdown.data-api",KEYDOWN_DATA_API:"keydown.bs.dropdown.data-api",KEYUP_DATA_API:"keyup.bs.dropdown.data-api"},a={DISABLED:"disabled",SHOW:"show",DROPUP:"dropup",MENURIGHT:"dropdown-menu-right",MENULEFT:"dropdown-menu-left"},l={DATA_TOGGLE:'[data-toggle="dropdown"]',FORM_CHILD:".dropdown form",MENU:".dropdown-menu",NAVBAR_NAV:".navbar-nav",VISIBLE_ITEMS:".dropdown-menu .dropdown-item:not(.disabled)"},f={TOP:"top-start",TOPEND:"top-end",BOTTOM:"bottom-start",BOTTOMEND:"bottom-end"},c={placement:f.BOTTOM,offset:0,flip:!0},h={placement:"string",offset:"(number|string)",flip:"boolean"},u=function(){function o(t,e){_classCallCheck(this,o),this._element=t,this._popper=null,this._config=this._getConfig(e),this._menu=this._getMenuElement(),this._addEventListeners()}return o.prototype.toggle=function(){if(!this._element.disabled&&!t(this._element).hasClass(a.DISABLED)){var e=o._getParentFromElement(this._element),n=t(this._menu).hasClass(a.SHOW);if(o._clearMenus(),!n){var i={relatedTarget:this._element},r=t.Event(s.SHOW,i);if(t(e).trigger(r),!r.isDefaultPrevented()){var f=this._element;t(e).hasClass(a.DROPUP)&&(t(this._menu).hasClass(a.MENULEFT)||t(this._menu).hasClass(a.MENURIGHT))&&(f=e),this._popper=new Popper(f,this._menu,{placement:this._getPlacement(),modifiers:{offset:{offset:this._config.offset},flip:{enabled:this._config.flip}}}),"ontouchstart"in document.documentElement&&!t(e).closest(l.NAVBAR_NAV).length&&t("body").children().on("mouseover",null,t.noop),this._element.focus(),this._element.setAttribute("aria-expanded",!0),t(this._menu).toggleClass(a.SHOW),t(e).toggleClass(a.SHOW).trigger(t.Event(s.SHOWN,i))}}}},o.prototype.dispose=function(){t.removeData(this._element,n),t(this._element).off(i),this._element=null,this._menu=null,null!==this._popper&&this._popper.destroy(),this._popper=null},o.prototype.update=function(){null!==this._popper&&this._popper.scheduleUpdate()},o.prototype._addEventListeners=function(){var e=this;t(this._element).on(s.CLICK,function(t){t.preventDefault(),t.stopPropagation(),e.toggle()})},o.prototype._getConfig=function(n){var i=t(this._element).data();return void 0!==i.placement&&(i.placement=f[i.placement.toUpperCase()]),n=t.extend({},this.constructor.Default,t(this._element).data(),n),Util.typeCheckConfig(e,n,this.constructor.DefaultType),n},o.prototype._getMenuElement=function(){if(!this._menu){var e=o._getParentFromElement(this._element);this._menu=t(e).find(l.MENU)[0]}return this._menu},o.prototype._getPlacement=function(){var e=t(this._element).parent(),n=this._config.placement;return e.hasClass(a.DROPUP)||this._config.placement===f.TOP?(n=f.TOP,t(this._menu).hasClass(a.MENURIGHT)&&(n=f.TOPEND)):t(this._menu).hasClass(a.MENURIGHT)&&(n=f.BOTTOMEND),n},o._jQueryInterface=function(e){return this.each(function(){var i=t(this).data(n),r="object"===(void 0===e?"undefined":_typeof(e))?e:null;if(i||(i=new o(this,r),t(this).data(n,i)),"string"==typeof e){if(void 0===i[e])throw new Error('No method named "'+e+'"');i[e]()}})},o._clearMenus=function(e){if(!e||3!==e.which&&("keyup"!==e.type||9===e.which))for(var i=t.makeArray(t(l.DATA_TOGGLE)),r=0;r<i.length;r++){var f=o._getParentFromElement(i[r]),c=t(i[r]).data(n),h={relatedTarget:i[r]};if(c){var u=c._menu;if(t(f).hasClass(a.SHOW)&&!(e&&("click"===e.type&&/input|textarea/i.test(e.target.tagName)||"keyup"===e.type&&9===e.which)&&t.contains(f,e.target))){var p=t.Event(s.HIDE,h);t(f).trigger(p),p.isDefaultPrevented()||("ontouchstart"in document.documentElement&&t("body").children().off("mouseover",null,t.noop),i[r].setAttribute("aria-expanded","false"),t(u).removeClass(a.SHOW),t(f).removeClass(a.SHOW).trigger(t.Event(s.HIDDEN,h)))}}}},o._getParentFromElement=function(e){var n=void 0,i=Util.getSelectorFromElement(e);return i&&(n=t(i)[0]),n||e.parentNode},o._dataApiKeydownHandler=function(e){if(!(!r.test(e.which)||/button/i.test(e.target.tagName)&&32===e.which||/input|textarea/i.test(e.target.tagName)||(e.preventDefault(),e.stopPropagation(),this.disabled||t(this).hasClass(a.DISABLED)))){var n=o._getParentFromElement(this),i=t(n).hasClass(a.SHOW);if((i||27===e.which&&32===e.which)&&(!i||27!==e.which&&32!==e.which)){var s=t(n).find(l.VISIBLE_ITEMS).get();if(s.length){var f=s.indexOf(e.target);38===e.which&&f>0&&f--,40===e.which&&f<s.length-1&&f++,f<0&&(f=0),s[f].focus()}}else{if(27===e.which){var c=t(n).find(l.DATA_TOGGLE)[0];t(c).trigger("focus")}t(this).trigger("click")}}},_createClass(o,null,[{key:"VERSION",get:function(){return"4.0.0-alpha.6"}},{key:"Default",get:function(){return c}},{key:"DefaultType",get:function(){return h}}]),o}();return t(document).on(s.KEYDOWN_DATA_API,l.DATA_TOGGLE,u._dataApiKeydownHandler).on(s.KEYDOWN_DATA_API,l.MENU,u._dataApiKeydownHandler).on(s.CLICK_DATA_API+" "+s.KEYUP_DATA_API,u._clearMenus).on(s.CLICK_DATA_API,l.DATA_TOGGLE,function(e){e.preventDefault(),e.stopPropagation(),u._jQueryInterface.call(t(this),"toggle")}).on(s.CLICK_DATA_API,l.FORM_CHILD,function(t){t.stopPropagation()}),t.fn[e]=u._jQueryInterface,t.fn[e].Constructor=u,t.fn[e].noConflict=function(){return t.fn[e]=o,u._jQueryInterface},u}(jQuery),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};!function(t){function e(t){this.callback=t,this.ticking=!1}function n(e){return e&&void 0!==t&&(e===t||e.nodeType)}function i(t){if(arguments.length<=0)throw new Error("Missing arguments in extend function");for(var e=t||{},o=1;o<arguments.length;o++){var r=arguments[o]||{};for(var s in r)"object"!==_typeof(e[s])||n(e[s])?e[s]=e[s]||r[s]:e[s]=i(e[s],r[s])}return e}function o(t){return t===Object(t)?t:{down:t,up:t}}function r(t,e){e=i(e,r.options),this.lastKnownScrollY=0,this.elem=t,this.tolerance=o(e.tolerance),this.classes=e.classes,this.offset=e.offset,this.scroller=e.scroller,this.initialised=!1,this.onPin=e.onPin,this.onUnpin=e.onUnpin,this.onTop=e.onTop,this.onNotTop=e.onNotTop,this.onBottom=e.onBottom,this.onNotBottom=e.onNotBottom}var s={bind:!!function(){}.bind,classList:"classList"in document.documentElement,rAF:!!(t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame)};t.requestAnimationFrame=t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame,e.prototype={constructor:e,update:function(){this.callback&&this.callback(),this.ticking=!1},requestTick:function(){this.ticking||(t.requestAnimationFrame(this.rafCallback||(this.rafCallback=this.update.bind(this))),this.ticking=!0)},handleEvent:function(){this.requestTick()}},r.prototype={constructor:r,init:function(){if(r.cutsTheMustard)return this.debouncer=new e(this.update.bind(this)),this.elem.classList.add(this.classes.initial),setTimeout(this.attachEvent.bind(this),100),this},destroy:function(){this.initialised=!1,this.elem.classList.remove(this.classes.unpinned,this.classes.pinned,this.classes.top,this.classes.notTop,this.classes.initial),this.scroller.removeEventListener("scroll",this.debouncer,!1)},attachEvent:function(){this.initialised||(this.lastKnownScrollY=this.getScrollY(),this.initialised=!0,this.scroller.addEventListener("scroll",this.debouncer,!1),this.debouncer.handleEvent())},unpin:function(){!this.elem.classList.contains(this.classes.pinned)&&this.elem.classList.contains(this.classes.unpinned)||(this.elem.classList.add(this.classes.unpinned),this.elem.classList.remove(this.classes.pinned),this.onUnpin&&this.onUnpin())},pin:function(){this.elem.classList.contains(this.classes.unpinned)&&(this.elem.classList.remove(this.classes.unpinned),this.elem.classList.add(this.classes.pinned),this.onPin&&this.onPin())},top:function(){this.elem.classList.contains(this.classes.top)||(this.elem.classList.add(this.classes.top),this.elem.classList.remove(this.classes.notTop),this.onTop&&this.onTop())},notTop:function(){this.elem.classList.contains(this.classes.notTop)||(this.elem.classList.add(this.classes.notTop),this.elem.classList.remove(this.classes.top),this.onNotTop&&this.onNotTop())},bottom:function(){this.elem.classList.contains(this.classes.bottom)||(this.elem.classList.add(this.classes.bottom),this.elem.classList.remove(this.classes.notBottom),this.onBottom&&this.onBottom())},notBottom:function(){this.elem.classList.contains(this.classes.notBottom)||(this.elem.classList.add(this.classes.notBottom),this.elem.classList.remove(this.classes.bottom),this.onNotBottom&&this.onNotBottom())},getScrollY:function(){return void 0!==this.scroller.pageYOffset?this.scroller.pageYOffset:void 0!==this.scroller.scrollTop?this.scroller.scrollTop:(document.documentElement||document.body.parentNode||document.body).scrollTop},getViewportHeight:function(){return t.innerHeight||document.documentElement.clientHeight||document.body.clientHeight},getElementPhysicalHeight:function(t){return Math.max(t.offsetHeight,t.clientHeight)},getScrollerPhysicalHeight:function(){return this.scroller===t||this.scroller===document.body?this.getViewportHeight():this.getElementPhysicalHeight(this.scroller)},getDocumentHeight:function(){return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.body.clientHeight,document.documentElement.clientHeight)},getElementHeight:function(t){return Math.max(t.scrollHeight,t.offsetHeight,t.clientHeight)},getScrollerHeight:function(){return this.scroller===t||this.scroller===document.body?this.getDocumentHeight():this.getElementHeight(this.scroller)},isOutOfBounds:function(t){return t<0||t+this.getScrollerPhysicalHeight()>this.getScrollerHeight()},toleranceExceeded:function(t,e){return Math.abs(t-this.lastKnownScrollY)>=this.tolerance[e]},shouldUnpin:function(t,e){return t>this.lastKnownScrollY&&t>=this.offset&&e},shouldPin:function(t,e){return t<this.lastKnownScrollY&&e||t<=this.offset},update:function(){var t=this.getScrollY(),e=t>this.lastKnownScrollY?"down":"up",n=this.toleranceExceeded(t,e);this.isOutOfBounds(t)||(t<=this.offset?this.top():this.notTop(),t+this.getViewportHeight()>=this.getScrollerHeight()?this.bottom():this.notBottom(),this.shouldUnpin(t,n)?this.unpin():this.shouldPin(t,n)&&this.pin(),this.lastKnownScrollY=t)}},r.options={tolerance:{up:0,down:0},offset:300,scroller:t,classes:{pinned:"is-pinned",unpinned:"is-unpinned",top:"is-top",notTop:"is-not-top",bottom:"is-bottom",notBottom:"is-not-bottom",initial:"topbar"}},r.cutsTheMustard=void 0!==s&&s.rAF&&s.bind&&s.classList,t.Headroom=r}(window),function(t){var e=t.document.querySelector(".site-header > .navbar");new t.Headroom(e).init()}(window);
