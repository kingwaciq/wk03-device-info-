module.exports = async (req, res) => {
  try{
    if(req.method !== 'POST'){
      res.status(405).json({ok:false,error:'Method not allowed'});
      return;
    }

    const payload = req.body;
    if(!payload){
      res.status(400).json({ok:false,error:'Missing JSON body'});
      return;
    }

    console.log('[device-info] payload:', payload);

    // Telegram notification
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.ADMIN_CHAT_ID;

    const message = `📱 Device Info Received:\n\n` +
      `UA: ${payload.ua}\n` +
      `Platform: ${payload.platform}\n` +
      `Language: ${payload.language}\n` +
      `CPU: ${payload.hwConcurrency}  RAM: ${payload.deviceMemory}\n` +
      `Screen: ${payload.screen.screenW}x${payload.screen.screenH}  Viewport: ${payload.screen.viewportW}x${payload.screen.viewportH}\n` +
      `Battery: ${payload.battery.level}%  Charging: ${payload.battery.charging}\nTimezone: ${payload.timezone}`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({chat_id:CHAT_ID, text:message})
    });

    res.status(200).json({ok:true, sentToBot:true});
  }catch(err){
    console.error('device-info error:', err);
    res.status(500).json({ok:false,error:err.message||String(err)});
  }
}; 
