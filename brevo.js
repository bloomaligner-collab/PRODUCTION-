// Cedarwings SAS — Shared Brevo Notification Utility
// Include in any page that needs to send notifications
// Usage: await CW_Notify.sendEmail(to, name, subject, html, type)

import{createClient}from"https://esm.sh/@supabase/supabase-js@2"
import{SUPABASE_CONFIG}from"./config.js"
const _sb=createClient(SUPABASE_CONFIG.url,SUPABASE_CONFIG.anonKey)

async function _getSettings(){
  const{data}=await _sb.from("system_settings").select("key,value")
  const m={};(data||[]).forEach(r=>m[r.key]=r.value);return m
}

export const CW_Notify={
  async sendEmail(toEmail,toName,subject,htmlContent,type="system"){
    const s=await _getSettings()
    if(!s.brevo_api_key||!s.brevo_sender_email)return{ok:false,error:"Brevo not configured"}
    try{
      const r=await fetch("https://api.brevo.com/v3/smtp/email",{
        method:"POST",
        headers:{"api-key":s.brevo_api_key,"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify({sender:{name:s.brevo_sender_name||"Cedarwings SAS",email:s.brevo_sender_email},to:[{email:toEmail,name:toName}],subject,htmlContent})
      })
      const d=await r.json()
      await _sb.from("notification_log").insert([{type,channel:"email",recipient:toEmail,subject,message:htmlContent.replace(/<[^>]+>/g,"").slice(0,200),status:r.ok?"sent":"failed",error_msg:r.ok?null:JSON.stringify(d)}])
      return{ok:r.ok,data:d}
    }catch(e){
      await _sb.from("notification_log").insert([{type,channel:"email",recipient:toEmail,subject,status:"failed",error_msg:e.message}])
      return{ok:false,error:e.message}
    }
  },

  async sendWhatsApp(phone,message,type="system"){
    const s=await _getSettings()
    if(!s.brevo_api_key)return{ok:false,error:"Brevo not configured"}
    try{
      const r=await fetch("https://api.brevo.com/v3/whatsapp/sendMessage",{
        method:"POST",
        headers:{"api-key":s.brevo_api_key,"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify({receiverNumber:phone,type:"text",text:{body:message}})
      })
      const d=await r.json()
      await _sb.from("notification_log").insert([{type,channel:"whatsapp",recipient:phone,message:message.slice(0,200),status:r.ok?"sent":"failed",error_msg:r.ok?null:JSON.stringify(d)}])
      return{ok:r.ok,data:d}
    }catch(e){return{ok:false,error:e.message}}
  },

  async notifyAll(subject,htmlMsg,textMsg,type){
    const{data:rs}=await _sb.from("notification_settings").select("*").eq("is_active",true)
    if(!rs?.length)return
    for(const r of rs){
      if(r.email)await this.sendEmail(r.email,r.employee_name||r.name,subject,htmlMsg,type)
      if(r.whatsapp_phone)await this.sendWhatsApp(r.whatsapp_phone,textMsg,type)
    }
  }
}
