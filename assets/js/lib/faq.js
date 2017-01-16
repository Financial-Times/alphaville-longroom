'use strict';

const Delegate = require('dom-delegate');
const dom = require('o-dom');

var selectedIndex = null;

function getOffsetSum(elem) {
  var top=0, left=0
  while(elem) {
    top = top + parseInt(elem.offsetTop)
    left = left + parseInt(elem.offsetLeft)
    elem = elem.offsetParent        
  }
  return {top: top, left: left}
}

function getOffsetRect(elem) {
    // (1)
    var box = elem.getBoundingClientRect()
    
    var body = document.body
    var docElem = document.documentElement
    
    // (2)
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft
    
    // (3)
    var clientTop = docElem.clientTop || body.clientTop || 0
    var clientLeft = docElem.clientLeft || body.clientLeft || 0
    
    // (4)
    var top  = box.top +  scrollTop - clientTop
    var left = box.left + scrollLeft - clientLeft
    
    return { top: Math.round(top), left: Math.round(left) }
}

function getOffset(elem) {
    if (elem.getBoundingClientRect) {
        return getOffsetRect(elem)
    } else { // old browser
        return getOffsetSum(elem)
    }
}


document.addEventListener('o.DOMContentLoaded', () => {
	const faqPage = document.querySelectorAll('.lr-faq-page');
	if (faqPage && faqPage.length) {

		var dtCollection = document.querySelectorAll('.lr-faq-page dt');
		for (var i = 0; i < dtCollection.length; i++) {
			const dt = dtCollection[i];
			dt.setAttribute('data-index', i);
			dt.innerHTML = '<a name="question_' + i + '">' + dt.innerHTML + '</a><i></i>'
		}

		const ddCollection = document.querySelectorAll('.lr-faq-page dd');

		const selectToggle = dt => {
			const dtIndex = dt.getAttribute('data-index');
			const className = (dt.className.indexOf('selected')> -1)? '' : 'selected';
			dt.className = className;
			ddCollection[dtIndex].className = className;
		};

		for (var i = 0; i < ddCollection.length; i++) {
			const dd = ddCollection[i];
			const collapse = document.createElement('div');
			collapse.setAttribute('data-index', i);
			collapse.className = 'collapse';
			collapse.innerHTML = '<span>Collapse</span><i></i>';
			dd.appendChild(collapse);
		}

		const deleteDelegate = new Delegate(document.body);

		deleteDelegate.on('click', '.lr-faq-page dt', (evt) => {
			const dt = dom.getClosestMatch(evt.target, 'dt');
			selectToggle(dt);
			evt.preventDefault();
		});

		deleteDelegate.on('click', '.lr-faq-page .collapse', (evt) => {
			const collapse = dom.getClosestMatch(evt.target, '.collapse')
			selectToggle(dtCollection[collapse.getAttribute('data-index')]);
			evt.preventDefault();
		});

		setInterval(() => {
			const	questionIndex = parseInt(document.location.hash.substr(1).split('_')[1],10);
			if (questionIndex >= 0 && selectedIndex !== questionIndex){
				selectedIndex = questionIndex;
				const dt = dtCollection[selectedIndex]
				selectToggle(dt);
				const dtCoordinate = getOffset(dt);
				const stickyHeaderCompensation = 60;
				window.scrollTo(0, dtCoordinate.top - stickyHeaderCompensation )
			}
		}, 500);

	}
});
