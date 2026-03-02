import"./supabaseClient-CMKDwqD5.js";import{i as P}from"./layout-Cn9C-WTG.js";/* empty css               */import{a as c,b as T}from"./utils-D6Z1B7Jq.js";import{y as C,z as _}from"./dataService-DfeYa0Z1.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm";let b=[],E=[],x="30days",I="",p=1;const u=15;function y(){const a=document.getElementById("main-content");a&&(a.innerHTML=`
    <div id="recovery-dashboard" class="flex flex-col h-full animate-fade-in space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden group">
            <div class="z-10">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Recoveries (MTD)</p>
                <h2 id="stat-mtd-recoveries" class="text-3xl font-black text-gray-900 mt-2">R 0.00</h2>
                <p id="stat-mtd-count" class="text-xs text-green-600 font-bold mt-1 flex items-center gap-1"></p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl shadow-sm z-10">
                <i class="fa-solid fa-hand-holding-dollar"></i>
            </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden">
            <div class="z-10">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Realized Profit (MTD)</p>
                <h2 id="stat-revenue-yield" class="text-3xl font-black text-indigo-900 mt-2">R 0.00</h2>
                <p class="text-xs text-indigo-400 font-bold mt-1 tracking-tight">Contractual Fees & Interest</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-sm z-10">
                <i class="fa-solid fa-chart-pie"></i>
            </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden">
            <div class="z-10">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Payers</p>
                <h2 id="stat-active-payers" class="text-3xl font-black text-gray-900 mt-2">0</h2>
                <p class="text-xs text-gray-400 font-bold mt-1">Unique clients this period</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center text-xl shadow-sm z-10">
                <i class="fa-solid fa-users-viewfinder"></i>
            </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        <div class="lg:w-3/4 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            
            <div class="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 class="text-lg font-bold text-gray-900 uppercase tracking-tight">Recovery Detail</h3>
                    <div class="flex gap-6 mt-2">
                        <button id="tab-30days" class="text-xs font-bold uppercase transition-colors pb-1 border-b-2 ${x==="30days"?"text-orange-600 border-orange-600":"text-gray-400 border-transparent hover:text-gray-600"}">Last 30 Days</button>
                        <button id="tab-all" class="text-xs font-bold uppercase transition-colors pb-1 border-b-2 ${x==="all"?"text-orange-600 border-orange-600":"text-gray-400 border-transparent hover:text-gray-600"}">All History</button>
                    </div>
                </div>
                <div class="relative flex-1 sm:w-64">
                    <input type="text" id="search-input" placeholder="Search client or ID..." 
                           class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-orange-500 text-xs focus:bg-white transition-colors">
                    <i class="fa-solid fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                </div>
            </div>

            <div class="flex-1 overflow-auto custom-scrollbar relative">
                <table class="min-w-full divide-y divide-gray-100">
                    <thead class="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-md">
                        <tr>
                            <th class="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                            <th class="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client & ID</th>
                            <th class="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loan Ref</th>
                            <th class="px-6 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th class="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paid In</th>
                            <th class="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Balance</th>
                        </tr>
                    </thead>
                    <tbody id="payments-table-body" class="bg-white divide-y divide-gray-50">
                        <tr><td colspan="6" class="p-10 text-center text-xs text-gray-400 italic">Initializing transaction view...</td></tr>
                    </tbody>
                </table>
            </div>
            
            <div id="pagination-controls" class="border-t border-gray-100 bg-gray-50/50 p-3"></div>
        </div>

        <div class="lg:w-1/4 flex flex-col gap-6">
            
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <h4 class="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">Allocation (MTD)</h4>
                
                <div class="relative w-40 h-40 mx-auto mb-6">
                    <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                        <path class="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.8" />
                        <path id="chart-interest-ring" class="text-indigo-500 transition-all duration-1000" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.8" />
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span class="text-[10px] text-gray-400 font-bold uppercase">Profit</span>
                        <span id="chart-profit-percent" class="text-xl font-black text-gray-900">0%</span>
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <span class="text-[10px] font-bold text-gray-500 uppercase">Capital Back</span>
                        <span id="label-principal-split" class="text-xs font-black text-gray-900">R 0</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                        <span class="text-[10px] font-bold text-indigo-600 uppercase">Interest/Fees</span>
                        <span id="label-interest-split" class="text-xs font-black text-indigo-900">R 0</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-purple-50 rounded-lg border border-purple-100">
                        <span class="text-[10px] font-bold text-purple-600 uppercase">Credit/Extra</span>
                        <span id="label-overpayment-split" class="text-xs font-black text-purple-900">R 0</span>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex-1">
                <h4 class="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">Top Period Recoveries</h4>
                <div id="top-payments-list" class="space-y-3 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar"></div>
            </div>

        </div>
      </div>
    </div>
  `,B())}async function m(){try{const[a,t]=await Promise.all([C(),_()]);if(a.error)throw a.error;if(t.error)throw t.error;b=a.data||[],E=t.data||[],D(),h(!0)}catch(a){console.error("Load Error:",a);const t=a.message||"Unable to connect to the database. Please check your connection.",r=document.getElementById("payments-table-body");r&&(r.innerHTML=`
        <tr>
          <td colspan="6" class="p-10 text-center text-xs text-red-500 italic border-2 border-dashed border-red-50 rounded-xl">
            <i class="fa-solid fa-triangle-exclamation mb-2 text-lg"></i><br>
            Error Loading Data: ${t}
          </td>
        </tr>`),window.showToast&&window.showToast("Failed to load recovery data","error")}}function D(){const t=new Date().toISOString().slice(0,7),r=b.filter(s=>s.payment_date.startsWith(t)),n=r.reduce((s,o)=>s+Number(o.amount),0),d=new Set(r.map(s=>s.loan_id)).size,i=E.filter(s=>s.month===t),e=i.reduce((s,o)=>s+(o.profit_collected_month||0),0),l=i.reduce((s,o)=>s+(o.principal_collected_month||0),0),f=i.reduce((s,o)=>s+(o.overpayment_collected_month||0),0);document.getElementById("stat-mtd-recoveries").textContent=c(n),document.getElementById("stat-revenue-yield").textContent=c(e),document.getElementById("stat-active-payers").textContent=d,document.getElementById("stat-mtd-count").innerHTML=`<i class="fa-solid fa-arrow-trend-up"></i> <span>${r.length}</span> transactions`,document.getElementById("label-principal-split").textContent=c(l),document.getElementById("label-interest-split").textContent=c(e),document.getElementById("label-overpayment-split").textContent=c(f);const g=n>0?Math.round(e/n*100):0;document.getElementById("chart-profit-percent").textContent=`${g}%`,document.getElementById("chart-interest-ring").setAttribute("stroke-dasharray",`${g}, 100`),L(r.length>0?r:b.slice(0,10))}function L(a){const t=document.getElementById("top-payments-list");if(!t)return;const r=[...a].sort((n,d)=>Number(d.amount)-Number(n.amount)).slice(0,5);if(r.length===0){t.innerHTML='<div class="text-center py-10 text-xs text-gray-400">No data for period</div>';return}t.innerHTML=r.map(n=>{var d,i,e;return`
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all cursor-pointer" onclick="window.location.href='/admin/application-detail?id=${n.loan_id}'">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-black">${((i=(d=n.profile)==null?void 0:d.full_name)==null?void 0:i.charAt(0))||"$"}</div>
                <div>
                    <p class="text-xs font-bold text-gray-900 truncate w-24">${((e=n.profile)==null?void 0:e.full_name)||"Unknown"}</p>
                    <p class="text-[10px] text-gray-400 font-mono">#${n.loan_id}</p>
                </div>
            </div>
            <span class="text-xs font-black text-green-600">+${c(n.amount)}</span>
        </div>
    `}).join("")}function h(a=!0){a&&(p=1);let t=b;if(x==="30days"){const e=new Date;e.setDate(e.getDate()-30),t=t.filter(l=>new Date(l.payment_date)>=e)}const r=I.toLowerCase();r&&(t=t.filter(e=>{var l;return(((l=e.profile)==null?void 0:l.full_name)||"").toLowerCase().includes(r)||String(e.id).includes(r)||String(e.loan_id).includes(r)}));const n=(p-1)*u,d=t.slice(n,n+u),i=document.getElementById("payments-table-body");i&&(d.length===0?i.innerHTML='<tr><td colspan="6" class="p-10 text-center text-xs text-gray-400 italic">No transactions found.</td></tr>':i.innerHTML=d.map(e=>{var v,w,k,$;const l=((v=e.loan)==null?void 0:v.outstanding_balance)||0,f=((k=(w=e.loan)==null?void 0:w.application)==null?void 0:k.offer_monthly_repayment)||0,g=Number(e.amount);let s="",o="";return l<-1?(s=`<span class="text-[10px] font-bold px-2 py-1 rounded bg-purple-50 text-purple-700 uppercase">Credit: ${c(Math.abs(l))}</span>`,o='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Overpaid</span>'):l<=1?(s='<span class="text-[10px] font-bold px-2 py-1 rounded bg-green-50 text-green-700 uppercase tracking-tighter">Fully Settled</span>',o='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">Complete</span>'):(s=`<span class="text-[10px] font-bold px-2 py-1 rounded bg-red-50 text-red-700 uppercase tracking-tighter">Due: ${c(l)}</span>`,o=g<f?'<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">Partial</span>':'<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">On Track</span>'),`
                <tr class="hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0">
                    <td class="px-6 py-4 text-xs text-gray-500 font-medium whitespace-nowrap">${T(e.payment_date)}</td>
                    <td class="px-6 py-4">
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-gray-900">${(($=e.profile)==null?void 0:$.full_name)||"Unknown"}</span>
                            <span class="text-[10px] text-gray-400 font-mono tracking-tighter">TX ID: #${e.id}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <a href="/admin/application-detail?id=${e.loan_id}" class="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100">
                            #${e.loan_id}
                        </a>
                    </td>
                    <td class="px-6 py-4 text-center">${o}</td>
                    <td class="px-6 py-4 text-right">
                        <span class="text-xs font-black text-gray-900">+ ${c(e.amount)}</span>
                    </td>
                    <td class="px-6 py-4 text-right">${s}</td>
                </tr>`}).join("")),M(t.length)}function M(a){const t=document.getElementById("pagination-controls");if(!t)return;const r=Math.ceil(a/u)||1;t.innerHTML=`
        <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Page ${p} of ${r}</span>
            <div class="flex gap-2">
                <button onclick="window.changePageRecovery(${p-1})" ${p===1?"disabled":""} class="px-3 py-1 text-[10px] font-bold border rounded-lg bg-white disabled:opacity-30 hover:bg-gray-50 transition-all text-gray-700">Prev</button>
                <button onclick="window.changePageRecovery(${p+1})" ${p===r?"disabled":""} class="px-3 py-1 text-[10px] font-bold border rounded-lg bg-white disabled:opacity-30 hover:bg-gray-50 transition-all text-gray-700">Next</button>
            </div>
        </div>`}function B(){var a,t,r;(a=document.getElementById("search-input"))==null||a.addEventListener("input",n=>{I=n.target.value.trim(),h(!0)}),(t=document.getElementById("tab-30days"))==null||t.addEventListener("click",()=>{x="30days",y(),m()}),(r=document.getElementById("tab-all"))==null||r.addEventListener("click",()=>{x="all",y(),m()})}window.changePageRecovery=a=>{p=a,h(!1)};document.addEventListener("DOMContentLoaded",async()=>{await P()&&(y(),await m())});
