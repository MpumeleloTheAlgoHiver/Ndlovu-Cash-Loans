import{s as b}from"./supabaseClient-CMKDwqD5.js";import{i as ee}from"./layout-Cn9C-WTG.js";/* empty css               */import{b as h,a as g}from"./utils-D6Z1B7Jq.js";import{w as S,x as te,y as ae,v as se,z as ne}from"./dataService-CluSniSs.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm";const R="/api/docuseal",re=void 0;function J(){return!!re}async function oe(e,t){try{if(!J())throw new Error("DocuSeal integration is disabled");const a=await fetch(`${R}/send-contract`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({applicationData:e,profileData:t})});if(!a.ok){const r=await a.json().catch(()=>({}));throw console.error("DocuSeal proxy error:",a.status,r),new Error(r.error||r.message||`Failed to send contract: ${a.status}`)}const s=await a.json();if(!s||!Array.isArray(s)||s.length===0)throw new Error("Invalid response from DocuSeal API");const n=s[0];return await le(n,e.id),{submission_id:n.submission_id,submitter_id:n.id,slug:n.slug,status:n.status,embed_src:n.embed_src,email:n.email}}catch(a){throw console.error("DocuSeal send contract error:",a),a}}async function ie(e){try{const t=await fetch(`${R}/submissions/${e}`);if(!t.ok){const a=await t.json().catch(()=>({}));throw new Error(a.error||a.message||`Failed to fetch submission status: ${t.status}`)}return await t.json()}catch(t){throw console.error("DocuSeal get status error:",t),t}}async function de(e){try{const{data:t,error:a}=await b.from("docuseal_submissions").select("*").eq("application_id",e).order("created_at",{ascending:!1});if(a)throw a;return t||[]}catch(t){return console.error("Error fetching submissions:",t),[]}}async function le(e,t){try{const{error:a}=await b.from("docuseal_submissions").insert({application_id:t,submission_id:e.submission_id,submitter_id:e.id,slug:e.slug,status:e.status||"pending",email:e.email,name:e.name,role:e.role,embed_src:e.embed_src,sent_at:e.sent_at,opened_at:e.opened_at,completed_at:e.completed_at,metadata:e.metadata||{},created_at:new Date().toISOString()});if(a)throw a}catch(a){throw console.error("Error saving submission to database:",a),a}}async function ce(e,t,a={}){try{const{error:s}=await b.from("docuseal_submissions").update({status:t,...a,updated_at:new Date().toISOString()}).eq("submission_id",e);if(s)throw s}catch(s){throw console.error("Error updating submission status:",s),s}}async function ue(e,t,a={}){try{const{error:s}=await b.from("docuseal_submissions").update({status:t,...a,updated_at:new Date().toISOString()}).eq("submitter_id",e);if(s)throw s}catch(s){throw console.error("Error updating submitter status:",s),s}}function me(e){return`https://docuseal.co/s/${e}`}async function ge(e,t={}){try{const a=await fetch(`${R}/submitters/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({send_email:!0,...t})});if(!a.ok){const n=await a.json().catch(()=>({}));throw new Error(n.error||n.message||`Failed to resend contract: ${a.status}`)}const s=await a.json();return await ue(e,s.status,{sent_at:s.sent_at}),s}catch(a){throw console.error("DocuSeal resend error:",a),a}}async function be(e){try{const t=await fetch(`${R}/submissions/${e}`,{method:"DELETE"});if(!t.ok){const s=await t.json().catch(()=>({}));throw new Error(s.error||s.message||`Failed to archive submission: ${t.status}`)}const a=await t.json();return await ce(e,"archived",{archived_at:a.archived_at}),a}catch(t){throw console.error("DocuSeal archive error:",t),t}}async function pe(e,t=null){try{const a=await ie(e);if(!a.submitters||a.submitters.length===0)throw new Error("No submitters found for this submission");if(t){const s=a.submitters.find(n=>n.email===t);if(!s)throw new Error(`No submitter found with email: ${t}`);return s.id}return a.submitters[0].id}catch(a){throw console.error("Error getting submitter ID:",a),a}}let i=null,A=null,K=!1,L=null,D=null,k=!1,M=!1;const fe=5e3,xe=[{value:"STARTED",label:"Step 1: New Application"},{value:"BANK_LINKING",label:"Bank Analysis"},{value:"AFFORD_OK",label:"Step 3: Affordability OK"},{value:"AFFORD_REFER",label:"Affordability Refer"},{value:"OFFERED",label:"Step 4: Contract Sent"},{value:"OFFER_ACCEPTED",label:"Contract Signed"},{value:"READY_TO_DISBURSE",label:"Step 6: Queue Disburse"},{value:"DECLINED",label:"Declined"}],ye=`
<div id="application-detail-content" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div id="loading-state" class="text-center p-20">
    <i class="fa-solid fa-circle-notch fa-spin text-4xl text-orange-600"></i>
    <p class="mt-4 text-gray-600 font-medium animate-pulse">Loading Complete Application Data...</p>
  </div>

  <div id="page-header" class="mb-8 hidden animate-fade-in">
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
       <a href="/admin/applications" class="hover:text-orange-600 transition-colors">Applications</a>
       <i class="fa-solid fa-chevron-right text-xs text-gray-400"></i>
       <span id="breadcrumb-name" class="font-medium text-gray-900">Applicant</span>
    </nav>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
       <div>
         <h1 id="applicant-name-header" class="text-3xl font-extrabold text-gray-900 tracking-tight">Loading...</h1>
         <div class="flex items-center gap-3 mt-2">
            <p class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-mono">ID: <span id="header-id-val">...</span></p>
            <span id="header-date" class="text-sm text-gray-500"></span>
         </div>
       </div>
       <span id="header-status-badge" class="px-5 py-2 text-sm font-bold rounded-full bg-gray-200 text-gray-700 shadow-sm uppercase tracking-wide">Status</span>
    </div>
  </div>

  <div id="content-grid" class="grid grid-cols-1 lg:grid-cols-12 gap-8 hidden animate-slide-up">
    
    <div class="lg:col-span-8 flex flex-col gap-6">
      
       <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         <div class="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
            <button class="tab-btn active flex-1 py-4 px-4 text-sm font-bold text-center border-b-2 border-orange-600 text-orange-600 bg-orange-50/50 transition-all whitespace-nowrap" data-tab="personal">Personal</button>
            <button class="tab-btn flex-1 py-4 px-4 text-sm font-medium text-center border-b-2 border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all whitespace-nowrap" data-tab="financial">Financial & Credit</button>
            <button class="tab-btn flex-1 py-4 px-4 text-sm font-medium text-center border-b-2 border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all whitespace-nowrap" data-tab="documents">Documents</button>
            <button class="tab-btn flex-1 py-4 px-4 text-sm font-medium text-center border-b-2 border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all whitespace-nowrap" data-tab="loan">Loan & History</button>
         </div>
       </div>

       <div id="tab-contents" class="relative min-h-[400px]">
       
          <div id="personal-tab" class="tab-pane bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
             <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="fa-solid fa-user-circle text-gray-400"></i> Personal Information
             </h3>
             
             <div class="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-100">
                <div class="shrink-0 mx-auto md:mx-0">
                   <div class="w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                      <img id="profile-image" src="" alt="Profile" class="w-full h-full object-cover" onerror="this.src='https://ui-avatars.com/api/?name=User&background=random'">
                   </div>
                </div>
                <div class="flex-grow grid grid-cols-1 gap-y-5">
                   <div class="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                      <span class="text-sm font-medium text-gray-500">Full Name</span>
                      <div class="sm:col-span-2">
                         <div id="detail-fullname" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-semibold"></div>
                      </div>
                   </div>
                   <div class="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                      <span class="text-sm font-medium text-gray-500">Email Address</span>
                      <div class="sm:col-span-2">
                         <div id="detail-email" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm"></div>
                      </div>
                   </div>
                   <div class="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                      <span class="text-sm font-medium text-gray-500">Mobile Number</span>
                      <div class="sm:col-span-2">
                         <div id="detail-mobile" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm"></div>
                      </div>
                   </div>
                </div>
             </div>
             <h4 class="text-md font-bold text-gray-900 mb-4">Linked Bank Accounts</h4>
             <div id="bank-accounts-container" class="space-y-3">
                </div>
          </div>

          <div id="financial-tab" class="tab-pane hidden bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
             <h3 class="text-lg font-bold text-gray-900 mb-6">Financial Snapshot</h3>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="p-5 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 shadow-sm">
                   <div class="flex items-center gap-3 mb-2">
                      <div class="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center"><i class="fa-solid fa-arrow-trend-up"></i></div>
                      <span class="text-xs font-bold text-green-700 uppercase tracking-wider">Monthly Income</span>
                   </div>
                   <div id="fin-income" class="text-2xl font-bold text-gray-900">R 0.00</div>
                </div>
                <div class="p-5 bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-100 shadow-sm">
                   <div class="flex items-center gap-3 mb-2">
                      <div class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"><i class="fa-solid fa-arrow-trend-down"></i></div>
                      <span class="text-xs font-bold text-red-700 uppercase tracking-wider">Monthly Expenses</span>
                   </div>
                   <div id="fin-expenses" class="text-2xl font-bold text-gray-900">R 0.00</div>
                </div>
             </div>
             <div class="pt-8 border-t border-gray-100">
                <div class="flex justify-between items-center mb-6">
                   <h4 class="text-lg font-bold text-gray-900">Credit Bureau Report</h4>
                   <div class="flex items-center gap-3">
                      <span id="credit-date" class="text-sm text-gray-500 font-medium"></span>
                      <button id="btn-download-xml" class="hidden text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium flex items-center gap-2">
                         <i class="fa-solid fa-file-code"></i> Download XML
                      </button>
                   </div>
                </div>
                <div id="credit-check-content" class="bg-gray-50/50 rounded-2xl border border-gray-200 overflow-hidden">
                   </div>
             </div>
          </div>

          <div id="documents-tab" class="tab-pane hidden bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
             <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-gray-900">All User Documents</h3>
                <span id="doc-count" class="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-md">0</span>
             </div>
             <div id="documents-list" class="grid grid-cols-1 gap-4">
                </div>
          </div>

          <div id="loan-tab" class="tab-pane hidden bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
             <h3 class="text-lg font-bold text-gray-900 mb-6">Current Application Data</h3>
             <div class="space-y-6 mb-10">
                <div class="grid grid-cols-1 sm:grid-cols-3 items-center border-b border-gray-50 pb-4">
                   <span class="text-sm font-medium text-gray-500">Application ID</span>
                   <div class="sm:col-span-2 font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded-md inline-block border border-gray-200" id="detail-app-id"></div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 items-center border-b border-gray-50 pb-4">
                   <span class="text-sm font-medium text-gray-500">Submitted Date</span>
                   <div class="sm:col-span-2 text-sm text-gray-900" id="detail-date"></div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 items-center border-b border-gray-50 pb-4">
                   <span class="text-sm font-medium text-gray-500">Loan Purpose</span>
                   <div class="sm:col-span-2 text-sm text-gray-900 font-medium" id="detail-purpose"></div>
                </div>
                <div class="pt-2">
                   <label class="text-sm font-medium text-gray-700 block mb-2">Admin Notes</label>
                   
                   <textarea id="detail-notes" class="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-gray-700 h-32 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none" placeholder="Add internal notes here..."></textarea>
                   <div class="mt-2 text-right">
                       <button id="btn-save-notes" class="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-black transition-all shadow-sm">
                           <i class="fa-solid fa-floppy-disk mr-1"></i> Save Notes
                       </button>
                   </div>

                </div>
             </div>
             
             <h3 class="text-lg font-bold text-gray-900 mb-4 border-t border-gray-100 pt-8">Client History</h3>
             <div class="mb-6">
                <h4 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Previous Loans</h4>
                <div id="loan-history-list" class="space-y-2">
                   <p class="text-sm text-gray-400 italic">No previous loan history found.</p>
                </div>
             </div>
             <div>
                <h4 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Other Applications</h4>
                <div id="app-history-list" class="space-y-2">
                   <p class="text-sm text-gray-400 italic">No other applications on record.</p>
                </div>
             </div>
          </div>
       </div>

           <div id="contract-status-card" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2 text-xs uppercase tracking-wider">
              <i class="fa-solid fa-file-signature text-orange-600"></i> Contract Status
            </h3>
            <div id="contract-status-empty" class="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-6 text-center">
              No contracts sent yet.
            </div>
            <div id="contract-status-section" class="hidden mt-4 border-t border-gray-100 pt-4">
              <h4 class="text-xs font-bold text-gray-400 uppercase mb-3">History</h4>
              <div id="contract-status-content" class="space-y-2">
                </div>
            </div>
           </div>
    </div>

    <div class="lg:col-span-4">
       <div class="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 sticky top-28 overflow-hidden">
          <div class="p-6 border-b border-gray-100 bg-gray-50/50">
             <h3 class="font-bold text-gray-900">Loan Status</h3>
             <div id="status-alert" class="mt-3 p-3 rounded-lg text-xs font-medium leading-relaxed hidden animate-pulse">
                </div>
          </div>

          <div class="p-6 space-y-6">
             <div>
                <label class="text-xs text-gray-500 uppercase font-bold tracking-wider">Requested Amount</label>
                <div id="sidebar-amount" class="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">R 0.00</div>
             </div>
             <div>
                <label class="text-xs text-gray-500 uppercase font-bold tracking-wider">Term Length</label>
                <div class="mt-2 flex items-center gap-2">
                   <div class="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center"><i class="fa-regular fa-calendar"></i></div>
                   <div id="sidebar-term" class="text-lg font-semibold text-gray-800">0 Months</div>
                </div>
             </div>

             <div>
                <label class="text-xs text-gray-500 uppercase font-bold tracking-wider">Est. Monthly Payment</label>
                <div class="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                   <div id="sidebar-payment" class="text-xl font-bold text-gray-800">R 0.00</div>
                   <div class="text-xs text-gray-400 mt-1">(Principal Only)</div>
                </div>
             </div>

             <div id="financial-breakdown" class="pt-4 border-t border-gray-100 space-y-4">
                </div>

             <div>
                <label class="text-xs text-gray-500 uppercase font-bold tracking-wider">Current Status</label>
                <div id="sidebar-status" class="mt-2 text-lg font-bold text-orange-600">Pending</div>
             </div>
          </div>
          
          <div class="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-3" id="action-buttons-container">
              </div>

          <div class="p-6 bg-white border-t border-gray-200">
              <label class="text-xs font-bold text-gray-400 uppercase mb-2 block">Manual Override (Restricted)</label>
              <div class="flex gap-2">
                  <select id="status-override-select" class="flex-1 text-xs border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500">
                      ${xe.map(e=>`<option value="${e.value}">${e.label}</option>`).join("")}
                  </select>
                  <button id="manual-update-btn" onclick="manualStatusChange()" class="px-3 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-black transition">
                      Update
                  </button>
              </div>
              <p id="override-hint" class="text-[10px] text-gray-400 mt-1 italic">Use only for corrections. Bureau statuses locked.</p>
          </div>

       </div>
    </div>
  </div>

  <div id="feedback-container" class="fixed bottom-6 right-6 z-50 hidden"></div>
</div>
`,O=e=>{if(!e)return"bg-gray-100 text-gray-800 border border-gray-200";switch(e){case"READY_TO_DISBURSE":case"approved":case"DISBURSED":case"AFFORD_OK":case"BUREAU_OK":return"bg-green-100 text-green-800 border border-green-200";case"declined":case"DECLINED":case"AFFORD_FAIL":return"bg-red-100 text-red-800 border border-red-200";case"OFFERED":case"OFFER_ACCEPTED":return"bg-purple-100 text-purple-800 border border-purple-200";default:return"bg-yellow-100 text-yellow-800 border border-yellow-200"}},N=e=>{const t=document.getElementById("header-status-badge");!t||!e||(t.textContent=e,t.className=`px-4 py-1.5 text-sm font-bold rounded-full shadow-sm ${O(e)}`)};window.viewBureauReport=e=>{try{const t=atob(e),a=new Array(t.length);for(let o=0;o<t.length;o++)a[o]=t.charCodeAt(o);const s=new Uint8Array(a),n=new Blob([s],{type:"application/pdf"}),r=URL.createObjectURL(n);window.open(r,"_blank")}catch(t){console.error("PDF Render Error:",t),alert("Unable to display the PDF format. Please ensure the bureau data is valid.")}};const m=(e,t="success")=>{const a=document.getElementById("feedback-container");if(!a)return;const s=t==="success";a.innerHTML=`
    <div class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${s?"bg-white border-green-100":"bg-white border-red-100"} transform transition-all duration-300">
        <div class="w-8 h-8 rounded-full ${s?"bg-green-100 text-green-600":"bg-red-100 text-red-600"} flex items-center justify-center">
            <i class="fa-solid ${s?"fa-check":"fa-exclamation"}"></i>
        </div>
        <div>
            <p class="text-sm font-bold text-gray-900">${s?"Success":"Error"}</p>
            <p class="text-xs text-gray-500">${e}</p>
        </div>
    </div>
  `,a.classList.remove("hidden"),setTimeout(()=>{a.classList.add("hidden")},5e3)},ve=async()=>{const e=document.getElementById("contract-status-empty"),t=document.getElementById("contract-status-section");if(!J()){F(),t&&t.classList.add("hidden"),e&&(e.classList.remove("hidden"),e.innerHTML=`
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
          <div class="flex items-start gap-3">
            <i class="fa-solid fa-triangle-exclamation text-yellow-600 text-xl mt-0.5"></i>
            <div>
              <h4 class="font-semibold text-yellow-900 mb-1">DocuSeal Not Configured</h4>
              <p class="text-sm text-yellow-700">
                E-signature features are currently disabled. Please configure DocuSeal API credentials to enable contract tracking.
              </p>
            </div>
          </div>
        </div>
      `);return}e&&(e.classList.remove("hidden"),e.textContent="No contracts sent yet."),await B()},he=async(e=null)=>{if(!i||!i.profiles){alert("Error: Application data not loaded");return}const t=e||document.getElementById("btn-send-contract"),a=t?t.innerHTML:"";t&&(t.disabled=!0,t.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Sending...');try{const s=await oe(i,i.profiles);alert(`✅ Contract sent successfully to ${i.profiles.email}`),await S(i.id,"OFFERED"),await B(),await x()}catch(s){console.error("Send contract error:",s),alert(`❌ Failed to send contract: ${s.message}`)}finally{t&&(t.disabled=!1,t.innerHTML=a)}},we=()=>{window.open("https://docuseal.co/templates/your_template_id","_blank")},Ee=()=>{if(!i)return!1;const e=i.status||"";return["OFFERED"].includes(e)},_e=()=>{D||!Ee()||(D=setInterval(()=>{B(!0)},fe))},F=()=>{D&&(clearInterval(D),D=null)},Se=async()=>{if(!(M||k||!i)){M=!0,k=!0,F();try{if(i.status!=="OFFER_ACCEPTED"){const{error:e}=await S(i.id,"OFFER_ACCEPTED");if(e){console.error("Auto advance to Contract Signed failed:",e),k=!1;return}i.status="OFFER_ACCEPTED",i.contract_signed_at=new Date().toISOString()}T(i),N("OFFER_ACCEPTED"),m("Contract signed! Advanced to approval phase.","success"),await x()}catch(e){console.error("handleContractCompleted error:",e),k=!1}finally{M=!1}}},B=async(e=!1)=>{var t,a,s;if(i!=null&&i.id)try{const n=await de(i.id),r=document.getElementById("contract-status-section"),o=document.getElementById("contract-status-empty");if(n.length===0){r&&r.classList.add("hidden"),o&&(o.classList.remove("hidden"),o.textContent="No contracts sent yet."),F(),z(!1);return}o&&o.classList.add("hidden"),r&&r.classList.remove("hidden"),Ce(n);const d=((s=(a=(t=n[0])==null?void 0:t.status)==null?void 0:a.toLowerCase)==null?void 0:s.call(a))||"";z(d==="declined"),d==="completed"&&!k?await Se():d!=="completed"&&!e&&_e()}catch(n){console.error("Load contract status error:",n)}},Ce=e=>{const t=document.getElementById("contract-status-content");t&&(t.innerHTML=e.map(a=>{const s=Ie(a.status),n=Le(a.status);return`
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg ${s.bg} ${s.text} flex items-center justify-center">
              <i class="${n}"></i>
            </div>
            <div>
              <div class="font-semibold text-gray-900 text-sm">Contract #${a.submission_id.slice(-8)}</div>
              <div class="text-xs text-gray-500">Sent ${h(a.created_at)}</div>
            </div>
          </div>
          <span class="px-3 py-1 text-xs font-bold rounded-full ${s.badge}">${a.status}</span>
        </div>
        <div class="flex gap-2">
          <button onclick="window.viewSubmission('${a.slug}')" class="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs font-semibold">
            <i class="fa-solid fa-eye mr-1"></i> View
          </button>
          ${a.status==="pending"?`
            <button onclick="window.resendSubmission('${a.submitter_id}', '${a.submission_id}')" class="flex-1 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 text-xs font-semibold">
              <i class="fa-solid fa-paper-plane mr-1"></i> Resend
            </button>
          `:""}
          ${a.status!=="completed"&&a.status!=="voided"?`
            <button onclick="window.voidSubmission('${a.submission_id}')" class="px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 text-xs font-semibold">
              <i class="fa-solid fa-ban mr-1"></i> Void
            </button>
          `:""}
        </div>
      </div>
    `}).join(""))},z=e=>{if(typeof e!="boolean"||!i||e===K)return;K=e;const t="contract-declined-banner",a=document.getElementById(t),s=document.getElementById("contract-status-card");if(e){if(!L&&i.status!=="DECLINED"&&(L=i.status),i.status="DECLINED",N("DECLINED"),T(i),!a&&s){const n=document.createElement("div");n.id=t,n.className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2",n.innerHTML=`
        <i class="fa-solid fa-circle-xmark text-red-500"></i>
        <span>Contract was declined by the applicant.</span>
      `;const r=s.querySelector("h3");r&&r.parentNode?r.parentNode.insertBefore(n,r.nextSibling):s.prepend(n)}}else a&&a.remove(),L&&(i.status=L),L=null,T(i),N(i.status)},Ie=e=>{const t=(e||"").toLowerCase(),a={pending:{bg:"bg-yellow-100",text:"text-yellow-600",badge:"bg-yellow-100 text-yellow-700"},completed:{bg:"bg-green-100",text:"text-green-600",badge:"bg-green-100 text-green-700"},expired:{bg:"bg-red-100",text:"text-red-600",badge:"bg-red-100 text-red-700"},voided:{bg:"bg-gray-100",text:"text-gray-600",badge:"bg-gray-100 text-gray-700"},declined:{bg:"bg-red-100",text:"text-red-600",badge:"bg-red-100 text-red-700"}};return a[t]||a.pending},Le=e=>{const t=(e||"").toLowerCase(),a={pending:"fa-solid fa-clock",completed:"fa-solid fa-check-circle",expired:"fa-solid fa-exclamation-circle",voided:"fa-solid fa-ban",declined:"fa-solid fa-circle-xmark"};return a[t]||a.pending};window.viewSubmission=e=>{window.open(me(e),"_blank")};window.resendSubmission=async(e,t=null)=>{if(confirm("Resend contract email to the applicant?"))try{let a=e;if(!a){if(!t)throw new Error("Unable to determine DocuSeal submitter");a=await pe(t)}await ge(a),alert("✅ Contract email resent successfully"),await B()}catch(a){alert(`❌ Failed to resend: ${a.message}`)}};window.voidSubmission=async e=>{if(confirm("Void this contract submission? This cannot be undone."))try{await be(e),alert("✅ Submission voided successfully"),await B()}catch(t){alert(`❌ Failed to void: ${t.message}`)}};window.activateSureSystemsMandate=async()=>{var a,s,n,r;if(!(i!=null&&i.id)){m("Application data is not loaded yet.","error");return}const e=document.getElementById("btn-activate-suresystems"),t=(e==null?void 0:e.innerHTML)||"";try{e&&(e.disabled=!0,e.innerHTML='<i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Activating...');const o=await fetch("/api/suresystems/activate-application",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({applicationId:i.id})}),d=await o.json().catch(()=>({}));if(!o.ok)throw new Error((d==null?void 0:d.error)||(d==null?void 0:d.message)||"Failed to activate SureSystems mandate.");const l=(d==null?void 0:d.applicationId)||i.id,c=(d==null?void 0:d.contractReference)||((a=d==null?void 0:d.data)==null?void 0:a.contractReference)||((s=d==null?void 0:d.mandate)==null?void 0:s.contractReference)||"N/A",u=(d==null?void 0:d.activatedAt)||((n=d==null?void 0:d.data)==null?void 0:n.activatedAt)||((r=d==null?void 0:d.mandate)==null?void 0:r.activatedAt)||new Date().toISOString();m(`SureSystems mandate activated. Application: ${l} | Contract: ${c} | Activated: ${u}`,"success")}catch(o){console.error("SureSystems activation error:",o),m(o.message||"SureSystems activation failed.","error")}finally{e&&(e.disabled=!1,e.innerHTML=t)}};const ke=()=>{const e=document.querySelectorAll(".tab-btn"),t=document.querySelectorAll(".tab-pane");e.forEach(a=>{a.addEventListener("click",()=>{e.forEach(r=>{r.classList.remove("active","text-orange-600","border-orange-600","bg-orange-50/50"),r.classList.add("text-gray-500","border-transparent")}),a.classList.remove("text-gray-500","border-transparent"),a.classList.add("active","text-orange-600","border-orange-600","bg-orange-50/50"),t.forEach(r=>r.classList.add("hidden"));const s=a.getAttribute("data-tab")+"-tab",n=document.getElementById(s);n&&n.classList.remove("hidden")})})};window.updateStatus=async e=>{const{error:t}=await S(i.id,e);t?m(t.message,"error"):(m(`Status updated to ${e}`,"success"),x()),_()};window.declineApplication=async()=>{const{error:e}=await S(i.id,"DECLINED");e?m(e.message,"error"):(m("Application declined.","success"),x()),_()};window.saveNotes=async()=>{const e=document.getElementById("detail-notes").value,t=document.getElementById("btn-save-notes");if(!e.trim())return;const a=t.innerHTML;t.disabled=!0,t.innerHTML='<i class="fa-solid fa-circle-notch fa-spin mr-1"></i> Saving...';try{const{error:s}=await te(i.id,e);if(s)throw s;m("Notes saved successfully","success"),t.innerHTML='<i class="fa-solid fa-check mr-1"></i> Saved!',t.classList.remove("bg-gray-800"),t.classList.add("bg-green-600"),setTimeout(()=>{t.innerHTML=a,t.disabled=!1,t.classList.remove("bg-green-600"),t.classList.add("bg-gray-800")},2e3)}catch(s){m(s.message,"error"),t.disabled=!1,t.innerHTML=a}};window.saveRepaymentDate=async()=>{const e=document.getElementById("new-repayment-date");if(!e||!e.value)return;const t=e.value,a=document.getElementById("btn-save-date"),s=a.innerHTML;a.disabled=!0,a.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{const r={...i.offer_details||{},first_payment_date:t},{error:o}=await b.from("loan_applications").update({offer_details:r,repayment_start_date:t}).eq("id",i.id);if(o)throw o;m("First repayment date updated successfully","success"),await x()}catch(n){console.error("Date Update Error:",n),m(n.message,"error"),a.disabled=!1,a.innerHTML=s}};window.toggleDateEdit=()=>{const e=document.getElementById("date-view-mode"),t=document.getElementById("date-edit-mode");e&&t&&(e.classList.toggle("hidden"),t.classList.toggle("hidden"))};window.manualStatusChange=async()=>{if(i.status==="DISBURSED"){alert(`⛔ ACTION BLOCKED

This application has already been disbursed. To maintain financial integrity, you cannot change the status of an active loan.`);return}const t=document.getElementById("status-override-select").value;if(t!==i.status){if(t.includes("BUREAU")){alert("Cannot manually override Bureau statuses. These are automated.");return}if(confirm(`Are you sure you want to manually force status to "${t}"?`)){const{error:a}=await S(i.id,t);a?m(a.message,"error"):(m("Status manually updated.","success"),t==="OFFER_ACCEPTED"&&await window.activateSureSystemsMandate(),x())}}};const E=document.getElementById("confirmation-modal"),V=document.getElementById("modal-title"),Y=document.getElementById("modal-body"),De=(e,t,a)=>{V&&(V.textContent=e),Y&&(Y.textContent=t),A=a,E?(E.classList.remove("hidden"),E.classList.add("flex")):confirm(t)&&a()},_=()=>{E&&(E.classList.add("hidden"),E.classList.remove("flex")),A=null},Be=async()=>{const{data:{user:e}}=await b.auth.getUser(),{data:t}=await b.from("payouts").select("id").eq("application_id",i.id).maybeSingle();if(t){m("A payout record already exists for this application.","error"),_();return}const{data:a,error:s}=await S(i.id,"READY_TO_DISBURSE");if(s){m(s.message,"error"),_();return}const n={application_id:i.id,user_id:i.user_id,amount:a.amount,status:"pending_disbursement"},{error:r}=await ne(n);r?m("Status updated but payout creation failed: "+r.message,"error"):(m("Application approved & financial values locked.","success"),x()),_()},$e=(e,t)=>{const a=(e==null?void 0:e.full_name)||"Unknown User",s=(e==null?void 0:e.avatar_url)||`https://ui-avatars.com/api/?name=${a.replace(" ","+")}&background=random`;document.getElementById("profile-image").src=s,document.getElementById("detail-fullname").textContent=a,document.getElementById("detail-email").textContent=(e==null?void 0:e.email)||"N/A",document.getElementById("detail-mobile").textContent=(e==null?void 0:e.contact_number)||"N/A";const n=document.getElementById("bank-accounts-container");n&&(n.innerHTML="",t&&t.length>0?t.forEach(r=>{const o=document.createElement("div");o.className="p-4 border border-gray-200 rounded-xl bg-white flex justify-between items-center hover:border-orange-300 hover:shadow-sm transition-all",o.innerHTML=`
        <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <i class="fa-solid fa-building-columns"></i>
            </div>
            <div>
                <p class="text-sm font-bold text-gray-900">${r.bank_name||"Unknown Bank"}</p>
                <p class="text-xs text-gray-500 font-mono">${r.account_number||"----"} • ${r.account_type||"Savings"}</p>
            </div>
        </div>
        ${r.is_primary?'<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold border border-green-200">Primary</span>':""}
      `,n.appendChild(o)}):n.innerHTML='<div class="text-sm text-gray-500 italic p-4 border border-dashed border-gray-300 rounded-xl text-center">No bank accounts linked to this profile.</div>')},Ae=async e=>{const t=document.getElementById("personal-tab");if(!t||!e)return;const a=t.querySelector(".compliance-section");a&&a.remove();const{data:s}=await b.from("declarations").select("*").eq("user_id",e).maybeSingle();if(!s)return;const n=document.createElement("div");n.className="mt-8 pt-8 border-t border-gray-100 compliance-section",n.innerHTML=`
        <h4 class="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-file-shield text-gray-400"></i> Compliance & Statutory Data
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p class="text-[10px] text-gray-400 uppercase font-bold">Marital Status</p>
                <p class="text-sm font-semibold text-gray-700 capitalize">${s.marital_status||"Not Set"}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p class="text-[10px] text-gray-400 uppercase font-bold">Residential Status</p>
                <p class="text-sm font-semibold text-gray-700 capitalize">${s.home_ownership||"Not Set"}</p>
            </div>
        </div>

        ${s.referral_provided?`
        <div class="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p class="text-[10px] text-blue-400 uppercase font-bold mb-2">Referral Information</p>
            <div class="flex flex-col sm:flex-row gap-4">
                <div><span class="text-xs text-blue-600">Name:</span> <span class="text-sm font-bold text-blue-900">${s.referral_name}</span></div>
                <div><span class="text-xs text-blue-600">Phone:</span> <span class="text-sm font-bold text-blue-900">${s.referral_phone}</span></div>
            </div>
        </div>`:""}
    `,t.appendChild(n)},Te=(e,t)=>{const a=e&&e[0]?e[0]:{},s=a.parsed_data||{income:{},expenses:{}};document.getElementById("fin-income").textContent=g(a.monthly_income||0),document.getElementById("fin-expenses").textContent=g(a.monthly_expenses||0);const n=document.getElementById("credit-check-content"),r=document.getElementById("credit-date"),o=document.getElementById("btn-download-xml");if(!n)return;let d=document.getElementById("affordability-breakdown-list");if(!d){const c=document.querySelector("#financial-tab .grid"),u=document.createElement("div");u.id="affordability-breakdown-list",u.className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200",c.after(u),d=u}d.innerHTML=`
    <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <i class="fa-solid fa-list-check"></i> Monthly Budget Breakdown
    </h4>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
        <div class="flex justify-between border-b border-gray-200 pb-1">
            <span class="text-sm text-gray-500">Basic Salary (Net)</span>
            <span class="text-sm font-bold text-gray-900">${g(s.income.salary||0)}</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-1">
            <span class="text-sm text-gray-500">Housing / Rent</span>
            <span class="text-sm font-bold text-gray-900">${g(s.expenses.housing_rent||0)}</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-1">
            <span class="text-sm text-gray-500">Other Earnings</span>
            <span class="text-sm font-bold text-gray-900">${g(s.income.other_monthly_earnings||0)}</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-1">
            <span class="text-sm text-gray-500">School Fees</span>
            <span class="text-sm font-bold text-gray-900">${g(s.expenses.school||0)}</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-1">
            <span class="text-sm text-gray-500">Disposable Surplus</span>
            <span class="text-sm font-bold text-brand-accent">${g(a.affordability_ratio||0)}</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-1">
            <span class="text-sm text-gray-500">Transport / Fuel</span>
            <span class="text-sm font-bold text-gray-900">${g(s.expenses.petrol||0)}</span>
        </div>
    </div>
  `;const l=t&&t.length>0?t[0]:null;if(l){const c=l.credit_score||0,u=c>600?"text-green-600":c>500?"text-yellow-600":"text-red-600";if(r&&(r.textContent=`Checked on ${h(l.checked_at||l.created_at||new Date)}`),o){const p=l.raw_xml_data;p?(o.classList.remove("hidden"),o.innerHTML='<i class="fa-solid fa-file-pdf mr-2"></i> View Bureau Report',o.className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors shadow-sm font-medium flex items-center gap-2",o.onclick=()=>window.viewBureauReport(p)):o.classList.add("hidden")}n.innerHTML=`
        <div class="p-6 border-b border-gray-200 text-center bg-white">
            <div class="text-6xl font-extrabold ${u} mb-2 tracking-tighter">${c}</div>
            <p class="font-bold text-gray-700 uppercase tracking-wide text-xs">Bureau Score</p>
            <span class="inline-block mt-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold border border-gray-200">${l.score_band||"Standard"}</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-gray-50">
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <span class="block text-2xl font-bold text-gray-800">${l.total_accounts||0}</span>
                <span class="text-xs text-gray-400 font-bold uppercase mt-1">Total Acc</span>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <span class="block text-2xl font-bold text-red-600">${l.accounts_with_arrears||0}</span>
                <span class="text-xs text-gray-400 font-bold uppercase mt-1">Arrears</span>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <span class="block text-2xl font-bold text-orange-600">${l.total_enquiries||0}</span>
                <span class="text-xs text-gray-400 font-bold uppercase mt-1">Enquiries</span>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <span class="block text-2xl font-bold text-gray-800">${l.total_judgments||0}</span>
                <span class="text-xs text-gray-400 font-bold uppercase mt-1">Judgments</span>
            </div>
        </div>
        <div class="p-6 bg-white border-t border-gray-200 space-y-4">
            <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                <span class="text-sm text-gray-500">Total Balance</span>
                <span class="font-bold text-gray-900">${g(l.total_balance||0)}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">Judgment Value</span>
                <span class="font-bold text-red-600">${g(l.total_judgment_amount||0)}</span>
            </div>
        </div>
      `}else r&&(r.textContent=""),o&&o.classList.add("hidden"),n.innerHTML='<div class="py-12 text-center text-gray-400"><p>No bureau data available.</p></div>'},Re=e=>{const t=document.getElementById("documents-list"),a=document.getElementById("doc-count");if(!t||!a)return;const s=[{key:"idcard",label:"ID Document"},{key:"till_slip",label:"Latest Payslip"},{key:"bank_statement",label:"Bank Statement"}];a.textContent=(e==null?void 0:e.length)||0,t.innerHTML="",s.forEach(n=>{const r=e.find(c=>c.file_type===n.key),o=r?"text-green-600 bg-green-100":"text-gray-400 bg-gray-100",d=r?"fa-check-circle":"fa-upload",l=document.createElement("div");l.className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-300 transition-all group",l.innerHTML=`
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl ${o} flex items-center justify-center">
                <i class="fa-solid ${d} text-xl"></i>
            </div>
            <div class="flex-grow min-w-0">
                <p class="text-sm font-bold text-gray-900">${n.label}</p>
                <p class="text-xs text-gray-500">${r?"File Verified":"Missing Document"}</p>
            </div>
        </div>
        <div class="flex items-center gap-2">
            ${r?`
            <button onclick="handleSmartDownload('${r.file_path}')" class="w-10 h-10 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-all">
                <i class="fa-solid fa-eye"></i>
            </button>`:""}
            
            <label class="cursor-pointer bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition-all">
                ${r?"Replace":"Upload"}
                <input type="file" class="hidden admin-doc-upload" data-type="${n.key}" accept=".pdf,.jpg,.png,.jpeg">
            </label>
        </div>
      `,t.appendChild(l)}),Fe()},Fe=()=>{document.querySelectorAll(".admin-doc-upload").forEach(e=>{e.addEventListener("change",async t=>{const a=t.target.files[0];if(!a||!i)return;const s=t.target.dataset.type,n=t.target.parentElement,r=n.childNodes[0].textContent;n.childNodes[0].textContent="Processing...";try{const{data:{session:o}}=await b.auth.getSession(),d=o.user.id,l=a.name.split(".").pop(),c=`${s}_${Date.now()}.${l}`,u=`${d}/${i.user_id}_${c}`,{error:p}=await b.storage.from("client_docs").upload(u,a,{upsert:!0});if(p)throw p;const{error:y}=await b.rpc("register_admin_upload",{p_user_id:i.user_id,p_app_id:i.id,p_file_name:c,p_original_name:a.name,p_file_path:u,p_file_type:s,p_mime_type:a.type,p_file_size:a.size});if(y)throw y;m("Document Updated Successfully","success"),x()}catch(o){console.error(o),m(o.message,"error")}finally{n.childNodes[0].textContent=r}})})};window.handleSmartDownload=async e=>{try{let t=e;e.includes("/storage/v1/object/")&&(t=e.split("/").slice(8).join("/"));let{data:a,error:s}=await b.storage.from("client_docs").createSignedUrl(t,60);if((s||!a)&&({data:a,error:s}=await b.storage.from("documents").createSignedUrl(t,60)),s)throw s;window.open(a.signedUrl,"_blank")}catch(t){console.error("Smart Download Error:",t),m("File not found in any bucket. Please check storage manually.","error")}};const Me=async(e,t,a)=>{var o,d;const s=document.getElementById("loan-history-list"),n=document.getElementById("app-history-list");let r=document.getElementById("admin-metadata-container");if(a){const l=document.getElementById("loan-tab");if(!r){r=document.createElement("div"),r.id="admin-metadata-container",r.className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-8";const c=Array.from(l.querySelectorAll("h3")).find(u=>u.textContent.includes("Client History"));c?l.insertBefore(r,c):l.appendChild(r)}try{const c=[a.created_by_admin,a.reviewed_by_admin].filter(Boolean),{data:u}=await b.from("profiles").select("id, full_name").in("id",c),p=((o=u==null?void 0:u.find(f=>f.id===a.created_by_admin))==null?void 0:o.full_name)||"System / User",y=((d=u==null?void 0:u.find(f=>f.id===a.reviewed_by_admin))==null?void 0:d.full_name)||"Pending Review";r.innerHTML=`
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p class="text-[10px] text-gray-400 uppercase font-black mb-2 tracking-widest">Created By</p>
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-bold">
                        ${p.charAt(0)}
                    </div>
                    <span class="text-sm font-bold text-gray-800">${p}</span>
                </div>
            </div>
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p class="text-[10px] text-gray-400 uppercase font-black mb-2 tracking-widest">Reviewed By</p>
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-600 font-bold">
                        ${y.charAt(0)}
                    </div>
                    <span class="text-sm font-bold text-gray-800">${y}</span>
                </div>
            </div>
          `}catch(c){console.error("Admin UUID Lookup Error:",c)}}s&&(s.innerHTML="",e&&e.length>0?e.forEach(l=>{const c=document.createElement("div");c.className="p-3 border-b border-gray-100 last:border-0",c.innerHTML=`
                <div class="flex justify-between items-center">
                    <div>
                        <span class="block font-bold text-gray-800 text-sm">Loan #${l.id}</span>
                        <span class="text-xs text-gray-500">${h(l.start_date||l.created_at)}</span>
                    </div>
                    <div class="text-right">
                        <span class="block font-bold text-gray-900 text-sm">${g(l.principal_amount||0)}</span>
                        <span class="text-[10px] px-2 py-0.5 rounded bg-green-50 text-green-700 font-bold uppercase">${l.status||"Active"}</span>
                    </div>
                </div>
            `,s.appendChild(c)}):s.innerHTML='<p class="text-sm text-gray-400 italic p-2">No previous loan history found.</p>'),n&&(n.innerHTML="",t&&t.length>0?t.forEach(l=>{const c=document.createElement("div");c.className="p-3 border-b border-gray-100 last:border-0",c.innerHTML=`
                <div class="flex justify-between items-center">
                    <div>
                        <span class="font-bold block text-gray-800 text-sm">App #${l.id}</span>
                        <span class="text-xs text-gray-500">${h(l.created_at)}</span>
                    </div>
                    <div class="text-right">
                        <span class="block text-gray-600 font-medium text-sm">${g(l.amount||0)}</span>
                        <span class="text-[10px] uppercase font-bold text-orange-500">${l.status}</span>
                    </div>
                </div>
            `,n.appendChild(c)}):n.innerHTML='<p class="text-sm text-gray-400 italic p-2">No other applications on record.</p>')},T=e=>{var U,j,H,q;if(!e)return;const t=e.status||"pending",a=document.getElementById("sidebar-status"),s=document.getElementById("status-alert"),n=document.getElementById("action-buttons-container"),r=((U=e.loan_history)==null?void 0:U.length)||0,o=parseFloat(e.amount||0),d=parseInt(e.term_months||1),l=e.offer_details||{},c=60,u=.15,p=r<3?.3:.28,y=p,f=se({principal:o,annualRate:p,termMonths:d,monthlyServiceFee:c,initiationFeeRate:u}),Q=f.totalInterest,G=f.totalInitiationFees,X=f.totalMonthlyFees,W=f.totalRepayment,Z=f.monthlyPayment,$=l.first_payment_date||e.repayment_start_date;document.getElementById("sidebar-amount").textContent=g(o),document.getElementById("sidebar-term").textContent=`${d} Month${d>1?"s":""}`,document.getElementById("sidebar-payment").textContent=g(Z);let w=document.getElementById("financial-breakdown");if(!w){const I=document.getElementById("sidebar-payment").parentElement.parentElement;w=document.createElement("div"),w.id="financial-breakdown",w.className="pt-4 border-t border-gray-100 space-y-4",I.after(w)}w.innerHTML=`
    <div class="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div class="flex justify-between items-center text-xs">
            <span class="text-gray-500">Reducing-Balance Interest (${(y*100).toFixed(1)}% p.a.)</span>
            <span class="font-bold text-gray-900">${g(Q)}</span>
        </div>
        <div class="flex justify-between items-center text-xs">
            <span class="text-gray-500">Initiation Fee (15%)</span>
            <span class="font-bold text-gray-900">${g(G)}</span>
        </div>
        <div class="flex justify-between items-center text-xs">
            <span class="text-gray-500">Monthly Service Fee (R60/mo)</span>
            <span class="font-bold text-gray-900">${g(X)}</span>
        </div>
        <div class="pt-2 border-t border-gray-200 flex justify-between items-center">
            <span class="text-xs font-black uppercase text-gray-700">Total Repayable</span>
            <span class="text-sm font-black text-green-600">${g(W)}</span>
        </div>
    </div>
    
    <div class="mt-4">
        <label class="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 block">Scheduled Payout Info</label>
        <div class="p-3 bg-orange-50 border border-orange-100 rounded-xl transition-all">
            <div id="date-view-mode" class="flex items-center justify-between">
                <span class="text-xs text-orange-800 font-medium">First Repayment:</span>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-orange-900">
                        ${$?h($):"Not Scheduled"}
                    </span>
                    ${t!=="DISBURSED"?`
                    <button onclick="window.toggleDateEdit()" class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-orange-100 text-orange-600 transition-colors" title="Change Date">
                        <i class="fa-solid fa-pen text-[10px]"></i>
                    </button>`:""}
                </div>
            </div>
            <div id="date-edit-mode" class="hidden mt-1">
                <div class="flex items-center gap-2">
                    <input type="date" id="new-repayment-date" 
                           class="flex-1 text-xs p-1.5 rounded-lg border border-orange-300 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                           value="${$?new Date($).toISOString().split("T")[0]:""}">
                    <button id="btn-save-date" onclick="window.saveRepaymentDate()" class="px-3 py-1.5 bg-orange-600 text-white text-xs font-bold rounded-lg hover:bg-orange-700 shadow-sm">
                        Save
                    </button>
                    <button onclick="window.toggleDateEdit()" class="px-2 py-1.5 text-gray-500 hover:text-gray-700">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
  `,a&&(a.textContent=t.replace("_"," "),a.className=`mt-2 text-lg font-bold uppercase tracking-wide ${O(t).split(" ")[0].replace("bg-","text-").replace("-100","-600")}`);const C=document.getElementById("status-override-select"),v=document.getElementById("manual-update-btn"),P=document.getElementById("override-hint");if(t==="DISBURSED"?(C&&(C.disabled=!0),v&&(v.disabled=!0,v.classList.add("opacity-50","cursor-not-allowed"),v.innerText="Locked"),P&&(P.textContent="🔒 Application is active. Modifications disabled.")):(C&&(C.disabled=!1,C.value=t),v&&(v.disabled=!1,v.innerText="Update")),s&&(s.className="mt-3 p-3 rounded-lg text-xs font-medium leading-relaxed hidden",t==="OFFERED"?(s.textContent="Contract Sent. Waiting for user to sign.",s.classList.add("bg-purple-50","text-purple-700","block")):t==="READY_TO_DISBURSE"&&(s.textContent="Application is queued for disbursement.",s.classList.add("bg-green-50","text-green-700","block"))),n)if(n.innerHTML="",["BUREAU_OK","BANK_LINKING","STARTED","AFFORD_REFER","BUREAU_REFER"].includes(t)){const I=t==="AFFORD_REFER"||t==="BUREAU_REFER"?'<div class="p-3 bg-orange-50 border border-orange-100 rounded-lg mb-3 text-xs text-orange-700 font-bold"><i class="fa-solid fa-circle-exclamation mr-1"></i> Currently Under Manual Review</div>':"";n.innerHTML=`
            ${I}
            <h4 class="text-xs font-bold text-gray-400 uppercase mb-2">Assessment</h4>
            <button onclick="updateStatus('AFFORD_OK')" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl mb-2 shadow-lg"><i class="fa-solid fa-check-circle mr-2"></i> Confirm Affordability</button>
            ${t.includes("REFER")?"":`<button onclick="updateStatus('AFFORD_REFER')" class="w-full py-3 bg-white border border-orange-200 text-orange-600 text-sm font-bold rounded-xl mb-2"><i class="fa-solid fa-magnifying-glass mr-2"></i> Refer</button>`}
            
            <button onclick="openModal('Decline', 'Are you sure you want to decline this application?', declineApplication)" class="w-full py-3 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-xl">
                <i class="fa-solid fa-xmark mr-2"></i> Decline
            </button>
          `}else t==="AFFORD_OK"?(n.innerHTML=`
            <div class="p-3 bg-blue-50 border border-blue-100 rounded-lg mb-3 text-xs text-blue-700">Client passed assessment. Ready for Contract.</div>
            <button id="action-send-contract" class="w-full py-3 bg-brand-accent hover:bg-brand-accent-hover text-white text-sm font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"><i class="fa-solid fa-paper-plane"></i> Send Contract</button>
            <button id="action-preview-contract" class="w-full py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl shadow-sm flex items-center justify-center gap-2"><i class="fa-solid fa-eye"></i> Preview Template</button>
          `,(j=document.getElementById("action-send-contract"))==null||j.addEventListener("click",I=>he(I.currentTarget)),(H=document.getElementById("action-preview-contract"))==null||H.addEventListener("click",we)):t==="OFFER_ACCEPTED"?(n.innerHTML=`
             <div class="p-3 bg-purple-50 border border-purple-100 rounded-lg mb-3 text-xs text-purple-700"><i class="fa-solid fa-signature mr-1"></i> Client Signed.</div>
           <button id="btn-activate-suresystems" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg mb-2"><i class="fa-solid fa-link mr-2"></i> Activate SureSystems Mandate</button>
             <button id="btn-approve-contract" class="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-lg"><i class="fa-solid fa-file-signature mr-2"></i> Approve & Queue Payout</button>
          `,(q=document.getElementById("btn-activate-suresystems"))==null||q.addEventListener("click",()=>window.activateSureSystemsMandate()),document.getElementById("btn-approve-contract").onclick=()=>De("Approve","Mark contract as valid and ready for payout?",Be)):t==="READY_TO_DISBURSE"?n.innerHTML='<div class="p-4 bg-green-50 border border-green-100 rounded-xl text-center"><p class="text-sm font-bold text-green-800">Queued for Payout</p></div>':t==="DISBURSED"&&(n.innerHTML='<div class="p-4 bg-gray-50 border border-gray-100 rounded-xl text-center"><p class="text-sm font-bold text-gray-600">Loan Active / Completed</p></div>')},Ne=e=>{var a;if(!e)return;document.getElementById("applicant-name-header").textContent=((a=e.profiles)==null?void 0:a.full_name)||"Unknown",document.getElementById("header-id-val").textContent=e.id,document.getElementById("header-date").textContent=h(e.created_at),document.getElementById("detail-app-id").textContent=`#${e.id}`,document.getElementById("detail-date").textContent=h(e.created_at),document.getElementById("detail-purpose").textContent=e.purpose||"Personal Loan",document.getElementById("detail-notes").value=e.notes||"";const t=document.getElementById("header-status-badge");t&&(t.textContent=e.status,t.className=`px-4 py-1.5 text-sm font-bold rounded-full shadow-sm ${O(e.status)}`)},x=async()=>{var a,s,n,r;const t=new URLSearchParams(window.location.search).get("id");if(t)try{const o=await ae(t);i=o,F(),(a=document.getElementById("contract-declined-banner"))==null||a.remove(),Ne(o),$e(o.profiles||{},o.bank_accounts),await Ae(o.user_id),Te(o.financial_profiles,o.credit_checks),Re(o.documents),await Me(o.loan_history,o.application_history,o),T(o),await ve(),(s=document.getElementById("loading-state"))==null||s.classList.add("hidden"),(n=document.getElementById("content-grid"))==null||n.classList.remove("hidden"),(r=document.getElementById("page-header"))==null||r.classList.remove("hidden")}catch(o){console.error("Integration Error:",o),m("Failed to load full application data.","error")}};document.addEventListener("DOMContentLoaded",async()=>{var s;await ee();let e=document.getElementById("main-content");e||(e=document.createElement("main"),e.id="main-content",e.className="flex-1 p-6 pt-24",document.getElementById("app-shell").appendChild(e)),e.innerHTML=ye,ke(),await x(),(s=document.getElementById("btn-save-notes"))==null||s.addEventListener("click",saveNotes);const t=document.getElementById("modal-confirm-btn"),a=document.getElementById("modal-cancel-btn");t&&t.addEventListener("click",()=>{typeof A=="function"&&A()}),a&&a.addEventListener("click",_)});
