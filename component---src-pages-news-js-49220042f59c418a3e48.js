(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{FJi0:function(e,a,t){"use strict";t.r(a),t.d(a,"default",(function(){return l}));var n=t("q1tI"),r=t.n(n),c=t("Kvkj");function l(){return r.a.createElement(c.a,null,r.a.createElement("div",{className:"box"},r.a.createElement("h1",{class:"title is-2"},"News")),r.a.createElement("div",{className:"box"},r.a.createElement("h2",{class:"title is-3"},"Subscribe"),r.a.createElement("form",{action:"https://formspree.io/f/mdoykklb",method:"POST"},r.a.createElement("label",{class:"label"},"Email",r.a.createElement("input",{class:"input",type:"email",name:"email",placeholder:"example@gmail.com"})),r.a.createElement("button",{class:"button is-link",type:"submit"},"Send"))),r.a.createElement("div",{className:"box"},r.a.createElement("h2",{class:"title is-3"},"Launch"),r.a.createElement("div",{className:"content"},r.a.createElement("i",null,"16/04/2021"),r.a.createElement("p",null,"We are launching an initial site to allow us to find first users, gather feedback and learn how to take this to the next level. If you are not interested in using our services at the current stage but might in the future we would appreciate if you could give us ",r.a.createElement("a",{href:"/contact"},"feedback")," and considered subscribing (above) to be notified when we add your requested features."))))}},Kvkj:function(e,a,t){"use strict";t.d(a,"a",(function(){return s})),t.d(a,"c",(function(){return o})),t.d(a,"b",(function(){return d}));var n=t("q1tI"),r=t.n(n),c=t("Wbzz");function l(){var e=Object(n.useState)(!1),a=e[0],t=e[1];return r.a.createElement("nav",{class:"navbar",role:"navigation","aria-label":"main navigation"},r.a.createElement("div",{class:"navbar-brand is-align-items-center mx-2"},r.a.createElement(c.a,{to:"/",className:"button is-primary"},r.a.createElement("span",{class:"icon"},r.a.createElement("i",{class:"fa fa-donate"})),r.a.createElement("span",null,"Offset me!")),r.a.createElement("a",{role:"button",class:"navbar-burger "+(a&&"is-active"),"aria-label":"menu","aria-expanded":a?"false":"true",onClick:function(){return t((function(e){return!e}))}},r.a.createElement("span",{"aria-hidden":"true"}),r.a.createElement("span",{"aria-hidden":"true"}),r.a.createElement("span",{"aria-hidden":"true"}))),r.a.createElement("div",{class:"navbar-menu "+(a&&"is-active")},r.a.createElement("div",{class:"navbar-start"},r.a.createElement(c.a,{to:"/documentation",className:"navbar-item"},"Docs"),r.a.createElement(c.a,{to:"/news",className:"navbar-item"},"News"),r.a.createElement(c.a,{to:"/about",className:"navbar-item"},"About us"),r.a.createElement(c.a,{to:"/contact",className:"navbar-item"},"Contact us / Feedback"))))}function i(){return r.a.createElement("footer",{class:"footer"},r.a.createElement("div",{class:"content has-text-centered"},r.a.createElement("p",null,r.a.createElement("strong",null,"Offset me!")," by"," ",r.a.createElement("a",{href:"http://www.suchanek.io"},"Jakub Suchánek")," and"," ",r.a.createElement("a",{href:"https://www.lawrencejb.com"},"Lawrence Berry"),".")))}function s(e){var a=e.children;return r.a.createElement("div",{style:{height:"100vh"},class:"is-flex is-flex-direction-column"},r.a.createElement(l,null),r.a.createElement("div",{class:"section is-flex-grow-1"},r.a.createElement("div",{className:"container is-max-desktop"},a)),r.a.createElement(i,null))}var o=function(e){var a=e.name,t=e.value,n=e.setValue,c=e.max,l=e.unit,i=e.level,s=e.high,o=e.low,u=e.mid;return r.a.createElement("div",{class:"columns is-vcentered is-mobile"},r.a.createElement("label",{for:"slider",class:"column form-text form-level-"+String(i)},a),r.a.createElement("div",{class:"slider-container"},r.a.createElement("input",{id:"slider",className:"column slider is-circle",type:"range",step:"0.01",min:0,max:c,value:t,onChange:function(e){n(Number(e.target.value))}}),r.a.createElement("div",{className:"slider-marks"},r.a.createElement("span",{className:"slider-mark",style:{marginLeft:String(Number(o)/Number(c)*100)+"%"}},"▶"),r.a.createElement("span",{className:"slider-mark",style:{marginLeft:String((Number(u)-Number(o))/Number(c)*100)+"%"}},"▲"),r.a.createElement("span",{className:"slider-mark",style:{marginLeft:String((Number(s)-Number(u))/Number(c)*100)+"%",marginRight:"auto"}},"◀"))),r.a.createElement("output",{for:"slider",class:"column form-value"},"%"===l?t.toFixed(1)+" %":"£ "+t.toFixed(2)))},u=function(e){var a=function(a,t){return t.order.create({purchase_units:[{amount:{currency_code:e.currency||e.currency?e.currency:"USD",value:e.amount.toString()}}],application_context:{shipping_preference:e.shippingPreference}})},t=function(e,a){return a.order.capture().then((function(a){return onSuccess(a,e)})).catch((function(e){return onError(e)}))},c=function(e){console.log(e)};return Object(n.useEffect)((function(){"undefined"!=typeof window&&window.paypal.Buttons(Object.assign({},e,{createOrder:e.createOrder?e.createOrder:a,onApprove:e.onApprove?e.onApprove:t,onError:e.onError?e.onError:c})).render("#paypal-button")}),[]),r.a.createElement("div",{id:"smart-button-container"},r.a.createElement("div",null,r.a.createElement("div",{id:"paypal-button"})))};u.defaultProps={style:{},currency:"USD",shippingPreference:"GET_FROM_FILE"};var m=u,d=function(e){var a=e.items,t=a.reduce((function(e,a){a[0];return e+a[1]}),0),n=t<=5?(.05+.05*t)/.95:(.3+.029*t)/.971,c=t+n;return r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement(m,{key:t,style:{color:"blue"},createOrder:function(e,r){return r.order.create({purchase_units:[{amount:{currency_code:"GBP",value:c.toFixed(2),breakdown:{item_total:{currency_code:"GBP",value:t.toFixed(2)},handling:{currency_code:"GBP",value:n.toFixed(2)}}},items:a.map((function(e){return{name:e[0],unit_amount:{currency_code:"GBP",value:e[1].toFixed(2)},quantity:1}}))}]})}}),r.a.createElement("div",{class:"card"},r.a.createElement("div",{class:"card-content has-text-left"},r.a.createElement("div",{class:"columns"},r.a.createElement("div",{class:"column is-italic"},"Donation:"),r.a.createElement("div",{class:"column"},"£",t.toFixed(2))),r.a.createElement("div",{class:"columns"},r.a.createElement("div",{class:"column is-italic"},"PayPal processing fee:"),r.a.createElement("div",{class:"column"},"£",n.toFixed(2))),r.a.createElement("div",{class:"columns"},r.a.createElement("div",{class:"column has-text-weight-semibold"},"Total:"),r.a.createElement("div",{class:"column"},"£",c.toFixed(2))))))}}}]);
//# sourceMappingURL=component---src-pages-news-js-49220042f59c418a3e48.js.map