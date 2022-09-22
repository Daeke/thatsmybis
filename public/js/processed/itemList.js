var table=null,colSource=0,colName=1,colPrios=2,colWishlist=3,colReceived=4,colNotes=5,colPriority=6,lastSource=null,offspecVisible=!0,itemListHandlersTimeout=null;function createTable(){return itemTable=$("#itemTable").DataTable({autoWidth:!1,data:items,oLanguage:{sSearch:"<abbr title='Fuzzy searching is ON. To search exact text, wrap your search in \"quotes\"'>Search</abbr>"},columns:[{title:'<span class="fas fa-fw fa-skull-crossbones"></span> '.concat(headerBoss),data:"",render:function render(t,e,a){return'\n                    <ul class="no-bullet no-indent mb-0">\n                        '.concat(a.source_name?'\n                            <li>\n                                <span class="font-weight-bold">\n                                    '.concat(a.source_name,"\n                                </span>\n                            </li>"):"","\n                    </ul>")},visible:!0,width:"130px",className:"text-right width-130"},{title:'<span class="fas fa-fw fa-sack text-success"></span> '.concat(headerLoot,' <span class="text-muted small">(').concat(items.length,")</span>"),data:"",render:function render(t,e,a){return getItemLink(a)},visible:!0,width:"330px",className:"width-330"},{title:'<span class="fas fa-fw fa-sort-amount-down text-gold"></span> '.concat(headerPrios),data:"priod_characters",render:function render(t,e,a){return t&&t.length?createCharacterListHtml(t,"prio",a.item_id,null):"—"},orderable:!1,visible:!!showPrios,width:"300px",className:"width-300"},{title:'<span class="text-legendary fas fa-fw fa-scroll-old"></span> '.concat(headerWishlist),data:"wishlist_characters",render:function render(t,e,a){if(t&&t.length){var n="";if(currentWishlistNumber){var s=t.filter(function(t){return t.pivot.list_number==currentWishlistNumber});s.length&&(n=createCharacterListHtml(s,"wishlist",a.item_id,null))}else for(i=1;i<=maxWishlistLists;i++){var c=t.filter(function(t){return t.pivot.list_number==i});if(c.length){var l=null;l=wishlistNames&&wishlistNames[i-1]?wishlistNames[i-1]:headerWishlist+" "+i,n+=createCharacterListHtml(c,"wishlist",a.item_id,l)}}return""==n&&(n="—"),n}return"—"},orderable:!1,visible:!!showWishlist,width:"400px",className:"width-400"},{title:'<span class="text-success fas fa-fw fa-sack"></span> '.concat(headerReceived),data:"received_and_recipe_characters",render:function render(t,e,a){return t&&t.length?createCharacterListHtml(t,"received",a.item_id,null):"—"},orderable:!1,visible:!0,width:"300px",className:"width-300"},{title:'<span class="fas fa-fw fa-comment-alt-lines"></span> '.concat(headerNotes),data:"guild_note",render:function render(t,e,a){return getNotes(a,t)},orderable:!1,visible:!!showNotes,width:"200px",className:"width-200"},{title:'<span class="fas fa-fw fa-comment-alt-lines"></span> '.concat(headerPrioNotes),data:"guild_priority",render:function render(t,e,a){return t?'<span class="js-markdown-inline">'.concat(nl2br(t),"</span>"):"—"},orderable:!1,visible:!!showNotes,width:"200px",className:"width-200"}],order:[],paging:!1,fixedHeader:!0,drawCallback:function drawCallback(){callItemListHandlers()},initComplete:function initComplete(){callItemListHandlers()},createdRow:function createdRow(t,e,a){0!=a&&null!=lastSource||(lastSource=e.source_name),e.source_name!=lastSource&&($(t).addClass("top-border padded-anchor"),$(t).attr("id",e.source_slug?e.source_slug.trim():null),lastSource=e.source_name)}}),itemTable}function addWishlistFilterHandlers(){$("#wishlist_filter").on("change",function(){currentWishlistNumber=$(this).val(),itemTable.rows().invalidate().draw()}).change()}function createCharacterListHtml(t,e,a){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,n='<ul class="list-inline js-item-list mb-0" data-type="'.concat(e,'" data-id="').concat(a,'">');i&&(n+='<li class="js-item-wishlist-character no-bullet font-weight-bold text-muted small">\n            '.concat(i,"\n        </li>"));var s=4,c=null;return $.each(t,function(t,a){var i=null;if(guild.is_attendance_hidden||(i=guildCharacters.find(function(t){return t.id==a.id})),"prio"==e&&a.pivot.raid_group_id&&a.pivot.raid_group_id!=c){c=a.pivot.raid_group_id;var s="";if(raidGroups.length){var l=raidGroups.find(function(t){return t.id===a.pivot.raid_group_id});l&&(s=l.name)}n+='\n                <li data-raid-group-id="" class="js-item-wishlist-character no-bullet font-weight-normal text-muted small">\n                    '.concat(s,"\n                </li>\n            ")}if("wishlist"==e&&(a.raid_group_id&&a.raid_group_id!=c||!a.raid_group_id&&c)){var r="";if(!a.raid_group_id&&c)r="no raid group",c=null;else if(c=a.raid_group_id,raidGroups.length){var o=raidGroups.find(function(t){return t.id===a.raid_group_id});o&&(r=o.name)}n+='\n                <li data-raid-group-id="" class="js-item-wishlist-character no-bullet font-weight-normal text-muted small">\n                    '.concat(r,"\n                </li>\n            ")}n+='\n            <li data-raid-group-id="'.concat("prio"==e?a.pivot.raid_group_id:a.raid_group_id,'"\n                data-offspec="').concat(a.pivot.is_offspec?1:0,'"\n                value="').concat("prio"==e?a.pivot.order:"",'"\n                class="js-item-wishlist-character list-inline-item font-weight-normal mb-1 mr-0 ').concat("received"!=a.pivot.type&&a.pivot.received_at?"font-strikethrough":"",'">\n                <span class="tag text-muted d-inline">\n                    <a href="/').concat(guild.id,"/").concat(guild.slug,"/c/").concat(a.id,"/").concat(a.slug,'"\n                        title="').concat(a.raid_group_name?a.raid_group_name+" -":""," ").concat(a.level?a.level:""," ").concat(a.race?a.race:""," ").concat(a.spec?a.spec:""," ").concat(a.class?a.class:""," ").concat(a.raid_count?"(".concat(a.raid_count," raid").concat(a.raid_count>1?"s":""," attended)"):""," ").concat(a.username?"("+a.username+")":"",'"\n                        class="text-muted">\n                        <span class="">').concat("received"!==e&&a.pivot.order?a.pivot.order:"",'</span>\n                        <span class="small font-weight-bold">').concat(a.pivot.is_offspec?"OS":"",'</span>\n                        <span class="role-circle" style="background-color:').concat(getColorFromDec(a.raid_group_color),'"></span>\n                        <span class="text-').concat(a.class?slug(a.class):"",'-important">').concat(a.name,"</span>\n                        ").concat(a.is_alt?'\n                            <span class="text-warning">'.concat(localeAlt,"</span>\n                        "):"","\n                        ").concat("received"!==e&&i&&(i.attendance_percentage||i.raid_count)?"".concat(i.raid_count&&"number"==typeof i.attendance_percentage?'<span title="attendance" class="smaller '.concat(getAttendanceColor(i.attendance_percentage),'">').concat(Math.round(100*i.attendance_percentage),"%</span>"):"").concat(i.raid_count?'<span class="smaller"> '.concat(i.raid_count,"r</span>"):"","\n                        "):"",'\n                    </a>\n                    <span class="js-watchable-timestamp js-timestamp-title smaller"\n                        data-timestamp="').concat(a.pivot.created_at,'"\n                        data-is-short="1">\n                    </span>\n                    <span style="display:none;">').concat(a.discord_username," ").concat(a.username,"</span>\n                    ").concat(a.pivot.note?'<span class="smaller text-muted text-underline" title="'.concat(a.pivot.note,'">note</span>'):"","\n                </span>\n            </li>")}),n+="</ul>"}function getNotes(t,e){var a=null,i="guild_officer_note"in t?t.guild_officer_note:null;return e=e||i?'<span class="js-markdown-inline">'.concat(e?DOMPurify.sanitize(nl2br(e)):"","</span>\n            ").concat(i?'<br><small class="font-weight-bold font-italic text-gold">Officer\'s Note</small><br><span class="js-markdown-inline">'.concat(DOMPurify.sanitize(nl2br(i)),"</span>"):"","\n            ").concat(""):"—"}function getItemLink(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,a='data-wowhead-link="https://'.concat(wowheadLocale+wowheadSubdomain,".wowhead.com/item=").concat(t.item_id,'"\n    data-wowhead="item=').concat(t.item_id,"?domain=").concat(wowheadLocale+wowheadSubdomain,'"');e&&(a+=' data-wh-icon-size="'.concat(e,'"'));var i="";return i=guild?"/".concat(guild.id,"/").concat(guild.slug,"/i/").concat(t.item_id,"/").concat(slug(t.name)):"",'\n    <ul class="no-bullet no-indent mb-0">\n        <li>\n            '.concat(guild.tier_mode?'<span class="text-monospace font-weight-medium text-tier-'.concat(t.guild_tier?t.guild_tier:"",'">').concat(t.guild_tier?getItemTierLabel(t,guild.tier_mode):"&nbsp;","</span>"):"",'\n            <a href="').concat(i,'"\n                class="').concat(t.quality?"q"+t.quality:"",'"\n                ').concat(a,">\n                ").concat(t.name,"\n            </a>\n        </li>\n    </ul>")}function hideOffspecItems(){$("[data-offspec='1']").hide()}function callItemListHandlers(){itemListHandlersTimeout&&clearTimeout(itemListHandlersTimeout),itemListHandlersTimeout=setTimeout(function(){makeWowheadLinks(),parseMarkdown(),trackTimestamps(),addTooltips()},500)}function showOffspecItems(){$("[data-offspec='1']").show()}$(document).ready(function(){table=createTable(),$(".toggle-column").click(function(t){t.preventDefault();var e=table.column($(this).attr("data-column"));e.visible(!e.visible())}),$(".toggle-column-default").click(function(t){t.preventDefault(),table.column(colName).visible(!0),table.column(colPrios).visible(!0),table.column(colWishlist).visible(!0),table.column(colReceived).visible(!0),table.column(colNotes).visible(!0),table.column(colPriority).visible(!0)}),table.on("column-visibility.dt",function(t,e,a,i){callItemListHandlers()}),$("#raid_group_filter").on("change",function(){var t=$(this).val();t?($(".js-item-wishlist-character[data-raid-group-id!='"+t+"']").hide(),$(".js-item-wishlist-character[data-raid-group-id='"+t+"']").show()):$(".js-item-wishlist-character").show()}).change(),$(".js-hide-offspec-items").click(function(){offspecVisible?(offspecVisible=!1,hideOffspecItems()):(offspecVisible=!0,showOffspecItems())}),addWishlistFilterHandlers(),$(".loadingBarContainer").removeClass("d-flex").hide(),$("#itemDatatable").show(),callItemListHandlers()});
