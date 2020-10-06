var table=null,colName=0,colLoot=1,colWishlist=2,colPrios=3,colRecipes=4,colRoles=5,colNotes=6,colClass=7,colRaid=8,allItemsVisible=!1;function createTable(){return memberTable=$("#characterTable").DataTable({autoWidth:!1,data:characters,columns:[{title:'<span class="fas fa-fw fa-user"></span> Character',data:"character",render:function render(e,a,t){return'\n                    <ul class="no-bullet no-indent mb-2">\n                        <li>\n                            <div class="dropdown text-'.concat(t.class?t.class.toLowerCase():"",'">\n                                <a class="dropdown-toggle text-4 font-weight-bold text-').concat(t.class.toLowerCase(),'"\n                                    id="character').concat(t.id,'Dropdown"\n                                    role="button"\n                                    data-toggle="dropdown"\n                                    aria-haspopup="true"\n                                    aria-expanded="false"\n                                    title="').concat(t.member?t.member.username:"",'">\n                                    ').concat(t.name,'\n                                </a>\n                                <div class="dropdown-menu" aria-labelledby="character').concat(t.id,'Dropdown">\n                                    <a class="dropdown-item" href="/').concat(guild.id,"/").concat(guild.slug,"/c/").concat(t.id,"/").concat(t.slug,'" target="_blank">\n                                        Profile\n                                    </a>\n                                    <a class="dropdown-item" href="/').concat(guild.id,"/").concat(guild.slug,"/audit-log?character_id=").concat(t.id,'" target="_blank">\n                                        Logs\n                                    </a>\n                                    ').concat(showEdit?'<a class="dropdown-item" href="/'.concat(guild.id,"/").concat(guild.slug,"/c/").concat(t.id,"/").concat(t.slug,'/edit" target="_blank">\n                                            Edit\n                                        </a>\n                                        <a class="dropdown-item" href="/').concat(guild.id,"/").concat(guild.slug,"/c/").concat(t.id,"/").concat(t.slug,'/loot" target="_blank">\n                                            Loot\n                                        </a>'):"","\n                                </div>\n                            </div>\n                        </li>\n                        ").concat(t.is_alt||t.raid_name||t.class?"\n                            <li>\n                                ".concat(t.is_alt?'\n                                    <span class="text-legendary font-weight-bold">Alt</span>&nbsp;\n                                ':"","\n                                ").concat(t.raid_name?'\n                                    <span class="font-weight-bold">\n                                        <span class="role-circle" style="background-color:'.concat(t.raid_color?getColorFromDec(parseInt(t.raid_color)):"",'"></span>\n                                        ').concat(t.raid_name?t.raid_name:"","\n                                    </span>\n                                "):"","\n                                ").concat(t.class?t.class:"","\n                            </li>"):"","\n\n                        ").concat(t.level||t.race||t.spec?"\n                            <li>\n                                <small>\n                                    ".concat(t.level?t.level:"","\n                                    ").concat(t.race?t.race:"","\n                                    ").concat(t.spec?t.spec:"","\n                                </small>\n                            </li>"):"","\n\n                        ").concat(t.rank||t.profession_1||t.profession_2?"\n                            <li>\n                                <small>\n                                    ".concat(t.rank?"Rank "+t.rank+(t.profession_1||t.profession_2?",":""):"","\n                                    ").concat(t.profession_1?t.profession_1+(t.profession_2?",":""):"","\n                                    ").concat(t.profession_2?t.profession_2:"","\n                                </small>\n                            </li>"):"","\n                    </ul>")},visible:!0,width:"250px"},{title:'<span class="text-success fas fa-fw fa-sack"></span> Loot Received',data:"received",render:function render(e,a,t){return e&&e.length?getItemList(e,"received",t.id):"—"},orderable:!1,visible:!0,width:"280px"},{title:'<span class="text-legendary fas fa-fw fa-scroll-old"></span> Wishlist',data:"wishlist",render:function render(e,a,t){return e&&e.length?getItemList(e,"wishlist",t.id):"—"},orderable:!1,visible:!!showWishlist,width:"280px"},{title:'<span class="text-gold fas fa-fw fa-sort-amount-down"></span> Prio\'s',data:"prios",render:function render(e,a,t){return e&&e.length?getItemList(e,"prio",t.id,!0):"—"},orderable:!1,visible:!!showPrios,width:"280px"},{title:'<span class="text-gold fas fa-fw fa-book"></span> Recipes',data:"recipes",render:function render(e,a,t){return e&&e.length?getItemList(e,"recipes",t.id):"—"},orderable:!1,visible:!1,width:"280px"},{title:"Roles",data:"user.roles",render:function render(e,a,t){var n="";return e&&e.length>0?(n='<ul class="list-inline">',e.forEach(function(e,a){var t=0!=e.color?"#"+rgbToHex(e.color):"#FFFFFF";n+='<li class="list-inline-item"><span class="tag" style="border-color:'.concat(t,';"><span class="role-circle" style="background-color:').concat(t,'"></span>').concat(e.name,"</span></li>")}),n+="</ul>"):n="—",n},orderable:!1,visible:!1},{title:'<span class="fas fa-fw fa-comment-alt-lines"></span> Notes',data:"public_note",render:function render(e,a,t){return(t.public_note?nl2br(t.public_note):"—")+(t.officer_note?'<br><small class="font-weight-bold">Officer\'s Note</small><br><em>'+nl2br(t.officer_note)+"</em>":"")},orderable:!1,visible:!0,width:"280px"},{title:"Class",data:"class",render:function render(e,a,t){return t.class?t.class:null},visible:!1},{title:"Raid",data:"raid",render:function render(e,a,t){return t.raid_name?t.raid_name:null},visible:!1}],order:[],paging:!1,initComplete:function initComplete(){var e=[colClass,colRaid];this.api().columns().every(function(a){var t=this,n=null,i=null;a==colClass&&(n=$("#class_filter"),i=null),a==colRaid&&(n=$("#raid_filter"),i=null),e.includes(a)&&(n.on("change",function(){var e=$.fn.dataTable.util.escapeRegex($(this).val());i&&i.val()&&(e="(?=.*"+e+")(?=.*"+$.fn.dataTable.util.escapeRegex(i.val())+")"),t.search(e||"",!0,!1).draw()}).change(),i&&i.on("change",function(){var e=$.fn.dataTable.util.escapeRegex($(this).val());n&&n.val()&&(e="(?=.*"+e+")(?=.*"+$.fn.dataTable.util.escapeRegex(n.val())+")"),t.search(e||"",!0,!1).draw()}).change())}),makeWowheadLinks(),addItemAutocompleteHandler(),addTagInputHandlers()}}),memberTable}function addClippedItemHandlers(){$(".js-show-clipped-items").click(function(){var e=$(this).data("id"),a=$(this).data("type");$(".js-clipped-item[data-id='"+e+"'][data-type='"+a+"']").show(),$(".js-show-clipped-items[data-id='"+e+"'][data-type='"+a+"']").hide(),$(".js-hide-clipped-items[data-id='"+e+"'][data-type='"+a+"']").show()}),$(".js-hide-clipped-items").click(function(){var e=$(this).data("id"),a=$(this).data("type");$(".js-clipped-item[data-id='"+e+"'][data-type='"+a+"']").hide(),$(".js-show-clipped-items[data-id='"+e+"'][data-type='"+a+"']").show(),$(".js-hide-clipped-items[data-id='"+e+"'][data-type='"+a+"']").hide()})}function getItemList(e,a,t){var n=arguments.length>3&&void 0!==arguments[3]&&arguments[3],i='<ol class="no-indent js-item-list mb-2" data-type="'.concat(a,'" data-id="').concat(t,'">'),l=4,s=null;return $.each(e,function(l,c){var o=!1;l>=4&&(o=!0,4==l&&(i+='<li class="js-show-clipped-items small cursor-pointer no-bullet " data-type="'.concat(a,'" data-id="').concat(t,'">show ').concat(e.length-4," more…</li>"))),"prio"==a&&c.pivot.raid_id&&c.pivot.raid_id!=s&&(s=c.pivot.raid_id,i+='\n                <li data-raid-id="" class="js-item-wishlist-character no-bullet font-weight-normal font-italic text-muted small">\n                    '.concat(raids.find(function(e){return e.id===c.pivot.raid_id}).name,"\n                </li>\n            ")),i+='\n            <li class="font-weight-normal '.concat(o?"js-clipped-item":""," ").concat(!c.pivot.is_received||"wishlist"!=c.pivot.type&&"prio"!=c.pivot.type?"":"font-strikethrough",'"\n                data-type="').concat(a,'"\n                data-id="').concat(t,'"\n                value="').concat(n?c.pivot.order:"",'"\n                style="').concat(o?"display:none;":"",'">\n                <a href="/').concat(guild.id,"/").concat(guild.slug,"/i/").concat(c.item_id,"/").concat(slug(c.name),'"\n                    data-wowhead-link="https://classic.wowhead.com/item=').concat(c.item_id,'"\n                    data-wowhead="item=').concat(c.item_id,'?domain=classic">\n                    ').concat(c.name,"\n                </a>\n                ").concat(c.pivot.is_offspec?'<span title="offspec item" class="font-weight-medium text-muted">OS</span>':"",'\n                <span class="js-watchable-timestamp js-timestamp-title smaller text-muted"\n                    data-timestamp="').concat(c.pivot.received_at?c.pivot.received_at:c.pivot.created_at,'"\n                    data-title="added by ').concat(c.added_by_username,' at"\n                    data-is-short="1">\n                </span>\n            </li>')}),e.length>4&&(i+='<li class="js-hide-clipped-items small cursor-pointer no-bullet" style="display:none;" data-type="'.concat(a,'" data-id="').concat(t,'">show less</li>')),i+="</ol>"}$(document).ready(function(){table=createTable(),$(".toggle-column").click(function(e){e.preventDefault();var a=table.column($(this).attr("data-column"));a.visible(!a.visible())}),$(".toggle-column-default").click(function(e){e.preventDefault(),table.column(colName).visible(!0),table.column(colRoles).visible(!1),table.column(colLoot).visible(!0),table.column(colWishlist).visible(!0),table.column(colRecipes).visible(!1),table.column(colNotes).visible(!0)}),table.on("column-visibility.dt",function(e,a,t,n){makeWowheadLinks(),addClippedItemHandlers(),trackTimestamps()}),$(".js-show-all-clipped-items").click(function(){allItemsVisible?($(".js-clipped-item").hide(),$(".js-show-clipped-items").show(),$(".js-hide-clipped-items").hide(),allItemsVisible=!1):($(".js-clipped-item").show(),$(".js-show-clipped-items").hide(),$(".js-hide-clipped-items").show(),allItemsVisible=!0)}),addClippedItemHandlers(),trackTimestamps()});
