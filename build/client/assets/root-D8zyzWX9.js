import{r as i,j as e}from"./jsx-runtime-CSwQo8vN.js";import{l as d,n as f,o as y,p as x,_ as g,O as S,M as w,L as j,S as k}from"./components-DcqcD3h8.js";/**
 * @remix-run/react v2.15.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let a="positions";function M({getKey:t,...l}){let{isSpaMode:c}=d(),r=f(),p=y();x({getKey:t,storageKey:a});let u=i.useMemo(()=>{if(!t)return null;let s=t(r,p);return s!==r.key?s:null},[]);if(c)return null;let h=((s,m)=>{if(!window.history.state||!window.history.state.key){let o=Math.random().toString(32).slice(2);window.history.replaceState({key:o},"")}try{let n=JSON.parse(sessionStorage.getItem(s)||"{}")[m||window.history.state.key];typeof n=="number"&&window.scrollTo(0,n)}catch(o){console.error(o),sessionStorage.removeItem(s)}}).toString();return i.createElement("script",g({},l,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${h})(${JSON.stringify(a)}, ${JSON.stringify(u)})`}}))}const b=()=>[{rel:"preconnect",href:"https://fonts.googleapis.com"},{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"},{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"}];function v({children:t}){return e.jsxs("html",{lang:"en",children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx(w,{}),e.jsx(j,{})]}),e.jsxs("body",{children:[t,e.jsx(M,{}),e.jsx(k,{})]})]})}function I(){return e.jsx("div",{className:"flex min-h-screen bg-black",children:e.jsx(S,{})})}export{v as Layout,I as default,b as links};
