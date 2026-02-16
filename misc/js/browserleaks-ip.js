!function () {
  var t, e, f = {}, u = (n = _el("#client-ipv4")).dataset.ip, n = (f[u] = n.dataset.iso_code, _el("#tor-table")), a = _el("#whois-ip");
  function s(e) {
    var o, s, i = _el(e);
    i && (i.className = "dot pointer", o = !(i.title = "Convert to DMS"), s = false, i.addEventListener("click", function () {
      var e, t, n, a = i.parentElement.nextElementSibling;
      function r(e, t) {
        var n = Math.abs(e), a = 60 * (n - ~~n), e = 0 <= e ? t ? "N" : "E" : t ? "S" : "W";
        return ~~n + "°" + ~~a + "'" + +(60 * (a - ~~a)).toFixed(1) + '"' + e;
      }
      o || (o = a.textContent, s = o.split(","), n = parseFloat(s[0]), e = parseFloat(s[1]), s = r(n, 1) + " " + r(e)), o && (n = -1 !== a.textContent.indexOf(",") ? (t = "Decimal", s) : (t = "DMS", o), a.textContent = n, this.setAttribute("title", "Convert to " + t));
    }));
  }
  s("#coords-click"), (e = _el("#hostname")) && (e.classList.add("load-td"), fetch("/api/hostname/" + u).then(function (e) {
    return e.json();
  }).then(function (e) {
    e.hostname && (t = '<a href="/ip/' + e.hostname + '" title="Get IP Address Details">' + e.hostname + "</a>");
  }).finally(function () {
    t = t || "n/a", e.innerHTML = t, e.classList.remove("load-td");
  }));
  var i = _el("#client-ipv6"), R = (i.classList.add("load-td"), fetch(n ? "https://ipv6.browserleaks.com/api/full" : "https://[2604:a880:800:10::e6:b001]/api/full", {cache: "no-store"}).then(function (e) {
    return e.json();
  }).then(function (e) {
    var t, n, a = "", r = e.iso_code || "unknown", o = '<span class="more-inline">' + flagBox(r, e.ip, true) + "</span>";
    for (t in f[e.ip] = r, e) "ip" != t && "iso_code" != t && (a += "<tr><td>" + ("Coordinates" !== t ? t : '<span id="coords-ipv6" class="dot pointer" title="Convert to DMS">' + t + "</span>") + "</td><td>" + e[t] + "</td></tr>");
    a.length && (i.classList.add("more"), o = '<div class="more-container">' + o + '<input data-html2canvas-ignore class="more-button" type="submit" value="more"></div>'), i.innerHTML = o, a.length && (n = _el("#ipv6-tbody"), r = _el(".more-button", i), n.innerHTML = a, s("#coords-ipv6"), r.addEventListener("click", function () {
      "more" == this.value ? (Cookies.set("bl_ipv6_more", 1), this.value = "less", n.classList.remove("n")) : (Cookies.remove("bl_ipv6_more"), this.value = "more", n.classList.add("n"));
    }), r.value = Cookies.get("bl_ipv6_more") ? "less" : "more", n.className = Cookies.get("bl_ipv6_more") ? "" : "n");
  }).catch(function (e) {
    i.textContent = "n/a";
  }).finally(function () {
    i.classList.remove("load-td");
  }), ["0.0.0.0/8", "10.0.0.0/8", "100.64.0.0/10", "127.0.0.0/8", "169.254.0.0/16", "172.16.0.0/12", "192.0.0.0/24", "192.0.2.0/24", "192.31.196.0/24", "192.52.193.0/24", "192.88.99.0/24", "192.168.0.0/16", "192.175.48.0/24", "198.18.0.0/15", "198.51.100.0/24", "203.0.113.0/24", "224.0.0.0/4", "240.0.0.0/4"]), D = ["2620:4f:8000::/48", "2001:db8::/32", "2001::/23", "3fff::/20", "2002::/16", "3ffe::/16", "3ffc::/15", "3ff8::/14", "3ff0::/13", "3fe0::/12", "3fc0::/11", "3f80::/10", "fe80::/10", "fec0::/10", "3f00::/9", "fe00::/9", "::/8", "100::/8", "2d00::/8", "3e00::/8", "ff00::/8", "200::/7", "2e00::/7", "3c00::/7", "fc00::/7", "400::/6", "3800::/6", "f800::/6", "800::/5", "3000::/5", "f000::/5", "1000::/4", "e000::/4", "4000::/3", "6000::/3", "8000::/3", "a000::/3", "c000::/3"], p = {local: [], public: []}, h = _el("#rtc-local"), v = _el("#rtc-public");
  function g(e) {
    var t = "v=0\r\n";
    return e.substring(0, t.length) !== t ? t + e : e;
  }
  function b(e, t) {
    var n, t = _el("#" + t);
    2 == e.length ? (n = countryNames(e), t.title = n ? n + " (" + e + ")" : e, t.alt = e) : t.title = e.charAt(0).toUpperCase() + e.slice(1), t.src = "/img/flags/" + e + ".png";
  }
  function C(e) {
    function r(e, t) {
      return e.length < t ? r("0" + e, t) : e;
    }
    function t(e) {
      var t, n, a = "";
      if (-1 < e.indexOf(":")) for (t = e.split(":"), n = 0; n < t.length; n++) a += r(parseInt(t[n], 16).toString(2), 16); else for (t = e.split("."), n = 0; n < t.length; n++) a += r(parseInt(t[n], 10).toString(2), 8);
      return a;
    }
    for (var n = t(e), a = -1 < e.indexOf(":") ? D : R, o = 0, s = a.length; o < s; o++) {
      var i = a[o].split("/"), l = t(i[0]);
      if (n.substring(0, i[1]) === l.substring(0, i[1])) return 1;
    }
  }
  if (h.parentElement.classList.add("load-td"), v.parentElement.classList.add("load-td"), new Promise(function (e, t) {
    var n = function (e) {
      for (var t in e) {
        e[t] = function (e) {
          for (var t = [], n = [], a = 0; a < e.length; a++) -1 !== e[a].indexOf(".") ? t.push(e[a]) : -1 !== e[a].indexOf(":") && n.push(e[a]);
          return t.concat(n);
        }(e[t]);
        var n = "local" == t ? h : v;
        if (e[t].length) for (var a in 1 < e[t].length && n.classList.add("flag-multi"), e[t]) {
          var r, a = e[t][a];
          "local" == t ? n.insertAdjacentHTML("beforeend", flagBox("local", a, true)) : (r = "ip-" + a.replace(/[\.\:\%]/g, "-"), n.insertAdjacentHTML("beforeend", flagBox(false, a, a !== u, ' id="' + r + '"')), function (t, e) {
            var n;
            f[t] ? b(f[t], e) : fetch("/api/iso_code/" + t).then(function (e) {
              return e.json();
            }).then(function (e) {
              n = e.iso_code || "unknown", f[t] = n;
            }).catch(function (e) {}).finally(function () {
              b(n || "unknown", e);
            });
          }(a, r));
        } else n.textContent = "n/a";
      }
    }, a = e, r = t, o = [], s = function (e, t) {
      for (var n, a, r = ["", "webkit", "moz", "ms"], o = "RTCPeerConnection", s = 0; s < r.length; s++) if (n = (n = window[r[s] + o]) || (a = a || _el("#rtc-iframe")).contentWindow[r[s] + o]) return new n(e, t);
      return false;
    }({iceServers: [{urls: [e = "stun:stun.l.google.com:19302"], url: e}]}, {optional: [{RtpDataChannels: true}]});
    if (s && "function" == typeof s.createOffer) {
      "function" == typeof s.createDataChannel && s.createDataChannel("bl"), s.addEventListener("icecandidate", c);
      try {
        s.createOffer({offerToReceiveAudio: 1, offerToReceiveVideo: 1}).then(function (e) {
          if (!(e && e.sdp && !(e.sdp.length < 10))) throw null;
          e.sdp = g(e.sdp), s.setLocalDescription(e);
        }).catch(function () {
          s.createOffer().then(function (e) {
            if (!(e && e.sdp && !(e.sdp.length < 10))) throw null;
            e.sdp = g(e.sdp), s.setLocalDescription(e);
          }).catch(function () {
            return r();
          });
        });
      } catch (e) {
        s.createOffer(function (e) {
          if (!(e && e.sdp && !(e.sdp.length < 10))) return r();
          s.setLocalDescription(e, function () {}, function () {});
        }, function (e) {
          return r();
        });
      }
      var i = 0, l = setInterval(function () {
        var e, t = false, n = s.localDescription;
        (e = n && n.sdp && !(n.sdp.length < 10) ? n.sdp.split("\n") : e) && e.forEach(function (e) {
          -1 !== e.indexOf("candidate:") && (e = !(null === (e = /([0-9]{1,3}(\.[0-9]{1,3}){3}|(([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))/.exec(e)) || !e[1]) && e[1]) && (C(e) || (t = true), o.indexOf(e) < 0) && o.push(e);
        }), i++, (t || 15 <= i) && d();
      }, 1e3);
    } else r();
    function c(e) {
      var t;
      e.candidate && e.candidate.candidate && (t = !(null === (e.candidate.candidate = /([0-9]{1,3}(\.[0-9]{1,3}){3}|(([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))/.exec(e.candidate.candidate)) || !e.candidate.candidate[1]) && e.candidate.candidate[1]) && o.indexOf(t) < 0 && o.push(t), null == e.candidate && d();
    }
    function d() {
      s.removeEventListener("icecandidate", c), clearInterval(l), o.forEach(function (e) {
        var t = C(e) ? "local" : "public";
        -1 === p[t].indexOf(e) && p[t].push(e);
      }), s.close(), n(p), a();
    }
  }).catch(function () {
    [h, v].forEach(function (e) {
      e && (e.textContent = "n/a");
    });
  }).finally(function () {
    h.parentElement.classList.remove("load-td"), v.parentElement.classList.remove("load-td");
  }), window.addEventListener("resize", M), undefined !== window.matchMedia) {
    var _ = window.matchMedia("(max-width:740px)");
    try {
      _.addEventListener("change", z);
    } catch (e) {
      _.addListener(z);
    }
  }
  var l, c, B = 4, w = {}, F = [], U = [], x = 0, k = 0, E = 0, A = true, O = _el("#dns-test");
  function d(e, t, n) {
    e = _el(e), 1 < t ? (e.style.cursor = "pointer", e.title = "Sort by " + n) : e.style.cursor = "initial";
  }
  function z() {
    _els(".dns-table-in tr").forEach(function (e) {
      var t = _el(".dns-col-isp", e), e = _el(".dns-col-ip", e);
      _.matches ? t.insertAdjacentElement("afterend", e) : e.insertAdjacentElement("afterend", t);
    }), M();
  }
  function M() {
    for (var e, t, n = 1; n < 4; n++) e = _el(".dns-th:nth-child(" + n + ")"), t = _el(".dns-td:nth-child(" + n + ")"), e && t && e.style.setProperty("width", window.getComputedStyle(t).width, "important"), e && window.matchMedia("(max-width:740px)").matches && e.classList.contains("dns-col-ip") && e.style.setProperty("width", "100%", "important");
  }
  function V(e) {
    var t, n = function (e) {
      for (var t, n, a = [], r = [], o = 0; o < e.length; o++) {
        var s = e[o];
        if (-1 === s.indexOf(":")) {
          for (t = s.split("."), n = 0; n < t.length; n++) t[n] = parseInt(t[n]);
          a.push({o: s, p: t});
        } else {
          for (t = s.split(":"), n = 0; n < t.length; n++) t[n] = 0 < t[n].length ? parseInt(t[n], 16) : 0;
          r.push({o: s, p: t});
        }
      }
      function i(e, t) {
        for (var n = 0; n < e.p.length; n++) if (e.p[n] !== t.p[n]) return e.p[n] - t.p[n];
        return 0;
      }
      a.sort(i), r.sort(i);
      for (var l = [], o = 0; o < a.length; o++) l.push(a[o].o);
      for (o = 0; o < r.length; o++) l.push(r[o].o);
      return l;
    }(Object.keys(e)), a = {}, r = {};
    for (t in n) -1 !== n[t].indexOf(":") ? r[n[t]] = e[n[t]] : a[n[t]] = e[n[t]];
    if ("function" == typeof Object.assign) return Object.assign(a, r);
    var o, s = {};
    for (o in a) s[o] = a[o];
    for (o in r) s[o] = r[o];
    return s;
  }
  function I(e) {
    return Object.keys(e).length;
  }
  _el("#dns-run").addEventListener("click", function () {
    O.className = "load-td", O.style.paddingLeft = "140px", O.innerHTML = "";
    for (var n = [], e = 0; e < 30; e++) n[e] = function () {
      var e = "abcdefghijkmnopqrstuvwyz0123456789", t = "";
      if (window.crypto && window.crypto.getRandomValues) {
        var n = new Uint8Array(12);
        window.crypto.getRandomValues(n);
        for (var a = 0; a < 12; a++) t += e[n[a] % e.length];
      } else for (a = 0; a < 12; a++) t += e[Math.floor(Math.random() * e.length)];
      return t;
    }() + ".dns" + (e % 2 == 0 ? "4" : "6");
    var t = Array.from({length: 10}, function f() {
      var e, t;
      return 0 < n.length ? (e = n.shift(), t = 0 < B ? "net" : "org", B--, fetch("https://" + e + ".browserleaks." + t).then(function (e) {
        return e.json();
      }).then(function (e) {
        if (e = function (e) {
          var t, n = {};
          for (t in e) "error" == t || w[t] || (w[t] = e[t], n[t] = e[t]);
          return 0 < I(n) && n;
        }(e)) {
          var t, n, a, r, o, s = Object.keys(V(w)), i = V(e), l = (x = I(w), A && (e = '<td class="dns-th dns-th-isp dns-col-isp br" data-sort>ISP :</td>', n = '<td class="dns-th dns-th-ip dns-col-ip br" data-sort="data-number">IP Address :</td>', t = '<tbody class="dns-tbody-before"><tr>', _.matches ? t += e + n : t += n + e, t += '<td class="dns-th dns-th-location n-740" data-sort>Location :</td></tr></tbody><tbody id="dns-list"></tbody>', (n = _el("#dns-container")).classList.add("td-out"), n.innerHTML = '<table class="dns-table-in">' + t + "</table>", n.parentElement.classList.remove("n")), _el("#dns-list")), c = (12 < x && (l.classList.add("vertical-scroll"), l.classList.add("webkit-scroll"), l.classList.add("dns-scroll")), ""), d = window.matchMedia("(max-width:740px)");
          for (a in i) F[i[a][2]] = 1, U[i[a][1]] = 1, o = a == u ? flagBox(i[a][0], a, false, false, true) : flagBox(i[a][0], a, true), c = '<tr class="dns-' + a.replace(/[:.]/g, "-") + '">', o = '<td class="dns-td dns-col-ip br">' + o + "</td>", r = '<td class="dns-td dns-col-isp br wball">' + i[a][2] + "</td>", d.matches ? c += r + o : c += o + r, c = c + ('<td class="dns-td n-740 wball">' + i[a][1]) + "</td></tr>", A ? l.insertAdjacentHTML("beforeend", c) : (o = s.indexOf(a), (r = s[o - 1]) ? _el(".dns-" + r.replace(/[:.]/g, "-")).insertAdjacentHTML("afterend", c) : l.insertAdjacentHTML("afterbegin", c));
          k = I(F), E = I(U), e = "Found " + x + " Server" + (1 < x ? "s" : "") + ", " + k + " ISP, " + E + " Location" + (1 < E ? "s" : ""), O.textContent = e, _els("#dns-list tr td:first-child").forEach(function (e) {
            var t = e.textContent.trim();
            -1 < (t = s.indexOf(t)) && e.setAttribute("data-sort-value", t);
          }), M(), A = false;
        }
        return f();
      }).catch(function (e) {
        return f();
      })) : Promise.resolve();
    });
    Promise.all(t).then(function () {
      if (O.classList.remove("load-td"), O.style.paddingLeft = "", !(0 < Object.keys(w).length)) throw new Error;
      function r(e, t, n, a) {
        for (var r = e.rows, o = _els("td", r[0]), s = (null == a && (a = "asc" === o[t].dataset.sortActive ? "desc" : "asc"), "data" === n.substring(0, 4)), i = "number" === n.slice(-6), l = [], c = 1; c < r.length; c++) {
          var d = _els("td", r[c])[t], d = s ? d.dataset.sortValue : d.innerText.trim().toLowerCase();
          i && (d = parseFloat(d) || 0), l.push({value: d, row: r[c]});
        }
        for (l.sort(function (e, t) {
          return e = i ? e.value - t.value : ("" + e.value).localeCompare("" + t.value), "desc" === a ? e : -e;
        }), l.forEach(function (e) {
          e.row.parentNode.insertBefore(e.row, r[0].nextSibling);
        }), c = 0; c < o.length; c++) o[c].dataset.sortActive = undefined;
        o[t].dataset.sortActive = a;
      }
      var o;
      d(".dns-th-ip", x, "IP"), d(".dns-th-isp", k, "ISP"), d(".dns-th-location", E, "Location"), o = _el(".dns-table-in"), _els("[data-sort]", o).forEach(function (t, n) {
        var a = t.dataset.sort, e = t.dataset.sortAuto;
        t.onclick = function (e) {
          e.target === t && r(o, n, a);
        }, e && r(o, n, a, e);
      });
    }).catch(function () {
      O.textContent = "Test Error";
    });
  }), _el("#headers-swap").addEventListener("click", function () {
    var e, t, n, a, r = _el("#headers");
    if (Cookies.get("bl_headers_raw")) if (Cookies.remove("bl_headers_raw"), this.textContent = "raw headers", l = l || r.cloneNode(true), c) r.innerHTML = c.innerHTML; else {
      var o = _els("span", r);
      r.innerHTML = "";
      for (var s = 0; s < o.length; s++) e = document.createElement("tr"), t = document.createElement("td"), n = document.createElement("td"), 0 == s ? (t.textContent = "Request", n.textContent = o[0].textContent) : (t.textContent = o[s].dataset.parsed || o[s].textContent, o[s].dataset.badheader && (t.className = "badheader cursor-help", t.title = "Bad Header"), n.textContent = o[++s].textContent), e.appendChild(t), e.appendChild(n), r.appendChild(e);
    } else Cookies.set("bl_headers_raw", 1), this.textContent = "parsed headers", c = c || r.cloneNode(true), l ? r.innerHTML = l.innerHTML : (a = "", _els("td", r).forEach(function (e, t) {
      0 != t && (a += t % 2 == 0 ? "\n" + (r.dataset.hpack ? e.textContent.toLowerCase() : e.textContent) + ": " : e.textContent);
    }), e = document.createElement("tr"), t = document.createElement("td"), n = document.createElement("td"), t.textContent = "Raw Headers", t.className = "n-640", n.innerText = a, n.colSpan = 2, e.appendChild(t), e.appendChild(n), r.innerHTML = "", r.appendChild(e));
  });
  var r, o, j = _el(".map-warn");
  function Z() {
    var e = document.createElement("button");
    e.id = "map-button", e.textContent = "Show Map", j.appendChild(e), e.addEventListener("click", H);
  }
  function H() {
    Promise.all([new Promise(function (e, t) {
      var n = document.createElement("link");
      n.rel = "stylesheet", n.href = "/css/leaflet.css?v=63246769", n.onload = function () {
        e();
      }, n.onerror = function () {
        t(new Error("CSS failed to load."));
      }, document.head.appendChild(n);
    }), new Promise(function (e, t) {
      var n = document.createElement("script");
      n.src = "/js/leaflet.js?v=63246769", n.onload = function () {
        e();
      }, n.onerror = function () {
        t(new Error("Script failed to load."));
      }, document.body.appendChild(n);
    })]).then(function () {
      return Promise.resolve();
    }).then(function () {
      var e, t;
      _el("#map-td").parentElement.classList.remove("n"), _el(".map-warn").classList.add("n"), e = L.map("map-canvas", {scrollWheelZoom: false, fadeAnimation: "boolean" != typeof mapNamespace.onload}).setView([r.dataset.lat, r.dataset.lon], 5), L.Icon.Default.imagePath = "/img/leaflet/", L.tileLayer("https://cartodb-basemaps-{s}.freetls.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png", {subdomains: "a", attribution: Cookies.get("bl_attr") ? "" : '&copy; <a href="https://www.openstreetmap.org/copyright" rel="nofollow noopener" target="_blank">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution/" rel="nofollow noopener" target="_blank">CARTO</a>'}).addTo(e).on("load", function () {
        mapNamespace.onload = true;
      }), e.attributionControl.setPrefix(""), e.addControl(new L.Control.Fullscreen), t = L.popup({autoClose: false, closeOnClick: false, closeButton: false, maxWidth: "auto"}).setContent(flagBox(f[u], u)), L.marker([r.dataset.lat, r.dataset.lon]).addTo(e).bindPopup(t).openPopup(), e.on("fullscreenchange contextmenu zoomanim click dblclick rightclick drag", function () {
        e.scrollWheelZoom.enabled() || e.scrollWheelZoom.enable();
      }), e.on("mouseout", function () {
        e.scrollWheelZoom.enabled() && e.scrollWheelZoom.disable();
      }), e.on("fullscreenchange", function () {
        e.isFullscreen() || (t.isOpen() || t.openOn(), e.setView([r.dataset.lat, r.dataset.lon], 5));
      });
    }).catch(function (e) {});
  }
  function G(e) {
    var t = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"};
    return e.replace(/[&<>"']/g, function (e) {
      return t[e];
    });
  }
  function q(e, t) {
    var n, a, r, o, s, i, l, c, d, f, u, p;
    for (a in e) if ("port43" == a) {
      var h = false;
      e.port43.match(/.*arin.*/) ? h = "ARIN" : e.port43.match(/.*apnic.*/) ? h = "APNIC" : e.port43.match(/.*ripe.*/) ? h = "RIPE NCC" : e.port43.match(/.*afrinic.*/) ? h = "AFRINIC" : e.port43.match(/.*lacnic.*/) && (h = "LACNIC"), h && (t.sourceRegistry = h);
    } else if ("startAddress" == a || "endAddress" == a) t.netRange || (t.netRange = e.startAddress + " - " + e.endAddress); else if ("events" == a) for (n in e.events) t[e.events[n].eventAction] = (f = e.events[n].eventDate, u = e.events[n].eventActor, p = "", f && (p += new Date(Date.parse(f)).toUTCString()), (p = u ? p + " by " + u : p).trim()); else if ("roles" == a) t[a] = e[a].join(", "); else if ("remarks" == a) for (s in e.remarks) {
      for (var v in o = "", e.remarks[s].description) (v = e.remarks[s].description[v]).length && !v.match(/^[\*=-]{8,}$/) && (o.length && (o += "\n"), o += v.trim());
      (r = e.remarks[s].title) ? "Remark" == r && (r = "remarks") : r = "description", t[r] && (o = t[r] + "\n" + o), t[r] = o;
    } else if ("vcardArray" == a) for (n in e.vcardArray[1]) {
      switch (i = e.vcardArray[1][n][0]) {
        case "org":
          t[i] = e.vcardArray[1][n][3];
          break;
        case "tel":
        case "email":
          var m = e.vcardArray[1][n][3];
          t[i] || (t[i] = ""), -1 == t[i].indexOf(m) && (t[i].length && (m = "\n" + m), t[i] += m);
          break;
        case "adr":
          e.vcardArray[1][n][1].label ? t[i] = e.vcardArray[1][n][1].label : t[i] = e.vcardArray[1][n][3].join("\n").trim();
          break;
        case "lang":
          m = e.vcardArray[1][n][3], t[i] && (m = t[i] + ", " + m), t[i] = m;
          break;
        default:
          t[i] = e.vcardArray[1][n][3];
      }
      t[i] && (t[i] = (c = t[i], d = undefined, (d = document.createElement("textarea")).innerHTML = c, d.value));
    } else if ("cidr0_cidrs" == a) {
      if (e.cidr0_cidrs) {
        var g = "";
        for (n in e.cidr0_cidrs) 0 < n && (g += "\n"), g += e.cidr0_cidrs[n][Object.keys(e.cidr0_cidrs[n])[0]] + "/" + e.cidr0_cidrs[n].length;
        g.length && (t[a] = g);
      }
    } else if ("publicIds" == a) {
      var b = "";
      for (n in e.publicIds) e.publicIds[0].type && e.publicIds[0].identifier && (b.length && (b += "\n"), b = e.publicIds[0].type + ": " + e.publicIds[0].identifier);
      b.length && (t[a] = b);
    } else "arin_originas0_originautnums" == a || "originAutnum" == a || "nicbr_autnum" == a ? (h = false, "object" == typeof e[a] && e[a][0] ? h = e[a][0] : ("number" == typeof e[a] || "string" == typeof e[a] && e[a].length && "N/A" !== e[a].toUpperCase()) && (h = e[a]), h && (t.asn = "AS" + h)) : "country" == a ? (l = countryNames(e[a]), t[a] = l ? flagBox(e[a], l) : G(e[a])) : "string" == typeof e[a] && (t[a] = e[a]);
  }
  function $(e, t, n) {
    return undefined === n && (n = {Accept: "application/rdap+json"}), fetchTM(e, {headers: n}, 2e4).then(function (e) {
      return e.json();
    }).then(function (e) {
      if (!(e = function (a) {
        var e = [], t = (q(a, e[0] = []), function () {
          var e = function e(t) {
            var n = "entities", a = [];
            if (t) if (t instanceof Array) for (var r in t) a = a.concat(e(t[r])); else if (t[n] && a.push(t[n]), "object" == typeof t && null !== t) {
              var o = Object.keys(t);
              if (0 < o.length) for (r = 0; r < o.length; r++) a = a.concat(e(t[o[r]]));
            }
            return a;
          }(a), t = false;
          if (e.length) for (var t = e[0], n = 1; n < e.length; n++) t = t.concat(e[n]);
          return t || e;
        }());
        if (t) for (var n in t) q(t[n], e[parseInt(n) + 1] = []);
        for (var o = [["sourceRegistry", "Source Registry"], ["netRange", "Net Range"], ["startAddress", "Start Address"], ["endAddress", "End Address"], ["cidr0_cidrs", "CIDR"], ["fn", "Full Name", 1], ["name", "Name", 1], ["handle", "Handle", 1], ["parentHandle", "Parent Handle"], ["roles", "Entity Roles", 2], ["type", "Net Type", 1], ["asn", "Origin AS"], ["email", "Email"], ["tel", "Telephone"], ["org", "Organization", 1], ["adr", "Address"], ["country", "Country"], ["lang", "Language", 3], ["legalRepresentative", "Legal Representative"], ["registration", "Registration"], ["last changed", "Last Changed"], ["deleted", "Deleted"], ["description", "Description"], ["remarks", "Remarks"], ["Registration Comments", "Comments"], ["Unvalidated POC", "Unvalidated POC"], ["publicIds", "Public IDs"]], r = [], s = 0; s < e.length; s++) !function (a, r) {
          o.forEach(function (e) {
            var t, n = a[e[0]];
            if (n) {
              switch (e[2]) {
                case 1:
                  n = (t = n).charAt(0).toUpperCase() + t.slice(1);
                  break;
                case 2:
                  n = (n + "").replace(/^(.)|\s+(.)/g, function (e) {
                    return e.toUpperCase();
                  });
                  break;
                case 3:
                  n = n.toUpperCase();
              }
              n = (n = "country" !== e[0] ? G(n) : n).replace(/\n/g, "<br>"), r.push([e[1], n]);
            }
          });
        }(e[s], r[s] = []);
        for (var i, l = "", s = 0; s < r.length; s++) if (!(r[s].length <= 2)) {
          for (var c in l += '<table class="wball">', 0 == s && (l += '<tr class="thead"><td colspan="2"><h3>IP Address Whois</h3></td></tr>'), r[s]) l += (i = r[s][c][0], c = r[s][c][1], i && c ? "<tr><td>" + i + "</td><td>" + c + "</td></tr>" : "");
          l += "</table>";
        }
        return !!l.length && l;
      }(e))) throw null;
      t.outerHTML = e;
    }).catch(function (e) {
      throw e;
    });
  }
  j && ((r = _el("#coords-data")) && r.dataset.lat && r.dataset.lon ? Cookies.get("bl_map") ? (j.innerHTML = 'Loading maps has been disabled by <a href="/settings" rel="nofollow" title="Settings">Privacy Settings</a>.', Z(), j.classList.remove("noscript")) : "IntersectionObserver" in window ? (_el("#map-td").parentElement.classList.remove("n"), o = _el("#map-canvas"), new IntersectionObserver(function (e, t) {
    e.forEach(function (e) {
      e.isIntersecting && (H(), t.unobserve(o));
    });
  }, {rootMargin: "300px"}).observe(o)) : (j.innerHTML = "", Z(), j.classList.remove("noscript")) : (j.textContent = "Failed to load the map – not enough data given from GeoIP", j.classList.remove("noscript"))), mapNamespace.run = function () {
    mapNamespace.onload = false, H();
  };
  var S, J, P = _el("tr:nth-child(2) td:nth-child(2)", a), N = (P.classList.add("load-td"), $(a.dataset.source + u, a).catch(function (e) {
    return $("/api/rdap/ip/" + u, a, {rnd: rnd});
  }).catch(function (e) {
    return t = a, fetchTM("/api/whois/" + u, {headers: {rnd: rnd}}, 2e4).then(function (e) {
      if (e.ok) return e.text();
      throw new Error(e.status);
    }).then(function (e) {
      var r;
      e && 16 < e.length && (r = "", e.split("\n").forEach(function (e) {
        r += "<tr>";
        var t, n, a = e.split(/:\s+/);
        2 == a.length ? ("country" == a[0].toLowerCase() && 2 == a[1].length && (t = a[1].toUpperCase(), n = countryNames(t)) && (a[1] = flagBox(t, n)), r += "<td>" + a[0] + "</td><td>" + a[1] + "</td>") : r += '<td colspan="2">' + e + "</td>", r += "</tr>";
      }), t.innerHTML = _el(".thead", t).outerHTML + r);
    }).catch(function (e) {
      throw e;
    });
    var t;
  }).catch(function (e) {
    P.textContent = "No results found", P.classList.remove("load-td");
  }), n && 1 < (n = _els(".tor-click")).length && (S = _els(".tor-relay"), _el("#tor-toggle").classList.remove("n"), n.forEach(function (t) {
    var n = _el("#fp-" + t.textContent);
    t.classList.add("href"), t.title = t.dataset.title, t.addEventListener("click", function (e) {
      e.preventDefault(), n.classList.contains("fp-expand") ? (n.style.display = "none", n.classList.remove("fp-expand"), t.title = "Show") : (n.style.display = "block", n.classList.add("fp-expand"), t.title = "Hide");
    });
  }), _el("#fp-show-all").addEventListener("click", function (e) {
    e.preventDefault(), S.forEach(function (e) {
      e.classList.contains("fp-expand") || (e.style.display = "block", e.classList.add("fp-expand"), e.title = "Hide");
    });
  }), _el("#fp-hide-all").addEventListener("click", function (e) {
    e.preventDefault(), S.forEach(function (e) {
      e.classList.contains("fp-expand") && (e.style.display = "none", e.classList.remove("fp-expand"), e.title = "Show");
    });
  })), {ja3_hash: _el("#ja3-hash"), ja4: _el("#ja4"), akamai_hash: _el("#akamai-hash")});
  for (J in N) N[J].classList.add("load-td");
  fetch("https://tls.browserleaks.com/main?minify=1", {cache: "no-store"}).then(function (e) {
    return e.json();
  }).then(function (e) {
    for (var t in N) null !== e[t] ? (N[t].classList.add("mono"), N[t].textContent = e[t]) : N[t].textContent = "n/a";
  }).catch(function (e) {
    for (var t in N) N[t].textContent = "n/a";
  }).finally(function () {
    for (var e in N) N[e].classList.remove("load-td");
  });
}();
