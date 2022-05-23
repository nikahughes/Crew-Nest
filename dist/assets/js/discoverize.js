const isInViewport = function(element) {
    const childRectTop = element.getBoundingClientRect();
    return childRectTop.top >= 0 && childRectTop.left >= 0 && childRectTop.bottom <= (window.innerHeight || document.documentElement.clientHeight) && childRectTop.right <= (window.innerWidth || document.documentElement.clientWidth);
};

const isElExists = function(element) {
    return typeof element != "undefined" && element != null ? true : false;
};

const insertAfter = function(newEl, el) {
    el.parentNode.insertBefore(newEl, el.nextSibling);
};

const outerHeight = function(el) {
    let height = el.offsetHeight, style = getComputedStyle(el);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
};

const formatMoney = function(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
        const negativeSign = amount < 0 ? "-" : "";
        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = i.length > 3 ? i.length % 3 : 0;
        return negativeSign + (j ? i.substr(0, j) + thousands : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {}
};

const getElementIndex = function(node) {
    let index = 0;
    while (node = node.previousElementSibling) {
        index++;
    }
    return index;
};

const prevAll = function(node) {
    let result = [];
    while (node = node.previousElementSibling) result.push(node);
    return result;
};

const nextAll = function(node) {
    let result = [];
    while (node = node.nextElementSibling) result.push(node);
    return result;
};

const swiperInit = function(node) {
    let paginationEl = document.querySelector(".swiper-pagination[data-swiper-id='#" + node.id + "']"), paginationOpt = isElExists(paginationEl) ? {
        el: paginationEl,
        clickable: true
    } : false;
    if (paginationOpt) node.classList.add("swiper-with-pagination");
    let buttonNext = document.querySelector(".swiper-button-next[href='#" + node.id + "']"), buttonPrev = document.querySelector(".swiper-button-prev[href='#" + node.id + "']");
    let swiper = new Swiper("#" + node.id, {
        slidesPerView: "auto",
        pagination: paginationOpt,
        navigation: {
            nextEl: buttonNext,
            prevEl: buttonPrev
        },
        on: {
            paginationRender: function() {
                let pagination = node.querySelector(".swiper-pagination[data-swiper-pagination-limit]");
                if (isElExists(pagination)) {
                    let limit = parseInt(pagination.getAttribute("data-swiper-pagination-limit"));
                    let index = 0;
                    pagination.querySelectorAll(".swiper-pagination-bullet").forEach(point => {
                        if (index > limit * 2) point.classList.add("swiper-pagination-bullet-hidden");
                        index++;
                    });
                }
            },
            paginationUpdate: function(swiper, paginationEl) {
                if (paginationEl.hasAttribute("data-swiper-pagination-limit")) {
                    let childNodes = paginationEl.childNodes;
                    let limit = parseInt(paginationEl.getAttribute("data-swiper-pagination-limit"));
                    let nodeActive = paginationEl.querySelector(".swiper-pagination-bullet-active");
                    let nodeActiveIndex = parseInt(getElementIndex(nodeActive));
                    let startIndex = nodeActiveIndex - limit;
                    let extraStart = limit - (startIndex + limit);
                    let endIndex = nodeActiveIndex + limit;
                    let extraEnd = childNodes.length - nodeActiveIndex - limit;
                    if (extraStart > 0) endIndex = endIndex + extraStart;
                    if (extraEnd <= 0) startIndex = startIndex + extraEnd - 1;
                    for (let i = 0; i < childNodes.length; i++) {
                        if (i < startIndex || endIndex < i) {
                            childNodes[i].classList.add("swiper-pagination-bullet-hidden");
                        } else {
                            childNodes[i].classList.remove("swiper-pagination-bullet-hidden");
                        }
                    }
                }
            }
        }
    });
    document.querySelectorAll('[data-swiper-id="#' + node.id + '"][data-swiper-slide-to]').forEach(node => {
        node.addEventListener("click", function() {
            swiper.slideTo(this.dataset.swiperSlideTo);
        });
    });
};

(function() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    document.querySelectorAll("[data-bg-img]").forEach(node => {
        let img = node.querySelector(node.dataset.bgImg), src = isElExists(img) ? img.getAttribute("src") : img;
        if (src) {
            let imgPlaceholder = document.createElement("div");
            insertAfter(imgPlaceholder, img);
            imgPlaceholder.classList.add("img-placeholder");
            imgPlaceholder.setAttribute("style", "background-image: url(" + src + ");");
            img.classList.add("invisible");
        }
    });
    document.querySelectorAll("[data-scroll-to]").forEach(node => {
        node.addEventListener("click", function(e) {
            e.preventDefault();
            let ishref = this.hasAttribute("href"), target_id = false;
            if (ishref == true) {
                target_id = this.getAttribute("href");
            } else {
                target_id = this.dataset.scrollTo;
            }
            let targetEl = document.querySelector(target_id);
            if (targetEl.classList.contains("tab-pane")) {
                Array.prototype.filter.call(targetEl.parentNode.children, function(child) {
                    let tabEl = document.querySelector('[data-bs-toggle="tab"][data-bs-target="#' + child.id + '"]');
                    if (child === targetEl) {
                        child.classList.add("active");
                        child.classList.add("show");
                        tabEl.classList.add("active");
                    } else {
                        child.classList.remove("active");
                        child.classList.remove("show");
                        tabEl.classList.remove("active");
                    }
                });
            }
            targetEl.scrollIntoView({
                behavior: "smooth"
            });
        });
    });
    document.querySelectorAll("a[data-bs-toggle]:not([data-scroll-to])").forEach(node => {
        node.addEventListener("click", function(e) {
            e.preventDefault();
        });
    });
    document.querySelectorAll(".navbar-collapse").forEach(node => {
        let navbar = node.closest(".navbar");
        node.addEventListener("show.bs.collapse", function() {
            navbar.classList.add("is-collapsed");
        });
        node.addEventListener("hidden.bs.collapse", function() {
            navbar.classList.remove("is-collapsed");
        });
    });
    document.querySelectorAll(".form-options-collapse").forEach(node => {
        let header = node.closest(".header"), searchbox = node.closest(".searchbox");
        node.addEventListener("show.bs.collapse", function() {
            if (isElExists(header) && header.hasAttribute("data-sticky-hide")) header.setAttribute("data-sticky-hide", false);
            if (isElExists(searchbox)) {
                searchbox.setAttribute("style", "display: block !important;");
                searchbox.style.display = "block !important;";
            }
        });
        node.addEventListener("hide.bs.collapse", function() {
            if (isElExists(header) && header.hasAttribute("data-sticky-hide")) header.setAttribute("data-sticky-hide", true);
            if (isElExists(searchbox)) {
                searchbox.removeAttribute("style");
                searchbox.style.display = null;
            }
        });
    });
    document.querySelectorAll("[data-show-bs-collapse-id]").forEach(node => {
        node.addEventListener("click", function() {
            let bsCollapse = new bootstrap.Collapse(document.querySelector(this.dataset.showBsCollapseId), {
                toggle: false
            });
            bsCollapse.show();
        });
    });
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle-tooltip="tooltip"]'));
    let tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    document.querySelectorAll(".btn-select-dropdown [data-value]").forEach(node => {
        node.addEventListener("click", function(e) {
            e.preventDefault();
            let btnSelect = this.closest(".btn-select-dropdown");
            btnSelect.querySelector("button").innerHTML = this.innerHTML;
            let sel = btnSelect.querySelector("select");
            let opts = sel.options;
            for (let opt, j = 0; opt = opts[j]; j++) {
                if (opt.value == this.dataset.value) {
                    sel.selectedIndex = j;
                    break;
                }
            }
            btnSelect.querySelectorAll("[data-value]").forEach(node => {
                node.classList.remove("active");
            });
            e.currentTarget.classList.add("active");
        });
    });
    document.querySelectorAll(".btn-range input[type=range").forEach(node => {
        node.addEventListener("input", function(e) {
            e.preventDefault();
            let btnRange = this.closest(".btn-range"), suffix = this.hasAttribute("data-suffix") ? this.dataset.suffix : "", prefix = this.hasAttribute("data-prefix") ? this.dataset.prefix : "";
            btnRange.querySelector("button").innerHTML = prefix + this.value + suffix;
        });
    });
    document.querySelectorAll('[data-check-range] [type="range"]').forEach(node => {
        node.addEventListener("input", function(e) {
            let checkRange = this.closest("[data-check-range]"), check = checkRange.querySelector('[type="checkbox"]'), btn = checkRange.querySelector('[data-bs-toggle="dropdown"]');
            if (this.value == this.getAttribute("min")) {
                btn.classList.remove("active");
                check.checked = true;
            } else {
                btn.classList.add("active");
                check.checked = false;
            }
        });
    });
    document.querySelectorAll("[data-range-max]").forEach(node => {
        node.addEventListener("input", function(e) {
            let rangeMax = document.querySelector(this.dataset.rangeMax), valMin = parseInt(this.value), step = parseInt(this.getAttribute("step"));
            rangeMax.setAttribute("min", parseInt(valMin + step));
            rangeMax.dispatchEvent(new Event("input"));
        });
    });
    document.querySelectorAll('[data-check-range] [type="checkbox"]').forEach(node => {
        node.addEventListener("input", function(e) {
            let range = this.closest("[data-check-range]").querySelector('[type="range"]'), min = parseInt(range.getAttribute("min")), step = parseInt(range.getAttribute("step"));
            if (this.checked == true) {
                range.value = min;
            } else {
                range.value = min + step;
            }
            range.dispatchEvent(new Event("input"));
        });
    });
    document.querySelectorAll('.allow-hover[data-bs-toggle="dropdown"]').forEach(node => {
        node.addEventListener("hover", function(e) {
            this.click();
        });
    });
    document.querySelectorAll(".swiper").forEach(node => {
        if (node.dataset.jsSwiper == "auto") swiperInit(node);
    });
    document.querySelectorAll("[data-js-typing]").forEach(node => {
        let text = "", currentTextIndex = -1, letterIndex = -1, textArr = node.dataset.jsTyping.split(",");
        typingUpdateText(node, textArr, text, currentTextIndex, letterIndex);
    });
    function typingAddLetter(textAnimated, textArr, text, currentTextIndex, letterIndex) {
        letterIndex++;
        if (letterIndex < text.length) {
            setTimeout(function() {
                textAnimated.textContent += text[letterIndex];
                typingAddLetter(textAnimated, textArr, text, currentTextIndex, letterIndex);
            }, 100);
        } else {
            setTimeout(function() {
                typingRemoveLetter(textAnimated, textArr, text, currentTextIndex, letterIndex);
            }, 2e3);
        }
    }
    function typingRemoveLetter(textAnimated, textArr, text, currentTextIndex, letterIndex) {
        letterIndex--;
        if (letterIndex >= 0) {
            setTimeout(function() {
                textAnimated.textContent = text.slice(0, letterIndex);
                typingRemoveLetter(textAnimated, textArr, text, currentTextIndex, letterIndex);
            }, 100);
        } else {
            typingUpdateText(textAnimated, textArr, text, currentTextIndex, letterIndex);
        }
    }
    function typingUpdateText(textAnimated, textArr, text, currentTextIndex, letterIndex) {
        currentTextIndex++;
        if (currentTextIndex === textArr.length) {
            currentTextIndex = 0;
        }
        text = textArr[currentTextIndex];
        typingAddLetter(textAnimated, textArr, text, currentTextIndex, letterIndex);
    }
    document.querySelectorAll("[data-map]").forEach(node => {
        node.addEventListener("map.init", e => {
            if (node.classList.contains("is-map")) return;
            node.classList.add("is-map");
            let view = node.dataset.mapSetView.split(","), zoom = node.dataset.mapZoom, token = node.dataset.mapAccessToken, json = node.dataset.mapJson;
            let mymap = L.map(node.id).setView(view, zoom);
            L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: "mapbox/streets-v11",
                tileSize: 512,
                zoomOffset: -1,
                accessToken: token
            }).addTo(mymap);
            fetch(json).then(response => response.json()).then(data => {
                L.geoJSON(data, {
                    pointToLayer: function(feature, latlng) {
                        let myIcon = L.divIcon({
                            iconSize: new L.Point(25, 25),
                            className: "my-div-icon",
                            html: '<span class="leaflet-marker rounded py-1 px-2 shadow-sm d-block position-absolute start-50 bottom-100 translate-middle-x fw-bold">' + feature.properties.price + "</span>"
                        });
                        return L.marker(latlng, {
                            icon: myIcon
                        });
                    },
                    onEachFeature: function(feature, layer) {
                        if (feature.properties && feature.properties.popupContent) {
                            let marker = layer.bindPopup(feature.properties.popupContent), link = document.querySelector('[data-map-focus="' + feature.properties.id + '"]'), property = document.querySelector("#" + feature.properties.id + '[data-map-marker="focus"]');
                            if (isElExists(link)) {
                                link.addEventListener("click", function(e) {
                                    e.preventDefault();
                                    marker.openPopup(marker.getLatLng(), 13);
                                    mymap.panTo(marker.getLatLng());
                                });
                            }
                            if (isElExists(property)) {
                                property.addEventListener("scroll.focus", function(e) {
                                    marker.openPopup(marker.getLatLng(), 13);
                                    mymap.panTo(marker.getLatLng());
                                });
                            }
                            if (feature.properties.openPopup && feature.properties.openPopup == true) {
                                setTimeout(function() {
                                    marker.openPopup(marker.getLatLng(), 13);
                                }, 1e3);
                            }
                        }
                    }
                }).addTo(mymap);
            });
        });
        if (node.hasAttribute("data-map-init") && node.dataset.mapInit == "auto") node.dispatchEvent(new Event("map.init"));
    });
    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(node => {
        node.addEventListener("shown.bs.tab", e => {
            document.querySelectorAll(node.dataset.bsTarget + ' [data-map-init="tab"]:not(.is-map)').forEach(map => {
                map.dispatchEvent(new Event("map.init"));
            });
        });
    });
    var scrollStopTimeout;
    var resizeStopTimeout;
    let lastKnownScrollY = 0;
    let ticking = false;
    let scrollDirection = "";
    let spyScrolls = document.querySelectorAll('[data-spy="scroll"]');
    document.addEventListener("scroll", function(e) {
        scrollDirection = lastKnownScrollY < window.scrollY ? "down" : "up";
        lastKnownScrollY = window.scrollY;
        if (!ticking) {
            window.clearTimeout(scrollStopTimeout);
            window.requestAnimationFrame(function() {
                let body = document.body;
                body.classList.add("scrolling");
                body.classList.remove("scrolled");
                let spyScrollEvent = new Event("spy.scroll");
                spyScrollEvent.scrollTop = lastKnownScrollY;
                spyScrollEvent.scrollDirection = scrollDirection;
                spyScrolls.forEach(node => {
                    node.dispatchEvent(spyScrollEvent);
                });
                window.dispatchEvent(spyScrollEvent);
                if (scrollDirection == "up") {
                    body.classList.add("scroll-up");
                    body.classList.remove("scroll-down");
                } else {
                    body.classList.remove("scroll-up");
                    body.classList.add("scroll-down");
                }
                scrollStopTimeout = window.setTimeout(function() {
                    body.classList.add("scrolled");
                    body.classList.remove("scrolling");
                }, 100);
                ticking = false;
            });
            ticking = true;
        }
    });
    window.addEventListener("resize", function(e) {
        if (!ticking) {
            window.clearTimeout(resizeStopTimeout);
            window.requestAnimationFrame(function() {
                resizeStopTimeout = window.setTimeout(function() {
                    let spyScrollEvent = new Event("spy.scroll");
                    spyScrollEvent.scrollTop = lastKnownScrollY;
                    spyScrollEvent.scrollDirection = scrollDirection;
                    spyScrolls.forEach(node => {
                        node.dispatchEvent(spyScrollEvent);
                    });
                    window.dispatchEvent(spyScrollEvent);
                }, 100);
                ticking = false;
            });
            ticking = true;
        }
    });
    window.dispatchEvent(new Event("resize"));
    document.querySelectorAll('[data-spy="scroll"][data-scroll="focus"]').forEach(node => {
        node.addEventListener("spy.scroll", function(e) {
            let lastchildRectTop = 0, groupChildrenByRow = [], allChildrenRowGroup = [], children = this.children;
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                let childRectTop = child.getBoundingClientRect().y;
                if (lastchildRectTop == 0 || lastchildRectTop == childRectTop) {
                    groupChildrenByRow.push(child);
                } else {
                    allChildrenRowGroup.push(groupChildrenByRow);
                    groupChildrenByRow = [ child ];
                }
                lastchildRectTop = childRectTop;
            }
            allChildrenRowGroup.push(groupChildrenByRow);
            for (let i = 0; i < allChildrenRowGroup.length; i++) {
                groupChildrenByRow = allChildrenRowGroup[i];
                child = groupChildrenByRow[0];
                childRectTop = child.getBoundingClientRect().y - 100;
                let childHeight = child.getBoundingClientRect().bottom - childRectTop;
                let viewportFocusRange = vh - childHeight - 200;
                let childFocusRange = viewportFocusRange - childRectTop;
                if (isInViewport(child) && childFocusRange >= 0 && childFocusRange <= viewportFocusRange) {
                    for (let ii = 0; ii < groupChildrenByRow.length; ii++) {
                        if (viewportFocusRange / groupChildrenByRow.length * (ii + 1) >= childFocusRange) {
                            document.querySelectorAll('[data-spy="scroll"] > *').forEach(v => v.classList.remove("scroll-focus"));
                            groupChildrenByRow[ii].classList.add("scroll-focus");
                            groupChildrenByRow[ii].dispatchEvent(new Event("scroll.focus"));
                            break;
                        }
                    }
                    break;
                }
            }
        });
    });
    window.addEventListener("spy.scroll", e => {
        let totalHeight = 0;
        document.querySelectorAll('[data-spy="scroll"][data-scroll="sticky"]').forEach(node => {
            if (node.classList.contains("sticky") == false) {
                let newStickyPlaceholder = document.createElement("div");
                insertAfter(newStickyPlaceholder, node);
                newStickyPlaceholder.classList.add("sticky-placeholder");
                node.classList.add("sticky");
            }
            let isSticky = false, isStickyHide = node.hasAttribute("data-sticky-hide") && node.dataset.stickyHide == "true" ? true : false, stickyElHeight = parseInt(outerHeight(node)), stickyPlaceholder = node.nextSibling;
            stickyPlaceholder.setAttribute("style", "height:" + stickyElHeight + "px; margin-top: -" + stickyElHeight + "px");
            stickyPlaceholder.style.height = stickyElHeight + "px";
            stickyPlaceholder.style.marginTop = "-" + stickyElHeight + "px";
            boundingTop = parseInt(stickyPlaceholder.getBoundingClientRect().top);
            if (boundingTop - totalHeight < 0) {
                isSticky = true;
                node.classList.add("is-sticky");
                if (isStickyHide && isSticky && e.scrollDirection == "down") {
                    let stickyExludeHeight = 0;
                    for (let i = 0; i < node.children.length; i++) if (node.children[i].hasAttribute("data-sticky-hide-exclude")) stickyExludeHeight = stickyExludeHeight + parseInt(outerHeight(node.children[i]));
                    totalHeight = totalHeight - (stickyElHeight - stickyExludeHeight);
                }
                node.setAttribute("style", "top: " + totalHeight + "px");
                node.style.top = totalHeight;
                totalHeight = totalHeight + stickyElHeight;
            } else {
                node.classList.remove("is-sticky");
                node.setAttribute("style", "top: 0");
                node.style.top = 0;
            }
            if (node.hasAttribute("data-switch-class")) {
                let switchClassEvent = new Event("switch.class");
                switchClassEvent.switch = isSticky ? 1 : 0;
                node.dispatchEvent(switchClassEvent);
            }
        });
    });
    document.querySelectorAll("[data-switch-class]").forEach(node => {
        node.addEventListener("switch.class", e => {
            let switchClasses = node.dataset.switchClass.split("||");
            switchClasses.forEach(switchClass => {
                let classnames = switchClass.split("|");
                node.classList.add(classnames[e.switch]);
                node.classList.remove(classnames[e.switch == 0 ? 1 : 0]);
            });
        });
    });
})();

