(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{FJi0:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return l}));var r=a("q1tI"),n=a.n(r),c=a("Kvkj");function l(){return n.a.createElement(c.a,null,n.a.createElement("div",{className:"box"},n.a.createElement("h1",null,"A place to list updates about the project.")))}},Kvkj:function(e,t,a){"use strict";a.d(t,"a",(function(){return u})),a.d(t,"c",(function(){return s})),a.d(t,"b",(function(){return d}));var r=a("q1tI"),n=a.n(r),c=a("Wbzz");function l(){var e=Object(r.useState)(!1),t=e[0],a=e[1];return n.a.createElement("nav",{class:"navbar",role:"navigation","aria-label":"main navigation"},n.a.createElement("div",{class:"navbar-brand"},n.a.createElement(c.a,{to:"/",className:"navbar-item button is-large is-outlined is-primary"},"Offset me!"),n.a.createElement("a",{role:"button",class:"navbar-burger "+(t&&"is-active"),"aria-label":"menu","aria-expanded":t?"false":"true",onClick:function(){return a((function(e){return!e}))}},n.a.createElement("span",{"aria-hidden":"true"}),n.a.createElement("span",{"aria-hidden":"true"}),n.a.createElement("span",{"aria-hidden":"true"}))),n.a.createElement("div",{class:"navbar-menu "+(t&&"is-active")},n.a.createElement("div",{class:"navbar-start"},n.a.createElement(c.a,{to:"/",className:"navbar-item"},"Donate"),n.a.createElement(c.a,{to:"/stats",className:"navbar-item"},"Stats"),n.a.createElement(c.a,{to:"/news",className:"navbar-item"},"News"),n.a.createElement(c.a,{to:"/about",className:"navbar-item"},"About"))))}function i(){return n.a.createElement("footer",{class:"footer"},n.a.createElement("div",{class:"content has-text-centered"},n.a.createElement("p",null,n.a.createElement("strong",null,"Offset me!")," by"," ",n.a.createElement("a",{href:"http://www.suchanek.io"},"Jakub Suchánek")," and"," ",n.a.createElement("a",{href:"https://www.lawrencejb.com"},"Lawrence Berry"),".")))}function u(e){var t=e.children;return n.a.createElement("div",{style:{height:"100vh"},class:"is-flex is-flex-direction-column"},n.a.createElement(l,null),n.a.createElement("div",{class:"section is-flex-grow-1"},n.a.createElement("div",{className:"container is-max-desktop"},t)),n.a.createElement(i,null))}var s=function(e){var t=e.name,a=e.value,r=e.setValue,c=e.max,l=e.unit,i=e.level,u=e.high,s=e.low,o=e.mid;return n.a.createElement("div",{class:"columns is-vcentered"},n.a.createElement("label",{for:"slider",class:"column form-text form-level-"+String(i)},t),n.a.createElement("div",{class:"slider-container"},n.a.createElement("input",{id:"slider",className:"column slider is-circle",type:"range",step:"0.01",min:0,max:c,value:a,onChange:function(e){r(Number(e.target.value))}}),n.a.createElement("div",{className:"slider-marks"},n.a.createElement("span",{className:"slider-mark",style:{marginLeft:String(Number(s)/Number(c)*100)+"%"}},"▶"),n.a.createElement("span",{className:"slider-mark",style:{marginLeft:String((Number(o)-Number(s))/Number(c)*100)+"%"}},"▲"),n.a.createElement("span",{className:"slider-mark",style:{marginLeft:String((Number(u)-Number(o))/Number(c)*100)+"%",marginRight:"auto"}},"◀"))),n.a.createElement("output",{for:"slider",class:"column form-value"},"%"===l?a.toFixed(1)+" %":"£ "+a.toFixed(2)))},o=function(e){var t=function(t,a){return a.order.create({purchase_units:[{amount:{currency_code:e.currency||e.currency?e.currency:"USD",value:e.amount.toString()}}],application_context:{shipping_preference:e.shippingPreference}})},a=function(e,t){return t.order.capture().then((function(t){return onSuccess(t,e)})).catch((function(e){return onError(e)}))},c=function(e){console.log(e)};return Object(r.useEffect)((function(){"undefined"!=typeof window&&window.paypal.Buttons(Object.assign({},e,{createOrder:e.createOrder?e.createOrder:t,onApprove:e.onApprove?e.onApprove:a,onError:e.onError?e.onError:c})).render("#paypal-button")}),[e.createOrder]),n.a.createElement("div",{id:"smart-button-container"},n.a.createElement("div",null,n.a.createElement("div",{id:"paypal-button"})))};o.defaultProps={style:{},currency:"USD",shippingPreference:"GET_FROM_FILE"};var m=o,d=function(e){var t=e.items,a=t.reduce((function(e,t){t[0];return e+t[1]}),0);return n.a.createElement("div",{style:{textAlign:"center"}},n.a.createElement(m,{key:a,style:{color:"blue"},createOrder:function(e,r){return r.order.create({purchase_units:[{amount:{currency_code:"GBP",value:a.toFixed(2),breakdown:{item_total:{currency_code:"GBP",value:a.toFixed(2)}}},items:t.map((function(e){return{name:e[0],unit_amount:{currency_code:"GBP",value:e[1].toFixed(2)},quantity:1}}))}]})}}))}}}]);
//# sourceMappingURL=component---src-pages-news-js-3a76332d652223de399f.js.map