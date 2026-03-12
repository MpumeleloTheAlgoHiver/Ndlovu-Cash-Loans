import"./supabaseClient-CMKDwqD5.js";import{i as S}from"./layout-Cn9C-WTG.js";/* empty css               */import{b as L,a as w}from"./utils-D6Z1B7Jq.js";import{o as B,C as $,D as _,w as A}from"./dataService-CluSniSs.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm";let b=[],i=new Set,p="pending",m="",g=1;const v=20;function k(){const t=document.getElementById("main-content");t&&(t.innerHTML=`
    <div id="payout-list-view" class="flex flex-col h-full animate-fade-in space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Disbursed</p>
                <h2 id="stat-total-disbursed" class="text-3xl font-black text-gray-900 mt-2">R 0.00</h2>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl shadow-sm">
                <i class="fa-solid fa-money-bill-wave"></i>
            </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Value</p>
                <h2 id="stat-pending-value" class="text-3xl font-black text-yellow-600 mt-2">R 0.00</h2>
            </div>
            <div class="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center text-xl shadow-sm">
                <i class="fa-solid fa-clock"></i>
            </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Queue</p>
                <h2 id="stat-pending-queue" class="text-3xl font-black text-gray-900 mt-2">0</h2>
            </div>
            <div class="w-12 h-12 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center text-xl shadow-sm">
                <i class="fa-solid fa-list-check"></i>
            </div>
        </div>

      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden flex-1 min-h-0">
        
        <div class="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
                <h3 class="text-lg font-bold text-gray-900 uppercase tracking-tight">Transaction View</h3>
                <div class="flex gap-6 mt-2">
                    <button id="tab-pending" class="text-xs font-bold uppercase transition-colors pb-1 border-b-2 ${p==="pending"?"text-orange-600 border-orange-600":"text-gray-400 border-transparent hover:text-gray-600"}">
                        Ready to Pay
                    </button>
                    <button id="tab-history" class="text-xs font-bold uppercase transition-colors pb-1 border-b-2 ${p==="history"?"text-orange-600 border-orange-600":"text-gray-400 border-transparent hover:text-gray-600"}">
                        Paid History
                    </button>
                </div>
            </div>
            
            <div class="flex items-center gap-3 w-full lg:w-auto">
                <div class="relative flex-1 lg:w-64">
                    <input type="text" id="payout-search-input" placeholder="Search ID or Name..." 
                           class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-orange-500 text-sm focus:bg-white transition-colors">
                    <i class="fa-solid fa-search absolute left-3 top-2.5 text-gray-400"></i>
                </div>
                <button id="btn-bulk-disburse" class="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black disabled:opacity-30 transition-all flex items-center gap-2 shadow-sm" disabled>
                    <i class="fa-solid fa-file-csv"></i> <span>Export Data</span>
                </button>
            </div>
        </div>

        <div class="overflow-auto custom-scrollbar flex-1">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                    <th class="px-6 py-4 text-left w-10">
                        <input type="checkbox" id="select-all-checkbox" class="rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer">
                    </th>
                    <th class="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th class="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction ID</th>
                    <th class="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recipient</th>
                    <th class="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                    <th class="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th class="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
            </thead>
            <tbody id="payouts-table-body" class="bg-white divide-y divide-gray-50">
                <tr><td colspan="7" class="p-10 text-center text-gray-400 italic">
                    <i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Loading transaction queue...
                </td></tr>
            </tbody>
          </table>
        </div>
        
        <div id="payout-pagination-container"></div>
      </div>
      
      <div class="mt-1 text-[10px] text-gray-400 text-right font-bold uppercase tracking-tight">
        Total Records Found: <span id="visible-count">0</span>
      </div>
    </div>
  `,M())}const x=(t=!0)=>{var s;t&&(g=1),m=((s=document.getElementById("payout-search-input"))==null?void 0:s.value.toLowerCase().trim())||"";const a=new Set,e=b.filter(o=>{var I;const d=o.status==="pending_disbursement",c=o.status==="disbursed",y=p==="pending"?d:c,h=!m||(((I=o.profile)==null?void 0:I.full_name)||"").toLowerCase().includes(m)||String(o.id).includes(m);return y&&h&&!a.has(o.application_id)?(a.add(o.application_id),!0):!1}),n=Math.ceil(e.length/v)||1,r=(g-1)*v,u=e.slice(r,r+v);C(u),T(n,e.length);const l=document.getElementById("visible-count");l&&(l.textContent=e.length)};function C(t){const a=document.getElementById("payouts-table-body");if(a){if(t.length===0){a.innerHTML='<tr><td colspan="7" class="p-10 text-center text-sm text-gray-400 italic">No transactions found for the selected view.</td></tr>';return}a.innerHTML=t.map(e=>{var u;const n=i.has(e.id),r=L(e.created_at);return`
        <tr class="hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0">
            <td class="px-6 py-4">
                <input type="checkbox" class="payout-checkbox rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer" data-id="${e.id}" ${n?"checked":""}>
            </td>
            <td class="px-6 py-4 text-xs text-gray-600 font-medium whitespace-nowrap">
                ${r}
            </td>
            <td class="px-6 py-4">
                <div class="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block border border-gray-100">
                    #${e.id}
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="text-xs font-bold text-gray-900">${((u=e.profile)==null?void 0:u.full_name)||"N/A"}</div>
                <div class="text-[10px] text-gray-400">App ID: ${e.application_id}</div>
            </td>
            <td class="px-6 py-4 text-xs font-black text-gray-900">
                ${w(e.amount)}
            </td>
            <td class="px-6 py-4">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${p==="pending"?"bg-orange-50 text-orange-600 border-orange-100":"bg-green-50 text-green-600 border-green-100"}">
                    ${p==="pending"?"Pending":"Paid"}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <a href="/admin/application-detail?id=${e.application_id}" class="text-gray-400 hover:text-orange-600 transition-colors p-2 rounded-full hover:bg-orange-50 inline-block">
                    <i class="fa-solid fa-eye"></i>
                </a>
            </td>
        </tr>
    `}).join(""),a.querySelectorAll(".payout-checkbox").forEach(e=>{e.addEventListener("change",n=>{const r=parseInt(n.target.dataset.id);n.target.checked?i.add(r):i.delete(r),f()})})}}function f(){const t=document.getElementById("btn-bulk-disburse");if(!t)return;const a=i.size;t.disabled=a===0,a>0?(t.innerHTML=`<i class="fa-solid fa-file-csv"></i> <span class="ml-2">Export & Process (${a})</span>`,t.classList.remove("bg-gray-900"),t.classList.add("bg-orange-600")):(t.innerHTML='<i class="fa-solid fa-file-csv"></i> <span class="ml-2">Export Data</span>',t.classList.add("bg-gray-900"),t.classList.remove("bg-orange-600"))}function T(t,a){const e=document.getElementById("payout-pagination-container");if(e){if(t<=1){e.innerHTML='<div class="p-4 border-t border-gray-100 bg-gray-50/50 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">End of Records</div>';return}e.innerHTML=`
        <div class="flex justify-between items-center p-4 border-t border-gray-100 bg-gray-50/50">
            <span class="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Page ${g} of ${t}</span>
            <div class="flex gap-2">
                <button onclick="window.changePagePayouts(${g-1})" ${g===1?"disabled":""} 
                    class="px-3 py-1 text-[10px] font-bold border rounded-lg bg-white disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm text-gray-700">Prev</button>
                <button onclick="window.changePagePayouts(${g+1})" ${g===t?"disabled":""} 
                    class="px-3 py-1 text-[10px] font-bold border rounded-lg bg-white disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm text-gray-700">Next</button>
            </div>
        </div>
    `}}window.changePagePayouts=t=>{g=t,x(!1)};function M(){var t,a,e,n,r;(t=document.getElementById("payout-search-input"))==null||t.addEventListener("input",()=>x(!0)),(a=document.getElementById("tab-pending"))==null||a.addEventListener("click",()=>{p="pending",i.clear(),f(),k(),E(b),x(!0)}),(e=document.getElementById("tab-history"))==null||e.addEventListener("click",()=>{p="history",i.clear(),f(),k(),E(b),x(!0)}),(n=document.getElementById("select-all-checkbox"))==null||n.addEventListener("change",u=>{document.querySelectorAll(".payout-checkbox").forEach(s=>{s.checked=u.target.checked;const o=parseInt(s.dataset.id);u.target.checked?i.add(o):i.delete(o)}),f()}),(r=document.getElementById("btn-bulk-disburse"))==null||r.addEventListener("click",()=>{p==="pending"?R():j()})}function E(t){const e=t.filter(d=>{var c;return d.status==="disbursed"||((c=d.application)==null?void 0:c.status)==="DISBURSED"}).reduce((d,c)=>d+Number(c.amount||0),0),n=t.filter(d=>{var c;return d.status==="pending_disbursement"||((c=d.application)==null?void 0:c.status)==="READY_TO_DISBURSE"}),r=n.reduce((d,c)=>d+Number(c.amount||0),0),u=n.length,l=document.getElementById("stat-total-disbursed"),s=document.getElementById("stat-pending-value"),o=document.getElementById("stat-pending-queue");l&&(l.textContent=w(e)),s&&(s.textContent=w(r)),o&&(o.textContent=u)}async function R(){if(i.size===0||!confirm(`Are you sure you want to mark ${i.size} items as DISBURSED and download the CSV?`))return;const t=b.filter(n=>i.has(n.id));D(t);const a=document.getElementById("btn-bulk-disburse"),e=a.innerHTML;a.innerHTML='<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...',a.disabled=!0;try{for(const n of t)await _(n.id),await A(n.application_id,"DISBURSED");alert("Disbursement processed successfully!"),i.clear(),await P()}catch(n){console.error(n),alert("Some updates failed. Please refresh and check."),await P()}finally{a.innerHTML=e}}function j(){if(i.size===0)return;const t=b.filter(e=>i.has(e.id));D(t),i.clear(),f();const a=document.getElementById("select-all-checkbox");a&&(a.checked=!1),document.querySelectorAll(".payout-checkbox").forEach(e=>e.checked=!1)}function D(t){const a=["Payout ID","Recipient","Amount","Status","Date","Application ID","Bank","Account"],e=t.map(s=>{var o,d,c,y,h;return[s.id,`"${((o=s.profile)==null?void 0:o.full_name)||"N/A"}"`,s.amount,p==="pending"?"Pending":"Paid",L(s.created_at),s.application_id,`"${((c=(d=s.application)==null?void 0:d.bank_account)==null?void 0:c.bank_name)||"N/A"}"`,`"${((h=(y=s.application)==null?void 0:y.bank_account)==null?void 0:h.account_number)||"N/A"}"`]}),n=[a.join(","),...e.map(s=>s.join(","))].join(`
`),r=new Blob([n],{type:"text/csv;charset=utf-8;"}),u=URL.createObjectURL(r),l=document.createElement("a");l.href=u,l.download=`payout_export_${p}_${new Date().toISOString().slice(0,10)}.csv`,document.body.appendChild(l),l.click(),document.body.removeChild(l)}async function P(){try{const{data:t,error:a}=await $();if(a)throw a;b=t,E(b),x(!0)}catch(t){console.error("Payout Load Error:",t)}}document.addEventListener("DOMContentLoaded",async()=>{const t=await S();t&&(t.role,await B(),k(),await P())});
