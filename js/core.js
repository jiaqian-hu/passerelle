(function(root){
 'use strict';
 const kinds=['item','storage','request'];
 const isDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
 function validateListing(x){
  if(!kinds.includes(x.kind)||typeof x.title!=='string'||!x.title.trim()||x.title.length>90||typeof x.description!=='string'||!x.description.trim()||x.description.length>2000||typeof x.area!=='string'||!x.area.trim()||x.area.length>60||!Number.isInteger(x.price)||x.price<0||x.price>10000000)throw Error('required');
  if(!isDate(x.start)||!isDate(x.end)||x.end<x.start)throw Error('dateError');
  if(x.image&&(!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(x.image)||x.image.length>1450000))throw Error('imageError');
  return {kind:x.kind,title:x.title.trim(),description:x.description.trim(),area:x.area.trim(),price:x.price,start:x.start,end:x.end,image:x.image||''};
 }
 function quote(listing,host,rate){let base=listing.price,storage=host?.price||0;return {base,storage,fee:Math.round((base+storage)*rate),total:base+storage+Math.round((base+storage)*rate)};}
 function validateBooking(listing,host,date,actor){
  if(!listing||listing.status!=='active')throw Error('conflict');
  if(listing.owner===actor)throw Error('own');
  if(!isDate(date)||date<listing.start)throw Error('badPickup');
  if(listing.kind!=='item'&&date>listing.end)throw Error('badPickup');
  if(listing.kind==='item'&&date>listing.end){if(!host)throw Error('needHost');if(host.kind!=='storage'||host.status!=='active'||host.owner===actor||host.id===listing.id||host.start>listing.end||host.end<date)throw Error('noHosts');}
  else if(host)throw Error('badPickup');
  return true;
 }
 const api={validateListing,quote,validateBooking,isDate};root.PASSERELLE_CORE=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
