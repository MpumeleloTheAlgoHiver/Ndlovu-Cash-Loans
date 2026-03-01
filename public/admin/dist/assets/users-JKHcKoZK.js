import{s as v}from"./supabaseClient-BXT4n9qe.js";import{i as C}from"./layout-Cb_Oe5x8.js";/* empty css               */import{n as U,o as _,j as D,p as T}from"./dataService-BFNJnUJq.js";import{b as w,a as f}from"./utils-D6Z1B7Jq.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm";let y=[],h=[],u=null,p=null,i=1;const b=20,k=`
<div id="view-list" class="flex flex-col h-full animate-fade-in">
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 shrink-0">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">User Directory</h1>
      <p class="mt-1 text-sm text-gray-500">Manage clients, staff, and assignments.</p>
    </div>
    
    <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <select id="role-filter" class="bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm font-medium focus:ring-orange-500">
            <option value="all">All Roles</option>
            <option value="client">Clients</option>
            <option value="staff">Staff</option>
        </select>

        <select id="branch-filter" class="bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm font-medium focus:ring-orange-500 w-full sm:w-48">
            <option value="all">All Branches</option>
            <option disabled>Loading...</option>
        </select>

        <div class="relative w-full sm:w-72">
            <input type="text" id="user-search" placeholder="Search Name, Email, ID or UUID..." 
                   class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 text-sm">
            <i class="fa-solid fa-search absolute left-3 top-2.5 text-gray-400"></i>
        </div>
    </div>
  </div>

  <div class="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden flex-1 min-h-0">
    <div class="overflow-auto custom-scrollbar"> 
      <table class="min-w-full divide-y divide-gray-200 relative">
        <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm"> 
          <tr>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">User Identity</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">System ID</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Branch</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Email / Contact</th>
            <th class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">Action</th>
          </tr>
        </thead>
        <tbody id="users-table-body" class="bg-white divide-y divide-gray-200">
          <tr><td colspan="5" class="p-10 text-center text-gray-400">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="mt-2 text-xs text-gray-400 text-right">Showing <span id="visible-count">0</span> records</div>
</div>
`,M=`
<div id="view-detail" class="hidden flex flex-col h-full animate-fade-in bg-gray-50 -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
    <div class="flex items-center justify-between mb-6">
        <button onclick="window.switchView('list')" class="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <div class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <i class="fa-solid fa-arrow-left"></i>
            </div>
            Back to Directory
        </button>
        <div class="flex gap-2">
            <button id="btn-transfer-branch" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 shadow-sm">
                <i class="fa-solid fa-building-columns mr-2 text-orange-600"></i> Transfer Branch
            </button>
        </div>
    </div>

    <div class="grid grid-cols-12 gap-6 h-full overflow-hidden">
        
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-10">
            
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
                
                <div class="flex flex-col items-center text-center">
                    <div class="w-24 h-24 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-3xl font-bold mb-4 border-4 border-white shadow-md">
                        <span id="detail-avatar">U</span>
                    </div>
                    <h2 id="detail-name" class="text-xl font-bold text-gray-900">Loading...</h2>
                    <span id="detail-role-badge" class="mt-2 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">CLIENT</span>
                    
                    <div class="mt-6 w-full border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-left">
                        <div>
                            <p class="text-[10px] uppercase font-bold text-gray-400">System ID (UUID)</p>
                            <p id="detail-uuid" class="text-xs font-mono text-gray-600 break-all select-all cursor-pointer hover:text-orange-600" title="Click to Copy">...</p>
                        </div>
                        <div>
                            <p class="text-[10px] uppercase font-bold text-gray-400">Joined</p>
                            <p id="detail-joined" class="text-xs font-medium text-gray-700">...</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-address-card text-gray-400"></i> Contact Details
                </h3>
                <div class="space-y-4">
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><i class="fa-solid fa-envelope"></i></div>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs text-gray-400 font-bold">Email Address</p>
                            <p id="detail-email" class="text-sm font-medium text-gray-900 truncate">...</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0"><i class="fa-solid fa-id-card"></i></div>
                        <div class="flex-1">
                            <p class="text-xs text-gray-400 font-bold">Identity Number</p>
                            <p id="detail-idnum" class="text-sm font-mono font-medium text-gray-900">...</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><i class="fa-solid fa-location-dot"></i></div>
                        <div class="flex-1">
                            <p class="text-xs text-gray-400 font-bold">Assigned Branch</p>
                            <p id="detail-branch" class="text-sm font-bold text-gray-900">...</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-wallet text-gray-400"></i> Financial Snapshot
                </h3>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="text-[10px] text-gray-500 uppercase">Gross Income</p>
                        <p id="detail-income" class="text-sm font-bold text-gray-900">-</p>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="text-[10px] text-gray-500 uppercase">Expenses</p>
                        <p id="detail-expenses" class="text-sm font-bold text-gray-900">-</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-10">
            
            <div class="grid grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div class="text-xs text-gray-500 font-bold uppercase">Total Loans</div>
                    <div id="stat-total-loans" class="text-2xl font-extrabold text-gray-900 mt-1">0</div>
                </div>
                <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div class="text-xs text-gray-500 font-bold uppercase">Active Debt</div>
                    <div id="stat-active-debt" class="text-2xl font-extrabold text-orange-600 mt-1">R 0.00</div>
                </div>
                <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div class="text-xs text-gray-500 font-bold uppercase">Uploaded Docs</div>
                    <div id="stat-total-docs" class="text-2xl font-extrabold text-blue-600 mt-1">0</div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 class="font-bold text-gray-900">Application History</h3>
                    <span class="text-xs text-gray-400">Most recent first</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-100">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody id="detail-loans-body" class="bg-white divide-y divide-gray-50">
                            </tbody>
                    </table>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                 <h3 class="font-bold text-gray-900 mb-4">Uploaded Documents</h3>
                 <div id="detail-docs-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    </div>
            </div>

        </div>
    </div>
</div>

<div id="branch-modal" class="hidden fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center backdrop-blur-sm">
    <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4 animate-scale-in">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Transfer User Branch</h3>
        <p class="text-sm text-gray-500 mb-4">Select the new branch for <span id="modal-username" class="font-bold text-gray-800"></span>.</p>
        
        <select id="modal-branch-select" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm mb-6 focus:ring-orange-500"></select>
        
        <div class="flex justify-end gap-3">
            <button onclick="document.getElementById('branch-modal').classList.add('hidden')" class="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button onclick="window.confirmBranchTransfer()" class="px-4 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm">Confirm Transfer</button>
        </div>
    </div>
</div>
`,I=a=>["admin","super_admin","base_admin"].includes(a),B=a=>({super_admin:"SUPER ADMIN",admin:"BRANCH MANAGER",base_admin:"LOAN OFFICER"})[a]||"CLIENT",$=a=>{const e=(a||"UNKNOWN").toUpperCase();let t="bg-gray-100 text-gray-600";return e==="DISBURSED"&&(t="bg-green-100 text-green-700"),e==="DECLINED"&&(t="bg-red-100 text-red-700"),["STARTED","SUBMITTED"].includes(e)&&(t="bg-blue-50 text-blue-700"),`<span class="px-2 py-0.5 rounded text-[10px] font-bold ${t}">${e}</span>`};window.switchView=a=>{const e=document.getElementById("view-list"),t=document.getElementById("view-detail");a==="detail"?(e.classList.add("hidden"),t.classList.remove("hidden")):(e.classList.remove("hidden"),t.classList.add("hidden"),p=null)};window.openUserDetail=async a=>{var e;try{document.body.style.cursor="wait";const t=await U(a);p=t;const s=t.profile,d=((e=s.branches)==null?void 0:e.name)||"Online / Unassigned";document.getElementById("detail-avatar").textContent=(s.full_name||"U").charAt(0),document.getElementById("detail-name").textContent=s.full_name||"Unknown User",document.getElementById("detail-role-badge").textContent=B(s.role),document.getElementById("detail-uuid").textContent=s.id,document.getElementById("detail-joined").textContent=w(s.created_at),document.getElementById("detail-email").textContent=s.email||"No Email",document.getElementById("detail-email").title=s.email||"",document.getElementById("detail-idnum").textContent=s.identity_number||"N/A",document.getElementById("detail-branch").textContent=d;const r=t.financials||{};document.getElementById("detail-income").textContent=f(r.monthly_income||0),document.getElementById("detail-expenses").textContent=f(r.monthly_expenses||0),document.getElementById("stat-total-loans").textContent=t.loans.length,document.getElementById("stat-total-docs").textContent=t.documents.length;const l=t.loans.filter(n=>["DISBURSED","ACTIVE"].includes(n.status)).reduce((n,m)=>n+Number(m.amount),0);document.getElementById("stat-active-debt").textContent=f(l);const c=document.getElementById("detail-loans-body");t.loans.length===0?c.innerHTML='<tr><td colspan="5" class="p-6 text-center text-sm text-gray-400">No application history found.</td></tr>':c.innerHTML=t.loans.map(n=>`
                <tr class="hover:bg-gray-50 transition-colors cursor-pointer" onclick="window.location.href='/admin/application-detail?id=${n.id}'">
                    <td class="px-6 py-3 text-xs font-mono text-gray-600">#${n.id}</td>
                    <td class="px-6 py-3 text-xs text-gray-600">${w(n.created_at)}</td>
                    <td class="px-6 py-3 text-xs font-bold text-gray-900">${f(n.amount)}</td>
                    <td class="px-6 py-3 text-xs">${$(n.status)}</td>
                    <td class="px-6 py-3 text-right">
                        <i class="fa-solid fa-chevron-right text-gray-300"></i>
                    </td>
                </tr>
            `).join("");const o=document.getElementById("detail-docs-grid");t.documents.length===0?o.innerHTML='<div class="col-span-3 text-center text-sm text-gray-400 py-4 border-2 border-dashed border-gray-100 rounded-lg">No documents uploaded.</div>':o.innerHTML=t.documents.map(n=>`
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm transition-all group">
                    <div class="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center text-orange-500">
                        <i class="fa-solid fa-file-lines"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold text-gray-900 truncate" title="${n.file_name}">${n.file_name}</p>
                        <p class="text-[10px] text-gray-400 uppercase">${n.file_type||"DOC"}</p>
                    </div>
                    <a href="${n.file_path}" target="_blank" class="text-gray-300 hover:text-orange-600 p-2"><i class="fa-solid fa-download"></i></a>
                </div>
            `).join("");const g=document.getElementById("btn-transfer-branch");g.onclick=()=>window.openBranchModal(),window.switchView("detail")}catch(t){console.error("Detail Error:",t),alert("Could not load user details: "+t.message)}finally{document.body.style.cursor="default"}};window.openBranchModal=()=>{if(!p)return;const a=p.profile;document.getElementById("modal-username").textContent=a.full_name;const e=document.getElementById("modal-branch-select");e.innerHTML='<option value="online">Online / Unassigned</option>',h.forEach(t=>{const s=document.createElement("option");s.value=t.id,s.textContent=t.name,a.branch_id===t.id&&(s.selected=!0),e.appendChild(s)}),document.getElementById("branch-modal").classList.remove("hidden")};window.confirmBranchTransfer=async()=>{const a=document.querySelector("#branch-modal button.bg-orange-600"),e=document.getElementById("modal-branch-select").value,t=p.profile;try{a.disabled=!0,a.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Moving...';const s=e==="online"?null:e,{error:d}=await v.from("profiles").update({branch_id:s}).eq("id",t.id);if(d)throw d;await v.from("loan_applications").update({branch_id:s}).eq("user_id",t.id),alert("Success! User transferred."),document.getElementById("branch-modal").classList.add("hidden"),window.location.reload()}catch(s){alert("Transfer failed: "+s.message),a.disabled=!1,a.textContent="Confirm Transfer"}};const L=a=>{const e=document.getElementById("users-table-body"),t=document.getElementById("visible-count");if(!e)return;const s=Math.ceil(a.length/b)||1,d=(i-1)*b,r=a.slice(d,d+b);if(t&&(t.textContent=a.length),r.length===0){e.innerHTML='<tr><td colspan="5" class="p-8 text-center text-sm text-gray-400">No users found.</td></tr>',E(0);return}e.innerHTML=r.map(l=>{var m;const c=((m=l.branches)==null?void 0:m.name)||"Online",o=I(l.role);let g=o?"bg-purple-100 text-purple-700":"bg-green-50 text-green-700";!o&&u.role!=="super_admin"&&l.branch_id!==u.branch_id&&(g="bg-yellow-50 text-yellow-700");const n=l.id.substring(0,6)+"...";return`
        <tr class="hover:bg-gray-50 transition-colors group">
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold mr-3 border border-gray-200 ${o?"bg-purple-50 text-purple-600":"bg-gray-100 text-gray-500"}">
                        ${(l.full_name||"U").charAt(0)}
                    </div>
                    <div>
                        <div class="text-sm font-bold text-gray-900">${l.full_name||"Unknown"}</div>
                        <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">${B(l.role)}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block border border-gray-100" title="Full UUID: ${l.id}">
                    ${n}
                </div>
            </td>
            <td class="px-6 py-4">
                 <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border border-transparent ${g}">
                    ${c}
                 </span>
            </td>
            <td class="px-6 py-4">
                <div class="text-xs text-gray-900 font-medium">${l.email||"-"}</div>
                <div class="text-[10px] text-gray-400">${l.identity_number||""}</div>
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="window.openUserDetail('${l.id}')" class="text-gray-400 hover:text-orange-600 transition-colors p-2 rounded-full hover:bg-orange-50">
                    <i class="fa-solid fa-eye"></i>
                </button>
            </td>
        </tr>`}).join(""),E(s)},x=(a=!0)=>{a&&(i=1);const e=document.getElementById("user-search").value.toLowerCase(),t=document.getElementById("role-filter").value,s=document.getElementById("branch-filter").value,d=y.filter(r=>{var n;const l=!e||(r.full_name||"").toLowerCase().includes(e)||(r.email||"").toLowerCase().includes(e)||(r.identity_number||"").includes(e)||(r.id||"").includes(e),c=I(r.role);let o=!0;t==="client"&&(o=!c),t==="staff"&&(o=c);const g=s==="all"||((n=r.branch_id)==null?void 0:n.toString())===s||s==="online"&&!r.branch_id;return l&&o&&g});L(d)};document.addEventListener("DOMContentLoaded",async()=>{await C();const a=document.getElementById("main-content");a.innerHTML=k+M,a.className="flex-1 p-4 sm:p-6 lg:p-8 h-screen overflow-hidden flex flex-col";try{const[e,t,s]=await Promise.all([_(),D(),T()]);u=e,y=t,h=s;const d=document.getElementById("branch-filter");d.innerHTML='<option value="all">All Branches</option><option value="online">Online / Unassigned</option>',h.forEach(l=>d.innerHTML+=`<option value="${l.id}">${l.name}</option>`);const r=document.getElementById("role-filter");u.role!=="super_admin"?(r.innerHTML='<option value="client">Clients</option>',r.value="client",r.disabled=!0,r.classList.add("bg-gray-100","text-gray-500","cursor-not-allowed"),x(!0)):L(y),document.getElementById("user-search").addEventListener("input",()=>x(!0)),document.getElementById("role-filter").addEventListener("change",()=>x(!0)),document.getElementById("branch-filter").addEventListener("change",()=>x(!0))}catch(e){console.error(e),a.innerHTML=`<div class="p-8 text-center text-red-500">Failed to load directory: ${e.message}</div>`}});function E(a){let e=document.getElementById("user-pagination-container");if(e||(e=document.createElement("div"),e.id="user-pagination-container",e.className="flex justify-between items-center p-4 border-t border-gray-100 bg-gray-50/50",document.getElementById("view-list").appendChild(e)),a<=1){e.innerHTML='<span class="text-xs text-gray-400">Showing all users</span>';return}e.innerHTML=`
        <span class="text-xs font-bold text-gray-500 uppercase tracking-tight">Page ${i} of ${a}</span>
        <div class="flex gap-2">
            <button onclick="window.changePageUsers(${i-1})" ${i===1?"disabled":""} class="px-4 py-2 text-xs font-bold border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm">Prev</button>
            <button onclick="window.changePageUsers(${i+1})" ${i===a?"disabled":""} class="px-4 py-2 text-xs font-bold border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm">Next</button>
        </div>
    `}window.changePageUsers=a=>{i=a,x(!1)};