(function() {
    const easeOutQuad = t => t * (2 - t);
    const animateCountUp = el => {
        const animationDuration = el.dataset.countupDuration;
        const frameDuration = 1e3 / 60;
        const totalFrames = Math.round(animationDuration / frameDuration);
        let frame = 0;
        const countTo = parseInt(el.innerHTML, 10);
        const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const currentCount = Math.round(countTo * progress);
            if (parseInt(el.innerHTML, 10) !== currentCount) {
                el.innerHTML = formatMoney(parseInt(currentCount), 0, ".", ".");
            }
            if (frame === totalFrames) {
                clearInterval(counter);
            }
        }, frameDuration);
    };
    const runAnimations = () => {
        const countupEls = document.querySelectorAll("[data-countup]");
        countupEls.forEach(animateCountUp);
    };
    runAnimations();
})();

(function($bs) {
    const CLASS_NAME = "has-child-dropdown-show";
    $bs.Dropdown.prototype.toggle = function(_orginal) {
        return function() {
            document.querySelectorAll("." + CLASS_NAME).forEach(function(e) {
                e.classList.remove(CLASS_NAME);
            });
            let dd = this._element.closest(".dropdown");
            dd = isElExists(dd) ? dd.parentNode.closest(".dropdown") : false;
            if (dd && isElExists(dd)) {
                for (;dd && dd !== document; dd = dd.parentNode.closest(".dropdown")) {
                    dd.classList.add(CLASS_NAME);
                }
            }
            return _orginal.call(this);
        };
    }($bs.Dropdown.prototype.toggle);
    document.querySelectorAll(".dropdown").forEach(function(dd) {
        dd.addEventListener("hide.bs.dropdown", function(e) {
            if (this.classList.contains(CLASS_NAME)) {
                this.classList.remove(CLASS_NAME);
                e.preventDefault();
            }
            if (e.clickEvent && e.clickEvent.composedPath().some(el => el.classList && el.classList.contains("dropdown-toggle"))) {
                e.preventDefault();
            }
            e.stopPropagation();
        });
    });
    function getDropdown(element) {
        return $bs.Dropdown.getInstance(element) || new $bs.Dropdown(element);
    }
})(bootstrap);