import{s as C}from"./supabaseClient-CMKDwqD5.js";import{i as J,e as K,D as g,a as Q,p as Y,b as Z}from"./layout-Cn9C-WTG.js";/* empty css               */import{g as V,u as ee,h as te,i as ae,j as re,k as oe,l as se,m as le}from"./dataService-DfeYa0Z1.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm";let S="borrower",u=null,$=[],x={...g},n={...g},I=!1,L=!1,ne=!1,de=!1;const T=[{key:"primary_color",label:"Primary Color",description:"Used for CTAs, highlights and primary focus states."},{key:"secondary_color",label:"Secondary Color",description:"Used for gradients, hover states and charts."},{key:"tertiary_color",label:"Tertiary Color",description:"Used for gradients and subtle accents."}],ie=e=>{switch(e){case"super_admin":return"bg-purple-100 text-purple-700 border-purple-200";case"admin":return"bg-blue-100 text-blue-700 border-blue-200";case"base_admin":return"bg-orange-100 text-orange-700 border-orange-200";default:return"bg-green-50 text-green-700 border-green-200"}},B=e=>{switch(e){case"super_admin":return"SUPER ADMIN";case"admin":return"LOAN MANAGER";case"base_admin":return"LOAN OFFICER";default:return"CLIENT"}},X=(e,t={})=>{const{sizeClass:a="w-10 h-10",textClass:r="text-sm"}=t,o=e.full_name||"U";return e.avatar_url?`<img src="${e.avatar_url}" class="${a} rounded-full object-cover border border-gray-200 shadow-sm" alt="${o}">`:`
    <div class="${a} rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center ${r} font-bold text-gray-600">
      ${o.charAt(0).toUpperCase()}
    </div>
  `},i=(e,t="success")=>{let a=document.getElementById("toast-container");a||(a=document.createElement("div"),a.id="toast-container",a.className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none",document.body.appendChild(a));const r=document.createElement("div"),o=t==="success"?"bg-gray-900 text-white":"bg-red-600 text-white",d=t==="success"?'<i class="fa-solid fa-check-circle"></i>':'<i class="fa-solid fa-circle-exclamation"></i>';r.className=`${o} px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 transform transition-all duration-300 translate-y-4 opacity-0 min-w-[300px] pointer-events-auto`,r.innerHTML=`${d}<span class="font-medium text-sm">${e}</span>`,a.appendChild(r),requestAnimationFrame(()=>r.classList.remove("translate-y-4","opacity-0")),setTimeout(()=>{r.classList.add("opacity-0","translate-y-2"),setTimeout(()=>r.remove(),300)},3e3)},ce=(e=[])=>Array.isArray(e)?e.map((t={})=>({title:typeof t.title=="string"?t.title:"",text:typeof t.text=="string"?t.text:""})):[],M=e=>{const t=g.carousel_slides||[],a=ce(Array.isArray(e)&&e.length?e:t),r=t.length||3;for(;a.length<r;){const o=t[a.length]||{title:"",text:""};a.push({...o})}return a.slice(0,r).map((o,d)=>{var l,y,h,w;return{title:((l=o.title)==null?void 0:l.trim())||((y=t[d])==null?void 0:y.title)||"",text:((h=o.text)==null?void 0:h.trim())||((w=t[d])==null?void 0:w.text)||""}})},v=(e,t=!1)=>typeof e=="boolean"?e:typeof e=="string"?e.toLowerCase()==="true":t,f=e=>{if(!e)return null;let t=e.trim().replace("#","");return t.length===3&&(t=t.split("").map(a=>a+a).join("")),/^[0-9A-Fa-f]{6}$/.test(t)?`#${t.toUpperCase()}`:null},G=e=>(typeof e=="string"?e.trim():"")||g.company_name,b=(e={})=>({...g,...e,company_name:G(e==null?void 0:e.company_name),auth_overlay_color:f(e==null?void 0:e.auth_overlay_color)||g.auth_overlay_color,auth_overlay_enabled:v(e==null?void 0:e.auth_overlay_enabled,g.auth_overlay_enabled),auth_background_flip:v(e==null?void 0:e.auth_background_flip,g.auth_background_flip),carousel_slides:M(e.carousel_slides)}),U=()=>M(n==null?void 0:n.carousel_slides),O=(e="")=>(e||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;"),ue=(e="")=>(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),pe=()=>{T.forEach(({key:t})=>{const a=document.querySelector(`[data-color-picker="${t}"]`),r=document.querySelector(`[data-color-input="${t}"]`);a&&(a.value=n[t]),r&&(r.value=n[t])});const e=document.getElementById("brand-gradient-preview");e&&(e.style.backgroundImage=`linear-gradient(120deg, ${n.primary_color}, ${n.secondary_color}, ${n.tertiary_color})`),document.querySelectorAll("[data-theme-mode]").forEach(t=>{t.dataset.themeMode===n.theme_mode?(t.classList.add("bg-gray-900","text-white","shadow"),t.classList.remove("text-gray-600","bg-white")):(t.classList.remove("bg-gray-900","text-white","shadow"),t.classList.add("text-gray-600","bg-white"))}),ye(),fe(),xe(),ve(),k()},k=()=>{const e=document.getElementById("save-system-settings"),t=document.getElementById("system-settings-status");e&&(e.disabled=!I||L,e.innerHTML=L?'<i class="fa-solid fa-circle-notch fa-spin mr-2"></i>Saving':"Save Changes"),t&&(t.textContent=I?"Unsaved changes":"Theme saved",t.className=I?"text-xs text-orange-600 font-bold":"text-xs text-green-600 font-bold")},ge=()=>{I=!0,k()},p=e=>{const t={...e};e.carousel_slides&&(t.carousel_slides=M(e.carousel_slides)),n=b({...n,...t}),ge(),Z(n),pe()},me=()=>(n.company_logo_url||"").trim(),be=()=>(n.auth_background_url||"").trim(),ye=()=>{const e=me(),t=document.getElementById("company-logo-preview"),a=document.getElementById("company-logo-empty"),r=document.getElementById("remove-logo-btn"),o=document.getElementById("logo-url-input");t&&(e?(t.src=e,t.classList.remove("hidden"),a&&a.classList.add("hidden")):(t.src="",t.classList.add("hidden"),a&&a.classList.remove("hidden"))),r&&(r.disabled=!e||ne),o&&document.activeElement!==o&&(o.value=e)},fe=()=>{const e=be(),t=v(n.auth_background_flip,!1),a=document.getElementById("auth-bg-preview"),r=document.getElementById("auth-bg-empty"),o=document.getElementById("wallpaper-flip-toggle"),d=document.getElementById("remove-wallpaper-btn"),l=document.getElementById("wallpaper-url-input");a&&(a.style.backgroundImage=e?`url('${e}')`:"none",a.style.transform=t?"scaleX(-1)":"scaleX(1)",r&&r.classList.toggle("hidden",!!e)),o&&(o.checked=t),d&&(d.disabled=!e||de),l&&document.activeElement!==l&&(l.value=e)},xe=()=>{const e=f(n.auth_overlay_color)||g.auth_overlay_color,t=v(n.auth_overlay_enabled,!0),a=document.getElementById("overlay-color-picker"),r=document.getElementById("overlay-color-input"),o=document.getElementById("overlay-disable-toggle");a&&(a.value=e),r&&(r.value=e),o&&(o.checked=!t)},ve=()=>{U().forEach((t,a)=>{const r=document.querySelector(`[data-carousel-field="title"][data-carousel-index="${a}"]`),o=document.querySelector(`[data-carousel-field="text"][data-carousel-index="${a}"]`);r&&r!==document.activeElement&&(r.value=t.title),o&&o!==document.activeElement&&(o.value=t.text)})};function he(){const e=document.getElementById("main-content");if(!e)return;e.innerHTML=`
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
      <div class="flex border-b border-gray-200 bg-gray-50/50 px-6 overflow-x-auto">
        <button class="tab-btn active" data-tab="profile"><i class="fa-solid fa-id-card mr-2"></i>My Profile</button>
        <button class="tab-btn" data-tab="security"><i class="fa-solid fa-shield-halved mr-2"></i>Security</button>
        ${S==="super_admin"?`
          <button class="tab-btn" data-tab="users"><i class="fa-solid fa-users-gear mr-2"></i>User Management</button>
          <button class="tab-btn" data-tab="billing"><i class="fa-solid fa-credit-card mr-2"></i>Billing</button>
          <button class="tab-btn" data-tab="system"><i class="fa-solid fa-sliders mr-2"></i>System Branding</button>
        `:""}
      </div>

      <div id="tab-content" class="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar relative"></div>
    </div>

    <div id="role-modal" class="hidden fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Change User Role</h3>
            <div class="bg-blue-50 p-3 rounded-lg mb-4 flex items-start gap-3">
                <i class="fa-solid fa-circle-info text-blue-500 mt-0.5"></i>
                <div class="text-sm text-blue-800">
                    User: <strong id="modal-user-name">...</strong><br>
                    Current Role: <span id="modal-current-role" class="uppercase text-xs font-bold">...</span>
                </div>
            </div>
            <form id="role-form">
                <input type="hidden" id="modal-user-id">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-2">New Role Assignment</label>
                <select id="modal-role-select" class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-orange-500 focus:border-orange-500 mb-6">
                    <option value="borrower">Client (Borrower)</option>
                    <option value="base_admin">Loan Officer (Base Admin)</option>
                    <option value="admin">Branch Manager (Admin)</option>
                    <option value="super_admin">Super Admin</option>
                </select>
                <div class="flex justify-end gap-3">
                    <button type="button" onclick="document.getElementById('role-modal').classList.add('hidden')" class="px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-gray-900 text-white font-bold text-sm rounded-lg hover:bg-black shadow-sm">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
  `;const t=document.createElement("style");t.innerHTML=`
    .tab-btn { padding: 1rem 1.5rem; font-size: 0.875rem; font-weight: 600; color: #6B7280; border-bottom: 2px solid transparent; transition: all 0.2s; white-space: nowrap; }
    .tab-btn:hover { color: #111827; background: #F3F4F6; }
    .tab-btn.active { color: #EA580C; border-bottom-color: #EA580C; background: #FFF; }
  `,document.head.appendChild(t),we(),A()}function we(){const e=document.querySelectorAll(".tab-btn");e.forEach(a=>{a.onclick=()=>{e.forEach(o=>o.classList.remove("active")),a.classList.add("active");const r=a.dataset.tab;r==="profile"?A():r==="security"?Ee():r==="users"?W():r==="billing"?_e():r==="system"&&Ie()}});const t=document.getElementById("role-form");t&&t.addEventListener("submit",async a=>{a.preventDefault();const r=document.getElementById("modal-user-id").value,o=document.getElementById("modal-role-select").value;try{const{error:d}=await ee(r,o);if(d)throw new Error(d);i("Role updated successfully","success"),document.getElementById("role-modal").classList.add("hidden"),W()}catch(d){i(d.message,"error")}})}function A(){const e=document.getElementById("tab-content");e.innerHTML=`
        <div class="max-w-2xl animate-fade-in">
            <h2 class="text-2xl font-bold text-gray-900 mb-1">My Profile</h2>
            <p class="text-sm text-gray-500 mb-8">Manage your personal account details.</p>
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div class="flex items-center gap-6 mb-8">
                    <div class="relative group cursor-pointer w-20 h-20">
                        ${X({...u,avatar_url:u.avatar_url},{sizeClass:"w-20 h-20",textClass:"text-2xl"})} 
                        <div class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <i class="fa-solid fa-camera text-white"></i>
                        </div>
                        <input type="file" id="avatar-input" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*">
                        <div id="avatar-spinner" class="absolute inset-0 w-full h-full bg-black/70 rounded-full flex items-center justify-center hidden"><i class="fa-solid fa-spinner fa-spin text-white"></i></div>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-900">${u.full_name||"User"}</h3>
                        <p class="text-sm text-gray-500">${u.email||""}</p>
                        <span class="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase border border-gray-200">
                            ${B(u.role)}
                        </span>
                    </div>
                </div>
                <form id="profile-form" class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                            <input type="text" id="prof-name" value="${u.full_name||""}" class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-orange-500 focus:border-orange-500">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Number</label>
                            <input type="text" id="prof-phone" value="${u.contact_number||""}" class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-orange-500 focus:border-orange-500">
                        </div>
                    </div>
                    <div class="flex justify-end pt-4">
                        <button type="submit" id="save-profile" class="px-6 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-lg hover:bg-black shadow-lg transition-all">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `,document.getElementById("profile-form").addEventListener("submit",async t=>{t.preventDefault();const a=document.getElementById("save-profile"),r=a.innerHTML;a.disabled=!0,a.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';try{const o={full_name:document.getElementById("prof-name").value,contact_number:document.getElementById("prof-phone").value},{error:d}=await te(o);if(d)throw new Error(d);u={...u,...o},i("Profile Updated","success")}catch(o){i(o.message,"error")}finally{a.disabled=!1,a.innerHTML=r}}),document.getElementById("avatar-input").addEventListener("change",async t=>{const a=t.target.files[0];if(a){document.getElementById("avatar-spinner").classList.remove("hidden");try{const r=a.name.split(".").pop(),o=`${u.id}/${Date.now()}.${r}`,{error:d}=await C.storage.from("avatars").upload(o,a,{upsert:!0});if(d)throw d;const{data:l}=C.storage.from("avatars").getPublicUrl(o);await ae(l.publicUrl),u.avatar_url=l.publicUrl,A(),i("Avatar updated","success")}catch(r){i("Failed to upload: "+r.message,"error")}finally{}}})}function Ee(){const e=document.getElementById("tab-content");e.innerHTML=`
        <div class="max-w-2xl animate-fade-in">
            <h2 class="text-2xl font-bold text-gray-900 mb-1">Security</h2>
            <p class="text-sm text-gray-500 mb-8">Update your password and security settings.</p>
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <form id="security-form" class="space-y-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">New Password</label>
                        <input type="password" id="sec-pass" class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-orange-500 focus:border-orange-500" placeholder="••••••••">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm Password</label>
                        <input type="password" id="sec-confirm" class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-orange-500 focus:border-orange-500" placeholder="••••••••">
                    </div>
                    <div class="pt-4">
                        <button type="submit" class="px-6 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-lg hover:bg-black shadow-lg transition-all">Update Password</button>
                    </div>
                </form>
            </div>
        </div>
    `,document.getElementById("security-form").addEventListener("submit",async t=>{t.preventDefault();const a=document.getElementById("sec-pass").value,r=document.getElementById("sec-confirm").value;if(a!==r)return i("Passwords do not match","error");if(a.length<6)return i("Password too short (min 6 chars)","error");const{error:o}=await C.auth.updateUser({password:a});o?i(o.message,"error"):(i("Password updated successfully","success"),t.target.reset())})}async function W(){const e=document.getElementById("tab-content");if(e){e.innerHTML=`
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
            <h2 class="text-2xl font-bold text-gray-900">User Management</h2>
            <p class="text-sm text-gray-500">Manage permissions and roles for all users.</p>
        </div>
        <div class="relative w-full sm:w-72">
            <input type="text" id="user-search" placeholder="Search users..." 
                   class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm transition-shadow">
            <i class="fa-solid fa-search absolute left-3 top-2.5 text-gray-400"></i>
        </div>
    </div>
    
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="overflow-x-auto custom-scrollbar">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User Identity</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">System ID</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Current Role</th>
                        <th class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody id="user-management-list" class="bg-white divide-y divide-gray-200">
                    <tr><td colspan="4" class="p-12 text-center text-gray-400"><i class="fa-solid fa-circle-notch fa-spin text-2xl"></i><br>Loading directory...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="mt-4 text-xs text-gray-400 text-right" id="user-count"></div>
  `;try{const t=await re();$=Array.isArray(t)?t:[];const a=r=>{const o=document.getElementById("user-management-list"),d=document.getElementById("user-count");if(d&&(d.textContent=`Showing ${r.length} users`),r.length===0){o.innerHTML='<tr><td colspan="4" class="p-8 text-center text-sm text-gray-500">No users found.</td></tr>';return}o.innerHTML=r.map(l=>{const y=(u==null?void 0:u.id)===l.id;return`
              <tr class="hover:bg-gray-50 transition-colors group">
                  <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                          ${X(l,{sizeClass:"w-9 h-9",textClass:"text-xs"})}
                          <div>
                              <div class="text-sm font-bold text-gray-900">${l.full_name||"Unknown"}</div>
                              <div class="text-xs text-gray-500">${l.email||"No email"}</div>
                          </div>
                      </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block border border-gray-100" title="${l.id}">
                          ${l.id.substring(0,8)}...
                      </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${ie(l.role)}">
                          ${B(l.role)}
                      </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                      ${y?'<span class="text-xs text-gray-400 italic">Current User</span>':`
                      <button class="change-role-btn text-gray-600 hover:text-orange-600 font-bold text-xs bg-white border border-gray-200 hover:border-orange-200 px-3 py-1.5 rounded-lg transition-colors shadow-sm inline-flex items-center gap-2"
                          data-user-id="${l.id}" 
                          data-user-name="${l.full_name||"User"}" 
                          data-user-role="${l.role}">
                          <i class="fa-solid fa-user-tag"></i> Change Role
                      </button>`}
                  </td>
              </tr>
            `}).join(""),o.querySelectorAll(".change-role-btn").forEach(l=>{l.onclick=()=>{document.getElementById("modal-user-id").value=l.dataset.userId,document.getElementById("modal-user-name").textContent=l.dataset.userName,document.getElementById("modal-current-role").textContent=B(l.dataset.userRole),document.getElementById("modal-role-select").value=l.dataset.userRole,document.getElementById("role-modal").classList.remove("hidden")}})};a($),document.getElementById("user-search").addEventListener("input",r=>{const o=r.target.value.toLowerCase(),d=$.filter(l=>(l.full_name||"").toLowerCase().includes(o)||(l.email||"").toLowerCase().includes(o)||(l.id||"").toLowerCase().includes(o));a(d)})}catch(t){console.error(t),document.getElementById("user-management-list").innerHTML=`<tr><td colspan="4" class="p-8 text-center text-red-600">Error: ${t.message}</td></tr>`}}}window.openRoleModal=(e,t,a)=>{document.getElementById("modal-user-id").value=e,document.getElementById("modal-user-name").textContent=t,document.getElementById("modal-current-role").textContent=B(a),document.getElementById("modal-role-select").value=a,document.getElementById("role-modal").classList.remove("hidden")};async function _e(){const e=document.getElementById("tab-content");e.innerHTML=`
        <div class="max-w-4xl animate-fade-in">
            <h2 class="text-2xl font-bold text-gray-900 mb-1">Billing & Payments</h2>
            <p class="text-sm text-gray-500 mb-8">Manage disbursement methods.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 class="font-bold text-gray-800 mb-4">Add Payment Method</h3>
                    <form id="card-form" class="space-y-4">
                        <div><label class="block text-xs font-bold text-gray-500 uppercase mb-1">Card Type</label><select id="card-type" class="w-full border-gray-300 rounded-lg text-sm p-2.5"><option value="visa">Visa</option><option value="mastercard">Mastercard</option></select></div>
                        <div><label class="block text-xs font-bold text-gray-500 uppercase mb-1">Last 4 Digits</label><input type="text" id="card-last4" maxlength="4" class="w-full border-gray-300 rounded-lg text-sm p-2.5" placeholder="1234"></div>
                        <div class="grid grid-cols-2 gap-4"><input type="text" id="card-mm" maxlength="2" placeholder="MM" class="w-full border-gray-300 rounded-lg text-sm p-2.5"><input type="text" id="card-yy" maxlength="4" placeholder="YYYY" class="w-full border-gray-300 rounded-lg text-sm p-2.5"></div>
                        <button type="submit" class="w-full py-2.5 bg-gray-900 text-white font-bold text-sm rounded-lg hover:bg-black mt-2">Add Card</button>
                    </form>
                </div>
                <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 class="font-bold text-gray-800 mb-4">Saved Cards</h3>
                    <div id="cards-list" class="space-y-3"><p class="text-sm text-gray-400 italic">Loading...</p></div>
                </div>
            </div>
        </div>
    `;const t=async()=>{const{data:a}=await le(),r=document.getElementById("cards-list");if(!a||a.length===0){r.innerHTML='<p class="text-sm text-gray-400 italic">No cards saved.</p>';return}r.innerHTML=a.map(o=>`
            <div class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <i class="fa-brands fa-cc-${o.card_type} text-2xl text-gray-600"></i>
                <div class="flex-1"><p class="text-sm font-bold text-gray-800">•••• ${o.last_four}</p><p class="text-xs text-gray-500">Exp: ${o.expiry_month}/${o.expiry_year}</p></div>
                ${o.is_default?'<span class="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold uppercase">Default</span>':""}
            </div>
        `).join("")};t(),document.getElementById("card-form").addEventListener("submit",async a=>{a.preventDefault();const r={p_card_type:document.getElementById("card-type").value,p_last_four:document.getElementById("card-last4").value,p_expiry_month:document.getElementById("card-mm").value,p_expiry_year:document.getElementById("card-yy").value},{error:o}=await oe(r);o?i(o.message,"error"):(i("Card Added","success"),a.target.reset(),t())})}async function Ie(){var h,w,P,D,F,j,H,N,R,z,q;const e=document.getElementById("tab-content");if(!e)return;try{const{data:s}=await V();s&&(x=b(s),n=b(s))}catch(s){console.error("Settings Sync Error:",s)}const t=n.company_logo_url||"",a=n.auth_background_url||"",r=O(G(n.company_name)),o=f(n.auth_overlay_color)||g.auth_overlay_color,d=!v(n.auth_overlay_enabled,!0),l=v(n.auth_background_flip,!1),y=U();e.innerHTML=`
        <div class="max-w-5xl space-y-8 animate-fade-in">
            <div class="flex items-center justify-between">
                <div><h2 class="text-2xl font-bold text-gray-900">System Branding</h2><p class="text-sm text-gray-500">Customize the look and feel of the platform.</p></div>
                <div class="text-right">
                    <button id="save-system-settings" class="px-6 py-2.5 bg-brand-accent text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Save Changes</button>
                    <p id="system-settings-status" class="text-xs text-gray-400 mt-2 font-medium">No pending changes</p>
                </div>
            </div>

            <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Company Identity</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Company Name</label>
                        <input type="text" id="company-name-input" value="${r}" class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-orange-500 focus:border-orange-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Company Logo</label>
                        <div class="flex flex-col lg:flex-row gap-4">
                            <div class="h-20 w-20 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                ${t?`<img src="${t}" class="h-full w-full object-contain">`:'<i class="fa-solid fa-image text-gray-300 text-2xl"></i>'}
                            </div>
                            <div class="space-y-3 flex-1">
                                <div class="flex gap-2">
                                    <label class="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-50 text-center">
                                        Upload File <input type="file" id="logo-file-input" class="hidden" accept="image/*">
                                    </label>
                                    ${t?'<button id="remove-logo-btn" class="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Remove</button>':""}
                                </div>
                                <div class="flex gap-2">
                                    <input type="url" id="logo-url-input" value="${t}" class="flex-1 border-gray-300 rounded-lg p-1.5 text-xs focus:ring-orange-500" placeholder="https://...">
                                    <button id="apply-logo-url" class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200">Use Link</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Theme Colors</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${T.map(s=>`
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">${s.label}</label>
                            <div class="flex items-center gap-2">
                                <input type="color" data-color-picker="${s.key}" value="${n[s.key]}" class="h-10 w-10 rounded cursor-pointer border border-gray-300 p-0 overflow-hidden">
                                <input type="text" data-color-input="${s.key}" value="${n[s.key]}" class="flex-1 border-gray-300 rounded-lg p-2 text-sm font-mono uppercase focus:ring-orange-500">
                            </div>
                        </div>`).join("")}
                </div>
                <div class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-4">
                    <span class="text-xs font-bold text-gray-500 uppercase">Preview:</span>
                    <div id="brand-gradient-preview" class="flex-1 h-8 rounded-lg shadow-inner" style="background: linear-gradient(90deg, ${n.primary_color}, ${n.secondary_color}, ${n.tertiary_color})"></div>
                </div>
            </section>

            <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Login Styling</h4>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Wallpaper</label>
                        <div id="auth-bg-preview" class="h-40 rounded-xl border border-gray-300 bg-gray-100 flex items-center justify-center relative overflow-hidden bg-cover bg-center mb-3" style="background-image: ${a?`url('${a}')`:"none"}; transform: scaleX(${l?"-1":"1"});">
                             ${a?"":'<span class="text-xs text-gray-400 font-bold">Default</span>'}
                        </div>
                        <div class="space-y-3">
                            <div class="flex gap-2">
                                <label class="cursor-pointer px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black">
                                    <i class="fa-solid fa-cloud-arrow-up mr-1"></i> Upload
                                    <input type="file" id="wallpaper-file-input" class="hidden" accept="image/*">
                                </label>
                                ${a?'<button id="remove-wallpaper-btn" class="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Remove</button>':""}
                            </div>
                            <div class="flex gap-2">
                                <input type="url" id="wallpaper-url-input" value="${a}" class="flex-1 border-gray-300 rounded-lg p-1.5 text-xs focus:ring-orange-500" placeholder="https://...">
                                <button id="apply-wallpaper-url" class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200">Use Link</button>
                            </div>
                            <label class="flex items-center gap-2 cursor-pointer pt-2">
                                <input type="checkbox" id="wallpaper-flip-toggle" class="rounded text-orange-600" ${l?"checked":""}>
                                <span class="text-xs font-medium text-gray-700">Flip Horizontal</span>
                            </label>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Overlay Tint</label>
                            <div class="flex items-center gap-2">
                                <input type="color" id="overlay-color-picker" value="${o}" class="h-10 w-10 rounded border border-gray-300 cursor-pointer">
                                <input type="text" id="overlay-color-input" value="${o}" class="w-32 border-gray-300 rounded-lg p-2 text-sm font-mono uppercase">
                            </div>
                        </div>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" id="overlay-disable-toggle" class="rounded text-orange-600" ${d?"checked":""}>
                            <span class="text-sm font-medium text-gray-700">Disable Overlay</span>
                        </label>
                    </div>
                </div>
            </section>

            <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Login Text</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${y.map((s,c)=>`
                        <div class="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Slide ${c+1}</span>
                            <input type="text" value="${O(s.title)}" data-carousel-index="${c}" data-carousel-field="title" class="w-full border-gray-300 rounded-lg text-sm font-bold p-2 focus:ring-orange-500" placeholder="Title">
                            <textarea rows="3" data-carousel-index="${c}" data-carousel-field="text" class="w-full border-gray-300 rounded-lg text-xs p-2 focus:ring-orange-500 resize-none" placeholder="Description">${ue(s.text)}</textarea>
                        </div>
                    `).join("")}
                </div>
            </section>
        </div>
    `,T.forEach(({key:s})=>{var c,E;(c=document.querySelector(`[data-color-picker="${s}"]`))==null||c.addEventListener("input",_=>{const m=f(_.target.value);m&&p({[s]:m})}),(E=document.querySelector(`[data-color-input="${s}"]`))==null||E.addEventListener("change",_=>{const m=f(_.target.value);m&&p({[s]:m})})}),(h=document.getElementById("company-name-input"))==null||h.addEventListener("input",s=>p({company_name:s.target.value})),(w=document.getElementById("wallpaper-flip-toggle"))==null||w.addEventListener("change",s=>p({auth_background_flip:s.target.checked})),(P=document.getElementById("overlay-disable-toggle"))==null||P.addEventListener("change",s=>p({auth_overlay_enabled:!s.target.checked})),(D=document.getElementById("overlay-color-picker"))==null||D.addEventListener("input",s=>{const c=f(s.target.value);c&&p({auth_overlay_color:c})}),document.querySelectorAll("[data-carousel-field]").forEach(s=>{s.addEventListener("input",c=>{const E=parseInt(c.target.dataset.carouselIndex),_=c.target.dataset.carouselField,m=[...U()];m[E]={...m[E],[_]:c.target.value},p({carousel_slides:m})})}),(F=document.getElementById("save-system-settings"))==null||F.addEventListener("click",async()=>{if(L)return;L=!0,k();const{data:s,error:c}=await se(n);c?i("Failed to save: "+c,"error"):(i("System settings saved!","success"),x=b(s),n=b(s),I=!1,Y(x)),L=!1,k()}),(j=document.getElementById("logo-file-input"))==null||j.addEventListener("change",Le),(H=document.getElementById("remove-logo-btn"))==null||H.addEventListener("click",()=>{p({company_logo_url:null}),i("Logo removed (pending save).","success")}),(N=document.getElementById("apply-logo-url"))==null||N.addEventListener("click",()=>{const s=document.getElementById("logo-url-input").value.trim();s&&(p({company_logo_url:s}),i("Logo link applied. Save to confirm.","success"))}),(R=document.getElementById("wallpaper-file-input"))==null||R.addEventListener("change",ke),(z=document.getElementById("remove-wallpaper-btn"))==null||z.addEventListener("click",()=>{p({auth_background_url:null}),i("Wallpaper removed (pending save).","success")}),(q=document.getElementById("apply-wallpaper-url"))==null||q.addEventListener("click",()=>{const s=document.getElementById("wallpaper-url-input").value.trim();s&&(p({auth_background_url:s}),i("Wallpaper link applied. Save to confirm.","success"))}),k()}async function Le(e){const t=e.target.files[0];if(t)try{const a=new FormData;a.append("file",t),a.append("type","logo");const r=await fetch("/api/upload/branding",{method:"POST",body:a}),o=await r.json();if(!r.ok)throw new Error(o.error||`Server error ${r.status}`);p({company_logo_url:o.url}),i("Logo uploaded successfully!","success")}catch(a){i("Upload failed: "+a.message,"error")}}async function ke(e){const t=e.target.files[0];if(t)try{const a=new FormData;a.append("file",t),a.append("type","wallpaper");const r=await fetch("/api/upload/branding",{method:"POST",body:a}),o=await r.json();if(!r.ok)throw new Error(o.error||`Server error ${r.status}`);p({auth_background_url:o.url}),i("Wallpaper uploaded successfully!","success")}catch(a){i("Upload failed: "+a.message,"error")}}async function Be(){try{const{data:e}=await V();e&&(x=b(e),n=b(e),Y(x))}catch(e){console.error("Init Settings Error:",e)}}document.addEventListener("DOMContentLoaded",async()=>{const e=await J();if(e){if(S=e.role,u=e.profile,S==="super_admin")await Be();else{await K();const t=Q();if(t){const a=b(t);x=a,n=b(a)}}he()}});
