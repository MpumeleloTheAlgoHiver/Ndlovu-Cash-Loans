import{s as h}from"./supabaseClient-BXT4n9qe.js";import{i as re}from"./layout-Cb_Oe5x8.js";/* empty css               */import{o as ie,p as oe,q as de,s as le,r as ce}from"./dataService-BFNJnUJq.js";import{a as k,b as Y}from"./utils-D6Z1B7Jq.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm";const ue=["STARTED","BUREAU_CHECKING","BUREAU_OK","BUREAU_REFER","BUREAU_DECLINE","BANK_LINKING","AFFORD_OK","AFFORD_REFER","AFFORD_FAIL","OFFERED","OFFER_ACCEPTED","CONTRACT_SIGN","DEBICHECK_AUTH","READY_TO_DISBURSE","DISBURSED","DECLINED","ERROR"];let G=[],H="borrower",L=null,V=[],B=1;const U=20;let n={active:!1,step:1,targetUser:null,loanHistoryCount:0,loanConfig:{amount:1e3,period:1,startDate:null,reason:"Personal Loan",maxAllowedPeriod:1,interestRate:.2},documents:{idcard:"pending",till_slip:"pending",bank_statement:"pending"},creditCheck:{applicationId:null,status:"pending",score:null}};const P="admin-credit-check-modal";let z=!1,S=null;function y(e,t="success"){let a=document.getElementById("toast-container");a||(a=document.createElement("div"),a.id="toast-container",a.className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none",document.body.appendChild(a));const s=document.createElement("div");let r="bg-gray-900 text-white",l='<i class="fa-solid fa-circle-check"></i>';t==="error"?(r="bg-red-600 text-white",l='<i class="fa-solid fa-circle-xmark"></i>'):t==="warning"&&(r="bg-orange-500 text-white",l='<i class="fa-solid fa-triangle-exclamation"></i>'),s.className=`${r} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-300 translate-x-full pointer-events-auto`,s.innerHTML=`${l}<span class="text-sm font-medium">${e}</span>`,a.appendChild(s),requestAnimationFrame(()=>s.classList.remove("translate-x-full")),setTimeout(()=>{s.classList.add("translate-x-full","opacity-0"),setTimeout(()=>s.remove(),300)},3e3)}const Z=e=>{switch(e){case"DISBURSED":case"READY_TO_DISBURSE":case"AFFORD_OK":case"BUREAU_OK":return"bg-green-100 text-green-800";case"DECLINED":case"AFFORD_FAIL":case"BUREAU_DECLINE":case"ERROR":return"bg-red-100 text-red-800";case"STARTED":case"BUREAU_CHECKING":case"BANK_LINKING":case"OFFER_ACCEPTED":case"CONTRACT_SIGN":case"DEBICHECK_AUTH":return"bg-blue-100 text-blue-800";case"OFFERED":case"BUREAU_REFER":case"AFFORD_REFER":return"bg-yellow-100 text-yellow-800";default:return"bg-gray-100 text-gray-800"}};function J(){if(z)return;const e=`
        <div id="${P}" class="hidden fixed inset-0 bg-black/70 z-[1000] items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div class="flex items-start justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900">Run Credit Check</h2>
                        <p class="text-sm text-gray-500">Powered by Experian SOAP Integration</p>
                    </div>
                    <button id="credit-check-close" class="text-3xl leading-none text-gray-400 hover:text-gray-700">&times;</button>
                </div>
                <div class="px-6 py-4 space-y-4">
                    <div id="credit-form-content" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Personal Information</h3>
                                <label class="block text-sm font-medium text-gray-700 mb-1">ID Number <span class="text-red-500">*</span></label>
                                <input type="text" id="identity_number" maxlength="13" class="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:ring-brand-accent">
                                
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Surname <span class="text-red-500">*</span></label>
                                        <input type="text" id="surname" class="w-full border border-gray-300 rounded-md px-3 py-2">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">First Name <span class="text-red-500">*</span></label>
                                        <input type="text" id="forename" class="w-full border border-gray-300 rounded-md px-3 py-2">
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Gender <span class="text-red-500">*</span></label>
                                        <select id="gender" class="w-full border border-gray-300 rounded-md px-3 py-2">
                                            <option value="">Select</option>
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span class="text-red-500">*</span></label>
                                        <input type="date" id="date_of_birth" class="w-full border border-gray-300 rounded-md px-3 py-2">
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Address Information</h3>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Street Address <span class="text-red-500">*</span></label>
                                        <input type="text" id="address1" class="w-full border border-gray-300 rounded-md px-3 py-2">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code <span class="text-red-500">*</span></label>
                                        <input type="text" id="postal_code" maxlength="4" class="w-full border border-gray-300 rounded-md px-3 py-2">
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Suburb / Area</label>
                                        <input type="text" id="address2" class="w-full border border-gray-300 rounded-md px-3 py-2">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Cell Number</label>
                                        <input type="tel" id="cell_tel_no" maxlength="10" class="w-full border border-gray-300 rounded-md px-3 py-2">
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 mt-4 p-3 rounded-md bg-orange-50 border border-orange-100">
                                    <input type="checkbox" id="credit_consent" class="mt-1 h-4 w-4 text-brand-accent focus:ring-brand-accent">
                                    <label for="credit_consent" class="text-sm text-gray-700">I confirm the client consented to this bureau enquiry.</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="credit-loading" class="hidden text-center py-8">
                        <i class="fa-solid fa-circle-notch fa-spin text-3xl text-brand-accent"></i>
                        <p class="mt-3 text-sm text-gray-600">Contacting Experian...</p>
                    </div>
                    
                    <div id="credit-result" class="hidden text-center py-8">
                        <i class="fa-solid fa-circle-check text-4xl text-green-500 mb-3"></i>
                        <h3 class="text-lg font-semibold text-gray-900">Credit Check Complete</h3>
                        <p class="text-sm text-gray-500">Score and risk band:</p>
                        <div id="credit-score-value" class="text-3xl font-bold text-gray-900 mt-2"></div>
                    </div>
                </div>
                
                <div class="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-gray-200">
                    <span class="text-xs text-gray-500"><i class="fa-solid fa-shield-halved"></i> Data encrypted via Supabase Edge</span>
                    <div class="flex items-center gap-2">
                        <button id="credit-check-download" class="hidden px-4 py-2 border border-gray-300 rounded-md text-sm">Download Report</button>
                        <button id="credit-check-complete" class="hidden px-4 py-2 bg-green-600 text-white rounded-md text-sm">Done</button>
                        <button id="credit-check-cancel" class="px-4 py-2 border border-gray-300 rounded-md text-sm">Cancel</button>
                        <button id="credit-check-submit" class="px-4 py-2 bg-brand-accent text-white rounded-md text-sm">Run Credit Check</button>
                    </div>
                </div>
            </div>
        </div>`;document.body.insertAdjacentHTML("beforeend",e),document.getElementById("credit-check-close").addEventListener("click",F),document.getElementById("credit-check-cancel").addEventListener("click",F),document.getElementById("credit-check-submit").addEventListener("click",pe),document.getElementById("credit-check-complete").addEventListener("click",()=>{F();const t=document.getElementById("wizard-content");t&&n.step===2&&Q(t)}),document.getElementById("credit-check-download").addEventListener("click",()=>{S&&n.creditCheck.applicationId&&fe(S,n.creditCheck.applicationId)}),z=!0}window.openCreditCheckModal=function(){if(!n.targetUser)return;J(),O(),me();const e=document.getElementById(P);e.classList.remove("hidden"),e.classList.add("flex")};function F(){const e=document.getElementById(P);e&&(e.classList.add("hidden"),e.classList.remove("flex"),O())}function O(){document.getElementById("credit-form-content").classList.remove("hidden"),document.getElementById("credit-loading").classList.add("hidden"),document.getElementById("credit-result").classList.add("hidden");const e=document.getElementById("credit-check-submit");e.disabled=!1,e.innerHTML="Run Credit Check",e.classList.remove("hidden"),document.getElementById("credit-check-cancel").classList.remove("hidden"),document.getElementById("credit-check-complete").classList.add("hidden"),document.getElementById("credit-check-download").classList.add("hidden"),S=null}function me(){const e=n.targetUser||{},{firstName:t,lastName:a}=be(e.full_name);if(!document.getElementById("identity_number"))return;document.getElementById("identity_number").value=e.identity_number||e.id_number||"",document.getElementById("surname").value=e.last_name||a||"",document.getElementById("forename").value=e.first_name||t||"",document.getElementById("cell_tel_no").value=e.phone_number||e.contact_number||"";const s=(e.gender||"").toUpperCase();document.getElementById("gender").value=s.startsWith("F")?"F":s.startsWith("M")?"M":"",document.getElementById("date_of_birth").value=xe(e.date_of_birth),document.getElementById("address1").value=e.address_line1||e.address||"",document.getElementById("postal_code").value=e.postal_code||e.zip_code||"",document.getElementById("credit_consent").checked=!0}async function pe(){var m,f,b;const e=document.getElementById("credit-check-submit"),t=document.getElementById("identity_number").value.trim(),a=document.getElementById("surname").value.trim(),s=document.getElementById("forename").value.trim(),r=document.getElementById("gender").value,l=document.getElementById("date_of_birth").value,d=document.getElementById("address1").value.trim(),o=document.getElementById("address2").value.trim(),c=document.getElementById("postal_code").value.trim(),i=document.getElementById("cell_tel_no").value.trim(),u=document.getElementById("credit_consent").checked;if(!t||!a||!s||!r||!l||!d||!c){y("Please fill in all required fields.","warning");return}if(!u){y("Client consent is required.","warning");return}e.disabled=!0,e.innerHTML="Processing...",document.getElementById("credit-form-content").classList.add("hidden"),document.getElementById("credit-loading").classList.remove("hidden");try{const{data:{session:x}}=await h.auth.getSession();let g=(m=n.creditCheck)==null?void 0:m.applicationId;if(!g){const{data:w,error:E}=await h.from("loan_applications").insert([{user_id:n.targetUser.id,status:"BUREAU_CHECKING",amount:0,term_months:0,purpose:"In-branch",source:"IN_BRANCH",created_by_admin:(f=x.user)==null?void 0:f.id}]).select().single();if(E)throw E;g=w.id,n.creditCheck.applicationId=g}const p={user_id:n.targetUser.id,identity_number:t,surname:a,forename:s,gender:r,date_of_birth:l.replace(/-/g,""),address1:d,address2:o,postal_code:c,cell_tel_no:i},v=await ge(g,p,x.access_token),_=((b=v.creditScore)==null?void 0:b.score)||0;await h.from("loan_applications").update({bureau_score_band:_,status:"BUREAU_OK"}).eq("id",g),n.creditCheck={applicationId:g,status:"completed",score:_},S=v.zipData||null,document.getElementById("credit-loading").classList.add("hidden"),document.getElementById("credit-result").classList.remove("hidden"),document.getElementById("credit-score-value").textContent=`Score: ${_}`,document.getElementById("credit-check-complete").classList.remove("hidden"),S&&document.getElementById("credit-check-download").classList.remove("hidden"),e.classList.add("hidden")}catch(x){console.error(x),y(x.message,"error"),O()}}async function ge(e,t,a){const s=await fetch("/api/credit-check",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify({applicationId:e,userData:t})}),r=await s.json();if(!s.ok||!r.success)throw await h.from("loan_applications").update({status:"BUREAU_DECLINE"}).eq("id",e),new Error(r.error||"Credit check failed");return r}function fe(e,t){try{const a=atob(e),s=new Array(a.length);for(let c=0;c<a.length;c++)s[c]=a.charCodeAt(c);const r=new Uint8Array(s),l=new Blob([r],{type:"application/zip"}),d=window.URL.createObjectURL(l),o=document.createElement("a");o.href=d,o.download=`credit-report-${t}.zip`,document.body.appendChild(o),o.click(),window.URL.revokeObjectURL(d),document.body.removeChild(o)}catch{y("Unable to download the credit report.","error")}}function be(e=""){const t=e.trim().split(" ").filter(Boolean);if(t.length===0)return{firstName:"",lastName:""};if(t.length===1)return{firstName:t[0],lastName:t[0]};const a=t.pop();return{firstName:t.join(" "),lastName:a}}function xe(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":t.toISOString().split("T")[0]}function ye(){const e=document.getElementById("main-content");e&&(e.innerHTML=`
    <div id="applications-list-view" class="flex flex-col h-full animate-fade-in">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 shrink-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Loan Applications</h1>
          <p class="mt-1 text-sm text-gray-500">Manage reviews and create in-branch applications.</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button id="create-app-btn" class="w-full sm:w-auto bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition flex items-center justify-center gap-2 shadow-sm text-sm">
                <i class="fa-solid fa-desktop"></i> In-Branch App
            </button>

            <select id="status-filter" class="bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm font-medium focus:ring-orange-500 focus:border-orange-500 cursor-pointer">
                <option value="all">All Statuses</option>
                ${ue.map(t=>`<option value="${t}">${t}</option>`).join("")}
            </select>

            <div class="relative w-full sm:w-64">
                <input type="text" id="search-input" placeholder="Search applications..." 
                       class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm">
                <i class="fa-solid fa-search absolute left-3 top-2.5 text-gray-400"></i>
                <div id="search-suggestions" class="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 hidden max-h-72 overflow-y-auto shadow-xl"></div>
            </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden flex-1 min-h-0">
        <div class="overflow-auto custom-scrollbar">
          <table class="min-w-full divide-y divide-gray-200 relative">
            <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Applicant</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Date</th>
                    <th class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Action</th>
                </tr>
            </thead>
            <tbody id="applications-table-body" class="bg-white divide-y divide-gray-200">
                <tr><td colspan="5" class="p-10 text-center text-gray-400">Loading...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-2 text-xs text-gray-400 text-right">Showing <span id="visible-count">0</span> records</div>
    </div>

    <div id="in-branch-view" class="hidden bg-white rounded-xl shadow-lg h-full flex flex-col border border-gray-200">
       <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <div class="flex items-center gap-3">
                <button id="back-to-list-btn" class="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors">
                    <i class="fa-solid fa-arrow-left"></i> Cancel
                </button>
                <span class="h-6 w-px bg-gray-300"></span>
                <span class="text-sm font-bold text-gray-800">In-Branch Application Mode</span>
            </div>
            <div class="text-xs text-orange-600 font-bold flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                <i class="fa-solid fa-store"></i> Branch Terminal
            </div>
        </div>
        
        <div class="px-6 pt-6 pb-2">
            <div class="flex items-center justify-center w-full max-w-6xl mx-auto mb-8 overflow-x-auto pb-2">
                <div id="wizard-stepper-container" class="flex items-center min-w-max"></div>
            </div>
        </div>
        
        <div id="wizard-content" class="flex-1 overflow-y-auto px-6 pb-6 bg-gray-50"></div>
        
        <div class="px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl flex justify-end gap-3">
            <button id="wizard-prev-btn" class="hidden px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 text-sm">Back</button>
            <button id="wizard-next-btn" class="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-black shadow-sm text-sm">Next Step</button>
        </div>
    </div>
  `,Le(),J())}const K=[{id:1,title:"Client",icon:"fa-user"},{id:2,title:"Bureau",icon:"fa-search-dollar"},{id:3,title:"Financials",icon:"fa-chart-pie"},{id:4,title:"Declarations",icon:"fa-file-contract"},{id:5,title:"Loan",icon:"fa-sliders"},{id:6,title:"Docs",icon:"fa-file-invoice"},{id:7,title:"Confirm",icon:"fa-check-circle"}];async function he(){n.active=!0,n.step=1,n.targetUser=null,n.loanHistoryCount=0,n.creditCheck={applicationId:null,status:"pending",score:null};const e=new Date;e.setDate(e.getDate()+7),n.loanConfig={amount:1e3,period:1,startDate:e,reason:"Personal Loan",maxAllowedPeriod:1,interestRate:.2},document.getElementById("applications-list-view").classList.add("hidden"),document.getElementById("in-branch-view").classList.remove("hidden"),j()}function j(){ve(),we(),R()}function ve(){const e=document.getElementById("wizard-stepper-container");e&&(e.innerHTML=K.map((t,a)=>{const s=t.id===n.step,r=t.id<n.step,l=a===K.length-1;let d="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ";return s?d+="border-brand-accent bg-brand-accent text-white shadow-md":r?d+="border-green-500 bg-green-500 text-white":d+="border-gray-300 bg-white text-gray-400",`
            <div class="flex flex-col items-center px-2">
                <div class="${d}">
                    ${r?'<i class="fa-solid fa-check"></i>':`<i class="fa-solid ${t.icon}"></i>`}
                </div>
                <span class="text-xs font-semibold whitespace-nowrap mt-1 ${s?"text-brand-accent":"text-gray-400"}">
                    ${t.title}
                </span>
            </div>
            ${l?"":'<div class="w-8 h-1 mx-1 rounded bg-gray-200"></div>'}
        `}).join(""))}async function we(){const e=document.getElementById("wizard-content");switch(e.innerHTML='<div class="flex justify-center p-10"><i class="fa-solid fa-circle-notch fa-spin text-3xl text-brand-accent"></i></div>',n.step){case 1:await T(e);break;case 2:await Q(e);break;case 3:await _e(e);break;case 4:await Ee(e);break;case 5:await X(e);break;case 6:await ee(e);break;case 7:await te(e);break}}function R(){const e=document.getElementById("wizard-prev-btn"),t=document.getElementById("wizard-next-btn");n.step===1?(e.classList.add("hidden"),t.disabled=!n.targetUser):(e.classList.remove("hidden"),t.disabled=!1),n.step===3||n.step===4?t.classList.add("hidden"):t.classList.remove("hidden"),n.step===7?(t.innerHTML='<i class="fa-solid fa-paper-plane mr-2"></i> Submit Application',t.onclick=ne):(t.innerHTML='Next Step <i class="fa-solid fa-arrow-right ml-2"></i>',t.onclick=A)}async function T(e){var u,m,f,b,x,g;const t=["admin","super_admin","base_admin"].includes(H),a=100;e.innerHTML=`
        <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg border border-gray-200 shadow-sm mt-4">
            <div class="flex border-b border-gray-200 mb-6">
                <button id="tab-search" class="flex-1 py-2 text-sm font-medium text-orange-600 border-b-2 border-orange-600">
                    <i class="fa-solid fa-magnifying-glass mr-2"></i>Search Existing
                </button>
                ${t?`
                <button id="tab-create" class="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-orange-700 transition-colors">
                    <i class="fa-solid fa-user-plus mr-2"></i>New Walk-in Client
                </button>`:""}
            </div>
            
            <div id="view-search">
                <h3 class="text-xl font-bold text-gray-800 mb-2">Find Client</h3>
                <p class="text-sm text-gray-500 mb-6">Search by name, email, or ID number.</p>
                <div class="relative mb-6">
                    <input type="text" id="user-search" class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm" placeholder="Start typing name or ID...">
                    <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <div id="search-spinner" class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-orange-500">
                        <i class="fa-solid fa-circle-notch fa-spin"></i>
                    </div>
                </div>
                <div id="user-results" class="hidden absolute z-10 w-full max-w-[36rem] bg-white border border-gray-200 rounded-lg shadow-xl mt-[-20px] max-h-60 overflow-y-auto"></div>
            </div>
            
            ${t?`
            <div id="view-create" class="hidden animate-fade-in">
                <div class="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
                    <div class="flex">
                        <div class="flex-shrink-0"><i class="fa-solid fa-store text-orange-600"></i></div>
                        <div class="ml-3">
                            <p class="text-sm text-orange-700">You are registering a <strong>Walk-in Client</strong>. Physical branch selection is required.</p>
                        </div>
                    </div>
                </div>
                <div class="space-y-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name <span class="text-red-500">*</span></label>
                        <input type="text" id="new-fullname" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500" placeholder="e.g. John Doe">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">ID Number <span class="text-red-500">*</span></label>
                        <input type="text" id="new-idnumber" maxlength="13" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500" placeholder="13-digit SA ID">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                            <input type="tel" id="new-phone" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500" placeholder="082...">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Email (Optional)</label>
                            <input type="email" id="new-email" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500" placeholder="Leave empty if none">
                        </div>
                    </div>

                    <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Select Physical Branch <span class="text-red-500">*</span></label>
                        <select id="new-branch-id" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500 bg-white">
                            <option value="">-- Choose Location --</option>
                            ${V.filter(p=>p.id!==a).map(p=>`<option value="${p.id}">${p.name}</option>`).join("")}
                        </select>
                        <p class="text-[10px] text-gray-500 mt-2 font-medium">
                            <i class="fa-solid fa-circle-info"></i> Please specify the branch where this walk-in application is taking place.
                        </p>
                    </div>

                    <button id="btn-create-client" class="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-all shadow-md mt-2 flex justify-center items-center gap-2">
                        <i class="fa-solid fa-user-plus"></i> Create & Select Client
                    </button>
                </div>
            </div>`:""}
            
            <div id="selected-user-card" class="${n.targetUser?"":"hidden"} mt-6 space-y-4 animate-fade-in">
                <div class="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-xl shadow-sm">
                            ${((m=(u=n.targetUser)==null?void 0:u.full_name)==null?void 0:m.charAt(0))||"U"}
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-900">${((f=n.targetUser)==null?void 0:f.full_name)||""}</h4>
                            <p class="text-xs text-gray-600 font-mono">ID: ${((b=n.targetUser)==null?void 0:b.identity_number)||"N/A"}</p>
                        </div>
                    </div>
                    <button id="clear-user-btn" class="text-gray-400 hover:text-red-500 transition-colors"><i class="fa-solid fa-times text-xl"></i></button>
                </div>

                <div id="action-new-loan" class="bg-white border-2 border-orange-600 border-dashed rounded-2xl p-6 shadow-md hover:bg-orange-50 cursor-pointer transition-all group">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg"><i class="fa-solid fa-plus"></i></div>
                            <div>
                                <h5 class="font-black text-gray-900 uppercase">Start New Loan Application</h5>
                                <div id="outstanding-balance-warning">
                                    <p class="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Fresh credit check & financials</p>
                                </div>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-right text-orange-600"></i>
                    </div>
                </div>

                <div id="existing-loans-container" class="space-y-2">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Resume / Update Existing</p>
                    <div id="user-loan-history-list" class="space-y-2">
                        <div class="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <i class="fa-solid fa-spinner fa-spin text-gray-400"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;const s=document.getElementById("tab-search"),r=document.getElementById("tab-create"),l=document.getElementById("view-search"),d=document.getElementById("view-create"),o=document.getElementById("user-search"),c=document.getElementById("user-results"),i=document.getElementById("search-spinner");if(t&&r&&(s.onclick=()=>{l.classList.remove("hidden"),d.classList.add("hidden"),s.className="flex-1 py-2 text-sm font-medium text-orange-600 border-b-2 border-orange-600",r.className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-orange-700 transition-colors"},r.onclick=()=>{l.classList.add("hidden"),d.classList.remove("hidden"),r.className="flex-1 py-2 text-sm font-medium text-orange-600 border-b-2 border-orange-600",s.className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-orange-700 transition-colors"}),o){let p;o.oninput=v=>{clearTimeout(p);const _=v.target.value.trim();if(_.length<2){c.classList.add("hidden");return}i.classList.remove("hidden"),p=setTimeout(async()=>{const{data:w}=await h.from("profiles").select("*").or(`full_name.ilike.%${_}%,identity_number.ilike.%${_}%`).limit(5);i.classList.add("hidden"),(w==null?void 0:w.length)>0?(c.innerHTML=w.map(E=>`<div class="p-3 hover:bg-orange-50 cursor-pointer border-b last:border-0 user-option" data-id="${E.id}"><div class="font-bold text-gray-800">${E.full_name}</div><div class="text-xs text-gray-500 font-mono">ID: ${E.identity_number||"N/A"}</div></div>`).join(""),c.classList.remove("hidden"),document.querySelectorAll(".user-option").forEach(E=>E.onclick=()=>{n.targetUser=w.find(C=>C.id===E.dataset.id),T(e),R()})):(c.innerHTML='<div class="p-4 text-sm text-gray-500">No clients found.</div>',c.classList.remove("hidden"))},400)}}if((x=document.getElementById("btn-create-client"))==null||x.addEventListener("click",async p=>{const v=document.getElementById("new-fullname").value.trim(),_=document.getElementById("new-idnumber").value.trim(),w=document.getElementById("new-phone").value.trim(),E=document.getElementById("new-email").value.trim(),C=document.getElementById("new-branch-id"),I=C?C.value:null;if(!I)return y("Manual branch selection is required to proceed.","warning");if(!v||!_)return y("Name and ID Number are required.","warning");p.target.disabled=!0,p.target.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Creating...';try{const{data:$,error:D}=await ce({fullName:v,idNumber:_,phone:w,email:E||null,branchId:I});if(D)throw D;n.targetUser=$,T(e),R()}catch($){y($.message,"error"),p.target.disabled=!1,p.target.innerHTML='<i class="fa-solid fa-user-plus"></i> Create & Select Client'}}),n.targetUser){const p=document.getElementById("user-loan-history-list"),v=document.getElementById("outstanding-balance-warning"),_=document.getElementById("action-new-loan");h.from("loan_applications").select("*").eq("user_id",n.targetUser.id).order("created_at",{ascending:!1}).then(({data:w,error:E})=>{if(E)return;const C=w==null?void 0:w.find(I=>!["REPAID","DECLINED","ERROR","DISBURSED"].includes(I.status));C?(v.innerHTML=`<p class="text-[10px] text-red-600 font-bold uppercase flex items-center gap-1"><i class="fa-solid fa-triangle-exclamation"></i> Active: ${C.status}</p>`,_.classList.add("opacity-50","bg-gray-50","cursor-not-allowed"),_.onclick=()=>y("Cannot start new. Application active.","warning")):(v.innerHTML='<p class="text-[10px] text-green-600 font-bold uppercase">Ready for new application</p>',_.onclick=()=>A()),!w||w.length===0?p.innerHTML='<p class="text-xs text-gray-400 p-4 text-center italic">No history found.</p>':p.innerHTML=w.map(I=>`<div class="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center text-sm shadow-sm"><div><span class="font-bold text-gray-700">${k(I.amount)}</span><span class="text-[10px] ml-2 text-gray-400 font-mono">${Y(I.created_at)}</span><div class="mt-1"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${Z(I.status)}">${I.status}</span></div></div>${["REPAID","DECLINED","ERROR","DISBURSED"].includes(I.status)?"":`<button class="resume-app-btn px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-md hover:bg-orange-700 transition" data-id="${I.id}">Resume</button>`}</div>`).join(""),document.querySelectorAll(".resume-app-btn").forEach(I=>{I.onclick=$=>{const D=$.target.dataset.id,M=w.find(se=>se.id==D);n.creditCheck.applicationId=D,n.loanConfig={...n.loanConfig,amount:M.amount,period:M.term_months,reason:M.purpose},y("Resuming Application..."),A()}})})}(g=document.getElementById("clear-user-btn"))==null||g.addEventListener("click",()=>{n.targetUser=null,T(e),R()})}async function Q(e){if(!n.targetUser)return;const{data:t}=await h.from("credit_checks").select("*").eq("user_id",n.targetUser.id).eq("status","completed").order("checked_at",{ascending:!1}).limit(1),a=t==null?void 0:t[0],s=a?(Date.now()-new Date(a.checked_at))/(1e3*3600*24):999,r=a&&s<=90;let l="",d=!1;if(r){const i=a.credit_score;n.creditScore=i,n.creditCheck={applicationId:a.application_id,status:"completed",score:i},d=!0;let u=i<600?"#EF4444":i<700?"#F59E0B":"#10B981",m=i<600?"Poor":i<700?"Average":"Excellent";const f=new Date(new Date(a.checked_at).getTime()+90*24*60*60*1e3).toLocaleDateString();l=`
            <div class="text-center p-6">
                <div class="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                    <svg class="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="80" stroke="#f3f4f6" stroke-width="12" fill="none"/>
                        <circle cx="96" cy="96" r="80" stroke="${u}" stroke-width="12" fill="none" 
                            stroke-dasharray="502" 
                            stroke-dashoffset="${502-502*(i/800)}"
                            style="transition: stroke-dashoffset 1s ease-in-out;"/>
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span class="text-4xl font-extrabold text-gray-900">${i}</span>
                        <span class="text-xs font-bold uppercase tracking-widest" style="color: ${u}">${m}</span>
                    </div>
                </div>
                <h3 class="text-lg font-bold text-gray-800">Bureau Report Verified</h3>
                <p class="text-sm text-gray-500 mt-1">Valid until ${f}</p>
            </div>`}else n.creditCheck={applicationId:null,status:"pending",score:null},l=`
            <div class="text-center py-10">
                <div class="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-3xl mx-auto mb-4">
                    <i class="fa-solid fa-user-clock"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900">New Credit Check Required</h3>
                <p class="text-gray-600 mt-2">No valid bureau report found from the last 3 months.</p>
                <button id="run-check-btn" class="mt-8 bg-brand-accent text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-brand-accent-hover transition">
                    Launch Experian Module
                </button>
            </div>`;e.innerHTML=`<div class="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-xl mt-4">${l}</div>`;const o=document.getElementById("run-check-btn");o&&(o.onclick=()=>window.openCreditCheckModal());const c=document.getElementById("wizard-next-btn");c&&(c.disabled=!d)}async function _e(e){if(!n.targetUser)return;const{data:t}=await h.from("financial_profiles").select("*").eq("user_id",n.targetUser.id).maybeSingle(),a=(t==null?void 0:t.parsed_data)||{income:{},expenses:{}};e.innerHTML=`
        <div class="max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-xl mt-4 animate-fade-in">
            <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="fa-solid fa-scale-balanced text-brand-accent"></i> 
                Financial Affordability Assessment
            </h3>
            
            <form id="financials-form" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div class="space-y-4">
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                            <i class="fa-solid fa-wallet"></i> Monthly Income
                        </h4>
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">Basic Salary (Net)</label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R</span>
                                <input type="number" id="fin_salary" value="${a.income.salary||""}" 
                                    class="w-full pl-8 border-gray-300 rounded-lg focus:ring-brand-accent" placeholder="0.00">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">Other Earnings</label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R</span>
                                <input type="number" id="fin_other" value="${a.income.other_monthly_earnings||""}" 
                                    class="w-full pl-8 border-gray-300 rounded-lg focus:ring-brand-accent" placeholder="0.00">
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                            <i class="fa-solid fa-receipt"></i> Monthly Expenses
                        </h4>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 mb-1">Housing/Rent</label>
                                <input type="number" id="exp_housing" value="${a.expenses.housing_rent||""}" 
                                    class="w-full border-gray-300 rounded-lg text-sm" placeholder="0">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 mb-1">School Fees</label>
                                <input type="number" id="exp_school" value="${a.expenses.school||""}" 
                                    class="w-full border-gray-300 rounded-lg text-sm" placeholder="0">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 mb-1">Transport</label>
                                <input type="number" id="exp_transport" value="${a.expenses.petrol||""}" 
                                    class="w-full border-gray-300 rounded-lg text-sm" placeholder="0">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 mb-1">Groceries</label>
                                <input type="number" id="exp_food" value="${a.expenses.groceries||""}" 
                                    class="w-full border-gray-300 rounded-lg text-sm" placeholder="0">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <span class="text-xs font-bold text-gray-500 uppercase tracking-tighter">Maximum Monthly Affordability</span>
                        <div class="flex items-baseline gap-2">
                            <h2 id="disp-income" class="text-4xl font-black text-brand-accent">R 0.00</h2>
                            <span class="text-xs text-gray-400 font-medium">(Surplus Income)</span>
                        </div>
                    </div>
                    <button type="submit" class="w-full md:w-auto bg-gray-900 text-white px-10 py-4 rounded-xl font-extrabold hover:bg-black transition shadow-lg flex items-center justify-center gap-2">
                        <i class="fa-solid fa-cloud-arrow-up"></i> Save & Analyze Profile
                    </button>
                </div>
            </form>
        </div>`;const s=()=>{const r=parseFloat(document.getElementById("fin_salary").value)||0,l=parseFloat(document.getElementById("fin_other").value)||0,d=r+l,o=parseFloat(document.getElementById("exp_housing").value)||0,c=parseFloat(document.getElementById("exp_school").value)||0,i=parseFloat(document.getElementById("exp_transport").value)||0,u=parseFloat(document.getElementById("exp_food").value)||0,m=o+c+i+u,f=Math.max(0,d-m);return document.getElementById("disp-income").textContent=k(f),{totalIncome:d,totalExpenses:m,surplus:f}};document.querySelectorAll("#financials-form input").forEach(r=>{r.addEventListener("input",s)}),s(),document.getElementById("financials-form").onsubmit=async r=>{r.preventDefault();const{totalIncome:l,totalExpenses:d,surplus:o}=s();if(l<=0)return y("Please enter a valid salary.","warning");const c={user_id:n.targetUser.id,monthly_income:l,monthly_expenses:d,affordability_ratio:o,parsed_data:{income:{salary:document.getElementById("fin_salary").value,other_monthly_earnings:document.getElementById("fin_other").value},expenses:{housing_rent:document.getElementById("exp_housing").value,school:document.getElementById("exp_school").value,petrol:document.getElementById("exp_transport").value,groceries:document.getElementById("exp_food").value}}},{error:i}=await h.from("financial_profiles").upsert(c,{onConflict:"user_id"});i?y(i.message,"error"):(n.affordabilityLimit=o,y("Financial Profile Updated","success"),A())}}async function Ee(e){if(!n.targetUser)return;const{data:t}=await h.from("declarations").select("*").eq("user_id",n.targetUser.id).maybeSingle();e.innerHTML=`
        <div class="max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-xl mt-4 animate-fade-in">
            <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="fa-solid fa-file-shield text-brand-accent"></i> 
                Compliance & Statutory Declarations
            </h3>

            <div class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Marital Status</label>
                        <select id="decl_marital" class="w-full border-gray-300 rounded-lg focus:ring-brand-accent">
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Residential Status</label>
                        <select id="decl_home" class="w-full border-gray-300 rounded-lg focus:ring-brand-accent">
                            <option value="rent">Rent</option>
                            <option value="own">Own Home</option>
                            <option value="family">Living with Family</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Highest Qualification</label>
                        <select id="decl_qual" class="w-full border-gray-300 rounded-lg focus:ring-brand-accent">
                            <option value="none">None / Primary</option>
                            <option value="matric">Matric / Grade 12</option>
                            <option value="diploma">Diploma</option>
                            <option value="degree">Bachelor's Degree</option>
                            <option value="postgrad">Postgraduate</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-3 pt-6">
                        <input type="checkbox" id="decl_disadvantaged" class="w-5 h-5 text-brand-accent border-gray-300 rounded focus:ring-brand-accent">
                        <label for="decl_disadvantaged" class="text-sm font-semibold text-gray-700 cursor-pointer">Historically Disadvantaged?</label>
                    </div>
                </div>

                <div class="p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <label class="flex items-center gap-3 cursor-pointer mb-3">
                        <input type="checkbox" id="decl_referral_provided" class="w-5 h-5 text-brand-accent border-gray-300 rounded">
                        <span class="text-sm font-bold text-gray-700 uppercase tracking-tighter">Was a referral provided for this client?</span>
                    </label>
                    <div id="referral-fields" class="grid grid-cols-1 md:grid-cols-2 gap-4 hidden mt-4 animate-fade-in">
                        <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Referral Name</label>
                            <input type="text" id="decl_ref_name" class="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-accent" placeholder="Full Name">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Referral Phone</label>
                            <input type="tel" id="decl_ref_phone" class="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-accent" placeholder="081...">
                        </div>
                    </div>
                </div>

                <div class="p-5 bg-orange-50 border border-orange-100 rounded-xl space-y-4">
                    <label class="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" id="decl_terms" class="mt-1 w-5 h-5 text-orange-600 border-orange-200 rounded focus:ring-orange-500">
                        <span class="text-sm text-gray-700 leading-tight">
                            Client has read and accepts the <strong>Standard Conditions of the Credit Agreement</strong> and the <strong>Pre-Agreement Statement</strong>.
                        </span>
                    </label>
                    <label class="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" id="decl_truth" class="mt-1 w-5 h-5 text-orange-600 border-orange-200 rounded focus:ring-orange-500">
                        <span class="text-sm text-gray-700 leading-tight">
                            Client declares that all information provided is true, correct, and that they are not currently under debt review or insolvent.
                        </span>
                    </label>
                </div>

                <button id="save-declarations" class="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-black shadow-lg transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-check-double"></i> Verify Compliance & Continue
                </button>
            </div>
        </div>`;const a=()=>{const s=document.getElementById("decl_referral_provided").checked,r=document.getElementById("referral-fields");s?r.classList.remove("hidden"):r.classList.add("hidden")};document.getElementById("decl_referral_provided").addEventListener("change",a),t&&(document.getElementById("decl_marital").value=t.marital_status||"single",document.getElementById("decl_home").value=t.home_ownership||"rent",document.getElementById("decl_qual").value=t.highest_qualification||"matric",document.getElementById("decl_disadvantaged").checked=!!t.historically_disadvantaged,t.referral_provided&&(document.getElementById("decl_referral_provided").checked=!0,a(),document.getElementById("decl_ref_name").value=t.referral_name||"",document.getElementById("decl_ref_phone").value=t.referral_phone||"")),document.getElementById("save-declarations").onclick=async()=>{const s=document.getElementById("decl_terms").checked,r=document.getElementById("decl_truth").checked;if(!s||!r)return y("Statutory declarations must be confirmed.","warning");const l=document.getElementById("decl_referral_provided").checked,d={user_id:n.targetUser.id,marital_status:document.getElementById("decl_marital").value,home_ownership:document.getElementById("decl_home").value,highest_qualification:document.getElementById("decl_qual").value,historically_disadvantaged:document.getElementById("decl_disadvantaged").checked,referral_provided:l,referral_name:l?document.getElementById("decl_ref_name").value:null,referral_phone:l?document.getElementById("decl_ref_phone").value:null,accepted_std_conditions:!0,metadata:{marital_status:document.getElementById("decl_marital").value,home_ownership:document.getElementById("decl_home").value}},{error:o}=await h.from("declarations").upsert(d,{onConflict:"user_id"});o?y(o.message,"error"):(y("Declarations Verified","success"),A())}}function Ie(e){return[`${e}-01-01`,`${e}-03-21`,`${e}-04-18`,`${e}-04-21`,`${e}-04-27`,`${e}-04-28`,`${e}-05-01`,`${e}-06-16`,`${e}-08-09`,`${e}-09-24`,`${e}-12-16`,`${e}-12-25`,`${e}-12-26`]}function W(e){if(!e)return{valid:!0};const t=new Date(e),a=t.getUTCDay(),s=t.getUTCFullYear(),r=t.toISOString().split("T")[0],l=Ie(s);return a===0||a===6?{valid:!1,reason:"Repayments cannot be scheduled on weekends."}:l.includes(r)?{valid:!1,reason:"The selected date is a South African Public Holiday."}:{valid:!0}}function q(e,t,a,s){let o=s<3?.2:.18,c=o-.15,i=0;if(a){const x=new Date,g=new Date(a),p=Math.max(1,Math.ceil((g-x)/(1e3*60*60*24))),v=Math.min(p,30),_=60/30*v,w=t>1?60*(t-1):0;i=_+w}else i=60*t;const u=e*c*(t/12),m=e*.15*t,f=e+u+i+m,b=f/t;return{totalInterest:u,totalRepayment:f,monthlyPayment:b,totalMonthlyFees:i,totalInitiationFees:m,totalRate:o,interestPortion:c,initiationRate:.15}}async function X(e){var x;if(n.targetUser&&(n.loanHistoryCount===void 0||n.loanHistoryCount===0)){const{data:g}=await h.from("loan_applications").select("id").eq("user_id",n.targetUser.id).eq("status","");n.loanHistoryCount=(g==null?void 0:g.length)||0;const{data:p}=await h.from("financial_profiles").select("affordability_ratio").eq("user_id",n.targetUser.id).single();n.affordabilityLimit=(p==null?void 0:p.affordability_ratio)||0}const t=n.loanHistoryCount||0,a=n.affordabilityLimit||0;t<3?n.loanConfig.maxAllowedPeriod=1:n.loanConfig.maxAllowedPeriod=24;const{amount:s,period:r,reason:l,startDate:d}=n.loanConfig,o=q(s,r,d,t),c=o.totalRate/12;let i=1e4;a>0&&(c>0?i=a*((1-Math.pow(1+c,-r))/c):i=a*r),i=Math.floor(i/100)*100;const u=a>0&&o.monthlyPayment>a,m=W(((x=document.getElementById("loan-start-date"))==null?void 0:x.value)||d);e.innerHTML=`
        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold text-gray-800">Configure Loan</h3>
                    <div class="text-right">
                        <span class="block text-[10px] uppercase text-gray-400 font-bold tracking-tight">Max for ${r} Month${r>1?"s":""}</span>
                        <span class="text-sm font-black text-brand-accent">R ${i.toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Amount (ZAR)</label>
                    <input type="number" id="loan-amount" value="${s}" min="100" class="w-full border-gray-300 rounded-md focus:ring-brand-accent ${u?"border-red-500 ring-1 ring-red-500":""}">
                    ${u?`
                    <div class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-[11px] text-red-700 flex items-start gap-2">
                        <i class="fa-solid fa-triangle-exclamation mt-0.5"></i> 
                        <span><strong>Limit Exceeded:</strong> Max monthly payment is ${k(a)}. This loan requires ${k(o.monthlyPayment)}.</span>
                    </div>`:""}
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Period (Months)</label>
                    <select id="loan-period" class="w-full border-gray-300 rounded-md focus:ring-brand-accent">
                        <option value="1" ${r==1?"selected":""}>1 Month</option>
                        ${n.loanConfig.maxAllowedPeriod>1?`
                            <option value="3" ${r==3?"selected":""}>3 Months</option>
                            <option value="6" ${r==6?"selected":""}>6 Months</option>
                            <option value="12" ${r==12?"selected":""}>12 Months</option>
                        `:""}
                    </select>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">First Repayment Date</label>
                    <input type="date" id="loan-start-date" class="w-full border-gray-300 rounded-md focus:ring-brand-accent" 
                        value="${d?d instanceof Date?d.toISOString().split("T")[0]:d.split("T")[0]:""}">
                    <div id="date-error-msg" class="${(m==null?void 0:m.valid)===!1?"":"hidden"} text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                        <i class="fa-solid fa-circle-exclamation"></i> <span id="error-text">${(m==null?void 0:m.reason)||""}</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-800 text-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                <div>
                    <h4 class="text-gray-400 text-sm uppercase tracking-wider mb-2">Quote Summary</h4>
                    <div class="flex justify-between items-end border-b border-gray-700 pb-4 mb-4">
                        <span class="text-3xl font-bold text-white">${k(s)}</span>
                        <span class="text-gray-400 mb-1">Principal</span>
                    </div>
                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400">Total Annual Rate</span> 
                            <span class="text-lg font-bold text-orange-400">${(o.totalRate*100).toFixed(0)}%</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 pl-4 py-2 bg-gray-900/50 rounded border-l-2 border-orange-500/50">
                            <div>
                                <span class="block text-[10px] uppercase text-gray-500 font-bold">Interest</span>
                                <span class="text-white font-medium">${(o.interestPortion*100).toFixed(1)}%</span>
                            </div>
                            <div>
                                <span class="block text-[10px] uppercase text-gray-500 font-bold">Initiation</span>
                                <span class="text-white font-medium">${(o.initiationRate*100).toFixed(0)}%</span>
                            </div>
                        </div>
                        <div class="flex justify-between mt-4">
                            <span class="text-gray-400">Duration</span> 
                            <span>${r} Month${r>1?"s":""}</span>
                        </div>
                        <div class="flex justify-between border-t border-gray-600 pt-2">
                            <span class="text-gray-300 font-semibold">Total Interest</span> 
                            <span class="font-bold">${k(o.totalInterest)}</span>
                        </div>
                    </div>
                </div>
                <div class="mt-6 pt-4 border-t border-gray-700">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400 font-medium">Total Repayment</span>
                        <span class="text-xl font-bold text-green-400">${k(o.totalRepayment)}</span>
                    </div>
                    <div class="flex justify-between items-center mt-1">
                        <span class="text-xs text-gray-500">Monthly Installment</span>
                        <span class="text-sm ${u?"text-red-400 font-bold":"text-gray-300"}">${k(o.monthlyPayment)}</span>
                    </div>
                </div>
            </div>
        </div>`;const f=document.getElementById("wizard-next-btn");f&&(f.disabled=!1,f.onclick=()=>{const g=document.getElementById("loan-start-date").value,p=W(g);if(!g)return y("Please select a first repayment date.","warning");if(!p.valid)return y(`Invalid Date: ${p.reason}`,"error");if(u)return y(`Loan Unaffordable: Max allowed is R ${i.toLocaleString()}`,"error");if(s<100)return y("Minimum loan amount is R 100.00","warning");A()});const b=g=>{const p=g.target.id,v=g.target.value;p==="loan-amount"&&(n.loanConfig.amount=Number(v)),p==="loan-period"&&(n.loanConfig.period=Number(v)),p==="loan-start-date"&&(n.loanConfig.startDate=v),p==="loan-reason"&&(n.loanConfig.reason=v),X(e)};["loan-amount","loan-period","loan-start-date","loan-reason"].forEach(g=>{const p=document.getElementById(g);p&&p.addEventListener("change",b)})}async function ee(e){var d,o;if(!n.targetUser)return;const{data:{session:t}}=await h.auth.getSession(),a=(d=t==null?void 0:t.user)==null?void 0:d.id;if(!a){y("Error: Could not identify Admin user","error");return}let s=(o=n.creditCheck)==null?void 0:o.applicationId;if(!s)try{const{data:c,error:i}=await h.from("loan_applications").insert([{user_id:n.targetUser.id,status:"STARTED",amount:n.loanConfig.amount||0,term_months:n.loanConfig.period||1,purpose:"In-branch",source:"IN_BRANCH",created_by_admin:a}]).select().single();if(i)throw i;s=c.id,n.creditCheck.applicationId=s}catch(c){console.error(c)}e.innerHTML=`
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-gray-200 mt-4">
            <h3 class="text-lg font-bold text-gray-800 mb-6">Required Documents</h3>
            <div class="space-y-4" id="docs-list"><div class="p-4 text-center"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</div></div>
        </div>`;const r=[{key:"idcard",label:"ID Document"},{key:"till_slip",label:"Latest Payslip"},{key:"bank_statement",label:"Bank Statement"}],l=await Promise.all(r.map(async c=>{const{data:i}=await h.from("document_uploads").select("*").eq("user_id",n.targetUser.id).eq("file_type",c.key).order("created_at",{ascending:!1}).limit(1),u=i==null?void 0:i[0],m=!!u,f=m?"text-green-600 bg-green-100":"text-gray-500 bg-gray-200",b=m?"fa-check-circle":"fa-upload";let x="";return u!=null&&u.file_path&&(x=`<button class="text-xs text-blue-600 underline self-center mr-2 view-doc-btn" data-path="${u.file_path}">View</button>`),`
            <div class="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center ${f}"><i class="fa-solid ${b}"></i></div>
                    <div><p class="font-medium text-gray-900">${c.label}</p><p class="text-xs text-gray-500">${m?"Uploaded":"Missing"}</p></div>
                </div>
                <div class="flex gap-2">${x}
                    <label class="cursor-pointer bg-white border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                        ${m?"Replace":"Upload"}
                        <input type="file" class="hidden doc-upload" data-type="${c.key}" accept=".pdf,.jpg,.png,.jpeg">
                    </label>
                </div>
            </div>`}));document.getElementById("docs-list").innerHTML=l.join(""),document.querySelectorAll(".view-doc-btn").forEach(c=>{c.addEventListener("click",async i=>{try{const{data:u,error:m}=await h.storage.from("client_docs").createSignedUrl(i.target.dataset.path,60);if(m)throw m;window.open(u.signedUrl,"_blank")}catch(u){y(u.message,"error")}})}),document.querySelectorAll(".doc-upload").forEach(c=>{c.addEventListener("change",async i=>{const u=i.target.files[0];if(!u)return;const m=i.target.dataset.type,f=i.target.parentElement;f.childNodes[0].textContent="Uploading...";try{const b=u.name.split(".").pop(),x=`${m}_${Date.now()}.${b}`,g=`${a}/${n.targetUser.id}_${x}`,{error:p}=await h.storage.from("client_docs").upload(g,u,{upsert:!0});if(p)throw new Error("Storage: "+p.message);const{error:v}=await h.rpc("register_admin_upload",{p_user_id:n.targetUser.id,p_app_id:s,p_file_name:x,p_original_name:u.name,p_file_path:g,p_file_type:m,p_mime_type:u.type,p_file_size:u.size});if(v)throw new Error("Database: "+v.message);y("Uploaded!","success"),await ee(e)}catch(b){console.error(b),y(b.message,"error")}finally{f.childNodes[0].textContent="Upload"}})})}async function te(e){if(!n.targetUser)return;const{amount:t,period:a,startDate:s}=n.loanConfig,r=n.loanHistoryCount||0,l=q(t,a,s,r),d=n.targetUser.full_name,{data:o}=await h.from("bank_accounts").select("*").eq("user_id",n.targetUser.id),c=s?new Date(s).toLocaleDateString("en-ZA",{day:"numeric",month:"long",year:"numeric"}):"Not set";e.innerHTML=`
        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 mt-4 animate-fade-in">
            <div class="md:col-span-3 space-y-6">
                <div class="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <i class="fa-solid fa-building-columns text-brand-accent"></i> Payout Account
                        </h3>
                        <button id="toggle-new-bank" class="text-xs font-bold text-brand-accent bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">+ ADD NEW</button>
                    </div>
                    
                    <div class="space-y-6">
                        <div>
                            <select id="bank-select" class="w-full border-gray-300 rounded-lg py-3 px-4 bg-white">
                                <option value="">-- Select Verified Account --</option>
                                ${o==null?void 0:o.map(b=>`<option value="${b.id}">${b.bank_name} - ****${b.account_number.slice(-4)}</option>`).join("")}
                            </select>
                        </div>

                        <div id="new-bank-form" class="hidden p-6 bg-gray-900 rounded-2xl border border-gray-700 space-y-4 animate-fade-in">
                            <div class="grid grid-cols-2 gap-4">
                                <input type="text" id="new-bank-name" placeholder="Bank Name" class="bg-gray-800 text-white rounded-lg py-2 px-3">
                                <select id="new-acc-type" class="bg-gray-800 text-white rounded-lg py-2 px-3">
                                    <option value="savings">Savings</option>
                                    <option value="cheque">Cheque</option>
                                </select>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <input type="text" id="new-acc-number" inputmode="numeric" placeholder="Account Number" class="bg-gray-800 text-white rounded-lg py-2 px-3">
                                <input type="text" id="new-branch-code" inputmode="numeric" placeholder="Branch Code" class="bg-gray-800 text-white rounded-lg py-2 px-3">
                            </div>
                            <button id="btn-save-bank" class="w-full bg-brand-accent text-white py-3 rounded-xl font-bold">Link Account</button>
                        </div>
                    </div>
                </div>

                <div id="bank-preview-container" class="hidden p-6 bg-white border-2 border-brand-accent rounded-2xl shadow-lg animate-fade-in">
                    <p class="text-[10px] font-bold text-brand-accent uppercase mb-1">Selected Payout Account</p>
                    <h4 id="preview-bank-name" class="text-xl font-black text-gray-900">---</h4>
                    <p id="preview-acc-number" class="text-sm text-gray-600 font-mono">---</p>
                </div>

                <div class="p-6 bg-orange-50 border border-orange-100 rounded-2xl">
                    <label class="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" id="admin-consent" class="mt-1 w-5 h-5 text-orange-600 rounded border-orange-300">
                        <span class="text-xs text-gray-700 leading-tight">I confirm I have physically verified the identity of <strong>${d}</strong> and confirmed the banking details.</span>
                    </label>
                </div>
            </div>

            <div class="md:col-span-2">
                <div class="bg-gray-800 text-white rounded-2xl shadow-xl overflow-hidden sticky top-4 border border-gray-700">
                    <div class="p-4 bg-gray-900/50 border-b border-gray-700 text-center"><h4 class="text-[10px] font-bold uppercase text-brand-accent">Loan Offer Summary</h4></div>
                    <div class="p-8">
                        <div class="flex justify-between items-end border-b border-gray-700 pb-6 mb-6">
                            <span class="text-4xl font-black text-white">${k(t)}</span>
                            <span class="text-gray-400 text-xs font-bold mb-1 uppercase">Principal</span>
                        </div>
                        <div class="space-y-4 text-sm">
                            <div class="flex justify-between items-center"><span class="text-gray-400">Monthly Payout</span><span class="text-2xl font-black text-brand-accent">${k(l.monthlyPayment)}</span></div>
                            <div class="flex justify-between items-center"><span class="text-gray-400">Total Repayable</span><span class="font-bold text-green-400 text-lg">${k(l.totalRepayment)}</span></div>
                            <div class="flex justify-between pt-2 border-t border-gray-700"><span class="text-gray-400">Term Duration</span><span class="font-medium">${a} Month${a>1?"s":""}</span></div>
                            <div class="flex justify-between"><span class="text-gray-400">First Debit Date</span><span class="font-bold text-orange-300">${c}</span></div>
                        </div>
                    </div>
                    <div class="p-6 bg-gray-900/80 border-t border-gray-700">
                        <button id="wizard-next-btn" class="w-full bg-brand-accent hover:bg-orange-600 text-white py-4 rounded-xl font-black text-lg shadow-2xl transition-all disabled:opacity-50">SUBMIT APPLICATION</button>
                        <p class="text-[9px] text-gray-500 mt-4 italic text-center uppercase tracking-tighter">
                            ${n.creditCheck.applicationId?`Managing Application #${n.creditCheck.applicationId}`:"New Loan Application"}
                        </p>
                    </div>
                </div>
            </div>
        </div>`;const i=document.getElementById("bank-select"),u=document.getElementById("new-bank-form"),m=document.getElementById("bank-preview-container"),f=()=>{const b=i.value,x=!u.classList.contains("hidden");if(!b&&!x){m.classList.add("hidden");return}if(m.classList.remove("hidden"),x)document.getElementById("preview-bank-name").innerText=document.getElementById("new-bank-name").value||"...",document.getElementById("preview-acc-number").innerText=document.getElementById("new-acc-number").value||"...";else{const g=o.find(p=>p.id==b);g&&(document.getElementById("preview-bank-name").innerText=g.bank_name,document.getElementById("preview-acc-number").innerText=g.account_number)}};document.getElementById("toggle-new-bank").onclick=()=>{u.classList.toggle("hidden"),i.value="",f()},i.onchange=()=>{u.classList.add("hidden"),f()},["new-bank-name","new-acc-number"].forEach(b=>document.getElementById(b).oninput=f),document.getElementById("admin-consent").onchange=b=>{document.getElementById("wizard-next-btn").disabled=!b.target.checked},document.getElementById("wizard-next-btn").onclick=ne,document.getElementById("btn-save-bank").onclick=async()=>{const b={user_id:n.targetUser.id,bank_name:document.getElementById("new-bank-name").value,account_holder:d,account_number:document.getElementById("new-acc-number").value,branch_code:document.getElementById("new-branch-code").value,account_type:document.getElementById("new-acc-type").value,is_verified:!0,created_by_admin:(await h.auth.getUser()).data.user.id},{data:x,error:g}=await h.from("bank_accounts").insert([b]).select().single();g||(await te(e),document.getElementById("bank-select").value=x.id,f())}}function A(){n.step<7&&(n.step++,j())}document.addEventListener("click",e=>{e.target.id==="wizard-prev-btn"&&n.step>1&&(n.step--,j());const t=e.target.closest("#back-to-list-btn");t&&(t.dataset.confirming?(document.getElementById("in-branch-view").classList.add("hidden"),document.getElementById("applications-list-view").classList.remove("hidden"),t.dataset.confirming="",t.innerHTML='<i class="fa-solid fa-arrow-left"></i> Cancel',t.classList.remove("text-red-600","font-bold")):(t.dataset.confirming="true",t.innerHTML='<i class="fa-solid fa-triangle-exclamation"></i> Click again to Confirm',t.classList.add("text-red-600","font-bold"),y("Unsaved progress will be lost. Click again to exit.","warning"),setTimeout(()=>{t.dataset.confirming="",t.innerHTML='<i class="fa-solid fa-arrow-left"></i> Cancel',t.classList.remove("text-red-600","font-bold")},3e3))),(e.target.id==="sign-out-btn"||e.target.closest("#sign-out-btn"))&&(e.preventDefault(),h.auth.signOut().then(()=>{localStorage.clear(),sessionStorage.clear(),window.location.href="/"}))});async function ke(){const e=document.getElementById("sync-offered-btn");if(e&&confirm("Sync all OFFERED applications?")){e.disabled=!0,e.innerHTML="Syncing...";try{await le(),y("Synced!","success"),await ae()}catch(t){y(t.message,"error")}finally{e.disabled=!1,e.innerHTML="Sync Offered"}}}const Be=e=>{const t=document.getElementById("applications-table-body"),a=document.getElementById("visible-count");if(t){if(a&&(a.textContent=e.length),e.length===0){t.innerHTML='<tr><td colspan="5" class="p-10 text-center text-sm text-gray-400">No applications match your criteria.</td></tr>';return}t.innerHTML=e.map(s=>{var r,l;return`
        <tr class="hover:bg-gray-50 transition-colors group">
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold mr-3 border border-gray-200 bg-gray-100 text-gray-500">
                        ${(((r=s.profiles)==null?void 0:r.full_name)||"A").charAt(0)}
                    </div>
                    <div>
                        <div class="text-sm font-bold text-gray-900">${((l=s.profiles)==null?void 0:l.full_name)||"N/A"}</div>
                        <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">ID: ${s.id}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm font-mono font-medium text-gray-900">${k(s.amount)}</div>
            </td>
            <td class="px-6 py-4">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border border-transparent ${Z(s.status)}">
                    ${s.status}
                </span>
            </td>
            <td class="px-6 py-4">
                <div class="text-xs text-gray-500 font-medium">${Y(s.created_at)}</div>
            </td>
            <td class="px-6 py-4 text-right">
                <a href="/admin/application-detail?id=${s.id}" 
                   class="text-gray-400 hover:text-orange-600 transition-colors p-2 rounded-full hover:bg-orange-50 inline-block">
                    <i class="fa-solid fa-eye"></i>
                </a>
            </td>
        </tr>
    `}).join("")}},Ce=e=>{const t=document.getElementById("search-suggestions");if(t){if(e.length===0){t.innerHTML="",t.classList.add("hidden");return}t.innerHTML=e.map(a=>{var s;return`
        <a href="/admin/application-detail?id=${a.id}" class="block p-3 hover:bg-orange-50 cursor-pointer border-b border-gray-200 last:border-b-0">
            <p class="font-semibold text-gray-800">${((s=a.profiles)==null?void 0:s.full_name)||"N/A"}</p>
            <p class="text-xs text-gray-500">ID: ${a.id} | Status: ${a.status}</p>
        </a>
    `}).join(""),t.classList.remove("hidden")}},N=(e=!0)=>{var c,i,u;e&&(B=1);const t=((c=document.getElementById("search-input"))==null?void 0:c.value.toLowerCase().trim())||"",a=((i=document.getElementById("status-filter"))==null?void 0:i.value)||"all",s=G.filter(m=>{var g;const f=a==="all"||m.status===a,b=!t||(((g=m.profiles)==null?void 0:g.full_name)||"").toLowerCase().includes(t)||String(m.id).toLowerCase().includes(t)||String(m.amount).includes(t);let x=!1;return H==="super_admin"?x=!0:x=m.branch_id===(L==null?void 0:L.branch_id),f&&b&&x}),r=Math.ceil(s.length/U)||1,l=(B-1)*U,d=s.slice(l,l+U);Be(d),Ae(r,s.length);const o=document.getElementById("search-input");document.activeElement===o&&t.length>1?Ce(s.slice(0,5)):(u=document.getElementById("search-suggestions"))==null||u.classList.add("hidden")};async function ae(){const{data:e,error:t}=await de();t?console.error(t):(G=e,N())}function Le(){var e,t,a,s;(e=document.getElementById("search-input"))==null||e.addEventListener("input",()=>N(!0)),(t=document.getElementById("status-filter"))==null||t.addEventListener("change",()=>N(!0)),(a=document.getElementById("create-app-btn"))==null||a.addEventListener("click",he),(s=document.getElementById("sync-offered-btn"))==null||s.addEventListener("click",ke),document.addEventListener("click",r=>{const l=document.getElementById("search-suggestions");l&&!document.getElementById("search-input").contains(r.target)&&!l.contains(r.target)&&l.classList.add("hidden")})}document.addEventListener("DOMContentLoaded",async()=>{const e=await re();if(e){H=e.role;const[t,a]=await Promise.all([ie(),oe()]);L=t,V=a||[],ye(),await ae()}});async function ne(){var t;const e=document.getElementById("wizard-next-btn");if(e){e.disabled=!0,e.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Processing...';try{const{amount:a,period:s,startDate:r}=n.loanConfig,l=n.loanHistoryCount||0,d=q(a,s,r,l);let o=document.getElementById("bank-select").value;if(o==="new"){const u={user_id:n.targetUser.id,bank_name:document.getElementById("new-bank-name").value,account_holder:n.targetUser.full_name,account_number:document.getElementById("new-account-number").value,branch_code:document.getElementById("new-branch-code").value,account_type:document.getElementById("new-account-type").value.toLowerCase(),is_verified:!0,created_by_admin:(await h.auth.getUser()).data.user.id},{data:m,error:f}=await h.from("bank_accounts").insert([u]).select().single();if(f)throw new Error("Bank Save Failed: "+f.message);o=m.id}if(!o)throw new Error("Please select or add a bank account.");const c={status:"AFFORD_OK",amount:a,term_months:s,bank_account_id:o,updated_at:new Date().toISOString(),offer_principal:a,offer_interest_rate:d.totalRate,offer_total_interest:d.totalInterest,offer_total_initiation_fees:d.totalInitiationFees,offer_monthly_repayment:d.monthlyPayment,offer_total_repayment:d.totalRepayment,offer_total_admin_fees:d.totalMonthlyFees,branch_id:((t=n.targetUser)==null?void 0:t.branch_id)||(L==null?void 0:L.branch_id),offer_details:{first_repayment_date:r,interest_portion:d.interestPortion,initiation_rate:d.initiationRate,source:"In-Branch Admin Terminal"},notes:`In-branch application for ${n.targetUser.full_name}. Verified by Admin.`},{error:i}=await h.from("loan_applications").update(c).eq("id",n.creditCheck.applicationId);if(i)throw i;y("Application Submitted Successfully!","success"),setTimeout(()=>window.location.reload(),1500)}catch(a){console.error("Submission Error:",a),y(a.message,"error"),e.disabled=!1,e.innerHTML="Submit Application"}}}function Ae(e,t){let a=document.getElementById("app-pagination-container");const s=document.getElementById("applications-list-view"),r=document.getElementById("visible-count");if(r&&(r.textContent=t),a||(a=document.createElement("div"),a.id="app-pagination-container",a.className="flex justify-between items-center p-4 border-t border-gray-100 bg-gray-50/50",s.appendChild(a)),e<=1){a.innerHTML='<span class="text-xs text-gray-400">Showing all records</span>';return}a.innerHTML=`
        <span class="text-xs font-bold text-gray-500 uppercase tracking-tight">Page ${B} of ${e}</span>
        <div class="flex gap-2">
            <button onclick="window.changePageApps(${B-1})" ${B===1?"disabled":""} 
                class="px-4 py-2 text-xs font-bold border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm">
                Prev
            </button>
            <button onclick="window.changePageApps(${B+1})" ${B===e?"disabled":""} 
                class="px-4 py-2 text-xs font-bold border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm">
                Next
            </button>
        </div>
    `}window.changePageApps=e=>{B=e,N(!1)};
